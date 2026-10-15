/* Fictional story credit twist. No real-world obligations, payments or conversions.
   Uses cumulative focused ACTIVE play, not wall-clock time. Pure immutable state.
   Old saves lacking this field remain legacy. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LuckStoryV84=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const SECONDS=120*60, LOSS=2000, DEBT_CAP=3000, GRANT=1000, MAX=100000000;
function fresh(){return {phase:'trial',activeSeconds:0,granted:GRANT,refills:0,rounds:0,convertedPrincipal:0};}
function legacy(){return {...fresh(),phase:'legacy',granted:0};}
function valid(s){return !!s&&typeof s==='object'&&['trial','converted','legacy'].includes(s.phase)&&Number.isSafeInteger(s.activeSeconds)&&s.activeSeconds>=0&&s.activeSeconds<=MAX&&Number.isSafeInteger(s.granted)&&s.granted>=0&&s.granted<=MAX&&Number.isSafeInteger(s.refills)&&s.refills>=0&&s.refills<=MAX&&Number.isSafeInteger(s.rounds)&&s.rounds>=0&&s.rounds<=MAX&&Number.isSafeInteger(s.convertedPrincipal)&&s.convertedPrincipal>=0&&s.convertedPrincipal<=DEBT_CAP&&s.convertedPrincipal%1000===0&&s.granted===(s.phase==='legacy'?0:GRANT+s.refills*GRANT)&&(s.phase==='trial'?s.convertedPrincipal===0:true);}
function ensure(s){if(!valid(s))throw Error('Invalid story save');}
function active(s,seconds){ensure(s);if(!Number.isSafeInteger(seconds)||seconds<0||seconds>10)throw Error('invalid active interval');return {...s,activeSeconds:Math.min(MAX,s.activeSeconds+seconds)};}
function complete(s){ensure(s);return {...s,rounds:Math.min(MAX,s.rounds+1)};}
function offer(s,wallet,required=1){ensure(s);return s.phase==='trial'&&Number.isSafeInteger(wallet)&&wallet>=0&&wallet<=MAX-GRANT&&Number.isSafeInteger(required)&&required>0&&required<=1000&&wallet<required;}
function grant(s,wallet,required=1){if(!offer(s,wallet,required))throw Error('trial chips are not available');return {story:{...s,granted:s.granted+GRANT,refills:s.refills+1},wallet:wallet+GRANT};}
function loss(s,wallet){ensure(s);if(!Number.isSafeInteger(wallet)||wallet<0||wallet>MAX)throw Error('invalid wallet');return Math.max(0,s.granted-wallet);}
function due(s,wallet){ensure(s);if(s.phase!=='trial'||s.activeSeconds<SECONDS||loss(s,wallet)<LOSS)return 0;return Math.min(DEBT_CAP,Math.ceil(loss(s,wallet)/1000)*1000);}
function convert(s,wallet,bank){const principal=due(s,wallet);if(principal===0)throw Error('story threshold not met');if(!bank||Object.values(bank).some(v=>v!==0))throw Error('story requires a debt-free trial');const interest=principal/100;
 return {story:{...s,phase:'converted',convertedPrincipal:principal},bank:{...bank,principal,interest,totalBorrowed:principal,totalInterestCharged:interest,loans:principal/1000},wallet,principal,interest};}
return Object.freeze({SECONDS,LOSS,DEBT_CAP,GRANT,fresh,legacy,valid,active,complete,offer,grant,loss,due,convert});});
