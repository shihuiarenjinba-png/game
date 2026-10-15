/* v80: read-only money clinic; this module has no access to betting buttons or RNG. */
(function(root){'use strict';const $=id=>root.document?.getElementById(id);const SAVE='lucklab:credits:v4';
function show(){if(!$('v80RiskPanel'))return;const ja=root.document.documentElement.lang!=='en';let s=null;try{const raw=root.localStorage.getItem(SAVE);if(raw)s=JSON.parse(raw);}catch(_){}
const v=s&&s.schema===4?root.LuckRiskV82.analyze(s.bankV76||root.LuckBankV82.fresh(),s.balance,root.LuckBankV82,Math.max(20,Number($('stake')?.value)||2)):null;
if(!v){$('v80Recovery').textContent=ja?'保存データを保護中。金額の診断は停止しています。':'Saved data protected. Credit diagnosis paused.';$('v80InterestHint').textContent='—';$('v80CreditHint').textContent='—';return;}
$('v80InterestHint').textContent=(ja?'次の利息まで':'Until interest')+' '+v.untilNext+(ja?'勝負':' rounds')+' · '+(ja?'予定追加利息':'estimated fee')+' '+v.periodicInterest;
$('v80CreditHint').textContent=(ja?'借入枠の残り':'Unused credit limit')+' '+v.loanHeadroom+' · '+(ja?'借入単位':'loan lot')+' '+v.borrowStep;
$('v80Recovery').textContent=v.bankrupt?(ja?'どん底です。この挑戦は再出発のみ可能です。':'Bottom reached; only a new run can continue.'):v.workAllowed?(ja?'追加融資不可。再建の仕事なら賃金300・今回の追加利息'+v.workCost+'で純資産が'+v.workEquityGain+'改善します。':'No new loan lot fits. A recovery shift grants 300 chips, incurs '+v.workCost+' interest, and improves equity by '+v.workEquityGain+'.'):v.borrowAllowed?(ja?'賭金不足時に1,000チップの追加融資が可能です。利息がかかります。':'A further 1,000-chip virtual loan is available if funds are insufficient. Interest applies.'):ja?'手持ちで勝負できます。借入は純資産を増やしません。':'You can play with available chips. Borrowing does not raise net equity.';
}
function init(){if(!$('v80RiskPanel'))return;root.document.addEventListener('lucklab:v79-changed',show);show();}
if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',init,{once:true});else init();}
})(typeof globalThis!=='undefined'?globalThis:this);
