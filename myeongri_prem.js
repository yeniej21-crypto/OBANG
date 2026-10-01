/* 명리관 · 소헌 선생의 2027 명리 감정서 — 결제 뒤 열리는 제5장~맺음말
   계산: saju.js + saju_x.js + prem2_core.js → 사실 카드(신년운세와 같은 엔진, 같은 사주면 같은 답)
   원고: 해석 사전(하게체)으로 먼저 초안을 보이고, AI가 소헌 선생 말투로 쓴 원고가 오면 부분별로 바꾼다
   장치: 문서형 장 번호 · 각주 대신 근거 줄 · 관인 · 감정서 저장(인쇄 → PDF) · 세 번 묻기 */
(function(){
const S_=window.Saju, X=window.SajuX, {GAN,JI,EL,stEl,BR_EL}=S_;
const $=id=>document.getElementById(id);
const bt=w=>{ const c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28>0; };
/* 십성 해석 사전 · 하게체 */
const SS={
 비견:{k:'곁에 선 사람의 달',good:'뜻 맞는 사람이 곁에 서는 기운일세. 혼자 끌던 짐을 나눠 질 수 있고, 내 뜻을 밀고 갈 배짱도 붙네.',bad:'몫을 나눠야 하는 기운일세. 고집이 세지고 비슷한 사람과 부딪히기 쉬우니, 공과 돈의 경계를 먼저 정해 두게.',love:['편한 벗 같은 인연이 가까워지네','연인과 주도권을 다투기 쉽네'],money:['함께 벌면 커지는 흐름일세','나눠 쓸 일이 많아 지갑이 얇아지네'],work:['협업이 잘 풀리네','경쟁자가 늘어 성과를 지켜야 하네'],do:'믿을 만한 사람과 손잡기',avoid:'말로만 하는 동업과 보증'},
 겁재:{k:'승부를 거는 달',good:'승부욕이 올라 밀어붙이는 힘이 생기네. 경쟁이 있는 자리에서 오히려 이기는 때일세.',bad:'돈과 사람이 함께 새기 쉬운 기운일세. 충동적인 지출과 무리한 승부는 한 박자 쉬고 정하게.',love:['먼저 다가가면 결과가 나네','질투가 끼어들기 쉽네'],money:['과감하게 움직이면 몫을 챙기네','빌려준 돈은 돌아오기 어렵네'],work:['시험과 경쟁 자리에서 힘을 내네','동료와 공을 다투게 되네'],do:'목표 하나에 힘 모으기',avoid:'충동구매와 돈 거래'},
 식신:{k:'재주가 손에 붙는 달',good:'재주가 손에 붙고 일이 즐거워지는 기운일세. 만들고 내보이는 일이 결과로 이어지고, 먹고 사는 걱정이 줄어드네.',bad:'몸이 편한 쪽으로 기울기 쉬운 기운일세. 미루던 일이 쌓이니 작은 것부터 끝내 두게.',love:['다정하고 편안한 만남이 이어지네','관계가 늘어지기 쉽네'],money:['재능이 수입으로 이어지네','소소한 지출이 쌓이네'],work:['기획과 창작이 빛나네','마감을 놓치기 쉽네'],do:'꾸준히 만들어 내보이기',avoid:'미루기와 과식'},
 상관:{k:'말이 힘을 얻는 달',good:'말솜씨와 재치가 살아나는 기운일세. 남다른 생각이 눈에 띄고, 틀을 깨는 시도가 박수를 받네.',bad:'말이 칼이 되기 쉬운 기운일세. 윗사람이나 규칙과 부딪히기 쉬우니, 한마디를 삼키는 편이 이득일세.',love:['매력이 드러나 인연이 먼저 오네','말 한마디로 틀어지기 쉽네'],money:['생각이 돈이 되네','기분 따라 쓰는 돈이 크네'],work:['발표와 영업에서 두각을 내네','윗선과의 마찰을 조심하게'],do:'생각을 글과 말로 꺼내 보이기',avoid:'홧김에 하는 말'},
 편재:{k:'판이 넓어지는 달',good:'활동 무대가 넓어지고 큰돈이 오가는 기운일세. 사람을 많이 만날수록 기회가 붙네.',bad:'크게 들어오는 만큼 크게 나가는 기운일세. 투자와 보증, 한 번에 뒤집으려는 선택은 한 번 더 따져 보게.',love:['만남의 폭이 넓어지네','마음이 여러 곳으로 흩어지네'],money:['부수입과 사업 기회가 드네','큰 지출을 조심하게'],work:['영업과 출장이 잘 풀리네','벌이기만 하고 마무리가 약해지네'],do:'판을 넓히되 장부 꼼꼼히 쓰기',avoid:'한 번에 뒤집으려는 투자'},
 정재:{k:'차곡차곡 쌓는 달',good:'쌓은 만큼 돌아오는 기운일세. 월급과 저축, 살림이 안정되고 계산이 정확해지네.',bad:'돈 걱정이 마음을 붙잡는 기운일세. 작은 돈 때문에 큰 기회나 사람을 놓치지 말게.',love:['현실적인 인연이 들어오네','계산이 앞서 마음이 식기 쉽네'],money:['저축과 고정 수입이 느네','생활비가 새어 나가네'],work:['꼼꼼한 일처리로 신뢰를 얻네','반복되는 일에 지치기 쉽네'],do:'통장과 지출을 매주 들여다보기',avoid:'작은 돈에 매달리기'},
 편관:{k:'고비를 넘는 달',good:'어려운 과제를 넘는 힘이 생기는 기운일세. 압박 속에서 실력이 드러나고 큰일을 맡아 이름을 얻네.',bad:'일과 책임이 한꺼번에 몰아치는 기운일세. 맡을 일과 거절할 일을 가르고, 잠을 줄이지 말게.',love:['강하게 끌리는 인연이 오네','상대에게 휘둘리기 쉽네'],money:['책임만큼 보상이 따르네','급한 일로 목돈이 나가네'],work:['무거운 자리가 들어오네','과로를 조심하게'],do:'어려운 일 하나를 끝까지 해내기',avoid:'무리한 일정과 밤샘'},
 정관:{k:'이름이 오르는 달',good:'인정받고 자리가 생기는 기운일세. 합격과 승진, 계약처럼 이름이 올라가는 일이 따르네.',bad:'지켜야 할 규칙과 체면이 늘어나는 기운일세. 남의 눈 때문에 자네 뜻을 접지는 말게.',love:['진지한 만남이 오가네','틀에 맞추다 답답해지네'],money:['안정된 수입과 계약이 드네','체면 때문에 쓰는 돈이 느네'],work:['평가와 승진에 좋은 결과가 나네','작은 실수에도 엄격해지네'],do:'공식적인 자리에 나서기',avoid:'눈치 보느라 할 말 삼키기'},
 편인:{k:'홀로 깊어지는 달',good:'직관이 예리해지고 남다른 공부가 붙는 기운일세. 혼자 파고드는 일과 특별한 기술을 익히기에 좋네.',bad:'생각이 많아지고 마음이 홀로 깊어지는 기운일세. 걱정이 걸음을 붙잡지 않게 몸을 먼저 움직이게.',love:['말이 통하는 인연을 만나네','연락이 뜸해지기 쉽네'],money:['전문 기술이 돈이 되네','계획만 하다 때를 놓치네'],work:['연구와 기획에서 깊이를 얻네','방향을 자주 바꾸기 쉽네'],do:'배우고 싶던 것 하나 시작하기',avoid:'밤늦도록 생각만 굴리기'},
 정인:{k:'문서가 드는 달',good:'배움과 문서, 어른의 도움이 들어오는 기운일세. 시험과 자격, 계약서에 좋고 마음이 편안해지네.',bad:'기대고 싶은 마음이 커지는 기운일세. 남의 도움만 기다리다 때를 놓치지 말게.',love:['아껴 주는 사람이 곁에 오네','기대다 관계가 기울기 쉽네'],money:['문서와 계약으로 재산이 느네','받기만 하다 기회를 놓치네'],work:['시험과 자격에 좋은 결과가 나네','결정을 미루기 쉽네'],do:'문서 챙기고 공부 이어 가기',avoid:'남의 결정만 기다리기'}};
const USM={장생:'새로 싹트는 자리',목욕:'마음이 들뜨는 자리',관대:'의젓하게 자리 잡는 자리',건록:'제 발로 서는 자리',제왕:'힘이 가장 센 자리',쇠:'힘을 고르는 자리',병:'지치기 쉬운 자리',사:'기운이 멈추는 자리',묘:'거두어 쌓는 자리',절:'기운이 바닥인 자리',태:'새 기운을 품는 자리',양:'조용히 키우는 자리'};
const SEAT={년지:'집안과 바깥 평판',월지:'일터와 부모',일지:'배우자와 가까운 사람',시지:'꿈과 자녀'};
const RELM={육합:'손을 잡아 일이 순하게 풀리네',충:'정면으로 부딪혀 변동이 생기네',형:'서로 견제하니 서류와 약속을 두 번 보게',원진:'까닭 없이 서운해지기 쉽네',파:'약속 하나가 어긋나기 쉽네',해:'작은 섭섭함이 쌓이기 쉽네',삼합:'힘을 모아 기운이 커지네','같은 글자':'같은 기운이 겹쳐 일이 두 배로 커지네'};
const SSM={역마:'자리를 옮기거나 멀리 움직일 일이 생기네',도화:'사람 눈에 띄고 인연이 붙네',화개:'홀로 깊어지는 공부가 붙네',천을귀인:'도와주는 사람이 나타나네',양인:'추진력이 세지나 다툼과 다침을 조심하게',홍염:'은근한 매력이 드러나네',문창귀인:'글과 공부가 빛나네',공망:'기대보다 손에 남는 것이 적네',백호:'서두르다 다치지 않게 조심하게'};
const ELX=[{n:'나무',color:'초록',dir:'동쪽',num:'3 · 8',acts:['아침 햇살 속에서 이십 분 걷기','책상 위에 작은 화분 하나 두기','새로 배우는 것 하나 시작하기']},
 {n:'불',color:'빨강',dir:'남쪽',num:'2 · 7',acts:['볕 좋은 날 몸 움직이기','사람 많은 자리에 한 번 더 나가기','미뤄 둔 제안 하나 꺼내기']},
 {n:'흙',color:'노랑 · 황토',dir:'가운데',num:'5 · 10',acts:['집 안 한 칸 정리하기','같은 시간에 자고 일어나기','따뜻한 밥 제때 챙기기']},
 {n:'쇠',color:'흰색 · 은색',dir:'서쪽',num:'4 · 9',acts:['안 쓰는 물건 정리하기','끝맺지 못한 일 하나 마무리하기','약속 시간 지키기']},
 {n:'물',color:'검정 · 남색',dir:'북쪽',num:'1 · 6',acts:['물 자주 마시기','잠들기 전 하루를 세 줄로 적기','물가를 따라 걷기']}];
const AREAS=[['love','인연'],['money','재물'],['work','일과 자리'],['people','사람'],['body','몸과 마음']];
const DOW=['일','월','화','수','목','금','토'];
let F=null, C=null;
const natalAt=at=>{ const P=F.P; return at==='년지'?P.y[1]:at==='월지'?P.m[1]:at==='일지'?P.d[1]:P.h?P.h[1]:null; };
const range=o=>`${o.start.m}.${o.start.d}~${o.end.m}.${o.end.d}`;
const hm=o=>`${String(o.start.hh).padStart(2,'0')}:${String(o.start.mi).padStart(2,'0')}`;
const N=t=>String(t).replace(/\{N\}/g,'자네');
const dstr=x=>`${x.m}월 ${x.d}일 (${DOW[x.w]})`;

function ruleCopy(){ const M=F.months, st=F.st;
  const months=M.map(o=>{ const a=SS[o.t1]; let total=`${o.term} 달 ${o.gz}월은 자네에게 ${o.t1}${bt(o.t1)?'과':'와'} ${o.t2}의 달일세. ${a[o.f1?'good':'bad']} 이달 자네 일간은 ${o.us}, 곧 ${USM[o.us]}에 서네.`;
    o.br.slice(0,2).forEach(r=>total+=` ${r.at} ${JI[natalAt(r.at)]}와 ${JI[o.b]}의 ${r.k}이니 ${SEAT[r.at]} 쪽에서 ${RELM[r.k]}.`); o.ss.slice(0,2).forEach(k=>total+=` ${k}${bt(k)?'이':'가'} 드니 ${SSM[k]}.`); if(o.fill) total+=` ${EL[F.blank]} 기운이 들어 자네 빈칸을 채우네.`;
    const pr=o.br.find(r=>r.at==='년지'||r.at==='월지');
    return {tag:a.k,total,love:(o.br.some(r=>r.at==='일지'&&r.k==='육합')?'가까운 사람과 마음이 묶이는 달일세':o.br.some(r=>r.at==='일지'&&r.k==='충')?'가까운 관계가 흔들리니 말을 아끼게':a.love[o.f1?0:1])+'.',
      money:a.money[o.f1?0:1]+(o.ss.includes('공망')?'. 공망이 걸려 기대보다 적게 남네.':'.'),work:a.work[o.f1?0:1]+'.',people:pr?`${SEAT[pr.at]} 쪽에서 ${RELM[pr.k]}.`:'사람 관계는 무난한 달일세.',
      body:['병','사','절','묘'].includes(o.us)?'기운이 꺾이는 달일세. 잠을 늘리고 일정을 비워 두게.':['건록','제왕','장생','관대'].includes(o.us)?'기운이 차오르는 달일세. 미뤄 둔 운동을 시작하기 좋네.':'무리하지 않으면 무난한 달일세.',do:a.do,avoid:a.avoid}; });
  const pick=fn=>M.filter(fn).map(o=>o.start.m+'월'), list=a=>a.length?a.join(', '):'뚜렷한 달이 없네';
  const ys=F.ys;
  return {pan:[`올해 정미(丁未)의 천간 정(丁)은 자네에게 ${ys.t1}일세. ${SS[ys.t1][S_.favorable(st,S_.rel(F.dm,stEl(ys.s)))?'good':'bad']}`,`지지 미(未)는 자네에게 ${ys.t2}일세. ${SS[ys.t2][S_.favorable(st,S_.relBranch(F.dm,ys.b))?'good':'bad']}`].concat(ys.br.map(r=>`${r.at} ${JI[natalAt(r.at)]}와 미(未)의 ${r.k}이니 ${SEAT[r.at]} 쪽에서 ${RELM[r.k]}.`)).concat(ys.ss.map(k=>`올해 미(未)는 자네에게 ${k}일세. ${SSM[k]}.`)),
   areas:{love:{sum:`인연이 가까워지는 달은 ${list(pick(o=>o.br.some(r=>r.at==='일지'&&r.k==='육합')||o.ss.includes('도화')||(o.g1===(F.male?2:3)&&o.f1)))}일세.`,tip:'끌리는 사람보다 편한 사람을 보게'},money:{sum:`돈의 기운이 움직이는 달은 ${list(pick(o=>(o.g1===2||o.g2===2)&&(o.f1||o.f2)))}일세.`,tip:'버는 달에 반은 떼어 두게'},work:{sum:`자리와 문서의 기운이 드는 달은 ${list(pick(o=>(o.g1===3||o.g1===4)&&o.f1))}일세.`,tip:'내밀 서류는 좋은 달 전에 준비해 두게'},people:{sum:'원국의 년지와 월지에 걸리는 달마다 집안과 일터 쪽 일이 움직이네.',tip:'서운한 말은 그날 풀게'},body:{sum:`쉬어 갈 달은 ${list(pick(o=>o.sc<45))}일세.`,tip:'오래가는 통증은 꼭 병원에 보이게'}},
   months,best:{},warn:{},letter:['자네 감정서를 여기까지 썼네.','좋은 달에는 크게 걸음을 내딛고, 궂은 달에는 걸음을 늦추면 그것으로 충분하네.','사주는 정답이 아니라 지도일세. 길은 자네가 고르는 거고.'],draft:true}; }

function goodDays(){ const {P,dm,st}=F, db=P.d[1], mb=P.m[1], yb=P.y[1], out=[]; const loveG=F.male?2:3;
  for(let t=Date.UTC(2027,1,4);t<=Date.UTC(2028,1,3);t+=864e5){ const d=new Date(t), y=d.getUTCFullYear(), m=d.getUTCMonth()+1, dd=d.getUTCDate(), w=d.getUTCDay();
    const [s,b]=S_.dayPillar(y,m,dd); if(S_.isChung(b,db)||S_.isChung(b,mb)||S_.isChung(b,yb)) continue;
    const g1=S_.rel(dm,stEl(s)), g2=S_.relBranch(dm,b); out.push({y,m,d:dd,w,s,b,g1,g2,f1:S_.favorable(st,g1),f2:S_.favorable(st,g2),hapD:S_.isHap(b,db),hapM:S_.isHap(b,mb)}); }
  const pick=(fn,n)=>{ const c=out.map(x=>({x,v:fn(x)})).filter(o=>o.v>0).sort((a,b)=>b.v-a.v||a.x.y-b.x.y||a.x.m-b.x.m||a.x.d-b.x.d); const r=[], used=new Set(); for(const o of c){ const k=o.x.y*100+o.x.m; if(used.has(k)) continue; used.add(k); r.push(o.x); if(r.length===n) break; } return r.sort((a,b)=>a.y-b.y||a.m-b.m||a.d-b.d); };
  const wk=x=>x.w===0||x.w===6;
  return {move:pick(x=>(x.f1?2:0)+(x.f2?2:0)+(x.hapD?2:0)+(wk(x)?1.5:0),3),deal:pick(x=>([2,3,4].includes(x.g1)&&x.f1?3:0)+(x.f2?1:0)+(x.hapM?2:0)+(x.w>0&&x.w<6?1:0),3),
    love:pick(x=>(x.hapD?3:0)+(x.g1===loveG&&x.f1?2.5:0)+(x.f2?1:0)+(x.w===5||x.w===6?1:0),3),exam:pick(x=>([3,4].includes(x.g1)&&x.f1?3:0)+([3,4].includes(x.g2)?1:0)+(x.f2?1:0),3)}; }

function relTable(){ const rows=F.ys.br.map(r=>[`${r.at} ${JI[natalAt(r.at)]}`,`미(未)와 ${r.k}`,SEAT[r.at]]).concat(F.ys.sr.map(r=>[r.at,`정(丁)과 ${r.k}`,''])).concat(F.ys.ss.map(k=>['신살',k,'']));
  if(!rows.length) return '<p class="capt">올해 정미(丁未)는 원국과 합 · 충 · 형으로 크게 얽히지 않네. 십성의 흐름만 보면 되는 해일세.</p>';
  return `<table class="wk mrel" data-hj="0"><tr><th>원국 자리</th><th>올해와의 관계</th><th>닿는 영역</th></tr>${rows.map(r=>`<tr><td class="tg">${r[0]}</td><td class="tg"><b>${r[1]}</b></td><td class="tg">${r[2]||'-'}</td></tr>`).join('')}</table>`; }

function mrow(o,i,DY){ const c=C.months[i]; const ev=[`천간 ${o.t1}`,`지지 ${o.t2}`,`운성 ${o.us}`].concat(o.br.map(r=>`${r.at} ${r.k}`)).concat(o.sr.map(r=>`${r.at} ${r.k}`)).concat(o.ss); const best=C.best[i]!=null, warn=C.warn[i]!=null;
  return `<div class="mr ${best?'best':warn?'warn':''}" data-i="${i}"><button type="button" class="mrh"><span class="mm">${o.start.m}월<small>${o.term} ${o.start.m}.${o.start.d} ${hm(o)}</small></span><span class="mg" data-hj="0">${o.gz}</span><span class="mt">${c.tag}</span><span class="msc">${o.sc}</span></button>
   <div class="mrb"><p class="p">${N(c.total)}</p><dl class="m5">${AREAS.map(([k,l])=>`<dt>${l}</dt><dd>${N(c[k])}</dd>`).join('')}<dt>권하는 일</dt><dd>${c.do}</dd><dt>삼갈 일</dt><dd>${c.avoid}</dd></dl><p class="evid">근거 · ${ev.join(' · ')}</p></div></div>`; }

function build(){ const X0=window.SNF; const DY=goodDays(); const fg=F.st.strong?[1,2,3]:[0,4], favEls=fg.map(g=>(stEl(F.dm)+g)%5), needI=favEls.reduce((a,e)=>F.cnt[e]<F.cnt[a]?e:a,favEls[0]), need=ELX[needI], jh=F.johu;
  const H=[];
  H.push(`<div class="aist noprint" id="aist" hidden></div>`);
  H.push(`<div class="doc"><div class="ch"><em>제5장</em><b>2027 세운 정밀</b><span>정미(丁未) · 천간 ${F.ys.t1} · 지지 ${F.ys.t2} · 운성 ${F.ys.us}</span></div>${relTable()}<div style="margin-top:14px">${C.pan.map(p=>`<p class="p">${N(p)}</p>`).join('')}</div></div>`);
  H.push(`<div class="doc"><div class="ch"><em>제6장</em><b>열두 달 월운 감정</b><span>입춘 기준 절월 · 달을 누르면 펼쳐져요</span></div><div class="mlist">${F.months.map((o,i)=>mrow(o,i,DY)).join('')}</div><p class="capt">오른쪽 숫자는 그달 점수(100점 만점)일세. 붉은 달은 볕이 드는 달, 흐린 달은 걸음을 늦출 달이네.</p></div>`);
  const bw=(i,t,g)=>{ const o=F.months[i]; return `<div class="bwr ${g?'good':'bad'}"><b>${o.start.m}월</b><div><p class="bt">${g?'볕이 드는 달':'걸음을 늦출 달'} · ${C.months[i].tag}</p><p>${N(t)}</p></div></div>`; };
  H.push(`<div class="doc"><div class="ch"><em>제7장</em><b>영역별 감정</b></div>${AREAS.map(([k,l])=>`<div class="ar"><b>${l}</b><p class="p">${N(C.areas[k].sum)}</p><p class="tip">소헌 선생 · ${N(C.areas[k].tip)}</p></div>`).join('')}</div>`);
  H.push(`<div class="doc"><div class="ch"><em>제8장</em><b>소헌 선생의 권고</b></div><div class="bw">${Object.keys(C.best).map(i=>bw(+i,C.best[i],1)).join('')}${Object.keys(C.warn).map(i=>bw(+i,C.warn[i],0)).join('')}</div>
   <p class="p" style="margin-top:16px">자네 사주가 올해 가장 반기는 기운은 <b>${need.n}</b>일세. ${need.n} 기운을 곁에 두면 좋은 달은 더 좋아지고 궂은 달은 덜 궂어지네.${jh&&jh.need!=null?` 또 자네는 ${jh.why.replace(/다$/,'네')}.`:''}</p>
   <div class="rx3"><div><small>곁에 둘 색</small><b>${need.color}</b></div><div><small>방위</small><b>${need.dir}</b></div><div><small>숫자</small><b>${need.num}</b></div></div><ol class="rxl">${need.acts.map(a=>`<li>${a}</li>`).join('')}</ol></div>`);
  const crow=(t,a,n)=>`<tr><th>${t}</th><td>${a.length?a.map(x=>`${dstr(x)} <em>${GAN[x.s]}${JI[x.b]}일</em>`).join('<br>'):'올해는 따로 고른 날이 없네'}<small>${n}</small></td></tr>`;
  H.push(`<div class="doc"><div class="ch"><em>제9장</em><b>정미년 길일표</b><span>자네 원국과 부딪히지 않는 날</span></div><table class="gil" data-hj="0">${crow('이사 · 집',DY.move,'일지 · 월지 · 년지와 충이 없고 사주가 반기는 날, 주말 위주')}${crow('계약 · 문서',DY.deal,'재물 · 자리 · 문서의 기운이 반기는 평일')}${crow('고백 · 만남',DY.love,'배우자 자리와 합이 들거나 인연의 별이 뜨는 날')}${crow('시험 · 면접',DY.exam,'자리와 배움의 기운이 반기는 날')}</table><p class="capt">손 없는 날 같은 민속 택일은 따로 보지 않았네. 더 정밀하게 고르려면 택일 메뉴를 쓰게.</p></div>`);
  H.push(`<div class="doc letter"><div class="ch"><em>맺음말</em><b>감정을 마치며</b></div>${C.letter.map(p=>`<p class="p">${N(p)}</p>`).join('')}<div class="sign"><span>${X0.td} · 명리관 감정인 소헌 선생</span><span class="gwan"><i>素</i><i>軒</i></span></div></div>`);
  H.push(`<div class="noprint mrbtn"><button type="button" class="go" id="mrSave">감정서 저장하기 (PDF)</button><button type="button" class="go ghost" id="mrAsk">감정서에 대해 소헌 선생에게 묻기</button></div>`);
  H.push(`<p class="note">${C.ai?'이 감정서는 만세력 계산 근거만 재료로 AI가 소헌 선생의 말투로 쓴 글입니다':'지금 보이는 글은 해석 사전으로 조립한 초안입니다. 같은 근거로 AI가 소헌 선생의 말투로 다시 써 드려요'}. 소헌 선생은 AI로 만든 가상의 명리가이며, 명리 전문가 감수 전 원고입니다.</p>`);
  return H.join(''); }

/* ---------- AI 원고 ---------- */
function card(ids){ const P=F.P, gzs=p=>p?GAN[p[0]]+JI[p[1]]:'모름', dm=F.dm;
  const pil=[['년주',P.y],['월주',P.m],['일주',P.d],['시주',P.h]].map(([n,p])=>p?{자리:n,간지:gzs(p),천간십성:n==='일주'?'나(일간)':S_.tgStem(dm,p[0]),지지십성:S_.tgBranch(dm,p[1]),운성:X.unseong(dm,p[1])}:{자리:n,간지:'모름'});
  const rel=o=>o.br.map(r=>`${r.at} ${JI[natalAt(r.at)]}와 ${r.k}`).concat(o.sr.map(r=>`${r.at}과 ${r.k}`));
  const c={호칭:'자네',성별:F.male?'남':'여',한국나이:F.age,일간:GAN[dm]+EL[stEl(dm)],강약:F.st.label,오행:Object.fromEntries(F.cnt.map((v,i)=>[EL[i],v])),빈칸:EL[F.blank],원국:pil,원국신살:F.natal.map(o=>o.at+' '+o.k),공망:F.gong.map(b=>JI[b]),조후:F.johu.why,
    대운:{지금:{나이:`${F.cur.age}~${F.cur.age+9}세`,간지:GAN[F.cur.s]+JI[F.cur.b],십성:S_.tgStem(dm,F.cur.s)+'/'+S_.tgBranch(dm,F.cur.b)},다음:F.nxt?{나이:`${F.nxt.age}~${F.nxt.age+9}세`,간지:GAN[F.nxt.s]+JI[F.nxt.b]}:null,올해가대운마지막해:!!(F.nxt&&F.age===F.cur.age+9)},
    올해:{간지:'丁未',천간십성:F.ys.t1,지지십성:F.ys.t2,운성:F.ys.us,관계:rel(F.ys),신살:F.ys.ss,점수:F.ysc}};
  c.달=(ids||F.months.map((o,i)=>i)).map(i=>{ const o=F.months[i]; return {번호:i,달:o.start.m+'월',기간:range(o),절기:o.term,절입시각:`${o.start.m}월 ${o.start.d}일 ${hm(o)}`,간지:o.gz,천간십성:o.t1,지지십성:o.t2,운성:o.us,점수:o.sc,빈칸채움:o.fill,관계:rel(o),신살:o.ss}; });
  return JSON.stringify(c); }
function prompts(){ const A=window.PremAI, ST=A.STYLE.soheon+'\n'+A.COMMON.replace(/- 이름을 부를 때는 \{N\} 토큰만 쓴다[^\n]*\n/,'- 의뢰인은 이름 대신 "자네"라고 부른다.\n');
  const ex="{\"i\": 6, \"tag\": \"문서가 드는 달\", \"total\": \"입추 달 무신(戊申)월일세. 쉽게 말하면 자네 말에 처음으로 무게가 실리는 달이네. 위의 무(戊)는 흙인데, 자네에게 흙은 정인(배움과 문서, 도와주는 어른)일세. 원국에 하나도 없던 흙이 들어오니 자네 빈칸이 이달에 채워지는 셈이지. 아래의 신(申)은 자네와 같은 쇠 기운이라 곁에서 힘을 보태네. 자네 일간 신(辛)은 이달에 제왕(힘이 가장 센 때)의 자리에 서네. 그러니 계약, 연봉 이야기, 시험은 이달에 하게. 다만 신(申)과 자네 일지(배우자 자리) 해(亥)는 해(은근히 서운하게 만드는 관계)라, 바쁜 자네를 가까운 사람이 서운해할 수 있네. 짧게라도 안부를 남기게.\", \"love\": \"마음이 단단해져 끌려다니지 않는 달일세. 바쁘다고 연락을 미루면 서운함이 쌓이니 짧게라도 안부를 남기게.\", \"money\": \"올해 돈 이야기를 꺼내기 가장 좋은 달이네. 받을 돈과 계약 조건은 말로 끝내지 말고 문서로 남기게.\", \"work\": \"자격 시험, 이직 서류, 승진 면담 모두 이달이 좋네. 미뤄 둔 제안을 꺼내 보게.\", \"people\": \"뜻 맞는 동료가 힘이 되네. 사소한 신경전은 웃어넘기는 편이 오래 가네.\", \"body\": \"기운이 차오르는 달일세. 미뤄 둔 운동을 이달에 시작하면 오래 이어지네.\", \"do\": \"계약과 서류를 이달에 마무리하기\", \"avoid\": \"바쁘다고 가까운 사람 연락 미루기\"}";
  const year=`${ST}\n\n[할 일] 명리관 감정서 '2027 세운 정밀'과 '권고', '맺음말'을 쓴다. 열두 달은 입춘 기준 절월이다.
출력 JSON 형식: {"pan":["올해 간지가 원국에 들어오는 법. 4~5단락, 단락마다 150~220자. 천간 십성, 지지 십성, 원국과의 관계, 신살, 대운과 겹쳐 본 올해를 차례로"],"best":{"${F.bestI.join('":"이유 1~2문장","')}":"이유 1~2문장"},"warn":{"${F.warnI.join('":"이유 1~2문장","')}":"이유 1~2문장"},"letter":["맺음말 3~4단락, 단락마다 60~120자. 마지막 단락은 '사주는 정답이 아니라 지도'라는 생각으로 맺는다"]}
best와 warn의 키는 달 번호이며 위 번호로 고정이다.

[사실 카드]
${card()}`;
  const mon=ids=>`${ST}\n\n[할 일] 감정서 '열두 달 월운 감정' 가운데 아래 대상 달을 쓴다.
출력 JSON 형식: 배열. 달마다 {"i":달 번호,"tag":"그달을 한마디로 이른 제목 6~14자","total":"그달 감정 300~380자. 절기 이름과 간지로 시작해 십성 · 운성 · 관계 · 신살 · 빈칸채움을 근거로 풀고, 소헌 선생의 권고로 끝낸다","love":"인연 60~110자","money":"재물 60~110자","work":"일과 자리 60~110자","people":"사람 관계 60~110자","body":"몸과 마음 60~110자","do":"권하는 일, ~하기로 끝나는 8~18자","avoid":"삼갈 일 8~18자"}
대상 달 번호: ${ids.join(', ')}

[문체 예시 · 다른 사람 사주의 한 달]
${ex}

[사실 카드]
${card(ids)}`;
  const areas=`${ST}\n\n[할 일] 감정서 '영역별 감정'을 쓴다.
출력 JSON 형식: {"areas":{"love":{"sum":"인연 한 해 총론 250~350자. 좋은 달과 조심할 달을 근거와 함께 짚는다","tip":"소헌 선생의 한마디 한 문장"},"money":{"sum":"재물","tip":""},"work":{"sum":"일과 자리","tip":""},"people":{"sum":"가족 · 친구 · 일터 사람","tip":""},"body":{"sum":"몸과 마음","tip":""}}}

[사실 카드]
${card()}`;
  const isArr=d=>Array.isArray(d)&&d.every(x=>x&&typeof x.total==='string');
  return [{id:'year',prompt:year,check:d=>d&&Array.isArray(d.pan)&&Array.isArray(d.letter)},{id:'areas',prompt:areas,check:d=>d&&d.areas&&d.areas.love}].concat([0,2,4,6,8,10].map(i=>({id:'m'+i,prompt:mon([i,i+1]),check:isArr}))); }

let AIS={n:0,done:0,state:''};
function status(){ const e=$('aist'); if(!e) return; const m={run:`<i></i><span>소헌 선생이 감정서를 쓰는 중이네 · ${AIS.done}/${AIS.n}</span><small>다 쓰기 전까지는 초안이 먼저 보여요. 1분 안팎 걸려요</small>`,fail:'<span>지금은 AI 원고를 받을 수 없어 초안으로 보여 드려요</span>',limit:'<span>오늘 체험판 풀이 횟수를 다 썼어요</span><small>내일 다시 열면 이어서 써 드려요</small>',off:'<span>이 화면에서는 초안만 보여요</span><small>claude.ai 체험판이나 정식 서비스에서는 이 근거로 소헌 선생이 감정서를 길게 써 드려요</small>'}[AIS.state];
  if(m){ e.hidden=false; e.innerHTML=m; } else e.hidden=true; }
function rerender(){ const host=$('prem'); const open=[...host.querySelectorAll('.mr.open')].map(e=>e.dataset.i); const sc=host.closest('.scr'), y=sc?sc.scrollTop:0;
  host.innerHTML=build(); open.forEach(i=>{ const r=host.querySelector(`.mr[data-i="${i}"]`); if(r) r.classList.add('open'); }); if(sc) sc.scrollTop=y; status(); }
function startAI(){ if(!window.PremAI) return; const P=prompts();
  window.PremAI.run({key:F.key+'-mr2027',ver:'v1',parts:P,
   onStart:n=>{ AIS={n,done:0,state:'run'}; status(); },
   onPart:(id,d,fromCache)=>{ if(id==='year'||id==='areas'){ ['pan','areas','letter'].forEach(k=>{ if(d[k]) C[k]=d[k]; }); if(d.best) C.best=Object.fromEntries(Object.entries(d.best).map(([k,v])=>[+k,v])); if(d.warn) C.warn=Object.fromEntries(Object.entries(d.warn).map(([k,v])=>[+k,v])); }
     else d.forEach(m=>{ const i=+m.i; if(i>=0&&i<12) C.months[i]=Object.assign({},C.months[i],m); });
     if(window.HJ) C=HJ.glAll(C); C.got=(C.got||0)+1; if(C.got>=P.length){ C.draft=false; C.ai=true; } AIS.done++; if(!fromCache) rerender(); },
   onDone:(ok,allCached)=>{ if(allCached){ C.draft=false; C.ai=true; AIS.state=''; rerender(); return; } AIS.state=C.ai?'':(ok?'':'fail'); rerender(); },
   onFail:code=>{ AIS.state=code==='unavailable'?'off':code==='limit'?'limit':'fail'; status(); }}); }
function bind(host){ host.addEventListener('click',e=>{ const h=e.target.closest('.mrh'); if(h){ h.parentNode.classList.toggle('open'); return; }
  if(e.target.closest('#mrSave')){ host.querySelectorAll('.mr').forEach(r=>r.classList.add('open')); setTimeout(()=>window.print(),120); return; }
  if(e.target.closest('#mrAsk')){ const b=document.getElementById('askBtn'); if(b) b.click(); } }); }
const CSS=`.mlist{border-top:1px solid var(--ink)}
.mr{border-bottom:1px solid var(--rule)}
.mrh{width:100%;display:grid;grid-template-columns:86px 46px 1fr 30px;align-items:center;gap:6px;padding:11px 2px;border:0;background:none;text-align:left;cursor:pointer;color:var(--ink)}
.mrh .mm{font-weight:700;font-size:14px}.mrh .mm small{display:block;font-size:10.5px;font-weight:500;color:var(--ink-3);margin-top:1px}
.mrh .mg{font-family:var(--serif);font-weight:900;font-size:15px;color:var(--ink-2)}.mrh .mt{font-size:13px;color:var(--ink-2)}
.mrh .msc{text-align:right;font-family:var(--serif);font-weight:900;font-size:16px}
.mr.best .mm,.mr.best .msc{color:var(--seal)}.mr.warn .msc{color:var(--ink-3)}
.mrb{display:none;padding:2px 2px 16px}.mr.open .mrb{display:block}
.m5{display:grid;grid-template-columns:72px 1fr;margin:4px 0 0;border-top:1px solid var(--rule-2)}
.m5 dt{padding:8px 0;font-size:12px;font-weight:700;color:var(--seal);border-bottom:1px solid var(--rule-2)}
.m5 dd{margin:0;padding:8px 0;font-size:13.5px;line-height:1.6;color:var(--ink);border-bottom:1px solid var(--rule-2)}
.evid{margin:10px 0 0;font-size:11.5px;line-height:1.6;color:var(--ink-3)}
.ar{padding:12px 0;border-top:1px solid var(--rule-2)}.ch+.ar{border-top:0;padding-top:0}
.ar>b{display:block;font-family:var(--serif);font-size:15.5px;font-weight:900;margin-bottom:6px}
.tip{margin:0;font-family:var(--serif);font-size:14px;font-weight:700;color:var(--seal)}
.bw{display:grid;gap:8px}.bwr{display:grid;grid-template-columns:50px 1fr;gap:10px;padding:12px;border:1px solid var(--rule)}
.bwr>b{font-family:var(--serif);font-size:19px;font-weight:900}.bwr.good>b{color:var(--seal)}.bwr.bad>b{color:var(--ink-3)}
.bwr p{margin:0;font-size:13.5px;line-height:1.6;color:var(--ink-2)}.bwr .bt{font-weight:700;color:var(--ink);margin-bottom:3px}
.rx3{display:grid;grid-template-columns:repeat(3,1fr);margin:10px 0 12px;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.rx3 div{padding:11px 4px;text-align:center}.rx3 div+div{border-left:1px solid var(--rule-2)}
.rx3 small{display:block;font-size:11.5px;color:var(--ink-3);font-weight:700}.rx3 b{display:block;margin-top:3px;font-size:15px;font-weight:900}
.rxl{margin:0;padding-left:20px;font-family:var(--serif);font-size:14.5px;line-height:1.9}
table.gil{width:100%;border-collapse:collapse;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.gil th{width:84px;padding:11px 0;text-align:left;vertical-align:top;font-size:13px;color:var(--ink);border-bottom:1px solid var(--rule-2)}
.gil td{padding:11px 0;font-size:13.5px;line-height:1.7;border-bottom:1px solid var(--rule-2)}
.gil td em{font-style:normal;font-family:var(--serif);color:var(--ink-3);font-size:12.5px;margin-left:4px}
.gil td small{display:block;font-size:11.5px;color:var(--ink-3);margin-top:4px;line-height:1.5}
.mrel td{padding:8px 4px}.mrel td b{font-weight:700;color:var(--ink)}
.letter .sign{display:flex;align-items:center;justify-content:flex-end;gap:12px;margin-top:16px;font-family:var(--serif);font-size:13px;font-weight:700;color:var(--ink-2)}
.letter .sign .gwan{width:50px;height:50px;font-size:16px}
.mrbtn{display:grid;gap:8px;margin-top:12px}.mrbtn .go{margin-top:0}.go.ghost{background:none;color:var(--ink);border:1px solid var(--ink)}
.aist{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;margin-top:14px;padding:12px 14px;background:var(--sheet);border:1px solid var(--seal)}
.aist[hidden]{display:none}.aist i{width:14px;height:14px;border:2px solid var(--seal);border-right-color:transparent;border-radius:50%;animation:aispin 1s linear infinite}
.aist span{font-size:13.5px;font-weight:700}.aist small{flex-basis:100%;font-size:12px;line-height:1.5;color:var(--ink-3)}
@keyframes aispin{to{transform:rotate(360deg)}}
@media print{.mrb{display:block!important}.mrh{pointer-events:none}}`;
window.MRPrem={open(){ const host=$('prem'); const X0=window.SNF; if(!host||!X0) return;
  if(!document.getElementById('mrCss')){ const s=document.createElement('style'); s.id='mrCss'; s.textContent=CSS; document.head.appendChild(s); }
  F=window.Prem2Core.build(S_,X,X0.inp); F.male=X0.inp.g==='m'; F.ysc=X0.ys; C=ruleCopy(); if(window.HJ) C=HJ.glAll(C);
  const s=[...F.months.map((o,i)=>({o,i}))].sort((a,b)=>b.o.sc-a.o.sc); F.bestI=s.slice(0,3).map(x=>x.i).sort((a,b)=>a-b); F.warnI=s.slice(-2).map(x=>x.i);
  F.bestI.forEach(i=>C.best[i]=SS[F.months[i].t1].good.split('. ')[0]+'.'); F.warnI.forEach(i=>C.warn[i]=SS[F.months[i].t1].bad.split('. ')[0]+'.');
  AIS={n:0,done:0,state:''}; host.innerHTML=build(); host.hidden=false; const lk=$('dLock'); if(lk) lk.hidden=true; if(!host._b){ bind(host); host._b=1; }
  const f=host.querySelector('.mr.best'); if(f) f.classList.add('open'); startAI(); }};
})();
