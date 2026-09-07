import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const deployDir = path.join(rootDir, 'deploy-package');

console.log('🚀 Preparing fresh deploy-package...');

if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });

// Copy standalone build files EXCEPT node_modules
const standaloneDir = path.join(rootDir, '.next', 'standalone');
if (fs.existsSync(standaloneDir)) {
  const entries = fs.readdirSync(standaloneDir);
  for (const entry of entries) {
    if (entry === 'node_modules') continue;
    fs.cpSync(path.join(standaloneDir, entry), path.join(deployDir, entry), { recursive: true });
  }
}

// Copy static assets
const staticSrc = path.join(rootDir, '.next', 'static');
const staticDest = path.join(deployDir, '.next', 'static');
if (fs.existsSync(staticSrc)) {
  fs.cpSync(staticSrc, staticDest, { recursive: true });
}

// Copy public, data, database
fs.cpSync(path.join(rootDir, 'public'), path.join(deployDir, 'public'), { recursive: true });
fs.cpSync(path.join(rootDir, 'data'), path.join(deployDir, 'data'), { recursive: true });
fs.cpSync(path.join(rootDir, 'database'), path.join(deployDir, 'database'), { recursive: true });

// Copy app.js, .htaccess, package.json
fs.copyFileSync(path.join(rootDir, 'app.js'), path.join(deployDir, 'app.js'));
fs.copyFileSync(path.join(rootDir, '.htaccess'), path.join(deployDir, '.htaccess'));
fs.copyFileSync(path.join(rootDir, 'package.json'), path.join(deployDir, 'package.json'));

console.log('📦 Creating deploy-fresh.tar.gz...');
const tarFile = path.join(rootDir, 'deploy-fresh.tar.gz');
if (fs.existsSync(tarFile)) {
  fs.unlinkSync(tarFile);
}

execSync(`tar -czf "${tarFile}" -C "${deployDir}" .`, { stdio: 'inherit' });
const tarStats = fs.statSync(tarFile);
console.log(`✅ Archive created: ${(tarStats.size / 1024 / 1024).toFixed(2)} MB`);

// Upload to cPanel
const CPANEL_HOST = 's3148.fra1.stableserver.net';
const CPANEL_PORT = 2083;
const CPANEL_USER = 'sawalne1';
const CPANEL_PASS = '~.P}khL&2;m{F;FPb1';
const TARGET_DIR = '/home/sawalne1/beta.sawalnepal.com';

const tarBuffer = fs.readFileSync(tarFile);
const boundary = '----AntigravityBoundary' + Date.now();

const preamble = Buffer.from(
  `--${boundary}\r\n` +
  `Content-Disposition: form-data; name="dir"\r\n\r\n` +
  `${TARGET_DIR}\r\n` +
  `--${boundary}\r\n` +
  `Content-Disposition: form-data; name="overwrite"\r\n\r\n` +
  `1\r\n` +
  `--${boundary}\r\n` +
  `Content-Disposition: form-data; name="file-1"; filename="deploy-fresh.tar.gz"\r\n` +
  `Content-Type: application/gzip\r\n\r\n`
);

const epilogue = Buffer.from(`\r\n--${boundary}--\r\n`);
const totalLength = preamble.length + tarBuffer.length + epilogue.length;

console.log(`📤 Uploading to cPanel ${CPANEL_HOST}:${CPANEL_PORT}...`);

const auth = 'Basic ' + Buffer.from(`${CPANEL_USER}:${CPANEL_PASS}`).toString('base64');

const req = https.request({
  hostname: CPANEL_HOST,
  port: CPANEL_PORT,
  path: '/execute/Fileman/upload_files',
  method: 'POST',
  rejectUnauthorized: false,
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
      if (json.status === 1) {
        console.log('✅ Upload succeeded! Extracting...');
        extract();
      } else {
        console.error('❌ Upload failed:', json.errors);
      }
    } catch (e) {
      console.log('Upload response:', responseData);
    }
  });
});

req.on('error', (err) => {
  console.error('Request error:', err);
});

req.write(preamble);
req.write(tarBuffer);
req.write(epilogue);
req.end();

function extract() {
  const extractReq = https.request({
    hostname: CPANEL_HOST,
    port: CPANEL_PORT,
    path: `/execute/Fileman/extract_files?dir=${encodeURIComponent(TARGET_DIR)}&file=deploy-fresh.tar.gz`,
    method: 'GET',
    rejectUnauthorized: false,
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
