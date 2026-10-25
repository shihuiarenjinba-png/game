'use strict';
const {app, BrowserWindow} = require('electron');
const path=require('node:path'),fs=require('node:fs');
const OUT=path.resolve('smoke-output');
async function main(){
 const w=new BrowserWindow({width:1280,height:850,show:false,webPreferences:{sandbox:true,nodeIntegration:false,contextIsolation:true}});
 w.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 await w.loadFile(path.resolve('store-entry.html'));
 const initial=await w.webContents.executeJavaScript(`document.querySelectorAll('.board').length`);
 if(initial!==7)throw Error(`Landing screen has ${initial} game tables, expected 7`);
 await fs.promises.mkdir(OUT,{recursive:true});
 await w.webContents.capturePage().then(img=>fs.promises.writeFile(path.join(OUT,'landing.png'),img.toPNG()));
 await w.loadFile(path.resolve('luck-lab.html'));
 await new Promise(r=>setTimeout(r,700));
 const state=await w.webContents.executeJavaScript(`({title:document.title,hasRush:!!document.getElementById('rushHomeV73'),hasWheel:!!document.getElementById('v75RouletteWheel'),hasSlots:!!document.getElementById('slotPlay'),hasDice:!!document.getElementById('dicePlay'),bodyText:document.body.innerText.slice(0,900)})`);
 if(!state.hasRush||!state.hasWheel||!state.hasSlots||!state.hasDice)throw Error('Missing main floor component '+JSON.stringify(state));
 await w.webContents.capturePage().then(img=>fs.promises.writeFile(path.join(OUT,'game-floor.png'),img.toPNG()));
 const saved=await w.webContents.executeJavaScript(`(()=>{localStorage.setItem('luck-lab-v85-msix-smoke','ok');return localStorage.getItem('luck-lab-v85-msix-smoke')})()`);
 if(saved!=='ok')throw Error('localStorage failed before reload');
 await w.webContents.reload();
 await new Promise(r=>setTimeout(r,450));
 const restored=await w.webContents.executeJavaScript(`localStorage.getItem('luck-lab-v85-msix-smoke')`);
 if(restored!=='ok')throw Error('localStorage failed after reload');
 await w.webContents.executeJavaScript(`localStorage.removeItem('luck-lab-v85-msix-smoke')`);
 console.log('Windows Electron smoke passed: landing 7 tables, game floor, localStorage reload, screenshots');
 w.destroy();
}
app.whenReady().then(()=>main().then(()=>app.quit(),e=>{console.error(e);app.exit(1)}));
