"use strict";
const path=require("node:path"),{app,BrowserWindow,Menu,session}=require("electron");
const lock=app.requestSingleInstanceLock();if(!lock)app.quit();
let mainWindow=null;
app.on("second-instance",()=>{if(mainWindow){if(mainWindow.isMinimized())mainWindow.restore();mainWindow.focus()}});
app.whenReady().then(()=>{
 session.defaultSession.setPermissionRequestHandler((_w,_p,respond)=>respond(false));
 session.defaultSession.setPermissionCheckHandler(()=>false);
 session.defaultSession.webRequest.onBeforeRequest((details,respond)=>respond({cancel:/^(https?|wss?):/i.test(details.url)}));
 Menu.setApplicationMenu(null);
 mainWindow=new BrowserWindow({title:"LUCK LAB — バーチャルアーケード",width:1280,height:850,minWidth:740,minHeight:550,show:false,backgroundColor:"#071820",webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,devTools:false}});
 mainWindow.webContents.setWindowOpenHandler(()=>({action:"deny"}));
 mainWindow.webContents.on("will-navigate",(e,url)=>{if(url!==mainWindow.webContents.getURL())e.preventDefault()});
 mainWindow.webContents.on("will-attach-webview",e=>e.preventDefault());
 mainWindow.once("ready-to-show",()=>mainWindow.show());
 mainWindow.loadFile(path.join(__dirname,"..","index.html")).catch(e=>{console.error(e);app.exit(1)});
});
app.on("window-all-closed",()=>app.quit());
