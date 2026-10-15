/* v56: pure seeded offline RUSH experiment. This never touches wallet, saved data or crypto RNG.
 * The LCG generates reproducible samples for learning only; it is NOT used for real spins. */
(function(root,factory){const api=factory(typeof module!=='undefined'&&module.exports?require('./jackpot-rush-v54.js'):root.JackpotRushV54);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.RushStudyV56=api;})(typeof globalThis!=='undefined'?globalThis:this,function(R){'use strict';
const ACCEPTED=[200,1000,5000,20000];
function simulate(seed=2026,spins=1000){if(!Number.isSafeInteger(seed)||seed<0||seed>4294967295||!ACCEPTED.includes(spins))throw Error('Invalid seed or sample size');let x=seed>>>0,st=R.fresh(),paid=0,entries=0,ending=0,completed=0,streak5=0,streak10=0;const next=()=>((x=(Math.imul(x,1664525)+1013904223)>>>0)/4294967296);
 for(let i=0;i<spins;i++){const r=R.play(1e9,1,st,next);paid+=r.payout;st=r.state;if(r.event==='ENTRY_HIT')entries++;if(r.event==='RUSH_END'){ending+=r.previousState.streak;completed++;if(r.previousState.streak>=5)streak5++;if(r.previousState.streak>=10)streak10++;}}
 return {seed,spins,entries,paid,spent:spins,net:paid-spins,observedRtp:paid/spins,completedCycles:completed,unfinished:st.active,unfinishedStreak:st.active?st.streak:0,completedFivePlus:streak5,completedTenPlus:streak10,theoreticalRtp:R.theory().rtp,probabilityNoEntry:Math.pow(1-R.ENTRY,spins),rngState:x};}
 return {simulate,ACCEPTED};});
