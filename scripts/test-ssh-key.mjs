import { Client } from 'ssh2';
import fs from 'fs';
import path from 'path';

const host = '103.138.189.98';
const username = 'sawalne1';
const privateKeyPath = path.join(process.env.USERPROFILE || 'C:\\Users\\Dell', '.ssh', 'id_ed25519');

if (fs.existsSync(privateKeyPath)) {
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const conn = new Client();
  conn.on('ready', () => {
    console.log('✓ SSH Key Authentication SUCCEEDED!');
    conn.exec('whoami; pwd; node -v', (err, stream) => {
      let out = '';
      stream.on('data', (d) => { out += d; });
      stream.on('close', () => {
        console.log('Output:\n' + out.trim());
        conn.end();
      });
    });
  }).on('error', (err) => {
    console.log('SSH Key Auth error:', err.message);
  }).connect({
    host,
    port: 22,
    username,
    privateKey,
    readyTimeout: 10000,
  });
} else {
  console.log('Private key not found at:', privateKeyPath);
}
