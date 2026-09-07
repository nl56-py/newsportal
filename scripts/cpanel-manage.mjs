import https from 'https';

const CPANEL_HOST = 's3148.fra1.stableserver.net';
const CPANEL_PORT = 2083;
const CPANEL_USER = 'sawalne1';
const CPANEL_PASS = '~.P}khL&2;m{F;FPb1';

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
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      const setCookies = res.headers['set-cookie'] || [];
      const cookieHeader = setCookies.map(c => c.split(';')[0]).join('; ');
      
      res.on('data', chunk => data += chunk);
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
        'Cookie': cookieHeader,
        ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) } : {})
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
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

async function main() {
  console.log('Logging in to cPanel...');
  const { json, cookieHeader } = await cpanelLogin();
  console.log('Login result:', json);
  
  if (!json || json.status !== 1) {
    console.error('Failed to log in to cPanel');
    return;
  }

  const securityToken = json.security_token.replace(/^\//, '');
  console.log('Security token:', securityToken);

  console.log('\n1. Listing files in /home/sawalne1/beta.sawalnepal.com ...');
  const list = await cpanelExec(securityToken, cookieHeader, '/execute/Fileman/list_files?dir=%2fhome%2fsawalne1%2fbeta.sawalnepal.com&show_hidden=1');
  console.log('Files:', list.data ? list.data.map(f => f.file) : list);

  console.log('\n2. Extracting deploy-fresh.tar.gz ...');
  const extractRes = await cpanelExec(securityToken, cookieHeader, '/execute/Fileman/extract_files?dir=%2fhome%2fsawalne1%2fbeta.sawalnepal.com&file=deploy-fresh.tar.gz');
  console.log('Extract result:', extractRes);

  console.log('\n3. Triggering Passenger restart via tmp/restart.txt ...');
  const restartRes = await cpanelExec(securityToken, cookieHeader, '/execute/Fileman/save_file_content?dir=%2fhome%2fsawalne1%2fbeta.sawalnepal.com%2ftmp&file=restart.txt&content=' + Date.now());
  console.log('Restart result:', restartRes);
}

main().catch(console.error);
