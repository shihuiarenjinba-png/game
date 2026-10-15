'use strict';
const {app, BrowserWindow} = require('electron');
const {fileURLToPath} = require('node:url');
const path = require('node:path');

// Offline, file-only Electron host. No Node APIs in renderer and no external navigation.
function createWindow(){
  const win=new BrowserWindow({
    width:1200,height:860,minWidth:320,minHeight:550,
    show:false,backgroundColor:'#101d20',title:'LUCK LAB',
    autoHideMenuBar:true,
    webPreferences:{
      nodeIntegration:false,
      contextIsolation:true,
      sandbox:true,
      webSecurity:true,
      allowRunningInsecureContent:false,
      webviewTag:false,
      devTools:!app.isPackaged
    }
  });
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',(event,target)=>{
    try {const url=new URL(target); const root=path.resolve(__dirname,'..');
      if(url.protocol==='file:') {
        const requested=fileURLToPath(url);
        const relative=path.relative(root,requested);
        if(relative!== '..' && !relative.startsWith('..'+path.sep) && !path.isAbsolute(relative))return;
      }
    }catch(_){}
    event.preventDefault();
  });
  win.webContents.on('will-attach-webview',e=>e.preventDefault());
  win.once('ready-to-show',()=>win.show());
  win.loadFile(path.join(__dirname,'..','index.html'));
}
app.whenReady().then(()=>{
  // Browser localStorage persists in the stable Windows app profile.
  createWindow();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
