'use strict';const assert=require('node:assert/strict');const B=require('./luck-bank-v80.js');const Old=require('./luck-bank-v77.js');const Risk=require('./luck-v80-risk.js');let n=0;const eq=(a,b)=>{assert.deepEqual(a,b);n++;};
let old=Old.borrow(Old.fresh(),0).bank;eq(B.valid(old),true);eq(B.status(old,0,20).borrowAllowed,true);eq(B.status(old,0,20).workAllowed,false);let bank=old,wallet=1000;for(let i=1;i<12;i++){wallet=0;const r=B.borrow(bank,wallet,20);bank=r.bank;wallet=r.wallet;}eq(bank.principal,12000);eq(B.valid(bank),true);
let repay=B.repay(bank,wallet,500);bank=repay.bank;wallet=repay.wallet;eq(bank.principal,11860);eq(B.status(bank,0,20).borrowAllowed,false);eq(B.status(bank,0,20).workAllowed,true);eq(B.status(bank,0,20).bankrupt,false);
const beforeDebt=B.debt(bank);const work=B.shift(bank,0,20);eq(work.wallet,300);eq(work.bank.principal,11860);eq(work.interest<=119,true);eq(B.debt(work.bank)-beforeDebt,work.interest);eq(300-work.interest>0,true);
eq(Old.status(bank,0,20).workAllowed,false);assert.throws(()=>Old.shift(bank,0,20));n++;
const rep2=B.repay(work.bank,work.wallet,300);eq(B.valid(rep2.bank),true);eq(rep2.bank.principal<=bank.principal,true);
const hint=Risk.analyze(bank,0,B,20);eq(hint.workAllowed,true);eq(hint.loanHeadroom,140);eq(hint.workEquityGain,300-Math.min(Math.ceil(bank.principal*.01),Math.floor(bank.totalBorrowed*.5)-bank.totalInterestCharged));eq(hint.untilNext,50);eq(hint.periodicInterest>=0,true);
eq(Risk.analyze({...bank,principal:-1},0,B,20),null);eq(Risk.analyze(bank,-1,B,20),null);eq(Risk.analyze(bank,0,B,0),null);
// With maxed credit and excessive interest, losing the final chip means bottom, not a frozen state.
const b2={...bank,interest:4800,totalInterestCharged:4800,totalRepaid:bank.totalBorrowed-11860};eq(B.valid(b2),true);eq(B.status(b2,0,20).bankrupt,true);eq(B.status(b2,0,20).workAllowed,false);assert.throws(()=>B.shift(b2,0,20));n++;
// Normal 12,000-principal debt and ordinary borrowing paths retain v77 cash/interest formulas.
let plain=B.borrow(B.fresh(),0);let plainOld=Old.borrow(Old.fresh(),0);eq(plain,plainOld);for(let i=0;i<50;i++){plain.bank=B.advance(plain.bank,1);plainOld.bank=Old.advance(plainOld.bank,1);}eq(plain.bank,plainOld.bank);
let r=B.repay(plain.bank,plain.wallet,400),ro=Old.repay(plainOld.bank,plainOld.wallet,400);eq(r,ro);eq(Risk.analyze(r.bank,r.wallet,B,20).debt,B.debt(r.bank));
console.log('v80 credit recovery '+n+' assertions PASS');
