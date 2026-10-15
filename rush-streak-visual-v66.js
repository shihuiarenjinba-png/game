/* v66: theoretical RUSH streak survival and seeded engine-based experiment. Read-only. */
(function(root,factory){const api=factory(root.JackpotRushV54);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.RushStreakVisualV66=api;})(typeof globalThis!=='undefined'?globalThis:this,function(R){'use strict';
function rng(seed){let x=seed>>>0||1;return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
function analyze(opt={}){const seed=opt.seed??20261014,normalAttempts=opt.normalAttempts??1000,samples=opt.samples??60;
 if(!R||!Number.isSafeInteger(seed)||seed<1||seed>0xffffffff||!Number.isInteger(normalAttempts)||![200,1000,5000].includes(normalAttempts)||!Number.isInteger(samples)||samples<10||samples>100)throw Error('Invalid RUSH analysis');
 const buckets={one:0,two:0,threeToFour:0,fiveToNine:0,tenPlus:0},waits=[],streaks=[];let spins=0,entries=0;
 for(let k=0;k<samples;k++){const rd=rng((seed+Math.imul(k,7919))>>>0||1);let state=R.fresh(),normal=0,sinceEntry=0,streak=0,runSpins=0;
  while(normal<normalAttempts||state.active){const wasActive=state.active;if(!wasActive){normal++;sinceEntry++;}const x=R.play(1e9,1,state,rd);state=x.state;runSpins++;spins++;
   if(x.event==='ENTRY_HIT'){entries++;waits.push(sinceEntry);sinceEntry=0;streak=1;}
   else if(wasActive){if(state.active)streak++;else {streaks.push(streak);if(streak===1)buckets.one++;else if(streak===2)buckets.two++;else if(streak<=4)buckets.threeToFour++;else if(streak<=9)buckets.fiveToNine++;else buckets.tenPlus++;streak=0;}}
   if(runSpins>normalAttempts+100000)throw Error('Simulation safety limit');
  }
 }
 const theory=R.theory();const survival=[1,2,3,5,10].map(n=>({winsAtLeast:n,probability:Math.pow(.72,n-1),observed:streaks.length?streaks.filter(x=>x>=n).length/streaks.length:0}));
 const median=a=>{if(!a.length)return null;const s=[...a].sort((x,y)=>x-y);return s[Math.floor((s.length-1)*.5)];};
 return {parameters:{seed,normalAttempts,samples,independent:true},theory:{initialHitProbability:1/200,continuationProbability:.72,rtp:theory.rtp},entries,spinCount:spins,streaks:streaks.length,medianWait:median(waits),medianStreak:median(streaks),buckets,survival,disclaimer:'The next continuation is always 72% under this model regardless of history. These are independent seeded experiments with the actual RUSH play transitions. No wallet, save, game RNG or prizes are affected.'};
}
return {analyze};});
