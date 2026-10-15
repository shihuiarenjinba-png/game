'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.cwd();
const pages=['index.html','luck-lab.html'];
let checked=0;
for (const page of pages){
 const text=fs.readFileSync(path.join(root,page),'utf8');
 assert.match(text, /LUCK LAB/);
 for(const match of text.matchAll(/(?:src|href)\s*=\s*["'](\.\/[^"']+)["']/g)){
  const target=match[1];
  if(!/\.(?:js|css|html|png|ico)$/i.test(target))continue;
  assert(fs.existsSync(path.resolve(root,path.dirname(page),target)),`Missing resource: ${page} -> ${target}`);checked++;
 }
}
const hashes=JSON.parse(fs.readFileSync('scripts/v85-source-sha256.json','utf8'));
const crypto=require('node:crypto');
for(const [f,expected] of Object.entries(hashes)) {
 const actual=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex');
 assert.equal(actual,expected,`v85 original game source modified or missing: ${f}`);
}
const p=JSON.parse(fs.readFileSync('package.json','utf8'));
assert.equal(p.version,'0.85.0');
for(const f of ['luck-baccarat-v82.js','luck-chinchiro-v77.js','luck-dealer-v81.js','luck-story-v85.js','luck-bank-v82.js','desktop/main.cjs'])assert(fs.existsSync(f),f);
console.log(`PASS: ${checked} local assets, ${Object.keys(hashes).length} original source SHA-256s, 7-table modules + metadata`);
