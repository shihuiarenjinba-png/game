/* Visual-only projection of committed outcomes. Never draws random numbers or updates wallet/save. */
(function(root,factory){const api=factory(root);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LuckVisualV75=api;})(typeof globalThis!=='undefined'?globalThis:this,function(root){'use strict';
const $=id=>root.document?.getElementById(id);
const RED=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const SYM={CHERRY:'🍒',BELL:'🔔',STAR:'★',SEVEN:'7'};
const PIPS=['','⚀','⚁','⚂','⚃','⚄','⚅'];
const validOutcome=o=>o&&typeof o==='object'&&['rush','roulette','slots','dice'].includes(o.which);
function reelDisplay(outcome){const o=validOutcome(outcome)&&outcome.which==='rush'?outcome:null;
  const hit=o&&['ENTRY_HIT','RUSH_HIT'].includes(o.event),ended=o&&o.event==='RUSH_END';
  return hit?['7','7','7']:ended?['●','◆','●']:['✧','✦','✧'];
}
function rouletteColor(n){return !Number.isInteger(n)||n<0||n>36?'none':n===0?'green':RED.has(n)?'red':'black';}
function sync(data){if(!$('v75Reel1'))return;
 const en=data?.lang==='en',o=validOutcome(data?.lastOutcome)?data.lastOutcome:null,active=!!data?.rushState?.active;
 const cells=reelDisplay(o);cells.forEach((v,i)=>{$('v75Reel'+(i+1)).textContent=v;});
 $('v75Marquee').textContent=active?(en?'BONUS ROUND • 72%':'継続チャレンジ • 72%'):o?.which==='rush'&&o.event==='RUSH_END'?(en?'RUSH FINISHED':'RUSH 終了'):o?.which==='rush'&&o.event==='ENTRY_HIT'?(en?'JACKPOT UNLOCKED':'初当たり · RUSH突入'):(en?'THE NEXT SPIN IS YOURS':'次の抽選を待機中');
 $('v75StageTitle').textContent=en?'JACKPOT THEATER':'ジャックポット・ステージ';
 $('v75OtherHeading').textContent=en?'OTHER GAMES • 3 TABLES':'OTHER GAMES • 3つの遊び';
 $('v75RoulBadge').textContent=en?'WHEEL / 0–36':'WHEEL / 0〜36';
 $('v75SlotBadge').textContent=en?'3 REELS':'3 REELS / 3リール';
 $('v75DiceBadge').textContent=en?'2 DICE':'2 DICE / 2個';
 const r=o?.which==='roulette'?o:null;
 if(r&&Number.isInteger(r.result)&&r.result>=0&&r.result<=36){$('v75RouletteNumber').textContent=String(r.result);$('v75RouletteWheel').dataset.color=rouletteColor(r.result);$('v75RouletteNote').textContent=(en?'Result ':'出目 ')+r.result+(r.net>=0?' • +':' • ')+r.net;}
 else{$('v75RouletteNumber').textContent='?';$('v75RouletteWheel').dataset.color='none';$('v75RouletteNote').textContent=en?'Spin to reveal':'結果は抽選後に表示';}
 const s=o?.which==='slots'&&Array.isArray(o.result)&&o.result.length===3&&o.result.every(x=>Object.prototype.hasOwnProperty.call(SYM,x))?o:null;
 for(let i=0;i<3;i++)$('v75Slot'+(i+1)).textContent=s?SYM[s.result[i]]:'—';
 $('v75SlotsNote').textContent=s?(en?'Payout ':'払戻 ')+s.payout+(s.net>=0?' / +':' / ')+s.net:(en?'Awaiting spin':'結果は抽選後に表示');
 const d=o?.which==='dice'&&Array.isArray(o.result)&&o.result.length===2&&o.result.every(x=>Number.isInteger(x)&&x>=1&&x<=6)?o:null;
 $('v75Die1').textContent=d?PIPS[d.result[0]]:'?';$('v75Die2').textContent=d?PIPS[d.result[1]]:'?';
 $('v75DiceNote').textContent=d?(en?'Total ':'合計 ')+(d.result[0]+d.result[1])+(d.net>=0?' / +':' / ')+d.net:(en?'Awaiting roll':'結果は抽選後に表示');
}
function notify(outcome){if(!validOutcome(outcome))return;const stage=$('v73Theater');if(!stage)return;
 stage.classList.remove('v75-enter-anim','v75-hit-anim','v75-end-anim');for(let i=1;i<=3;i++)$('v75Reel'+i)?.classList.remove('v75-pop');
 const reduced=root.document?.body?.classList.contains('v74-minimal-motion')||root.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 if(reduced)return;
 if(outcome.which==='rush'&&['ENTRY_HIT','RUSH_HIT','RUSH_END'].includes(outcome.event)){
 void stage.offsetWidth;
 stage.classList.add(outcome.event==='ENTRY_HIT'?'v75-enter-anim':outcome.event==='RUSH_HIT'?'v75-hit-anim':'v75-end-anim');
 if(outcome.event!=='RUSH_END')for(let i=1;i<=3;i++)$('v75Reel'+i)?.classList.add('v75-pop');
 }
}
return{sync,notify,reelDisplay,rouletteColor};
});
