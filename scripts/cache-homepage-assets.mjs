import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Reproducible, local copies of the assets observed on the reference homepage.
const root = process.cwd();
const source = JSON.parse(await readFile(path.join(root, 'data/homepage-reference.json'), 'utf8'));
const observed = JSON.parse(await readFile(path.join(root, 'data/homepage-asset-sources.json'), 'utf8'));
const urls = [...new Set([...observed, ...source.sections.flatMap(s => s.articles.map(a => a.image)), ...source.provinces.flatMap(s => s.articles.map(a => a.image))])].filter(u => u.startsWith('https://') && !u.includes('lazy.png') && !u.includes('facebook.com/tr'));
const dir = path.join(root, 'public/reference');
await mkdir(dir, { recursive: true });
const assets = {};
const failed = [];
let next = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (next < urls.length) {
    const url = urls[next++];
    const ext = path.extname(new URL(url).pathname).toLowerCase() || '.png';
    const filename = createHash('sha256').update(url).digest('hex').slice(0, 16) + ext;
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(String(response.status));
      await writeFile(path.join(dir, filename), Buffer.from(await response.arrayBuffer()));
      assets[url] = '/reference/' + filename;
    } catch (error) { failed.push({ url, reason: error.message }); }
  }
}));
let css = await readFile(path.join(root, 'data/homepage-font-source.css'), 'utf8');
for (const url of [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]))]) {
  const filename = 'ek-mukta-' + createHash('sha256').update(url).digest('hex').slice(0, 12) + path.extname(new URL(url).pathname);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Font download failed: ' + response.status);
  await writeFile(path.join(dir, filename), Buffer.from(await response.arrayBuffer()));
  css = css.replaceAll(url, '/reference/' + filename);
}
await writeFile(path.join(dir, 'fonts.css'), css);
const font = await fetch('https://www.sawalnepal.com/wp-content/themes/Newssnkhabar/assets/fonts/fontawesome-webfont5b62.woff2?v=4.6.3');
if (!font.ok) throw new Error('Icon font download failed');
await writeFile(path.join(dir, 'fontawesome.woff2'), Buffer.from(await font.arrayBuffer()));
await writeFile(path.join(root, 'data/homepage-assets.json'), JSON.stringify(assets, null, 2) + '\n');
await writeFile(path.join(root, 'data/homepage-asset-failures.json'), JSON.stringify(failed, null, 2) + '\n');
console.log(JSON.stringify({ downloaded: Object.keys(assets).length, failed }, null, 2));
