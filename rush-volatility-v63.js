/* v63 theoretical RUSH distributions. Pure analytical arithmetic, never calls RNG. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.RushVolatilityV63=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 const p=1/200,q=.72;
 function analyze(n=200,streaks=[1,2,3,5,10,20]){
 if(!Number.isSafeInteger(n)||n<1||n>100000||!Array.isArray(streaks)||streaks.length<1||streaks.length>16||streaks.some(k=>!Number.isInteger(k)||k<1||k>1000))throw Error('Invalid RUSH theoretical scenario');
 const atLeast=streaks.map(k=>({hits:k,probability:Math.pow(q,k-1),exact:Math.pow(q,k-1)*(1-q)}));
 return {normalAttempts:n,hitProbability:p,noEntry:Math.pow(1-p,n),atLeastOneEntry:1-Math.pow(1-p,n),medianNormalWait:Math.ceil(Math.log(.5)/Math.log(1-p)),meanNormalWait:1/p,medianRushWins:Math.ceil(Math.log(.5)/Math.log(q)),meanRushWins:1/(1-q),streaks:atLeast,rtp:(189+4*q/(1-q))/(1/p+1/(1-q)),hypothetical:true};
 }
 return {analyze};});
