'use strict';
const assert=require('node:assert/strict');
const S=require('./luck-story-v85.js'), Old=require('./luck-story-v84.js'), Bank=require('./luck-bank-v82.js');
const f=S.fresh();assert.equal(f.phase,'trial');assert(S.valid(f));assert.equal(S.due(f,1000),0);
assert.equal(S.cause(f,6000),'BIG_WIN');assert.equal(S.due(f,6000),1000);assert.equal(S.due(f,5999),0);
const quickWin=S.convert(f,6000,Bank.fresh());assert.equal(quickWin.principal,1000);assert.equal(quickWin.interest,10);assert.equal(quickWin.wallet,6000);assert(Bank.valid(quickWin.bank));
const w1=S.play(f,1,1000);assert.equal(w1.rounds,1);assert.equal(w1.wagered,1000);assert.equal(S.due(w1,0),0);
const w2=S.play(w1,5,5000);assert.equal(w2.wagered,6000);assert.equal(S.cause(w2,900),'TOTAL_STAKES');assert.equal(S.due(w2,900),1000);
const g1=S.grant(f,0,10).story;const g2=S.grant(g1,0,10).story;const g3=S.grant(g2,0,10).story;
assert.equal(g3.granted,4000);assert.equal(S.due(g3,2001),0);assert.equal(S.cause(g3,2000),'FREE_CREDIT_USE');assert.equal(S.due(g3,2000),3000);
const c=S.convert(g3,2000,Bank.fresh());assert.equal(c.principal,3000);assert.equal(c.interest,30);assert.equal(c.wallet,2000);assert(Bank.valid(c.bank));assert.equal(S.due(c.story,0),0);
assert.throws(()=>S.convert(c.story,2000,c.bank));assert.throws(()=>S.play(f,1,-1));assert.throws(()=>S.play(f,1,1001));assert.throws(()=>S.play(f,0,0));
const old=Old.fresh();const migrated=S.migrateV84({...old,activeSeconds:7200,rounds:42,refills:2,granted:3000});assert.equal(migrated.wagered,0);assert.equal(migrated.rounds,42);assert.equal(S.due(migrated,100),0);
const oc=Old.convert({...old,activeSeconds:7200,refills:2,granted:3000},0,Bank.fresh());const preserved=S.migrateV84(oc.story);assert.equal(preserved.phase,'converted');assert.equal(preserved.convertedPrincipal,3000);assert.equal(S.due(preserved,0),0);
const ol=S.migrateV84(Old.legacy());assert.equal(ol.phase,'legacy');assert.equal(S.due(ol,50000),0);
assert.throws(()=>S.migrateV84({...old,granted:9999}));
for(let i=0;i<15000;i++){
 let state=S.fresh(),wallet=i%5500;
 for(let j=0;j<i%5;j++)state={...state,refills:state.refills+1,granted:state.granted+1000};
 state=S.play(state,1,i%1000);assert(S.valid(state));const a=S.due(state,wallet);assert(a===0||a>=1000&&a<=3000&&a%1000===0);
 if(a){const out=S.convert(state,wallet,Bank.fresh());assert(Bank.valid(out.bank));assert.equal(out.wallet,wallet);}
}
console.log('v85 15000 randomized milestone cases and boundary tests PASSED');
