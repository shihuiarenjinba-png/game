"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
require("../src/engine.js");
const G=globalThis.VirtualArcade;
test("fresh game is funded only by virtual chips and has audited ledger",()=>{
 const s=G.newGame(9);
 assert.equal(s.chips,2500);assert.equal(s.ledger.length,1);
 assert.equal(s.rounds,0);G.validate(s);
});
test("roulette has 37 outcomes with 0, reproducible seeded draws and payouts",()=>{
 let zero=0,red=0,black=0;
 for(let i=1;i<=2000;i++){
 const a=G.newGame(i),b=G.newGame(i);
 G.roulette(a,10,"red");G.roulette(b,10,"red");
 assert.deepEqual(a,b);
 assert.ok(a.last.spin>=0&&a.last.spin<=36);
 zero+=a.last.spin===0;red+=G.RED.has(a.last.spin);black+=a.last.spin>0&&!G.RED.has(a.last.spin);
 assert.equal(a.last.paid,a.last.won?20:0);
 assert.equal(a.last.net,a.last.paid-10);G.validate(a);
 }
 assert.ok(zero>20&&red>500&&black>500);
});
test("straight roulette number pays total 36x only on exact match",()=>{
 for(let seed=1;seed<=100;seed++){
 const t=G.newGame(seed),b=G.newGame(seed);
 G.roulette(b,20,"red");
 G.roulette(t,20,"number",b.last.spin);
 assert.equal(t.last.won,true);
 assert.equal(t.last.paid,720);
 assert.equal(t.last.net,700);
 assert.equal(t.ledger.reduce((n,r)=>n+r.amount,0),t.chips);
 }
});
test("weighted slot reels, stated 2-match and 3-match payouts reconcile with bankroll",()=>{
 let pairs=0,trios=0;
 for(let i=1;i<=2500;i++){
 const s=G.newGame(i);G.slots(s,30);
 const [a,b,c]=s.last.reels;
 const mult=a===b?(b===c?G.THREE[a]:2):0;
 if(a===b){if(b===c)trios++;else pairs++;}
 assert.equal(s.last.paid,30*mult);
 assert.equal(s.last.net,30*(mult-1));
 G.validate(s);
 }
 assert.ok(pairs>150);assert.ok(trios>20);
});
test("blackjack hits, stands, instant naturals and double-stake transactions all reconcile",()=>{
 let doubles=0,naturals=0;
 for(let i=1;i<=1200;i++){
 const s=G.newGame(i);G.blackjack(s,50);
 if(s.pending){
  if(i%2&&s.chips>=50&&s.pending.canDouble){G.double(s);doubles++}
  else {if(i%3===0&&s.pending)G.hit(s);if(s.pending)G.stand(s)}
 }else naturals++;
 assert.equal(s.rounds,1);
 assert.equal(s.last.net,s.last.paid-s.last.amount);
 assert.equal(s.chips,s.ledger.reduce((a,r)=>a+r.amount,0));
 G.validate(s);
 }
 assert.ok(doubles>100);assert.ok(naturals>20);
});
test("30-round limit and lower-than-10 bust block additional bets",()=>{
 const s=G.newGame(18);
 for(let i=0;i<30;i++)G.slots(s,10);
 assert.equal(s.rounds,30);assert.equal(s.status,"complete");
 assert.throws(()=>G.slots(s,10),/終了/);
 const b=G.newGame(2);
 b.chips=10;b.ledger.push({kind:"DEV_TEST_DRAIN",amount:-2490,round:0});G.validate(b);
 G.slots(b,10);
 if(b.last.paid===0){assert.equal(b.status,"bust");assert.throws(()=>G.roulette(b,10,"red"),/終了/)}
});
test("invalid stakes and malicious saves are rejected without gameplay mutation",()=>{
 const s=G.newGame(43),snapshot=JSON.stringify(s);
 for(const stake of [0,5,15,210,-10,NaN])assert.throws(()=>G.slots(s,stake),/10〜200/);
 assert.throws(()=>G.roulette(s,50,"number",37),/0〜36/);
 assert.throws(()=>G.roulette(s,50,"magic"),/不正/);
 assert.equal(JSON.stringify(s),snapshot);
 const bad=JSON.parse(JSON.stringify(s));bad.chips+=10;assert.throws(()=>G.validate(bad),/一致/);
});
test("offline UI changes modes and retains real results in local save",()=>{
 const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
 let html="",events={},map={};const root={set innerHTML(v){html=v},get innerHTML(){return html}};
 const sandbox=vm.createContext({document:{getElementById:()=>root,addEventListener:(k,v)=>events[k]=v},localStorage:{getItem:k=>map[k]||null,setItem:(k,v)=>map[k]=v},Date,Math});
 vm.runInContext(fs.readFileSync(path.join(__dirname,"../src/engine.js"),"utf8"),sandbox);
 vm.runInContext(fs.readFileSync(path.join(__dirname,"../src/app.js"),"utf8"),sandbox);
 const click=(action,mode)=>events.click({target:{closest:()=>({disabled:false,dataset:{action,mode}})}});
 assert.match(html,/LUCK/);assert.match(html,/全ルール・抽選確率・配当表/);assert.match(html,/18\/37/);assert.match(html,/3一致/);click("slots");click("mode","roulette");click("roulette");click("mode","blackjack");click("blackjack");
 const now=JSON.parse(map["luck-lab-arcade-v1"]);
 if(now.pending)click("stand");
 const end=JSON.parse(map["luck-lab-arcade-v1"]);assert.equal(end.rounds,3);assert.match(html,/ブラックジャック/);G.validate(end);
});

test("dealer challenge publishes its special rule and increases dealer victories without changing hidden odds per hand",()=>{
 let standardLoss=0,challengeLoss=0,challengeWin=0;
 const n=2000;
 for(let seed=1;seed<=n;seed++){
   for(const [mode,count] of [["standard",false],["challenge",true]]){
     const s=G.newGame(seed);
     G.setHouseMode(s,mode);G.blackjack(s,50);
     if(s.pending){if(G.score(s.pending.player)<=16)G.hit(s);if(s.pending)G.stand(s)}
     G.validate(s);
     if(count){challengeLoss+=!s.last.won;challengeWin+=s.last.won}
     else standardLoss+=!s.last.won&&s.last.outcome!=="push";
     assert.equal(s.last.net,s.last.paid-s.last.amount);
     assert.equal(s.last.houseMode,mode);
   }
 }
 assert.ok(challengeLoss/n>.65,"dealer should win most under clearly labeled special house rules");
 assert.ok(challengeLoss>standardLoss,"special rules increase dealer advantage");
 assert.ok(challengeWin>0,"player still occasionally wins");
});
test("changing rules during an active hand is rejected, and old saved games use standard rules",()=>{
 const old=G.newGame(41);delete old.houseMode;G.validate(old);
 G.blackjack(old,50);if(old.pending){
   assert.throws(()=>G.setHouseMode(old,"challenge"),/進行中/);
   G.stand(old);
 }
 assert.equal(old.last.houseMode,"standard");
 const s=G.newGame(91);assert.equal(s.houseMode,"challenge");
 G.setHouseMode(s,"standard");assert.equal(s.houseMode,"standard");
 assert.throws(()=>G.setHouseMode(s,"impossible"),/不正/);
});

test("theoretical displayed slot house return follows disclosed independent symbol weights",()=>{
 const p=G.WEIGHTS.map(w=>w/100);
 assert.equal(p.reduce((a,b)=>a+b,0),1);
 const anyMatch=p.reduce((a,x)=>a+x*x,0);
 const exactTriple=p.reduce((a,x)=>a+x*x*x,0);
 const rtp=p.reduce((a,x,i)=>a+2*x*x*(1-x)+G.THREE[i]*x*x*x,0);
 assert.ok(anyMatch>.1&&anyMatch<.4);
 assert.ok(exactTriple>.01&&exactTriple<.1);
 assert.ok(rtp>0&&rtp<1.0,"average payout below one stake, but chance still present");
});
