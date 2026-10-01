/* 평생 사주 프리미엄 — 현암의 평생 상세 풀이
   계산: life_core.js → 사실 카드 · 원고: LIFE_SAMPLE(완성본) 또는 AI(현암 문체) · 없으면 해석 사전 초안 */
(function(){
const S_=window.Saju, X=window.SajuX, {GAN,JI,EL,stEl,BR_EL}=S_; const $=id=>document.getElementById(id); const K=window.PK;
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

const GRP=['비겁','식상','재성','관성','인성'];
const AREAS=[['love','연애'],['money','돈'],['work','일'],['people','사람'],['body','몸과 마음']];
const LAREAS=[['love','연애 · 결혼'],['money','재물'],['work','일 · 직업'],['family','가족'],['body','건강']];
const RELM={육합:'손을 잡아 일이 순하게 풀립니다',충:'정면으로 부딪혀 변동이 생깁니다',형:'서로 견제하니 서류와 약속을 두 번 보아야 합니다',원진:'이유 없이 서운해지기 쉽습니다',파:'약속 하나가 어긋나기 쉽습니다',해:'작은 섭섭함이 쌓입니다',삼합:'힘을 모아 기운이 커집니다','같은 글자':'같은 기운이 겹쳐 일이 커집니다',천간합:'마음이 묶입니다',천간충:'생각이 부딪힙니다'};
const SEAT={년지:'집안과 어린 시절',월지:'일터와 부모',일지:'배우자와 나 자신',시지:'꿈과 자녀',년간:'집안 어른',월간:'사회의 얼굴',일간:'나 자신',시간:'꿈과 말년'};
let L=null,C=null,ST={};
const nick=()=>L.nick;
function prep(){ const X0=window.LFF; if(!X0) return false; L=window.LifeCore.build(S_,X,X0.inp); L.nick=X0.nick;
  const sm=(window.LIFE_SAMPLE||{})[L.key]; C=K.gl(sm?JSON.parse(JSON.stringify(sm)):draft()); ST={}; return true; }
function draft(){ const P=L.P, dm=L.dm, mb=P.m[1], t2m=S_.tgBranch(dm,mb);
  const dmTx=typeof DM_TX!=='undefined'?DM_TX[dm]:'', kw=typeof DM_KW!=='undefined'?DM_KW[dm]:[SS[t2m].w];
  const relS=r=>`${r.at} ${r.gz} ${r.k} — ${RELM[r.k]||''}`;
  const yl=a=>a.length?a.map(o=>`${o.y}년(${o.a}세)`).join(', '):'뚜렷한 해 없음';
  return {draft:true,cover:{words:kw.slice(0,3),line:'{P}의 한평생을 대운 열 마디로 짚어 두었습니다. 좋은 때는 크게 쓰고, 궂은 때는 미리 대비하십시오.'},
   nature:[dmTx,`태어난 달 ${JI[mb]}는 {P}에게 ${t2m}입니다. ${SS[t2m].good}`,`여덟 글자에서 가장 많은 기운은 ${GRP[L.grp.indexOf(Math.max(...L.grp))]}, 가장 적은 기운은 ${GRP[L.grp.indexOf(Math.min(...L.grp))]}입니다.`,`가장 모자란 오행은 ${EL[L.blank]}입니다. 오방사주에서 말하는 {P}의 빈칸입니다.`].filter(Boolean),
   frame:(L.inner.length?L.inner.map(relS):['원국 안에서 크게 부딪히는 글자는 없습니다.']).concat(L.natal.length?[`원국에는 ${L.natal.map(o=>o.at+' '+o.k).join(', ')}이 있습니다.`]:[]),
   daeun:L.dl.map(d=>{ const a=SS[d.t1], b=SS[d.t2]; return {title:b.k,total:`${d.age}세부터 ${d.age+9}세까지는 ${d.gz} 대운입니다. ${a[d.f1?'good':'bad']} ${b[d.f2?'good':'bad']} ${d.br.slice(0,2).map(r=>`${r.at}와 ${r.k}, ${RELM[r.k]}.`).join(' ')}`,
     love:a.love[d.f1?0:1]+'.',money:a.money[d.f1?0:1]+'.',work:a.work[d.f1?0:1]+'.',people:d.br.find(r=>r.at==='년지'||r.at==='월지')?`${SEAT[d.br.find(r=>r.at==='년지'||r.at==='월지').at]} 쪽에서 ${RELM[d.br.find(r=>r.at==='년지'||r.at==='월지').k]}.`:'사람 관계는 무난한 10년입니다.',body:['병','사','절','묘'].includes(d.us)?'기운이 꺾이는 10년입니다. 무리하지 마십시오.':'기운이 무난한 10년입니다.',key:a.do}; }),
   turns:Object.fromEntries(L.keys.turn.map(o=>[o.y,`${o.gz}년, ${o.br.slice(0,2).join(', ')}${o.sr.length?', '+o.sr.join(', '):''}이 겹치는 해입니다.`])),
   areas:{love:{sum:`인연이 크게 움직이는 해는 ${yl(L.keys.love)}입니다.`,tip:'말이 통하는 사람을 고르십시오'},money:{sum:`재물이 모이거나 형태를 갖추는 해는 ${yl(L.keys.money)}입니다.`,tip:'돈을 쫓기보다 이름을 쌓으십시오'},work:{sum:`일의 결은 태어난 달의 ${t2m}에서 나옵니다. ${SS[t2m].work[0]}.`,tip:'좋은 대운 전에 실력을 갖춰 두십시오'},family:{sum:'년주는 집안, 시주는 자녀와 말년의 자리입니다.',tip:'가족과의 거리는 시간이 좁혀 줍니다'},body:{sum:`가장 모자란 ${EL[L.blank]} 기운을 평생 챙기십시오.`,tip:'같은 시간에 자고 일어나십시오'}},
   letter:['{P}께.','한평생은 길고, 대운은 열 마디로 바뀝니다. 좋은 마디에 크게 쓰고 궂은 마디에 아껴 두면 됩니다.','현암 드림']}; }
/* ---------- AI ---------- */
function card(ids){ const P=L.P, dm=L.dm, gz=p=>p?GAN[p[0]]+JI[p[1]]:'모름';
  const c={호칭:'{P}',성별:L.male?'남':'여',올해:new Date().getFullYear(),한국나이:L.age,일간:GAN[dm]+EL[stEl(dm)],강약:L.st.label,오행:Object.fromEntries(L.cnt.map((v,i)=>[EL[i],v])),빈칸:EL[L.blank],십성분포:Object.fromEntries(L.grp.map((v,i)=>[GRP[i],v])),
   원국:[['년주',P.y],['월주',P.m],['일주',P.d],['시주',P.h]].map(([n,p],i)=>p?{자리:n,간지:gz(p),천간십성:n==='일주'?'나':S_.tgStem(dm,p[0]),지지십성:S_.tgBranch(dm,p[1]),운성:L.pilUs[i]}:{자리:n,간지:'모름'}),
   원국안의관계:L.inner.map(r=>`${r.at} ${r.gz} ${r.k}`),원국신살:L.natal.map(o=>o.at+' '+o.k),공망:L.gong.map(b=>JI[b]),조후:L.johu.why,
   인연이움직이는해:L.keys.love.map(o=>`${o.y}년 ${o.a}세 ${o.gz}`),재물의해:L.keys.money.map(o=>`${o.y}년 ${o.a}세 ${o.gz}`),이동의해:L.keys.move.map(o=>`${o.y}년 ${o.a}세 ${o.gz}`),결정적인해:L.keys.turn.map(o=>({해:o.y,나이:o.a,간지:o.gz,관계:o.br.concat(o.sr),신살:o.ss,대운:o.du}))};
  c.대운=(ids||L.dl.map((d,i)=>i)).map(i=>{ const d=L.dl[i]; return {번호:i,나이:`${d.age}~${d.age+9}세`,연도:`${d.from}~${d.to}`,간지:d.gz,천간십성:d.t1,지지십성:d.t2,운성:d.us,점수:d.sc,빈칸채움:d.fill,지금:d.now,관계:d.br.map(r=>r.at+' '+r.k).concat(d.sr.map(r=>r.at+' '+r.k)),신살:d.ss}; });
  return JSON.stringify(c); }
function prompts(){ const A=window.PremAI, ST0=A.STYLE.hyeonam+'\n'+A.COMMON.replace(/\{N\}/g,'{P}').replace('이름과 호격으로','이름과 님으로');
  const ex="{\"i\": 3, \"title\": \"빈칸이 채워지는 전성기\", \"total\": \"서른세 살부터 마흔두 살까지는 기축(己丑) 대운(10년마다 바뀌는 큰 운)입니다. 한마디로 {P} 인생 그래프에서 가장 높은 봉우리입니다. 기(己)와 축(丑)이 모두 흙이라, 사주에 비어 있던 흙 기운이 처음으로 꽉 채워집니다. {P}에게 흙은 편인(전문성 · 문서 · 이끌어 주는 어른)이라, 혼자 버티던 자리에 기댈 언덕이 생기고 공부한 것이 자격과 직함으로 굳습니다. 축(丑)은 년지(집안 자리) 자(子)와 합(서로 끌어당김)을 맺어 가족과 가까워지고, 월지(일터 자리) 사(巳)와 삼합(한 팀으로 뭉침)을 이뤄 일터에서 목소리가 커집니다. 다만 축(丑)과 시지(꿈 · 자녀 자리) 오(午)는 원진(괜히 서운하고 꺼려지는 사이)이라, 오래 품은 꿈 하나를 두고 서운한 일이 생길 수 있습니다.\", \"love\": \"안정된 관계가 자리를 잡습니다. 결혼이나 함께 사는 일을 정하기 좋은 10년입니다.\", \"money\": \"모으는 힘이 생깁니다. 집, 계약, 자격처럼 문서로 남는 재산이 늘어납니다.\", \"work\": \"전문가로 이름이 서는 시기입니다. 공부와 자격이 직함이 됩니다.\", \"people\": \"스승이나 윗사람이 길을 열어 줍니다. 집안과의 거리도 가까워집니다.\", \"body\": \"처음으로 쉬는 법을 배우는 10년입니다. 잠과 끼니가 규칙적으로 자리 잡습니다.\", \"key\": \"기대고 쌓는 10년\"}";
  const core=`${ST0}\n\n[할 일] 평생 사주 프리미엄의 '타고난 그릇 · 원국의 짜임 · 결정적인 해 · 마지막 글'을 쓴다. 이미 지나온 나이는 과거형으로 쓴다.
출력 JSON 형식: {"cover":{"words":["이 사람을 요약하는 두세 글자 단어 세 개"],"line":"{P}의 로 시작하는 현암의 한마디 1~2문장"},"nature":["타고난 그릇 5단락. 일간의 본성, 태어난 달(월지)의 십성과 사회에서의 모습, 십성 분포가 만드는 마음의 구조, 빈칸, 조후 순서. 단락마다 150~230자"],"frame":["원국 안의 합 · 충과 신살 · 공망 이야기 2~3단락, 단락마다 120~200자"],"turns":{"${L.keys.turn.map(o=>o.y).join('":"그해가 결정적인 이유 2문장","')}":"그해가 결정적인 이유 2문장"},"letter":["{P}께.","현암의 글 4~5단락, 단락마다 60~130자","현암 드림"]}
turns의 키는 위 해로 고정이다.

[사실 카드]
${card()}`;
  const areas=`${ST0}\n\n[할 일] 평생 사주 프리미엄의 '영역별 평생'을 쓴다. 해당 해가 사실 카드에 있으면 연도와 나이를 짚는다.
출력 JSON 형식: {"areas":{"love":{"sum":"연애 · 결혼 280~380자. 배우자 자리(일지)의 십성, 인연의 별, 인연이 움직이는 해","tip":"현암의 한마디 한 문장"},"money":{"sum":"재물 280~380자. 재성의 유무와 힘, 모으는 방식, 재물의 해","tip":""},"work":{"sum":"일 · 직업 280~380자. 월지 십성과 십성 분포로 본 맞는 일, 일하는 방식, 전성기 대운","tip":""},"family":{"sum":"가족 250~330자. 년주(부모 · 집안), 형제, 시주(자녀) 자리","tip":""},"body":{"sum":"건강 200~280자. 진단 없이 생활 관리, 몸을 살필 대운","tip":""}}}

[사실 카드]
${card()}`;
  const du=ids=>`${ST0}\n\n[할 일] 아래 대상 대운들의 10년 풀이를 쓴다. 지금 나이보다 앞선 대운은 지나온 일로 과거형으로 쓴다.
출력 JSON 형식: 배열. 대운마다 {"i":대운 번호,"title":"그 10년의 제목 8~14자","total":"10년 총론 280~380자. 간지와 나이로 시작해 십성 · 운성 · 관계 · 신살 · 빈칸채움을 근거로","love":"50~100자","money":"50~100자","work":"50~100자","people":"50~100자","body":"50~100자","key":"이 10년의 열쇠, ~10년으로 끝나는 10~16자"}
대상 대운 번호: ${ids.join(', ')}

[문체 예시 · 다른 사람 사주의 한 대운]
${ex}

[사실 카드]
${card(ids)}`;
  const isArr=d=>Array.isArray(d)&&d.every(x=>x&&typeof x.total==='string');
  return [{id:'core',prompt:core,check:d=>d&&d.cover&&Array.isArray(d.nature)&&Array.isArray(d.letter)},{id:'areas',prompt:areas,check:d=>d&&d.areas&&d.areas.love},{id:'d0',prompt:du([0,1,2]),check:isArr},{id:'d1',prompt:du([3,4,5]),check:isArr},{id:'d2',prompt:du([6,7,8]),check:isArr}]; }
function apply(id,d){ if(id==='core'||id==='areas'){ ['cover','nature','frame','letter','areas'].forEach(k=>{ if(d[k]) C[k]=d[k]; }); if(d.turns) C.turns=d.turns; }
  else d.forEach(x=>{ const i=+x.i; if(i>=0&&i<L.dl.length) C.daeun[i]=Object.assign({},C.daeun[i],x); }); }
/* ---------- 화면 ---------- */
function build(){ const n=nick(), P=L.P, dm=L.dm;
  const best=[...L.dl].sort((a,b)=>b.sc-a.sc)[0], low=[...L.dl].sort((a,b)=>a.sc-b.sc)[0];
  const fg=L.st.strong?[1,2,3]:[0,4], favEls=fg.map(g=>(stEl(dm)+g)%5), needI=favEls.reduce((a,e)=>L.cnt[e]<L.cnt[a]?e:a,favEls[0]), need=ELX[needI];
  const mx=Math.max(...L.grp,1);
  const H=[`<div class="pk-st" id="lfst" hidden></div>`];
  H.push(K.cover({kick:'현암의 평생 상세 풀이',title:`${K.esc(n)}님의 한평생`,sub:`${GAN[dm]}${EL[stEl(dm)]} 일간 · ${L.st.label} · 빈칸 ${EL[L.blank]}`,words:C.cover.words,line:K.tok(C.cover.line,n),who:'명리 대가 · 현암',img:'img/jeongtong.jpg'}));
  H.push(K.sec('타고난 그릇',`<div class="pk-bars">${L.grp.map((v,i)=>`<div><div class="pk-t"><i class="${v?'':'pk-z'}" style="height:${v/mx*100}%"></i></div><b>${GRP[i]}</b><small>${v}</small></div>`).join('')}</div>`+K.ps(C.nature,n)));
  H.push(K.sec('원국의 짜임',K.ps(C.frame,n)+K.ev(L.inner.map(r=>`${r.at} ${r.gz} ${r.k}`).concat(L.natal.map(o=>o.at+' '+o.k)).concat(['공망 '+L.gong.map(b=>JI[b]).join('')]))));
  H.push(K.sec('대운 아홉 마디',`<div class="pk-acc">${L.dl.map((d,i)=>{ const c=C.daeun[i]||{}; const tag=d.now?'지금':d===best?'전성기':d===low?'고비':'';
    return K.row({k:'d'+i,cls:d===best?'pk-hi':d===low?'pk-lo':'',a:`${d.age}~${d.age+9}세`,asub:`${d.from}~${d.to}`,b:`<em>${d.gz}</em>${K.esc(c.title||'')}${tag?`<span class="pk-tag">${tag}</span>`:''}`,c:d.sc,
     body:K.ps([c.total],n)+K.items(c,AREAS,n)+`<p class="pk-key"><b>이 10년의 열쇠</b>${K.tok(c.key||'',n)}</p>`+K.ev([`천간 ${d.t1}`,`지지 ${d.t2}`,`운성 ${d.us}`].concat(d.br.map(r=>r.at+' '+r.k)).concat(d.sr.map(r=>r.at+' '+r.k)).concat(d.ss).concat(d.fill?[`빈칸 채움 ${d.fill}`]:[]))}); }).join('')}</div>`,'누르면 10년 풀이가 열려요'));
  H.push(K.sec('인생의 결정적인 해 셋',`<div class="pk-cards">${L.keys.turn.map(o=>`<div class="pk-card"><b>${o.y}<small>${o.a}세 · ${o.gz}</small></b><div><p>${K.tok((C.turns||{})[o.y]||'',n)}</p></div></div>`).join('')||'<p class="pk-p">앞으로 크게 꺾이는 해는 따로 드러나지 않습니다.</p>'}</div>`));
  const yl=a=>a.length?a.map(o=>`${o.y}<em> ${o.a}세</em>`).join(' · '):'—';
  H.push(K.sec('시기 달력',`<table class="pk-tbl"><tr><th>무엇</th><th>해 · 나이</th></tr><tr><td>인연</td><td>${yl(L.keys.love)}</td></tr><tr><td>재물</td><td>${yl(L.keys.money)}</td></tr><tr><td>이동 · 변화</td><td>${yl(L.keys.move)}</td></tr></table><p class="pk-ev">해마다의 간지가 원국 · 대운과 만나는 관계로 고른 해예요</p>`,'앞으로의 해'));
  H.push(K.sec('영역별 평생',LAREAS.map(([k,l])=>{ const a=(C.areas||{})[k]; return a?`<div class="pk-ar"><b>${l}</b>${K.ps([a.sum],n)}${a.tip?`<p class="pk-tip">현암의 한마디 · ${K.tok(a.tip,n)}</p>`:''}</div>`:''; }).join('')));
  H.push(K.sec('현암의 처방',`<p class="pk-p">${needI===L.blank?`{P}의 빈칸은 ${need.n}입니다.`:`{P}의 사주가 평생 반기는 기운은 ${need.n}입니다.`} ${need.n}의 기운을 생활 가까이 두십시오.${L.johu.need!=null?` 또 ${L.johu.why}.`:''}</p>`.replace('{P}',K.esc(n)+'님')+`<div class="pk-rx3"><div><small>평생의 색</small><b>${need.color}</b></div><div><small>방위</small><b>${need.dir}</b></div><div><small>숫자</small><b>${need.num}</b></div></div><ol class="pk-ol">${need.acts.map(a=>`<li>${a}</li>`).join('')}</ol><a class="pk-mini" href="bujeok.html?el=${need.key}"><i style="background-image:url('img/mini/${need.key}.jpg')"></i><span><b>${need.n}의 미니 수호신 ${need.mini}</b><small>${need.mini}의 부적 카드 받기 →</small></span></a>`));
  H.push(K.letter(C.letter||[],{title:'현암의 글',name:'명리 대가 현암'},'玄巖',n));
  H.push(`<p class="pk-note">${ST.ai?'이 풀이는 만세력 계산 근거만 재료로 AI가 현암의 문체로 쓴 글이에요. 명리 전문가 감수 전 원고예요':C.fixed?'이 풀이는 만세력 계산 근거만 재료로 AI가 현암의 문체로 쓴 완성본 샘플이에요. 명리 전문가 감수 전 원고예요':'이 풀이는 해석 사전으로 조립한 초안이에요. 정식 서비스에서는 같은 근거로 현암이 길게 써 드려요'}</p>`);
  return H.join(''); }
function render(){ const host=$('prem'); K.keepOpen(host,()=>{ host.innerHTML=build(); }); K.status($('lfst'),Object.assign({who:'현암이 평생 풀이'},ST)); }
window.LifePrem={open(){ const host=$('prem'); if(!host||!prep()) return; host.classList.add('pkx'); host.hidden=false; const lk=document.querySelector('.lockS'); if(lk) lk.hidden=true; K.bind(host); render();
  const cur=host.querySelector(`.pk-row[data-k="d${L.dl.indexOf(L.cur)}"]`); if(cur) cur.classList.add('open');
  if(!C.fixed) K.runAI({key:L.key+'-life',ver:'v2',parts:prompts(),apply,rerender:render,S:ST}); }};
})();
