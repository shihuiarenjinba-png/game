'use strict';
const assert=require('assert'),B=require('./luck-baccarat-v82'),Bank=require('./luck-bank-v82');let checks=0;
function ck(x,m){assert.ok(x,m);checks++;}
ck(B.validResult(null)===false,'reject null');ck(B.validResult({})===false,'reject malformed');ck(B.valid(B.fresh()),'fresh deck');
const old={...B.play(1000,20,'PLAYER',B.fresh()).outcome};delete old.playerSuits;delete old.bankerSuits;ck(B.validResult(old),'legacy valid result');
let shoe=B.fresh(),balance=1000000,seen={PLAYER:0,BANKER:0,TIE:0};
for(let i=0;i<3500;i++){
 const r=B.play(balance,20,(i%2?'BANKER':'PLAYER'),shoe),o=r.outcome;
 ck(B.valid(r.shoe),'8-deck count invariant');ck(B.validResult(o),'valid deal including suit details');
 ck(o.player.length===o.playerSuits.length&&o.banker.length===o.bankerSuits.length,'suits per card');
 ck([...o.playerSuits,...o.bankerSuits].every(x=>Number.isInteger(x)&&x>=0&&x<4),'suits range');
 const invalid={...o,playerSuits:[9,...o.playerSuits.slice(1)]};ck(!B.validResult(invalid),'invalid suit not accepted');
 ck(o.playerTotal===B.total(o.player)&&o.bankerTotal===B.total(o.banker),'third card outcome matches official draw rules');
 shoe=r.shoe;balance=r.newWallet;seen[o.winner]++;
}
ck(Math.abs(seen.BANKER/3500-.4586)<.05,'banker not 1/2 win');ck(Math.abs(seen.PLAYER/3500-.4462)<.05,'player not 1/2 win');ck(Math.abs(seen.TIE/3500-.0952)<.025,'draw rate');
let bank=Bank.borrow(Bank.fresh(),0);ck(bank.wallet===1000&&Bank.debt(bank.bank)===1010,'1 game unit becomes 1 chip plus explicit 10 initial fee');
let next=Bank.advance(Bank.advance(bank.bank,50),50);ck(Bank.debt(next)===1015,'5 chips charged per 100 rounds');
console.log(JSON.stringify({version:'v83',assertions:checks,results:seen,remaining_debt_after_100_rounds:Bank.debt(next)}));
