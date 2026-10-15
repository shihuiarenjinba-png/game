/* LUCK LAB v78: original finite-shoe / without-replacement dealer game.
   No actual currency, guaranteed return, dealer AI, or real-money casino connection.
   No future card sequence is stored. Draws consume precisely one independent random sample.
*/
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LuckDealerV78=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const TOTAL=20,GOLD=6,BLANK=14,MAX_REVEALS=12,MAX_OBSERVES=2,FEE=5,ODDS=3.2;
 function fresh(){return{gold:GOLD,blank:BLANK,revealed:0,observed:0};}
 function valid(s){return !!s&&typeof s==='object'&&Number.isSafeInteger(s.gold)&&Number.isSafeInteger(s.blank)&&Number.isSafeInteger(s.revealed)&&Number.isSafeInteger(s.observed)&&s.gold>=0&&s.gold<=GOLD&&s.blank>=0&&s.blank<=BLANK&&s.revealed>=0&&s.revealed<=MAX_REVEALS&&s.gold+s.blank===TOTAL-s.revealed&&s.observed>=0&&s.observed<=MAX_OBSERVES&&s.observed<=s.revealed;}
 function probability(s){if(!valid(s))throw Error('invalid dealer shoe');return s.gold/(s.gold+s.blank);}
 function quote(s,stake=20){if(!Number.isSafeInteger(stake)||stake<20||stake>1000||stake%10!==0)throw Error('stake must be 20 to 1000 in steps of 10');const p=probability(s);return{p,odds:ODDS,payout:Math.round(stake*ODDS),expectedNet:Math.round(stake*ODDS)*p-stake,rtp:ODDS*p,positive:ODDS*p>1};}
 function canDraw(s,kind){return valid(s)&&s.revealed<MAX_REVEALS&&(s.gold+s.blank)>0&&(kind!=='OBSERVE'||s.observed<MAX_OBSERVES);}
 function draw(wallet,s,kind,stake,random=Math.random){if(!valid(s))throw Error('invalid shoe');if(kind!=='BET'&&kind!=='OBSERVE')throw Error('choose wager or observe');if(!canDraw(s,kind))throw Error('shoe is finished or observation limit reached; reshuffle');const wager=kind==='BET'?stake:FEE;
 if(kind==='BET')quote(s,stake);
 if(!Number.isSafeInteger(wallet)||wallet<0||wallet>100000000||wallet<wager)throw Error('not enough chips');
 const u=random();if(!Number.isFinite(u)||u<0||u>=1)throw Error('invalid random sample');
 const before={gold:s.gold,blank:s.blank,revealed:s.revealed,observed:s.observed};
 const hit=u<probability(s),card=hit?'GOLD':'BLANK';const after={gold:s.gold-(hit?1:0),blank:s.blank-(hit?0:1),revealed:s.revealed+1,observed:s.observed+(kind==='OBSERVE'?1:0)};
 const payout=kind==='BET'&&hit?Math.round(stake*ODDS):0;
 const net=payout-wager;
 return{shoe:after,newWallet:wallet+net,outcome:{which:'dealer',kind,card,result:kind==='OBSERVE'?'OBSERVED':hit?'WIN':'LOSE',wager,payout,net,before,after}};
 }
 function validResult(r){try{if(!r||r.which!=='dealer'||!['BET','OBSERVE'].includes(r.kind)||!['GOLD','BLANK'].includes(r.card)||!valid(r.before)||!valid(r.after)||!canDraw(r.before,r.kind))return false;const hit=r.card==='GOLD',isObserve=r.kind==='OBSERVE';if(r.after.gold!==r.before.gold-(hit?1:0)||r.after.blank!==r.before.blank-(hit?0:1)||r.after.revealed!==r.before.revealed+1||r.after.observed!==r.before.observed+(isObserve?1:0))return false;
 if(!Number.isSafeInteger(r.wager)||!Number.isSafeInteger(r.payout)||!Number.isSafeInteger(r.net))return false;
 if(isObserve)return r.wager===FEE&&r.payout===0&&r.net===-FEE&&r.result==='OBSERVED';
 const q=quote(r.before,r.wager);const payout=hit?q.payout:0;return r.payout===payout&&r.net===payout-r.wager&&r.result===(hit?'WIN':'LOSE');
 }catch(_){return false;}}
 function auditExact(){// Exact hypergeometric P(K=k) after d draws; without replacement.
 const choose=(n,k)=>{if(k<0||k>n)return 0;let y=1;for(let i=1;i<=k;i++)y=y*(n-k+i)/i;return y;};
 const distribution={};for(let n=0;n<=MAX_REVEALS;n++){const a=[];for(let k=Math.max(0,n-BLANK);k<=Math.min(n,GOLD);k++)a.push({goldDrawn:k,p:choose(GOLD,k)*choose(BLANK,n-k)/choose(TOTAL,n)});distribution[n]=a;}return distribution;}
 return Object.freeze({fresh,valid,probability,quote,canDraw,draw,validResult,auditExact,TOTAL,GOLD,BLANK,MAX_REVEALS,MAX_OBSERVES,FEE,ODDS});
});
