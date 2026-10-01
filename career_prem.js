/* 커리어 사주 프리미엄 — 도준의 2027 커리어 로드맵 (결제 뒤 리포트 아래에 이어짐)
   계산: prem2_core(2027 입춘 절월) → 달별 이직 · 승진 · 연봉 점수, 면접 · 입사일 택일(평일 · 시간대), 협상 타이밍
   → AI(도준 문체) · 없으면 초안 */
(function(){
const S_=window.Saju, X=window.SajuX, {GAN,JI,EL,stEl,BR_EL}=S_; const $=id=>document.getElementById(id); const K=window.PK;
const DOW=['일','월','화','수','목','금','토'], GRP=['비겁','식상','재성','관성','인성'];
const HR=['자시','축시','인시','묘시','진시 07:30~09:29','사시 09:30~11:29','오시 11:30~13:29','미시 13:30~15:29','신시 15:30~17:29','유시 17:30~19:29','술시','해시'];
const TYPEN=['독립 개척자','크리에이터','비즈니스 메이커','조직의 리더','전문가'];
const SIT={work:'직장인',move:'이직 준비',job:'취준생',free:'프리랜서 · 창업',study:'학생'};
let O=null,F=null,M=null,C=null,ST={},nick='',ROWS=null;
function score(o,P){ const g=o.g1, gb=o.g2, fav=o.f1, chD=o.br.some(r=>r.at==='일지'&&r.k==='충'), chM=o.br.some(r=>r.at==='월지'&&r.k==='충'), hapD=o.br.some(r=>r.at==='일지'&&r.k==='육합');
  const has=k=>(g===k?1:0)+(gb===k?.6:0), c=v=>Math.max(15,Math.min(97,Math.round(v)));
  return {chD,chM,hapD,move:c(48+14*has(1)+6*has(2)+(chD?10:0)+(chM?8:0)+(fav?6:0)-4*has(3)),promo:c(48+16*has(3)+8*has(4)+(fav?6:0)-(o.t1==='상관'?10:0)-(chD?8:0)+(hapD?6:0)+(o.ss.includes('천을귀인')?4:0)),money:c(48+16*has(2)+6*has(1)+(fav?5:0)-(o.t1==='겁재'?12:0)-(chD?5:0))}; }
/* 면접 · 입사 · 계약 택일: 평일, 일지 · 월지 충 없는 날, 관성 · 인성 · 재성 날 + 일지 합 · 천을귀인, 그날 가장 좋은 업무 시간 */
function pickDays(){ const P=F.P, dm=F.dm, out=[];
  const fav=g=>S_.favorable(F.st,g);
  for(let t=Date.UTC(2027,1,4);t<=Date.UTC(2028,1,3);t+=864e5){ const d=new Date(t), y=d.getUTCFullYear(), m=d.getUTCMonth()+1, dd=d.getUTCDate(), w=d.getUTCDay(); if(w===0||w===6) continue;
    const [s,b]=S_.dayPillar(y,m,dd); if(S_.isChung(b,P.d[1])||S_.isChung(b,P.m[1])) continue;
    const g=S_.rel(dm,stEl(s)), ss=X.shinsal(b,P,s); const mi=M.findIndex(x=>{ const st=x.o.start, en=x.o.end; const k=y*10000+m*100+dd; return k>=st.y*10000+st.m*100+st.d&&k<=en.y*10000+en.m*100+en.d; });
    let v=(g===3?2.5:g===4?2:g===2?1.2:0)+(S_.isHap(b,P.d[1])?2:0)+(ss.includes('천을귀인')?1.5:0)+(ss.includes('공망')?-2:0)+(fav(g)?1:0)+(mi>=0&&M[mi].best>=65?1:0);
    if(v<4) continue;
    let bh=-1, bv=-9; for(let hb=4;hb<=8;hb++){ if(S_.isChung(hb,b)||S_.isChung(hb,P.d[1])) continue; const hv=(S_.isHap(hb,P.d[1])?2:0)+(S_.isHap(hb,b)?1:0)+(X.shinsal(hb,P).includes('천을귀인')?1.5:0)+(fav(S_.relBranch(dm,hb))?1:0); if(hv>bv){ bv=hv; bh=hb; } }
    out.push({y,m,d:dd,w,s,b,g,v,tg:S_.tgStem(dm,s),bh,why:[GRP[g]+'의 날',S_.isHap(b,P.d[1])?'일지와 합':'',ss.includes('천을귀인')?'천을귀인':''].filter(Boolean)}); }
  const r=[], used=new Set(); out.sort((a,b)=>b.v-a.v||a.m-b.m||a.d-b.d).forEach(o=>{ const k=o.y*100+o.m; if(r.length<5&&!used.has(k)){ used.add(k); r.push(o); } }); return r.sort((a,b)=>a.y-b.y||a.m-b.m||a.d-b.d); }
function prep(){ O=window.CRF; if(!O||!O.A) return false; const A=O.A, me=A.me; nick=me.name||'';
  F=window.Prem2Core.build(S_,X,{y:A.sol.y,m:A.sol.m,d:A.sol.d,h:me.h==null?null:+me.h,g:me.g||'f'});
  ROWS=O.sit==='job'||O.sit==='study'?[['promo','합격 · 입사'],['move','새 출발'],['money','첫 연봉']]:O.sit==='free'?[['money','수입'],['move','새 판'],['promo','인정 · 계약']]:[['move','이직'],['promo','승진 · 인정'],['money','연봉 · 성과']];
  M=F.months.map((o,i)=>{ const s=score(o,F.P); const best=Math.max(s[ROWS[0][0]],s[ROWS[1][0]],s[ROWS[2][0]]); return Object.assign({i,o,best},s); });
  F.days=pickDays(); C=draft(); ST={}; return true; }
function draft(){ const A=O.A, T=TYPEN[A.main], k0=ROWS[0][0], top=[...M].sort((a,b)=>b[k0]-a[k0]), mon=[...M].sort((a,b)=>b.money-a.money).find(x=>x!==top[0]), lo=[...M].filter(x=>x!==top[0]&&x!==mon).sort((a,b)=>a.best-b.best)[0], prepI=Math.max(0,top[0].i-2);
  const cur=F.cur, cg=S_.rel(F.dm,stEl(cur.s));
  return {draft:true,
   sum:[`{N}. 넌 ${T}야. ${GRP[A.main]}이 제일 세고 ${GRP[A.sub]}이 받쳐 준다.`,`지금은 ${GAN[cur.s]}${JI[cur.b]} 대운, ${GRP[cg]}의 10년이야. 2027년 丁未는 너한테 ${F.ys.t1}의 해.`,`${ROWS[0][1]} 타이밍은 ${top[0].o.start.m}월. 그 전 석 달이 준비 기간이다.`],
   months:M.map(x=>{ const o=x.o; const k=ROWS.map(r=>r[0]).sort((a,b)=>x[b]-x[a])[0], lab=ROWS.find(r=>r[0]===k)[1];
     return {title:x.chD?'자리 흔들리는 달':x.best>=70?lab+' 타이밍':x.best>=58?'준비하는 달':'버티는 달',text:`${o.term} 달 ${o.gz}. 천간 ${o.t1}, 지지 ${o.t2}. ${x.chD?'일지와 충이라 변동이 크다.':x.hapD?'일지와 합이라 사람 운이 붙는다.':''}`,do:x.best>=65?lab+' 움직이기':'포트폴리오 정리',avoid:x.chD?'즉흥 퇴사':'무리한 약속'}; }),
   plan:[[prepI-.5,{t:`${M[prepI].o.start.m}월까지 무기 정리`,d:'이력서 · 포트폴리오 · 숫자로 된 성과 세 줄.'}],[top[0].i,{t:`${top[0].o.start.m}월에 움직이기`,d:`${ROWS[0][1]} 점수가 가장 높은 달이다.`}],[mon.i,{t:`${mon.o.start.m}월에 돈 이야기`,d:'연봉 · 단가 협상은 재성이 뜨는 달에.'}],[lo.i,{t:`${lo.o.start.m}월엔 버티기`,d:'점수가 가장 낮은 달이다. 큰 결정은 미룬다.'}]].sort((a,b)=>a[0]-b[0]).map(x=>x[1]),
   nego:{line:A.main===2?'제가 만든 숫자로 말씀드리겠습니다':A.main===3?'이 자리에 맞는 책임을 지고 싶습니다':A.main===4?'이 분야에서 대체하기 어려운 사람이 되겠습니다':A.main===1?'제 방식으로 결과를 바꿔 보겠습니다':'제가 맡으면 끝까지 갑니다',why:`넌 ${GRP[A.main]}이 센 사람이라 이 말이 제일 너답게 먹힌다.`,when:`${mon.o.start.m}월`},
   letter:[`{N}.`,'일은 판을 고르는 게 반이다.',`${top[0].o.start.m}월에 움직여. 나머진 내가 받친다.`]}; }
function card(ids){ const A=O.A, P=F.P, gz=p=>p?GAN[p[0]]+JI[p[1]]:'모름';
  const c={상황:SIT[O.sit],성별:F.male?'남':'여',일간:GAN[F.dm]+EL[stEl(F.dm)],원국:[['년주',P.y],['월주',P.m],['일주',P.d],['시주',P.h]].map(([n,p])=>n+' '+gz(p)),신강약:F.st.label,
   일유형:TYPEN[A.main],주십성:GRP[A.main],보조십성:GRP[A.sub],약한십성:GRP[A.low],십성점수:GRP.map((g,i)=>g+' '+A.raw[i]).join(' '),도움오행:EL[A.fav],
   대운:`${GAN[F.cur.s]}${JI[F.cur.b]} ${F.cur.age}~${F.cur.age+9}세 ${S_.tgStem(F.dm,F.cur.s)}`,다음대운:F.nxt?`${GAN[F.nxt.s]}${JI[F.nxt.b]} ${F.nxt.age}세부터`:'',
   세운2027:`丁未 · 천간 ${F.ys.t1} · 지지 ${F.ys.t2} · 관계 ${F.ys.br.map(r=>r.at+' '+r.k).join(', ')||'없음'}`,점수이름:ROWS.map(r=>r[1]),
   택일:F.days.map(o=>`${o.y}.${o.m}.${o.d}(${DOW[o.w]}) ${GAN[o.s]}${JI[o.b]}일 ${o.tg} · ${HR[o.bh]||''} · ${o.why.join(', ')}`)};
  if(ids&&!ids.length) c.달요약=M.map(x=>`${x.o.start.m}월 ${x.o.gz} ${ROWS.map(r=>r[1]+x[r[0]]).join(' ')}${x.chD?' 일지충':''}`);
  else c.달=(ids||[]).map(i=>{ const x=M[i], o=x.o; return {번호:i,달:o.start.m+'월',절기:o.term,간지:o.gz,천간십성:o.t1,지지십성:o.t2,운성:o.us,점수:Object.fromEntries(ROWS.map(r=>[r[1],x[r[0]]])),관계:o.br.map(r=>r.at+' '+r.k).concat(o.sr.map(r=>r.at+' '+r.k)),신살:o.ss}; });
  return JSON.stringify(c); }
function prompts(){ const A=window.PremAI;
  const ST0=`[문체 규칙 · 오방사주 도준(土 · 黃龍)]\n- 화자는 커리어를 봐 주는 도준. 무뚝뚝하고 짧은 반말(~다, ~해, ~야). 군더더기 없이 실전적으로. 비유는 땅 · 기둥 · 밥 · 공사.\n- 문장은 짧게, 한 문장 40자 안팎.\n`+A.COMMON;
  const core=`${ST0}\n\n[할 일] 커리어 사주 프리미엄 '도준의 2027 커리어 로드맵' 본문을 쓴다. 상황(${SIT[O.sit]})에 맞춘다.
출력 JSON 형식: {"sum":["커리어 총평 3단락. 일 유형과 십성 구조, 지금 대운, 2027 세운이 커리어에 주는 뜻. 단락마다 120~180자"],"plan":[{"t":"한 해 액션 단계 제목 8~16자","d":"구체적인 행동 40~80자. 몇 월인지 넣는다"}],"nego":{"line":"연봉 · 단가 협상에서 이 사람이 쓸 한 문장 15~35자, 존댓말","why":"그 문장이 먹히는 이유 60~100자. 주십성 근거","when":"협상하기 좋은 달 한두 개"},"letter":["도준의 한마디 4~5단락, 단락마다 40~90자"]}
plan은 정확히 4개, 시간 순서대로.

[사실 카드]
${card([])}`;
  const cal=ids=>`${ST0}\n\n[할 일] 2027 커리어 로드맵의 달별 액션 플랜을 쓴다. 입춘 기준 절월이다. 점수 · 십성 · 관계 · 신살을 근거로 그달 무엇을 하고 무엇을 피할지.
출력 JSON 형식: 배열. 달마다 {"i":달 번호,"title":"그달 제목 6~12자","text":"그달 커리어 흐름 130~200자","do":"할 일 10~22자","avoid":"피할 일 8~20자"}
대상 달 번호: ${ids.join(', ')}

[사실 카드]
${card(ids)}`;
  const isArr=d=>Array.isArray(d)&&d.every(x=>x&&typeof x.text==='string');
  return [{id:'core',prompt:core,check:d=>d&&Array.isArray(d.sum)&&Array.isArray(d.plan)},{id:'m0',prompt:cal([0,1,2,3,4,5]),check:isArr},{id:'m1',prompt:cal([6,7,8,9,10,11]),check:isArr}]; }
function apply(id,d){ if(id==='core') ['sum','plan','nego','letter'].forEach(k=>{ if(d[k]&&(d[k].length||d[k].line)) C[k]=d[k]; }); else d.forEach(x=>{ const i=+x.i; if(i>=0&&i<12) C.months[i]=Object.assign({},C.months[i],x); }); }
function build(){ const ps=a=>K.ps(a,nick), t=x=>K.tok(x,nick), k0=ROWS[0][0];
  const top=[...M].sort((a,b)=>b.best-a.best), hi=top.slice(0,3), lo=M.filter(x=>x.chD).concat([...M].sort((a,b)=>a.best-b.best)).filter((x,i,arr)=>arr.indexOf(x)===i).slice(0,2);
  const H=[`<div class="pk-st" id="crst" hidden></div>`];
  H.push(K.sec('도준의 커리어 로드맵 · 총평',ps(C.sum)+K.ev([`${GRP[O.A.main]} 중심`,`대운 ${GAN[F.cur.s]}${JI[F.cur.b]}`,`2027 丁 ${F.ys.t1}`])));
  H.push(K.sec('2027 달별 액션 플랜',`<div class="pk-acc">${M.map((x,i)=>{ const c=C.months[i]||{}, o=x.o; const tag=hi.includes(x)?'움직일 때':lo.includes(x)?'조심':'';
    return K.row({k:'c'+i,cls:hi.includes(x)?'pk-hi':lo.includes(x)?'pk-lo':'',a:`${o.start.m}월`,asub:`${o.start.m}.${o.start.d}~`,b:`<em>${o.gz}</em>${t(c.title||'')}${tag?`<span class="pk-tag">${tag}</span>`:''}`,c:x.best,
      body:`<div class="pk-rx3">${ROWS.map(r=>`<div><small>${r[1]}</small><b>${x[r[0]]}</b></div>`).join('')}</div>`+ps([c.text])+K.items(c,[['do','할 일'],['avoid','피할 일']],nick)+K.ev(o.br.map(r=>r.at+' '+r.k).concat(o.sr.map(r=>r.at+' '+r.k)).concat(o.ss))}); }).join('')}</div>`,'입춘 기준 · 최고 점수'));
  H.push(K.sec('한 해 순서',`<div class="pk-cards">${(C.plan||[]).slice(0,4).map((p,i)=>`<div class="pk-card"><b>${i+1}</b><div><p class="pk-ct">${t(p.t)}</p><p>${t(p.d)}</p></div></div>`).join('')}</div>`));
  H.push(K.sec('면접 · 입사 · 계약 택일',F.days.length?`<div class="pk-cards">${F.days.map(o=>`<div class="pk-card"><b>${o.m}.${o.d}<small>${DOW[o.w]}요일 · ${GAN[o.s]}${JI[o.b]}일</small></b><div><p class="pk-ct">${HR[o.bh]?HR[o.bh]:'오전 중'}</p><p>${o.why.join(' · ')}</p></div></div>`).join('')}</div>`:'<p class="pk-p">올해는 따로 고른 날이 없다. 점수가 높은 달 평일 오전을 써.</p>','평일 · 일지 월지 충 없는 날'));
  const ng=C.nego||{};
  H.push(K.sec('연봉 협상에서 먹히는 한 문장',`<p class="pk-quote">“${t(ng.line||'')}”</p>`+ps([ng.why])+(ng.when?`<p class="pk-key"><b>꺼낼 때</b>${t(ng.when)}</p>`:'')));
  H.push(K.letter(C.letter||[],{title:'도준의 한마디',name:'도준'},'黃龍',nick));
  H.push(`<p class="pk-note" style="margin:14px 0 0">${ST.ai?'이 로드맵은 만세력 계산 근거만 재료로 AI가 도준의 말투로 쓴 글이에요. 명리 전문가 감수 전 원고예요':'이 부분은 해석 사전으로 조립한 초안이에요. 정식 서비스에서는 같은 근거로 도준이 길게 써 줘요'}</p>`);
  return H.join(''); }
function render(){ const host=$('cprem'); K.keepOpen(host,()=>{ host.innerHTML=build(); }); K.status($('crst'),Object.assign({who:'도준이 커리어 로드맵'},ST)); }
window.CareerPrem={open(){ const host=$('cprem'); if(!host||!prep()) return false; host.className='pkx dark'; host.style.setProperty('--pk-acc','#f0c96a'); host.hidden=false; K.bind(host); render();
  const f=host.querySelector('.pk-row.pk-hi'); if(f) f.classList.add('open');
  K.runAI({key:F.key+'-career-'+O.sit,ver:'v1',parts:prompts(),apply,rerender:render,S:ST}); return true; }};
})();
