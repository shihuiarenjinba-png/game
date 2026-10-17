"use strict";
// Read-only forensic helper. Never rewrites source files or approved digests.
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
function inspect(root,manifestPath="scripts/v85-source-sha256.json"){
  const manifest=JSON.parse(fs.readFileSync(path.join(root,manifestPath),"utf8"));
  const records=[];
  for(const [name,expected] of Object.entries(manifest)){
    if(!/^[a-f0-9]{64}$/i.test(expected)||name.startsWith("/")||name.includes("..")||path.isAbsolute(name)){
      throw new Error("Unsafe manifest entry: "+name);
    }
    const source=path.join(root,name);
    if(!fs.existsSync(source)){records.push({file:name,status:"MISSING",expected,actual:null});continue;}
    const actual=crypto.createHash("sha256").update(fs.readFileSync(source)).digest("hex");
    records.push({file:name,status:actual===expected?"MATCH":"MISMATCH",expected,actual});
  }
  const mismatches=records.filter(x=>x.status!=="MATCH");
  return {status:mismatches.length?"HOLD_SOURCE_INTEGRITY":"SOURCE_SHA256_PASS",total:records.length,mismatches,matched:records.length-mismatches.length};
}
if(require.main===module){
  try{
    const report=inspect(process.cwd());
    process.stdout.write(JSON.stringify(report,null,2)+"\n");
    if(report.mismatches.length){
      console.error("HOLD: original-source digests do not match. Locate the original verified archive; do NOT update the manifest merely to pass CI.");
      process.exitCode=1;
    }
  }catch(error){console.error("HOLD: "+error.message);process.exitCode=2;}
}
module.exports={inspect};
