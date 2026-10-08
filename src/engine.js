/* Offline virtual-chip arcade. No real currency, payments, advertisements or redemption. */
"use strict";
(function(global){
  const START=2500, MAX_ROUNDS=30, MAX_BET=200;
  const RED=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
  const SYMBOLS=["🍒","🍋","🔔","⭐","💎","7️⃣"];
  const WEIGHTS=[30,25,18,11,9,7];
  const THREE=[8,10,14,20,25,45]; // total payout including stake
  function rng(s){s.seed=(Math.imul(s.seed,1664525)+1013904223)>>>0;return s.seed/4294967296}
  function draw(s,max){return Math.floor(rng(s)*max)}
  function newGame(seed=1234567){
    return {version:1,seed:seed>>>0||1,chips:START,rounds:0,maxRounds:MAX_ROUNDS,mode:"slots",pending:null,last:null,status:"playing",
      ledger:[{kind:"START",amount:START,round:0}],history:[]};
  }
  function validate(s){
    if(!s||s.version!==1||!Number.isInteger(s.seed)||s.seed<0||s.seed>4294967295||!Number.isSafeInteger(s.chips)||s.chips<0||
      !Number.isInteger(s.rounds)||s.rounds<0||s.rounds>MAX_ROUNDS||s.maxRounds!==MAX_ROUNDS||
      !["slots","roulette","blackjack"].includes(s.mode)||!["playing","complete","bust"].includes(s.status)||
      !Array.isArray(s.ledger)||s.ledger.length>MAX_ROUNDS*4+1||!Array.isArray(s.history)||s.history.length!==s.rounds)
      throw Error("ゲームの保存データが不正です");
    let total=0;
    for(const l of s.ledger){if(!Number.isSafeInteger(l.amount)||typeof l.kind!=="string"||!Number.isInteger(l.round))throw Error("台帳が不正です");total+=l.amount}
    if(total!==s.chips)throw Error("チップ残高と台帳が一致しません");
    if(s.pending && (s.status!=="playing"||!["blackjack"].includes(s.pending.game)||!Array.isArray(s.pending.player)||!Array.isArray(s.pending.dealer)||!Number.isInteger(s.pending.stake)||s.pending.stake<10))throw Error("進行中カードが不正です");
    if(s.status==="complete"&&s.rounds!==MAX_ROUNDS)throw Error("終了ラウンドが不正です");
    if(s.status==="bust"&&s.chips>=10)throw Error("破産条件が不正です");
    return true;
  }
  function change(s,amount,kind){if(s.chips+amount<0)throw Error("ゲーム内チップが不足しています");s.chips+=amount;s.ledger.push({round:s.rounds+1,kind,amount})}
  function ensureBet(s,amount){
    if(s.status!=="playing")throw Error("30ラウンドが終了しています");
    if(s.pending)throw Error("ブラックジャックを先に終了してください");
    if(!Number.isInteger(amount)||amount<10||amount>MAX_BET||amount%10!==0)throw Error("チップは10〜200、10刻みで指定してください");
    if(amount>s.chips)throw Error("保有チップが不足しています");
  }
  function finish(s,result){
    s.rounds++;s.last=result;s.history.push({round:s.rounds,...result,chips:s.chips});
    s.status=s.rounds>=MAX_ROUNDS?"complete":s.chips<10?"bust":"playing";
    validate(s);return s;
  }
  function roulette(s,amount,kind="red",number=null){
    ensureBet(s,amount);
    if(!["red","black","even","odd","number"].includes(kind))throw Error("賭け方が不正です");
    if(kind==="number"&&(!Number.isInteger(number)||number<0||number>36))throw Error("番号は0〜36です");
    const spin=draw(s,37),isRed=RED.has(spin);
    const won=kind==="number"?spin===number:spin!==0&&(kind==="red"?isRed:kind==="black"?!isRed:kind==="even"?spin%2===0:spin%2===1);
    const multiplier=kind==="number"?36:2;
    change(s,-amount,"ROULETTE_BET");
    const paid=won?amount*multiplier:0;if(paid)change(s,paid,"ROULETTE_PAYOUT");
    return finish(s,{game:"roulette",amount,paid,net:paid-amount,won,spin,kind,number});
  }
  function slotSymbol(s){let z=draw(s,100);for(let i=0;i<WEIGHTS.length;i++){z-=WEIGHTS[i];if(z<0)return i}return SYMBOLS.length-1}
  function slots(s,amount){
    ensureBet(s,amount);
    const reels=[slotSymbol(s),slotSymbol(s),slotSymbol(s)];
    const mult=reels[0]===reels[1]?(reels[1]===reels[2]?THREE[reels[0]]:2):0;
    change(s,-amount,"SLOTS_BET");const paid=amount*mult;if(paid)change(s,paid,"SLOTS_PAYOUT");
    return finish(s,{game:"slots",amount,paid,net:paid-amount,won:paid>0,reels,multiplier:mult});
  }
  const newCard=(s)=>1+draw(s,13);
  function score(cards){let points=cards.reduce((v,c)=>v+(c===1?11:Math.min(10,c)),0),aces=cards.filter(c=>c===1).length;while(points>21&&aces--)points-=10;return points}
  function isNatural(cards){return cards.length===2&&score(cards)===21}
  function blackjack(s,amount){
    ensureBet(s,amount);
    const player=[newCard(s),newCard(s)],dealer=[newCard(s),newCard(s)];
    change(s,-amount,"BLACKJACK_BET");
    s.pending={game:"blackjack",stake:amount,player,dealer,canDouble:true};
    if(isNatural(player)||isNatural(dealer))return settleBlackjack(s);
    validate(s);return s;
  }
  function settleBlackjack(s){
    const h=s.pending;if(!h)throw Error("進行中のブラックジャックがありません");
    const playerScore=score(h.player);let dealerScore=score(h.dealer);
    if(playerScore<=21&&!isNatural(h.player))while(dealerScore<17){h.dealer.push(newCard(s));dealerScore=score(h.dealer)}
    const playerBJ=isNatural(h.player),dealerBJ=isNatural(h.dealer);
    const outcome=playerScore>21?"lose":dealerScore>21?"win":playerBJ&&!dealerBJ?"blackjack":dealerBJ&&!playerBJ?"lose":playerScore>dealerScore?"win":playerScore<dealerScore?"lose":"push";
    const multiplier=outcome==="blackjack"?2.5:outcome==="win"?2:outcome==="push"?1:0;
    const paid=Math.floor(h.stake*multiplier);
    if(paid)change(s,paid,"BLACKJACK_PAYOUT");
    const result={game:"blackjack",amount:h.stake,paid,net:paid-h.stake,won:outcome==="win"||outcome==="blackjack",outcome,player:h.player.slice(),dealer:h.dealer.slice(),playerScore,dealerScore};
    s.pending=null;return finish(s,result);
  }
  function hit(s){const h=s.pending;if(!h)throw Error("カードを配ってください");h.player.push(newCard(s));h.canDouble=false;if(score(h.player)>=21)return settleBlackjack(s);validate(s);return s}
  function stand(s){if(!s.pending)throw Error("カードを配ってください");return settleBlackjack(s)}
  function double(s){const h=s.pending;if(!h||!h.canDouble||h.player.length!==2)throw Error("ダブルは最初の2枚だけです");if(s.chips<h.stake)throw Error("追加チップ不足です");change(s,-h.stake,"BLACKJACK_DOUBLE");h.stake*=2;h.canDouble=false;h.player.push(newCard(s));return settleBlackjack(s)}
  function setMode(s,mode){if(s.pending)throw Error("カードの勝負を先に終了してください");if(!["slots","roulette","blackjack"].includes(mode))throw Error("ゲームが不正です");s.mode=mode;return s}
  global.VirtualArcade={START,MAX_ROUNDS,MAX_BET,SYMBOLS,WEIGHTS,THREE,RED,newGame,validate,slots,roulette,blackjack,hit,stand,double,setMode,score};
})(globalThis);
