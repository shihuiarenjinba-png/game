"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {inspect}=require("../scripts/integrity-report.cjs");
const root=path.resolve(__dirname,"..");
const read=x=>fs.readFileSync(path.join(root,x),"utf8");
const banned="開発版のため販売は未開始です。";
test("v85 source SHA manifest remains intact including preserved original landing",()=>{
 const manifest=JSON.parse(read("scripts/v85-source-sha256.json"));
 assert.ok(Object.hasOwn(manifest,"index.html"));
 assert.equal(Object.keys(manifest).length,66);
 const outcome=inspect(root);
 assert.equal(outcome.status,"SOURCE_SHA256_PASS",JSON.stringify(outcome.mismatches.slice(0,4)));
 assert.equal(outcome.matched,66);
});
test("buyer landing differs from original protected source by exactly one removed status sentence",()=>{
 const original=read("index.html"),shop=read("store-entry.html");
 assert.ok(original.includes(banned));
 assert.equal(original.split(banned).length,2,"expected a unique development disclaimer");
 assert.equal(shop.replace(/\r\n/g,"\n"),original.replace(banned,"").replace(/\r\n/g,"\n"),"only CRLF/LF checkout normalization is permitted; buyer copy and layout must otherwise be identical");
 assert.doesNotMatch(shop,/開発版のため販売は未開始です/);
 assert.match(shop,/すべてゲーム内の仮想チップです/);
 assert.match(shop,/href="luck-lab.html"/);
});
test("actual Electron entry and MSIX package point at the clean buyer landing",()=>{
 const main=read("desktop/main.cjs"),config=read("scripts/prepare-msix-config.cjs");
 assert.match(main,/loadFile\(path\.join\(__dirname,'\.\.','store-entry\.html'\)\)/);
 assert.match(config,/files:\['store-entry\.html','luck-lab\.html'/);
 assert.doesNotMatch(config,/files:\['index\.html'/,"archived development index must not ship");
 assert.match(read("desktop/smoke.cjs"),/loadFile\(path\.resolve\('store-entry\.html'\)\)/);
});
