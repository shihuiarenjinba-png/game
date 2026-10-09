"use strict";
(function(g){
 const DICT=[["保存情報が不正だったため新しいゲームを開始しました。","Your save was invalid; a new game has started."],["自動保存できませんでした。","Autosave failed."],["最初から遊ぶ","Start New Game"],["30ラウンド限定アーケード","30-Round Arcade"],["3つのミニゲームと運の振れ幅を楽しむ、30ラウンド限定アーケード","Three luck-based minigames across a 30-round arcade challenge."],["チップ残高","Chip Balance"],["ラウンド","Round"],["累積損益","Net Change"],["プレイ状態","Game State"],["直近のラウンド結果","Recent Rounds"],["ディーラーの成績","Dealer's Record"],["遊び方と確率","Rules & Probabilities"],["ゲームを選択","Choose a Game"],["ミニゲームを選ぶ","Choose a Minigame"],["使用するチップ（10〜200C、10刻み）","Stake (10–200 C, steps of 10)"],["予想する色・数字","Predict Color or Number"],["赤（2倍）","Red (2×)"],["黒（2倍）","Black (2×)"],["偶数（2倍）","Even (2×)"],["奇数（2倍）","Odd (2×)"],["番号を1つ（36倍）","Single Number (36×)"],["0〜36から番号を選ぶ","Pick a Number from 0–36"],["ルール","Rules"],["最初の2つが一致すると2倍。3つ一致するとさらに高配当","Two first reels match: 2×; all three match: higher payout"],["21を越えず、ディーラーより大きな点数を狙おう","Beat the dealer without going above 21."],["ディーラーの難易度","Dealer Difficulty"],["ディーラー有利チャレンジ（推奨）","Dealer Advantage Challenge (default)"],["標準ブラックジャック","Standard Blackjack"],["特別ルール：ディーラーは23点まで有効で同点もディーラー勝利。標準ルールより勝つのが難しい、ゲーム独自のモードです。","Special rules: the dealer can score up to 23 and wins ties. This fictional mode is harder than standard Blackjack."],["標準ルール：ディーラーは21点を超えると失格、同点ではチップを返却します。","Standard rules: dealer busts over 21, and ties return your chips."],["ヒット","Hit"],["スタンド","Stand"],["ダブル","Double"],["カードを配る","Deal Cards"],["スロットを回す","Spin Reels"],["ルーレットを回す","Spin Roulette"],["🎰 スロット","🎰 Slots"],["🎯 ルーレット","🎯 Roulette"],["🂡 ブラックジャック","🂡 Blackjack"],["ディーラー（伏せ札あり）","Dealer (One Hidden Card)"],["ディーラー","Dealer"],["あなた","You"],["全ルール・抽選確率・配当表","Full Rules, Odds & Payouts"],["🎰 スロット（3リール独立抽選）","🎰 Slots (3 Independent Reels)"],["🎯 欧州式ルーレット","🎯 European Roulette"],["🂡 ブラックジャック","🂡 Blackjack"],["1リール","Per Reel"],["3一致の総配当","Triple Match Payout"],["絵柄","Symbol"],["左2つだけ一致は総配当2倍。","First two reels match: total payout 2×."],["2個以上一致：","Two or more matching: "],["／3個一致："," / three matching: "],["平均総払戻しは掛けた1Cに対して約","Average theoretical payout per staked chip: "],["（理論値、保証なし）"," (theoretical, not guaranteed)"],["0〜36の37枠は全て同確率。","All 37 roulette numbers (0–36) are equally likely."],["赤黒・偶奇の的中確率は18/37＝","Red/black or odd/even hit: 18/37 = "],["単一番号は1/37＝","Single number: 1/37 = "],["総配当2倍","2× total payout"],["総配当36倍","36× total payout"],["0では赤黒・偶奇は不的中。","Zero loses for color or parity bets."],["このゲームのチップに金銭的価値はありません。","Game chips have no monetary value."],["現実のお金による購入、現金化、景品交換、外部送金、外部の賭博サイトとの接続は一切ありません。","No real-money purchases, cashout, prizes, transfers or external gambling connections."],["開発用Alphaであり販売は保留しています。","Development alpha; commercial sales are on hold."],["このゲームは","This game"],["負け","Loss"],["勝ち","Win"],["引き分け","Push"],["払戻し","Payout"],["収支","Net"],["純増減","Net Change"],["カード","Cards"],["伏せ札","Hidden Card"],["点"," points"],["ルーレット","Roulette"],["出た番号：","Winning Number: "],["絵柄：","Symbols: "],["キー操作：H＝ヒット / S＝スタンド / D＝ダブル","Keyboard: H = Hit / S = Stand / D = Double"],["キー操作：スペース＝スタート","Keyboard: Space = Play"],["まだプレイ履歴はありません。","No played rounds yet."],["ブラックジャック対戦数","Blackjack Hands"],["ディーラー勝利","Dealer Wins"],["ディーラー勝率","Dealer Win Rate"],["カード勝負を始めるとディーラーの勝率を表示します。","Dealer win rate appears after you play a hand."],["チップ10C未満になるとゲームオーバー。","Game over when fewer than 10 chips remain."],["30ラウンドまで。","Up to 30 rounds."],["チップ不足","Not Enough Chips"],["操作できませんでした：","Action Failed: "],["最終残高","Final Balance"]].sort((a,b)=>b[0].length-a[0].length);
 function text(v,locale="en"){
  if(locale!=="en"||typeof v!=="string")return v;
  let r=v;
  for(const [from,to] of DICT)if(r.includes(from))r=r.split(from).join(to);
  return r;
 }
 function apply(root,locale){
  if(!root?.ownerDocument)return;
  const doc=root.ownerDocument;doc.documentElement.lang=locale;
  if(locale!=="en")return;
  const walk=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
  while(walk.nextNode())nodes.push(walk.currentNode);
  for(const n of nodes)n.nodeValue=text(n.nodeValue,locale);
  if(root.querySelectorAll)for(const el of root.querySelectorAll("[placeholder],[title],[aria-label]")){
   for(const k of ["placeholder","title","aria-label"])if(el.hasAttribute(k))el.setAttribute(k,text(el.getAttribute(k),locale));
  }
 }
 g.GameTranslations={text,apply,phrases:DICT.length};
})(globalThis);
