/* v82 eight-deck baccarat-inspired PLAYER/BANKER table. Uses real drawing rules.
   This is a separate game from THE TWENTY. No cash value. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LuckBaccaratV82=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const PACK=32,TOTAL=416,CUT=300;
function fresh(){return {counts:Array(13).fill(PACK),used:0};}
function valid(s){return !!s&&typeof s==='object'&&Array.isArray(s.counts)&&s.counts.length===13&&s.counts.every(x=>Number.isSafeInteger(x)&&x>=0&&x<=PACK)&&Number.isSafeInteger(s.used)&&s.used>=0&&s.used<=TOTAL&&s.used+s.counts.reduce((a,b)=>a+b,0)===TOTAL;}
function cardValue(r){return r<=9?r:0;}
function total(hand){return hand.reduce((sum,r)=>sum+cardValue(r),0)%10;}
function drawCard(s,random,suits){const rem=TOTAL-s.used;if(rem<=0)throw Error('empty baccarat shoe');const r=random();if(!(Number.isFinite(r)&&r>=0&&r<1))throw Error('invalid random');let slot=Math.floor(r*rem);for(let i=0;i<13;i++){if(slot<s.counts[i]){if(suits)suits.push((PACK-s.counts[i])%4);s.counts[i]--;s.used++;return i+1;}slot-=s.counts[i];}throw Error('card draw failed');}
function bankerDraw(b,playerThird){if(playerThird===null)return b<=5;if(b<=2)return true;if(b===3)return playerThird!==8;if(b===4)return playerThird>=2&&playerThird<=7;if(b===5)return playerThird>=4&&playerThird<=7;if(b===6)return playerThird===6||playerThird===7;return false;}
function winner(player,banker){const p=total(player),b=total(banker);return p===b?'TIE':p>b?'PLAYER':'BANKER';}
function settle(stake,side,win){if(win==='TIE')return stake;if(side!==win)return 0;return side==='PLAYER'?stake*2:stake+Math.floor(stake*.95);}
function plausibleHands(p,b){if(!Array.isArray(p)||!Array.isArray(b)||![2,3].includes(p.length)||![2,3].includes(b.length)||![...p,...b].every(x=>Number.isSafeInteger(x)&&x>=1&&x<=13))return false;const p2=total(p.slice(0,2)),b2=total(b.slice(0,2)),natural=p2>=8||b2>=8;if(natural)return p.length===2&&b.length===2;const pDraw=p2<=5;const bDraw=bankerDraw(b2,pDraw?cardValue(p[2]):null);return p.length===(pDraw?3:2)&&b.length===(bDraw?3:2);}
function play(wallet,stake,side,shoe,random=Math.random){if(!valid(shoe))throw Error('invalid baccarat shoe');if(!Number.isSafeInteger(stake)||stake<20||stake>1000||stake%10!==0||!Number.isSafeInteger(wallet)||wallet<stake||wallet>100000000||!['PLAYER','BANKER'].includes(side))throw Error('invalid baccarat wager');
 const s=shoe.used>=CUT||TOTAL-shoe.used<6?fresh():{counts:shoe.counts.slice(),used:shoe.used};const ps=[],bs=[];const p=[drawCard(s,random,ps)],b=[drawCard(s,random,bs)];p.push(drawCard(s,random,ps));b.push(drawCard(s,random,bs));let p2=total(p),b2=total(b);
 if(p2<8&&b2<8){const drawP=p2<=5;if(drawP)p.push(drawCard(s,random,ps));if(bankerDraw(b2,drawP?cardValue(p[2]):null))b.push(drawCard(s,random,bs));}
 const win=winner(p,b),payout=settle(stake,side,win),next=wallet-stake+payout;if(next>100000000)throw Error('wallet limit');
 return {shoe:s,newWallet:next,outcome:{which:'baccarat',wager:stake,payout,net:payout-stake,side,winner:win,player:p,banker:b,playerSuits:ps,bankerSuits:bs,playerTotal:total(p),bankerTotal:total(b)}};
}
function validResult(o){if(!o||typeof o!=='object')return false;const suitsOk=(o.playerSuits===undefined&&o.bankerSuits===undefined)||((Array.isArray(o.playerSuits)&&Array.isArray(o.bankerSuits))&&o.playerSuits.length===o.player?.length&&o.bankerSuits.length===o.banker?.length&&[...o.playerSuits,...o.bankerSuits].every(x=>Number.isInteger(x)&&x>=0&&x<4));return suitsOk&&!!o&&o.which==='baccarat'&&Number.isSafeInteger(o.wager)&&o.wager>=20&&o.wager<=1000&&o.wager%10===0&&['PLAYER','BANKER'].includes(o.side)&&plausibleHands(o.player,o.banker)&&o.winner===winner(o.player,o.banker)&&o.playerTotal===total(o.player)&&o.bankerTotal===total(o.banker)&&o.payout===settle(o.wager,o.side,o.winner)&&o.net===o.payout-o.wager;}
const rankText=r=>r===1?'A':r===11?'J':r===12?'Q':r===13?'K':String(r);
return Object.freeze({fresh,valid,play,validResult,cardValue,total,rankText,bankerDraw,settle,CUT});});
