/* 도화 궁합 프리미엄 — 둘의 인연 타이밍 (결제 뒤 결과 아래에 이어짐)
   계산: 두 사람 각각 prem2_core(오늘이 든 절월부터 열두 달) + 연애 점수 → 둘이 함께 열리는 달 · 부딪히는 달 · 먼저 연락하기 좋은 날 · 원국 교차 관계
   → AI(태오 문체) · 없으면 초안 */
(function(){
const S_=window.Saju, X=window.SajuX, {GAN,JI,EL,stEl,BR_EL}=S_; const $=id=>document.getElementById(id); const K=window.PK;
const DOW=['일','월','화','수','목','금','토'], EK=['木','火','土','金','水'], EN=['나무','불','흙','쇠','물'];
let D=null,FA=null,FB=null,M=null,C=null,ST={},HON='누나';
function loveScore(o,loveG){ let s=50; if(o.ss.includes('도화')) s+=15; if(o.ss.includes('홍염')) s+=6;
  if(o.br.some(r=>r.at==='일지'&&(r.k==='육합'||r.k==='삼합'))) s+=12; if(o.sr.some(r=>r.at==='일간'&&r.k==='천간합')) s+=10;
  if(o.g1===loveG||o.g2===loveG) s+=o.f1||o.f2?8:4; if(o.br.some(r=>r.at==='일지'&&r.k==='충')) s-=15; if(o.br.some(r=>r.at==='일지'&&r.k==='원진')) s-=6; if(o.ss.includes('공망')) s-=4;
  return Math.max(30,Math.min(96,Math.round(s))); }
const sol=o=>{ if(o.P) return {P:o.P,g:o.g}; /* 신청 링크로 온 사람: 생일 없이 여덟 글자만 */ let s={y:o.y,m:o.m,d:o.d}; if(o.c==='l'){ const c=S_.lunarToSolar(o.y,o.m,o.d,false); if(c) s=c; } return {y:s.y,m:s.m,d:s.d,h:o.h>=0?o.h:null,g:o.g}; };
const chungD=(o)=>o.br.some(r=>r.at==='일지'&&r.k==='충'), hapD=o=>o.br.some(r=>r.at==='일지'&&(r.k==='육합'||r.k==='삼합'));
/* 원국끼리 맞닿는 글자: 서로의 일지 · 일간 기준 */
function cross(){ const A=FA.P, B=FB.P, out=[], seen=new Set();
  const add=(t)=>{ if(!seen.has(t)){ seen.add(t); out.push(t); } };
  X.branchRel(A.d[1],B).filter(r=>r.k!=='같은 글자'||r.at==='일지').forEach(r=>add(`나의 일지 ${JI[A.d[1]]} · 그 사람 ${r.at} ${r.k}`));
  X.branchRel(B.d[1],A).filter(r=>r.at!=='일지'&&r.k!=='같은 글자').forEach(r=>add(`그 사람 일지 ${JI[B.d[1]]} · 나의 ${r.at} ${r.k}`));
  if(X.ganHap(A.d[0],B.d[0])) add(`일간 ${GAN[A.d[0]]} · ${GAN[B.d[0]]} 천간합`);
  if(X.ganChung(A.d[0],B.d[0])) add(`일간 ${GAN[A.d[0]]} · ${GAN[B.d[0]]} 천간충`);
  const dA=X.shinsal(B.d[1],A,B.d[0]), dB=X.shinsal(A.d[1],B,A.d[0]);
  if(dA.includes('도화')) add('그 사람 일지가 나의 도화'); if(dB.includes('도화')) add('나의 일지가 그 사람의 도화');
  if(dA.includes('천을귀인')) add('그 사람 일지가 나의 천을귀인'); if(dB.includes('천을귀인')) add('나의 일지가 그 사람의 천을귀인');
  return out; }
function togetherDays(){ const A=FA.P, B=FB.P, out=[];
  const n0=new Date(), t0=Date.UTC(n0.getFullYear(),n0.getMonth(),n0.getDate());
  for(let t=t0+864e5;t<=t0+365*864e5;t+=864e5){ const d=new Date(t), y=d.getUTCFullYear(), m=d.getUTCMonth()+1, dd=d.getUTCDate(), w=d.getUTCDay(); const [s,b]=S_.dayPillar(y,m,dd);
    if(S_.isChung(b,A.d[1])||S_.isChung(b,B.d[1])) continue;
    const hA=S_.isHap(b,A.d[1]), hB=S_.isHap(b,B.d[1]), gA=X.ganHap(s,A.d[0]), gB=X.ganHap(s,B.d[0]), dA=X.shinsal(b,A,s).includes('도화'), dB=X.shinsal(b,B,s).includes('도화');
    const v=(hA?2.5:0)+(hB?2.5:0)+(gA||gB?1.5:0)+(dA||dB?1:0)+(w===5||w===6?1:0);
    if(v>=4) out.push({y,m,d:dd,w,s,b,v,why:[hA&&hB?'두 사람 배우자 자리와 모두 합':hA?'나의 배우자 자리와 합':hB?'그 사람 배우자 자리와 합':'',gA||gB?'일간과 천간합':'',dA||dB?'도화가 뜨는 날':''].filter(Boolean)}); }
  const r=[], used=new Set(); out.sort((a,b)=>b.v-a.v||a.m-b.m||a.d-b.d).forEach(o=>{ const k=o.y*100+o.m; if(r.length<4&&!used.has(k)){ used.add(k); r.push(o); } }); return r.sort((a,b)=>a.y-b.y||a.m-b.m||a.d-b.d); }
function prep(){ D=window.GHF; if(!D) return false; HON=D.a.g==='m'?'형':'누나'; if(window.PK) PK.male=D.a.g==='m';
  FA=window.Prem2Core.rolling(S_,X,sol(D.a),12); FB=window.Prem2Core.rolling(S_,X,sol(D.b),12);
  const gA=FA.male?2:3, gB=FB.male?2:3;
  M=FA.months.map((oa,i)=>{ const ob=FB.months[i]; const la=loveScore(oa,gA), lb=loveScore(ob,gB);
    let t=Math.round((la+lb)/2); const both=la>=62&&lb>=62, clash=chungD(oa)||chungD(ob); if(both) t+=5; if(clash) t-=6; if(hapD(oa)&&hapD(ob)) t+=4;
    return {i,oa,ob,la,lb,t:Math.max(30,Math.min(96,t)),both,clash,gz:oa.gz,start:oa.start,term:oa.term}; });
  D.cross=cross(); D.days=togetherDays(); C=K.gl(draft()); ST={}; return true; }
const h=t=>String(t==null?'':t).replace(/\{S\}/g,HON);
function relTxt(o,who){ return o.br.filter(r=>r.at==='일지').map(r=>`${who} 일지와 ${r.k}`).concat(o.ss.filter(k=>['도화','홍염','천을귀인'].includes(k)).map(k=>`${who}에게 ${k}`)); }
function draft(){ const R=D.R, A=FA.P, B=FB.P, top=[...M].sort((a,b)=>b.t-a.t), lo=[...M].sort((a,b)=>a.t-b.t)[0];
  const cA=FA.cnt, cB=FB.cnt, fillA=EK.map((k,i)=>cA[i]===0&&cB[i]>0?i:-1).filter(i=>i>=0), fillB=EK.map((k,i)=>cB[i]===0&&cA[i]>0?i:-1).filter(i=>i>=0);
  const hp=S_.isHap(A.d[1],B.d[1]), ch=S_.isChung(A.d[1],B.d[1]);
  const ACT=['같이 숲길 걷기','낮에 햇빛 보며 만나기','같이 밥 지어 먹기','약속 시간 칼같이 지키기','밤에 오래 통화하기'];
  const blank=[...new Set([FA.blank,FB.blank])];
  return {draft:true,
   bond:[`{S}랑 그 사람은 ${R.title}야. 끌림 ${R.pull}, 오래 감 ${R.stay}. ${R.pts[0]?R.pts[0][1]+'이 이 관계의 첫 단추야.':''}`,
     `배우자 자리끼리 보면 ${JI[A.d[1]]} · ${JI[B.d[1]]}${hp?' 합이라 한번 묶이면 잘 안 풀려.':ch?' 충이라 만나면 불꽃이 튀고 싸워도 크게 싸워.':', 크게 묶이지도 부딪히지도 않는 사이야.'}`,
     D.cross.length?`둘 원국이 맞닿는 자리는 ${D.cross.slice(0,3).join(', ')}.`:'둘 원국이 직접 맞닿는 글자는 많지 않아. 대신 시간이 쌓이면서 엮이는 사이야.'],
   months:M.map(o=>({title:o.both?'둘 다 열리는 달':o.clash?'부딪히기 쉬운 달':o.t>=62?'가까워지는 달':'천천히 가는 달',
     text:`${o.term} 달 ${o.gz}. {S} 연애 점수 ${o.la}, 그 사람 ${o.lb}. ${relTxt(o.oa,'{S}').concat(relTxt(o.ob,'그 사람')).join(', ')}`.trim(),tip:o.clash?'말보다 만남 먼저':o.both?'먼저 연락하기':'서두르지 않기'})),
   fight:[ch?`일지 ${JI[A.d[1]]}와 ${JI[B.d[1]]}가 충이라 싸움은 크게 붙어. 그날 안에 푸는 게 규칙이야.`:`둘은 크게 부딪히는 글자가 적어서, 싸움보다 서운함이 쌓이는 쪽을 조심해.`, `${lo.start.m}월이 가장 예민한 달이야.`],
   roles:[fillA.length?`그 사람은 {S}에게 없는 ${fillA.map(i=>EN[i]).join(' · ')} 기운을 갖고 있어.`:`{S}가 먼저 손 내밀 때 이 관계가 움직여.`, fillB.length?`{S}는 그 사람에게 없는 ${fillB.map(i=>EN[i]).join(' · ')} 기운을 채워 줘.`:'그 사람은 받는 만큼 돌려주는 타입이야.'],
   missions:[{t:`${top[0].start.m}월에 둘만의 약속 잡기`,d:`둘의 점수가 가장 높은 달이야. 여행이든 고백이든 이달에.`},{t:blank.map(i=>EK[i]).join('·')+' 기운 같이 채우기',d:blank.map(i=>ACT[i]).join(', ')+'.'},{t:ch?'싸운 날은 그날 풀기':'서운한 건 바로 말하기',d:ch?'충이 있는 사이는 하룻밤만 넘겨도 커져.':'쌓아 두면 크게 터지는 조합이야.'}],
   letter:[`${HON}.`,'궁합은 점수가 아니라 타이밍이야. 좋은 달에 먼저 움직이는 쪽이 이겨.','또 와. 다음엔 둘이 같이.']}; }
function card(ids){ const gz=p=>p?GAN[p[0]]+JI[p[1]]:'모름', R=D.R;
  const one=(F,o)=>({성별:F.male?'남':'여',일간:GAN[F.dm]+EL[stEl(F.dm)],일지:JI[F.P.d[1]]+' '+S_.tgBranch(F.dm,F.P.d[1]),원국:[['년주',F.P.y],['월주',F.P.m],['일주',F.P.d],['시주',F.P.h]].map(([n,p])=>n+' '+gz(p)),오행개수:EK.map((k,i)=>k+F.cnt[i]).join(' '),원국신살:F.natal.map(x=>x.at+' '+x.k)});
  const c={태오가부르는말:HON,나:one(FA,D.a),그사람:one(FB,D.b),궁합:{끌림:R.pull,오래감:R.stay,총점:R.total,유형:R.title,근거:R.pts.map(p=>p[1])},원국교차:D.cross,
   먼저연락하기좋은날:D.days.map(o=>`${o.y}.${o.m}.${o.d}(${DOW[o.w]}) ${GAN[o.s]}${JI[o.b]}일 · ${o.why.join(', ')}`)};
  if(ids&&!ids.length) c.달요약=M.map(o=>`${o.start.m}월 ${o.gz} 둘${o.t} 나${o.la} 그사람${o.lb}${o.both?' 둘다열림':''}${o.clash?' 일지충':''}`);
  else c.달=(ids||M.map((o,i)=>i)).map(i=>{ const o=M[i]; return {번호:i,달:o.start.m+'월',절기:o.term,간지:o.gz,둘의점수:o.t,나의연애점수:o.la,그사람연애점수:o.lb,둘다열림:o.both,일지충:o.clash,
    나기준:o.oa.br.map(r=>r.at+' '+r.k).concat(o.oa.sr.map(r=>r.at+' '+r.k)).concat(o.oa.ss),그사람기준:o.ob.br.map(r=>r.at+' '+r.k).concat(o.ob.sr.map(r=>r.at+' '+r.k)).concat(o.ob.ss)}; });
  return JSON.stringify(c); }
function prompts(){ const A=window.PremAI, ST0=(HON==='형'?A.STYLE.taeo_m:A.STYLE.taeo)+'\n'+A.COMMON.replace('이름을 부를 때는 {N} 토큰만 쓴다(화면이 이름과 호격으로 바꾼다). 이름을 직접 쓰지 않는다.',`이름은 쓰지 않는다. 듣는 사람은 "${HON}", 상대는 "그 사람"이라고만 부른다.`);
  const core=`${ST0}\n\n[할 일] 도화 궁합 프리미엄 '둘의 인연 타이밍'의 본문을 쓴다. 두 사람의 관계에 집중한다.
출력 JSON 형식: {"bond":["둘의 궁합 정체 3~4단락. 끌림과 오래 감의 이유, 배우자 자리(일지)끼리의 관계, 원국 교차, 오행 보완. 단락마다 130~200자"],"fight":["부딪히는 지점과 푸는 법 2~3단락. 충 · 원진 · 형 같은 근거, 싸움이 붙는 장면과 푸는 순서. 단락마다 120~180자"],"roles":["서로에게 어떤 사람인지 2단락. 첫 단락은 그 사람이 ${HON}에게, 둘째 단락은 ${HON}가 그 사람에게. 단락마다 110~170자"],"missions":[{"t":"오래 가는 법 제목 8~16자","d":"구체적인 행동 설명 50~90자"}],"letter":["태오의 편지 5~6단락, 단락마다 50~110자. 둘을 응원하되 가볍지 않게, 마지막은 다음에 또 오라는 말"]}
missions는 정확히 3개.

[사실 카드]
${card([])}`;
  const cal=ids=>`${ST0}\n\n[할 일] 앞으로 열두 달(오늘이 든 절월부터) 둘의 인연 달력의 달별 풀이를 쓴다. 절기 기준 월이다. 둘의 점수, 두 사람 각각의 연애 점수와 관계 · 신살을 근거로 둘 사이에 그달 무슨 결이 흐르는지 쓴다.
출력 JSON 형식: 배열. 달마다 {"i":달 번호,"title":"그달 둘 사이의 제목 6~12자","text":"그달 둘의 이야기 150~220자","tip":"그달 한 줄 당부 10~20자"}
대상 달 번호: ${ids.join(', ')}

[사실 카드]
${card(ids)}`;
  const isArr=d=>Array.isArray(d)&&d.every(x=>x&&typeof x.text==='string');
  return [{id:'core',prompt:core,check:d=>d&&Array.isArray(d.bond)&&Array.isArray(d.letter)},{id:'c0',prompt:cal([0,1,2,3,4,5]),check:isArr},{id:'c1',prompt:cal([6,7,8,9,10,11]),check:isArr}]; }
function apply(id,d){ if(id==='core') ['bond','fight','roles','missions','letter'].forEach(k=>{ if(d[k]&&d[k].length) C[k]=d[k]; }); else d.forEach(x=>{ const i=+x.i; if(i>=0&&i<12) C.months[i]=Object.assign({},C.months[i],x); }); }
function build(){ const n='', ps=a=>K.ps((a||[]).map(h),n), a=D.a, b=D.b;
  const top=[...M].sort((x,y)=>y.t-x.t), hi=top.slice(0,2), lo=[...M].filter(o=>o.clash).sort((x,y)=>x.t-y.t).slice(0,2);
  const H=[`<div class="pk-st" id="ghst" hidden></div>`];
  const who=(F,o)=>`<div><small>${K.esc(o.n)}</small><b>${GAN[F.P.d[0]]}${JI[F.P.d[1]]}</b><em>${EL[stEl(F.dm)]} 일간 · ${JI[F.P.d[1]]} 일지</em></div>`;
  H.push(K.sec('태오의 궁합 노트 · 둘의 궁합 정체',`<div class="pk-vs">${who(FA,a)}${who(FB,b)}</div>`+ps(C.bond)+K.ev(D.R.pts.map(p=>p[1]).concat(D.cross))));
  H.push(K.sec('앞으로 열두 달 둘의 인연 달력',`<div class="pk-acc">${M.map((o,i)=>{ const c=C.months[i]||{}; const tag=hi.includes(o)?'함께 열림':lo.includes(o)?'조심':'';
    return K.row({k:'g'+i,cls:hi.includes(o)?'pk-hi':lo.includes(o)?'pk-lo':'',a:`${o.start.m}월`,asub:`${o.start.y}.${o.start.m}.${o.start.d}~`,b:`<em>${o.gz}</em>${K.esc(h(c.title||''))}${tag?`<span class="pk-tag">${tag}</span>`:''}`,c:o.t,
      body:`<div class="pk-rx3"><div><small>${K.esc(a.n)}</small><b>${o.la}</b></div><div><small>${K.esc(b.n)}</small><b>${o.lb}</b></div><div><small>둘</small><b>${o.t}</b></div></div>`+ps([c.text])+(c.tip?`<p class="pk-key"><b>이달 한 줄</b>${K.esc(h(c.tip))}</p>`:'')+K.ev(relTxt(o.oa,a.n).concat(relTxt(o.ob,b.n)))}); }).join('')}</div>`,'절기 기준 월 · 숫자는 둘의 점수'));
  H.push(K.sec('먼저 연락하기 좋은 날',D.days.length?`<div class="pk-cards">${D.days.map(o=>`<div class="pk-card"><b>${o.m}.${o.d}<small>${DOW[o.w]}요일 · ${GAN[o.s]}${JI[o.b]}일</small></b><div><p>${o.why.join(' · ')}</p></div></div>`).join('')}</div>`:'<p class="pk-p">앞으로 열두 달은 따로 고른 날이 없어. 둘의 점수가 높은 달을 노려.</p>','두 사람 모두 충이 없는 날'));
  H.push(K.sec('부딪히는 지점과 푸는 법',ps(C.fight)));
  H.push(K.sec('서로에게 어떤 사람인가',`<div class="pk-items">${(C.roles||[]).map((p,i)=>`<div><small>${i===0?K.esc(b.n)+' → '+K.esc(a.n):K.esc(a.n)+' → '+K.esc(b.n)}</small><p>${K.esc(h(p))}</p></div>`).join('')}</div>`));
  H.push(K.sec('오래 가는 법 세 가지',`<div class="pk-cards">${(C.missions||[]).slice(0,3).map((m,i)=>`<div class="pk-card"><b>${i+1}</b><div><p class="pk-ct">${K.esc(h(m.t))}</p><p>${K.esc(h(m.d))}</p></div></div>`).join('')}</div>`));
  H.push(K.letter((C.letter||[]).map(h),{title:'태오가 둘에게',name:'태오'},'桃花',n));
  H.push(`<p class="pk-note" style="margin:14px 0 0">${ST.ai?'이 노트는 두 사람의 만세력 계산 근거만 재료로 AI가 태오의 말투로 쓴 글이에요. 명리 전문가 감수 전 원고예요':'이 부분은 해석 사전으로 조립한 초안이에요. 정식 서비스에서는 같은 근거로 태오가 길게 써 줘요'}</p>`);
  return H.join(''); }
function render(){ const host=$('gprem'); K.keepOpen(host,()=>{ host.innerHTML=build(); }); K.status($('ghst'),Object.assign({who:'태오가 궁합 노트'},ST)); }
window.GunghapPrem={open(){ const host=$('gprem'); if(!host||!prep()) return false; host.className='pkx dark'; host.hidden=false; K.bind(host); render();
  const f=host.querySelector('.pk-row.pk-hi'); if(f) f.classList.add('open');
  K.runAI({key:FA.key+'_'+FB.key+'-gh-'+HON+'-'+FA.from.y+'.'+FA.from.m,ver:'v3',parts:prompts(),apply,rerender:render,S:ST}); return true; }};
})();
