"use strict";
// Forensics only: compares the signed-off manifest against Git HISTORY.
// Never modifies code, checksum manifests, save data, or release artifacts.
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),
 cp=require("node:child_process");
const ROOT=path.resolve(__dirname,"..");
function report(file="casino-core.js"){
 if(!/^[\w./-]+$/.test(file)||file.startsWith("/")||file.split("/").includes(".."))throw Error("Unsafe path");
 const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,"scripts/v85-source-sha256.json"),"utf8"));
 const expected=manifest[file];if(!/^[a-f0-9]{64}$/i.test(expected||""))throw Error("Missing approved digest");
 const digest=raw=>crypto.createHash("sha256").update(raw).digest("hex");
 const actual=digest(fs.readFileSync(path.join(ROOT,file)));
 const output={file,expected,actual,matched:actual===expected,origins:[]};
 const commits=cp.execFileSync("git",["log","--format=%H","--",file],{cwd:ROOT,encoding:"utf8"}).trim().split(/\r?\n/).filter(Boolean).slice(0,100);
 for(const sha of commits){
  if(!/^[0-9a-f]{40}$/.test(sha))throw Error("Unexpected git commit ref");
  const content=cp.execFileSync("git",["show",sha+":"+file],{cwd:ROOT,maxBuffer:16*1024*1024});
  const sha256=digest(content);
  output.origins.push({commit:sha,sha256,matched:sha256===expected});
 }
 output.historicalMatch=output.origins.find(x=>x.matched)?.commit||null;
 return output;
}
if(require.main===module){
 try{
  const result=report(process.argv[2]||"casino-core.js");
  process.stdout.write(JSON.stringify(result,null,2)+"\n");
  if(!result.matched||!result.historicalMatch){
   console.error("HOLD: the manifest's expected file has not been proven authentic. Do not rewrite the expected checksum.");
   process.exitCode=1;
  }
 }catch(e){console.error("HOLD: "+e.message);process.exitCode=2;}
}
module.exports={report};
