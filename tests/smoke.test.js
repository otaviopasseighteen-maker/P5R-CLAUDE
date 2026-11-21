
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/game-data.json'), 'utf8'));
const counts = { characters: 10, confidants: 23, palaces: 9, mechanics: 6, ost: 10, quotes: 12, updates: 5 };
for (const [key, count] of Object.entries(counts)) {
  assert.ok(Array.isArray(data[key]), `${key} must be an array`);
  assert.equal(data[key].length, count, `${key} count changed; update README and test intentionally`);
  const ids = data[key].filter(item => item.id).map(item => item.id);
  assert.equal(new Set(ids).size, ids.length, `${key} has duplicate IDs`);
}
for (const item of data.characters) assert.ok(item.name && item.id);
for (const item of data.confidants) assert.ok(item.name && item.arcana && item.id);
for (const item of data.ost) assert.ok(item.title && item.composer && item.category);
const htmlFiles = ['index.html', ...fs.readdirSync(path.join(root, 'pages')).filter(f => f.endsWith('.html')).map(f => `pages/${f}`)];
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const base = path.dirname(path.join(root, file));
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) continue;
    const local = raw.split(/[?#]/)[0];
    if (local) assert.ok(fs.existsSync(path.resolve(base, local)), `${file} missing local reference: ${raw}`);
  }
}
console.log('Smoke tests passed: data, unique IDs, and local HTML references.');
