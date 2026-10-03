/* 도화 사주 프리미엄 — 태오의 깊은 편지 (결제 뒤 편지 아래에 이어짐)
   계산: prem2_core(오늘이 든 절월부터 열두 달 · 합충 · 신살) + 연애 점수 · 고백하기 좋은 날 → AI(태오 문체) · 없으면 초안 */
(function(){
const S_=window.Saju, X=window.SajuX, {GAN,JI,EL,stEl,GAN_K,JI_K}=S_; const gk=(s,b)=>GAN_K[s]+JI_K[b], kr=t=>String(t).replace(/[甲乙丙丁戊己庚辛壬癸]/g,c=>GAN_K[GAN.indexOf(c)]).replace(/[子丑寅卯辰巳午未申酉戌亥]/g,c=>JI_K[JI.indexOf(c)]); /* 화면에는 한자 대신 한글 읽기 */ const $=id=>document.getElementById(id); const K=window.PK;
const DOW=['일','월','화','수','목','금','토'];
let F=null,C=null,ST={},HON='누나';
function loveScore(o,loveG){ let s=50; if(o.ss.includes('도화')) s+=15; if(o.ss.includes('홍염')) s+=6;
  if(o.br.some(r=>r.at==='일지'&&(r.k==='육합'||r.k==='삼합'))) s+=12; if(o.sr.some(r=>r.at==='일간'&&r.k==='천간합')) s+=10;
  if(o.g1===loveG||o.g2===loveG) s+=o.f1||o.f2?8:4; if(o.br.some(r=>r.at==='일지'&&r.k==='충')) s-=15; if(o.br.some(r=>r.at==='일지'&&r.k==='원진')) s-=6; if(o.ss.includes('공망')) s-=4;
  return Math.max(30,Math.min(96,Math.round(s))); }
function loveDays(){ const P=F.P, dm=F.dm, db=P.d[1], mb=P.m[1], yb=P.y[1], loveG=F.male?2:3, out=[];
  const n0=new Date(), t0=Date.UTC(n0.getFullYear(),n0.getMonth(),n0.getDate());
  for(let t=t0+864e5;t<=t0+365*864e5;t+=864e5){ const d=new Date(t), y=d.getUTCFullYear(), m=d.getUTCMonth()+1, dd=d.getUTCDate(), w=d.getUTCDay(); const [s,b]=S_.dayPillar(y,m,dd);
    if(S_.isChung(b,db)||S_.isChung(b,mb)) continue; const g1=S_.rel(dm,stEl(s)), v=(S_.isHap(b,db)?3:0)+(X.ganHap(s,dm)?2.5:0)+(g1===loveG?1.5:0)+(X.shinsal(b,P,s).includes('도화')?1.5:0)+(w===5||w===6?1:0); if(v>=4) out.push({y,m,d:dd,w,s,b,v}); }
  const r=[], used=new Set(); out.sort((a,b)=>b.v-a.v||a.y-b.y||a.m-b.m||a.d-b.d).forEach(o=>{ const k=o.y*100+o.m; if(r.length<4&&!used.has(k)){ used.add(k); r.push(o); } }); return r.sort((a,b)=>a.y-b.y||a.m-b.m||a.d-b.d); }
function prep(){ const D=window.DHF&&window.DHF(); if(!D) return false; HON=D.bro?'형':'누나'; if(window.PK) PK.male=!!D.bro;
  F=window.Prem2Core.rolling(S_,X,D.inp,12); F.nick=D.nick; F.male=D.inp.g==='m'; F.T=D.T; F.score=D.score;
  const loveG=F.male?2:3; F.months.forEach(o=>o.love=loveScore(o,loveG)); F.days=loveDays(); F.loveG=loveG;
  const P=F.P; F.stars=[['년간',P.y[0],1],['월간',P.m[0],1],['시간',P.h&&P.h[0],1],['년지',P.y[1],0],['월지',P.m[1],0],['일지',P.d[1],0],['시지',P.h&&P.h[1],0]].filter(x=>x[1]!=null).filter(([n,v,st])=>(st?S_.rel(F.dm,stEl(v)):S_.relBranch(F.dm,v))===loveG).map(x=>x[0]);
  C=K.gl(draft()); ST={}; return true; }
const h=t=>t.replace(/\{S\}/g,HON);
function draft(){ const top=[...F.months].sort((a,b)=>b.love-a.love), d=F.P.d[1];
  return {draft:true,nature:[`{S} 도화 유형은 ${F.T.n}이야. ${F.T.d}`,`{S} 사주에서 인연의 별은 ${F.male?'재성':'관성'}인데, ${F.stars.length?F.stars.join(' · ')+'에 있어':'원국엔 드러나 있지 않아서 운에서 들어올 때 피는 타입이야'}.`],
   months:F.months.map(o=>({title:o.ss.includes('도화')?'도화가 피는 달':o.br.some(r=>r.at==='일지'&&r.k==='충')?'흔들리는 달':o.love>=65?'마음이 묶이는 달':'천천히 가는 달',text:`${o.term} 달 ${kr(o.gz)}. ${o.ss.length?o.ss.join(', ')+(K.bt(o.ss[o.ss.length-1])?'이':'가')+' 떠 있어.':''} ${o.br.filter(r=>r.at==='일지').map(r=>`일지랑 ${r.k}`).join(', ')}`,tip:o.love>=65?'약속 거절하지 않기':'서두르지 않기'})),
   pattern:[`{S}는 일지 ${JI_K[d]}${K.bt(JI_K[d])?'이':'가'} ${S_.tgBranch(F.dm,d)}라, 가까워질수록 그 성향이 연애에 드러나.`],meet:[`앞으로 열두 달 중 인연이 가장 가까운 달은 ${top.slice(0,2).map(o=>o.start.m+'월').join(', ')}이야.`],warn:[`일지(태어난 날의 글자)가 ${JI_K[(d+6)%12]}인 사람은 조심해. {S} 일지 ${JI_K[d]}와 충이라 끌리기 쉬워도 부딪히기도 쉬워. 띠 얘기가 아니라 일지 얘기야.`],
   letter:[`${F.nick} {S}.`,'도화는 타고나는 거지만 피우는 건 {S}가 하는 거야.']}; }
function card(ids){ const P=F.P, dm=F.dm, gz=p=>p?GAN[p[0]]+JI[p[1]]:'모름';
  const c={호칭:'{S}',태오가부르는말:HON,성별:F.male?'남':'여',일간:GAN[dm]+EL[stEl(dm)],일지:JI[P.d[1]]+' '+S_.tgBranch(dm,P.d[1]),원국:[['년주',P.y],['월주',P.m],['일주',P.d],['시주',P.h]].map(([n,p])=>n+' '+gz(p)),
   인연의별:F.male?'재성':'관성',인연의별자리:F.stars,원국신살:F.natal.map(o=>o.at+' '+o.k),도화유형:F.T.n+' · '+F.T.d,도화지수:F.score,
   고백하기좋은날:F.days.map(o=>`${o.y}.${o.m}.${o.d}(${DOW[o.w]}) ${GAN[o.s]}${JI[o.b]}일`)};
  c.달=(ids||F.months.map((o,i)=>i)).map(i=>{ const o=F.months[i]; return {번호:i,달:o.start.m+'월',절기:o.term,간지:o.gz,천간십성:o.t1,지지십성:o.t2,연애점수:o.love,관계:o.br.map(r=>r.at+' '+r.k).concat(o.sr.map(r=>r.at+' '+r.k)),신살:o.ss}; });
  return JSON.stringify(c); }
function prompts(){ const A=window.PremAI, ST0=(HON==='형'?A.STYLE.taeo_m:A.STYLE.taeo)+'\n'+A.COMMON.replace('이름을 부를 때는 {N} 토큰만 쓴다(화면이 이름과 호격으로 바꾼다). 이름을 직접 쓰지 않는다.',`상대는 "${HON}"라고만 부른다.`);
  const core=`${ST0}\n\n[할 일] 도화 사주 프리미엄 '태오의 깊은 편지'의 본문을 쓴다. 연애 · 끌림 · 인연에 집중한다.
출력 JSON 형식: {"nature":["${HON} 도화의 정체 3~4단락. 도화 유형, 원국의 도화 · 홍염 같은 신살, 인연의 별 자리, 일지 십성으로 본 매력. 단락마다 130~200자"],"pattern":["${HON}의 연애 패턴 2~3단락. 끌리는 사람과 오래 남는 사람, 반복하는 실수. 단락마다 130~200자"],"meet":["앞으로 열두 달 안에 만날 사람 2~3단락. 연애 점수가 높은 달, 만나는 장소와 상황, 그 사람의 결. 단락마다 120~180자"],"warn":["조심할 인연 2단락. 일지와 충 · 원진이 걸리는 결(띠가 아니라 일지 기준), 흔들리는 달. 단락마다 100~160자"],"letter":["태오의 편지 5~6단락, 단락마다 50~110자. 설레지만 가볍지 않게, 마지막은 다음에 또 오라는 말"]}

[사실 카드]
${card()}`;
  const cal=ids=>`${ST0}\n\n[할 일] 앞으로 열두 달(오늘이 든 절월부터) 인연 달력의 달별 풀이를 쓴다. 절기 기준 월이다.
출력 JSON 형식: 배열. 달마다 {"i":달 번호,"title":"그달 연애의 제목 6~12자","text":"그달 연애 이야기 150~220자. 연애점수 · 관계 · 신살을 근거로","tip":"그달 한 줄 당부 10~20자"}
대상 달 번호: ${ids.join(', ')}

[사실 카드]
${card(ids)}`;
  const isArr=d=>Array.isArray(d)&&d.every(x=>x&&typeof x.text==='string');
  return [{id:'core',prompt:core,check:d=>d&&Array.isArray(d.nature)&&Array.isArray(d.letter)},{id:'c0',prompt:cal([0,1,2,3,4,5]),check:isArr},{id:'c1',prompt:cal([6,7,8,9,10,11]),check:isArr}]; }
function apply(id,d){ if(id==='core') ['nature','pattern','meet','warn','letter'].forEach(k=>{ if(d[k]) C[k]=d[k]; }); else d.forEach(x=>{ const i=+x.i; if(i>=0&&i<12) C.months[i]=Object.assign({},C.months[i],x); }); }
function build(){ const n=F.nick, ps=a=>K.ps((a||[]).map(h),n);
  const top=[...F.months].sort((a,b)=>b.love-a.love); const hi=top.slice(0,2), lo=top.slice(-1);
  const H=[`<div class="pk-st" id="dhst" hidden></div>`];
  H.push(K.sec('태오의 깊은 편지 · '+HON+' 도화의 정체',ps(C.nature)+K.ev(F.natal.map(o=>o.at+' '+o.k).concat(F.stars.length?['인연의 별 '+F.stars.join(' · ')]:[]))));
  H.push(K.sec('앞으로 열두 달 인연 달력 상세',`<div class="pk-acc">${F.months.map((o,i)=>{ const c=C.months[i]||{}; const tag=hi.includes(o)?'최고':lo.includes(o)?'조심':'';
    return K.row({k:'c'+i,cls:hi.includes(o)?'pk-hi':lo.includes(o)?'pk-lo':'',a:`${o.start.m}월`,asub:`${o.start.y}.${o.start.m}.${o.start.d}~`,b:`<em>${kr(o.gz)}</em>${K.esc(h(c.title||''))}${tag?`<span class="pk-tag">${tag}</span>`:''}`,c:o.love,body:ps([c.text])+(c.tip?`<p class="pk-key"><b>이달 한 줄</b>${K.tok(h(c.tip),n)}</p>`:'')+K.ev(o.br.map(r=>r.at+' '+r.k).concat(o.sr.map(r=>r.at+' '+r.k)).concat(o.ss))}); }).join('')}</div>`,'절기 기준 월 · 숫자는 연애 점수'));
  H.push(K.sec(HON+'의 연애 패턴',ps(C.pattern)));
  H.push(K.sec('열두 달 안에 만날 사람',ps(C.meet)));
  H.push(K.sec('고백하기 좋은 날',F.days.length?`<div class="pk-cards">${F.days.map(o=>`<div class="pk-card"><b>${o.m}.${o.d}<small>${DOW[o.w]}요일 · ${gk(o.s,o.b)}일</small></b><div><p>${[S_.isHap(o.b,F.P.d[1])?'배우자 자리와 합이 드는 날':'',X.ganHap(o.s,F.dm)?'일간과 천간합이 드는 날':'',X.shinsal(o.b,F.P,o.s).includes('도화')?'도화가 피는 날':''].filter(Boolean).join(' · ')||'인연의 별이 뜨는 날'}</p></div></div>`).join('')}</div>`:'<p class="pk-p">앞으로 열두 달은 따로 고른 날이 없어. 연애 점수가 높은 달을 노려.</p>'));
  H.push(K.sec('조심해야 할 인연',ps(C.warn)));
  H.push(K.letter((C.letter||[]).map(h),{title:'태오가 '+HON+'에게',name:'태오'},'도화',n));
  H.push(`<p class="pk-note" style="margin:14px 2px 0">${ST.ai?'이 편지는 만세력 계산 근거만 재료로 AI가 태오의 말투로 쓴 글이에요. 명리 전문가 감수 전 원고예요':'이 부분은 해석 사전으로 조립한 초안이에요. 정식 서비스에서는 같은 근거로 태오가 길게 써 줘요'}</p>`);
  return H.join(''); }
function render(){ const host=$('dprem'); K.keepOpen(host,()=>{ host.innerHTML=build(); }); K.status($('dhst'),Object.assign({who:'태오가 깊은 편지'},ST)); }
/* 편지 달력(dohwa.html)도 같은 기준을 쓰도록: 같은 열두 달 · 같은 연애 점수 · 같은 최고의 달 */
function calc(){ const D=window.DHF&&window.DHF(); if(!D) return null; const G=window.Prem2Core.rolling(S_,X,D.inp,12), loveG=D.inp.g==='m'?2:3;
  G.months.forEach(o=>o.love=loveScore(o,loveG)); return {months:G.months,top:[...G.months].sort((a,b)=>b.love-a.love)}; }
window.DohwaPrem={calc,open(){ const host=$('dprem'); if(!host||!prep()) return; host.className='pkx'; host.hidden=false; K.bind(host); render();
  const f=host.querySelector('.pk-row.pk-hi'); if(f) f.classList.add('open');
  K.runAI({key:F.key+'-dohwa-'+HON+'-'+F.from.y+'.'+F.from.m,ver:'v3',parts:prompts(),apply,rerender:render,S:ST}); }};
})();
