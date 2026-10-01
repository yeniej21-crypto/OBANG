/* 2027 신년운세 프리미엄 v2 — 할매의 열두 달 상세 풀이 (입춘 기준 절월)
   계산: saju.js + saju_x.js + prem2_core.js → 사실 카드
   원고: PREM2_SAMPLE[key]가 있으면 완성본(AI 원고), 없으면 해석 사전으로 조립한 초안
   보기: 월별 / 항목별 전환. 오방사주 장치: 할매 장부 · 이달의 당번 신 · 빈칸 채움 */
(function(){
const S_=window.Saju, X=window.SajuX, {GAN,JI,EL,stEl,BR_EL}=S_;
const $=id=>document.getElementById(id);
const bt=w=>{ const c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28>0; };
const SS={
 비견:{w:'동료',k:'나란히 선 사람',good:'같은 편이 생기는 기운입니다. 혼자 끌던 일을 나눠 들 사람이 나타나고, 내 뜻을 밀고 나갈 배짱도 붙습니다.',bad:'내 몫을 나눠야 하는 기운입니다. 고집이 세지고 비슷한 사람과 부딪히기 쉬우니 공과 돈의 경계를 먼저 정하십시오.',love:['편한 친구 같은 인연이 가까워집니다','연인과 주도권 다툼이 생기기 쉽습니다'],money:['함께 벌면 커지는 흐름입니다','나눠 쓸 일이 많아 지갑이 얇아집니다'],work:['협업과 팀 일이 잘 풀립니다','경쟁자가 늘어 성과를 지켜야 합니다'],do:'믿을 만한 사람과 손잡기',avoid:'동업과 보증을 말로만 정하기'},
 겁재:{w:'승부',k:'뺏고 뺏기는 판',good:'승부욕이 올라 밀어붙이는 힘이 생깁니다. 경쟁이 있는 자리에서 오히려 이깁니다.',bad:'돈과 사람이 함께 새기 쉬운 기운입니다. 충동적인 지출과 무리한 승부를 조심하십시오.',love:['적극적으로 다가가면 결과가 납니다','삼각관계나 질투가 끼어들기 쉽습니다'],money:['과감하게 움직이면 몫을 챙깁니다','빌려준 돈은 돌아오기 어렵습니다'],work:['경쟁 자리와 시험에서 힘을 냅니다','동료와 공을 다투게 됩니다'],do:'목표 하나에 힘 모으기',avoid:'충동구매와 돈 거래'},
 식신:{w:'재주',k:'먹고 사는 재주',good:'재주가 손에 붙고 일이 즐거워지는 기운입니다. 만들고 표현하는 일이 결과로 이어지고, 먹고 사는 걱정이 줄어듭니다.',bad:'몸이 편한 쪽으로만 기울기 쉬운 기운입니다. 미루던 일이 쌓이고 먹는 것으로 마음을 달래기 쉽습니다.',love:['편안하고 다정한 연애가 이어집니다','관계가 늘어지고 설렘이 줄어듭니다'],money:['재능이 수입으로 이어집니다','소소한 지출이 쌓입니다'],work:['기획과 창작, 손으로 만드는 일이 빛납니다','속도가 느려져 마감을 놓치기 쉽습니다'],do:'꾸준히 만들어 내보이기',avoid:'게으름과 과식'},
 상관:{w:'표현',k:'말과 재치',good:'말솜씨와 순발력이 살아나는 기운입니다. 남다른 생각이 눈에 띄고, 틀을 깨는 시도가 박수를 받습니다.',bad:'말이 칼이 되기 쉬운 기운입니다. 윗사람이나 규칙과 부딪히고, 한마디 때문에 공든 탑이 흔들릴 수 있습니다.',love:['매력이 드러나 인연이 먼저 다가옵니다','말 한마디로 관계가 틀어지기 쉽습니다'],money:['아이디어가 돈이 됩니다','기분 따라 쓰는 돈이 큽니다'],work:['발표와 영업, 콘텐츠에서 두각을 냅니다','상사와의 마찰, 계약 조건 다툼을 조심하십시오'],do:'생각을 글과 말로 꺼내 보이기',avoid:'홧김에 하는 말과 퇴사'},
 편재:{w:'확장',k:'크게 도는 돈',good:'활동 무대가 넓어지고 큰돈이 오가는 기운입니다. 사람을 많이 만날수록 기회가 붙고, 사업 감각이 살아납니다.',bad:'돈이 크게 들어오는 만큼 크게 나가는 기운입니다. 투자와 보증, 한 방을 노리는 선택은 한 번 더 따져 보십시오.',love:['만남의 폭이 넓어지고 인기가 오릅니다','가벼운 만남이 많아 마음이 흩어집니다'],money:['부수입과 사업 기회가 들어옵니다','큰 지출과 투자 손실을 조심하십시오'],work:['영업과 사업, 출장이 잘 풀립니다','일을 벌이기만 하고 마무리가 약해집니다'],do:'판을 넓히되 장부 꼼꼼히 쓰기',avoid:'한 방을 노리는 투자'},
 정재:{w:'저축',k:'차곡차곡 모이는 돈',good:'성실하게 쌓은 만큼 돌아오는 기운입니다. 월급과 저축, 살림이 안정되고 계산이 정확해집니다.',bad:'돈 걱정이 마음을 붙잡는 기운입니다. 아끼느라 기회를 놓치거나, 작은 돈 때문에 사람을 잃지 않게 하십시오.',love:['안정적이고 현실적인 인연이 들어옵니다','계산이 앞서 마음이 식기 쉽습니다'],money:['저축과 고정 수입이 늘어납니다','예상 못 한 생활비가 새어 나갑니다'],work:['꼼꼼한 일처리로 신뢰를 얻습니다','반복되는 일에 지치기 쉽습니다'],do:'통장과 지출을 매주 들여다보기',avoid:'작은 돈에 매달려 큰 기회 놓치기'},
 편관:{w:'돌파',k:'몰아치는 일',good:'어려운 과제를 돌파하는 힘이 생기는 기운입니다. 압박 속에서 실력이 드러나고, 큰일을 맡아 이름을 얻습니다.',bad:'일과 책임이 한꺼번에 몰아치는 기운입니다. 몸과 마음이 지치기 쉬우니 맡을 일과 거절할 일을 가르십시오.',love:['강렬하게 끌리는 인연이 나타납니다','상대에게 휘둘리거나 지치는 관계를 조심하십시오'],money:['책임만큼 보상이 따라옵니다','급한 일로 목돈이 나갑니다'],work:['승진이나 발탁처럼 무거운 자리가 옵니다','과로와 윗선의 압박을 조심하십시오'],do:'어려운 일 하나를 끝까지 해내기',avoid:'무리한 일정과 밤샘'},
 정관:{w:'인정',k:'자리와 이름',good:'인정받고 자리가 생기는 기운입니다. 합격과 승진, 계약처럼 이름이 올라가는 일이 따르고 믿음직한 사람이 곁에 섭니다.',bad:'지켜야 할 규칙과 체면이 늘어나는 기운입니다. 남의 눈을 의식하다 내 뜻을 접지 않게 하십시오.',love:['진지한 만남, 결혼 이야기가 오갑니다','틀에 맞추느라 관계가 답답해집니다'],money:['안정된 수입과 계약이 들어옵니다','체면 때문에 쓰는 돈이 늘어납니다'],work:['평가와 승진, 자격에서 좋은 결과가 납니다','책임이 커져 작은 실수에도 엄격해집니다'],do:'공식적인 자리에 나를 드러내기',avoid:'눈치 보느라 할 말 삼키기'},
 편인:{w:'공부',k:'혼자 깊어지는 생각',good:'직관이 예리해지고 남다른 공부가 붙는 기운입니다. 혼자 파고드는 일, 특별한 기술을 익히기에 좋습니다.',bad:'생각이 많아지고 마음이 혼자 깊어지는 기운입니다. 걱정이 실행을 붙잡지 않게 몸을 먼저 움직이십시오.',love:['말이 통하는 독특한 인연을 만납니다','혼자 있고 싶은 마음에 연락이 뜸해집니다'],money:['전문 기술이 돈이 됩니다','계획만 하다 기회를 놓칩니다'],work:['연구와 기획, 전문 분야에서 깊이를 얻습니다','방향을 자주 바꿔 성과가 흩어집니다'],do:'배우고 싶던 것 하나 시작하기',avoid:'밤늦게 생각만 굴리기'},
 정인:{w:'문서',k:'도와주는 손',good:'배움과 문서, 어른의 도움이 들어오는 기운입니다. 시험과 자격, 계약서에 좋고 마음이 편안해집니다.',bad:'기대고 싶은 마음이 커지는 기운입니다. 남의 도움만 기다리다 때를 놓치지 않게 하십시오.',love:['나를 아껴 주는 사람이 곁에 옵니다','상대에게 기대다 관계가 기울기 쉽습니다'],money:['문서와 계약으로 재산이 늘어납니다','받기만 하다 기회를 놓칩니다'],work:['시험과 자격, 공부에 좋은 결과가 납니다','결정을 미루다 흐름을 놓칩니다'],do:'문서 챙기고 공부 이어 가기',avoid:'남의 결정만 기다리기'}};
const SEASON={1:'한겨울 끝자락, 새해를 준비하는 달입니다.',2:'입춘이 지나 한 해의 기운이 새로 서는 달입니다.',3:'땅이 풀리고 일이 움트는 달입니다.',4:'봄기운이 무르익어 사람이 모이는 달입니다.',5:'여름이 문을 여는 달입니다.',6:'해가 길어 기운이 넘치는 달입니다.',7:'丁未년의 기운이 가장 짙어지는 한여름입니다.',8:'가을이 들어서며 거둘 것을 고르는 달입니다.',9:'열매가 여무는 달입니다.',10:'찬 이슬이 내려 한 해를 돌아보는 달입니다.',11:'겨울로 들어서며 안으로 갈무리하는 달입니다.',12:'한 해를 닫고 다음 해를 품는 달입니다.'};
const TERM={1:'소한',2:'입춘',3:'경칩',4:'청명',5:'입하',6:'망종',7:'소서',8:'입추',9:'백로',10:'한로',11:'입동',12:'대설'};
/* 오행 처방 */
const ELX=[
 {n:'나무',key:'wood',mini:'하람',color:'초록',dir:'동쪽',num:'3 · 8',acts:['아침 햇살 속에서 20분 걷기','책상 위에 작은 화분 두기','새로 배우는 것 하나 시작하기'],rest:'봄에는 무리하지 말고 눈과 어깨를 자주 쉬게 하십시오'},
 {n:'불',key:'fire',mini:'이안',color:'빨강',dir:'남쪽',num:'2 · 7',acts:['햇볕 쬐며 몸 움직이기','사람 많은 자리에 한 번 더 나가기','미뤄 둔 제안이나 고백 하나 꺼내기'],rest:'여름엔 열을 식히고 잠을 충분히 자십시오'},
 {n:'흙',key:'earth',mini:'도준',color:'노랑 · 황토',dir:'가운데',num:'5 · 10',acts:['집 안 한 칸 정리하기','같은 시간에 자고 일어나기','따뜻한 밥 제때 챙겨 먹기'],rest:'환절기마다 끼니와 생활 리듬을 지키십시오'},
 {n:'쇠',key:'metal',mini:'시온',color:'흰색 · 은색',dir:'서쪽',num:'4 · 9',acts:['안 쓰는 물건 정리해서 버리기','은빛 소품 하나 곁에 두기','끝맺지 못한 일 하나 마무리하기'],rest:'가을엔 건조하지 않게 물과 숨을 챙기십시오'},
 {n:'물',key:'water',mini:'재이',color:'검정 · 남색',dir:'북쪽',num:'1 · 6',acts:['물 자주 마시기','잠들기 전 하루를 세 줄로 적기','물가를 따라 걷기'],rest:'겨울엔 몸을 따뜻하게 하고 일찍 잠드십시오'}];

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
    relLines(o,2).forEach(l=>total+=' '+l); o.ss.slice(0,2).forEach(k=>total+=` ${k}${bt(k)?'이':'가'} 떠 ${SSM[k]}.`); if(o.fill) total+=` ${blankEl} 기운이 들어 네 빈칸을 채운다.`;
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
  const DY=goodDays(); const fg=F.st.strong?[1,2,3]:[0,4], favEls=fg.map(g=>(stEl(F.dm)+g)%5), needI=favEls.reduce((a,e)=>F.cnt[e]<F.cnt[a]?e:a,favEls[0]), need=ELX[needI]; const jh=F.johu;
  const H=[];
  H.push(`<div class="pv"><small>삼신 할매의 열두 달 상세 풀이</small><h3>${F.nick}의 2027</h3><p class="pvl">丁未년 · 입춘(2월 4일)부터 다음 해 입춘 전날까지 · ${X0.ys}점</p><div class="pvk"><span>올해의 세 단어</span><b>${C.cover.words.join(' · ')}</b></div><p class="pvq">“${N(C.cover.line)}”</p></div>`);
  H.push(`<div class="sec"><h3>올해의 판 · 丁未가 네 사주에 들어오는 법</h3>${panSvg()}${C.pan.map(p=>`<p class="p">${N(p)}</p>`).join('')}</div>`);
  H.push(`<div class="sec"><h3>${F.nxt&&F.age===F.cur.age+9?'문턱의 해 · 대운이 바뀌기 전':'대운 속의 2027'}</h3><div class="du2">${[F.cur,F.nxt].filter(Boolean).map((d,i)=>`<div class="${i===0?'now':'next'}"><small>${i===0?'지금':'다음'} · ${d.age}~${d.age+9}세</small><b>${GAN[d.s]}${JI[d.b]}</b><em>${S_.tgStem(F.dm,d.s)} · ${S_.tgBranch(F.dm,d.b)}</em></div>`).join('<span class="arr">→</span>')}</div><p class="p">${N(C.threshold)}</p></div>`);
  H.push(`<div class="sec"><h3>네 빈칸 · ${EL[F.blank]}</h3><p class="p">${N(C.blank)}</p><div class="fstrip">${F.months.map(o=>`<div class="${o.fill?'on':''}"><b>${o.start.m}</b>${dots(o.fill)}</div>`).join('')}</div><p class="fine2">점 하나는 그달 천간이나 지지에 ${EL[F.blank]} 기운이 하나 들었다는 뜻이에요</p></div>`);
  H.push(`<div class="sec"><h3>열두 달 상세 풀이</h3><div class="vt"><button type="button" data-v="month" class="${VIEW==='month'?'on':''}">월별로 보기</button><button type="button" data-v="area" class="${VIEW==='area'?'on':''}">항목별로 보기</button></div><div id="pview">${viewHtml(DY)}</div></div>`);
  const bw=(o,i,t,good)=>`<div class="bwr ${good?'good':'bad'}"><b>${o.start.m}월</b><div><p class="bt">${good?'볕이 드는 달':'바람이 부는 달'} · ${C.months[i].tag}</p><p>${t}</p></div></div>`;
  H.push(`<div class="sec"><h3>좋은 달 셋, 조심할 달 둘</h3><div class="bw">${Object.keys(C.best).map(i=>bw(F.months[i],+i,C.best[i],1)).join('')}${Object.keys(C.warn).map(i=>bw(F.months[i],+i,C.warn[i],0)).join('')}</div></div>`);
  H.push(`<div class="sec"><h3>할매의 처방 · 빈칸 채우기</h3><p class="p">${needI===F.blank?`네 빈칸은 <b>${need.n}</b>이다.`:`네 사주가 올해 가장 반기는 기운은 <b>${need.n}</b>이다.`} ${need.n} 기운을 곁에 두면 좋은 달은 더 좋아지고 궂은 달은 덜 궂어진다.${jh.need!=null?` 또 너는 ${jh.why}.`:''}</p>
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
    s+=`<path d="M${x1} 88 V${y} H${sx} V92" fill="none" stroke="${c}" stroke-width="1.4" ${/충/.test(r[1])?'stroke-dasharray="4 3"':''}/><text x="${x1+8}" y="${y-4}" font-size="11" font-weight="700" fill="${c}">${r[2]?'천간 ':''}${r[1].replace('천간','')}</text>`; });
  return s+'</svg>'; }

function bind(host){ host.addEventListener('click',e=>{ const h=e.target.closest('.mh'); if(h){ h.parentNode.classList.toggle('open'); return; }
  const v=e.target.closest('.vt button'); if(v){ VIEW=v.dataset.v; host.querySelectorAll('.vt button').forEach(b=>b.classList.toggle('on',b===v)); $('pview').innerHTML=viewHtml(goodDays()); openFirst(); return; }
  const a=e.target.closest('.atabs button'); if(a){ AREA=a.dataset.a; $('pview').innerHTML=viewHtml(goodDays()); } }); }
function openFirst(){ const f=document.querySelector('#pview .mrow.best'); if(f) f.classList.add('open'); }
window.SNPrem={open(){ const host=$('prem'); if(!host) return; VIEW='month'; AREA='love'; host.innerHTML=build(); host.hidden=false; const lk=document.querySelector('.lockS'); if(lk) lk.hidden=true; if(!host._b){ bind(host); host._b=1; } openFirst(); }};
})();
