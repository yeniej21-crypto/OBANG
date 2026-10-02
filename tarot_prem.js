/* 무진의 타로 프리미엄 — 켈틱 크로스 10장 · 3개월 흐름 (결제 뒤 풀이 아래에 이어짐)
   카드: 78장(메이저 22 · 마이너 56)을 암호학 난수로 섞어 펼친 리본에서 손님이 직접 열 장 · 정역 무작위. 뜻은 tarot_data.js · tarot_minor.js(라이더-웨이트 표준)에서만.
   고르기 화면: tarot_deck.js의 리본 덱 엔진(TarotDeck.ribbon)을 무료 풀이와 같이 쓰고, 위에 켈틱 크로스 자리판을 둔다.
   시기: tarot_read.js 골든 던 대응. → AI(무진 문체) · 없으면 카드 사전으로 조립한 초안 */
(function(){
const $=id=>document.getElementById(id); const K=window.PK;
const POS=[['현재','지금 놓인 자리'],['장애물','가로막는 것'],['목표','머리로 바라는 것'],['뿌리','마음 깊은 곳'],['지나간 일','막 지나온 흐름'],['가까운 미래','곧 다가올 일'],['나','내가 취하는 태도'],['주변','주변 사람과 환경'],['희망과 두려움','바라면서 겁나는 것'],['결과','이대로 가면']];
const TOPIC={flow:'전체 흐름',love:'연애',heart:'그 사람 속마음',work:'일 · 커리어',money:'돈',pick:'고민 · 선택',today:'오늘의 카드'};
let O=null,D=null,C=null,ST={},host=null;
const rnd=n=>{ const a=new Uint32Array(1); crypto.getRandomValues(a); return a[0]%n; };
function deal(){ const d=window.TAROT.map(c=>c.n); for(let i=d.length-1;i>0;i--){ const j=rnd(i+1); [d[i],d[j]]=[d[j],d[i]]; } return d.slice(0,10).map(n=>({n,rv:rnd(100)<30})); }
const card=n=>window.TAROT.find(c=>c.n===n);
function mean(c,rv){ const k=O.k; return (c[k]&&c[k][rv?'rv':'up'])||(rv?c.rv:c.up); }
function months(){ const now=new Date(); return [1,2,3].map(i=>{ const d=new Date(now.getFullYear(),now.getMonth()+i-1,1); return d.getMonth()+1; }); }
function draft(){ const R=window.TarotRead, cs=D.map(x=>({c:card(x.n),rv:x.rv})), up=cs.filter(x=>!x.rv).length, mo=months();
  const tm=R.timing(D[9].n,D[9].rv);
  return {draft:true,
   sum:[`직접 고른 열 장 중 정방향이 ${up}장이에요. ${up>=7?'흐름이 당신 편이에요.':up>=4?'반은 순하고 반은 버티는 흐름이에요.':'지금은 버티는 쪽이 많아요. 대신 버틴 만큼 단단해져요.'}`,`현재는 ${cs[0].c.ko}, 결과는 ${cs[9].c.ko}${cs[9].rv?' 역방향':''}. 지금 자리에서 결과 자리로 가는 길을 열 장이 차례로 보여 줘요.`],
   cards:cs.map((x,i)=>({text:`${POS[i][0]} 자리의 ${x.c.ko}${x.rv?' 역방향':''}. ${mean(x.c,x.rv)}`})),
   months:[[5,mo[0]],[8,mo[1]],[9,mo[2]]].map(([i,m])=>({m:m+'월',title:(cs[i].rv?cs[i].c.kwR:cs[i].c.kw)[0],text:`${cs[i].c.ko}${cs[i].rv?' 역방향':''}의 달이에요. ${cs[i].rv?cs[i].c.rv:cs[i].c.up}`})),
   date:tm.t.replace(' 역방향이라','. 역방향이라'),action:`${(cs[6].rv?cs[6].c.kwR:cs[6].c.kw)[0]}. ${cs[6].rv?'이 태도를 한 번만 내려놓아 봐요.':'이 태도를 석 달 동안 지켜 봐요.'}`,
   letter:['당신이 고른 열 장, 끝까지 다 읽었어요.','카드는 길을 비출 뿐이고, 걷는 건 당신이에요.','석 달 뒤에 다시 와요. 그땐 다른 카드가 나올 거예요.']}; }
function fact(){ return JSON.stringify({질문:O.q||'(적지 않음)',주제:TOPIC[O.topic]||O.topic,해석영역:O.k,앞서뽑은카드:(O.picked||[]).map((n,i)=>card(n).ko+(O.rv[i]?' 역':' 정')),
   석달:months().map(m=>m+'월'),결과카드시기:window.TarotRead.timing(D[9].n,D[9].rv),
   펼침:D.map((x,i)=>{ const c=card(x.n); return {번호:i,자리:POS[i][0],자리뜻:POS[i][1],카드:c.ko+' '+c.en,방향:x.rv?'역방향':'정방향',오행:c.el,키워드:x.rv?c.kwR:c.kw,뜻:x.rv?c.rv:c.up,영역뜻:mean(c,x.rv)}; })}); }
const RULE=`[문체 규칙 · 오방사주 타로 마스터 무진]
- 화자는 한밤의 카드방 주인 무진. 부드러운 해요체, 여유 있고 살짝 장난기. 단정하지 않고 비춰 주듯 말한다.
- 문장은 짧게, 한 문장 45자 안팎.
[공통 규칙]
- 아래 펼침 카드에 있는 카드 · 자리 · 방향 · 뜻만 근거로 쓴다. 카드에 없는 사건이나 숫자를 지어내지 않는다.
- 열 장은 질문자가 78장 중에서 직접 고른 카드다. '당신이 고른 카드'라는 감각을 살린다.
- 카드 이름을 문장에 자연스럽게 넣는다. 질문이 있으면 질문에 답하는 방향으로 읽는다.
- 타로를 처음 보는 사람도 알게 쉽게 쓴다. 단락마다 결론을 먼저, 카드 근거는 뒤에. 자리 이름(장애물 · 뿌리 등)은 처음 나올 때 무슨 자리인지 짧게 풀어 준다. 추상적인 말 대신 일상 장면으로.
- 건강 · 투자 · 법률은 단정하지 않는다. 물음표, 느낌표, 말줄임표, 이모지를 쓰지 않는다.
- 답은 요청한 JSON 하나만. 설명 문장, 코드펜스 없이.`;
function prompts(){
  const core=`${RULE}\n\n[할 일] 켈틱 크로스 열 장 풀이의 총평과 석 달 흐름을 쓴다.
출력 JSON 형식: {"sum":["총평 3단락. 현재에서 결과로 가는 큰 줄기, 장애물과 열쇠, 질문에 대한 답. 단락마다 120~180자"],"months":[{"m":"N월","title":"그달 제목 6~12자","text":"그달 흐름 110~170자. 가까운 미래 · 희망과 두려움 · 결과 카드를 차례로 근거로"}],"date":"결정적인 시기 한 줄 20~45자. 결과카드시기를 근거로","action":"석 달 동안 할 행동 한 가지 40~80자. 나 자리 카드를 근거로","letter":["무진의 편지 4~5단락, 단락마다 40~90자"]}
months는 석달 순서대로 정확히 3개.

[펼침 카드]
${fact()}`;
  const cards=`${RULE}\n\n[할 일] 열 자리 카드를 한 장씩 풀이한다. 자리 뜻과 카드 뜻, 방향을 엮어 질문에 비춰 읽는다.
출력 JSON 형식: 배열. 자리마다 {"i":번호,"title":"그 자리 한 줄 제목 6~14자","text":"풀이 110~170자"}
대상 자리 번호: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9

[펼침 카드]
${fact()}`;
  return [{id:'core',prompt:core,check:d=>d&&Array.isArray(d.sum)&&Array.isArray(d.months)},{id:'cards',prompt:cards,check:d=>Array.isArray(d)&&d.every(x=>x&&typeof x.text==='string')}]; }
function apply(id,d){ if(id==='core') ['sum','months','date','action','letter'].forEach(k=>{ if(d[k]&&d[k].length) C[k]=d[k]; }); else d.forEach(x=>{ const i=+x.i; if(i>=0&&i<10) C.cards[i]=Object.assign({},C.cards[i],x); }); }
function build(){ const ps=a=>K.ps(a,''), t=x=>K.esc(x);
  const H=[`<div class="pk-st" id="trst" hidden></div>`];
  H.push(K.sec('켈틱 크로스 열 장',`<div class="pk-deck">${D.map((x,i)=>{ const c=card(x.n); return `<button type="button" data-z="${i}"><span class="${x.rv?'rv':''}" style="background-image:url('${c.img}')"></span><small>${i+1} ${POS[i][0]}</small><b>${c.ko}</b></button>`; }).join('')}</div>`+ps(C.sum),'카드를 누르면 자리 풀이'));
  H.push(K.sec('자리마다 한 장씩',`<div class="pk-acc">${D.map((x,i)=>{ const c=card(x.n), cc=C.cards[i]||{};
    return K.row({k:'r'+i,cls:i===9?'pk-hi':'',a:`${i+1}`,asub:POS[i][0],b:`<em>${c.ko}</em>${t(cc.title||(x.rv?'역방향':'정방향'))}`,c:x.rv?'역':'정',
      body:ps([cc.text])+`<p class="pk-key"><b>키워드</b>${(x.rv?c.kwR:c.kw).map(k=>'#'+k).join(' ')}</p>`+K.ev([POS[i][1],`${c.el} 기운`,x.rv?'역방향':'정방향'])}); }).join('')}</div>`));
  H.push(K.sec('앞으로 석 달',`<div class="pk-cards">${(C.months||[]).slice(0,3).map(m=>`<div class="pk-card"><b>${t(m.m)}</b><div><p class="pk-ct">${t(m.title||'')}</p><p>${t(m.text)}</p></div></div>`).join('')}</div>`,'가까운 미래 · 희망과 두려움 · 결과'));
  H.push(K.sec('결정적인 때와 할 일 하나',`<div class="pk-items"><div><small>결정적인 때</small><p>${t(C.date)}</p></div><div><small>할 일 하나</small><p>${t(C.action)}</p></div></div>`));
  H.push(K.letter(C.letter||[],{title:'무진이 남기는 말',name:'무진'},'MUJIN',''));
  H.push(`<p class="pk-note" style="margin:14px 0 0">${ST.ai?'이 풀이는 뽑힌 카드의 표준 해석만 재료로 AI가 무진의 말투로 쓴 글이에요. 타로 전문가 감수 전 원고예요':'이 부분은 카드 해석 사전으로 조립한 초안이에요. 정식 서비스에서는 같은 카드로 무진이 길게 풀어 줘요'}</p>`);
  return H.join(''); }
function render(){ K.keepOpen(host,()=>{ host.innerHTML=build(); }); K.status(host.querySelector('#trst'),Object.assign({who:'무진이 열 장 풀이'},ST));
  host.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{ const r=host.querySelector(`.pk-row[data-k="r${b.dataset.z}"]`); if(r){ r.classList.add('open'); r.scrollIntoView({behavior:'smooth',block:'center'}); } }); }
/* ---------- 열 장 직접 고르기 ----------
   카드방 장면 위에 78장 리본 덱(무료와 같은 엔진) + 켈틱 크로스 자리판. 저절로 두 번 리플로 섞인 뒤 리본으로 펼쳐진다.
   고른 순서대로 현재부터 결과까지 자리에 날아가 놓이고, 되돌리기 · 남은 카드 다시 섞기 · 닫았다가 이어서 고르기가 된다. */
const TD=window.TarotDeck;
/* 자리판 좌표(가로 398 기준). 가운데 십자: 현재 위에 장애물이 가로로 겹치고, 위 목표 · 아래 뿌리 · 왼쪽 지나간 일 · 오른쪽 가까운 미래.
   오른쪽 기둥: 아래에서 위로 나 · 주변 · 희망과 두려움 · 결과 */
const TW=398, TH=282, CX=126, CY=140, DX=92, DY=86, SX=282, SG=70;
const SLOT=[[CX,CY],[CX,CY,1],[CX,CY-DY],[CX,CY+DY],[CX-DX,CY],[CX+DX,CY],[SX,CY+SG*1.5],[SX,CY+SG*.5],[SX,CY-SG*.5],[SX,CY-SG*1.5]];
let PK=null;
/* 풀이 칸으로 스크롤: scrollIntoView는 overflow:hidden인 무대까지 밀어 올리므로, 가장 가까운 스크롤 칸만 움직인다 */
function into(){ const sc=host.closest('.scroll'); if(!sc){ host.scrollIntoView({block:'start'}); return; }
  const y=host.getBoundingClientRect().top-sc.getBoundingClientRect().top+sc.scrollTop-64; sc.scrollTo({top:Math.max(0,y),behavior:TD.reduced()?'auto':'smooth'}); }
const XSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
function pick(){ if(!PK) PK=picker(); PK.show(); summary(); }
/* 결제 칸 자리: 고르기 화면을 닫았을 때 보이는 요약 + 이어서 고르기 */
function summary(){ if(!PK) return; const got=PK.got();
  host.innerHTML=`<div class="pk-sec tp-pick"><h3>열 장을 직접 골라요<i>${got.length} / 10</i></h3>
    <p class="pk-p">${O.q?`“${K.esc(O.q)}”, `:''}일흔여덟 장을 펼쳐 둔 카드방에서 고른 순서대로 현재부터 결과까지 열 자리에 놓여요.</p>
    <div class="tp-slots">${POS.map((p,k)=>`<div class="${k<got.length?'on':''}${k===got.length?' now':''}"><span></span><small>${k+1} ${p[0]}</small></div>`).join('')}</div>
    <button class="tp-go" type="button">${got.length?'이어서 고르기':'카드 고르러 가기'}</button></div>`;
  host.querySelector('.tp-go').onclick=()=>PK.show(); }
function picker(){ const stage=host.closest('.stage')||document.body, F=TD.sfx, key=O.picked;
  const rnd=TD.rnd, deck=window.TAROT.map(c=>({n:c.n,rv:false}));
  const mix=()=>{ const idx=deck.map((_,i)=>i).filter(i=>!got.includes(i)), vals=idx.map(i=>deck[i].n);
    for(let i=vals.length-1;i>0;i--){ const j=rnd(i+1); [vals[i],vals[j]]=[vals[j],vals[i]]; } idx.forEach((i,k)=>{ deck[i]={n:vals[k],rv:rnd(100)<30}; }); };
  let got=[], landed=[], busy=true, open=false;
  const el=document.createElement('div'); el.className='tpk'; el.hidden=true; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); el.setAttribute('aria-label','켈틱 크로스 열 장 고르기');
  el.innerHTML=`<div class="tpk-area"></div>
    <div class="tpk-hd"><button class="ib tpk-x" type="button" aria-label="닫기">${XSVG}</button><b>켈틱 크로스 열 장</b><span class="tpk-n" aria-hidden="true"><em>0</em> / 10</span></div>
    <div class="tpk-g" aria-live="polite"><b></b><small></small></div>
    <div class="tpk-tray" aria-hidden="true">${SLOT.map((p,k)=>`<div class="tpk-s${p[2]?' x':''}${k>=6?' r':''}" style="left:${p[0]}px;top:${p[1]}px"><span>${k+1}</span>${k===1?'':`<i>${k===0?'<u data-k="0">1 현재</u> · <u data-k="1">2 장애물</u>':`<u data-k="${k}">${k+1} ${POS[k][0]}</u>`}</i>`}</div>`).join('')}</div>
    <div class="tpk-ft"><button class="tpk-un" type="button">되돌리기</button><button class="tpk-re" type="button">다시 섞기</button><button class="tpk-go" type="button" disabled></button></div>`;
  stage.appendChild(el);
  const $$=s=>el.querySelector(s), area=$$('.tpk-area'), tray=$$('.tpk-tray'), slots=[...el.querySelectorAll('.tpk-s')];
  let trayB=0, footT=0;
  function fit(){ const W=el.clientWidth, H=el.clientHeight, g=$$('.tpk-g'), top=(g.offsetTop+g.offsetHeight||104)+10, f=Math.max(.7,Math.min(1.12,(W-24)/TW,(H-top-(H<720?292:330))/TH));
    tray.style.transform=`translateX(-50%) scale(${f.toFixed(3)})`; tray.style.top=top+'px'; trayB=top+TH*f; footT=$$('.tpk-ft').offsetTop+20; }
  const slotT=k=>({el:slots[k].firstElementChild,rz:SLOT[k][2]?90:0,z:k});
  const RB=TD.ribbon(area,{count:deck.length,hideOnLand:true,
    label:'카드 줄. 좌우 화살표로 넘기고 Enter로 가운데 카드를 골라요',
    layout:G=>{ fit(); const ry=Math.min(footT-G.ch*.62-6,trayB+(footT-trayB)*.6); G.ry=Math.max(trayB+G.ch*.7,ry); G.sy=G.ry-8; },
    pick:(c,i)=>{ if(got.length>=10||busy) return null; const k=got.length; got.push(i); landed[k]=false; TD.preload(window.TAROT[deck[i].n]); paint(); return slotT(k); },
    onLand:(c,i)=>{ const k=got.indexOf(i); if(k>=0) landed[k]=true; paint(); if(got.length===10&&landed.every(Boolean)){ F.chime(523,.12); } }});
  function paint(){ const k=got.length; $$('.tpk-n em').textContent=k;
    slots.forEach((s,j)=>{ s.classList.toggle('on',j<k&&!!landed[j]); s.classList.toggle('now',j===k&&!busy); });
    el.querySelectorAll('.tpk-tray u').forEach(u=>{ const j=+u.dataset.k; u.className=j<k?'on':j===k&&!busy?'now':''; });
    const g=$$('.tpk-g');
    if(busy){ g.querySelector('b').textContent='카드를 섞고 있어요'; g.querySelector('small').textContent='질문을 한 번 더 마음속으로 떠올려요'; }
    else if(k<10){ const tip=k?'끌리는 카드를 위로 밀어 올려요':'좌우로 넘기다가 위로 밀어 올려요'; g.querySelector('b').textContent=`${k+1}번째 자리 · ${POS[k][0]}`; g.querySelector('small').textContent=`${POS[k][1]} · ${tip}`; }
    else { g.querySelector('b').textContent='열 장이 다 놓였어요'; g.querySelector('small').textContent='펼치면 무진이 자리마다 한 장씩 읽어요'; }
    $$('.tpk-un').disabled=busy||!k; $$('.tpk-re').disabled=busy||k>=10;
    const go=$$('.tpk-go'); go.disabled=k<10||!landed.every(Boolean); go.textContent=k<10?`${10-k}장 더 골라요`:'열 장 펼치기'; }
  $$('.tpk-un').onclick=()=>{ if(busy||!got.length||RB.phase()!=='pick') return; const k=got.length-1, i=got.pop(); landed.length=k; RB.unpick(i,slotT(k)); paint(); F.tick(.06); };
  $$('.tpk-re').onclick=async()=>{ if(busy||got.length>=10||RB.phase()!=='pick') return; busy=true; paint(); mix(); await RB.reshuffle(2); busy=false; paint(); };
  $$('.tpk-go').onclick=()=>{ if(got.length<10||!landed.every(Boolean)) return; O.cc=got.map(i=>Object.assign({},deck[i])); D=O.cc; PK.kill(); PK=null; reveal(); setTimeout(into,80); };
  $$('.tpk-x').onclick=()=>{ hide(); summary(); into(); const b=host.querySelector('.tp-go'); if(b) try{ b.focus({preventScroll:true}); }catch(e){} };
  el.addEventListener('keydown',e=>{ if(e.key==='Escape'){ e.preventDefault(); $$('.tpk-x').onclick(); } });
  function hide(){ open=false; el.classList.remove('on'); stage.classList.remove('tpk-on'); if(window.ROOM) ROOM.stop(); setTimeout(()=>{ if(!open) el.hidden=true; },420); }
  let first=true;
  async function show(){ if(open) return; open=true; el.hidden=false; stage.classList.add('tpk-on'); stage.scrollTop=0; if(window.ROOM){ ROOM.start(); ROOM.mode('pick'); }
    requestAnimationFrame(()=>el.classList.add('on')); try{ F.ctx(); }catch(e){}
    if(first){ first=false; busy=true; paint(); mix(); await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))); fit(); RB.stack(false); await RB.riffles(2); busy=false; RB.spread(); paint(); F.chime(523,.1); }
    else { fit(); RB.relayout(); paint(); }
    try{ area.focus({preventScroll:true}); }catch(e){} }
  const onRs=()=>{ if(open){ fit(); RB.relayout(); } }; addEventListener('resize',onRs);
  return {show,key,got:()=>got.slice(),kill(){ if(open) hide(); RB.destroy(); el.remove(); removeEventListener('resize',onRs); }}; }
function reveal(){ C=draft(); ST={}; render(); host.querySelectorAll('.pk-deck span').forEach((e,k)=>{ e.style.animationDelay=(k*0.12)+'s'; e.classList.add('tp-flip'); });
  const f=host.querySelector('.pk-row'); if(f) f.classList.add('open');
  K.runAI({key:'tarot-'+(O.q||O.topic)+'-'+D.map(x=>x.n+(x.rv?'r':'')).join('.'),ver:'v2',parts:prompts(),apply,rerender:render,S:ST}); }
window.TarotPrem={open(el,o){ if(!el||!o||!window.TAROT) return false; if(PK&&(host!==el||PK.key!==o.picked)){ PK.kill(); PK=null; } host=el; O=o; host.className='pkx dark'; host.style.setProperty('--pk-acc','var(--gold)'); host.hidden=false; K.bind(host);
  if(o.cc&&o.cc.length===10){ D=o.cc; reveal(); } else pick(); return true; }};
})();
