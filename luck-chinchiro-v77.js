/* v77 Original fictional-play-money Chinchiro. All three dice fair and independent. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LuckChinchiroV77=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const SIDES=6,MAX_TRIES=3,RATE=.03;
function role(d){if(!Array.isArray(d)||d.length!==3||!d.every(x=>Number.isInteger(x)&&x>=1&&x<=6))throw Error('invalid dice');const a=d.slice().sort((x,y)=>x-y);
 if(a[0]===1&&a[2]===1)return{id:'PIN',rank:100,point:0};
 if(a[0]===a[2])return{id:'TRIPLE',rank:60+a[0],point:a[0]};
 if(a.join('')==='456')return{id:'SHIGORO',rank:50,point:0};
 if(a.join('')==='123')return{id:'HIFUMI',rank:-10,point:0};
 if(a[0]===a[1])return{id:'POINT',rank:10+a[2],point:a[2]};
 if(a[1]===a[2])return{id:'POINT',rank:10+a[0],point:a[0]};
 return{id:'NONE',rank:0,point:0};}
function die(random){const u=random();if(!Number.isFinite(u)||u<0||u>=1)throw Error('invalid random draw');return 1+Math.floor(u*SIDES);}
function hand(random=Math.random){const rolls=[];for(let t=0;t<MAX_TRIES;t++){const d=[die(random),die(random),die(random)];const r=role(d);rolls.push(d);if(r.id!=='NONE')return {rolls,dice:d,...r};}return {rolls,dice:rolls[rolls.length-1],...role(rolls[rolls.length-1])};}
function round(wallet,wager,random=Math.random){if(!Number.isSafeInteger(wallet)||wallet<0||!Number.isSafeInteger(wager)||wager<20||wager>1000||wager%10!==0||wallet<wager)throw Error('chinchiro: wager must be 20–1000 chips in steps of 10, within wallet');
 const dealer=hand(random),player=hand(random);const result=player.rank>dealer.rank?'WIN':player.rank<dealer.rank?'LOSE':'PUSH';
 const gross=result==='WIN'?wager*(player.id==='PIN'?3:2):result==='PUSH'?wager:0;
 const commission=result==='WIN'?Math.max(1,Math.round(gross*RATE)):0;
 const payout=gross-commission,net=payout-wager;
 return{game:'chinchiro',wager,dealer,player,result,payout,net,gross,commission,newWallet:wallet+net};}
function validHand(h){return!!h&&typeof h==='object'&&Array.isArray(h.dice)&&h.dice.length===3&&Array.isArray(h.rolls)&&h.rolls.length>=1&&h.rolls.length<=3&&h.rolls.every(d=>Array.isArray(d)&&d.length===3&&d.every(x=>Number.isInteger(x)&&x>=1&&x<=6))&&h.rolls.slice(0,-1).every(d=>role(d).id==='NONE')&&h.dice.join(',')===h.rolls[h.rolls.length-1].join(',')&&(()=>{const r=role(h.dice);return h.id===r.id&&h.rank===r.rank&&h.point===r.point&&(h.rolls.length===3||r.id!=='NONE');})();}
function validResult(o){try{if(!o||o.which!=='chinchiro'||!Number.isSafeInteger(o.wager)||o.wager<20||o.wager>1000||o.wager%10!==0||!validHand(o.player)||!validHand(o.dealer))return false;
 const result=o.player.rank>o.dealer.rank?'WIN':o.player.rank<o.dealer.rank?'LOSE':'PUSH';const gross=result==='WIN'?o.wager*(o.player.id==='PIN'?3:2):result==='PUSH'?o.wager:0;const commission=result==='WIN'?Math.max(1,Math.round(gross*RATE)):0;return o.result===result&&o.payout===gross-commission&&o.net===o.payout-o.wager&&o.commission===commission;}catch(_){return false;}}
function label(h,lang='ja'){const ja={PIN:'ピンゾロ！',TRIPLE:h.point+'ゾロ',SHIGORO:'シゴロ',HIFUMI:'ヒフミ',POINT:h.point+'の目',NONE:'役なし'};const en={PIN:'PINZORO',TRIPLE:'Triple '+h.point,SHIGORO:'SHIGORO',HIFUMI:'HIFUMI',POINT:'Point '+h.point,NONE:'No hand'};return(lang==='en'?en:ja)[h.id];}
function distribution(){const freq={};for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)for(let c=1;c<=6;c++){const r=role([a,b,c]);const k=r.id==='TRIPLE'?r.id+r.point:r.id==='POINT'?r.id+r.point:r.id;freq[k]=(freq[k]||0)+1;}const pNone=freq.NONE/216,amp=1+pNone+pNone*pNone;const out={};for(const [k,v]of Object.entries(freq))out[k]=k==='NONE'?pNone**3:v/216*amp;return out;}
function theoretical(wager=20){if(!Number.isSafeInteger(wager)||wager<20||wager>1000||wager%10!==0)throw Error('invalid research wager');const dist=distribution();const keys=Object.keys(dist);function kRank(k){return k==='PIN'?100:k.startsWith('TRIPLE')?60+Number(k.slice(6)):k==='SHIGORO'?50:k.startsWith('POINT')?10+Number(k.slice(5)):k==='NONE'?0:-10;}
 let win=0,lose=0,push=0,rtp=0,pinzoro=0;for(const p of keys)for(const d of keys){const pr=dist[p]*dist[d],diff=Math.sign(kRank(p)-kRank(d));if(diff>0){win+=pr;let gross=wager*(p==='PIN'?3:2);rtp+=pr*(gross-Math.max(1,Math.round(gross*RATE)))/wager;if(p==='PIN')pinzoro+=pr;}else if(diff<0)lose+=pr;else{push+=pr;rtp+=pr;}}
 return{win,lose,push,rtp,pinzoro,roleProbabilities:dist,commissionRate:RATE};}
return Object.freeze({role,hand,round,validResult,label,distribution,theoretical,MAX_TRIES});});
