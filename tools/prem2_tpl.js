/* 2027 신년운세 프리미엄 v2 — 할매의 열두 달 상세 풀이 (입춘 기준 절월)
   계산: saju.js + saju_x.js + prem2_core.js → 사실 카드
   원고: PREM2_SAMPLE[key]가 있으면 완성본(AI 원고), 없으면 해석 사전으로 조립한 초안
   보기: 월별 / 항목별 전환. 오방사주 장치: 할매 장부 · 이달의 당번 신 · 빈칸 채움 */
(function(){
const S_=window.Saju, X=window.SajuX, {GAN,JI,EL,stEl,BR_EL}=S_;
const $=id=>document.getElementById(id);
const bt=w=>{ const c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28>0; };
/*__DICT__*/
const GOD=[{n:'하람',key:'wood',ok:'천천히 가도 괜찮아요. 오늘 할 일 하나만 해요.',ng:'바람이 차요. 무리하지 말고 일찍 들어가요.'},
 {n:'이안',key:'fire',ok:'이번 달은 내가 밀어줄게. 망설이지 마.',ng:'불이 너무 세. 한 발만 물러서 있어.'},
 {n:'도준',key:'earth',ok:'흙 왔다. 기대. 내가 받쳐 줄게.',ng:'발밑 단단히 봐. 서두르면 미끄러진다.'},
 {n:'시온',key:'metal',ok:'원하는 걸 정확히 말하십시오. 이번 달은 통합니다.',ng:'끊을 건 끊으십시오. 미련은 짐이 됩니다.'},
 {n:'재이',key:'water',ok:'말하지 않아도 알아. 그래도 한 번은 꺼내 봐.',ng:'생각이 깊어지는 달이야. 밤엔 그냥 자.'}];
const SEAT={년지:'집안과 바깥 평판',월지:'일터와 부모',일지:'배우자와 가까운 사람',시지:'꿈과 자녀'};
const RELM={육합:'손을 잡아 일이 순하게 풀린다',충:'정면으로 부딪혀 변동이 생긴다',형:'서로 견제하니 서류와 약속을 두 번 봐야 한다',원진:'이유 없이 서운해지기 쉽다',파:'약속 하나가 어긋나기 쉽다',해:'작은 섭섭함이 쌓이기 쉽다',삼합:'힘을 모아 기운이 커진다','같은 글자':'같은 기운이 겹쳐 일이 두 배로 커진다'};
const SSM={역마:'이동과 변화가 움직인다',도화:'사람 눈에 띄고 인연이 붙는다',화개:'혼자 깊어지는 공부와 예술이 붙는다',천을귀인:'도와주는 귀인이 온다',양인:'추진력이 세지지만 다툼과 다침을 조심해야 한다',홍염:'은근한 매력이 드러난다',문창귀인:'글과 공부가 빛난다',공망:'기대보다 손에 남는 게 적다',백호:'서두르다 다치지 않게 조심해야 한다'};
const USM={장생:'새로 싹트는 자리',목욕:'마음이 들뜨는 자리',관대:'의젓하게 자리 잡는 자리',건록:'제 발로 서는 자리',제왕:'힘이 가장 센 자리',쇠:'힘을 고르는 자리',병:'지치기 쉬운 자리',사:'기운이 멈추는 자리',묘:'거두어 쌓는 자리',절:'기운이 바닥인 자리',태:'새 기운을 품는 자리',양:'조용히 키우는 자리'};
const AREAS=[['love','연애'],['money','돈'],['work','일'],['people','사람'],['body','몸과 마음']];
const DOW=['일','월','화','수','목','금','토'];

let F=null, C=null, VIEW='month', AREA='love';
const natalAt=(at)=>{ const P=F.P; return at==='년지'?P.y[1]:at==='월지'?P.m[1]:at==='일지'?P.d[1]:P.h?P.h[1]:null; };
function relLines(o,max=3){ return o.br.slice(0,max).map(r=>`${r.at} ${JI[natalAt(r.at)]}와 ${JI[o.b]}의 ${r.k} — ${SEAT[r.at]} 쪽에서 ${RELM[r.k]}.`); }

/* ---------- 해석 사전으로 조립한 초안 ---------- */
function ruleCopy(){ const M=F.months, st=F.st, blankEl=EL[F.blank];
  const months=M.map(o=>{ const a=SS[o.t1], fav=o.f1||o.f2; const g=GOD[o.dutyEl];
    let total=`${o.term} 달 ${o.gz}는 네게 ${o.t1}과 ${o.t2}의 달이다. ${a[o.f1?'good':'bad']} 이달 네 일간은 ${o.us}, ${USM[o.us]}에 선다.`;
    relLines(o,2).forEach(l=>total+=' '+l); o.ss.slice(0,2).forEach(k=>total+=` ${k}이 떠 ${SSM[k]}.`); if(o.fill) total+=` ${blankEl} 기운이 들어 네 빈칸을 채운다.`;
    const peopleR=o.br.find(r=>r.at==='년지'||r.at==='월지');
    return {tag:a.k,god:fav?g.ok:g.ng,total,
      love:o.br.some(r=>r.at==='일지'&&r.k==='육합')?'가까운 사람과 마음이 묶이는 달이다.':o.br.some(r=>r.at==='일지'&&r.k==='충')?'가까운 관계가 흔들리니 말을 아끼거라.':a.love[o.f1?0:1]+'.',
      money:a.money[o.f1?0:1]+(o.ss.includes('공망')?' 공망이 걸려 기대보다 적게 남는다.':'.'),
      work:a.work[o.f1?0:1]+'.',
      people:peopleR?`${SEAT[peopleR.at]} 쪽에서 ${RELM[peopleR.k]}.`:'사람 관계는 무난한 달이다.',
      body:['병','사','절','묘'].includes(o.us)?'기운이 꺾이는 달이다. 잠을 늘리고 일정을 비워 두거라.':['건록','제왕','장생','관대'].includes(o.us)?'기운이 차오르는 달이다. 미뤄 둔 운동을 시작하기 좋다.':'무리하지 않으면 무난한 달이다.'+(o.ss.includes('백호')?' 백호가 떠 다치는 일을 조심하거라.':''),
      do:a.do,avoid:a.avoid}; });
  const pick=(fn)=>M.filter(fn).map(o=>o.start.m+'월');
  const list=a=>a.length?a.join(', '):'뚜렷한 달 없음';
  const love=pick(o=>o.br.some(r=>r.at==='일지'&&r.k==='육합')||o.ss.includes('도화')||(o.g1===(F.male?2:3)&&o.f1));
  const money=pick(o=>(o.g1===2||o.g2===2)&&(o.f1||o.f2));
  const work=pick(o=>(o.g1===3||o.g1===4)&&o.f1);
  const rest=pick(o=>o.sc<45);
  const ys=F.ys;
  return {cover:{words:[SS[ys.t1].w,SS[ys.t2].w,SS[[...M].sort((a,b)=>b.sc-a.sc)[0].t1].w].filter((v,i,a)=>a.indexOf(v)===i),line:'{N}, 할미가 네 열두 달을 하나하나 짚어 뒀다. 좋은 달은 놓치지 말고 궂은 달은 미리 알고 피해 가거라.'},
   pan:[`올해 丁未의 천간 丁은 네게 ${ys.t1}이다. ${SS[ys.t1][S_.favorable(st,S_.rel(F.dm,stEl(ys.s)))?'good':'bad']}`,`지지 未는 네게 ${ys.t2}다. ${SS[ys.t2][S_.favorable(st,S_.relBranch(F.dm,ys.b))?'good':'bad']}`].concat(ys.br.map(r=>`${r.at} ${JI[natalAt(r.at)]}와 未의 ${r.k} — ${SEAT[r.at]} 쪽에서 ${RELM[r.k]}.`)).concat(ys.ss.map(k=>`올해 未는 네게 ${k}이다. ${SSM[k]}.`)),
   threshold:F.nxt&&F.age===F.cur.age+9?`올해는 ${GAN[F.cur.s]}${JI[F.cur.b]} 대운의 마지막 해다. 내년부터 ${GAN[F.nxt.s]}${JI[F.nxt.b]} 대운이 열린다. 대운이 바뀌기 직전 해는 마음이 들썩이니 큰 결정은 가을에 굳히고 실행은 내년에 하거라.`:`지금은 ${GAN[F.cur.s]}${JI[F.cur.b]} 대운(${F.cur.age}~${F.cur.age+9}세) 안에 있다. ${S_.favorable(st,S_.rel(F.dm,stEl(F.cur.s)))?'큰 흐름이 사주를 받쳐 주니 올해 기운을 마음껏 써도 된다.':'큰 흐름이 버거운 때라 올해 기운도 욕심보다 방향을 지키는 데 쓰거라.'}`,
   blank:`네 사주에 가장 모자란 기운은 ${blankEl}이다. 오방사주에서 말하는 네 빈칸이다. 올해는 열두 달 가운데 ${M.filter(o=>o.fill).length}달에 ${blankEl} 기운이 든다.`,
   areas:{love:{sum:`인연이 가까워지는 달은 ${list(love)}이다.`,tip:'끌리는 사람 말고 편한 사람을 보거라'},money:{sum:`돈의 기운이 움직이는 달은 ${list(money)}이다.`,tip:'버는 달에 반은 떼어 두거라'},work:{sum:`자리와 문서의 기운이 드는 달은 ${list(work)}이다.`,tip:'내밀 서류는 좋은 달 전에 준비하거라'},people:{sum:'원국의 년지와 월지에 걸리는 달마다 집안과 일터 쪽 일이 움직인다.',tip:'서운한 말은 그날 풀거라'},body:{sum:`쉬어 갈 달은 ${list(rest)}이다.`,tip:'오래가는 통증은 꼭 병원에 보이거라'}},
   months,best:{},warn:{},letter:['{N}.','올해 丁未년, 좋은 달에 크게 웃고 궂은 달엔 잘 버티면 그걸로 됐다.','할미가 열두 달 내내 지켜보마.'],draft:true}; }

/* ---------- 길일 (일진) ---------- */
function goodDays(){ const {P,dm,st}=F, db=P.d[1], mb=P.m[1], yb=P.y[1], out=[]; const loveG=F.male?2:3;
  for(let t=Date.UTC(2027,1,4);t<=Date.UTC(2028,1,3);t+=864e5){ const d=new Date(t), y=d.getUTCFullYear(), m=d.getUTCMonth()+1, dd=d.getUTCDate(), w=d.getUTCDay();
    const [s,b]=S_.dayPillar(y,m,dd); if(S_.isChung(b,db)||S_.isChung(b,mb)||S_.isChung(b,yb)) continue;
    const g1=S_.rel(dm,stEl(s)), g2=S_.relBranch(dm,b), f1=S_.favorable(st,g1), f2=S_.favorable(st,g2);
    out.push({y,m,d:dd,w,s,b,g1,g2,f1,f2,hapD:S_.isHap(b,db),hapM:S_.isHap(b,mb)}); }
  const pick=(fn,n)=>{ const c=out.map(x=>({x,v:fn(x)})).filter(o=>o.v>0).sort((a,b)=>b.v-a.v||a.x.y-b.x.y||a.x.m-b.x.m||a.x.d-b.x.d); const r=[], used=new Set(); for(const o of c){ const k=o.x.y*100+o.x.m; if(used.has(k)) continue; used.add(k); r.push(o.x); if(r.length===n) break; } return r.sort((a,b)=>a.y-b.y||a.m-b.m||a.d-b.d); };
  const wk=x=>x.w===0||x.w===6;
  return {move:pick(x=>(x.f1?2:0)+(x.f2?2:0)+(x.hapD?2:0)+(wk(x)?1.5:0),3),deal:pick(x=>([2,3,4].includes(x.g1)&&x.f1?3:0)+(x.f2?1:0)+(x.hapM?2:0)+(x.w>0&&x.w<6?1:0),3),
    love:pick(x=>(x.hapD?3:0)+(x.g1===loveG&&x.f1?2.5:0)+(x.f2?1:0)+(x.w===5||x.w===6?1:0),3),exam:pick(x=>([3,4].includes(x.g1)&&x.f1?3:0)+([3,4].includes(x.g2)?1:0)+(x.f2?1:0),3),
    perMonth:o=>out.filter(x=>{ const t=Date.UTC(x.y,x.m-1,x.d); return t>=Date.UTC(o.start.y,o.start.m-1,o.start.d)&&t<=Date.UTC(o.end.y,o.end.m-1,o.end.d); }).map(x=>({x,v:(x.f1?2:0)+(x.f2?2:0)+(x.hapD?2:0)})).filter(q=>q.v>=4).sort((a,b)=>b.v-a.v).slice(0,2).map(q=>q.x).sort((a,b)=>a.m-b.m||a.d-b.d)}; }
const dstr=x=>`${x.m}월 ${x.d}일 (${DOW[x.w]})`;

/* ---------- 화면 ---------- */
const N=t=>t.replace(/\{N\}/g,F.nick+(bt(F.nick)?'아':'야'));
const range=o=>`${o.start.m}.${o.start.d}~${o.end.m}.${o.end.d}`;
const dots=n=>`<span class="fdots" aria-label="빈칸 채움 ${n}">${[0,1].map(i=>`<i class="${i<n?'on':''}"></i>`).join('')}</span>`;
function monthCard(o,i,DY){ const c=C.months[i], g=GOD[o.dutyEl], dd=DY.perMonth(o);
  const ev=[`천간 ${o.t1}`,`지지 ${o.t2}`,`운성 ${o.us}`].concat(o.br.map(r=>`${r.at} ${r.k}`)).concat(o.sr.map(r=>`${r.at} ${r.k}`)).concat(o.ss);
  return `<div class="mrow ${C.best[i]?'best':C.warn[i]?'warn':''}" data-i="${i}"><button class="mh" type="button"><span class="mm">${o.start.m}월<small>${range(o)}</small></span><span class="mg">${o.gz}</span><span class="mt">${c.tag}</span><span class="ms2">${o.sc}</span></button>
   <div class="mb"><div class="duty"><i style="background-image:url('img/mini/${g.key}.jpg')"></i><div><small>이달의 당번 · ${g.n}</small><p>${c.god}</p></div></div>
   <p class="mterm">${o.term} ${o.start.m}월 ${o.start.d}일 ${String(o.start.hh).padStart(2,'0')}:${String(o.start.mi).padStart(2,'0')}부터 · 빈칸 채움 ${dots(o.fill)}</p>
   <p class="p">${N(c.total)}</p>
   <div class="m5">${AREAS.map(([k,l])=>`<div><small>${l}</small><p>${N(c[k])}</p></div>`).join('')}</div>
   <div class="mdo"><p><b>할 일</b>${c.do}</p><p><b>멀리할 것</b>${c.avoid}</p>${dd.length?`<p><b>이달의 좋은 날</b>${dd.map(dstr).join(', ')}</p>`:''}</div>
   <p class="evid">근거 · ${ev.join(' · ')}</p></div></div>`; }
function areaView(DY){ const a=C.areas[AREA];
  return `<div class="atabs">${AREAS.map(([k,l])=>`<button type="button" data-a="${k}" class="${k===AREA?'on':''}">${l}</button>`).join('')}</div>
   <p class="p asum">${N(a.sum)}</p><p class="tip">할매 한마디 · ${a.tip}</p>
   <div class="aline">${F.months.map((o,i)=>`<div class="al ${C.best[i]?'best':C.warn[i]?'warn':''}"><b>${o.start.m}월</b><span class="ab"><i style="width:${o.sc}%"></i></span><p>${N(C.months[i][AREA])}</p></div>`).join('')}</div>`; }
function viewHtml(DY){ return VIEW==='month'?`<div class="mlist">${F.months.map((o,i)=>monthCard(o,i,DY)).join('')}</div>`:areaView(DY); }

function build(){ const X0=window.SNF; if(!X0) return '';
  const inp=X0.inp; F=window.Prem2Core.build(S_,X,inp); F.nick=X0.nick; F.male=inp.g==='m';
  C=(window.PREM2_SAMPLE||{})[F.key]||ruleCopy();
  if(C.draft){ const s=[...F.months.map((o,i)=>({o,i}))].sort((a,b)=>b.o.sc-a.o.sc); s.slice(0,3).forEach(x=>C.best[x.i]=`${SS[x.o.t1].good.split('. ')[0]}.`); s.slice(-2).forEach(x=>C.warn[x.i]=`${SS[x.o.t1].bad.split('. ')[0]}.`); }
  const DY=goodDays(); const need=ELX[[F.blank].concat([0,1,2,3,4]).find(e=>e===F.blank)]; const jh=F.johu;
  const H=[];
  H.push(`<div class="pv"><small>삼신 할매의 열두 달 상세 풀이</small><h3>${F.nick}의 2027</h3><p class="pvl">丁未년 · 입춘(2월 4일)부터 다음 해 입춘 전날까지 · ${X0.ys}점</p><div class="pvk"><span>올해의 세 단어</span><b>${C.cover.words.join(' · ')}</b></div><p class="pvq">“${N(C.cover.line)}”</p></div>`);
  H.push(`<div class="sec"><h3>올해의 판 · 丁未가 네 사주에 들어오는 법</h3>${panSvg()}${C.pan.map(p=>`<p class="p">${N(p)}</p>`).join('')}</div>`);
  H.push(`<div class="sec"><h3>${F.nxt&&F.age===F.cur.age+9?'문턱의 해 · 대운이 바뀌기 전':'대운 속의 2027'}</h3><div class="du2">${[F.cur,F.nxt].filter(Boolean).map((d,i)=>`<div class="${i===0?'now':'next'}"><small>${i===0?'지금':'다음'} · ${d.age}~${d.age+9}세</small><b>${GAN[d.s]}${JI[d.b]}</b><em>${S_.tgStem(F.dm,d.s)} · ${S_.tgBranch(F.dm,d.b)}</em></div>`).join('<span class="arr">→</span>')}</div><p class="p">${N(C.threshold)}</p></div>`);
  H.push(`<div class="sec"><h3>네 빈칸 · ${EL[F.blank]}</h3><p class="p">${N(C.blank)}</p><div class="fstrip">${F.months.map(o=>`<div class="${o.fill?'on':''}"><b>${o.start.m}</b>${dots(o.fill)}</div>`).join('')}</div><p class="fine2">점 하나는 그달 천간이나 지지에 ${EL[F.blank]} 기운이 하나 들었다는 뜻이에요</p></div>`);
  H.push(`<div class="sec"><h3>열두 달 상세 풀이</h3><div class="vt"><button type="button" data-v="month" class="${VIEW==='month'?'on':''}">월별로 보기</button><button type="button" data-v="area" class="${VIEW==='area'?'on':''}">항목별로 보기</button></div><div id="pview">${viewHtml(DY)}</div></div>`);
  const bw=(o,i,t,good)=>`<div class="bwr ${good?'good':'bad'}"><b>${o.start.m}월</b><div><p class="bt">${good?'볕이 드는 달':'바람이 부는 달'} · ${C.months[i].tag}</p><p>${t}</p></div></div>`;
  H.push(`<div class="sec"><h3>좋은 달 셋, 조심할 달 둘</h3><div class="bw">${Object.keys(C.best).map(i=>bw(F.months[i],+i,C.best[i],1)).join('')}${Object.keys(C.warn).map(i=>bw(F.months[i],+i,C.warn[i],0)).join('')}</div></div>`);
  H.push(`<div class="sec"><h3>할매의 처방 · 빈칸 채우기</h3><p class="p">네 빈칸은 <b>${need.n}</b>이다. ${need.n} 기운을 곁에 두면 좋은 달은 더 좋아지고 궂은 달은 덜 궂어진다.${jh.need!=null?` 또 너는 ${jh.season}에 태어나 ${jh.why}.`:''}</p>
   <div class="rx3"><div><small>행운 색</small><b>${need.color}</b></div><div><small>방위</small><b>${need.dir}</b></div><div><small>숫자</small><b>${need.num}</b></div></div>
   <ol class="rxl">${need.acts.map(a=>`<li>${a}</li>`).join('')}</ol>
   <a class="rxm" href="bujeok.html?el=${need.key}"><i style="background-image:url('img/mini/${need.key}.jpg')"></i><span><b>${need.n}의 미니 수호신 ${need.mini}</b><small>${need.mini}의 부적 카드 받기 →</small></span></a></div>`);
  const crow=(t,a,n)=>`<div class="dr"><b>${t}</b><div>${a.length?a.map(x=>`<span>${dstr(x)}<em>${GAN[x.s]}${JI[x.b]}일</em></span>`).join(''):'<span>올해는 따로 고른 날이 없어요</span>'}</div><p>${n}</p></div>`;
  H.push(`<div class="sec"><h3>丁未년 길일 달력<i>네 사주와 부딪히지 않는 날</i></h3>${crow('이사 · 집',DY.move,'일지 · 월지 · 년지와 충이 없고 사주가 반기는 날, 주말 위주')}${crow('계약 · 문서',DY.deal,'재물 · 자리 · 문서의 기운이 반기는 평일')}${crow('고백 · 소개팅',DY.love,'배우자 자리와 합이 들거나 인연의 별이 뜨는 날')}${crow('시험 · 면접',DY.exam,'자리와 배움의 기운이 반기는 날')}<p class="fine2">손 없는 날 같은 민속 택일은 따로 보지 않았어요. 더 정밀하게 고르려면 택일 메뉴를 이용하세요</p></div>`);
  H.push(`<div class="sec letter"><h3>할매의 편지</h3><div id="ltx">${C.letter.map(p=>`<p>${N(p)}</p>`).join('')}</div><p class="sign">삼신 할매 <span class="seal">三神</span></p></div>`);
  H.push(`<p class="note">${C.draft?'이 풀이는 해석 사전으로 조립한 초안이에요. 정식 서비스에서는 같은 근거로 AI가 할매 말투로 길게 써 드려요':'이 풀이는 만세력 계산 근거만 재료로 AI가 할매 말투로 쓴 완성본 샘플이에요. 명리 전문가 감수 전 원고예요'}</p>`);
  return H.join(''); }

function panSvg(){ const P=F.P, pil=[['시주',P.h],['일주',P.d],['월주',P.m],['년주',P.y]], W=340, cx=[44,108,172,236], sx=302;
  const rels=[]; F.ys.br.forEach(r=>{ const map={시지:'시주',일지:'일주',월지:'월주',년지:'년주'}; rels.push([map[r.at],r.k]); }); F.ys.sr.forEach(r=>{ const map={시간:'시주',일간:'일주',월간:'월주',년간:'년주'}; rels.push([map[r.at],r.k,1]); });
  const col={육합:'#3f7d5a',삼합:'#3f7d5a',천간합:'#3f7d5a',충:'#b3322a',천간충:'#b3322a',형:'#a7792c',원진:'#a7792c',파:'#a7792c',해:'#a7792c','같은 글자':'#4a433a'};
  const VH=104+Math.max(rels.length,1)*16; let s=`<svg class="pan" viewBox="0 0 ${W} ${VH}" role="img" aria-label="원국과 2027 세운의 관계">`;
  pil.forEach(([n,p],i)=>{ s+=`<text x="${cx[i]}" y="14" text-anchor="middle" font-size="10.5" fill="#877d70">${n}</text>`; if(p) s+=`<text x="${cx[i]}" y="46" text-anchor="middle" font-size="24" font-weight="900" font-family="Noto Serif KR,serif" fill="#1f1b16">${GAN[p[0]]}</text><text x="${cx[i]}" y="80" text-anchor="middle" font-size="24" font-weight="900" font-family="Noto Serif KR,serif" fill="#1f1b16">${JI[p[1]]}</text>`; else s+=`<text x="${cx[i]}" y="64" text-anchor="middle" font-size="12" fill="#877d70">모름</text>`; });
  s+=`<rect x="${sx-26}" y="20" width="52" height="72" fill="#fff4f0" stroke="#b3322a" stroke-width="1.5"/><text x="${sx}" y="14" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b3322a">2027</text><text x="${sx}" y="46" text-anchor="middle" font-size="24" font-weight="900" font-family="Noto Serif KR,serif" fill="#b3322a">丁</text><text x="${sx}" y="80" text-anchor="middle" font-size="24" font-weight="900" font-family="Noto Serif KR,serif" fill="#b3322a">未</text>`;
  const names=pil.map(p=>p[0]); rels.forEach((r,k)=>{ const i=names.indexOf(r[0]); if(i<0) return; const x1=cx[i], c=col[r[1]]||'#4a433a', y=104+k*16;
    s+=`<path d="M${x1} ${r[2]?24:88} ${r[2]?`V22`:''} V${y} H${sx} V92" fill="none" stroke="${c}" stroke-width="1.4" ${/충/.test(r[1])?'stroke-dasharray="4 3"':''}/><text x="${x1+8}" y="${y-4}" font-size="11" font-weight="700" fill="${c}">${r[2]?'천간 ':''}${r[1].replace('천간','')}</text>`; });
  return s+'</svg>'; }

function bind(host){ host.addEventListener('click',e=>{ const h=e.target.closest('.mh'); if(h){ h.parentNode.classList.toggle('open'); return; }
  const v=e.target.closest('.vt button'); if(v){ VIEW=v.dataset.v; host.querySelectorAll('.vt button').forEach(b=>b.classList.toggle('on',b===v)); $('pview').innerHTML=viewHtml(goodDays()); openFirst(); return; }
  const a=e.target.closest('.atabs button'); if(a){ AREA=a.dataset.a; $('pview').innerHTML=viewHtml(goodDays()); } }); }
function openFirst(){ const f=document.querySelector('#pview .mrow.best'); if(f) f.classList.add('open'); }
window.SNPrem={open(){ const host=$('prem'); if(!host) return; VIEW='month'; AREA='love'; host.innerHTML=build(); host.hidden=false; const lk=document.querySelector('.lockS'); if(lk) lk.hidden=true; if(!host._b){ bind(host); host._b=1; } openFirst(); }};
})();
