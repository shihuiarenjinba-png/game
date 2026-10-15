/* v61 independent theoretical explainer. Does not alter the game or saved state. */
(function(){'use strict';const el=document.getElementById('rushV61Theory');if(!el||!window.RushTheoryV61)return;
 const a=window.RushTheoryV61.analyze(),pct=x=>(x*100).toFixed(2)+'%',table=document.createElement('table');const head=document.createElement('tr');for(const x of ['通常抽選の回数 / Entry attempts','1回も当たらない / Zero entry','1回以上当たる / At least one']){const c=document.createElement('th');c.textContent=x;head.append(c);}table.append(head);
 for(const row of a.waits){const tr=document.createElement('tr');[row.n,pct(row.pNoEntry),pct(row.pAtLeastOne)].forEach(x=>{const td=document.createElement('td');td.textContent=x;tr.append(td);});table.append(tr);}
 el.append(table);const streak=document.createElement('p');streak.textContent='RUSH突入後 / After entry: '+a.streaks.map(x=>`${x.hits}連以上 ${pct(x.pAtLeast)}`).join(' ／ ');el.append(streak);
 const caveat=document.createElement('p');caveat.className='meta';caveat.textContent='※「通常抽選200回」と「RUSHを含む総抽選200回」は異なります。表示は理論値で、実際のチップ・残高・セーブ・乱数を使いません。 / Normal-mode attempts are not total spins; these figures use no game state or RNG.';el.append(caveat);
})();
