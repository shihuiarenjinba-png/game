/* v71: optional goal challenge; observes balance only, no save, RNG or stake changes. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root&&root.document)api.mount(root.document,root);})(typeof window!=='undefined'?window:null,function(){'use strict';
 function progress(balance,base,target){if(!Number.isSafeInteger(balance)||balance<0||!Number.isSafeInteger(base)||base<0||!Number.isSafeInteger(target)||target<=base)throw Error('invalid challenge numbers');
  const fraction=Math.max(0,Math.min(1,(balance-base)/(target-base)));
  return {balance,base,target,fraction,achieved:balance>=target,bankrupt:balance===0};}
 function mount(doc,win){const start=doc.getElementById('v71GoalStart'),target=doc.getElementById('v71GoalTarget'),output=doc.getElementById('v71GoalText'),track=doc.getElementById('v71GoalBar'),bal=doc.getElementById('balance');if(!start||!bal)return false;
  let challenge=null,refillNotice=false;const read=()=>Number((bal.textContent||'').replace(/[^0-9]/g,''));
  function render(){const ja=doc.documentElement.lang!=='en';if(!challenge){output.textContent=refillNotice?(ja?'借入・返済・労働が行われたため目標を再設定してください。':'Finance action: start a new challenge.'):(ja?'目標を選んで開始してください。実際の抽選・残高・保存には影響しません。':'Choose a target to begin. This does not affect odds, credits or saves.');track.style.width='0%';return;}
   let s;try{s=progress(read(),challenge.base,challenge.target);}catch(e){output.textContent='—';return;}
   track.style.width=(100*s.fraction).toFixed(1)+'%';output.textContent=(ja?'開始時 ':'Starting ')+s.base+' → '+(ja?'現在 ':'Current ')+s.balance+' / '+(ja?'目標 ':'Goal ')+s.target+' · '+(s.achieved?(ja?'目標達成！':'Goal reached!'):s.bankrupt?(ja?'チップがなくなりました。':'Out of credits.'):(ja?'挑戦中':'In progress'));
  }
  start.addEventListener('click',()=>{const base=read(),gain=Number(target.value);if(!Number.isSafeInteger(base)||base<0||base>=100000000||![200,500,1000].includes(gain))return;challenge={base,target:base+gain};refillNotice=false;render();});
  doc.addEventListener('lucklab:v76-finance',()=>{challenge=null;refillNotice=true;render();output.textContent=doc.documentElement.lang==='en'?'Financing changed; consult the equity figures and start a new challenge.':'融資・返済・労働が行われました。債務を含む純資産の比較は信用金庫欄で確認してください。';});new MutationObserver(render).observe(bal,{childList:true,characterData:true,subtree:true});doc.getElementById('lang').addEventListener('click',()=>queueMicrotask(render));render();return true;
 }
 return Object.freeze({progress,mount});
});
