/* v64 independent-play probability reminder. No RNG, save, wager or pay path. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.RushIndependenceV64=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const q=.72;function explain(streak,upcoming=3){if(!Number.isSafeInteger(streak)||streak<0||streak>1000||!Number.isSafeInteger(upcoming)||upcoming<1||upcoming>50)throw Error('Invalid streak scenario');return {previousWins:streak,nextWin:q,nextLoss:1-q,atLeastUpcomingWins:Math.pow(q,upcoming),upcoming,unconditionalAtLeastFromEntry:Math.pow(q,streak+upcoming),alreadyWonIsHistory:true,statement:'Past wins do not change the next independent 72% RUSH spin.'};}
return {explain};});
