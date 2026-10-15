/* v80: pure risk/repayment visibility. No random draws, save mutation or settlement.
 * All rates are fictional in-game chips; examples are NOT a promise of profit. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LuckRiskV80=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
function analyze(b,wallet,bankApi,needed=20){
 if(!bankApi.valid(b)||!Number.isSafeInteger(wallet)||wallet<0||wallet>100000000||!Number.isSafeInteger(needed)||needed<1||needed>1000)return null;
 const st=bankApi.status(b,wallet,needed);
 const maxInterest=Math.floor(b.totalBorrowed*.5);
 const nextPeriodic=b.principal>0?Math.max(0,Math.min(maxInterest-b.totalInterestCharged,Math.ceil(b.principal*.01))):0;
 const workCost=Math.max(0,Math.min(maxInterest-b.totalInterestCharged,Math.ceil(b.principal*.01)));
 const untilNext=50-b.spins%50;
 return {wallet,debt:st.debt,equity:st.equity,borrowAllowed:st.borrowAllowed,workAllowed:st.workAllowed,bankrupt:st.bankrupt,
  loanHeadroom:Math.max(0,bankApi.LIMIT-b.principal),borrowStep:bankApi.LOAN,
  untilNext,periodicInterest:nextPeriodic,workWage:300,workCost,workEquityGain:300-workCost,
  restoreByWork:st.workAllowed&&300-workCost>0,interestLimitRemaining:maxInterest-b.totalInterestCharged,
  principal:b.principal,interest:b.interest};
}
return Object.freeze({analyze});});
