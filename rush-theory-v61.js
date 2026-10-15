/* v61: theoretical event probabilities, pure arithmetic, no simulation/state. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.RushTheoryV61=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function analyze(entryOpportunities=[50,200,1000,5000]){if(!Array.isArray(entryOpportunities)||entryOpportunities.length<1||entryOpportunities.length>12||entryOpportunities.some(n=>!Number.isSafeInteger(n)||n<1||n>100000))throw Error('Invalid entry opportunities');
 const p=1/200,q=.72;const waits=entryOpportunities.map(n=>({n,expectedEntries:n*p,pNoEntry:Math.pow(1-p,n),pAtLeastOne:1-Math.pow(1-p,n)}));
 return {entryChance:p,continuationChance:q,waits,streaks:[2,5,10,20].map(k=>({hits:k,pAtLeast:Math.pow(q,k-1)})),meanHitsGivenEntry:1/(1-q),hasSimulation:false,note:'Entry opportunities count attempts in normal mode only; RUSH continuations are excluded. A run of N actual game spins need not include N entry attempts.'};}
return {analyze};});
