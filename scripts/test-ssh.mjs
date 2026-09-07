import { Client } from 'ssh2';

const host = '103.138.189.98';
const usernames = ['sawalne1', 'sawalnepal', 'sawalnep', 'root'];
const password = 'jH7UBULId%jyEM;p';

async function testUser(u) {
  return new Promise((resolve) => {
    const conn = new Client();
    conn.on('ready', () => {
      console.log(`✓ SSH Authentication SUCCEEDED for user: ${u}!`);
      conn.exec('whoami; pwd; ls -la', (err, stream) => {
        let out = '';
        stream.on('data', (d) => { out += d; });
        stream.on('close', () => {
          console.log(`Output for ${u}:\n` + out.trim());
          conn.end();
          resolve(true);
        });
      });
    }).on('error', (err) => {
      console.log(`SSH failed for ${u}: ${err.message}`);
      resolve(false);
    }).connect({
      host,
      port: 22,
      username: u,
      password,
      readyTimeout: 8000,
    });
  });
}

for (const u of usernames) {
  console.log(`Testing user: ${u}...`);
  const ok = await testUser(u);
  if (ok) break;
}
