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

async function cpanelExec(securityToken, cookieHeader, apiPath) {
  return new Promise((resolve, reject) => {
    const fullPath = `/${securityToken}${apiPath}`;
    const options = {
      hostname: CPANEL_HOST,
      port: CPANEL_PORT,
      path: fullPath,
      method: 'GET',
      rejectUnauthorized: false,
      headers: {
        'Cookie': cookieHeader
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
    req.end();
  });
}

async function main() {
  const { json, cookieHeader } = await cpanelLogin();
  const securityToken = json.security_token.replace(/^\//, '');

  console.log('Reading stderr.log ...');
  const errLog = await cpanelExec(securityToken, cookieHeader, '/execute/Fileman/get_file_content?dir=%2fhome%2fsawalne1%2fbeta.sawalnepal.com&file=stderr.log');
  console.log('stderr.log content:', errLog.data ? errLog.data.content : errLog);

  console.log('\nChecking .htaccess ...');
  const htaccess = await cpanelExec(securityToken, cookieHeader, '/execute/Fileman/get_file_content?dir=%2fhome%2fsawalne1%2fbeta.sawalnepal.com&file=.htaccess');
  console.log('.htaccess content:\n', htaccess.data ? htaccess.data.content : htaccess);
}

main().catch(console.error);
