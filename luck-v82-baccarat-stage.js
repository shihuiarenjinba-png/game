/* v82 baccarat squeeze is visual ONLY: settlement always precedes the reveal. */
(function(root){'use strict';let active=null,step=0;const $=id=>document.getElementById(id),B=()=>root.LuckBaccaratV82;
 function showCards(id,cards,peel){$(id).replaceChildren();cards.forEach((v,i)=>{const el=document.createElement('span');el.className='v82-card';const corner=document.createElement('small');corner.textContent=B().rankText(v);const face=document.createElement('b');face.textContent=B().rankText(v);el.append(corner,face);if(peel&&i===1){const cover=document.createElement('span');cover.className='v82-curtain';cover.style.width=String([100,65,30,0][step])+'%';el.append(cover);}$(id).append(el);});}
 function view(){const o=active;if(!o)return;showCards('v82PlayerCards',o.player,true);showCards('v82BankerCards',o.banker,true);
 $('v82PlayerTotal').textContent=step>=3?String(o.playerTotal):'？';$('v82BankerTotal').textContent=step>=3?String(o.bankerTotal):'？';
 $('v82Peel').hidden=step>=3;$('v82Show').hidden=step>=3;$('v82Peel').disabled=step>=3;$('v82Show').disabled=step>=3;
 if(step<3){$('v82Result').textContent=(document.documentElement.lang==='ja'?'勝敗と払戻はすでに確定しています。2枚目を少しずつ公開：':'Outcome settled. Squeeze the second card: ')+String(step)+'/3';}
 else {$('v82Result').textContent=(document.documentElement.lang==='ja'?'勝者 ':'Winner ')+o.winner+' ｜ PLAYER '+o.playerTotal+'：BANKER '+o.bankerTotal+' ｜ '+(document.documentElement.lang==='ja'?'差引 ':'Net ')+(o.net>=0?'+':'')+o.net+' chips';active=null;root.document.dispatchEvent(new CustomEvent('lucklab:v82-reveal-end'));}
 }
 function begin(o){active=o;step=0;view();}
 function restored(o){if(!o){active=null;return;}active=o;step=3;view();}
 function clear(){active=null;step=0;for(const id of ['v82PlayerCards','v82BankerCards'])$(id).innerHTML='<span class="v82-back">♠</span><span class="v82-back">♠</span>';$('v82PlayerTotal').textContent='—';$('v82BankerTotal').textContent='—';$('v82Peel').hidden=true;$('v82Show').hidden=true;$('v82Result').textContent='賭けた後で2枚目を公開します。';}
 root.LuckBaccaratStageV82={begin,restored,clear,busy:()=>!!active};
 $('v82Peel').addEventListener('click',()=>{if(!active)return;step=Math.min(3,step+1);view();});$('v82Show').addEventListener('click',()=>{if(!active)return;step=3;view();});
})(typeof globalThis!=='undefined'?globalThis:this);
