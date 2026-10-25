'use strict';
const fs=require('node:fs');
function required(key) {
  const v=process.env[key];
  if(!v||!v.trim()||/^(EXAMPLE|TODO|PLACEHOLDER)/i.test(v.trim()))throw Error(`Partner Center identity is mandatory: ${key}`);
  return v.trim();
}
const identityName=required('LUCK_STORE_IDENTITY_NAME');
const publisher=required('LUCK_STORE_PUBLISHER');
const publisherDisplayName=required('LUCK_STORE_PUBLISHER_DISPLAY_NAME');
if (!/^[\w.\-]+$/.test(identityName))throw Error('Store identity must be alphanumeric / dots / hyphens');
if (!/^CN=/i.test(publisher))throw Error('Publisher must exactly match Partner Center, beginning CN=');
const config={
 appId:'jp.lucklab.arcade',productName:'LUCK LAB',asar:true,
 directories:{output:'dist',buildResources:'build'},
 files:['index.html','store-entry.html','luck-lab.html','*.js','*.css','desktop/main.cjs','package.json','!test*.js','!QA_*.md','!START_*.md','!docs/**'],
 win:{target:[{target:'msix',arch:['x64']}]},
 msix:{identityName,publisher,publisherDisplayName,displayName:'LUCK LAB',languages:['ja-JP'],createMsixupload:true}
};
fs.writeFileSync('electron-builder.generated.json',JSON.stringify(config,null,2)+'\n');
console.log('Created MSIX config using Partner Center identity (values not logged)');
