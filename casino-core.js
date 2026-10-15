/* LUCK LAB experimental original virtual-credit casino. No prizes, purchases, or real money. */
(function(root,factory){const x=factory();if(typeof module!=='undefined'&&module.exports)module.exports=x;root.LuckLabCasino=x;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const symbols=['CHERRY','BELL','STAR','SEVEN'];const weights=[.4,.3,.2,.1];
function reel(random=Math.random){const u=random();if(!(u>=0&&u<1))throw Error('random must be in [0,1)');let v=0;for(let i=0;i<symbols.length;i++){v+=weights[i];if(u<v)return symbols[i];}return symbols.at(-1);}
function spin(random=Math.random){const result=[reel(random),reel(random),reel(random)];let multiplier=0;
 if(result.every(x=>x==='CHERRY'))multiplier=3;
 else if(result.every(x=>x==='BELL'))multiplier=8;
 else if(result.every(x=>x==='STAR'))multiplier=18;
 else if(result.every(x=>x==='SEVEN'))multiplier=60;
 else if(result.filter(x=>x==='CHERRY').length===2)multiplier=1;
 return {result,multiplier};
}
const rouletteRed=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
function roulette(type='red',number=null,random=Math.random){const roll=Math.floor(random()*37);if(!Number.isInteger(roll)||roll<0||roll>36)throw Error('invalid wheel draw');
 let win=false;if(type==='red')win=rouletteRed.has(roll);else if(type==='black')win=roll>0&&!rouletteRed.has(roll);else if(type==='single'){if(!Number.isInteger(number)||number<0||number>36)throw Error('select a roulette number 0..36');win=roll===number;}else throw Error('unsupported roulette bet');
 return {result:roll,multiplier:win?(type==='single'?36:2):0};
}
function dice(random=Math.random){const a=1+Math.floor(random()*6),b=1+Math.floor(random()*6);if(a<1||a>6||b<1||b>6)throw Error('invalid die');return {result:[a,b],multiplier:a+b>=8?2:0};}
function play(wallet,game,wager,opt={},random=Math.random){
 if(!Number.isFinite(wallet)||wallet<0||!Number.isInteger(wager)||wager<=0||wager>wallet||wager>1000)throw Error('invalid wager/balance');
 let result;if(game==='slots')result=spin(random);else if(game==='roulette')result=roulette(opt.type||'red',opt.number??null,random);else if(game==='dice')result=dice(random);else throw Error('unknown game');
 const payout=wager*result.multiplier;
 return {game,wager,...result,payout,net:payout-wager,newWallet:wallet-wager+payout};
}
const rtp={rouletteEven:36/37,rouletteSingle:36/37,diceOver7:30/36,slots:(.4**3)*3+(.3**3)*8+(.2**3)*18+(.1**3)*60+(3*.4**2*.6)*1};
return {play,spin,reel,roulette,dice,rtp,rouletteRed,symbols,weights};
});
