"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path"),crypto=require("node:crypto");
const {inspect}=require("../scripts/integrity-report.cjs");
test("integrity helper passes only unmodified authentic content",()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),"lucklab-integrity-"));
  try{
    fs.mkdirSync(path.join(root,"scripts"));
    fs.writeFileSync(path.join(root,"source.js"),"ORIGINAL");
    const original=crypto.createHash("sha256").update("ORIGINAL").digest("hex");
    fs.writeFileSync(path.join(root,"scripts/v85-source-sha256.json"),JSON.stringify({"source.js":original}));
    const good=inspect(root);assert.equal(good.status,"SOURCE_SHA256_PASS");
    fs.writeFileSync(path.join(root,"source.js"),"MODIFIED");
    const bad=inspect(root);assert.equal(bad.status,"HOLD_SOURCE_INTEGRITY");
    assert.equal(bad.mismatches[0].status,"MISMATCH");
    assert.equal(bad.mismatches[0].expected,original,"expected digest must not be mutated");
    assert.notEqual(bad.mismatches[0].actual,original);
    assert.equal(fs.readFileSync(path.join(root,"scripts/v85-source-sha256.json"),"utf8"),JSON.stringify({"source.js":original}));
    fs.unlinkSync(path.join(root,"source.js"));
    assert.equal(inspect(root).mismatches[0].status,"MISSING");
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test("integrity helper refuses unsafe paths",()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),"lucklab-integrity-"));
  try{
    fs.mkdirSync(path.join(root,"scripts"));
    fs.writeFileSync(path.join(root,"scripts/v85-source-sha256.json"),JSON.stringify({"../secret.txt":"0".repeat(64)}));
    assert.throws(()=>inspect(root),/Unsafe manifest entry/);
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
