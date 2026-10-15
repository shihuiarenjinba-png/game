/* v67 statistical interval for simulated streak results; no game-state changes. */
(function(root,factory){const a=factory(root.RushStreakVisualV66);if(typeof module!=='undefined'&&module.exports)module.exports=a;root.RushIntervalsV67=a;})(typeof globalThis!=='undefined'?globalThis:this,function(R){'use strict';
function wilson(successes,n){if(!Number.isInteger(n)||n<0||!Number.isInteger(successes)||successes<0||successes>n)throw Error('Invalid proportion count');if(n===0)return {low:null,high:null};const p=successes/n,z=1.959963984540054,scale=1+z*z/n,centre=(p+z*z/(2*n))/scale,half=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/(scale);return {low:successes===0?0:Math.max(0,centre-half),high:successes===n?1:Math.min(1,centre+half)};}
function analyze(opt={}){
 if(!R||!R.analyze)throw Error('v66 rush engine unavailable');const result=R.analyze(opt),n=result.streaks;
 const streaks=result.survival.map(x=>{const successes=Math.round(x.observed*n),bounds=wilson(successes,n);return {...x,count:successes,total:n,...bounds};});
 return {parameters:result.parameters,entries:result.entries,streaks,medianWait:result.medianWait,zeroHitProbability:Math.pow(1-result.theory.initialHitProbability,result.parameters.normalAttempts),disclaimer:'95% Wilson interval is a descriptive binomial approximation for completed RUSH streaks. It ignores between-session dependence and is not a guarantee; small samples can vary widely. No saved chips or live draws are touched.'};
}
return {analyze,wilson};});
