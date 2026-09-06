/**
 * Automated cPanel Upload and Extraction Script
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const CPANEL_HOST = process.env.CPANEL_HOST || 'www.sawalnepal.com';
const CPANEL_PORT = process.env.CPANEL_PORT || 2083;
const CPANEL_USER = process.env.CPANEL_USER || 'sawalne1';
const CPANEL_PASS = process.env.CPANEL_PASS || '';
const TARGET_DIR = process.env.CPANEL_TARGET_DIR || '/home/sawalne1/beta.sawalnepal.com';


const zipPath = path.join(__dirname, '..', 'deploy.zip');
const zipBuffer = fs.readFileSync(zipPath);
const zipSize = zipBuffer.length;

console.log(`Uploading deploy.zip (${(zipSize / 1024 / 1024).toFixed(2)} MB) to cPanel ${TARGET_DIR}...`);

const boundary = '----AntigravityBoundary' + Date.now();

const preamble = Buffer.from(
  `--${boundary}\r\n` +
  `Content-Disposition: form-data; name="dir"\r\n\r\n` +
  `${TARGET_DIR}\r\n` +
  `--${boundary}\r\n` +
  `Content-Disposition: form-data; name="overwrite"\r\n\r\n` +
  `1\r\n` +
  `--${boundary}\r\n` +
  `Content-Disposition: form-data; name="file-1"; filename="deploy.zip"\r\n` +
  `Content-Type: application/zip\r\n\r\n`
);

const epilogue = Buffer.from(`\r\n--${boundary}--\r\n`);
const totalLength = preamble.length + zipSize + epilogue.length;

const auth = 'Basic ' + Buffer.from(`${CPANEL_USER}:${CPANEL_PASS}`).toString('base64');

const req = https.request({
  hostname: CPANEL_HOST,
  port: CPANEL_PORT,
  path: '/execute/Fileman/upload_files',
  method: 'POST',
  headers: {
    'Authorization': auth,
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': totalLength,
  }
}, (res) => {
  let responseData = '';
  res.on('data', chunk => responseData += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(responseData);
      console.log('Upload response:', JSON.stringify(json, null, 2));

      if (json.status === 1) {
        console.log('✅ Upload succeeded! Extracting archive...');
        extractArchive();
      } else {
        console.error('❌ Upload failed:', json.errors);
      }
    } catch (e) {
      console.error('Raw response:', responseData);
    }
  });
});

req.on('error', (err) => {
  console.error('Request error:', err);
});

req.write(preamble);
req.write(zipBuffer);
req.write(epilogue);
req.end();

function extractArchive() {
  const extractReq = https.request({
    hostname: CPANEL_HOST,
    port: CPANEL_PORT,
    path: `/execute/Fileman/extract_files?dir=${encodeURIComponent(TARGET_DIR)}&file=deploy.zip`,
    method: 'GET',
    headers: {
      'Authorization': auth,
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Extraction response:', data);
    });
  });
  extractReq.on('error', console.error);
  extractReq.end();
}
