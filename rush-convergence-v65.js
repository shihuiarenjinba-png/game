/* v65 independent seeded Monte Carlo using the exact RUSH play function. */
(function(root,factory){const api=factory(root.JackpotRushV54);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.RushConvergenceV65=api;})(typeof globalThis!=='undefined'?globalThis:this,function(R){'use strict';
function nextRng(seed){let x=seed>>>0||1;return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
function analyze(opt={}){const attempts=opt.attempts??1000,samples=opt.samples??60,seed=opt.seed??20261014;
 if(!R||!Number.isSafeInteger(seed)||seed<1||seed>0xffffffff||!Number.isSafeInteger(attempts)||![200,1000,5000].includes(attempts)||!Number.isInteger(samples)||samples<10||samples>100)throw Error('Invalid RUSH independent study');
 const rtps=[],hitCounts=[];for(let k=0;k<samples;k++){const r=nextRng((seed+Math.imul(k,7919))>>>0||1);let state=R.fresh(),stakeTotal=0,payoutTotal=0,entries=0,normal=0,spins=0;
 while(normal<attempts||state.active){const wasRush=state.active;if(!wasRush)normal++;const result=R.play(1000000000,1,state,r);if(result.event==='ENTRY_HIT')entries++;state=result.state;stakeTotal+=result.wager;payoutTotal+=result.payout;spins++;if(spins>attempts+100000)throw Error('Simulation safety limit');}
 rtps.push(payoutTotal/stakeTotal);hitCounts.push(entries);
 }
 const sorted=[...rtps].sort((a,b)=>a-b),pct=p=>sorted[Math.floor(p*(sorted.length-1))],avg=rtps.reduce((a,b)=>a+b,0)/samples,theory=R.theory().rtp;
 return {parameters:{attempts,samples,seed,independent:true},theoreticalRtp:theory,observedMean:avg,p10:pct(.1),median:pct(.5),p90:pct(.9),zeroEntryTrials:hitCounts.filter(x=>!x).length,entryMean:hitCounts.reduce((a,b)=>a+b,0)/samples,interpretation:'Normal-mode attempt counts are fixed; RUSH continuations complete even after the final entry. Observed mean of per-run RTP differs from pooled RTP. Uses the same RUSH transitions with independent seeded RNG, not current wallet, storage or game RNG.'};}
return {analyze};});
