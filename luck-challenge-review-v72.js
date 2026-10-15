/* v72 session-only challenge recap; no extra draws, no mutation of game state. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root&&root.document)api.mount(root.document,root);})(typeof window!=='undefined'?window:null,function(){'use strict';
function recap(start,end,gain){if(![start,end,gain].every(x=>Number.isSafeInteger(x))||start<0||end<0||gain<=0)throw Error('invalid recap');const net=end-start;return Object.freeze({net,achieved:net>=gain,progress:Math.min(100,Math.max(0,100*net/gain)),start,end,gain});}
function mount(doc,win){const box=doc.getElementById('v72ChallengeReview'),startBtn=doc.getElementById('v71GoalStart'),bal=doc.getElementById('balance'),finish=doc.getElementById('v72FinishGoal'),out=doc.getElementById('v72ReviewText');if(!box||!startBtn||!bal||!finish)return false;
 let run=null;const records=[];const read=()=>Number((bal.textContent||'').replace(/[^0-9]/g,''));
 doc.addEventListener('lucklab:v76-finance',()=>{run=null;out.textContent=doc.documentElement.lang==='en'?'Financing canceled the ongoing wallet-only goal; start again.':'融資・返済・労働による残高変化を勝敗と混同しないため挑戦を終了しました。';});startBtn.addEventListener('click',()=>{const base=read(),gain=Number(doc.getElementById('v71GoalTarget').value);if(Number.isSafeInteger(base)&&base>=0&&[200,500,1000].includes(gain)){run={base,gain};out.textContent=doc.documentElement.lang==='en'?'Challenge in progress; finish to review.':'挑戦中です。終了すると結果を振り返れます。';}});
 finish.addEventListener('click',()=>{if(!run){out.textContent=doc.documentElement.lang==='en'?'Start a goal first.':'先に目標を開始してください。';return;}
  let result;try{result=recap(run.base,read(),run.gain);}catch(e){out.textContent='Invalid balance / 残高を確認してください';return;}
  records.push(result);if(records.length>5)records.shift();run=null;const ja=doc.documentElement.lang!=='en';const score=records.filter(x=>x.achieved).length;
  out.textContent=(ja?'今回の純増減 ':'Net change ')+(result.net>=0?'+':'')+result.net+(ja?'チップ / 目標 +':' credits / target +')+result.gain+' · '+(result.achieved?(ja?'達成':'achieved'):(ja?'未達':'not reached'))+' · '+(ja?'このページ内の達成数 ':'Page-session successes ')+score+'/'+records.length;
 });return true;
}
return Object.freeze({recap,mount});});
