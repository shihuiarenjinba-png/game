'use strict';
const fs=require('node:fs');
const path=require('node:path');
const source=JSON.parse(fs.readFileSync(path.join(__dirname,'../store/partner-center-identity.json'),'utf8'));
function confirmed(key,field){
 const stored=String(source[field]||'').trim();
 if(!stored||/^(UNKNOWN|HOLD|TBD|EXAMPLE|PLACEHOLDER)$/i.test(stored))
   throw Error('Partner Center owner-confirmed Identity missing: '+field);
 const fromActions=String(process.env[key]||'').trim();
 if(fromActions&&fromActions!==stored)
   throw Error('Actions variable disagrees with Partner Center record: '+key);
 return stored;
}
const identityName=confirmed('LUCK_STORE_IDENTITY_NAME','identityName');
const publisher=confirmed('LUCK_STORE_PUBLISHER','publisher');
const publisherDisplayName=confirmed('LUCK_STORE_PUBLISHER_DISPLAY_NAME','publisherDisplayName');
if(source.productTitle!=='LUCK LAB'||source.storeId!=='9NTSTXQ7BM9V')
 throw Error('LUCK LAB Store product verification mismatch');
if(!/^[\w.\-]+$/.test(identityName))throw Error('Store identity must be alphanumeric / dots / hyphens');
if(!/^CN=/i.test(publisher))throw Error('Publisher must exactly match Partner Center, beginning CN=');
const config={
 appId:'jp.lucklab.arcade',productName:'LUCK LAB',asar:true,
 directories:{output:'dist',buildResources:'build'},
 files:['store-entry.html','luck-lab.html','*.js','*.css','desktop/main.cjs','package.json','!test*.js','!QA_*.md','!START_*.md','!docs/**'],
 win:{target:[{target:'msix',arch:['x64']}]},
 msix:{identityName,publisher,publisherDisplayName,displayName:'LUCK LAB',languages:['ja-JP'],createMsixupload:true}
};
fs.writeFileSync('electron-builder.generated.json',JSON.stringify(config,null,2)+'\n');
console.log('Created unsigned MSIX QA candidate config from owner-confirmed Partner Center record (no API keys, no Store submission)');
