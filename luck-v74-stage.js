/* v74 presentation ONLY: no probability, wallet, outcome or game-save writes.
   User-initiated audio is synthesized locally; no downloaded assets. */
(function(root,factory){const api=factory(root);if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LuckPresentationV74=api;})(typeof globalThis!=='undefined'?globalThis:this,function(root){'use strict';
 const $=id=>root.document?.getElementById(id);const KEY='lucklab:presentation:v74';
 const d={sound:false,motion:false,volume:35};let settings={...d},audio=null;
 function safeLoad(){try{const obj=JSON.parse(root.localStorage?.getItem(KEY)||'null');if(obj&&typeof obj==='object')settings={sound:obj.sound===true,motion:obj.motion===true,volume:Number.isSafeInteger(obj.volume)?Math.min(100,Math.max(0,obj.volume)):35};}catch(_){settings={...d};}}
 function persist(){try{root.localStorage?.setItem(KEY,JSON.stringify(settings));}catch(_){} }
 function reducedMotion(){return settings.motion||root.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;}
 function applySettings(){if(!$('v74Sound'))return;$('v74Sound').checked=settings.sound;$('v74Motion').checked=settings.motion;$('v74Volume').value=String(settings.volume);$('v74Volume').disabled=!settings.sound;$('v74VolumeValue').textContent=settings.volume+'%';$('v74Sound').closest('.v74-options')?.setAttribute('data-sound-off',String(!settings.sound));root.document.body.classList.toggle('v74-minimal-motion',reducedMotion());}
 function sync(data){if(!$('v74EndCard'))return;
  const en=data.lang==='en',o=data.lastOutcome;const isEnd=!!(o&&o.which==='rush'&&o.event==='RUSH_END');
  const panel=$('v74EndCard');panel.hidden=!isEnd;
  $('v74SettingsTitle').textContent=en?'Presentation settings (never affects odds)':'演出設定（抽選結果には影響しません）';
  $('v74SoundLabel').textContent=en?'Sound effects (off by default)':'効果音（初期オフ）';
  $('v74MotionLabel').textContent=en?'Reduce animation':'動きを軽減';
  $('v74VolumeLabel').textContent=en?'Volume':'音量';
  $('v74Symbol').textContent=o?.which==='rush'&&o.event==='ENTRY_HIT'?'7':o?.which==='rush'&&o.event==='RUSH_HIT'?'7':o?.which==='rush'&&o.event==='RUSH_END'?'◆':'✦';
  if(isEnd){const streak=o.streak,stake=o.wager;const payout=Number((stake*o.cycleMultiplier).toFixed(0));const cost=(streak+1)*stake;const net=payout-cost;
   $('v74EndHead').textContent=en?'RUSH FINISHED · YOUR RESULT':'RUSH終了 · 今回の記録';
   $('v74EndStreakLabel').textContent=en?'Hits':'連チャン';
   $('v74EndPayoutLabel').textContent=en?'Cycle payout':'累計払戻';
   $('v74EndNetLabel').textContent=en?'Cycle net':'RUSH区間の差引';
   $('v74EndStreak').textContent=streak.toLocaleString();$('v74EndPayout').textContent=payout.toLocaleString();$('v74EndNet').textContent=(net>0?'+':'')+net.toLocaleString();
   $('v74EndNote').textContent=en?'Excludes misses before entry. Includes the losing final continuation bet.':'突入前の外れは含みません。終了時の外れ賭金を含みます。';
  }
  applySettings();
 }
 function tone(freq,when,duration,volume,ac){const osc=ac.createOscillator();const gain=ac.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(0,when);gain.gain.linearRampToValueAtTime(volume,when+.018);gain.gain.exponentialRampToValueAtTime(.0001,when+duration);osc.connect(gain);gain.connect(ac.destination);osc.start(when);osc.stop(when+duration+.02);}
 function playSound(event){if(!settings.sound||!settings.volume||!['ENTRY_HIT','RUSH_HIT','RUSH_END'].includes(event))return;try{const C=root.AudioContext||root.webkitAudioContext;if(!C)return;if(!audio)audio=new C();if(audio.state==='suspended')audio.resume?.();const t=audio.currentTime+.018,vol=settings.volume/100*.085;const notes=event==='ENTRY_HIT'?[523.25,659.25,783.99]:event==='RUSH_HIT'?[587.33,783.99]:[392,329.63];notes.forEach((n,i)=>tone(n,t+i*.085,.21,vol,audio));}catch(_){/* audio errors never block play */}}
 function notify(outcome,lang,meta){if(!outcome||outcome.which!=='rush'||!$('v73Theater'))return;
  const stage=$('v73Theater');stage.classList.remove('v74-animate-win','v74-animate-end');
  if(!reducedMotion()&&['ENTRY_HIT','RUSH_HIT','RUSH_END'].includes(outcome.event)){
   void stage.offsetWidth;stage.classList.add(outcome.event==='RUSH_END'?'v74-animate-end':'v74-animate-win');
  }
  playSound(outcome.event);
 }
 function init(){if(!$('v74Sound'))return;safeLoad();applySettings();
  $('v74Sound').addEventListener('change',e=>{settings.sound=!!e.target.checked;persist();applySettings();});
  $('v74Motion').addEventListener('change',e=>{settings.motion=!!e.target.checked;persist();applySettings();});
  $('v74Volume').addEventListener('input',e=>{settings.volume=Math.min(100,Math.max(0,Number(e.target.value)||0));persist();applySettings();});
  root.matchMedia?.('(prefers-reduced-motion: reduce)')?.addEventListener?.('change',applySettings);
 }
 if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',init,{once:true});else init();}
 return {sync,notify,getSettings:()=>({...settings}),calculateResult:(streak,stake,payout)=>({streak,payout,cost:(streak+1)*stake,net:payout-(streak+1)*stake})};
});
