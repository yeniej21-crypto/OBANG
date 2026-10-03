/* 출근길 재미 운세 3종(10/3 21:40 기획, 22:00 은주: 전부 무료 · 재미로만 · 가벼운 톤).
   day 오늘의 일운(도준) · pay 내 몸값 리포트(세린, 칭찬 없는 감정사) · boss 상사 궁합(도준)
   ?t=day|pay|boss 로 바로 열기. 영상은 들어오자마자 무음 재생, 첫 터치에 소리. */
(function(){
const S=window.Saju, $=id=>document.getElementById(id);
const D2='https://d2ol7oe51mr4n9.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/', CF='https://d8j0ntlcm91z4.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/hf_20261003_';
const DOJUN={n:'도준',img:CF+'084427_0f26f62a-829f-4db8-8f13-60e26ea429e1_min.webp',v:'v/rv_earth.mp4?v=2',tag:'커리어 · 황룡 도준'};
const SERIN={n:'세린',img:'img/yin/metal.jpg',v:window.WM_SERIN||'',tag:'몸값 감정 · 백호 세린'};
const T={day:{h:DOJUN,t:'오늘의 일운',p:'출근길에 가볍게 보는 오늘의 일 운. 재미로만 봐 줘.'},
  pay:{h:SERIN,t:'내 몸값 리포트',p:'칭찬은 아껴 둘게. 네 값은 내가 매겨 줄게.'},
  boss:{h:DOJUN,t:'상사 궁합',p:'팀장 눈에 내가 어떻게 보이는지. 보고 방식부터 승진 타이밍까지.'}};
let K=(new URLSearchParams(location.search).get('t')||'day'); if(!T[K]) K='day';
const toast=t=>{ let e=$('toast'); if(!e){ e=document.createElement('div'); e.id='toast'; e.className='toast'; document.body.appendChild(e); } e.textContent=t; e.classList.add('on'); clearTimeout(e._t); e._t=setTimeout(()=>e.classList.remove('on'),1800); };
const loadMe=()=>{ try{ return JSON.parse(sessionStorage.getItem('me')||localStorage.getItem('obMe')||'null'); }catch(e){ return null; } };
const saveMe=o=>{ try{ const n=Object.assign(loadMe()||{},o); sessionStorage.setItem('me',JSON.stringify(n)); localStorage.setItem('obMe',JSON.stringify(n)); }catch(e){} };
$('back').onclick=()=>{ if(history.length>1) history.back(); else location.href='./'; };
addEventListener('scroll',()=>$('top').classList.toggle('sc',scrollY>200),{passive:true});
const GAN_K=S.GAN_K, JI_K=S.JI_K, GRP=['비겁','식상','재성','관성','인성'];

/* ---------- 진행자 영상 ---------- */
const vh=$('vh'); let vid=null, sndOn=false;
function hostVid(src){ if(vid){ vid.remove(); vid=null; } if(!src) return; const v=document.createElement('video'); v.playsInline=true; v.setAttribute('playsinline',''); v.preload='auto'; v.muted=!sndOn; v.src=src; v.onplaying=()=>v.classList.add('on'); vh.insertBefore(v,vh.querySelector('.nm')); vid=v;
  const p=v.play(); if(p&&p.catch) p.catch(e=>{ if(e&&e.name==='NotAllowedError'&&!v.muted){ v.muted=true; sndOn=false; v.play().catch(()=>{}); } }); }
function soundUp(){ if(sndOn) return; let off=false; try{ off=sessionStorage.getItem('obSnd')==='0'; }catch(e){} if(off) return; sndOn=true; if(vid){ vid.muted=false; if(vid.ended||vid.currentTime>1){ try{ vid.currentTime=0; }catch(e){} } vid.play().catch(()=>{}); } }
try{ if(navigator.userActivation&&navigator.userActivation.hasBeenActive) sndOn=true; }catch(e){}
addEventListener('obsound',soundUp); document.addEventListener('pointerdown',function f(){ document.removeEventListener('pointerdown',f,true); setTimeout(soundUp,260); },true);

/* ---------- 탭 ---------- */
function tab(k){ K=k; const c=T[k]; $('tabs').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.t===k));
  vh.querySelector('.po').src=c.h.img; vh.querySelector('.nm small').textContent=c.h.tag; $('hT').textContent=c.t; $('hP').textContent=c.p; hostVid(c.h.v);
  $('rs').hidden=true; $('pd').hidden=true; $('pv').classList.remove('on'); $('pv').innerHTML=''; form();
  try{ history.replaceState(null,'','?t='+k); }catch(e){} }
$('tabs').onclick=e=>{ const b=e.target.closest('[data-t]'); if(b&&b.dataset.t!==K){ tab(b.dataset.t); scrollTo({top:vh.offsetHeight-60,behavior:'smooth'}); } };

/* ---------- 입력 ---------- */
const yNow=new Date().getFullYear();
function dateRow(id,me,lab){ me=me||{}; const ys=[]; for(let y=yNow-17;y>=1950;y--) ys.push(y);
  return `<label>${lab}</label><div class="seg" id="${id}C"><button data-v="s" class="${me.cal!=='l'?'on':''}" type="button">양력</button><button data-v="l" class="${me.cal==='l'?'on':''}" type="button">음력</button></div>
  <div class="g3"><select id="${id}Y">${ys.map(y=>`<option ${+me.y===y||(!me.y&&y===(id==='b'?1985:1993))?'selected':''}>${y}</option>`).join('')}</select><select id="${id}M">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${+me.m===i+1?'selected':''}>${i+1}월</option>`).join('')}</select><select id="${id}D"></select></div>`; }
function wire(id,me){ me=me||{}; const fill=()=>{ const y=+$(id+'Y').value, m=+$(id+'M').value, n=new Date(y,m,0).getDate(), cur=+$(id+'D').value||+me.d||14; $(id+'D').innerHTML=Array.from({length:n},(_,i)=>`<option value="${i+1}" ${cur===i+1?'selected':''}>${i+1}일</option>`).join(''); };
  fill(); $(id+'Y').onchange=$(id+'M').onchange=fill; $(id+'C').querySelectorAll('button').forEach(b=>b.onclick=()=>$(id+'C').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))); }
function read(id){ const cal=$(id+'C').querySelector('.on').dataset.v, o={cal,y:+$(id+'Y').value,m:+$(id+'M').value,d:+$(id+'D').value}; let s={y:o.y,m:o.m,d:o.d};
  if(cal==='l'){ s=S.lunarToSolar(o.y,o.m,o.d,false); if(!s){ toast('없는 음력 날짜예요'); return null; } } return {o,s}; }
function form(){ const me=loadMe()||{}, f=$('fm');
  const btn={day:'오늘 일운 보기',pay:'내 몸값 감정 받기',boss:'상사 궁합 보기'}[K];
  f.innerHTML=dateRow('a',me,'내 생일')+(K==='boss'?dateRow('b',{},'팀장 생일 (모르면 대충 나이만 맞춰도 돼요)'):'')+`<button class="go" id="goF" type="button">${btn}</button>`;
  wire('a',me); if(K==='boss') wire('b',{});
  $('goF').onclick=()=>{ const a=read('a'); if(!a) return; saveMe(a.o); const P=S.pillars(a.s.y,a.s.m,a.s.d,me.h==null||me.h===''?null:+me.h);
    if(K==='day') show(day(P)); else if(K==='pay') show(pay(P)); else { const b=read('b'); if(!b) return; show(boss(P,S.pillars(b.s.y,b.s.m,b.s.d,null))); } }; }

/* ---------- 계산 ---------- */
const clamp=v=>Math.max(28,Math.min(97,Math.round(v)));
const nextMonths=n=>{ const t=new Date(), out=[]; for(let i=0;i<n;i++){ const d=new Date(t.getFullYear(),t.getMonth()+i,15), mp=S.monthPillarAt(d.getFullYear(),d.getMonth()+1,15); out.push({y:d.getFullYear(),m:d.getMonth()+1,s:mp[0],b:mp[1]}); } return out; };
const mm=o=>(o.y!==new Date().getFullYear()?String(o.y).slice(2)+'년 ':'')+o.m+'월';
const HOURS=[[4,'아침 7~9시'],[5,'오전 9~11시'],[6,'점심 11~1시'],[7,'오후 1~3시'],[8,'오후 3~5시'],[9,'저녁 5~7시']];
/* 1) 오늘의 일운 */
const DAYL=[{w:'동료와 공이 겹치기 쉬운 날',av:'그거 제가 한 건데요',s:'오늘은 네 몫을 주장하지 말고, 같이 한 걸로 둬. 그게 남는 장사야.'},
  {w:'아이디어는 잘 나오는데 말이 앞서는 날',av:'솔직히 말하면',s:'좋은 생각은 메모로 먼저 정리해. 입으로 먼저 꺼내면 반만 먹혀.'},
  {w:'숫자와 성과가 먹히는 날',av:'대충 이 정도면',s:'오늘 보고엔 숫자 하나를 꼭 넣어. 그게 네 값을 정해.'},
  {w:'윗사람 눈에 띄는 날',av:'제가 알아서 할게요',s:'중간보고 한 번만 해. 오늘은 보여 준 만큼 평가받는 날이야.'},
  {w:'배우고 정리하기 좋은 날',av:'그건 나중에요',s:'급한 불 대신 쌓아 둔 문서 하나를 끝내. 그게 다음 달에 돌아와.'}];
function day(P){ const t=new Date(), dp=S.dayPillar(t.getFullYear(),t.getMonth()+1,t.getDate()), dm=P.d[0], db=P.d[1], g=S.rel(dm,S.stEl(dp[0])), st=S.strength(P);
  const ch=S.isChung(dp[1],db), hp=S.isHap(dp[1],db), fav=S.favorable(st,g);
  const base=60+[-4,4,7,8,6][g]+(hp?8:0)-(ch?12:0)+(fav?6:0);
  const sc={보고:clamp(base+(g===3?12:g===4?5:0)-(ch?6:0)),회의:clamp(base+(g===1?12:g===0?-6:0)),협상:clamp(base+(g===2?14:g===0?-10:0)),집중:clamp(base+(g===4?10:0)-(ch?8:0))};
  const tot=clamp((sc.보고+sc.회의+sc.협상+sc.집중)/4);
  const hrs=HOURS.filter(h=>!S.isChung(h[0],db)).map(h=>({h,v:(S.isHap(h[0],db)?3:0)+(S.favorable(st,S.relBranch(dm,h[0]))?2:0)+(S.relBranch(dm,h[0])===3?1:0)})).sort((a,b)=>b.v-a.v).slice(0,2).map(x=>x.h[1]);
  const L=DAYL[g];
  return {k:'day',tot,sc,hrs,L,ch,hp,title:L.w,gd:tot>=75?'잘 풀리는 날':tot>=58?'무난한 날':'몸 사릴 날',
    why:`근거 · 오늘 ${GAN_K[dp[0]]}${JI_K[dp[1]]}일은 ${GAN_K[dm]}일간에게 ${GRP[g]}${ch?' · 내 자리(일지)와 충':''}${hp?' · 내 자리와 합':''}. 시간은 일지와 합이 되고 충이 없는 업무 시간으로 골랐어요.`}; }
/* 2) 내 몸값(세린) */
const PTYPE=[{n:'독립형',d:'내 이름 걸고 일할 때 값이 제일 비싸지는 사람',op:'회사 안에서도 내 프로젝트 하나를 맡겠다고 먼저 말하세요.',ng:'다들 이 정도 받잖아요'},
  {n:'실력형',d:'결과물이 쌓일수록 값이 붙는 사람',op:'지난 1년 결과물 세 개를 숫자로 보여 드릴게요.',ng:'열심히 했습니다'},
  {n:'협상형',d:'돈 얘기를 피하지 않을 때 값이 오르는 사람',op:'제가 기대하는 금액은 이 정도고, 근거는 이렇습니다.',ng:'회사 사정에 맞춰 주세요'},
  {n:'직함형',d:'자리와 책임이 커질 때 값이 따라오는 사람',op:'다음 해엔 이 범위까지 맡고 싶습니다. 그에 맞는 대우를 원해요.',ng:'시키는 건 다 할게요'},
  {n:'전문가형',d:'자격 · 경력 한 줄이 값을 올리는 사람',op:'이 분야는 제가 제일 오래 했습니다. 시장가를 기준으로 말씀드릴게요.',ng:'아직 배우는 중이라서요'}];
function pay(P){ const dm=P.d[0], cnt=[0,0,0,0,0], st=S.strength(P);
  [P.y,P.m,P.d,P.h].forEach((p,i)=>{ if(!p) return; if(i!==2) cnt[S.rel(dm,S.stEl(p[0]))]++; cnt[S.relBranch(dm,p[1])]+=(i===1?1.5:1); });
  const top=cnt.indexOf(Math.max(...cnt)), v=clamp(52+cnt[2]*7+cnt[3]*5+cnt[1]*3+(st.strong?6:-2)), low=[1,2,3].sort((a,b)=>cnt[a]-cnt[b])[0];
  const say=v>=80?'비싼 편이야. 문제는 네가 그걸 말을 안 한다는 거.':v>=65?'평균보다 위. 다만 지금 받는 값이 그만큼은 아닐 거야.':'아직 덜 매겨졌어. 값이 낮은 게 아니라, 값을 붙일 근거가 부족한 거야.';
  return {k:'pay',v,top,low,say,cnt,st,P,title:PTYPE[top].n+' · '+PTYPE[top].d,gd:v>=80?'고평가 대기':v>=65?'시세 이상':'저평가 상태',
    why:`근거 · ${GAN_K[dm]}일간 기준 돈 그릇(재성) ${cnt[2]} · 자리 그릇(관성) ${cnt[3]} · 실력(식상) ${cnt[1]}, ${st.label}. 몸값 지수는 재성 · 관성 · 식상과 신강약으로 냈어요.`}; }
/* 3) 상사 궁합 */
const YUANJIN=[7,6,9,8,11,10,1,0,3,2,5,4];
const BOSS=[{n:'라이벌형 팀장',d:'나를 부하보다 경쟁자로 보기 쉬운 사이',rp:'결론부터 짧게, 공은 팀장 쪽으로',ng:'그건 제 방식대로 할게요'},
  {n:'피곤한 팀장',d:'내 말이 잔소리처럼 들리기 쉬운 사이',rp:'의견은 질문 형태로, 대안은 두 개',ng:'제가 해 봐서 아는데요'},
  {n:'다루기 쉬운 팀장',d:'내가 흐름을 쥘 수 있는 사이',rp:'숫자와 일정 위주로, 결정은 팀장이 한 것처럼',ng:'그냥 제가 정할게요'},
  {n:'엄한 팀장',d:'평가와 통제가 분명한 위아래 사이',rp:'마감 전 중간보고, 실수는 먼저 말하기',ng:'몰랐습니다'},
  {n:'멘토형 팀장',d:'나를 키워 주고 싶어 하는 사이',rp:'배운 걸 보여 주는 보고, 조언을 먼저 구하기',ng:'괜찮습니다, 혼자 할게요'}];
function boss(A,B){ const g=S.rel(A.d[0],S.stEl(B.d[0])), ad=A.d[1], bd=B.d[1], hap=S.isHap(ad,bd), ch=S.isChung(ad,bd), yj=YUANJIN[ad]===bd;
  const v=clamp(62+[-6,-8,6,0,12][g]+(hap?12:0)-(ch?14:0)-(yj?8:0));
  const ms=nextMonths(12), good=ms.filter(o=>S.isHap(o.b,ad)||S.isHap(o.b,bd)).slice(0,3), bad=ms.filter(o=>S.isChung(o.b,ad)||S.isChung(o.b,bd)).slice(0,2), promo=ms.filter(o=>S.rel(A.d[0],S.stEl(o.s))===3&&!S.isChung(o.b,ad))[0];
  const say=v>=78?'잘 맞아. 팀장 쪽에서 너를 먼저 찾을 사이야.':v>=62?'나쁘지 않아. 보고 방식만 맞추면 편해져.':'결이 달라. 싸우지 말고 방식을 바꾸는 쪽이 이득이야.';
  return {k:'boss',v,g,hap,ch,yj,good,bad,promo,say,B:BOSS[g],title:BOSS[g].n+' · '+BOSS[g].d,gd:v>=78?'잘 맞음':v>=62?'맞춰 가는 사이':'결이 다름',
    why:`근거 · 내 일간 ${GAN_K[A.d[0]]}에게 팀장 일간 ${GAN_K[B.d[0]]}은 ${GRP[g]}${hap?' · 두 사람 일지가 합':''}${ch?' · 두 사람 일지가 충':''}${yj?' · 일지 원진':''}.`}; }

/* ---------- 결과 ---------- */
function show(R){ let h='';
  if(R.k==='day'){ h=`<div class="hd"><small>도준이 본 오늘의 일운</small><span class="gd">${R.gd}</span><h2>${R.title}</h2></div><div class="big">${R.tot}<small>점</small></div>
    <div class="bars">${Object.entries(R.sc).map(([k,v])=>`<div><b>${k}</b><i style="--w:${v}%"></i><em>${v}</em></div>`).join('')}</div>
    <p class="bb"><em>도준</em>${R.L.s}</p><div class="lk">오늘 피할 말 · <b>"${R.L.av}"</b></div>
    <ul><li><b>집중 잘 되는 시간</b>${R.hrs.join(' · ')||'오전 9~11시'}</li>${R.ch?'<li><b>오늘 조심</b>내 자리와 부딪히는 날이라 일정 변동이 잦아요. 중요한 약속은 확인 한 번 더.</li>':''}</ul><p class="why">${R.why}</p>`; }
  else if(R.k==='pay'){ h=`<div class="hd"><small>세린의 몸값 감정</small><span class="gd">${R.gd}</span><h2>${R.title}</h2></div><div class="big">${R.v}<small>점</small></div>
    <p class="bb"><em>세린</em>${R.say}</p><ul><li><b>너의 값이 붙는 방식</b>${PTYPE[R.top].d}. 같은 일을 해도 이 방식으로 보여 줄 때 값이 커져요.</li></ul><p class="why">${R.why}</p>`; }
  else { h=`<div class="hd"><small>도준이 본 상사 궁합</small><span class="gd">${R.gd}</span><h2>${R.title}</h2></div><div class="big">${R.v}<small>점</small></div>
    <p class="bb"><em>도준</em>${R.say}</p><ul><li><b>팀장 눈에 비친 나</b>${['내 자리를 넘보는 사람','말 많은 똑똑이','믿고 맡기는 실무자','지켜봐야 할 신입','키워 볼 만한 후배'][R.g]}</li></ul><p class="why">${R.why}</p>`; }
  h+=`<p class="dis">재미로 보는 운세예요. 이직 · 연봉 · 인간관계처럼 중요한 결정은 실제 조건과 주변 조언을 먼저 살펴 주세요.</p><button class="go" id="shr" type="button" style="margin-top:12px">결과 친구에게 보내기</button>`;
  $('rs').innerHTML=h; $('rs').hidden=false; window.__WR=R; $('shr').onclick=()=>share(R);
  $('pv').classList.remove('on'); $('pv').innerHTML='';
  if(R.k==='day'){ $('pd').hidden=false; $('pdT').textContent='세린의 몸값 감정 · 무료'; $('pdS').textContent='오늘 일운을 봤다면, 다음은 내 값. 몸값 지수와 협상 타이밍'; $('pdGo').innerHTML='내 몸값 보러 가기'; $('pdGo').onclick=()=>{ tab('pay'); scrollTo({top:vh.offsetHeight-60,behavior:'smooth'}); }; }
  else { $('pd').hidden=false; $('pdT').textContent=R.k==='pay'?'세린의 몸값 리포트 전체 · 무료':'상사 궁합 전체 · 무료'; $('pdS').textContent=R.k==='pay'?'연봉 얘기 꺼낼 달 · 요일 · 시간, 협상 첫 문장, 피할 말, 몸값 올리는 일 세 가지':'잘 먹히는 보고 방식, 금지어, 풀리는 달 · 부딪히는 달, 승진 얘기 꺼낼 타이밍';
    $('pdGo').innerHTML='무료로 전체 보기'; $('pdGo').onclick=()=>{ $('pv').innerHTML=full(R); $('pv').classList.add('on'); setTimeout(()=>$('pv').scrollIntoView({behavior:'smooth',block:'start'}),80); }; }
  setTimeout(()=>$('rs').scrollIntoView({behavior:'smooth',block:'start'}),80); }
function buy(R,pr){ const open=()=>{ $('pv').innerHTML=full(R); $('pv').classList.add('on'); setTimeout(()=>$('pv').scrollIntoView({behavior:'smooth',block:'start'}),80); };
  const c=T[R.k]; if(window.ObPay&&ObPay.open) ObPay.open({name:c.t+' · '+c.h.n,who:c.h.n,desc:$('pdS').textContent,price:pr,img:c.h.img,noAuth:true,after:open}); else open(); }
function full(R){
  if(R.k==='pay'){ const P=R.P, dm=P.d[0], ms=nextMonths(12), best=ms.filter(o=>S.rel(dm,S.stEl(o.s))===2||S.isHap(o.b,P.d[1])).slice(0,2);
    const t=new Date(), days=[]; for(let i=1;i<60&&days.length<3;i++){ const d=new Date(t.getFullYear(),t.getMonth(),t.getDate()+i), w=d.getDay(); if(w===0||w===6) continue; const dp=S.dayPillar(d.getFullYear(),d.getMonth()+1,d.getDate()); if(S.rel(dm,S.stEl(dp[0]))===2&&!S.isChung(dp[1],P.d[1])){ days.push(`${d.getMonth()+1}월 ${d.getDate()}일(${'일월화수목금토'[w]})`); i+=5; } }
    const UP=[['결과물 하나를 숫자로 다시 쓰기','지난 성과를 매출 · 시간 · 인원 같은 숫자로 바꿔 두세요'],['맡는 범위 넓히기','작은 팀이라도 사람을 맡는 경험이 값을 올려요'],['내 이름 걸린 일 하나','사내 발표 · 글 · 사이드 프로젝트 하나가 몸값의 근거가 돼요']][R.low-1]||['자격 한 줄 더하기','업계가 인정하는 자격이나 수료 하나'];
    return `<div class="rs"><div class="hd"><small>세린의 몸값 리포트</small><h2>${PTYPE[R.top].n}의 값 올리는 법</h2></div><ul>
     <li><b>연봉 얘기 꺼낼 달</b>${best.length?best.map(mm).join(' · '):'올해는 돈 기운보다 자리 기운. 직함부터'}. 돈의 기운이 들거나 내 자리와 합이 되는 달이에요.</li>
     <li><b>꺼내기 좋은 날</b>${days.join(' · ')||'다음 달 초 평일'} · 오후 1시에서 3시 사이</li>
     <li><b>첫 문장</b>"${PTYPE[R.top].op}"</li><li><b>절대 하지 말 말</b>"${PTYPE[R.top].ng}"</li>
     <li><b>몸값 올리는 일 · ${UP[0]}</b>${UP[1]}.</li>
     <li><b>세린의 한마디</b>값은 회사가 매기는 게 아니라, 네가 먼저 부르는 거야. 부르지 않으면 제일 싼 값이 붙어.</li></ul></div>`; }
  return `<div class="rs"><div class="hd"><small>도준의 상사 궁합</small><h2>${R.B.n} 다루는 법</h2></div><ul>
   <li><b>잘 먹히는 보고</b>${R.B.rp}.</li><li><b>절대 하지 말 말</b>"${R.B.ng}"</li>
   <li><b>관계가 풀리는 달</b>${R.good.length?R.good.map(mm).join(' · '):'올해는 큰 변화 없이 평탄해요'}. 밥 한 번, 피드백 요청은 이때.</li>
   <li><b>부딪히는 달</b>${R.bad.length?R.bad.map(mm).join(' · ')+'. 이 달엔 반대 의견을 회의 자리에서 말하지 말고 따로.':'크게 부딪히는 달은 없어요.'}</li>
   <li><b>승진 · 평가 얘기 꺼낼 타이밍</b>${R.promo?mm(R.promo)+'. 내 쪽에 자리 기운(관성)이 들어오는 달이에요.':'1년 안엔 자리 기운이 약해요. 평가 시즌 전에 성과 정리부터.'}</li>
   <li><b>도준의 한마디</b>상사는 바꿀 수 없어. 보고 방식은 바꿀 수 있지. 그게 제일 싸게 먹히는 처세야.</li></ul></div>`; }
function share(R){ const url=location.origin+location.pathname+'?t='+R.k+'&ref=share', c=T[R.k];
  try{ if(window.ObShare&&ObShare.open){ ObShare.open({kicker:c.h.n+' · '+c.t,head:R.title,sub:R.say||R.L&&R.L.s||'',big:String(R.tot||R.v),unit:'점',tags:[c.t,R.gd],img:c.h.img,menu:c.t,name:'obang-work.jpg',url}); return; } }catch(e){}
  if(navigator.share) navigator.share({title:c.t,text:R.title,url}).catch(()=>{}); else { try{ navigator.clipboard.writeText(url); toast('주소를 복사했어요'); }catch(e){} } }

$('nx').innerHTML=[['cooltime.html','이직 쿨타임','옮길까, 버틸까 · 무료'],['career.html','커리어 사주','내 일 유형 · 업계 · 능력치'],['chat.html?h=earth','도준과 1:1','일 고민 직접 털어놓기'],['taegil.html','면접 · 입사 날짜 잡기','택일 · 월하'],['./','홈으로','오방도감 처음 화면']].map(x=>`<a class="nx1${x[0]==='./'?' hm':''}" href="${x[0]}"><b>${x[1]}</b><span>${x[2]}</span></a>`).join('');
tab(K);
})();
