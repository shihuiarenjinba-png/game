/* v83: visual-only authentic directional baccarat squeeze. Settlement is authoritative in core.
   Stage sequence: dealer deals four; vertical edge; lateral edge; whole card; third-card draw (if any).
   Rank and suit reveal marks are derived from the ALREADY SETTLED card, never generated separately. */
(function(root){'use strict';
 const $=id=>document.getElementById(id),B=()=>root.LuckBaccaratV82;
 let active=null,step=0,preBalance=null;
 const symbols=['♠','♥','♣','♦'];
 function legend(rank){
   // Standard French-suited cards: short-edge ('ashi') and long-side pip clues.
   if(rank>=11)return {vertical:'絵札',horizontal:'絵札',vCount:-1,hCount:-1,kind:'picture'};
   if(rank===1)return {vertical:'アシなし',horizontal:'ノーサイド',vCount:0,hCount:0,kind:'ace'};
   const v=rank<=3?1:2,h=rank<=3?0:rank<=5?2:rank<=8?3:4;
   return {vertical:v===1?'アタマ（1点）':'アシあり（2点）',horizontal:h===0?'ノーサイド':h===2?'ツーサイド':h===3?'スリーサイド':'フォーサイド',vCount:v,hCount:h,kind:'number'};
 }
 function suit(o,which,i){const arr=which==='PLAYER'?o.playerSuits:o.bankerSuits;return symbols[(arr?.[i]??(i+((which==='PLAYER'?o.player:o.banker)[i]))%4)];}
 function pipStrip(count,symbol){const strip=document.createElement('span');strip.className='v83-marks';if(count===-1){strip.textContent='J Q K';strip.classList.add('v83-picture');}else if(count===0){strip.textContent='—';strip.classList.add('v83-empty');}else for(let j=0;j<count;j++){const pip=document.createElement('i');pip.textContent=symbol;strip.append(pip);}return strip;}
 function makeCard(rank,which,i,o,isTarget,displayThird){
   const face=document.createElement('span');face.className='v82-card v83-playing-card';const sym=suit(o,which,i);face.dataset.side=which;face.dataset.position=String(i);const red=sym==='♥'||sym==='♦';if(red)face.classList.add('v83-red');
   const idx=document.createElement('small');idx.className='v83-index';idx.textContent=B().rankText(rank)+sym;
   const center=document.createElement('span');center.className='v83-center';const symbol=document.createElement('b');symbol.textContent=rank>=11?B().rankText(rank):sym;center.append(symbol);
   if(rank>=2&&rank<=10){const pips=document.createElement('span');pips.className='v83-face-pips';pips.textContent=Array(rank).fill(sym).join('');center.append(pips);}face.append(idx,center);
   if(i===2){face.classList.add('v83-third');if(!displayThird){const cover=document.createElement('span');cover.className='v82-curtain v83-full-back';face.append(cover);}return face;}
   if(isTarget&&step<3){const cover=document.createElement('span');cover.className='v82-curtain v83-full-back';face.append(cover);
     const mark=legend(rank);if(step>=1){const first=document.createElement('span');first.className='v83-peek v83-vertical';first.append(pipStrip(mark.vCount,sym));face.append(first);}if(step>=2){const second=document.createElement('span');second.className='v83-peek v83-horizontal';second.append(pipStrip(mark.hCount,sym));face.append(second);}
   }
   return face;
 }
 function renderHand(id,which,o){const cards=which==='PLAYER'?o.player:o.banker,target=which===o.side;const el=$(id);el.replaceChildren();cards.forEach((r,i)=>{if(i===2&&step<3)return;el.append(makeCard(r,which,i,o,target&&i===1,step>=4));});}
 function tell(ja,en){const lang=document.documentElement.lang==='ja';$('v83SqueezeGuide').textContent=lang?ja:en;}
 function setStatus(ja,en){$('v82Result').textContent=document.documentElement.lang==='ja'?ja:en;}
 function redraw(){const o=active;if(!o)return;renderHand('v82PlayerCards','PLAYER',o);renderHand('v82BankerCards','BANKER',o);
   const final=(step>=3&&!(o.player.length===3||o.banker.length===3))||step>=4;
   $('v82PlayerTotal').textContent=final?String(o.playerTotal):'？';$('v82BankerTotal').textContent=final?String(o.bankerTotal):'？';
   $('v82Peel').hidden=final;$('v82Show').hidden=final;$('v82Peel').disabled=final;$('v82Show').disabled=final;
   const labels=['縦のアシを確認','横のマークを確認','カード全体を開く','追加配札を確認'];
   const eng=['PEEK VERTICAL EDGE','PEEK HORIZONTAL EDGE','TURN FACE UP','REVEAL THIRD CARDS'];
   $('v82Peel').textContent=document.documentElement.lang==='ja'?labels[Math.min(step,3)]:eng[Math.min(step,3)];
   if(step===0){tell('ディーラーが4枚を配りました。伏せた2枚目を縦から絞ってください。','Four cards dealt. Peek at the vertical edge of the selected second card.');setStatus('配札完了。縦のアシ → 横のマーク → 全面公開。','Cards dealt. Vertical clues → lateral pips → face up.');}
   if(step===1){const r=(o.side==='PLAYER'?o.player:o.banker)[1],mark=legend(r);tell('縦絞り：'+mark.vertical+'。次はカードを横にしてサイドを見る。','VERTICAL: '+mark.vertical+'. Now inspect the lateral side.');setStatus('縦のアシを公開しました。次は横から見えるマークの数です。','Vertical edge revealed. Next, inspect the horizontal-side marks.');}
   if(step===2){const r=(o.side==='PLAYER'?o.player:o.banker)[1],mark=legend(r);tell('縦：'+mark.vertical+' ／ 横：'+mark.horizontal+'（'+(mark.hCount<0?'絵札':mark.hCount+'点')+'）。','VERTICAL: '+mark.vertical+' / HORIZONTAL: '+mark.horizontal+' ('+(mark.hCount<0?'picture':mark.hCount+' pips')+').');setStatus('横のマークを公開しました。最後にカード全体を開きます。','Lateral edge revealed. Now turn the whole card face up.');}
   if(step===3&&!final){tell('2枚目を確認。追加のカードはディーラーがルールどおりに配ります。','Second card opened. Dealer draws third cards according to the drawing rules.');setStatus('追加配札があります。次の操作で3枚目を公開します。','Additional cards were drawn. Reveal the third cards next.');}
   if(final){tell('すべてのカードを公開しました。','All cards revealed.');setStatus('勝者 '+o.winner+' ｜ PLAYER '+o.playerTotal+'：BANKER '+o.bankerTotal+' ｜ 差引 '+(o.net>=0?'+':'')+o.net+'チップ', 'Winner '+o.winner+' | PLAYER '+o.playerTotal+' : BANKER '+o.bankerTotal+' | Net '+o.net+' credits');active=null;preBalance=null;root.document.dispatchEvent(new CustomEvent('lucklab:v82-reveal-end'));}
 }
 function advance(){if(!active)return;step=Math.min(4,step+1);redraw();}
 function begin(o,originalWallet){active=o;step=0;preBalance=originalWallet;redraw();}
 function restored(o){if(!o)return;active=o;step=4;preBalance=null;redraw();}
 function clear(){active=null;step=0;preBalance=null;for(const id of ['v82PlayerCards','v82BankerCards'])$(id).innerHTML='<span class="v82-back">♠</span><span class="v82-back">♠</span>';$('v82PlayerTotal').textContent='—';$('v82BankerTotal').textContent='—';$('v82Peel').hidden=true;$('v82Show').hidden=true;$('v82Result').textContent='まず賭け先を選んでください。';tell('縦→横→全面公開。','Vertical → horizontal → full reveal.');}
 root.LuckBaccaratStageV82={begin,restored,clear,busy:()=>!!active,pendingWallet:()=>active?preBalance:null,stepLabel:()=>['縦のアシを確認','横のマークを確認','カード全体を開く','追加配札を確認'][Math.min(step,3)]};
 $('v82Peel').addEventListener('click',advance);$('v82Show').addEventListener('click',()=>{if(!active)return;step=4;redraw();});
})(typeof globalThis!=='undefined'?globalThis:this);
