import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

// Run against an already-running preview: node scripts/check-homepage.mjs [URL]
const base = process.argv[2] || 'http://localhost:3001';
const root = process.cwd();
const reference = JSON.parse(await readFile(path.join(root, 'data/homepage-reference.json'), 'utf8'));
const assets = JSON.parse(await readFile(path.join(root, 'data/homepage-assets.json'), 'utf8'));
assert.equal(reference.sections.length, 17);
assert.equal(reference.provinces.length, 8);
await Promise.all(Object.values(assets).map(file => access(path.join(root, 'public', file))));

async function page(route) {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 200, `${route}: expected HTTP 200`);
  return response.text();
}

const home = await page('/');
assert.equal((home.match(/class="sn-section-heading"/g) || []).length, 17);
assert.equal((home.match(/<h1(?:\s|>)/g) || []).length, 1);
for (const section of reference.sections) assert.ok(home.includes(section.title), section.title);
await page('/category/economy');
await page('/unicode');
assert.ok((await page('/search?s=' + encodeURIComponent('दमक'))).includes('सामग्री फेला परे'));
const futureSearch = await page('/search?from=2030-01-01&to=2030-01-31');
assert.ok(futureSearch.includes('कुनै नतिजा भेटिएन'), 'Date-only search must show its empty result state');
console.log(`PASS: 17 homepage sections, 8 province datasets, ${Object.keys(assets).length} cached assets, one H1, category/Unicode routes, keyword and date-only searches.`);
