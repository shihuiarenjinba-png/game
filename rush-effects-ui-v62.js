/* v62 optional visual feedback: post-result DOM only; NO random numbers, betting or storage. */
(function(){'use strict';const button=document.getElementById('rushPlay'),banner=document.getElementById('rushV55Banner'),stage=document.getElementById('rushV62Stage');if(!button||!banner||!stage)return;
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');let lastText='';
function show(){const raw=banner.textContent||'',ja=document.documentElement.lang==='ja',hit=banner.classList.contains('rush-hit'),end=banner.classList.contains('rush-end');stage.classList.remove('v62-hit','v62-end');void stage.offsetWidth;if(hit){stage.textContent=ja?'★ RUSH当選！連チャンを狙おう':'★ RUSH HIT! Chase the streak';stage.classList.add('v62-hit');}
 else if(end){stage.textContent=ja?'RUSH終了 — 累計払戻を確認':'RUSH over — review total payout';stage.classList.add('v62-end');}
 else{stage.textContent=ja?'通常抽選 — 次回の当たりは保証されません':'Normal draw — next hit is never guaranteed';}
 stage.dataset.effect=reduced?.matches?'reduced':hit?'hit':end?'end':'normal';lastText=raw;}
button.addEventListener('click',()=>{const current=banner.textContent||'';if(current!==lastText||banner.classList.contains('rush-hit')||banner.classList.contains('rush-end'))show();});
document.getElementById('lang')?.addEventListener('click',show);show();})();
