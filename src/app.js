"use strict";
(()=>{
  const G=globalThis.VirtualArcade,KEY="luck-lab-arcade-v1";
  const root=document.getElementById("app");
  const money=x=>x.toLocaleString("ja-JP")+" C";
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let stake=50,choice="red",number=7,notice="";
  let s;
  try{const raw=localStorage.getItem(KEY);s=raw?JSON.parse(raw):G.newGame();G.validate(s)}
  catch(e){s=G.newGame();notice="保存情報が不正だったため新しいゲームを開始しました。"}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){notice="保存できませんでした。"}}
  function panel(title,body){return '<section class="panel"><header><h2>'+title+'</h2></header><div class="inner">'+body+'</div></section>'}
  function select(id,label,entries,value){return '<div><label for="'+id+'">'+label+'</label><select id="'+id+'">'+entries.map(([key,text])=>'<option value="'+esc(key)+'" '+(String(key)===String(value)?"selected":"")+'>'+esc(text)+'</option>').join("")+'</select></div>'}
  function card(rank,hidden){return '<div class="card '+(hidden?"back":"")+'">'+(hidden?"★":rank===1?"A":rank>10?["J","Q","K"][rank-11]:rank)+'</div>'}
  function content(){
    const unavailable=s.status!=="playing",p=s.pending;
    const choices=select("stake","使用するチップ（10〜200C、10刻み）",Array.from({length:20},(_,i)=>[(i+1)*10,(i+1)*10+" C"]),stake);
    const rouletteControls=s.mode==="roulette"?select("choice","予想する色・数字",[["red","赤（2倍）"],["black","黒（2倍）"],["even","偶数（2倍）"],["odd","奇数（2倍）"],["number","番号を1つ（36倍）"]],choice):'<div><label>ルール</label><div class="sub">'+(s.mode==="slots"?"最初の2つが一致すると2倍。3つ一致するとさらに高配当":"21を越えず、ディーラーより大きな点数を狙おう")+'</div></div>';
    const houseRule=s.mode==="blackjack"?'<div class="house-rules"><div class="inputrow">'+select("housemode","ディーラーの難易度",[["challenge","ディーラー有利チャレンジ（推奨）"],["standard","標準ブラックジャック"]],s.houseMode||"standard")+'</div><p class="sub">'+((s.houseMode||"standard")==="challenge"?"特別ルール：ディーラーは23点まで有効で同点もディーラー勝利。標準ルールより勝つのが難しい、ゲーム独自のモードです。":"標準ルール：ディーラーは21点を超えると失格、同点ではチップを返却します。")+'</p></div>':'';
    const controls='<div class="inputrow">'+choices+rouletteControls+'</div>'+houseRule+(s.mode==="roulette"&&choice==="number"?'<div class="inputrow">'+select("number","0〜36から番号を選ぶ",Array.from({length:37},(_,i)=>[i,String(i)]),number)+'</div>':'');
    const slotView=s.mode==="slots"?'<div class="reels">'+(s.last?.game==="slots"?s.last.reels.map(i=>G.SYMBOLS[i]):["❔","❔","❔"]).map(v=>'<div class="reel">'+v+'</div>').join("")+'</div><p class="sub">3一致の合計払戻しは絵柄によって8〜45倍。確率は絵柄ごとに異なります。</p>':'';
    const rouletteView=s.mode==="roulette"?'<div class="roulette">'+Array.from({length:37},(_,i)=>'<div class="cell '+(i===0?"zero":G.RED.has(i)?"red":"")+(s.last?.game==="roulette"&&i===s.last.spin?" selected-number":"")+'">'+i+'</div>').join("")+'</div><div class="sub">0は緑色。赤黒・偶奇では0は不的中。</div>':'';
    const blackView=s.mode==="blackjack"?(p?'<p class="sub">ディーラー（伏せ札あり）</p><div class="cards">'+p.dealer.map((x,i)=>card(x,i===1)).join("")+'</div><p class="sub">プレイヤー '+G.score(p.player)+'点</p><div class="cards">'+p.player.map(x=>card(x,false)).join("")+'</div>':(s.last?.game==="blackjack"?'<p class="sub">ディーラー '+s.last.dealerScore+'点</p><div class="cards">'+s.last.dealer.map(x=>card(x,false)).join("")+'</div><p class="sub">プレイヤー '+s.last.playerScore+'点</p><div class="cards">'+s.last.player.map(x=>card(x,false)).join("")+'</div>':'<div class="cards">'+["A","K","Q"].map(v=>'<div class="card back">'+v+'</div>').join("")+'</div><div class="sub">Aは1か11。J/Q/Kは10点。ディーラーは17以上で止まる。</div>')):'';
    const actions=s.mode==="blackjack"?(p?
    '<div class="actions"><button class="button" data-action="hit">ヒット</button><button class="button alt" data-action="stand">スタンド</button><button class="button alt" data-action="double" '+(!p.canDouble||s.chips<p.stake?"disabled":"")+'>ダブル</button></div>':
    '<div class="actions"><button class="button" data-action="blackjack" '+(unavailable||stake>s.chips?"disabled":"")+'>カードを配る</button></div>'):
    '<div class="actions"><button class="button" data-action="'+s.mode+'" '+(unavailable||stake>s.chips?"disabled":"")+'>'+(s.mode==="slots"?"スロットを回す":"ルーレットを回す")+'</button></div>';
    const last=s.last;
    const result=last?'<div class="result '+(last.net<0?"bad":"")+'"><strong>'+(last.game==="roulette"?"出た番号："+last.spin:last.game==="slots"?"絵柄："+last.reels.map(i=>G.SYMBOLS[i]).join(" "):"BJ："+last.playerScore+" 対 "+last.dealerScore)+'</strong><span class="'+(last.net>=0?"positive":"negative")+'">払戻し '+money(last.paid)+'　／　収支 '+(last.net>0?"+":"")+money(last.net)+'</span></div>':'';
    const keyHint=s.mode==="blackjack"?'<p class="sub key-hint">キー操作：H＝ヒット / S＝スタンド / D＝ダブル</p>':'<p class="sub key-hint">キー操作：スペース＝スタート</p>';
    return controls+slotView+rouletteView+blackView+actions+keyHint+result;
  }
  function render(){
    const stats=[["チップ残高",money(s.chips)],["ラウンド",s.rounds+" / "+G.MAX_ROUNDS],["累積損益",(s.chips>=G.START?"+":"")+money(s.chips-G.START)],["プレイ状態",s.status==="playing"?"PLAYING":s.status==="complete"?"COMPLETE":"GAME OVER"]];
    const records=[...s.history].reverse().slice(0,10);
    const history=records.length?'<table class="log"><thead><tr><th>R</th><th>ゲーム</th><th>差額</th></tr></thead><tbody>'+records.map(r=>'<tr><td>'+r.round+'</td><td>'+({slots:"スロット",roulette:"ルーレット",blackjack:"ブラックジャック"}[r.game])+'</td><td class="'+(r.net>=0?"positive":"negative")+'">'+(r.net>=0?"+":"")+money(r.net)+'</td></tr>').join("")+'</tbody></table>':'<p class="sub">まだプレイ履歴はありません。</p>';
    const bjHistory=s.history.filter(r=>r.game==="blackjack"),dealerVictories=bjHistory.filter(r=>!r.won&&r.outcome!=="push").length;
    const statsBJ=bjHistory.length?'<div class="house-standings"><div class="row"><span>ブラックジャック対戦数</span><strong>'+bjHistory.length+'</strong></div><div class="row"><span>ディーラー勝利</span><strong>'+dealerVictories+'回</strong></div><div class="row"><span>ディーラー勝率</span><strong>'+Math.round(dealerVictories/bjHistory.length*100)+'%</strong></div></div>':'<p class="sub">カード勝負を始めるとディーラーの勝率を表示します。</p>';
    const end=s.status!=="playing"?'<div class="end">30ラウンド終了、またはチップ不足でゲーム終了。最終残高 '+money(s.chips)+'</div>':'';
    root.innerHTML='<div class="wrap"><div class="head"><div><div class="pill">OFFLINE VIRTUAL CHIPS ONLY · ALPHA 0.2.1</div><h1>LUCK <span class="gold">LAB</span></h1><p>3つのミニゲームと運の振れ幅を楽しむ、30ラウンド限定アーケード</p></div><button class="button alt" data-action="restart">最初から遊ぶ</button></div>'+
    (notice?'<div class="result bad">'+esc(notice)+'</div>':'')+
    '<div class="stats">'+stats.map(v=>'<div class="stat"><small>'+v[0]+'</small><strong>'+v[1]+'</strong></div>').join("")+'</div><div class="round-progress" role="progressbar" aria-label="30ラウンドの進捗" aria-valuenow="'+s.rounds+'" aria-valuemin="0" aria-valuemax="'+G.MAX_ROUNDS+'"><div style="width:'+Math.round(s.rounds/G.MAX_ROUNDS*100)+'%"></div></div>'+
    '<div class="grid"><div>'+panel("ミニゲームを選ぶ",'<div class="tabs">'+[["slots","🎰 スロット"],["roulette","🎯 ルーレット"],["blackjack","🂡 ブラックジャック"]].map(v=>'<button class="button '+(s.mode===v[0]?"active":"alt")+'" data-action="mode" data-mode="'+v[0]+'" '+(s.pending?"disabled":"")+'>'+v[1]+'</button>').join("")+'</div>'+content())+end+'</div>'+
    '<aside>'+panel("直近のラウンド結果",history)+panel("ディーラーの成績",statsBJ)+panel("遊び方と確率",'<ul class="rule"><li>スロットは6絵柄の重み付き抽選。偶然の3一致に高倍率が付きます。</li><li>欧州式ルーレットは0〜36の37枠。赤黒・偶奇は2倍、単一番号は36倍の合計払戻し。</li><li>ブラックジャックには標準ルールとディーラー有利モード。後者はディーラー23点まで有効・引き分けは負け。変更は開始前のみ。</li><li>30ラウンドまで。チップ10C未満になるとゲームオーバー。</li></ul>')+'</aside></div>'+
    '<p class="note">このゲームのチップに金銭的価値はありません。現実のお金による購入、現金化、景品交換、外部送金、外部の賭博サイトとの接続は一切ありません。開発用Alphaであり販売は保留しています。</p></div>';
  }
  document.addEventListener("change",event=>{const {id,value}=event.target;if(id==="stake")stake=Number(value);if(id==="choice")choice=value;if(id==="number")number=Number(value);if(id==="housemode"){const snap=JSON.stringify(s);try{G.setHouseMode(s,value);save();notice=""}catch(e){s=JSON.parse(snap);notice="変更できません："+e.message}}render()});
  document.addEventListener("click",event=>{const button=event.target.closest("[data-action]");if(!button||button.disabled)return;
    const a=button.dataset.action;
    if(a==="restart"){s=G.newGame((Date.now()>>>0)||1);notice="";save();render();return}
    const snapshot=JSON.stringify(s);
    try{
      if(a==="mode")G.setMode(s,button.dataset.mode);
      if(a==="slots")G.slots(s,stake);
      if(a==="roulette")G.roulette(s,stake,choice,choice==="number"?number:null);
      if(a==="blackjack")G.blackjack(s,stake);
      if(a==="hit")G.hit(s);
      if(a==="stand")G.stand(s);
      if(a==="double")G.double(s);
      G.validate(s);save();notice="";
    }catch(e){s=JSON.parse(snapshot);notice="操作できませんでした："+e.message}
    render();
  });
  document.addEventListener("keydown",event=>{
    const tag=event.target?.tagName||"";
    if(["SELECT","INPUT","TEXTAREA","BUTTON"].includes(tag)||event.altKey||event.ctrlKey||event.metaKey)return;
    const key=event.key.toLowerCase();
    const action=s.mode==="blackjack"?(key==="h"?"hit":key==="s"?"stand":key==="d"?"double":null):
      (event.code==="Space"?s.mode:null);
    if(!action)return;
    const button=document.querySelector('[data-action="'+action+'"]');
    if(button&&!button.disabled){event.preventDefault();button.click();}
  });
  render();
})();