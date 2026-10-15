/* v81: posterior-aware payouts, state flow, historical saves/results, lender isolation */
'use strict';const assert=require('node:assert/strict'),Old=require('./luck-dealer-v78.js'),New=require('./luck-dealer-v81.js');let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
const frozen=s=>JSON.parse(JSON.stringify(s));
eq(New.fresh(),Old.fresh());eq(New.quote(New.fresh(),20).payout,64);eq(New.quote(New.fresh(),200).rtp,0.9614999999999999);
const deterministic=[[0,true],[.29999,true],[.3,false],[.99999,false]];
for(const [u,gold] of deterministic){const s=New.fresh(),wallet=1000,stake=200;const r=New.draw(wallet,s,'BET',stake,()=>u),q=New.quote(s,stake);eq(r.outcome.rules,81);eq(r.outcome.card,gold?'GOLD':'BLANK');eq(r.newWallet,wallet+(gold?q.payout:0)-stake);eq(New.validResult(r.outcome),true);eq(New.valid(s),true);eq(New.valid(r.shoe),true);eq(r.outcome.before,s);eq(r.outcome.after,r.shoe);}
let historical=Old.draw(1000,Old.fresh(),'BET',200,()=>.1).outcome;eq(New.validResult(historical),true);eq(Old.validResult(historical),true);
const oldObs=Old.draw(1000,Old.fresh(),'OBSERVE',20,()=>.9).outcome;eq(New.validResult(oldObs),true);
const oldShoe={gold:4,blank:10,revealed:6,observed:2};eq(New.valid(oldShoe),true);eq(New.quote(oldShoe,20).p,4/14);
for(const stake of [20,30,50,100,200,1000]){for(let k=0;k<=12;k++){for(let g=Math.max(0,k-14);g<=Math.min(k,6);g++){const state={gold:6-g,blank:14-(k-g),revealed:k,observed:0};if(!New.valid(state))continue;const copy=frozen(state);const q=New.quote(state,stake);eq(Number.isInteger(q.payout),true);eq(q.payout>=0&&q.payout<=stake*12,true);eq(q.rtp<=1.008+1e-9,true);eq(q.expectedNet,q.p*q.payout-stake);eq(state,copy);}}}
const s=New.fresh();let observe=New.draw(1000,s,'OBSERVE',20,()=>.99);eq(New.validResult(observe.outcome),true);eq(observe.outcome.payout,0);eq(observe.newWallet,995);eq(observe.shoe.blank,13);
let after=New.draw(observe.newWallet,observe.shoe,'BET',20,()=>.99);eq(New.validResult(after.outcome),true);eq(New.validResult({...after.outcome,payout:123456}),false);eq(New.validResult({...after.outcome,net:123456}),false);eq(New.validResult({...after.outcome,card:'GOLD'}),false);
assert.throws(()=>New.quote(New.fresh(),0));n++;assert.throws(()=>New.draw(19,New.fresh(),'BET',20,()=>.1));n++;assert.throws(()=>New.draw(1000,New.fresh(),'BET',20,()=>1));n++;
let legacy=require('./luck-dealer-v78.js');eq(legacy.ODDS,3.2);eq(legacy.quote(legacy.fresh(),200).payout,640);
console.log('v81 dealer balance '+n+' assertions PASS');
