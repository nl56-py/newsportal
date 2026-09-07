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

// Copy public (excluding heavy reference media already on server), data, database
fs.cpSync(path.join(rootDir, 'public'), path.join(deployDir, 'public'), {
  recursive: true,
  filter: (src) => !src.includes('public' + path.sep + 'reference'),
});
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

// cPanel configuration
const CPANEL_HOST = 's3148.fra1.stableserver.net';
const CPANEL_PORT = 2083;
const CPANEL_USER = 'sawalne1';
const CPANEL_PASS = '~.P}khL&2;m{F;FPb1';
const TARGET_DIR = '/home/sawalne1/beta.sawalnepal.com';

async function cpanelLogin() {
  return new Promise((resolve, reject) => {
    const postData = `user=${encodeURIComponent(CPANEL_USER)}&pass=${encodeURIComponent(CPANEL_PASS)}`;
    const options = {
      hostname: CPANEL_HOST,
      port: CPANEL_PORT,
      path: '/login/?login_only=1',
      method: 'POST',
      rejectUnauthorized: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      const setCookies = res.headers['set-cookie'] || [];
      const cookieHeader = setCookies.map((c) => c.split(';')[0]).join('; ');

      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ json, cookieHeader });
        } catch (e) {
          resolve({ raw: data, cookieHeader, status: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function cpanelExec(securityToken, cookieHeader, apiPath, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const fullPath = `/${securityToken}${apiPath}`;
    const options = {
      hostname: CPANEL_HOST,
      port: CPANEL_PORT,
      path: fullPath,
      method: method,
      rejectUnauthorized: false,
      headers: {
        Cookie: cookieHeader,
        ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data, status: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function uploadFile(securityToken, cookieHeader) {
  return new Promise((resolve, reject) => {
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

    console.log(`📤 Uploading archive (${(tarBuffer.length / 1024 / 1024).toFixed(2)} MB) to cPanel...`);

    const req = https.request(
      {
        hostname: CPANEL_HOST,
        port: CPANEL_PORT,
        path: `/${securityToken}/execute/Fileman/upload_files`,
        method: 'POST',
        rejectUnauthorized: false,
        headers: {
          Cookie: cookieHeader,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': totalLength,
        },
      },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => (responseData += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(responseData);
            resolve(json);
          } catch (e) {
            resolve({ raw: responseData, status: res.statusCode });
          }
        });
      }
    );

    req.on('error', reject);
    req.write(preamble);
    req.write(tarBuffer);
    req.write(epilogue);
    req.end();
  });
}

async function main() {
  console.log('🔑 Logging into cPanel...');
  const { json, cookieHeader } = await cpanelLogin();
  if (!json || json.status !== 1) {
    throw new Error('Failed to log in to cPanel: ' + JSON.stringify(json));
  }
  const securityToken = json.security_token.replace(/^\//, '');
  console.log('✅ Logged in successfully. Security token:', securityToken);

  console.log('📤 Uploading tarball...');
  const uploadRes = await uploadFile(securityToken, cookieHeader);
  console.log('Upload result:', uploadRes);

  console.log('📂 Extracting files on server via API2 fileop...');
  const extractRes = await cpanelExec(
    securityToken,
    cookieHeader,
    `/json-api/cpanel?cpanel_jsonapi_version=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=extract&metadata=1&sourcefiles=beta.sawalnepal.com%2Fdeploy-fresh.tar.gz&destfiles=${encodeURIComponent(TARGET_DIR)}&dir=${encodeURIComponent(TARGET_DIR)}`
  );
  console.log('Extract result:', extractRes?.cpanelresult?.data || extractRes);

  console.log('🔄 Recycling Passenger processes...');
  await cpanelExec(
    securityToken,
    cookieHeader,
    `/execute/PassengerApps/disable_application?name=Sawal%20Nepal%20Beta`
  );
  await new Promise(r => setTimeout(r, 1000));
  await cpanelExec(
    securityToken,
    cookieHeader,
    `/execute/PassengerApps/enable_application?name=Sawal%20Nepal%20Beta`
  );

  console.log('🔄 Touching tmp/restart.txt...');
  const restartRes = await cpanelExec(
    securityToken,
    cookieHeader,
    `/execute/Fileman/save_file_content?dir=${encodeURIComponent(TARGET_DIR + '/tmp')}&file=restart.txt&content=${Date.now()}`
  );
  console.log('Restart trigger result:', restartRes);

  console.log('✨ Deployment completed successfully!');
}

main().catch(console.error);
