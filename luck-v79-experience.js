/* v79: read-only casino ledger, unobtrusive six-table navigation.
   Reads validated saved round data; never touches random generators, odds, wallet or main save.
   Repayment presets only populate the existing amount input. Payment still requires explicit confirmation.
*/
(function(root,factory){const api=factory(root);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LuckExperienceV79=api;})(typeof globalThis!=='undefined'?globalThis:this,function(root){'use strict';
const SAVE='lucklab:credits:v4',STAGES={rush:'JACKPOT RUSH',roulette:'ROULETTE',slots:'SLOT',dice:'DICE HIGH',chinchiro:'CHINCHIRO',dealer:'THE TWENTY',baccarat:'PLAYER / BANKER',baccarat:'PLAYER / BANKER'};
function ledger(s,bankApi){
 if(!s||s.schema!==4||!Number.isSafeInteger(s.balance)||s.balance<0||s.balance>100000000)return null;
 const b=s.bankV76||bankApi.fresh();if(!bankApi.valid(b))return null;
 const debt=bankApi.debt(b),invoiced=b.totalBorrowed+b.totalInterestCharged;
 const pct=invoiced?Math.min(100,100*b.totalRepaid/invoiced):100;
 const last=Array.isArray(s.historyList)?s.historyList.slice(-20).filter(x=>x&&Number.isSafeInteger(x.net)&&Number.isSafeInteger(x.wager)&&x.wager>=1&&x.wager<=1000&&Number.isSafeInteger(x.payout)&&x.net===x.payout-x.wager):[];
 return {wallet:s.balance,debt,principal:b.principal,interest:b.interest,paid:b.totalRepaid,borrowed:b.totalBorrowed,charged:b.totalInterestCharged,progress:pct,equity:s.balance-debt,recentNet:last.reduce((n,x)=>n+x.net,0),recentRounds:last.length,last:last.length?last[last.length-1]:null};
}
function preset(summary,mode,stake){if(!summary||!['quarter','half','full','reserve'].includes(mode))return 0;const cap=Math.min(summary.wallet,summary.debt);if(mode==='quarter')return Math.floor(cap/4);if(mode==='half')return Math.floor(cap/2);if(mode==='full')return cap;const reserve=Math.max(100,Math.min(1000,Number.isSafeInteger(stake)?stake*15:100));return Math.min(summary.debt,Math.max(0,summary.wallet-reserve));}
const num=n=>n.toLocaleString('ja-JP');const $=id=>root.document?.getElementById(id);
function snapshot(){try{const raw=root.localStorage?.getItem(SAVE);if(!raw)return null;return ledger(JSON.parse(raw),root.LuckBankV82);}catch(_){return null;}}
function render(){if(!$('v79Ledger'))return;const a=snapshot(),ja=root.document.documentElement.lang!=='en';if(!a){$('v79Ledger').dataset.state='blocked';$('v79Message').textContent=ja?'保存データを確認できません。元データを保護し、返済の操作案内を停止しています。':'Saved data unavailable. Repayment helpers are paused to protect the original.';for(const id of ['v79PresetReserve','v79PresetHalf','v79PresetFull'])$(id).disabled=true;return;}
 $('v79Ledger').dataset.state=a.debt===0?'clear':a.equity>=0?'solvent':'debt';
 $('v79DebtRemaining').textContent=num(a.debt);if($('v79DrawerSummary'))$('v79DrawerSummary').textContent=(ja?'残債 ':'Debt ')+num(a.debt)+(ja?' ／ 純資産 ':' / Equity ')+(a.equity>=0?'+':'')+num(a.equity);
 $('v79Progress').style.width=a.progress.toFixed(1)+'%';
 $('v79Progress').setAttribute('aria-valuenow',a.progress.toFixed(1));
 $('v79Paid').textContent=num(a.paid);$('v79InterestPaid').textContent=num(a.charged-a.interest);
 $('v79Equity').textContent=(a.equity>=0?'+':'')+num(a.equity);
 $('v79RecentNet').textContent=(a.recentNet>=0?'+':'')+num(a.recentNet);
 $('v79RecentLabel').textContent=ja?'直近'+a.recentRounds+'件の記録':'Last '+a.recentRounds+' recorded outcomes';
 $('v79Message').textContent=a.debt===0?(ja?'完済。借金はゼロになりました。次の遊び方はあなたが決められます。':'Debt cleared. All future choices are yours.'):(a.equity>=0?(ja?'手持ちが総債務を上回っています。手元資金を残した返済も選べます。':'Wallet covers outstanding debt. You may repay while keeping a reserve.'):(ja?'借入で増えたチップは利益ではありません。返済額を確かめてから決定してください。':'Borrowed chips are not profit. Review the amount before repaying.'));
 const last=a.last;
 $('v79LastResult').textContent=last?(STAGES[last.which]||last.which)+'  ·  '+(last.net>=0?'+':'')+num(last.net)+(ja?' チップ':' credits'):(ja?'まだ勝負の記録はありません。':'No recorded rounds yet.');
 for(const id of ['v79PresetReserve','v79PresetHalf','v79PresetFull'])$(id).disabled=a.debt<=0||a.wallet<=0;
}
function init(){if(!$('v79Ledger'))return;const ja=()=>root.document.documentElement.lang!=='en';
 const presets={v79PresetReserve:'reserve',v79PresetHalf:'half',v79PresetFull:'full'};
 for(const [id,mode]of Object.entries(presets))$(id).addEventListener('click',()=>{const a=snapshot(),input=$('v76RepayAmount');if(!a||!input)return;const amount=preset(a,mode,Number($('stake')?.value)||2);if(amount<1){$('v79Message').textContent=ja()?'この条件では返済可能額がありません。':'No amount can be repaid with this preset.';return;}input.value=String(amount);$('v79Message').textContent=(ja()?'返済入力欄へ ':'Prepared ')+num(amount)+(ja()?' チップを設定。実際の返済には上の「指定額を返済」を押してください。':' credits. Press Repay above to confirm; nothing paid yet.');input.focus({preventScroll:true});});
 root.document.addEventListener('lucklab:v79-changed',render);
 render();
}
if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',init,{once:true});else init();}
return Object.freeze({ledger,preset,render,snapshot});});
