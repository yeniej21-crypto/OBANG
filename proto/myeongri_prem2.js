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
const RELM={육합:'손을 잡아 일이 순하게 풀리네',충:'정면으로 부딪혀 변동이 생기네',형:'서로 견제하는 일이 생기네. 서류와 약속은 두 번 보게',원진:'까닭 없이 서운해지기 쉽네',파:'약속 하나가 어긋나기 쉽네',해:'작은 섭섭함이 쌓이기 쉽네',삼합:'힘을 모아 기운이 커지네','같은 글자':'같은 기운이 겹쳐 일이 두 배로 커지네'};
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
    const gp={}; o.br.forEach(r=>(gp[r.at]=gp[r.at]||[]).push(r.k)); Object.keys(gp).slice(0,3).forEach(at=>{ const ks=gp[at], neg=ks.find(k=>!/합/.test(k)), lead=ks.length>1?(neg||ks[0]):ks[0]; total+=ks.length===1&&ks[0]==='같은 글자'?` ${at} ${JI[natalAt(at)]}와 같은 글자가 다시 들어오니 ${SEAT[at]} 쪽에서 ${RELM[ks[0]]||'같은 기운이 겹쳐 일이 커지네'}.`:` ${at} ${JI[natalAt(at)]}와 ${JI[o.b]}의 ${ks.length>1?jo(ks.join(' · '),'이','가')+' 함께 걸리니':ks[0]+'이니'} ${SEAT[at]} 쪽에서 ${RELM[lead]||RELM[ks[0]]||'기운이 움직이네'}.`; }); o.ss.slice(0,2).forEach(k=>total+=` ${k}${bt(k)?'이':'가'} 드니 ${SSM[k]}.`); if(o.fill) total+=` ${EL[F.blank]} 기운이 들어 자네 빈칸을 채우네.`;
    const pr=o.br.find(r=>r.at==='년지'||r.at==='월지');
    return {tag:a.k,total,love:(o.br.some(r=>r.at==='일지'&&r.k==='육합')?'가까운 사람과 마음이 묶이는 달일세':o.br.some(r=>r.at==='일지'&&r.k==='충')?'가까운 관계가 흔들리니 말을 아끼게':a.love[o.f1?0:1])+'.',
      money:a.money[o.f1?0:1]+(o.ss.includes('공망')?'. 공망이 걸려 기대보다 적게 남네.':'.'),work:a.work[o.f1?0:1]+'.',people:pr?`${SEAT[pr.at]} 쪽에서 ${RELM[pr.k]}.`:'사람 관계는 무난한 달일세.',
      body:['병','사','절','묘'].includes(o.us)?'기운이 꺾이는 달일세. 잠을 늘리고 일정을 비워 두게.':['건록','제왕','장생','관대'].includes(o.us)?'기운이 차오르는 달일세. 미뤄 둔 운동을 시작하기 좋네.':'무리하지 않으면 무난한 달일세.',do:a.do,avoid:a.avoid}; });
  const pick=fn=>M.filter(fn).map(o=>o.start.m+'월'), list=a=>a.length?a.join(', '):'뚜렷한 달이 없네';
  const ys=F.ys;
  return {pan:[`올해 정미(丁未)의 천간 정(丁)은 자네에게 ${ys.t1}일세. ${SS[ys.t1][S_.favorable(st,S_.rel(F.dm,stEl(ys.s)))?'good':'bad']}`,`지지 미(未)는 자네에게 ${ys.t2}일세. ${SS[ys.t2][S_.favorable(st,S_.relBranch(F.dm,ys.b))?'good':'bad']}`,`올해 자네 일간은 ${ys.us}, 곧 ${USM[ys.us]}에 서네. ${['장생','관대','건록','제왕'].includes(ys.us)?'제 힘이 붙는 해이니 미뤄 둔 일을 앞으로 당기게.':['병','사','묘','절'].includes(ys.us)?'힘이 낮게 깔리는 해이니 일을 넓히기보다 줄여서 깊게 하게.':'힘이 넘치지도 모자라지도 않는 해이니 하던 일을 꾸준히 이어 가면 되네.'}`].concat(ys.br.map(r=>r.k==='같은 글자'?`${r.at} ${JI[natalAt(r.at)]}와 같은 미(未)가 들어오니 ${SEAT[r.at]} 쪽에서 ${RELM[r.k]||'같은 기운이 겹쳐 일이 커지네'}.`:`${r.at} ${JI[natalAt(r.at)]}와 미(未)의 ${r.k}이니 ${SEAT[r.at]} 쪽에서 ${RELM[r.k]||'기운이 움직이네'}.`)).concat(ys.ss.map(k=>`올해 미(未)는 자네에게 ${k}일세. ${SSM[k]}.`)),
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
const hage=t=>t.replace(/맞는다$/,'맞네').replace(/않다$/,'않네').replace(/다$/,'네');
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
  return {money:clamp(52+(o.g1===2||o.g2===2?(F.st.strong?14:3):0)+(o.g1===1&&o.f1?7:0)+(o.g2===1&&o.f2?4:0)+(o.g1===0||o.g2===0?(F.st.strong?-8:6):0)+(o.ss.includes('공망')?-7:0)+(o.ss.includes('천을귀인')?4:0)+o.fill*3),
   work:clamp(52+(o.g1===3?(o.f1?16:-9):0)+(o.g2===3?(o.f2?10:-5):0)+(o.g1===4?(o.f1?8:-3):0)+(has('월지','육합')?7:0)+(has('월지','충')?-9:0)+(strong?4:0)+(o.ss.includes('역마')?3:0)),
   love:clamp(52+(has('일지','육합')?15:0)+(has('일지','충')?-14:0)+(o.ss.includes('도화')?8:0)+(o.ss.includes('홍염')?5:0)+(o.g1===loveG?(o.f1?10:-4):0)+(has('일지','원진')?-6:0)),
   people:clamp(52+(has('년지','육합')||has('월지','육합')?8:0)+(has('년지','충')||has('월지','충')?-8:0)+(any('형')||any('원진')||any('해')?-5:0)+(o.ss.includes('천을귀인')?9:0)+(o.g1===0?(o.f1?6:-5):0)),
   body:clamp(54+(strong?10:0)+(weak?-11:0)+(o.ss.includes('백호')?-8:0)+(o.ss.includes('양인')?-4:0)+(any('충')?-5:0)+o.fill*4)}; }
function monthDays(o){ const {P,dm,st}=F, db=P.d[1], mb=P.m[1], yb=P.y[1], loveG=F.male?2:3; const s0=Date.UTC(o.start.y,o.start.m-1,o.start.d), e0=Date.UTC(o.end.y,o.end.m-1,o.end.d); const all=[];
  const T=x=>Date.UTC(x.y,x.m-1,x.d,x.hh||0,x.mi||0), nx=F.months[F.months.indexOf(o)+1], sT=T(o.start), eT=nx?T(nx.start):e0+864e5;
  for(let t=s0;t<=e0+864e5;t+=864e5){ if(t+432e5<sT||t+432e5>=eT) continue; const d=new Date(t), y=d.getUTCFullYear(), m=d.getUTCMonth()+1, dd=d.getUTCDate(), w=d.getUTCDay(); const [s,b]=S_.dayPillar(y,m,dd);
    const g1=S_.rel(dm,stEl(s)), g2=S_.relBranch(dm,b), f1=S_.favorable(st,g1), f2=S_.favorable(st,g2); const ch=S_.isChung(b,db)?'일지':S_.isChung(b,mb)?'월지':S_.isChung(b,yb)?'년지':'';
    let v=(f1?2:0)+(f2?2:0)+(S_.isHap(b,db)?2.5:0)+(S_.isHap(b,mb)?1:0)-(ch?6:0); all.push({y,m,d:dd,w,s,b,g1,g2,v,ch,hap:S_.isHap(b,db),love:g1===loveG&&f1}); }
  const good=[...all].filter(x=>!x.ch&&x.v>0).sort((a,b)=>b.v-a.v).slice(0,2).sort((a,b)=>a.y-b.y||a.m-b.m||a.d-b.d);
  const bad=all.filter(x=>x.ch==='일지'||x.ch==='월지').slice(0,2);
  return {good,bad}; }
const GOODWHY=x=>`${GAN[x.s]}${JI[x.b]}일 · `+(x.hap?'배우자 자리와 합이 드는 날':x.love?'인연의 별이 뜨는 날':S_.favorable(F.st,x.g1)&&S_.favorable(F.st,x.g2)?(S_.tgStem(F.dm,x.s)===S_.tgBranch(F.dm,x.b)?`천간과 지지가 모두 ${S_.tgStem(F.dm,x.s)}, 자네 편인 날`:`${jo(S_.tgStem(F.dm,x.s),'과','와')} ${jo(S_.tgBranch(F.dm,x.b),'이','가')} 모두 자네 편인 날`):'자네 사주가 반기는 날');
const BADWHY=x=>x.ch==='일지'?'일지와 부딪히는 날, 가까운 사람과 말 조심':'월지와 부딪히는 날, 일터의 큰 결정 미루기';
function favElsOf(){ const fg=F.st.strong?[1,2,3]:[0,4]; return fg.map(g=>(stEl(F.dm)+g)%5); }
function bars(vals,hi){ return `<div class="abar">${vals.map((v,i)=>`<div class="${hi&&hi.includes(i)?'hi':''}"><i style="height:${Math.round((v-15)/85*100)}%"></i><small>${F.months[i].start.m}</small></div>`).join('')}</div>`; }
const AREA_BASE={
 money:()=>{ const e=(stEl(F.dm)+2)%5, n=F.cnt[e]; return `자네 원국에서 재물의 기운(${EL[e]})은 ${n}개일세. ${n===0?'원국에 재물의 글자가 없으니, 돈은 들어오는 해와 달을 골라 거두는 사주일세. 큰돈을 쫓기보다 들어오는 때를 알아 두는 것이 자네의 재테크네.':n>=3?'재물의 글자가 많으니 돈 냄새를 맡는 감각이 있으나, 그만큼 돈 때문에 마음이 바쁘기 쉽네. 버는 재주보다 지키는 습관이 자네를 부자로 만드네.':'재물의 글자가 알맞게 있으니 꾸준히 벌고 모으는 결이 있네. 무리한 한 방보다 쌓는 쪽이 자네 운에 맞네.'}${F.st.strong?' 자네는 신강하니 재물을 감당할 힘이 있네. 기회가 오면 받아 내게.':' 자네는 신약하니 큰돈을 한꺼번에 들이기보다 나눠 받는 편이 탈이 없네.'}`; },
 work:()=>{ const e=(stEl(F.dm)+3)%5, n=F.cnt[e], m=S_.tgBranch(F.dm,F.P.m[1]); return `자네 원국에서 자리와 책임의 기운(${EL[e]})은 ${n}개이고, 사회의 자리인 월지는 ${m}일세. ${TG_SOC[m]||''} ${n===0?'관성이 없으니 남이 정한 틀보다 자네가 만든 틀에서 힘이 나네.':n>=3?'관성이 많으니 맡는 일이 늘 무겁네. 거절할 일을 고르는 것도 실력일세.':'관성이 알맞으니 조직 안에서 인정받으며 오르는 길이 순하네.'}`; },
 love:()=>{ const e=(stEl(F.dm)+(F.male?2:3))%5, n=F.cnt[e], spouse=S_.tgBranch(F.dm,F.P.d[1]); return `자네에게 인연의 별(${F.male?'재성':'관성'}, ${EL[e]})은 원국에 ${n}개이고, 배우자 자리인 일지에는 ${jo(spouse,'이','가')} 앉아 있네. ${n===0?'인연의 별이 원국에 없으니 인연은 운에서 들어오는 해와 달에 맺어지네. 그때를 놓치지 않는 것이 중요하네.':n>=3?'인연의 별이 많으니 사람이 잘 붙네. 고르는 눈이 곧 자네 복일세.':'인연의 별이 알맞으니 서두르지 않아도 맞는 사람이 곁에 오네.'} 일지의 ${jo(spouse,'은','는')} 자네가 가까운 사람에게 바라는 모습이기도 하네.`; },
 people:()=>{ const b=F.cnt[stEl(F.dm)]-1, i=F.cnt[(stEl(F.dm)+4)%5]; return `자네 원국에는 나와 같은 기운(비겁)이 ${b}개, 나를 돕는 기운(인성)이 ${i}개 있네. ${b>=3?'곁에 사람이 많고 경쟁도 많으니, 의리와 선을 함께 지키게.':b===0?'혼자 해내는 힘이 강한 대신 기댈 사람을 일부러 만들어 두어야 하네.':'벗과 동료가 알맞게 있어 서로 힘이 되네.'} ${i>=2?'어른과 스승의 도움이 따르는 사주일세.':'윗사람의 도움보다 자네 손으로 길을 내는 사주일세.'}`; },
 body:()=>`자네 원국에서 가장 넘치는 기운은 ${EL[F.cnt.indexOf(Math.max(...F.cnt))]}, 가장 모자란 기운은 ${EL[F.blank]}일세. 오행으로 보면 ${ORG[F.blank]} 쪽을 아끼라고 하네. ${F.st.strong?'기운이 센 사주라 무리해도 버티지만, 버티는 사이에 쌓이니 쉬는 날을 정해 두게.':'기운을 아껴 쓰는 사주라 잠과 밥이 곧 보약일세.'} 이것은 건강 진단이 아니라 기운의 균형을 본 것이니, 몸이 보내는 신호는 꼭 의사에게 보이게.`};
const AREA_DO={money:['좋은 달에 들어온 돈의 절반은 바로 떼어 두기','큰 지출은 좋은 달로 미루기','조심할 달에는 보증과 투자 쉬기'],work:['내밀 서류는 좋은 달 한 달 전에 준비하기','조심할 달에는 큰 결정을 미루고 실력 다지기','좋은 달에 면담과 제안을 몰아 두기'],love:['좋은 달에는 먼저 연락하기','조심할 달에는 말보다 행동으로 마음 보이기','서운한 일은 그날 안에 풀기'],people:['좋은 달에 미뤄 둔 사람을 만나기','조심할 달에는 돈 거래와 큰 약속 피하기','집안 어른께 안부를 정해 두고 드리기'],body:['조심할 달에는 일정을 비워 두기','같은 시간에 자고 일어나기']};
const AREA_POS={money:o=>[o.g1===2||o.g2===2?'재물의 글자가 들어오고':'',(o.g1===1&&o.f1)?'재주가 돈으로 이어지고':'',(o.g1===0||o.g2===0)&&!F.st.strong?'자네 힘이 붙어 돈을 감당하고':'',o.ss.includes('천을귀인')?'돕는 사람이 나타나고':''],
 work:o=>[o.g1===3?'자리와 책임의 기운이 들고':'',o.g1===4?'문서와 배움의 기운이 들고':'',o.br.some(r=>r.at==='월지'&&r.k==='육합')?'일터 자리와 합이 들고':'',['장생','관대','건록','제왕'].includes(o.us)?`자네 일간이 ${o.us}의 자리에 서고`:'',o.ss.includes('역마')?'역마가 들어 움직임이 순하고':''],
 love:o=>[o.br.some(r=>r.at==='일지'&&r.k==='육합')?'배우자 자리와 합이 들고':'',o.ss.includes('도화')?'도화가 뜨고':'',o.ss.includes('홍염')?'홍염이 들고':'',o.g1===(F.male?2:3)&&o.f1?'인연의 별이 뜨고':''],
 people:o=>[o.br.some(r=>(r.at==='년지'||r.at==='월지')&&r.k==='육합')?'집안과 일터 자리에 합이 들고':'',o.ss.includes('천을귀인')?'돕는 사람이 나타나고':'',o.g1===0&&o.f1?'뜻 맞는 동료가 곁에 서고':''],
 body:o=>[['장생','관대','건록','제왕'].includes(o.us)?`일간이 ${o.us}의 자리에 서 기운이 차오르고`:'',o.fill?'모자란 기운이 채워지고':'']};
const AREA_NEG={money:o=>[(o.g1===2||o.g2===2)&&!F.st.strong?'재물이 보여도 감당하기 버겁고':'',(o.g1===0||o.g2===0)&&F.st.strong?'나눠야 할 몫이 생기고':'',o.ss.includes('공망')?'공망이 걸려 손에 남는 것이 적고':''],
 work:o=>[o.br.some(r=>r.at==='월지'&&r.k==='충')?'일터 자리와 충이 걸리고':'',o.g1===3&&!o.f1?'책임이 버겁게 몰리고':'',['병','사','묘','절'].includes(o.us)?`일간이 ${o.us}의 자리라 힘이 낮고`:''],
 love:o=>[o.br.some(r=>r.at==='일지'&&r.k==='충')?'배우자 자리와 충이 걸리고':'',o.br.some(r=>r.at==='일지'&&r.k==='원진')?'배우자 자리에 원진이 걸리고':'',o.g1===(F.male?2:3)&&!o.f1?'인연이 와도 버겁게 느껴지고':''],
 people:o=>[o.br.some(r=>(r.at==='년지'||r.at==='월지')&&r.k==='충')?'집안이나 일터 자리와 충이 걸리고':'',o.br.some(r=>['형','원진','해','파'].includes(r.k))?`${o.br.find(r=>['형','원진','해','파'].includes(r.k)).at} 쪽에 ${o.br.find(r=>['형','원진','해','파'].includes(r.k)).k}이 걸리고`:''],
 body:o=>[['병','사','묘','절'].includes(o.us)?`일간이 ${o.us}의 자리라 기운이 낮고`:'',o.ss.includes('백호')?'백호가 들어 다침을 조심해야 하고':'',o.br.some(r=>r.k==='충')?'충이 걸려 몸이 바쁘고':'']};
const why=(arr,dflt)=>{ const a=arr.filter(Boolean); return a.length?a.slice(0,2).join(' ').replace(/들고$/,'드네').replace(/고$/,'네'):dflt; };
const rankA=k=>{ const idx=F.months.map((o,i)=>({i,v:areaScores(o)[k]})); return {top:[...idx].sort((a,b)=>b.v-a.v||a.i-b.i).slice(0,2).map(x=>x.i),low:[...idx].sort((a,b)=>a.v-b.v||a.i-b.i).slice(0,2).map(x=>x.i)}; };
const pair=(ids,fn)=>{ const mm=i=>F.months[i].start.m+'월', t=ids.map(fn); if(ids.length===2&&t[0]===t[1]) return `${mm(ids[0])}(${F.months[ids[0]].gz})과 ${mm(ids[1])}(${F.months[ids[1]].gz})은 모두 ${t[0]}.`; return ids.map((i,j)=>`${mm(i)}(${F.months[i].gz})은 ${t[j]}.`).join(' '); };
function areaBlock(k,l){ const vals=F.months.map(o=>areaScores(o)[k]); const R0=rankA(k), top=R0.top, low=R0.low, topS=[...top].sort((a,b)=>a-b), lowS=[...low].sort((a,b)=>a-b);
  const mm=i=>F.months[i].start.m+'월';
  return `<div class="ar2"><div class="arh"><b>${l}</b><span>올해 평균 ${Math.round(vals.reduce((a,b)=>a+b,0)/12)}점</span></div>${bars(vals,top)}
   <p class="p"><b>타고난 결.</b> ${AREA_BASE[k]()}</p>
   ${C.ai?`<p class="p"><b>올해의 흐름.</b> ${N(C.areas[k].sum)}</p>`:''}
   <p class="p"><b>볕이 드는 달은 ${topS.map(mm).join('과 ')}일세.</b> ${pair(topS,i=>why(AREA_POS[k](F.months[i]),'사주가 반기는 기운이 드네'))} <b>걸음을 늦출 달은 ${lowS.map(mm).join('과 ')}일세.</b> ${pair(lowS,i=>why(AREA_NEG[k](F.months[i]),'사주가 반기지 않는 기운이 드네'))} 이때는 서두르지 말고 다음 볕을 기다리게.</p>
   <ol class="rxl">${(k==='body'?AREA_DO.body.slice(0,2).concat([ELX[F.blank].acts[0]]):AREA_DO[k]).map(a=>`<li>${a}</li>`).join('')}</ol>
   <p class="tip">소헌 선생 · ${N(C.areas[k].tip)}</p></div>`; }
function natureDoc(){ const P=F.P, dm=F.dm, mT=S_.tgBranch(dm,P.m[1]), jh=F.johu, G=S_.tgStem;
  const grpCnt=[0,0,0,0,0]; [P.y,P.m,P.d,P.h].forEach((p,i)=>{ if(!p) return; if(i!==2) grpCnt[S_.rel(dm,stEl(p[0]))]++; grpCnt[S_.relBranch(dm,p[1])]++; });
  const mx=grpCnt.indexOf(Math.max(...grpCnt)), mn=grpCnt.indexOf(Math.min(...grpCnt)); const mxA=grpCnt.map((n,i)=>n===grpCnt[mx]?i:-1).filter(i=>i>=0), mnA=grpCnt.map((n,i)=>n===grpCnt[mn]?i:-1).filter(i=>i>=0); const GN=i=>GRPN[i].split('(')[0], GL=a=>a.length>2?a.map(GN).join(', '):a.map(GN).join('과 ');
  const MXT=['스스로 서려는 힘이 앞서는 사주일세. 남의 손을 빌리는 법을 익히면 더 멀리 가네.','재주와 표현이 앞서는 사주일세. 꺼내 보인 만큼 길이 열리네.','재물과 현실 감각이 앞서는 사주일세. 지키는 습관이 붙으면 크게 모이네.','책임과 자리가 앞서는 사주일세. 무거운 짐을 덜어 내는 법도 알아 두게.','배움과 생각이 앞서는 사주일세. 배운 것을 손으로 옮길 때 결실을 보네.'];
  const MNT=['나와 같은 기운이 적으니 혼자 버티기보다 곁에 설 사람을 일부러 두게.','내보내는 기운이 적으니 속에 든 것을 말과 결과물로 꺼내는 연습이 필요하네.','재물의 기운이 적으니 돈은 들어오는 때를 골라 거두는 것이 요령일세.','자리의 기운이 적으니 남이 정한 틀보다 자네가 정한 규칙이 힘이 되네.','돕는 기운이 적으니 배움과 쉼을 스스로 챙겨야 지치지 않네.'];
  const nat=F.natal.length?F.natal.map(o=>`<li><b>${o.at} · ${o.k}</b> ${NSS[o.k]||SSM[o.k]||''}</li>`).join(''):'<li>원국에 두드러진 신살이 없네. 신살보다 오행과 십성의 흐름으로 읽는 사주일세.</li>';
  return `<div class="doc"><div class="ch"><em>제6장</em><b>타고난 그릇</b><span>일간 · 월지 · 십성의 분포 · 신살</span></div>
   <p class="p"><b>자네는 ${GAN[dm]}${EL[stEl(dm)]}일세.</b> ${DM_HG[dm]}</p>
   <p class="p"><b>사회에서 쓰는 힘은 ${mT}일세.</b> 태어난 달의 지지 ${JI[P.m[1]]}가 자네에게 ${jo(mT,'이','가')} 되네. 월지는 사주에서 가장 힘이 센 자리라, 자네가 세상에 나가 일할 때 쓰는 연장이 바로 이것일세. ${TG_SOC[mT]||''}</p>
   <div class="g5">${grpCnt.map((n,i)=>`<div class="${i===mx?'mx':''}"><b>${n}</b><small>${['비겁','식상','재성','관성','인성'][i]}</small></div>`).join('')}</div>
   <p class="p">여덟 글자를 십성으로 나누어 보면 ${mxA.length>1?`${GL(mxA)}이 ${grpCnt[mx]}개씩으로 가장 많고`:`${GRPN[mx]}이 ${grpCnt[mx]}개로 가장 많고`}, ${grpCnt[mn]===0?`${GL(mnA)}${mnA.length>1?'은 하나도 없네':(bt(GN(mn))?'은':'는')+' 하나도 없네'}`:`${GL(mnA)}이 ${grpCnt[mn]}개${mnA.length>1?'씩':''}으로 가장 적네`}. ${mxA.length>1?`${jo(mxA.map(i=>MXT[i].split('이 앞서는')[0].split('가 앞서는')[0]).join(', '),'이','가')} 함께 앞서는 사주일세. ${mxA.map(i=>MXT[i].split('사주일세. ')[1]).join(' ')}`:MXT[mx]} ${grpCnt[mn]===0?mnA.map(i=>MNT[i]).join(' '):''} 모자란 기운은 운에서 받아 써야 하니, 그 기운이 드는 해와 달을 잘 쓰게.</p>
   <p class="p"><b>강약과 계절.</b> 자네는 ${F.st.label}한 사주일세. ${F.st.strong?'기운이 넉넉하니 밖으로 쓰고 나누는 운(식상 · 재성 · 관성)에서 결실을 보네.':'기운을 아껴 써야 하니 나를 채우고 돕는 운(인성 · 비겁)에서 힘을 얻네.'}${jh&&jh.need!=null?` 계절로 보면 자네는 ${hage(jh.why)}.`:''}</p>
   <p class="p" style="margin-bottom:6px"><b>원국의 별(신살).</b></p><ul class="nss">${nat}</ul>
   ${F.gong&&F.gong.length?`<p class="p"><b>공망.</b> 자네 일주로 보면 ${F.gong.map(b=>JI[b]).join('와 ')}가 비어 있는 자리일세. 이 글자가 드는 해와 달에는 기대만큼 손에 남지 않기 쉬우니 욕심을 덜고 실속을 보게.</p>`:''}</div>`; }
function daeunDoc(){ const D=F.DU, age=F.age; if(!D||!D.list||!D.list.length) return '';
  const rows=D.list.map(x=>{ const g=S_.rel(F.dm,stEl(x.s)), fs=S_.favorable(F.st,g), fb=S_.favorable(F.st,S_.relBranch(F.dm,x.b)), wind=fs&&fb?'순풍':fs?'대체로 순풍':fb?'반반':'맞바람'; const now=age>=x.age&&age<x.age+10; return `<div class="du2 ${now?'now':''}"><span class="a">${x.age}~${x.age+9}세</span><span class="g" data-hj="0">${GAN[x.s]}${JI[x.b]}</span><span class="t">${DU_T2[g]}</span><span class="f">${wind}</span></div>`; }).join('');
  const cur=F.cur, nx=F.nxt, cg=S_.rel(F.dm,stEl(cur.s));
  return `<div class="doc"><div class="ch"><em>제7장</em><b>대운의 흐름</b><span>${D.fwd?'순행':'역행'} · ${D.start}세 시작</span></div>
   <p class="p">대운은 10년마다 바뀌는 큰 계절일세. 한 해의 운이 날씨라면 대운은 계절이라, 같은 비라도 봄비와 가을비가 다르듯 같은 해라도 어느 대운에서 맞느냐에 따라 뜻이 달라지네.</p>
   <div class="dul">${rows}</div>
   <p class="p"><b>지금은 ${GAN[cur.s]}${JI[cur.b]} 대운(${cur.age}~${cur.age+9}세)일세.</b> ${DU_T2[cg]}이네. 천간은 자네에게 ${S_.tgStem(F.dm,cur.s)}, 지지는 ${jo(S_.tgBranch(F.dm,cur.b),'이니','니')} ${SS[S_.tgStem(F.dm,cur.s)][S_.favorable(F.st,cg)?'good':'bad'].split('. ')[0]}. ${S_.favorable(F.st,cg)?'큰 흐름이 자네 사주를 받쳐 주는 10년일세.':'큰 흐름이 자네 사주에 버거운 10년이니, 속도보다 방향을 챙기게.'}${F.gong&&F.gong.includes(cur.b)?` 다만 대운의 지지 ${JI[cur.b]}는 자네 공망 자리라, 애쓴 만큼 손에 남지 않는다고 느낄 때가 있네. 이 10년은 결과보다 쌓이는 실력과 사람을 보게.`:''}</p>
   ${nx?`<p class="p"><b>다음은 ${GAN[nx.s]}${JI[nx.b]} 대운(${nx.age}세부터)일세.</b> ${DU_T2[S_.rel(F.dm,stEl(nx.s))]}이 기다리고 있네. ${(()=>{ const a=S_.favorable(F.st,S_.rel(F.dm,stEl(nx.s))), b=S_.favorable(F.st,S_.relBranch(F.dm,nx.b)); return a&&b?'천간과 지지가 모두 자네 편이라 한결 순한 바람이 부는 10년일세.':a||b?'반쯤은 자네 편인 바람이라, 고를 일과 버릴 일을 가리면 순하게 지나가네.':'자네 사주에 맞바람이 부는 10년이니, 지금부터 체력과 저축을 쌓아 두게.'; })()} ${age>=cur.age+8?'문턱이 가까우니 올해와 내년은 다음 10년을 준비하는 해로 쓰게.':'아직 시간이 있으니 지금 대운에서 거둘 것을 먼저 거두게.'}</p>`:''}</div>`; }
function faqDoc(DY){ const sc=k=>F.months.map((o,i)=>({i,v:areaScores(o)[k]})).sort((a,b)=>b.v-a.v), mm=i=>F.months[i].start.m+'월';
  const R=k=>{ const r=rankA(k); return [{i:r.top[0]},{i:r.top[1]}].concat(Array(8).fill({i:0}),[{i:r.low[1]},{i:r.low[0]}]); }; const w=R('work'), m=R('money'), l=R('love'), b=R('body'); const mv=F.months.map((o,i)=>({o,i})).filter(x=>x.o.ss.includes('역마')&&x.o.sc>=50).map(x=>mm(x.i));
  const dd=a=>a.length?a.map(x=>`${x.m}월 ${x.d}일`).join(', '):'따로 고른 날이 없네';
  const Q=[['올해 이직하거나 자리를 옮겨도 되겠습니까',`자리를 옮기기 좋은 달은 ${mm(w[0].i)}과 ${mm(w[1].i)}일세. 이 두 달에는 자리와 문서의 기운이 자네를 받쳐 주네.${mv.length?` 또 ${mv.join(', ')}에는 역마가 들어 움직임 자체가 순하네.`:''} 반대로 ${mm(w[11].i)}에는 결정을 미루고 실력을 다지게. 옮길지 말지는 운보다 조건이 먼저이니, 조건을 갖춘 뒤 좋은 달에 움직이게.`],
   ['돈은 언제 모이고 언제 새겠습니까',`돈이 붙는 달은 ${mm(m[0].i)}과 ${mm(m[1].i)}일세. 이때 들어온 돈의 절반은 바로 떼어 두게. 새기 쉬운 달은 ${mm(m[11].i)}과 ${mm(m[10].i)}이니, 이 두 달에는 보증과 투자, 충동적인 큰 지출을 쉬게. 계약과 문서는 ${dd(DY.deal)}이 좋네.`],
   ['좋은 인연은 언제 오겠습니까',`인연의 기운이 가장 짙은 달은 ${mm(l[0].i)}과 ${mm(l[1].i)}일세. 이 달에는 모임에 한 번 더 나가고, 먼저 연락하게. 고백이나 중요한 만남은 ${dd(DY.love)} 가운데서 고르면 좋네. ${mm(l[11].i)}에는 오해가 생기기 쉬우니 말보다 행동으로 마음을 보이게.`],
   ['이사나 큰 계약은 언제가 좋겠습니까',`이사는 자네 원국과 부딪히지 않는 ${dd(DY.move)}이 좋네. 계약과 서류는 ${dd(DY.deal)}에 하게. 어느 쪽이든 일지와 충이 드는 날은 피했으니, 날을 고른 뒤에는 준비에 마음을 쓰게.`],
   ['올해 몸은 어디를 아껴야 하겠습니까',`기운이 가장 낮은 달은 ${mm(b[11].i)}과 ${mm(b[10].i)}일세. 이 두 달에는 일정을 비우고 잠을 늘리게. 오행으로는 ${ORG[F.blank]} 쪽을 아끼라고 하네. 다만 이것은 기운의 균형을 본 것이지 진단이 아니니, 불편한 곳은 꼭 의사에게 보이게.`]];
  return `<div class="doc"><div class="ch"><em>제11장</em><b>자주 묻는 다섯 가지</b><span>감정서의 근거로 답하네</span></div>${Q.map(q=>`<div class="qa"><b>${q[0]}</b><p class="p">${q[1]}</p></div>`).join('')}</div>`; }
const ACT6=[ELX[0].acts.concat(['초록 잎이 보이는 자리에 앉기','아침 일찍 하루 시작하기','계획을 종이에 적어 두기']),ELX[1].acts.concat(['밝은 색 옷 한 벌 입기','좋아하는 사람에게 먼저 연락하기','낮에 햇볕 쬐기']),ELX[2].acts.concat(['흙 만지는 일 하나 하기','지출 장부 한 번 맞춰 보기','오래된 약속 하나 지키기']),ELX[3].acts.concat(['쓰는 물건 하나 손질하기','하루 할 일을 셋으로 줄이기','하기 싫은 일 먼저 끝내기']),ELX[4].acts.concat(['따뜻한 물로 하루 마무리하기','혼자 생각하는 시간 갖기','밤늦은 연락 줄이기'])];
function gaeunTable(){ const fav=favElsOf(); return `<table class="gil gun" data-hj="0"><tr><th>달</th><td><b>곁에 둘 기운</b></td></tr>${F.months.map((o,ix)=>{ const inM=[stEl(o.s),BR_EL[o.b]]; const e=fav.find(x=>!inM.includes(x)); const ex=ELX[e==null?F.blank:e]; return `<tr><th>${o.start.m}월 <small>${o.term}</small></th><td>${o.fill?`${ELX[F.blank].n} 기운이 저절로 들어 빈칸이 채워지는 달일세. 이달은 그 기운을 받아 쓰기만 하면 되네.<small>${ACT6[F.blank][ix%6]}</small>`:`${ex.n} 기운 · ${ex.color} · ${ex.dir}<small>${ACT6[e==null?F.blank:e][ix%6]}</small>`}</td></tr>`; }).join('')}</table>`; }
function monthGil(){ return `<table class="gil" data-hj="0"><tr><th>달</th><td><b>좋은 날</b> · <span style="color:var(--ink-3)">피할 날</span></td></tr>${F.months.map(o=>{ const D=monthDays(o); return `<tr><th>${o.start.m}월</th><td>${D.good.map(x=>`${dstr(x)} <em>${GAN[x.s]}${JI[x.b]}</em>`).join('<br>')||'-'}${D.bad.length?`<small>피할 날 · ${D.bad.map(x=>`${x.m}/${x.d} ${x.ch} 충`).join(' · ')}</small>`:''}</td></tr>`; }).join('')}</table>`; }

function build(){ const X0=window.SNF; const DY=goodDays(); const fg=F.st.strong?[1,2,3]:[0,4], favEls=fg.map(g=>(stEl(F.dm)+g)%5), needI=favEls.reduce((a,e)=>F.cnt[e]<F.cnt[a]?e:a,favEls[0]), need=ELX[needI], jh=F.johu;
  const H=[], JE=(window.MR2A&&MR2A.JEOL)||[];
  H.push(`<div class="aist noprint" id="aist" hidden></div>`);
  H.push(`<div class="doc ptoc"><div class="dh"><small>明理館 · 鑑定書 本文</small><h2>감정서 본문</h2><p>제 2027-${X0.docNo} 호 · 의뢰인 ${X0.name}</p></div><ol class="toc2">${['자네가 물은 것','타고난 그릇','대운의 흐름','2027 세운 정밀','열두 달 월운 감정','영역별 감정','자주 묻는 다섯 가지','소헌 선생의 권고','정미년 길일표','맺음말'].map((t,i)=>`<li><em>${i<9?'제'+(i+5)+'장':''}</em>${t}</li>`).join('')}</ol></div>`);
  H.push(glanceDoc());
  H.push(askDoc(DY));
  H.push(natureDoc());
  H.push(daeunDoc());
  H.push(`<div class="doc"><div class="ch"><em>제8장</em><b>2027 세운 정밀</b><span>정미(丁未) · 천간 ${F.ys.t1} · 지지 ${F.ys.t2} · 운성 ${F.ys.us}</span></div>${relTable()}<div style="margin-top:14px">${C.pan.map(p=>`<p class="p">${N(p)}</p>`).join('')}</div>
   <p class="p"><b>대운과 겹쳐 보면.</b> 올해는 ${GAN[F.cur.s]}${JI[F.cur.b]} 대운 위에 정미(丁未)가 얹히는 해일세. 대운의 천간 ${jo(S_.tgStem(F.dm,F.cur.s),'과','와')} 올해의 천간 ${jo(F.ys.t1,'이','가')} ${S_.rel(F.dm,stEl(F.cur.s))===S_.rel(F.dm,stEl(F.ys.s))?'같은 무리라 그 기운이 두 겹으로 커지네. 좋은 쪽이든 궂은 쪽이든 크게 느껴질 해이니 마음의 중심을 잡게.':'서로 다른 기운이라, 큰 계절과 올해의 날씨가 서로 보완하네. 한쪽으로 치우치지 않는 해일세.'}</p></div>`);
  H.push(`<div class="doc"><div class="ch"><em>제9장</em><b>열두 달 월운 감정</b><span>입춘 기준 절월 · 달마다 좋은 날과 피할 날</span></div><div class="mlist">${F.months.map((o,i)=>mrow(o,i,DY,JE[i])).join('')}</div><p class="capt">오른쪽 숫자는 그달 점수(100점 만점)일세. 붉은 달은 볕이 드는 달, 흐린 달은 걸음을 늦출 달이네. 달 이름을 누르면 접고 펼 수 있네.</p></div>`);
  H.push(`<div class="doc"><div class="ch"><em>제10장</em><b>영역별 감정</b><span>막대는 달마다의 점수 · 붉은 막대가 좋은 달</span></div>${AREAS.map(([k,l])=>areaBlock(k,l)).join('')}</div>`);
  H.push(faqDoc(DY));
  const bw=(i,t,g)=>{ const o=F.months[i]; return `<div class="bwr ${g?'good':'bad'}"><b>${o.start.m}월</b><div><p class="bt">${g?'볕이 드는 달':'걸음을 늦출 달'} · ${o.gz}월 · ${o.t1} · 운성 ${o.us}</p><p>${N(t)}</p></div></div>`; };
  H.push(`<div class="doc"><div class="ch"><em>제12장</em><b>소헌 선생의 권고</b></div><div class="bw">${Object.keys(C.best).map(i=>bw(+i,C.best[i],1)).join('')}${Object.keys(C.warn).map(i=>bw(+i,C.warn[i],0)).join('')}</div>
   <p class="p" style="margin-top:16px">자네 사주가 올해 가장 반기는 기운은 <b>${need.n}</b>일세. ${need.n} 기운을 곁에 두면 좋은 달은 더 좋아지고 궂은 달은 덜 궂어지네.${jh&&jh.need!=null?(jh.need!==needI?` 한편 자네는 ${hage(jh.why)}. ${need.n}이 자네 힘을 북돋운다면 ${ELX[jh.need].n}은 계절의 치우침을 덜어 주니, 둘을 함께 챙기게.`:` 계절로 봐도 자네는 ${hage(jh.why)}. 힘과 계절이 같은 기운을 가리키니 더 믿고 챙기게.`):''}</p>
   <div class="rx3"><div><small>곁에 둘 색</small><b>${need.color}</b></div><div><small>방위</small><b>${need.dir}</b></div><div><small>숫자</small><b>${need.num}</b></div></div><ol class="rxl">${need.acts.map(a=>`<li>${a}</li>`).join('')}</ol>
   <p class="p" style="margin-top:16px"><b>열두 달 개운표.</b> 달마다 들어오는 기운이 다르니, 그달에 모자란 쪽을 채우는 법을 적어 두었네.</p>${gaeunTable()}</div>`);
  const crow=(t,a,n)=>`<tr><th>${t}</th><td>${a.length?a.map(x=>`${dstr(x)} <em>${GAN[x.s]}${JI[x.b]}일</em>`).join('<br>'):'올해는 따로 고른 날이 없네'}<small>${n}</small></td></tr>`;
  H.push(`<div class="doc"><div class="ch"><em>제13장</em><b>정미년 길일표</b><span>자네 원국과 부딪히지 않는 날</span></div><table class="gil" data-hj="0">${crow('이사 · 집',DY.move,'일지 · 월지 · 년지와 충이 없고 사주가 반기는 날, 주말 위주')}${crow('계약 · 문서',DY.deal,'재물 · 자리 · 문서의 기운이 반기는 평일')}${crow('고백 · 만남',DY.love,'배우자 자리와 합이 들거나 인연의 별이 뜨는 날')}${crow('시험 · 면접',DY.exam,'자리와 배움의 기운이 반기는 날')}</table>
   <p class="p" style="margin-top:16px"><b>달마다 좋은 날과 피할 날.</b></p>${monthGil()}<p class="capt">손 없는 날 같은 민속 택일은 따로 보지 않았네. 더 정밀하게 고르려면 택일 메뉴를 쓰게.</p></div>`);
  H.push(`<div class="doc letter"><div class="ch"><em>맺음말</em><b>감정을 마치며</b></div>${C.letter.map(p=>`<p class="p">${N(p)}</p>`).join('')}<div class="sign"><span>${X0.td} · 명리관 감정인 소헌 선생</span><span class="gwan"><i>素</i><i>軒</i></span></div></div>`);
  H.push(`<div class="noprint mrbtn"><button type="button" class="go" id="mrSave">감정서 저장하기 (PDF)</button><button type="button" class="go ghost" id="mrAsk">감정서에 대해 소헌 선생에게 묻기</button></div>`);
  H.push(`<p class="note">${C.ai?'이 감정서는 만세력 계산 근거만 재료로 AI가 소헌 선생의 말투로 쓴 글입니다':'지금 보이는 글은 해석 사전으로 조립한 감정서입니다. 같은 근거로 AI가 소헌 선생의 말투로 더 길게 다시 써 드려요'}. 소헌 선생은 AI로 만든 가상의 명리가입니다.</p>`);
  return H.join(''); }

function letterRule(){ const mm=i=>F.months[i].start.m+'월', fg=F.st.strong?[1,2,3]:[0,4], favEls=fg.map(g=>(stEl(F.dm)+g)%5), needI=favEls.reduce((a,e)=>F.cnt[e]<F.cnt[a]?e:a,favEls[0]), need=ELX[needI], cur=F.cur, nx=F.nxt, age=F.age;
  const L=[`자네 감정서를 여기까지 썼네. 자네는 ${DM_HG[F.dm].split('일세.')[0]}일세. 올해 정미년은 자네에게 ${jo(F.ys.t1,'과','와')} ${jo(F.ys.t2,'이','가')} 드는 해이고, 자네는 지금 ${GAN[cur.s]}${JI[cur.b]} 대운을 걷고 있네.`,
   `올해 볕이 가장 잘 드는 달은 ${F.bestI.map(mm).join(', ')}일세. 큰 결정과 새 시작은 이 ${['','한','두','석','넉'][F.bestI.length]} 달에 몰아 두고, ${[...F.warnI].sort((a,b)=>a-b).map(mm).join('과 ')}에는 걸음을 늦추게. 늦춘다는 것은 멈춘다는 뜻이 아니라, 다음 볕을 위해 힘을 모은다는 뜻일세.`,
   `자네 사주가 가장 반기는 기운은 ${jo(need.n,'이네','네')}. ${need.color} 빛을 곁에 두고, ${need.acts[0]}부터 해 보게. 운은 큰일에서보다 매일 되풀이하는 작은 습관에서 먼저 움직이네.`,
   nx&&age>=cur.age+7?`${nx.age}세에는 ${GAN[nx.s]}${JI[nx.b]} 대운으로 넘어가네. 문턱 앞의 몇 해는 늘 어수선하니, 올해 거둔 것을 잘 갈무리해 다음 10년의 밑천으로 삼게.`:`지금 대운은 아직 갈 길이 남았네. 이 10년이 자네에게 주려는 것을 서두르지 말고 하나씩 받아 두게.`,
   '사주는 정답이 아니라 지도일세. 지도를 읽었으니 길은 자네가 고르게. 한 해를 걸어 보고 다시 오면, 그때 또 함께 짚어 봄세.'];
  return L; }
/* ---------- v3(10/4 아침): 자네가 물은 것 · 한눈에 보는 2027 · 무료 물음 미끼 ---------- */
const TQ={work:'올해 일과 자리는 어떻겠습니까',job:'올해 자리를 옮기거나 내 일을 시작해도 되겠습니까',money:'올해 돈은 언제 모이고 언제 새겠습니까',love:'올해 인연과 결혼은 어떻겠습니까',people:'올해 가족과 가까운 사람과는 어떻겠습니까',body:'올해 몸과 마음은 어디를 아껴야 하겠습니까',move:'올해 이사나 큰 계약은 언제가 좋겠습니까',exam:'올해 시험과 공부는 어떻겠습니까',flow:'올해 한 해의 흐름은 어떻겠습니까'};
const TL={work:'일과 자리',job:'이직 · 창업',money:'재물',love:'인연',people:'가족과 사람',body:'몸과 마음',move:'이사와 계약',exam:'시험과 공부',flow:'한 해의 흐름'};
const TG_OF={work:'w',job:'w',exam:'w',money:'m',love:'l',people:'p',body:'p',move:'v',flow:'f'};
const STRONG_US=['장생','관대','건록','제왕'], WEAK_US=['병','사','묘','절'];
function tScore(o,k){ const a=areaScores(o), has=(at,r)=>o.br.some(x=>x.at===at&&x.k===r);
  if(k==='job') return clamp(a.work+(o.ss.includes('역마')?6:0)+(has('월지','충')?3:0)+(o.g1===1&&o.f1?4:0));
  if(k==='move') return clamp(52+(o.ss.includes('역마')?9:0)+(o.f1?5:-3)+(o.f2?6:-4)+(has('일지','충')?-10:0)+(has('일지','육합')?5:0)+(o.ss.includes('공망')?-6:0));
  if(k==='exam') return clamp(52+(o.g1===4?(o.f1?14:5):0)+(o.g2===4?6:0)+(o.ss.includes('문창귀인')?8:0)+(o.ss.includes('화개')?4:0)+(STRONG_US.includes(o.us)?4:0)+(o.g1===1&&o.f1?3:0));
  if(k==='flow') return o.sc; return a[k]; }
const TPOS={job:o=>[o.ss.includes('역마')?'역마가 들어 움직임이 순하고':'',o.g1===3&&o.f1?'새 자리의 기운이 반기고':'',o.g1===1&&o.f1?'재주를 밖으로 펼칠 힘이 붙고':'',STRONG_US.includes(o.us)?`일간이 ${o.us}의 자리에 서고`:''],
 move:o=>[o.ss.includes('역마')?'역마가 들어 옮기는 일이 순하고':'',o.br.some(r=>r.at==='일지'&&r.k==='육합')?'사는 자리와 합이 들고':'',o.f2?'달의 지지가 자네 편이고':''],
 exam:o=>[o.g1===4?'문서와 배움의 기운이 들고':'',o.ss.includes('문창귀인')?'문창귀인이 들고':'',o.ss.includes('화개')?'홀로 파고드는 힘이 붙고':'',STRONG_US.includes(o.us)?`일간이 ${o.us}의 자리에 서고`:''],
 flow:o=>[o.f1&&o.f2?'천간과 지지가 모두 자네 편이고':o.f1?'천간이 자네 편이고':o.f2?'지지가 자네 편이고':'',STRONG_US.includes(o.us)?`일간이 ${o.us}의 자리에 서고`:'',o.fill?'모자란 기운이 채워지고':'']};
const TNEG={job:o=>[o.br.some(r=>r.at==='월지'&&r.k==='충')&&!o.f1?'일터 자리가 흔들려 성급해지기 쉽고':'',o.g1===3&&!o.f1?'책임이 버겁게 몰리고':'',WEAK_US.includes(o.us)?`일간이 ${o.us}의 자리라 힘이 낮고`:'',o.ss.includes('공망')?'공망이 걸려 기대만큼 남지 않고':''],
 move:o=>[o.br.some(r=>r.at==='일지'&&r.k==='충')?'사는 자리와 충이 걸리고':'',o.ss.includes('공망')?'공망이 걸려 헛걸음이 생기기 쉽고':'',!o.f2?'달의 지지가 자네에게 버겁고':''],
 exam:o=>[WEAK_US.includes(o.us)?`일간이 ${o.us}의 자리라 힘이 낮고`:'',o.g1===2&&!F.st.strong?'돈과 살림 걱정이 공부를 흩뜨리고':'',o.br.some(r=>r.k==='충')?'충이 걸려 마음이 바쁘고':''],
 flow:o=>[!o.f1&&!o.f2?'천간과 지지가 모두 자네에게 버겁고':'',WEAK_US.includes(o.us)?`일간이 ${o.us}의 자리라 힘이 낮고`:'',o.br.some(r=>r.at==='일지'&&r.k==='충')?'일지와 충이 걸리고':'']};
const tPos=(k,o)=>(TPOS[k]||AREA_POS[k==='job'?'work':k])(o), tNeg=(k,o)=>(TNEG[k]||AREA_NEG[k==='job'?'work':k])(o);
function tRank(k){ const idx=F.months.map((o,i)=>({i,v:tScore(o,k)})); const top=[...idx].sort((a,b)=>b.v-a.v||a.i-b.i).slice(0,2).map(x=>x.i), low=[...idx].sort((a,b)=>a.v-b.v||a.i-b.i).slice(0,2).map(x=>x.i); return {vals:idx.map(x=>x.v),top,low}; }
/* 사정(상황)에 맞춘 한 문단: 상황 × 물음 갈래(w 일 · m 돈 · l 인연 · p 사람 · v 이사) */
const STX={
 emp:{w:'지금 다니는 자리가 있으니, 옮기든 남든 먼저 이력과 성과를 글로 정리해 두게. 좋은 달에 그 종이가 자네 대신 말해 주네.',m:'월급이 있는 사람의 재물은 새는 구멍을 막는 데서 시작하네. 좋은 달에 들어온 상여와 부수입부터 따로 떼어 두게.',l:'일에 쫓겨 인연을 미루기 쉬운 처지일세. 좋은 달만큼은 퇴근 뒤 한 자리를 일부러 비워 두게.',p:'일터의 사람과 집안의 사람 사이에서 자네 힘이 나뉘기 쉽네. 늦출 달에는 일터 약속을 줄이고 집 쪽을 먼저 챙기게.',v:'출퇴근 길과 일터의 움직임을 함께 보고 날을 고르게. 계약서는 좋은 달 안에서도 평일 오전에 쓰는 편이 탈이 없네.'},
 seek:{w:'자리를 찾는 중이라면 좋은 달에 지원을 몰아서 내게. 그 전 달은 서류와 실력을 다듬는 달로 쓰면 되네.',m:'일을 찾는 동안의 재물은 지키는 것이 버는 것일세. 늦출 달에는 큰 지출과 빌려주는 돈을 쉬게.',l:'마음이 바쁜 때라 인연도 조급해지기 쉽네. 자리가 잡히는 달과 인연의 달이 겹치면 그때 마음을 열어도 늦지 않네.',p:'걱정해 주는 말이 잔소리로 들리기 쉬운 때일세. 좋은 달에 먼저 근황을 전하면 관계가 한결 가벼워지네.',v:'자리가 정해지기 전의 이사와 계약은 한 박자 늦추게. 일이 정해진 뒤 좋은 달 안에서 고르는 편이 낫네.'},
 own:{w:'내 일을 하는 사람에게 좋은 달은 새 거래와 새 상품을 내놓는 달일세. 늦출 달에는 넓히기보다 장부와 거래처를 정리하게.',m:'벌이가 고르지 않은 처지이니 좋은 달의 매출로 늦출 달을 버틸 몫을 미리 떼어 두게. 보증과 동업 약속은 특히 좋은 달 안에서만 하게.',l:'일과 사람이 한데 섞이기 쉬운 처지일세. 일로 만난 인연은 좋은 달에 일 밖의 자리에서 한 번 더 보게.',p:'함께 일하는 사람과의 돈 계산을 늘 분명히 해 두게. 늦출 달의 서운함은 대개 셈이 흐린 데서 오네.',v:'사무실이나 가게를 옮기는 일은 계약 날을 좋은 달 안에서 고르고, 늦출 달에는 집기와 서류만 준비하게.'},
 study:{w:'공부하는 사람에게 좋은 달은 시험과 원서를 내는 달일세. 늦출 달은 진도를 욕심내기보다 복습으로 다지는 달로 쓰게.',m:'용돈과 생활비를 달마다 정해 두면 늦출 달에도 마음이 흔들리지 않네.',l:'공부와 인연을 저울질하느라 둘 다 놓치기 쉽네. 좋은 달에는 사람을, 늦출 달에는 책을 먼저 두게.',p:'가족의 기대가 무겁게 느껴질 수 있는 해일세. 좋은 달에 계획을 먼저 말해 두면 걱정이 응원으로 바뀌네.',v:'시험 일정과 이사 날이 겹치지 않게 하게. 옮길 일이 있으면 시험이 끝난 뒤 좋은 달로 미루게.'},
 home:{w:'집안을 돌보는 사람에게도 일의 운은 있네. 좋은 달에 배우고 싶던 것을 시작하거나 작은 일을 맡아 보게.',m:'살림의 재물은 큰 지출의 시기를 고르는 데서 갈리네. 가전과 큰 장보기는 좋은 달로 미루게.',l:'가까운 사람과의 시간이 일상에 묻히기 쉽네. 좋은 달에는 둘만의 약속을 하나 잡아 두게.',p:'집안의 일을 혼자 짊어지기 쉬운 처지일세. 늦출 달에는 일을 나눠 달라고 먼저 말하게.',v:'집을 옮기는 일은 식구의 일정이 다 맞는 좋은 달 주말에서 고르게.'},
 rest:{w:'쉬어 가는 때는 다음 자리를 고르는 때이기도 하네. 좋은 달에 사람을 만나고, 늦출 달에는 몸과 실력을 채우게.',m:'들어오는 돈이 적은 때이니 나가는 돈의 순서를 정해 두게. 좋은 달에 작은 벌이라도 다시 길을 내 두면 좋네.',l:'마음에 여유가 생긴 때라 인연을 보는 눈도 넓어지네. 서두르지 말고 좋은 달에 편한 자리부터 나가 보게.',p:'쉬는 동안 연락이 끊긴 사람이 있으면 좋은 달에 먼저 안부를 전하게. 다음 자리는 대개 사람에게서 오네.',v:'쉬는 동안의 이사와 계약은 돈의 흐름을 먼저 맞춰 보고, 좋은 달 안에서 서두르지 말고 고르게.'}};
/* 분기 계획: 갈래별 네 단계(움직일 · 준비할 · 살필 · 다질) */
const QACT={w:['면접 · 제안 · 결정을 이 철에 몰아 두게','이력과 실력을 다듬고 사람을 넓혀 두게','맡은 일을 마무리하고 성과를 기록해 두게','큰 결정은 쉬고 체력과 기본기를 다지게'],
 m:['들어온 돈의 절반을 바로 떼고, 꼭 필요한 큰 지출은 이때 하게','지출 장부를 맞추고 다음 철의 목돈 계획을 세우게','고정비를 한 줄씩 점검하고 새는 구멍을 막게','보증 · 투자 · 빌려주는 돈을 쉬고 현금을 지키게'],
 l:['먼저 연락하고, 모임과 소개 자리에 한 번 더 나가게','관계에서 바라는 것을 스스로 정리해 두게','작은 서운함을 그날 풀고 약속을 지키게','큰 고백과 결정은 미루고 말보다 행동으로 마음을 보이게'],
 p:['미뤄 둔 사람을 만나고 도움을 청할 일은 이때 청하게','집안 일정과 안부를 미리 챙겨 두게','오가는 말에 날이 서지 않게 한 번 더 고르게','돈 거래와 큰 약속을 피하고 자네 몸부터 챙기게'],
 f:['큰 결정과 새 시작을 이 철에 몰아 두게','다음 철에 쓸 것을 미리 갖춰 두게','벌인 일을 거두고 다음 걸음을 살피게','넓히기보다 줄이고 몸과 살림을 다지게'],
 v:['계약과 이사의 날을 이 철 안에서 고르게','집과 조건을 둘러보고 서류를 미리 갖춰 두게','계약서의 조항을 다시 읽고 일정을 맞춰 두게','계약과 이사는 쉬고 짐과 살림을 줄여 두게']};
const QN=['봄','여름','가을','겨울'], QNM=['2~4월','5~7월','8~10월','11~1월'], QST=['움직일 때','준비할 때','살필 때','다질 때'];
function quarters(vals){ const q=[0,1,2,3].map(j=>vals.slice(j*3,j*3+3).reduce((a,b)=>a+b,0)/3); const ord=[0,1,2,3].sort((a,b)=>q[b]-q[a]); const st=[]; ord.forEach((j,r)=>st[j]=r===0?0:r===3?3:(j<ord[0]?1:2)); return q.map((v,j)=>({v:Math.round(v),st:st[j]})); }
const mIdx=x=>{ const t=Date.UTC(x.y,x.m-1,x.d,12); let r=-1; F.months.forEach((o,i)=>{ if(t>=Date.UTC(o.start.y,o.start.m-1,o.start.d,o.start.hh||0,o.start.mi||0)) r=i; }); return r; };
function tDays(k,DY,top,low){ const map={work:DY.deal,job:DY.deal,money:DY.deal,love:DY.love,move:DY.move,exam:DY.exam}; let a=(map[k]||[]).filter(x=>!low.includes(mIdx(x)));
  top.forEach(i=>{ if(a.length>=3) return; const g=monthDays(F.months[i]).good[0]; if(g&&!a.some(y=>y.m===g.m&&y.d===g.d)) a.push(g); });
  return a.slice(0,3).sort((p,q)=>p.y-q.y||p.m-q.m||p.d-q.d); }
/* 작은 차트(SVG) — 계산값으로 바로 그린다 */
function lineSvg(series,opt){ opt=opt||{}; const W=340,H=opt.h||150,L=10,R=10,T=18,B=24, n=12, x=i=>L+i*(W-L-R)/(n-1), y=v=>T+(1-(Math.max(20,Math.min(100,v))-20)/80)*(H-T-B);
  const base=y(55); let s=`<svg class="lsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${opt.label||'열두 달 흐름'}"><line x1="${L}" x2="${W-R}" y1="${base}" y2="${base}" class="bl"/><text x="${W-R}" y="${base-4}" text-anchor="end" class="bt">보통</text>`;
  series.forEach((sr,si)=>{ const pts=sr.v.map((v,i)=>[x(i),y(v)]); const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
    if(si===0&&!sr.dash) s+=`<path d="${d} L${x(n-1)} ${H-B} L${x(0)} ${H-B} Z" class="ar"/>`;
    s+=`<path d="${d}" class="ln ${sr.cls||''}"${sr.dash?' stroke-dasharray="4 3"':''}/>`;
    (sr.hi||[]).forEach(i=>{ s+=`<circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="4.5" class="hi"/>`; });
    (sr.lo||[]).forEach(i=>{ s+=`<circle cx="${pts[i][0]}" cy="${pts[i][1]}" r="4" class="lo"/>`; }); });
  if(!opt.nolab) F.months.forEach((o,i)=>{ s+=`<text x="${x(i)}" y="${H-8}" text-anchor="middle" class="ml">${o.start.m}</text>`; });
  return s+'</svg>'; }
function pentSvg(){ const C5=['#3f7d5a','#b8392b','#9a7128','#66707c','#2c5680'], NM=['목','화','토','금','수'], cx=90, cy=86, R=58, mx=Math.max(4,...F.cnt);
  const ang=i=>-Math.PI/2+i*2*Math.PI/5, pt=(i,r)=>[cx+r*Math.cos(ang(i)),cy+r*Math.sin(ang(i))];
  const fg=F.st.strong?[1,2,3]:[0,4], fav=fg.map(g=>(stEl(F.dm)+g)%5), needI=fav.reduce((a,e)=>F.cnt[e]<F.cnt[a]?e:a,fav[0]);
  let s=`<svg class="psvg" viewBox="0 0 180 176" role="img" aria-label="원국 오행 분포">`;
  [1,.66,.33].forEach(f=>{ s+=`<polygon points="${[0,1,2,3,4].map(i=>pt(i,R*f).join(',')).join(' ')}" class="pg"/>`; });
  [0,1,2,3,4].forEach(i=>{ const [a,b]=pt(i,R); s+=`<line x1="${cx}" y1="${cy}" x2="${a}" y2="${b}" class="pa"/>`; });
  s+=`<polygon points="${[0,1,2,3,4].map(i=>pt(i,R*Math.max(.08,F.cnt[i]/mx)).join(',')).join(' ')}" class="pv"/>`;
  [0,1,2,3,4].forEach(i=>{ const [a,b]=pt(i,R+15); s+=`<text x="${a}" y="${b+4}" text-anchor="middle" class="pl${i===needI?' nd':''}" style="fill:${C5[i]}">${NM[i]} ${F.cnt[i]}</text>`; });
  return s+'</svg>'; }
function glanceDoc(){ const fg=F.st.strong?[1,2,3]:[0,4], fav=fg.map(g=>(stEl(F.dm)+g)%5), needI=fav.reduce((a,e)=>F.cnt[e]<F.cnt[a]?e:a,fav[0]), mm=i=>F.months[i].start.m+'월';
  const tops=[...F.bestI], lows=[...F.warnI].sort((a,b)=>a-b), topics=(F.ask.topics||[]).filter(k=>TQ[k]);
  const series=[{v:F.months.map(o=>o.sc),hi:tops,lo:lows}].concat(topics.slice(0,2).map((k,j)=>({v:F.months.map(o=>tScore(o,k)),dash:1,cls:'t'+j})));
  const D=F.DU&&F.DU.list||[]; const du=D.length?`<div class="dub">${D.map(x=>{ const now=F.cur&&x.age===F.cur.age; const g=S_.rel(F.dm,stEl(x.s)), fs=S_.favorable(F.st,g), fb=S_.favorable(F.st,S_.relBranch(F.dm,x.b)); return `<div class="${now?'now':''} ${fs&&fb?'ok':fs?'most':fb?'half':'no'}"><i></i><small>${x.age}</small></div>`; }).join('')}</div><p class="dubc"><span class="ok"><i></i>순풍</span><span class="most"><i></i>대체로 순풍</span><span class="half"><i></i>반반</span><span class="no"><i></i>맞바람</span><span>검은 테가 지금 대운</span></p>`:'';
  return `<div class="doc glance"><div class="ch"><em>한눈에</em><b>한눈에 보는 2027</b><span>계산값으로 그린 그림</span></div>
   <div class="gt"><div><small>올해 점수</small><b>${F.ysc}</b><span>/100</span></div><div><small>볕이 가장 드는 달</small><b>${mm(F.months.map((o,i)=>i).sort((a,b)=>F.months[b].sc-F.months[a].sc)[0])}</b></div><div><small>반기는 기운</small><b>${ELX[needI].n}</b></div></div>
   <p class="gcap"><b>열두 달의 흐름.</b> 붉은 점은 볕이 드는 달, 빈 점은 걸음을 늦출 달일세.${topics.length?` 점선은 자네가 물은 ${topics.map(k=>TL[k]).reduce((x,y)=>jo(x,'과','와')+' '+y)}의 흐름이네.`:''}</p>${lineSvg(series,{label:'2027 열두 달 점수'})}
   ${topics.length?`<p class="lgd"><span class="m"><i></i>전체</span>${topics.slice(0,2).map((k,j)=>`<span class="t${j}"><i></i>${TL[k]}</span>`).join('')}</p>`:''}
   <div class="g2"><div>${pentSvg()}<p class="gcap c">원국의 오행 · 진한 이름이 자네가 반기는 기운</p></div><div class="gr"><p class="gcap"><b>대운 열 해씩.</b></p>${du}<p class="gcap">${F.cur?`지금은 ${GAN[F.cur.s]}${JI[F.cur.b]} 대운, ${F.cur.age}세부터 열 해일세.`:''}</p></div></div></div>`; }
function askDoc(DY){ const topics=(F.ask.topics||[]).filter(k=>TQ[k]), list=topics.length?topics:['flow'], st=F.ask.status, mm=i=>F.months[i].start.m+'월', dl=a=>a.map(x=>`${x.m}월 ${x.d}일 (${DOW[x.w]})`).join(', ');
  const ysG1=S_.rel(F.dm,stEl(F.ys.s)), duG=F.cur?S_.rel(F.dm,stEl(F.cur.s)):null;
  const GRP={work:[3,4],job:[3,1],exam:[4],money:[2],love:[F.male?2:3],people:[0,4],body:[0,4],move:[],flow:[]};
  const one=(k,n)=>{ const R=tRank(k), topS=[...R.top].sort((a,b)=>a-b), lowS=[...R.low].sort((a,b)=>a-b), avg=k==='flow'?(F.ysc>=70?60:F.ysc>=55?54:45):Math.round(R.vals.reduce((a,b)=>a+b,0)/12), g=TG_OF[k];
    const verdict=avg>=58?'올해는 이 물음에 볕이 넉넉한 해일세.':avg>=51?'때를 골라 움직이면 풀리는 해일세.':'서두르기보다 다지면서 때를 기다리는 해일세.';
    const base=k==='job'||k==='work'?AREA_BASE.work():k==='money'?AREA_BASE.money():k==='love'?AREA_BASE.love():k==='people'?AREA_BASE.people():k==='body'?AREA_BASE.body():k==='exam'?`자네 원국에서 배움의 기운(인성)은 ${F.cnt[(stEl(F.dm)+4)%5]}개일세. ${F.cnt[(stEl(F.dm)+4)%5]>=2?'배운 것이 몸에 잘 붙는 사주라 꾸준함이 곧 합격일세.':'배움의 기운이 적은 편이라 혼자 하기보다 틀이 있는 공부가 잘 맞네.'}`:k==='move'?`${F.natal.some(x=>x.k==='역마')?'자네 원국에는 역마가 있어 움직일 때 운이 트이는 사주일세.':'자네 원국에는 역마가 없어 자주 옮기기보다 한 번 옮길 때 제대로 고르는 편이 맞네.'}`:`자네는 ${F.st.label}한 사주이고, 올해 점수는 ${F.ysc}점일세.`;
    const yr=GRP[k]&&GRP[k].includes(ysG1)?`올해 천간 ${F.ys.t1}${bt(F.ys.t1)?'이':'가'} 바로 이 물음의 기운이라, 한 해 내내 이 일이 마음에 걸리고 그만큼 움직임도 크네.`:`올해의 기운은 ${jo(F.ys.t1,'과','와')} ${jo(F.ys.t2,'이라','라')}, 이 물음은 한 해 전체보다 달을 골라 푸는 편이 맞네.`;
    const du=F.cur?(GRP[k]&&GRP[k].includes(duG)?`지금 대운도 이 물음과 같은 기운이라 올해의 결정이 열 해를 좌우하네.`:`지금 ${GAN[F.cur.s]}${JI[F.cur.b]} 대운은 ${DU_T2[duG]}이니, 이 물음도 그 큰 흐름 안에서 보게.`):'';
    const Q=quarters(R.vals), days=tDays(k,DY,R.top,R.low);
    return `<div class="tqa"><p class="tq"><span>${k==='flow'?'물음':'물음 '+['하나','둘'][n]}</span>${TQ[k]}</p>
     <p class="vd">${topS.map(mm).join('과 ')}에 움직이고, ${lowS.map(mm).join('과 ')}에는 걸음을 늦추게. ${verdict}</p>
     ${lineSvg([{v:R.vals,hi:R.top,lo:R.low}],{h:132,label:TL[k]+' 열두 달'})}
     <p class="p"><b>왜 그렇게 보는가.</b> ${base} ${yr} ${du}</p>
     <p class="p"><b>볕이 드는 달.</b> ${pair(topS,i=>why(tPos(k,F.months[i]),'사주가 반기는 기운이 드네'))} <b>걸음을 늦출 달.</b> ${pair(lowS,i=>why(tNeg(k,F.months[i]),'사주가 반기지 않는 기운이 드네'))}</p>
     ${st&&STX[st]?`<p class="p"><b>자네 사정에 대어 보면.</b> ${STX[st][g]||STX[st].w}</p>`:''}
     <table class="qp" data-hj="0">${Q.map((q,j)=>`<tr class="s${q.st}"><th>${QN[j]}<small>${QNM[j]}</small></th><td><b>${QST[q.st]}</b>${QACT[g][q.st]}</td></tr>`).join('')}</table>
     ${days.length?`<p class="p"><b>고른 날.</b> ${dl(days)}. 자네 원국과 부딪히지 않고 이 물음의 기운이 반기는 날일세.</p>`:''}</div>`; };
  const w=F.ask.worry;
  const wq=w?`<div class="wq"><small>자네가 적은 사연</small><p>${String(w).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</p></div>${C.qa&&C.qa.length?C.qa.map(p=>`<p class="p">${N(p)}</p>`).join(''):(()=>{ const k0=list[0], R0=tRank(k0), t0=[...R0.top].sort((a,b)=>a-b), l0=[...R0.low].sort((a,b)=>a-b), Q0=quarters(R0.vals), pq=Q0.findIndex(q=>q.st===1); return `<p class="p">사연은 잘 읽었네. ${TL[k0]} 쪽으로 보면 ${t0.map(mm).join('과 ')}에 마음을 정하고, ${l0.map(mm).join('과 ')}에는 결정을 서두르지 말게.${pq>=0?` ${QN[pq]}(${QNM[pq]})에는 ${QACT[TG_OF[k0]][1]}.`:''}</p><p class="p">마음이 둘로 갈릴 때는 얻는 것과 잃는 것을 종이에 나란히 적어 두고, 좋은 달에 다시 펴 보게. 운은 때를 알려 줄 뿐, 고르는 것은 자네일세. 더 깊이 묻고 싶은 대목은 아래 '소헌 선생에게 묻기'에서 이 사연을 그대로 물어보게.</p>`; })()}`:'';
  return `<div class="doc askd"><div class="ch"><em>제6장</em><b>자네가 물은 것</b><span>${topics.length?'의뢰서에 적은 물음부터 답하네':'물음을 고르지 않아 한 해의 흐름부터 답하네'}</span></div>${list.map(one).join('')}${wq}</div>`; }
/* 무료 미끼: 물음의 실마리만 보이고 답은 봉투 안에 */
function teaserHTML(){ const topics=(F.ask.topics||[]).filter(k=>TQ[k]), list=topics.length?topics:['flow'], half=i=>i<6?'상반기':'하반기';
  const one=k=>{ const R=tRank(k), t=[...R.top].sort((a,b)=>a-b); const sameHalf=half(t[0])===half(t[1]);
    return `<div class="tz"><p class="tq">${TQ[k]}</p>${lineSvg([{v:R.vals}],{h:96,nolab:1,label:TL[k]+' 흐름'})}<p class="p">자네가 물은 ${TL[k]}, 볕이 드는 달은 두 번 오네. ${sameHalf?`두 달 모두 ${half(t[0])}에 있네.`:`한 번은 상반기, 한 번은 하반기에 있네.`} 몇 월 며칠인지, 그달에 무엇을 하고 무엇을 미룰지는 봉투 안 첫 장에 적어 두었네.</p></div>`; };
  const w=F.ask.worry;
  return `<div class="ch"><em>물음</em><b>자네가 물은 것</b><span>실마리만 먼저 보이네</span></div>${list.map(one).join('')}${w?`<p class="p">적어 준 사연도 읽었네. 그 사연에는 봉투 안에서 따로 답하겠네.</p>`:''}`; }

/* 잠금 미리보기: 그 사람의 실제 본문 첫머리만 보이고 나머지는 섞어서 흐리게(본문은 화면에 싣지 않음) */
const scramble=t=>{ const a=[...t].filter(c=>/\S/.test(c)); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } let k=0; return [...t].map(c=>/\S/.test(c)?a[k++]:c).join(''); };
function peekHTML(){ const keep=C; C=ruleCopy(); const DY=goodDays(); const tmp=document.createElement('div'); tmp.innerHTML=build(); C=keep;
  const len=tmp.textContent.replace(/\s+/g,'').length, figs=tmp.querySelectorAll('svg').length+tmp.querySelectorAll('.abar').length, tabs=tmp.querySelectorAll('table').length;
  const days=F.months.reduce((a,o)=>a+monthDays(o).good.length,0)+Object.values(DY).reduce((a,x)=>a+x.length,0);
  const topics=(F.ask.topics||[]).filter(k=>TQ[k]), k=topics[0]||'flow', d=tmp.querySelector('.askd .tqa'), first=d?d.querySelector('.p'):null;
  const lead=first?first.textContent.replace(/^왜 그렇게 보는가\.\s*/,'').split(/(?<=[일네]세?\.)\s/)[0]:'';
  const rest=d?[...d.querySelectorAll('.vd,.p')].slice(0,4).map(e=>e.textContent).join(' '):'';
  const man=n=>{ const m=Math.floor(n/10000), c=Math.round((n%10000)/1000); return m?`약 ${m}만${c?` ${c}천`:''} 자`:`약 ${c}천 자`; };
  return `<div class="pk"><div class="ch"><em>제5장</em><b>자네가 물은 것</b></div><p class="tq">${TQ[k]}</p><p class="p"><b>왜 그렇게 보는가.</b> ${lead}</p></div>
   <div class="blw"><div class="bl"><p class="vd">${scramble(rest.slice(0,60))}</p>${lineSvg([{v:F.months.map(o=>tScore(o,k))}],{h:110,nolab:1})}<p class="p">${scramble(rest.slice(60,420))}</p></div>
   <div class="ov"><b>감정서 본문 · 제5장부터 제13장</b><span class="stat">${man(len)} · 그림과 표 ${figs+tabs}개 · 고른 날 ${days}일</span><small>자네가 물은 것의 답 · 한눈에 보는 2027<br>타고난 그릇 · 대운 · 세운 정밀 · 열두 달 월운<br>영역별 감정 · 권고 · 길일표</small></div></div>`; }
function prepF(){ const X0=window.SNF; F=window.Prem2Core.build(S_,X,X0.inp); F.male=X0.inp.g==='m'; F.ysc=X0.ys; F.ask=X0.ask||{topics:[],status:'',worry:''};
  const s=[...F.months.map((o,i)=>({o,i}))].sort((a,b)=>b.o.sc-a.o.sc); F.bestI=s.slice(0,3).map(x=>x.i).sort((a,b)=>a-b); F.warnI=s.slice(-2).map(x=>x.i); return F; }
const CSS3=`.glance .gt{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--ink);border-bottom:1px solid var(--ink);margin:6px 0 14px}
.glance .gt div{padding:12px 4px;text-align:center}.glance .gt div+div{border-left:1px solid var(--rule-2)}
.glance .gt small{display:block;font-size:11px;color:var(--ink-3);font-weight:700}.glance .gt b{font-family:var(--serif);font-size:24px;font-weight:900;color:var(--seal)}.glance .gt span{font-size:11px;color:var(--ink-3)}
.gcap{margin:0 0 6px;font-size:12.5px;line-height:1.6;color:var(--ink-2)}.gcap.c{text-align:center;margin-top:-4px}
.lsvg{display:block;width:100%;height:auto;margin:2px 0 8px}.lsvg .bl{stroke:var(--rule);stroke-dasharray:2 3}.lsvg .bt{font-size:9px;fill:var(--ink-3)}
.lsvg .ar{fill:var(--seal);opacity:.07}.lsvg .ln{fill:none;stroke:var(--ink);stroke-width:1.8;stroke-linejoin:round}.lsvg .ln.t0{stroke:var(--seal);stroke-width:1.5}.lsvg .ln.t1{stroke:var(--water);stroke-width:1.5}
.lsvg .hi{fill:var(--seal)}.lsvg .lo{fill:var(--sheet);stroke:var(--ink-3);stroke-width:1.5}.lsvg .ml{font-size:10px;fill:var(--ink-3)}
.lgd{display:flex;gap:14px;margin:0 0 12px;font-size:11.5px;color:var(--ink-2)}.lgd i{display:inline-block;width:16px;height:0;border-top:2px solid var(--ink);vertical-align:middle;margin-right:5px}.lgd .t0 i{border-top:2px dashed var(--seal)}.lgd .t1 i{border-top:2px dashed var(--water)}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start;border-top:1px solid var(--rule-2);padding-top:12px}
.psvg{display:block;width:100%;height:auto}.psvg .pg{fill:none;stroke:var(--rule-2)}.psvg .pa{stroke:var(--rule-2)}.psvg .pv{fill:var(--seal);fill-opacity:.16;stroke:var(--seal);stroke-width:1.5}
.psvg .pl{font-size:11.5px;font-weight:500;font-family:var(--serif)}.psvg .pl.nd{font-weight:900;font-size:13px}
.dub{display:grid;grid-template-columns:repeat(9,1fr);gap:2px;margin:4px 0 6px}.dub div{text-align:center}.dub i{display:block;height:22px;background:var(--ink-3);opacity:.35}
.dub .ok i{background:var(--seal);opacity:.8}.dub .most i{background:var(--seal);opacity:.4}.dub .half i{background:var(--earth);opacity:.5}.dub .now i{outline:2px solid var(--ink);outline-offset:1px}.dub small{font-size:9.5px;color:var(--ink-3)}
.dubc{display:flex;flex-wrap:wrap;gap:4px 10px;margin:0 0 8px;font-size:10.5px;color:var(--ink-3)}.dubc i{display:inline-block;width:9px;height:9px;margin-right:3px;vertical-align:-1px;background:var(--ink-3);opacity:.35}.dubc .ok i{background:var(--seal);opacity:.8}.dubc .most i{background:var(--seal);opacity:.4}.dubc .half i{background:var(--earth);opacity:.5}
.tqa{padding:4px 0 16px}.tqa+.tqa{border-top:1px solid var(--rule);padding-top:16px}
.tq{margin:0 0 6px;font-family:var(--serif);font-size:16px;font-weight:900;line-height:1.5}.tq span{display:block;font-size:11px;letter-spacing:.14em;color:var(--seal);margin-bottom:2px}
.vd{margin:0 0 8px;padding:10px 12px;background:var(--seal-bg);border-left:3px solid var(--seal);font-family:var(--serif);font-size:15px;font-weight:700;line-height:1.65}
table.qp{width:100%;border-collapse:collapse;margin:6px 0 10px;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.qp th{width:62px;padding:9px 0;text-align:left;vertical-align:top;font-family:var(--serif);font-size:14px;border-bottom:1px solid var(--rule-2)}.qp th small{display:block;font-size:10.5px;font-weight:500;color:var(--ink-3)}
.qp td{padding:9px 0;font-size:13.5px;line-height:1.6;border-bottom:1px solid var(--rule-2)}.qp td b{display:block;font-size:12px;color:var(--ink-3)}.qp tr.s0 td b,.qp tr.s0 th{color:var(--seal)}
.wq{margin:16px 0 10px;padding:12px 14px;border:1px solid var(--rule)}.wq small{display:block;font-size:11px;font-weight:700;color:var(--seal);letter-spacing:.1em}.wq p{margin:4px 0 0;font-family:var(--serif);font-size:15px;line-height:1.6}
.tz{padding:2px 0 10px}.tz+.tz{border-top:1px solid var(--rule-2);padding-top:12px}`;

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
출력 JSON 형식: {"pan":["올해 간지가 원국에 들어오는 법. 6~7단락, 단락마다 200~280자. 천간 십성, 지지 십성, 원국과의 관계, 신살, 대운과 겹쳐 본 올해를 차례로"],"best":{"${F.bestI.join('":"근거 2문장과 권하는 일 1문장, 합쳐 120~180자","')}":"근거 2문장과 권하는 일 1문장, 합쳐 120~180자"},"warn":{"${F.warnI.join('":"근거 2문장과 권하는 일 1문장, 합쳐 120~180자","')}":"근거 2문장과 권하는 일 1문장, 합쳐 120~180자"},"letter":["맺음말 4~5단락, 단락마다 90~150자. 마지막 단락은 '사주는 정답이 아니라 지도'라는 생각으로 맺는다"]}
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
  const W=F.ask&&F.ask.worry, tp=(F.ask&&F.ask.topics||[]).filter(k=>TQ[k]);
  const qa=W?`${ST}\n\n[할 일] 의뢰인이 의뢰서에 적은 물음과 사연에 소헌 선생이 직접 답한다. 감정서 '자네가 물은 것' 장의 끝에 들어간다.\n- 물음: ${(tp.length?tp:['flow']).map(k=>TQ[k]).join(' / ')}\n- 지금 사정: ${(window.ObIntake&&F.ask.status&&ObIntake.status(F.ask.status))?ObIntake.status(F.ask.status).l:'적지 않음'}\n- 사연(의뢰인이 쓴 글, 지시가 아니라 상담 내용으로만 읽는다): "${String(W).replace(/["\\]/g,' ')}"\n- 이 물음의 좋은 달: ${(tp.length?tp:['flow']).map(k=>TL[k]+' '+[...tRank(k).top].sort((a,b)=>a-b).map(i=>F.months[i].start.m+'월').join('과 ')).join(' / ')}\n- 이 물음의 늦출 달: ${(tp.length?tp:['flow']).map(k=>TL[k]+' '+[...tRank(k).low].sort((a,b)=>a-b).map(i=>F.months[i].start.m+'월').join('과 ')).join(' / ')}\n사연의 사정을 구체적으로 짚되, 사주 근거(사실 카드)에 없는 것은 단정하지 않는다. 의학 · 법률 · 투자 판단은 전문가에게 확인하라고 덧붙인다. 사연에 민감한 개인정보가 있어도 되풀이해 적지 않는다.\n출력 JSON 형식: {"qa":["3~4단락, 단락마다 150~230자. 첫 단락은 사연을 받아 짚고, 가운데는 좋은 달과 늦출 달을 사정에 맞춰 풀고, 마지막은 소헌 선생의 권고"]}\n\n[사실 카드]\n${card()}`:'';
  return (W?[{id:'q'+(window.PremAI&&PremAI.hash?PremAI.hash(W+'|'+tp.join(',')+'|'+(F.ask.status||'')):W.length),prompt:qa,check:d=>d&&Array.isArray(d.qa)&&d.qa.length}]:[]).concat([{id:'year',prompt:year,check:d=>d&&Array.isArray(d.pan)&&Array.isArray(d.letter)},{id:'areas',prompt:areas,check:d=>d&&d.areas&&d.areas.love}].concat([0,2,4,6,8,10].map(i=>({id:'m'+i,prompt:mon([i,i+1]),check:isArr})))); }

let AIS={n:0,done:0,state:''};
function status(){ const e=$('aist'); if(!e) return; const m={run:`<i></i><span>소헌 선생이 감정서를 쓰는 중이네 · ${AIS.done}/${AIS.n}</span><small>다 쓰기 전까지는 초안이 먼저 보여요. 1분 안팎 걸려요</small>`,fail:'<span>지금은 AI 원고를 받을 수 없어 초안으로 보여 드려요</span>',limit:'<span>오늘 체험판 풀이 횟수를 다 썼어요</span><small>내일 다시 열면 이어서 써 드려요</small>',off:'<span>이 화면에서는 초안만 보여요</span><small>claude.ai 체험판이나 정식 서비스에서는 이 근거로 소헌 선생이 감정서를 길게 써 드려요</small>'}[AIS.state];
  if(m){ e.hidden=false; e.innerHTML=m; } else e.hidden=true; }
function rerender(){ const host=$('prem'); const open=[...host.querySelectorAll('.mr.open')].map(e=>e.dataset.i); const sc=host.closest('.scr'), y=sc?sc.scrollTop:0;
  host.innerHTML=build(); open.forEach(i=>{ const r=host.querySelector(`.mr[data-i="${i}"]`); if(r) r.classList.add('open'); }); if(sc) sc.scrollTop=y; status(); }
function startAI(){ if(!window.PremAI) return; const P=prompts();
  window.PremAI.run({key:F.key+'-mr2027',ver:'v2',parts:P,
   onStart:n=>{ AIS={n,done:0,state:'run'}; status(); },
   onPart:(id,d,fromCache)=>{ if(id[0]==='q'&&d&&d.qa){ C.qa=d.qa; } else if(id==='year'||id==='areas'){ ['pan','areas','letter'].forEach(k=>{ if(d[k]) C[k]=d[k]; }); if(d.best) C.best=Object.fromEntries(Object.entries(d.best).map(([k,v])=>[+k,v])); if(d.warn) C.warn=Object.fromEntries(Object.entries(d.warn).map(([k,v])=>[+k,v])); }
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
.du2{display:grid;grid-template-columns:70px 40px 1fr 62px;gap:6px;align-items:center;padding:9px 2px;border-bottom:1px solid var(--rule-2);font-size:13px}
.du2 .g{font-family:var(--serif);font-weight:900;font-size:15px}.du2 .f{text-align:right;font-size:12px;color:var(--ink-3)}.du2.now{background:var(--seal-bg)}.du2.now .a{color:var(--seal);font-weight:700}
.ar2{padding:16px 0;border-top:1px solid var(--rule)}.ch+.ar2{border-top:0;padding-top:0}
.arh{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px}.arh b{font-family:var(--serif);font-size:17px;font-weight:900}.arh span{font-size:12px;color:var(--ink-3)}
.abar{display:grid;grid-template-columns:repeat(12,1fr);gap:4px;height:84px;align-items:end;margin:0 0 14px;padding-bottom:16px;position:relative}
.abar div{position:relative;height:100%;display:flex;align-items:flex-end}.abar i{display:block;width:100%;background:var(--ink-3);opacity:.45}.abar .hi i{background:var(--seal);opacity:1}
.abar small{position:absolute;left:0;right:0;bottom:-16px;text-align:center;font-size:10px;color:var(--ink-3)}
.qa{padding:14px 0;border-top:1px solid var(--rule-2)}.ch+.qa{border-top:0;padding-top:0}.qa>b{display:block;font-family:var(--serif);font-size:15.5px;font-weight:900;margin-bottom:6px}.qa>b:before{content:'問 ';color:var(--seal)}
.gun th small{display:block;font-size:11px;color:var(--ink-3);font-weight:500}
@media print{.mrb{display:block!important}.mrh{pointer-events:none}}`;
window.MRPrem={peek(host){ if(!host||!window.SNF) return; prepF(); host.innerHTML=peekHTML(); },
 teaser(host){ if(!host||!window.SNF) return; if(!document.getElementById('mrCss')){ const s=document.createElement('style'); s.id='mrCss'; s.textContent=CSS+CSS3; document.head.appendChild(s); } prepF(); host.innerHTML=teaserHTML(); host.hidden=false; },
 open(){ const host=$('prem'); const X0=window.SNF; if(!host||!X0) return;
  if(!document.getElementById('mrCss')){ const s=document.createElement('style'); s.id='mrCss'; s.textContent=CSS+CSS3; document.head.appendChild(s); }
  prepF(); C=ruleCopy(); if(window.HJ) C=HJ.glAll(C);
  const dl=a=>a.map(x=>`${x.m}월 ${x.d}일`).join('과 ');
  F.bestI.forEach(i=>{ const o=F.months[i], a=SS[o.t1], D=monthDays(o); C.best[i]=`${a.good} 이달에는 ${a.do}를 권하네.${D.good.length?` 날을 고른다면 ${dl(D.good)}이 좋네.`:''}`; });
  F.warnI.forEach(i=>{ const o=F.months[i], a=SS[o.t1], D=monthDays(o); C.warn[i]=`${a.bad}${a.bad.includes(a.avoid.slice(0,4))?'':` 삼갈 일은 ${a.avoid}일세.`}${D.bad.length?` 특히 ${dl(D.bad)}은 큰일을 피하게.`:''}`; });
  if(!C.ai) C.letter=letterRule();
  AIS={n:0,done:0,state:''}; host.innerHTML=build(); host.hidden=false; const lk=$('dLock'); if(lk) lk.hidden=true; if(!host._b){ bind(host); host._b=1; }
  host.querySelectorAll('.mr').forEach(r=>r.classList.add('open')); startAI(); }};
})();
