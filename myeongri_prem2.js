/* 명리관 · 소헌 선생의 2027 명리 감정서 v2(10/4) — 결제 뒤 열리는 제5장~제12장 · 맺음말 (myeongri_v2.html 전용, 원본 myeongri_prem.js는 그대로)
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

function mrow(o,i,DY,img){ const c=C.months[i]; const ev=[`천간 ${o.t1}`,`지지 ${o.t2}`,`운성 ${o.us}`].concat(o.br.map(r=>`${r.at} ${r.k}`)).concat(o.sr.map(r=>`${r.at} ${r.k}`)).concat(o.ss); const best=C.best[i]!=null, warn=C.warn[i]!=null;
  return `<div class="mr ${best?'best':warn?'warn':''}" data-i="${i}"><button type="button" class="mrh"><span class="mm">${o.start.m}월<small>${o.term} ${o.start.m}.${o.start.d} ${hm(o)}</small></span><span class="mg" data-hj="0">${o.gz}</span><span class="mt">${c.tag}</span><span class="msc">${o.sc}</span></button>
   <div class="mrb">${img?`<div class="mpic" style="background-image:url('${img}')"><span>${o.term}</span></div>`:''}<p class="p">${N(c.total)}</p><dl class="m5">${AREAS.map(([k,l])=>`<dt>${l}</dt><dd>${N(c[k])}</dd>`).join('')}<dt>권하는 일</dt><dd>${c.do}</dd><dt>삼갈 일</dt><dd>${c.avoid}</dd></dl>${(()=>{ const D=monthDays(o); return `<div class="mdays"><div><small>좋은 날</small>${D.good.map(x=>`<b>${x.m}월 ${x.d}일 (${DOW[x.w]})</b><i>${GOODWHY(x)}</i>`).join('')||'<i>뚜렷한 날이 없네</i>'}</div><div><small>피할 날</small>${D.bad.map(x=>`<b>${x.m}월 ${x.d}일 (${DOW[x.w]})</b><i>${BADWHY(x)}</i>`).join('')||'<i>크게 부딪히는 날이 없네</i>'}</div></div>`; })()}<p class="evid">근거 · ${ev.join(' · ')}</p></div></div>`; }

const jo=(w,a,b)=>w+(bt(w)?a:b);
/* ---------- v2 확장(10/4): 타고난 그릇 · 대운 · 달마다 좋은 날/조심할 날 · 영역별 열두 달 · 자주 묻는 다섯 가지 · 열두 달 개운표 ---------- */
const DM_HG=['큰 나무 같은 사람일세. 한번 정한 길은 곧게 밀고 가고, 남 밑보다 앞에 서는 편이 편하네. 사람을 이끌고 일을 일으키는 힘이 있으나, 꺾이지 않으려다 부러질 수 있으니 휘는 법도 익혀 두게. 자네에게 좋은 해는 뿌리를 적셔 주는 물과 가지를 다듬어 주는 쇠가 알맞게 드는 해일세.',
 '덩굴과 꽃 같은 사람일세. 부드럽게 휘어 어디서든 뿌리를 내리고, 사람 사이를 잇는 재주가 있네. 혼자 서기보다 기댈 곳을 찾아 함께 자라는 편이 오래가네. 겉은 여려 보여도 끈질긴 사람이니, 남의 기대에 맞추느라 자네 결을 잃지는 말게.',
 '한낮의 해 같은 사람일세. 밝고 시원해 곁에 사람이 모이고, 숨김없이 드러내는 편이 자네 힘이 되네. 다만 빛이 셀수록 그늘도 짙으니, 쉽게 달아오르고 쉽게 식는 마음을 다스리게. 자네 빛이 오래가려면 꾸준함이라는 기름이 필요하네.',
 '등잔불 같은 사람일세. 크게 타오르기보다 한곳을 오래 비추고, 섬세한 눈으로 남이 못 보는 것을 보네. 배려가 깊어 사람을 따뜻하게 하나, 속으로 삭이는 일이 많으니 마음을 털어놓을 곳을 하나 두게. 바람만 막으면 누구보다 오래 빛나는 사람일세.',
 '큰 산 같은 사람일세. 묵직하고 믿음직해 사람들이 기대고, 쉽게 흔들리지 않네. 변화보다 지키는 일에 강하나, 너무 오래 한자리에 머물면 기회가 비껴가니 때로는 먼저 움직이게. 자네가 버티는 자리는 남에게 쉼터가 되네.',
 '논밭의 흙 같은 사람일세. 무엇이든 품어 길러 내고, 살림과 사람을 알뜰하게 돌보는 힘이 있네. 실속을 챙기는 눈이 밝으나, 남 걱정에 자네 몫을 미루기 쉬우니 자네 밭에도 물을 주게. 자네 손을 거친 일은 반드시 열매를 맺네.',
 '무쇠와 바위 같은 사람일세. 결단이 빠르고 의리가 있어 맡은 일은 끝을 보네. 옳고 그름이 분명해 사람을 시원하게 하나, 날이 서면 가까운 사람이 다치니 말끝을 한 번 갈아 두게. 불에 단련될수록 쓸모 있는 그릇이 되는 사람일세.',
 '잘 다듬은 보석 같은 사람일세. 눈이 섬세하고 기준이 높아 무엇이든 정갈하게 해내네. 남의 말에 쉽게 상처받는 대신 그만큼 아름다운 것을 알아보네. 흠을 견디지 못해 스스로를 깎기 쉬우니, 자네 빛은 이미 충분하다는 것을 잊지 말게.',
 '큰 강과 바다 같은 사람일세. 품이 넓고 생각이 깊어 많은 것을 받아들이고, 막히면 돌아서라도 끝내 흘러가네. 자유로운 만큼 한곳에 묶이기를 싫어하니, 흐름에 둑 하나는 쌓아 두어야 힘이 모이네. 지혜로 길을 여는 사람일세.',
 '이슬과 빗물 같은 사람일세. 조용히 스며들어 남의 마음을 적시고, 직관과 감수성이 남다르네. 드러나지 않게 일을 해내는 힘이 있으나, 생각이 깊어 혼자 앓기 쉬우니 말로 꺼내는 연습을 하게. 자네가 내린 비는 반드시 어딘가를 살리네.'];
const TG_SOC={비견:'자기 힘으로 서려는 사람일세. 남의 지시보다 스스로 정한 일에서 힘이 나고, 같은 뜻의 동료와 어깨를 나란히 할 때 가장 잘하네.',겁재:'승부처에서 강한 사람일세. 경쟁이 있어야 힘이 나고, 판을 키우는 배짱이 있네. 다만 돈과 사람을 함께 지키는 법을 익혀야 하네.',식신:'손으로 만들어 내는 사람일세. 기술과 재주로 먹고살 복이 있고, 즐겁게 일할 때 결과도 좋네.',상관:'말과 생각으로 판을 바꾸는 사람일세. 틀에 갇히면 답답해하고, 남다른 기획과 표현에서 이름이 나네.',편재:'넓게 벌이는 사람일세. 사람과 돈을 크게 굴리는 감각이 있고, 움직이는 만큼 기회가 붙네.',정재:'차곡차곡 쌓는 사람일세. 성실함과 정확함으로 신뢰를 얻고, 안정된 자리에서 재물을 모으네.',편관:'어려운 일을 맡는 사람일세. 압박 속에서 실력이 드러나고, 책임이 무거운 자리에서 이름을 얻네.',정관:'자리와 규칙 속에서 빛나는 사람일세. 조직에서 인정받고 차근차근 오르는 길이 잘 맞네.',편인:'홀로 깊이 파는 사람일세. 남다른 공부와 기술, 직관이 무기이고, 혼자 몰두할 때 실력이 붙네.',정인:'배우고 가르치는 사람일세. 문서와 자격, 어른의 도움이 따르고, 신뢰를 바탕으로 일하네.'};
const NSS={역마:'움직일 때 운이 트이는 별일세. 출장, 이사, 먼 곳과 닿는 일이 자네 몫이네.',도화:'사람 눈에 띄는 매력의 별일세. 사람을 상대하는 일에서 힘을 쓰되, 인연을 고르는 눈을 길러 두게.',화개:'홀로 깊어지는 별일세. 공부와 예술, 철학에 끌리고 혼자만의 시간이 자네를 채우네.',천을귀인:'막힐 때마다 돕는 사람이 나타나는 별일세. 어려울수록 사람에게 먼저 손을 내밀게.',양인:'추진력과 배짱의 별일세. 잘 쓰면 무기가 되고 잘못 쓰면 다치니, 서두르는 날을 조심하게.',홍염:'은근한 매력의 별일세. 드러내지 않아도 알아보는 사람이 있네.',문창귀인:'글과 공부의 별일세. 기록하고 정리하는 일이 자네 재산이 되네.',공망:'비어 있는 자리의 별일세. 그 자리의 일은 욕심을 덜고 실속을 보게.',백호:'기운이 센 별일세. 결단이 빠르나 서두르다 다치기 쉬우니 몸 쓰는 일은 한 번 더 살피게.'};
const DU_T2={0:'나를 세우고 사람을 모으는 10년',1:'재능을 밖으로 펼치는 10년',2:'재물과 활동 무대를 넓히는 10년',3:'자리와 책임이 커지는 10년',4:'배우고 실력을 쌓는 10년'};
const ORG=['간과 눈, 근육과 힘줄','심장과 혈관, 눈의 피로','위장과 소화','폐와 호흡기, 피부','신장과 방광, 허리'];
const GRPN=['비겁(나와 같은 기운)','식상(내가 내보내는 기운)','재성(재물의 기운)','관성(자리와 책임의 기운)','인성(배움과 도움의 기운)'];
const clamp=v=>Math.max(20,Math.min(95,Math.round(v)));
function areaScores(o){ const loveG=F.male?2:3, strong=['장생','관대','건록','제왕'].includes(o.us), weak=['병','사','묘','절'].includes(o.us), has=(at,k)=>o.br.some(r=>r.at===at&&r.k===k), any=k=>o.br.some(r=>r.k===k);
  return {money:clamp(52+(o.g1===2?(o.f1?16:-9):0)+(o.g2===2?(o.f2?12:-6):0)+(o.g1===0&&!o.f1?-6:0)+(o.ss.includes('공망')?-7:0)+(o.ss.includes('천을귀인')?4:0)+o.fill*3),
   work:clamp(52+(o.g1===3?(o.f1?16:-9):0)+(o.g2===3?(o.f2?10:-5):0)+(o.g1===4?(o.f1?8:-3):0)+(has('월지','육합')?7:0)+(has('월지','충')?-9:0)+(strong?4:0)+(o.ss.includes('역마')?3:0)),
   love:clamp(52+(has('일지','육합')?15:0)+(has('일지','충')?-14:0)+(o.ss.includes('도화')?8:0)+(o.ss.includes('홍염')?5:0)+(o.g1===loveG?(o.f1?10:-4):0)+(has('일지','원진')?-6:0)),
   people:clamp(52+(has('년지','육합')||has('월지','육합')?8:0)+(has('년지','충')||has('월지','충')?-8:0)+(any('형')||any('원진')||any('해')?-5:0)+(o.ss.includes('천을귀인')?9:0)+(o.g1===0?(o.f1?6:-5):0)),
   body:clamp(54+(strong?10:0)+(weak?-11:0)+(o.ss.includes('백호')?-8:0)+(o.ss.includes('양인')?-4:0)+(any('충')?-5:0)+o.fill*4)}; }
function monthDays(o){ const {P,dm,st}=F, db=P.d[1], mb=P.m[1], yb=P.y[1], loveG=F.male?2:3; const s0=Date.UTC(o.start.y,o.start.m-1,o.start.d), e0=Date.UTC(o.end.y,o.end.m-1,o.end.d); const all=[];
  for(let t=s0;t<=e0;t+=864e5){ const d=new Date(t), y=d.getUTCFullYear(), m=d.getUTCMonth()+1, dd=d.getUTCDate(), w=d.getUTCDay(); const [s,b]=S_.dayPillar(y,m,dd);
    const g1=S_.rel(dm,stEl(s)), g2=S_.relBranch(dm,b), f1=S_.favorable(st,g1), f2=S_.favorable(st,g2); const ch=S_.isChung(b,db)?'일지':S_.isChung(b,mb)?'월지':S_.isChung(b,yb)?'년지':'';
    let v=(f1?2:0)+(f2?2:0)+(S_.isHap(b,db)?2.5:0)+(S_.isHap(b,mb)?1:0)-(ch?6:0); all.push({y,m,d:dd,w,s,b,g1,g2,v,ch,hap:S_.isHap(b,db),love:g1===loveG&&f1}); }
  const good=[...all].filter(x=>!x.ch&&x.v>0).sort((a,b)=>b.v-a.v).slice(0,2).sort((a,b)=>a.y-b.y||a.m-b.m||a.d-b.d);
  const bad=all.filter(x=>x.ch==='일지'||x.ch==='월지').slice(0,2);
  return {good,bad}; }
const GOODWHY=x=>x.hap?'일지와 합이 드는 날':x.love?'인연의 별이 뜨는 날':S_.favorable(F.st,x.g1)&&S_.favorable(F.st,x.g2)?'하늘과 땅이 모두 자네 편인 날':'자네 사주가 반기는 날';
const BADWHY=x=>x.ch==='일지'?'일지와 부딪히는 날, 가까운 사람과 말 조심':'월지와 부딪히는 날, 일터의 큰 결정 미루기';
function favElsOf(){ const fg=F.st.strong?[1,2,3]:[0,4]; return fg.map(g=>(stEl(F.dm)+g)%5); }
function bars(vals,hi){ return `<div class="abar">${vals.map((v,i)=>`<div class="${hi&&hi.includes(i)?'hi':''}"><i style="height:${Math.round((v-15)/85*100)}%"></i><small>${F.months[i].start.m}</small></div>`).join('')}</div>`; }
const AREA_BASE={
 money:()=>{ const e=(stEl(F.dm)+2)%5, n=F.cnt[e]; return `자네 원국에서 재물의 기운(${EL[e]})은 ${n}개일세. ${n===0?'원국에 재물의 글자가 없으니, 돈은 들어오는 해와 달을 골라 거두는 사주일세. 큰돈을 쫓기보다 들어오는 때를 알아 두는 것이 자네의 재테크네.':n>=3?'재물의 글자가 많으니 돈 냄새를 맡는 감각이 있으나, 그만큼 돈 때문에 마음이 바쁘기 쉽네. 버는 재주보다 지키는 습관이 자네를 부자로 만드네.':'재물의 글자가 알맞게 있으니 꾸준히 벌고 모으는 결이 있네. 무리한 한 방보다 쌓는 쪽이 자네 운에 맞네.'}${F.st.strong?' 자네는 신강하니 재물을 감당할 힘이 있네. 기회가 오면 받아 내게.':' 자네는 신약하니 큰돈을 한꺼번에 들이기보다 나눠 받는 편이 탈이 없네.'}`; },
 work:()=>{ const e=(stEl(F.dm)+3)%5, n=F.cnt[e], m=S_.tgBranch(F.dm,F.P.m[1]); return `자네 원국에서 자리와 책임의 기운(${EL[e]})은 ${n}개이고, 사회의 자리인 월지는 ${m}일세. ${TG_SOC[m]||''} ${n===0?'관성이 없으니 남이 정한 틀보다 자네가 만든 틀에서 힘이 나네.':n>=3?'관성이 많으니 맡는 일이 늘 무겁네. 거절할 일을 고르는 것도 실력일세.':'관성이 알맞으니 조직 안에서 인정받으며 오르는 길이 순하네.'}`; },
 love:()=>{ const e=(stEl(F.dm)+(F.male?2:3))%5, n=F.cnt[e], spouse=S_.tgBranch(F.dm,F.P.d[1]); return `자네에게 인연의 별(${F.male?'재성':'관성'}, ${EL[e]})은 원국에 ${n}개이고, 배우자 자리인 일지에는 ${jo(spouse,'이','가')} 앉아 있네. ${n===0?'인연의 별이 원국에 없으니 인연은 운에서 들어오는 해와 달에 맺어지네. 그때를 놓치지 않는 것이 중요하네.':n>=3?'인연의 별이 많으니 사람이 잘 붙네. 고르는 눈이 곧 자네 복일세.':'인연의 별이 알맞으니 서두르지 않아도 맞는 사람이 곁에 오네.'} 일지의 ${jo(spouse,'은','는')} 자네가 가까운 사람에게 바라는 모습이기도 하네.`; },
 people:()=>{ const b=F.cnt[stEl(F.dm)], i=F.cnt[(stEl(F.dm)+4)%5]; return `자네 원국에는 나와 같은 기운(비겁)이 ${b}개, 나를 돕는 기운(인성)이 ${i}개 있네. ${b>=3?'곁에 사람이 많고 경쟁도 많으니, 의리와 선을 함께 지키게.':b===0?'혼자 해내는 힘이 강한 대신 기댈 사람을 일부러 만들어 두어야 하네.':'벗과 동료가 알맞게 있어 서로 힘이 되네.'} ${i>=2?'어른과 스승의 도움이 따르는 사주일세.':'윗사람의 도움보다 자네 손으로 길을 내는 사주일세.'}`; },
 body:()=>`자네 원국에서 가장 넘치는 기운은 ${EL[F.cnt.indexOf(Math.max(...F.cnt))]}, 가장 모자란 기운은 ${EL[F.blank]}일세. 오행으로 보면 ${ORG[F.blank]} 쪽을 아끼라고 하네. ${F.st.strong?'기운이 센 사주라 무리해도 버티지만, 버티는 사이에 쌓이니 쉬는 날을 정해 두게.':'기운을 아껴 쓰는 사주라 잠과 밥이 곧 보약일세.'} 이것은 건강 진단이 아니라 기운의 균형을 본 것이니, 몸이 보내는 신호는 꼭 의사에게 보이게.`};
const AREA_DO={money:['좋은 달에 들어온 돈의 절반은 바로 떼어 두기','큰 지출은 좋은 달로 미루기','조심할 달에는 보증과 투자 쉬기'],work:['내밀 서류는 좋은 달 한 달 전에 준비하기','조심할 달에는 큰 결정을 미루고 실력 다지기','좋은 달에 면담과 제안을 몰아 두기'],love:['좋은 달에는 먼저 연락하기','조심할 달에는 말보다 행동으로 마음 보이기','서운한 일은 그날 안에 풀기'],people:['좋은 달에 미뤄 둔 사람을 만나기','조심할 달에는 돈 거래와 큰 약속 피하기','집안 어른께 안부를 정해 두고 드리기'],body:['조심할 달에는 일정을 비워 두기','같은 시간에 자고 일어나기']};
function areaBlock(k,l){ const vals=F.months.map(o=>areaScores(o)[k]); const idx=vals.map((v,i)=>({v,i})); const top=[...idx].sort((a,b)=>b.v-a.v).slice(0,2).map(x=>x.i), low=[...idx].sort((a,b)=>a.v-b.v).slice(0,2).map(x=>x.i);
  const mm=i=>F.months[i].start.m+'월';
  return `<div class="ar2"><div class="arh"><b>${l}</b><span>올해 평균 ${Math.round(vals.reduce((a,b)=>a+b,0)/12)}점</span></div>${bars(vals,top)}
   <p class="p"><b>타고난 결.</b> ${AREA_BASE[k]()}</p>
   <p class="p"><b>올해의 흐름.</b> ${N(C.areas[k].sum)}</p>
   <p class="p"><b>볕이 드는 달은 ${top.map(mm).join('과 ')}일세.</b> ${top.map(i=>{ const o=F.months[i]; return `${mm(i)}은 ${o.gz}월로 천간이 ${o.t1}, 지지가 ${jo(o.t2,'이네','네')}.`; }).join(' ')} <b>걸음을 늦출 달은 ${low.map(mm).join('과 ')}일세.</b> ${low.map(i=>{ const o=F.months[i]; const r=o.br[0]; return `${mm(i)}은 ${r?`${jo(r.at,'과','와')} ${jo(r.k,'이','가')} 걸리고`:`운성이 ${jo(o.us,'이라','라')} 기운이 낮고`}`; }).join(', ')} 하니 서두르지 말게.</p>
   <ol class="rxl">${(k==='body'?AREA_DO.body.slice(0,2).concat([ELX[F.blank].acts[0]]):AREA_DO[k]).map(a=>`<li>${a}</li>`).join('')}</ol>
   <p class="tip">소헌 선생 · ${N(C.areas[k].tip)}</p></div>`; }
function natureDoc(){ const P=F.P, dm=F.dm, mT=S_.tgBranch(dm,P.m[1]), jh=F.johu, G=S_.tgStem;
  const grpCnt=[0,0,0,0,0]; [P.y,P.m,P.d,P.h].forEach((p,i)=>{ if(!p) return; if(i!==2) grpCnt[S_.rel(dm,stEl(p[0]))]++; grpCnt[S_.relBranch(dm,p[1])]++; });
  const mx=grpCnt.indexOf(Math.max(...grpCnt)), mn=grpCnt.indexOf(Math.min(...grpCnt));
  const nat=F.natal.length?F.natal.map(o=>`<li><b>${o.at} · ${o.k}</b> ${NSS[o.k]||SSM[o.k]||''}</li>`).join(''):'<li>원국에 두드러진 신살이 없네. 신살보다 오행과 십성의 흐름으로 읽는 사주일세.</li>';
  return `<div class="doc"><div class="ch"><em>제5장</em><b>타고난 그릇</b><span>일간 · 월지 · 십성의 분포 · 신살</span></div>
   <p class="p"><b>자네는 ${GAN[dm]}${EL[stEl(dm)]}일세.</b> ${DM_HG[dm]}</p>
   <p class="p"><b>사회에서 쓰는 힘은 ${mT}일세.</b> 태어난 달의 지지 ${JI[P.m[1]]}가 자네에게 ${jo(mT,'이','가')} 되네. 월지는 사주에서 가장 힘이 센 자리라, 자네가 세상에 나가 일할 때 쓰는 연장이 바로 이것일세. ${TG_SOC[mT]||''}</p>
   <div class="g5">${grpCnt.map((n,i)=>`<div class="${i===mx?'mx':''}"><b>${n}</b><small>${['비겁','식상','재성','관성','인성'][i]}</small></div>`).join('')}</div>
   <p class="p">여덟 글자를 십성으로 나누어 보면 ${GRPN[mx]}이 ${grpCnt[mx]}개로 가장 많고, ${GRPN[mn]}이 ${grpCnt[mn]}개로 가장 적네. ${['스스로 서려는 힘이 앞서는 사주일세. 남의 손을 빌리는 법을 익히면 더 멀리 가네.','재주와 표현이 앞서는 사주일세. 꺼내 보인 만큼 길이 열리네.','재물과 현실 감각이 앞서는 사주일세. 지키는 습관이 붙으면 크게 모이네.','책임과 자리가 앞서는 사주일세. 무거운 짐을 덜어 내는 법도 알아 두게.','배움과 생각이 앞서는 사주일세. 배운 것을 손으로 옮길 때 결실을 보네.'][mx]} 가장 적은 ${GRPN[mn].split('(')[0]}은 자네가 운에서 받아 써야 할 기운이니, 그 기운이 드는 해와 달을 잘 쓰게.</p>
   <p class="p"><b>강약과 계절.</b> 자네는 ${F.st.label}한 사주일세. ${F.st.strong?'기운이 넉넉하니 밖으로 쓰고 나누는 운(식상 · 재성 · 관성)에서 결실을 보네.':'기운을 아껴 써야 하니 나를 채우고 돕는 운(인성 · 비겁)에서 힘을 얻네.'}${jh&&jh.need!=null?` 계절로 보면 자네는 ${jh.season}에 태어나 ${jh.why.replace(/다$/,'네')}.`:''}</p>
   <p class="p" style="margin-bottom:6px"><b>원국의 별(신살).</b></p><ul class="nss">${nat}</ul>
   ${F.gong&&F.gong.length?`<p class="p"><b>공망.</b> 자네 일주로 보면 ${F.gong.map(b=>JI[b]).join('와 ')}가 비어 있는 자리일세. 이 글자가 드는 해와 달에는 기대만큼 손에 남지 않기 쉬우니 욕심을 덜고 실속을 보게.</p>`:''}</div>`; }
function daeunDoc(){ const D=F.DU, age=F.age; if(!D||!D.list||!D.list.length) return '';
  const rows=D.list.map(x=>{ const g=S_.rel(F.dm,stEl(x.s)), fv=S_.favorable(F.st,g)&&S_.favorable(F.st,S_.relBranch(F.dm,x.b)); const now=age>=x.age&&age<x.age+10; return `<div class="du2 ${now?'now':''}"><span class="a">${x.age}~${x.age+9}세</span><span class="g" data-hj="0">${GAN[x.s]}${JI[x.b]}</span><span class="t">${DU_T2[g]}</span><span class="f">${fv?'순풍':'맞바람'}</span></div>`; }).join('');
  const cur=F.cur, nx=F.nxt, cg=S_.rel(F.dm,stEl(cur.s));
  return `<div class="doc"><div class="ch"><em>제6장</em><b>대운의 흐름</b><span>${D.fwd?'순행':'역행'} · ${D.start}세 시작</span></div>
   <p class="p">대운은 10년마다 바뀌는 큰 계절일세. 한 해의 운이 날씨라면 대운은 계절이라, 같은 비라도 봄비와 가을비가 다르듯 같은 해라도 어느 대운에서 맞느냐에 따라 뜻이 달라지네.</p>
   <div class="dul">${rows}</div>
   <p class="p"><b>지금은 ${GAN[cur.s]}${JI[cur.b]} 대운(${cur.age}~${cur.age+9}세)일세.</b> ${DU_T2[cg]}이네. 천간은 자네에게 ${S_.tgStem(F.dm,cur.s)}, 지지는 ${jo(S_.tgBranch(F.dm,cur.b),'이니','니')} ${SS[S_.tgStem(F.dm,cur.s)].good.split('. ')[0]}.</p>
   ${nx?`<p class="p"><b>다음은 ${GAN[nx.s]}${JI[nx.b]} 대운(${nx.age}세부터)일세.</b> ${DU_T2[S_.rel(F.dm,stEl(nx.s))]}이 기다리고 있네. ${age>=cur.age+8?'문턱이 가까우니 올해와 내년은 다음 10년을 준비하는 해로 쓰게.':'아직 시간이 있으니 지금 대운에서 거둘 것을 먼저 거두게.'}</p>`:''}</div>`; }
function faqDoc(DY){ const sc=k=>F.months.map((o,i)=>({i,v:areaScores(o)[k]})).sort((a,b)=>b.v-a.v), mm=i=>F.months[i].start.m+'월';
  const w=sc('work'), m=sc('money'), l=sc('love'), b=sc('body'); const mv=F.months.map((o,i)=>({o,i})).filter(x=>x.o.ss.includes('역마')).map(x=>mm(x.i));
  const dd=a=>a.length?a.map(x=>`${x.m}월 ${x.d}일`).join(', '):'따로 고른 날이 없네';
  const Q=[['올해 이직하거나 자리를 옮겨도 되겠습니까',`자리를 옮기기 좋은 달은 ${mm(w[0].i)}과 ${mm(w[1].i)}일세. 이 두 달에는 자리와 문서의 기운이 자네를 받쳐 주네.${mv.length?` 또 ${mv.join(', ')}에는 역마가 들어 움직임 자체가 순하네.`:''} 반대로 ${mm(w[11].i)}에는 결정을 미루고 실력을 다지게. 옮길지 말지는 운보다 조건이 먼저이니, 조건을 갖춘 뒤 좋은 달에 움직이게.`],
   ['돈은 언제 모이고 언제 새겠습니까',`돈이 붙는 달은 ${mm(m[0].i)}과 ${mm(m[1].i)}일세. 이때 들어온 돈의 절반은 바로 떼어 두게. 새기 쉬운 달은 ${mm(m[11].i)}과 ${mm(m[10].i)}이니, 이 두 달에는 보증과 투자, 충동적인 큰 지출을 쉬게. 계약과 문서는 ${dd(DY.deal)}이 좋네.`],
   ['좋은 인연은 언제 오겠습니까',`인연의 기운이 가장 짙은 달은 ${mm(l[0].i)}과 ${mm(l[1].i)}일세. 이 달에는 모임에 한 번 더 나가고, 먼저 연락하게. 고백이나 중요한 만남은 ${dd(DY.love)} 가운데서 고르면 좋네. ${mm(l[11].i)}에는 오해가 생기기 쉬우니 말보다 행동으로 마음을 보이게.`],
   ['이사나 큰 계약은 언제가 좋겠습니까',`이사는 자네 원국과 부딪히지 않는 ${dd(DY.move)}이 좋네. 계약과 서류는 ${dd(DY.deal)}에 하게. 어느 쪽이든 일지와 충이 드는 날은 피했으니, 날을 고른 뒤에는 준비에 마음을 쓰게.`],
   ['올해 몸은 어디를 아껴야 하겠습니까',`기운이 가장 낮은 달은 ${mm(b[11].i)}과 ${mm(b[10].i)}일세. 이 두 달에는 일정을 비우고 잠을 늘리게. 오행으로는 ${ORG[F.blank]} 쪽을 아끼라고 하네. 다만 이것은 기운의 균형을 본 것이지 진단이 아니니, 불편한 곳은 꼭 의사에게 보이게.`]];
  return `<div class="doc"><div class="ch"><em>제10장</em><b>자주 묻는 다섯 가지</b><span>감정서의 근거로 답하네</span></div>${Q.map(q=>`<div class="qa"><b>${q[0]}</b><p class="p">${q[1]}</p></div>`).join('')}</div>`; }
function gaeunTable(){ const fav=favElsOf(); return `<table class="gil gun" data-hj="0"><tr><th>달</th><td><b>곁에 둘 기운</b></td></tr>${F.months.map(o=>{ const inM=[stEl(o.s),BR_EL[o.b]]; const e=fav.find(x=>!inM.includes(x)); const ex=ELX[e==null?F.blank:e]; return `<tr><th>${o.start.m}월 <small>${o.term}</small></th><td>${o.fill?'자네 빈칸이 저절로 채워지는 달일세. 이달은 들어오는 기운을 그대로 받게.':`${ex.n} 기운 · ${ex.color} · ${ex.dir}<small>${ex.acts[(o.start.m)%3]}</small>`}</td></tr>`; }).join('')}</table>`; }
function monthGil(){ return `<table class="gil" data-hj="0"><tr><th>달</th><td><b>좋은 날</b> · <span style="color:var(--ink-3)">피할 날</span></td></tr>${F.months.map(o=>{ const D=monthDays(o); return `<tr><th>${o.start.m}월</th><td>${D.good.map(x=>`${dstr(x)} <em>${GAN[x.s]}${JI[x.b]}</em>`).join('<br>')||'-'}${D.bad.length?`<small>피할 날 · ${D.bad.map(x=>`${x.m}/${x.d} ${x.ch} 충`).join(' · ')}</small>`:''}</td></tr>`; }).join('')}</table>`; }

function build(){ const X0=window.SNF; const DY=goodDays(); const fg=F.st.strong?[1,2,3]:[0,4], favEls=fg.map(g=>(stEl(F.dm)+g)%5), needI=favEls.reduce((a,e)=>F.cnt[e]<F.cnt[a]?e:a,favEls[0]), need=ELX[needI], jh=F.johu;
  const H=[], JE=(window.MR2A&&MR2A.JEOL)||[];
  H.push(`<div class="aist noprint" id="aist" hidden></div>`);
  H.push(`<div class="doc ptoc"><div class="dh"><small>明理館 · 鑑定書 本文</small><h2>감정서 본문</h2><p>제 2027-${X0.docNo} 호 · 의뢰인 ${X0.name}</p></div><ol class="toc2">${['타고난 그릇','대운의 흐름','2027 세운 정밀','열두 달 월운 감정','영역별 감정','자주 묻는 다섯 가지','소헌 선생의 권고','정미년 길일표','맺음말'].map((t,i)=>`<li><em>${i<8?'제'+(i+5)+'장':''}</em>${t}</li>`).join('')}</ol></div>`);
  H.push(natureDoc());
  H.push(daeunDoc());
  H.push(`<div class="doc"><div class="ch"><em>제7장</em><b>2027 세운 정밀</b><span>정미(丁未) · 천간 ${F.ys.t1} · 지지 ${F.ys.t2} · 운성 ${F.ys.us}</span></div>${relTable()}<div style="margin-top:14px">${C.pan.map(p=>`<p class="p">${N(p)}</p>`).join('')}</div>
   <p class="p"><b>대운과 겹쳐 보면.</b> 올해는 ${GAN[F.cur.s]}${JI[F.cur.b]} 대운 위에 정미(丁未)가 얹히는 해일세. 대운의 천간 ${jo(S_.tgStem(F.dm,F.cur.s),'과','와')} 올해의 천간 ${jo(F.ys.t1,'이','가')} ${S_.rel(F.dm,stEl(F.cur.s))===S_.rel(F.dm,stEl(F.ys.s))?'같은 무리라 그 기운이 두 겹으로 커지네. 좋은 쪽이든 궂은 쪽이든 크게 느껴질 해이니 마음의 중심을 잡게.':'서로 다른 기운이라, 큰 계절과 올해의 날씨가 서로 보완하네. 한쪽으로 치우치지 않는 해일세.'}</p></div>`);
  H.push(`<div class="doc"><div class="ch"><em>제8장</em><b>열두 달 월운 감정</b><span>입춘 기준 절월 · 달마다 좋은 날과 피할 날</span></div><div class="mlist">${F.months.map((o,i)=>mrow(o,i,DY,JE[i])).join('')}</div><p class="capt">오른쪽 숫자는 그달 점수(100점 만점)일세. 붉은 달은 볕이 드는 달, 흐린 달은 걸음을 늦출 달이네. 달 이름을 누르면 접고 펼 수 있네.</p></div>`);
  H.push(`<div class="doc"><div class="ch"><em>제9장</em><b>영역별 감정</b><span>막대는 달마다의 점수 · 붉은 막대가 좋은 달</span></div>${AREAS.map(([k,l])=>areaBlock(k,l)).join('')}</div>`);
  H.push(faqDoc(DY));
  const bw=(i,t,g)=>{ const o=F.months[i]; return `<div class="bwr ${g?'good':'bad'}"><b>${o.start.m}월</b><div><p class="bt">${g?'볕이 드는 달':'걸음을 늦출 달'} · ${C.months[i].tag}</p><p>${N(t)}</p></div></div>`; };
  H.push(`<div class="doc"><div class="ch"><em>제11장</em><b>소헌 선생의 권고</b></div><div class="bw">${Object.keys(C.best).map(i=>bw(+i,C.best[i],1)).join('')}${Object.keys(C.warn).map(i=>bw(+i,C.warn[i],0)).join('')}</div>
   <p class="p" style="margin-top:16px">자네 사주가 올해 가장 반기는 기운은 <b>${need.n}</b>일세. ${need.n} 기운을 곁에 두면 좋은 달은 더 좋아지고 궂은 달은 덜 궂어지네.${jh&&jh.need!=null?` 또 자네는 ${jh.why.replace(/다$/,'네')}.`:''}</p>
   <div class="rx3"><div><small>곁에 둘 색</small><b>${need.color}</b></div><div><small>방위</small><b>${need.dir}</b></div><div><small>숫자</small><b>${need.num}</b></div></div><ol class="rxl">${need.acts.map(a=>`<li>${a}</li>`).join('')}</ol>
   <p class="p" style="margin-top:16px"><b>열두 달 개운표.</b> 달마다 들어오는 기운이 다르니, 그달에 모자란 쪽을 채우는 법을 적어 두었네.</p>${gaeunTable()}</div>`);
  const crow=(t,a,n)=>`<tr><th>${t}</th><td>${a.length?a.map(x=>`${dstr(x)} <em>${GAN[x.s]}${JI[x.b]}일</em>`).join('<br>'):'올해는 따로 고른 날이 없네'}<small>${n}</small></td></tr>`;
  H.push(`<div class="doc"><div class="ch"><em>제12장</em><b>정미년 길일표</b><span>자네 원국과 부딪히지 않는 날</span></div><table class="gil" data-hj="0">${crow('이사 · 집',DY.move,'일지 · 월지 · 년지와 충이 없고 사주가 반기는 날, 주말 위주')}${crow('계약 · 문서',DY.deal,'재물 · 자리 · 문서의 기운이 반기는 평일')}${crow('고백 · 만남',DY.love,'배우자 자리와 합이 들거나 인연의 별이 뜨는 날')}${crow('시험 · 면접',DY.exam,'자리와 배움의 기운이 반기는 날')}</table>
   <p class="p" style="margin-top:16px"><b>달마다 좋은 날과 피할 날.</b></p>${monthGil()}<p class="capt">손 없는 날 같은 민속 택일은 따로 보지 않았네. 더 정밀하게 고르려면 택일 메뉴를 쓰게.</p></div>`);
  H.push(`<div class="doc letter"><div class="ch"><em>맺음말</em><b>감정을 마치며</b></div>${C.letter.map(p=>`<p class="p">${N(p)}</p>`).join('')}<div class="sign"><span>${X0.td} · 명리관 감정인 소헌 선생</span><span class="gwan"><i>素</i><i>軒</i></span></div></div>`);
  H.push(`<div class="noprint mrbtn"><button type="button" class="go" id="mrSave">감정서 저장하기 (PDF)</button><button type="button" class="go ghost" id="mrAsk">감정서에 대해 소헌 선생에게 묻기</button></div>`);
  H.push(`<p class="note">${C.ai?'이 감정서는 만세력 계산 근거만 재료로 AI가 소헌 선생의 말투로 쓴 글입니다':'지금 보이는 글은 해석 사전으로 조립한 감정서입니다. 같은 근거로 AI가 소헌 선생의 말투로 더 길게 다시 써 드려요'}. 소헌 선생은 AI로 만든 가상의 명리가입니다.</p>`);
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
출력 JSON 형식: {"pan":["올해 간지가 원국에 들어오는 법. 6~7단락, 단락마다 200~280자. 천간 십성, 지지 십성, 원국과의 관계, 신살, 대운과 겹쳐 본 올해를 차례로"],"best":{"${F.bestI.join('":"이유 1~2문장","')}":"이유 1~2문장"},"warn":{"${F.warnI.join('":"이유 1~2문장","')}":"이유 1~2문장"},"letter":["맺음말 4~5단락, 단락마다 90~150자. 마지막 단락은 '사주는 정답이 아니라 지도'라는 생각으로 맺는다"]}
best와 warn의 키는 달 번호이며 위 번호로 고정이다.

[사실 카드]
${card()}`;
  const mon=ids=>`${ST}\n\n[할 일] 감정서 '열두 달 월운 감정' 가운데 아래 대상 달을 쓴다.
출력 JSON 형식: 배열. 달마다 {"i":달 번호,"tag":"그달을 한마디로 이른 제목 6~14자","total":"그달 감정 450~560자. 절기 이름과 간지로 시작해 십성 · 운성 · 관계 · 신살 · 빈칸채움을 근거로 풀고, 소헌 선생의 권고로 끝낸다","love":"인연 90~150자","money":"재물 90~150자","work":"일과 자리 90~150자","people":"사람 관계 90~150자","body":"몸과 마음 90~150자","do":"권하는 일, ~하기로 끝나는 8~18자","avoid":"삼갈 일 8~18자"}
대상 달 번호: ${ids.join(', ')}

[문체 예시 · 다른 사람 사주의 한 달]
${ex}

[사실 카드]
${card(ids)}`;
  const areas=`${ST}\n\n[할 일] 감정서 '영역별 감정'을 쓴다.
출력 JSON 형식: {"areas":{"love":{"sum":"인연 한 해 총론 380~480자. 좋은 달과 조심할 달을 근거와 함께 짚는다","tip":"소헌 선생의 한마디 한 문장"},"money":{"sum":"재물","tip":""},"work":{"sum":"일과 자리","tip":""},"people":{"sum":"가족 · 친구 · 일터 사람","tip":""},"body":{"sum":"몸과 마음","tip":""}}}

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
  window.PremAI.run({key:F.key+'-mr2027',ver:'v2',parts:P,
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
.mpic{position:relative;aspect-ratio:16/9;margin:4px 0 12px;background:#e9e1d0 center/cover no-repeat}
.mpic span{position:absolute;right:10px;bottom:8px;font-family:var(--brush);font-size:22px;color:var(--ink);text-shadow:0 0 10px rgba(251,247,238,.95)}
.mdays{display:grid;grid-template-columns:1fr 1fr;margin-top:10px;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.mdays>div{padding:10px 8px}.mdays>div+div{border-left:1px solid var(--rule-2)}
.mdays small{display:block;font-size:11.5px;font-weight:700;color:var(--seal);margin-bottom:4px}.mdays>div+div small{color:var(--ink-3)}
.mdays b{display:block;font-family:var(--serif);font-size:14px;margin-top:4px}.mdays i{display:block;font-style:normal;font-size:12px;color:var(--ink-3);line-height:1.45}
.ptoc .toc2{margin:14px 0 0;padding:0;list-style:none}.toc2 li{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--rule-2);font-family:var(--serif);font-size:14.5px}.toc2 li em{font-style:normal;width:52px;flex:none;color:var(--seal);font-weight:700}
.g5{display:grid;grid-template-columns:repeat(5,1fr);margin:6px 0 14px;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.g5 div{text-align:center;padding:10px 0}.g5 div+div{border-left:1px solid var(--rule-2)}.g5 b{display:block;font-family:var(--serif);font-size:22px;font-weight:900}.g5 small{font-size:11.5px;color:var(--ink-3)}.g5 .mx b{color:var(--seal)}
.nss{margin:0 0 12px;padding-left:18px}.nss li{font-size:14px;line-height:1.75;margin:4px 0;font-family:var(--serif)}.nss li b{color:var(--seal)}
.dul{margin:4px 0 14px;border-top:1px solid var(--ink)}
.du2{display:grid;grid-template-columns:74px 44px 1fr 44px;gap:6px;align-items:center;padding:9px 2px;border-bottom:1px solid var(--rule-2);font-size:13px}
.du2 .g{font-family:var(--serif);font-weight:900;font-size:15px}.du2 .f{text-align:right;font-size:12px;color:var(--ink-3)}.du2.now{background:var(--seal-bg)}.du2.now .a{color:var(--seal);font-weight:700}
.ar2{padding:16px 0;border-top:1px solid var(--rule)}.ch+.ar2{border-top:0;padding-top:0}
.arh{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px}.arh b{font-family:var(--serif);font-size:17px;font-weight:900}.arh span{font-size:12px;color:var(--ink-3)}
.abar{display:grid;grid-template-columns:repeat(12,1fr);gap:4px;height:84px;align-items:end;margin:0 0 14px;padding-bottom:16px;position:relative}
.abar div{position:relative;height:100%;display:flex;align-items:flex-end}.abar i{display:block;width:100%;background:var(--ink-3);opacity:.45}.abar .hi i{background:var(--seal);opacity:1}
.abar small{position:absolute;left:0;right:0;bottom:-16px;text-align:center;font-size:10px;color:var(--ink-3)}
.qa{padding:14px 0;border-top:1px solid var(--rule-2)}.ch+.qa{border-top:0;padding-top:0}.qa>b{display:block;font-family:var(--serif);font-size:15.5px;font-weight:900;margin-bottom:6px}.qa>b:before{content:'問 ';color:var(--seal)}
.gun th small{display:block;font-size:11px;color:var(--ink-3);font-weight:500}
@media print{.mrb{display:block!important}.mrh{pointer-events:none}}`;
window.MRPrem={open(){ const host=$('prem'); const X0=window.SNF; if(!host||!X0) return;
  if(!document.getElementById('mrCss')){ const s=document.createElement('style'); s.id='mrCss'; s.textContent=CSS; document.head.appendChild(s); }
  F=window.Prem2Core.build(S_,X,X0.inp); F.male=X0.inp.g==='m'; F.ysc=X0.ys; C=ruleCopy(); if(window.HJ) C=HJ.glAll(C);
  const s=[...F.months.map((o,i)=>({o,i}))].sort((a,b)=>b.o.sc-a.o.sc); F.bestI=s.slice(0,3).map(x=>x.i).sort((a,b)=>a-b); F.warnI=s.slice(-2).map(x=>x.i);
  F.bestI.forEach(i=>C.best[i]=SS[F.months[i].t1].good.split('. ')[0]+'.'); F.warnI.forEach(i=>C.warn[i]=SS[F.months[i].t1].bad.split('. ')[0]+'.');
  AIS={n:0,done:0,state:''}; host.innerHTML=build(); host.hidden=false; const lk=$('dLock'); if(lk) lk.hidden=true; if(!host._b){ bind(host); host._b=1; }
  host.querySelectorAll('.mr').forEach(r=>r.classList.add('open')); startAI(); }};
})();
