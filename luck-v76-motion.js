/* v76 kinetic presentation. Only animates a committed result. Never calls RNG, wallet or storage of game rounds. */
(function(root,factory){const api=factory(root);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LuckMotionV76=api;})(typeof globalThis!=='undefined'?globalThis:this,function(root){'use strict';
 const doc=root.document,$=id=>doc?.getElementById(id),KEY='lucklab:motion:v76';let seq=0,timers=[],speed='normal',last=null;
 const S={CHERRY:'🍒',BELL:'🔔',STAR:'★',SEVEN:'7'},D=['','⚀','⚁','⚂','⚃','⚄','⚅'];
 function safeLoad(){try{speed=JSON.parse(root.localStorage?.getItem(KEY)||'null')?.speed==='fast'?'fast':'normal';}catch(_){speed='normal';}}
 function reduced(){return !!(doc?.body?.classList.contains('v74-minimal-motion')||root.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);}
 function delay(fn,ms){const id=root.setTimeout(fn,ms);timers.push(id);}
 function clear(){++seq;for(const id of timers)root.clearTimeout(id);timers=[];doc?.querySelectorAll('.v76-rolling,.v76-roll-win,.v76-wheel-roll,.v76-dice-roll').forEach(el=>el.classList.remove('v76-rolling','v76-roll-win','v76-wheel-roll','v76-dice-roll'));}
 function disable(on){for(const id of ['roulettePlay','slotPlay','dicePlay','rushPlay','v73Fast10','v73Fast50']){const el=$(id);if(el)el.disabled=on;}}
 function finish(o){if(!o)return;clear();disable(false); // Bank/UI may have disabled controls: restore their actual current rules via a custom passive event.
  doc?.dispatchEvent(new CustomEvent('lucklab:v76-motion-finished'));
  const stage=$('v73Theater');if(stage)stage.classList.remove('v76-playing');
  if(o.which==='rush'){const cell=o.event==='ENTRY_HIT'||o.event==='RUSH_HIT'?['7','7','7']:o.event==='RUSH_END'?['●','◆','●']:['✧','✦','✧'];cell.forEach((v,i)=>{if($('v75Reel'+(i+1)))$('v75Reel'+(i+1)).textContent=v;});}
  if(o.which==='slots'&&Array.isArray(o.result))o.result.forEach((v,i)=>{if($('v75Slot'+(i+1)))$('v75Slot'+(i+1)).textContent=S[v]||'—';});
  if(o.which==='roulette'&&$('v75RouletteNumber'))$('v75RouletteNumber').textContent=String(o.result);
  if(o.which==='dice'&&Array.isArray(o.result))o.result.forEach((v,i)=>{if($('v75Die'+(i+1)))$('v75Die'+(i+1)).textContent=D[v]||'?';});
  if($('v73Payout')&&o.which==='rush')$('v73Payout').textContent=o.payout.toLocaleString();
  if(o.payout>o.wager && !reduced())chips(o.which==='rush'?'v73Theater':o.which==='slots'?'v75Slot1':o.which==='roulette'?'v75RouletteWheel':'v75Die1');
 }
 function chips(id){const anchor=$(id);if(!anchor||!anchor.parentElement)return;const parent=anchor.parentElement;
  const layer=doc.createElement('div');layer.className='v76-chips';layer.setAttribute('aria-hidden','true');for(let i=0;i<12;i++){const node=doc.createElement('span');node.className='v76-chip';node.style.setProperty('--vx',Math.round(Math.cos(i*2.39996)*(34+i%4*13))+'px');node.style.setProperty('--vy',Math.round(-34-Math.sin(i*2.39996)*(20+i%4*9))+'px');node.style.setProperty('--vd',String(i*26)+'ms');layer.appendChild(node);}parent.appendChild(layer);delay(()=>layer.remove(),900);
 }
 function notify(o){if(!o||!['slots','roulette','dice','rush'].includes(o.which))return;clear();last=o;
  const base=speed==='fast'?310:780;if(reduced()){finish(o);return;}
  const token=seq,stage=$('v73Theater');if(stage&&o.which==='rush')stage.classList.add('v76-playing');
  disable(true);
  if(o.which==='slots'||o.which==='rush'){
   const prefix=o.which==='slots'?'v75Slot':'v75Reel',duration=[base*.62,base*.82,base],glyphs=['7','🍒','🔔','★'];
   for(let i=0;i<3;i++){const cell=$(prefix+(i+1));if(!cell)continue;cell.classList.add('v76-rolling');let frame=0,stopped=false;
    const pulse=()=>{if(seq!==token||stopped)return;cell.textContent=glyphs[(frame*3+i*2)%4];frame++;delay(pulse,75);};pulse();
    delay(()=>{if(seq!==token)return;stopped=true;cell.classList.remove('v76-rolling');cell.textContent=o.which==='slots'?S[o.result[i]]:(o.event==='ENTRY_HIT'||o.event==='RUSH_HIT'?'7':o.event==='RUSH_END'?['●','◆','●'][i]:['✧','✦','✧'][i]);cell.classList.add('v76-roll-win');},duration[i]);
   }
  }else if(o.which==='roulette'){$('v75RouletteWheel')?.classList.add('v76-wheel-roll');if($('v75RouletteNumber'))$('v75RouletteNumber').textContent='·';}
  else if(o.which==='dice')for(let i=1;i<=2;i++){$('v75Die'+i)?.classList.add('v76-dice-roll');if($('v75Die'+i))$('v75Die'+i).textContent='⚄';}
  if(o.which==='rush'&&$('v73Payout'))$('v73Payout').textContent='•••';
  delay(()=>{if(seq===token)finish(o);},base+100);
 }
 function skip(){if(last)finish(last);}
 function init(){if(!$('v76Speed'))return;safeLoad();$('v76Speed').value=speed;$('v76Speed').addEventListener('change',e=>{speed=e.target.value==='fast'?'fast':'normal';try{root.localStorage?.setItem(KEY,JSON.stringify({speed}));}catch(_){}skip();});$('v76Skip').addEventListener('click',skip);root.addEventListener?.('pagehide',clear);}
 if(doc){if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',init,{once:true});else init();}
 return {notify,skip,reduced,getSpeed:()=>speed};
});
