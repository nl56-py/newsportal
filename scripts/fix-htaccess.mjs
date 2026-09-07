import https from 'https';

const CPANEL_HOST = 's3148.fra1.stableserver.net';
const CPANEL_PORT = 2083;
const CPANEL_USER = 'sawalne1';
const CPANEL_PASS = '~.P}khL&2;m{F;FPb1';

const htaccessContent = `# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home/sawalne1/beta.sawalnepal.com"
PassengerBaseURI "/"
PassengerNodejs "/home/sawalne1/nodevenv/beta.sawalnepal.com/20/bin/node"
PassengerAppType node
PassengerStartupFile app.js
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END
# DO NOT REMOVE OR MODIFY. CLOUDLINUX ENV VARS CONFIGURATION BEGIN
<IfModule Litespeed>
SetEnv PORT 3000
SetEnv NODE_ENV production
SetEnv DB_HOST localhost
SetEnv DB_NAME sawalne1_db1
SetEnv DB_USER sawalne1_db1
SetEnv DB_PASSWORD Damak123@#
SetEnv DB_PREFIX YVbSX5aUsA_
SetEnv NEXT_PUBLIC_SITE_URL https://beta.sawalnepal.com
</IfModule>
# DO NOT REMOVE OR MODIFY. CLOUDLINUX ENV VARS CONFIGURATION END

# 2. HTTPS Force Redirection
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} !=on
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# 3. LiteSpeed & Apache Static Asset Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/javascript "access plus 1 year"
    ExpiresByType application/x-javascript "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
</IfModule>

# 4. Cache-Control Header Optimization
<IfModule mod_headers.c>
    <FilesMatch "\\.(js|css|woff2|woff|webp|png|jpg|jpeg|svg|ico)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    <FilesMatch "\\.(html|php|json)$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires 0
    </FilesMatch>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# 5. Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css text/javascript application/xml application/xhtml+xml application/rss+xml application/javascript application/x-javascript application/json application/ld+json image/svg+xml
</IfModule>

Options -Indexes
`;

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

async function cpanelSaveFile(securityToken, cookieHeader, dir, file, content) {
  return new Promise((resolve, reject) => {
    const postBody = `dir=${encodeURIComponent(dir)}&file=${encodeURIComponent(file)}&content=${encodeURIComponent(content)}`;
    const options = {
      hostname: CPANEL_HOST,
      port: CPANEL_PORT,
      path: `/${securityToken}/execute/Fileman/save_file_content`,
      method: 'POST',
      rejectUnauthorized: false,
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postBody)
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
    req.write(postBody);
    req.end();
  });
}

async function main() {
  const { json, cookieHeader } = await cpanelLogin();
  const securityToken = json.security_token.replace(/^\//, '');

  console.log('Writing correct .htaccess with CloudLinux Node 20 directives ...');
  const saveRes = await cpanelSaveFile(securityToken, cookieHeader, '/home/sawalne1/beta.sawalnepal.com', '.htaccess', htaccessContent);
  console.log('Save .htaccess result:', saveRes);

  console.log('Triggering restart via tmp/restart.txt ...');
  const restartRes = await cpanelSaveFile(securityToken, cookieHeader, '/home/sawalne1/beta.sawalnepal.com/tmp', 'restart.txt', String(Date.now()));
  console.log('Restart result:', restartRes);
}

main().catch(console.error);
