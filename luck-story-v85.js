/* v85 fictional play-credit story: activity milestones only, NO clock requirement.
   No cash payments, redemptions or real-world repayment obligations.
   v84 state can be migrated without altering accrued bank debt. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LuckStoryV85=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const GRANT=1000, DEBT_CAP=3000, WAGER_LIMIT=6000, PROFIT_LIMIT=5000, FREE_GRANT_LIMIT=4000, LOSS=2000, MAX=100000000;
function fresh(){return {phase:'trial',granted:GRANT,refills:0,rounds:0,wagered:0,convertedPrincipal:0};}
function legacy(){return {...fresh(),phase:'legacy',granted:0};}
function valid(s){return !!s&&typeof s==='object'&&!Array.isArray(s)&&['trial','converted','legacy'].includes(s.phase)&&['granted','refills','rounds','wagered','convertedPrincipal'].every(k=>Number.isSafeInteger(s[k])&&s[k]>=0&&s[k]<=MAX)&&s.convertedPrincipal<=DEBT_CAP&&s.convertedPrincipal%GRANT===0&&s.granted===(s.phase==='legacy'?0:GRANT+s.refills*GRANT)&&(s.phase==='trial'?s.convertedPrincipal===0:true);}
function ensure(s){if(!valid(s))throw Error('Invalid v85 story save');}
function migrateV84(s){if(!s||typeof s!=='object'||!['trial','converted','legacy'].includes(s.phase)||!Number.isSafeInteger(s.activeSeconds)||s.activeSeconds<0||s.activeSeconds>MAX||!Number.isSafeInteger(s.refills)||s.refills<0||s.refills>MAX||!Number.isSafeInteger(s.rounds)||s.rounds<0||s.rounds>MAX||!Number.isSafeInteger(s.granted)||s.granted<0||s.granted>MAX||!Number.isSafeInteger(s.convertedPrincipal)||s.convertedPrincipal<0||s.convertedPrincipal>DEBT_CAP||s.convertedPrincipal%GRANT!==0||s.granted!==(s.phase==='legacy'?0:GRANT+s.refills*GRANT)||(s.phase==='trial'&&s.convertedPrincipal!==0))throw Error('Invalid v84 story save');
 const result={phase:s.phase,granted:s.granted,refills:s.refills,rounds:s.rounds,wagered:0,convertedPrincipal:s.convertedPrincipal};ensure(result);return result;}
function play(s,rounds,stake){ensure(s);if(!Number.isSafeInteger(rounds)||rounds<1||rounds>50||!Number.isSafeInteger(stake)||stake<0||stake>rounds*1000)throw Error('Invalid paid play');return {...s,rounds:Math.min(MAX,s.rounds+rounds),wagered:Math.min(MAX,s.wagered+stake)};}
function offer(s,wallet,required=1){ensure(s);return s.phase==='trial'&&Number.isSafeInteger(wallet)&&wallet>=0&&wallet<=MAX-GRANT&&Number.isSafeInteger(required)&&required>0&&required<=1000&&wallet<required&&s.granted<=MAX-GRANT;}
function grant(s,wallet,required=1){if(!offer(s,wallet,required))throw Error('Trial chips not available');return {story:{...s,granted:s.granted+GRANT,refills:s.refills+1},wallet:wallet+GRANT};}
function loss(s,wallet){ensure(s);if(!Number.isSafeInteger(wallet)||wallet<0||wallet>MAX)throw Error('Invalid wallet');return Math.max(0,s.granted-wallet);}
function cause(s,wallet){ensure(s);if(!Number.isSafeInteger(wallet)||wallet<0||wallet>MAX)throw Error('Invalid wallet');if(s.phase!=='trial')return null;
 if(wallet-s.granted>=PROFIT_LIMIT)return 'BIG_WIN';
 if(s.granted>=FREE_GRANT_LIMIT&&loss(s,wallet)>=LOSS)return 'FREE_CREDIT_USE';
 if(s.wagered>=WAGER_LIMIT)return 'TOTAL_STAKES';
 return null;}
function due(s,wallet){return cause(s,wallet)?Math.min(DEBT_CAP,s.granted):0;}
function convert(s,wallet,bank){const principal=due(s,wallet),reason=cause(s,wallet);if(principal===0)throw Error('Story threshold not met');if(!bank||Object.values(bank).some(v=>v!==0))throw Error('Requires debt-free free-play period');const interest=principal/100;
 const story={...s,phase:'converted',convertedPrincipal:principal};ensure(story);return {story,bank:{...bank,principal,interest,totalBorrowed:principal,totalInterestCharged:interest,loans:principal/GRANT},wallet,principal,interest,reason};}
return Object.freeze({GRANT,DEBT_CAP,WAGER_LIMIT,PROFIT_LIMIT,FREE_GRANT_LIMIT,LOSS,fresh,legacy,valid,migrateV84,play,offer,grant,loss,cause,due,convert});});
