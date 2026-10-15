/* LUCK LAB v81: finite-shoe posterior-aware quote, kept separate from legacy v78.
 * Betting pays a quoted stake-specific amount BEFORE the card is drawn.
 * No new sample consumed to quote; card draw exactly one sample as in v78.
 * In-game credits only; no real debts, money or prizes.
 */
(function(root,factory){const legacy=(typeof module!=='undefined'&&module.exports)?require('./luck-dealer-v78.js'):root.LuckDealerV78;const api=factory(legacy);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LuckDealerV81=api;})(typeof globalThis!=='undefined'?globalThis:this,function(Old){'use strict';
 if(!Old)throw Error('legacy dealer absent');const RULES=81;
 function quote(s,stake=20){if(!Number.isSafeInteger(stake)||stake<20||stake>1000||stake%10!==0)throw Error('stake must be 20 to 1000 in steps of 10');
 const p=Old.probability(s);
 // Quote varies smoothly with odds; tiny conditional opportunity exists only for rare favorable shoes.
 // Base 96.2% gross expected payout, baseline v78 96.0%.
 const target=.962+.10*(p-.30);
 const payout=p===0?0:Math.floor(stake*Math.min(12,target/p));
 const rtp=stake?((p*payout)/stake):0;
 return{p,payout,odds:payout/stake,expectedNet:p*payout-stake,rtp,positive:rtp>1,rules:RULES};
 }
 function draw(wallet,s,kind,stake,random=Math.random){if(kind!=='BET'&&kind!=='OBSERVE')throw Error('choose wager or observe');
 const q=kind==='BET'?quote(s,stake):null;
 const old=Old.draw(wallet,s,kind,stake,random);const wager=old.outcome.wager;
 const payout=kind==='BET'&&old.outcome.card==='GOLD'?q.payout:0;
 const net=payout-wager;const next=wallet+net;
 if(!Number.isSafeInteger(next)||next<0||next>100000000)throw Error('chip limit exceeded');
 return {shoe:old.shoe,newWallet:next,outcome:{...old.outcome,rules:RULES,payout,net}};
 }
 function validResult(o){if(!o||o.rules!==RULES)return Old.validResult(o);if(!Old.valid(o.before)||!Old.valid(o.after)||!Old.canDraw(o.before,o.kind)||!['GOLD','BLANK'].includes(o.card))return false;
 const hit=o.card==='GOLD',observe=o.kind==='OBSERVE';if(!['BET','OBSERVE'].includes(o.kind))return false;
 if(o.after.gold!==o.before.gold-(hit?1:0)||o.after.blank!==o.before.blank-(hit?0:1)||o.after.revealed!==o.before.revealed+1||o.after.observed!==o.before.observed+(observe?1:0))return false;
 if(!Number.isSafeInteger(o.wager)||!Number.isSafeInteger(o.payout)||!Number.isSafeInteger(o.net))return false;
 if(observe)return o.wager===Old.FEE&&o.payout===0&&o.net===-Old.FEE&&o.result==='OBSERVED';
 try{const q=quote(o.before,o.wager);const expected=hit?q.payout:0;return o.payout===expected&&o.net===expected-o.wager&&o.result===(hit?'WIN':'LOSE');}catch(_){return false;}
 }
 return Object.freeze({...Old,quote,draw,validResult,RULES,QUOTE_BASE:.962,QUOTE_SLOPE:.10});
});
