"use strict";
const {app,BrowserWindow}=require("electron"),fs=require("node:fs"),path=require("node:path"),os=require("node:os"),assert=require("node:assert/strict");
app.setPath("userData",fs.mkdtempSync(path.join(os.tmpdir(),"luck-lab-ci-")));
app.commandLine.appendSwitch("disable-gpu");
const out=path.join(process.cwd(),"smoke-output");fs.mkdirSync(out,{recursive:true});
let win;const runJS=code=>win.webContents.executeJavaScript(code,true);
async function click(action){const clicked=await runJS("(()=>{const b=document.querySelector('[data-action="+JSON.stringify(action)+"]');if(!b||b.disabled)return false;b.click();return true})()");assert.equal(clicked,true,"button "+action)}
async function image(name){await runJS("new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))");const png=(await win.webContents.capturePage()).toPNG();assert.ok(png.byteLength>3000,"png should be visible");fs.writeFileSync(path.join(out,name+".png"),png)}
async function testUi(){
 win=new BrowserWindow({width:1320,height:860,show:true,backgroundColor:"#071820",webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
 await win.loadFile(path.join(__dirname,"..","index.html"));
 assert.match(await runJS("document.body.innerText"),/LUCK LAB/);
 await image("01-start");
 await click("slots");
 await image("02-slots");
 await runJS("document.querySelector('[data-mode=roulette]').click()");
 await click("roulette");
 await image("03-roulette");
 await runJS("document.querySelector('[data-mode=blackjack]').click()");
 await click("blackjack");
 const pending=await runJS("Boolean(JSON.parse(localStorage.getItem('luck-lab-arcade-v1')).pending)");
 if(pending)await click("stand");
 assert.equal(await runJS("JSON.parse(localStorage.getItem('luck-lab-arcade-v1')).rounds"),3);
 await image("04-blackjack");
 win.setSize(900,700);await image("05-compact");
 let bounds=await runJS("({content:document.documentElement.scrollWidth,viewport:window.innerWidth})");
 assert.ok(bounds.content<=bounds.viewport+8,"compact content should not overflow "+JSON.stringify(bounds));
 win.webContents.setZoomFactor(1.25);await image("06-zoom125");
 bounds=await runJS("({content:document.documentElement.scrollWidth,viewport:window.innerWidth})");
 assert.ok(bounds.content<=bounds.viewport+8,"zoomed content should not overflow "+JSON.stringify(bounds));
 console.log("LUCK LAB WINDOWS GUI SMOKE PASS");
}
app.whenReady().then(testUi).then(()=>{win.close();app.quit()}).catch(e=>{console.error("LUCK LAB WINDOWS GUI SMOKE FAIL",e);app.exit(1)});
