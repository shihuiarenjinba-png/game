/* PlayLab v53: portable backups for season / play-money casino. No network, no gameplay mutations. */
(function(root){'use strict';
const MAX_BYTES=8*1024*1024;
function validCasino(obj){return !!obj && typeof obj==='object' && !Array.isArray(obj) && obj.schema===4 && Number.isSafeInteger(obj.balance) && obj.balance>=0 && obj.balance<=100000000 && (obj.lang===undefined || ['ja','en'].includes(obj.lang)) && (obj.historyList===undefined || Array.isArray(obj.historyList)) && (obj.rushState===undefined || !!(root.JackpotRushV54&&root.JackpotRushV54.valid(obj.rushState))) && (obj.dealerShoeV78===undefined || !!(root.LuckDealerV78&&root.LuckDealerV78.valid(obj.dealerShoeV78))) && (obj.baccaratShoeV82===undefined || !!(root.LuckBaccaratV82&&root.LuckBaccaratV82.valid(obj.baccaratShoeV82))) && (obj.bankV76===undefined || !!(root.LuckBankV82&&root.LuckBankV82.valid(obj.bankV76))) && (obj.storyV84===undefined || !!(root.LuckStoryV84&&root.LuckStoryV84.valid(obj.storyV84))) && (obj.storyV85===undefined || !!(root.LuckStoryV85&&root.LuckStoryV85.valid(obj.storyV85))) && !((obj.storyV85?.phase==='trial'||obj.storyV84?.phase==='trial')&&obj.bankV76&&obj.bankV76.principal+obj.bankV76.interest>0);}
function validEkiden(obj){return !!(root.EkidenSaveGuardV49 && root.EkidenSaveGuardV49.validateSave(obj));}
function unpack(text,game,validate){if(typeof text!=='string'||!text.trim()||new TextEncoder().encode(text).length>MAX_BYTES)throw Error('Invalid backup size');const value=JSON.parse(text);let body=value;
 if(value && value.format==='playlab-portable-v53'){if(value.game!==game)throw Error('This backup belongs to another game');body=value.payload;}
 if(!validate(body))throw Error('Backup schema or required fields are invalid');return body;
}
function pack(raw,game,validate){const value=unpack(raw,game,validate);return JSON.stringify({format:'playlab-portable-v53',game,exportedAt:new Date().toISOString(),payload:value},null,2);}
function init(opts){const {game,key,exportId,importId,fileId,statusId}=opts;const doc=root.document;if(!doc)return;
 const ex=doc.getElementById(exportId),im=doc.getElementById(importId),file=doc.getElementById(fileId),status=doc.getElementById(statusId);
 if(!ex||!im||!file||!status)return;
 const validate=game==='ekiden'?validEkiden:validCasino;
 const say=(s)=>{status.textContent=s;};
 ex.addEventListener('click',()=>{try{const raw=root.localStorage.getItem(key);if(raw===null)throw Error('No saved data found');let data,name;
 try{data=pack(raw,game,validate);name=game+'_backup_v53.json';}catch(e){data=raw;name=game+'_protected_raw_v53.txt';say('元データの形式に問題があるため、修復できない原文を保全しました。');}
 const url=root.URL.createObjectURL(new Blob([data],{type:'application/json;charset=utf-8'}));const a=doc.createElement('a');a.href=url;a.download=name;doc.body.append(a);a.click();a.remove();setTimeout(()=>root.URL.revokeObjectURL(url),2000);
 if(name.endsWith('.json'))say('バックアップを保存しました。ブラウザー外の安全な場所に保管してください。');
 }catch(e){say('書き出し失敗: '+e.message);}});
 im.addEventListener('click',()=>file.click());
 file.addEventListener('change',async()=>{const selected=file.files?.[0];if(!selected)return;try{
 if(selected.size>MAX_BYTES||selected.size<1)throw Error('Backup must be 1 byte to 8 MiB');
 const text=await selected.text();const restored=unpack(text,game,validate);
 if(!root.confirm('現在の'+(game==='ekiden'?'駅伝':'LUCK LAB')+'セーブを上書きします。先に現在のセーブをバックアップしてください。実行しますか？')){say('読み込みをキャンセルしました。');return;}
 // No data is changed before validation and confirmation. A failed write keeps the previous raw value.
 root.localStorage.setItem(key,JSON.stringify(restored));say('バックアップを読み込みました。画面を再読込します。');root.location.reload();
 }catch(e){say('読み込み失敗（元データは変更していません）: '+e.message);}finally{file.value='';}});
}
const api={MAX_BYTES,validCasino,validEkiden,unpack,pack,init};if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root.document){const mount=()=>{init({game:'ekiden',key:'ekiden:season:autosave:v4',exportId:'ekidenExportV53',importId:'ekidenImportV53',fileId:'ekidenFileV53',statusId:'ekidenPortableStatusV53'});init({game:'casino',key:'lucklab:credits:v4',exportId:'casinoExportV53',importId:'casinoImportV53',fileId:'casinoFileV53',statusId:'casinoPortableStatusV53'});};if(root.document.readyState==='loading')root.addEventListener('DOMContentLoaded',mount,{once:true});else mount();}
})(typeof window!=='undefined'?window:globalThis);
