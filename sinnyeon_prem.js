/* 2027 신년운세 프리미엄 — 할매의 열두 달 상세 풀이
   구조: 계산(saju.js) → 사실 카드(SNF) → 해석 사전(SS · SEASON · ELX) → 할매 말투 조립 → 화면.
   해석 사전 문장은 감수 전 초안(v0). 같은 사주는 늘 같은 풀이가 나온다(무작위 없음). */
(function(){
const S_=window.Saju, {GAN,JI,EL,stEl,BR_EL}=S_;
const $=id=>document.getElementById(id);
const bt=w=>{ const c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28>0; };
const jo=(w,a,b)=>w+(bt(w)?a:b);

/* ---------- 해석 사전 v0: 십성 10 ---------- */
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
const DOHWA={2:3,6:3,10:3, 8:9,0:9,4:9, 5:6,9:6,1:6, 11:0,3:0,7:0}; /* 년·일지 → 도화 지지 */
const DOW=['일','월','화','수','목','금','토'];

let F=null;
function facts(){ const X=window.SNF; if(!X) return null; const {P,dm,st}=X;
  const T=s=>S_.tgStem(dm,s), TB=b=>S_.tgBranch(dm,b), fav=g=>S_.favorable(st,g);
  const db=P.d[1], mb=P.m[1], yb=P.y[1];
  const MO=X.MO.map(o=>{ const t1=T(o.mp[0]), t2=TB(o.mp[1]), g1=S_.rel(dm,stEl(o.mp[0])), g2=S_.relBranch(dm,o.mp[1]);
    return Object.assign({},o,{t1,t2,g1,g2,f1:fav(g1),f2:fav(g2),hapD:S_.isHap(o.mp[1],db),chD:S_.isChung(o.mp[1],db),chM:S_.isChung(o.mp[1],mb),dohwa:o.mp[1]===DOHWA[yb]||o.mp[1]===DOHWA[db]}); });
  /* 용신에 가까운 오행: 반기는 무리 가운데 가장 모자란 기운 */
  const fg=st.strong?[1,2,3]:[0,4]; const favEls=fg.map(g=>(stEl(dm)+g)%5); const need=favEls.reduce((a,e)=>X.cnt[e]<X.cnt[a]?e:a,favEls[0]);
  const loveG=X.male?2:3;
  return Object.assign({},X,{MO,T,TB,fav,db,mb,yb,need,loveG}); }

/* ---------- 길일: 2027년 일진 ---------- */
function days(){ const {P,dm,st,db,mb,yb,loveG}=F, out=[];
  for(let t=Date.UTC(2027,0,1);t<=Date.UTC(2027,11,31);t+=864e5){ const d=new Date(t), y=2027, m=d.getUTCMonth()+1, dd=d.getUTCDate(), w=d.getUTCDay();
    const [s,b]=S_.dayPillar(y,m,dd); if(S_.isChung(b,db)||S_.isChung(b,mb)||S_.isChung(b,yb)) continue;
    const g1=S_.rel(dm,stEl(s)), g2=S_.relBranch(dm,b), f1=S_.favorable(st,g1), f2=S_.favorable(st,g2);
    out.push({m,d:dd,w,s,b,g1,g2,f1,f2,hapD:S_.isHap(b,db),hapM:S_.isHap(b,mb)}); }
  const pick=(fn,n)=>{ const c=out.map(x=>({x,v:fn(x)})).filter(o=>o.v>0).sort((a,b)=>b.v-a.v||a.x.m-b.x.m||a.x.d-b.x.d); const r=[], used=new Set(); for(const o of c){ if(used.has(o.x.m)) continue; used.add(o.x.m); r.push(o.x); if(r.length===n) break; } return r.sort((a,b)=>a.m-b.m||a.d-b.d); };
  const wk=x=>x.w===0||x.w===6;
  const cat={
   move:pick(x=>(x.f1?2:0)+(x.f2?2:0)+(x.hapD?2:0)+(wk(x)?1.5:0)-((x.g1===0&&!x.f1)?2:0),3),
   deal:pick(x=>([2,3,4].includes(x.g1)&&x.f1?3:0)+(x.f2?1:0)+(x.hapM?2:0)+(x.w>0&&x.w<6?1:0),3),
   love:pick(x=>(x.hapD?3:0)+(x.g1===loveG&&x.f1?2.5:0)+(x.f2?1:0)+(x.w===5||x.w===6?1:0),3),
   exam:pick(x=>([3,4].includes(x.g1)&&x.f1?3:0)+([3,4].includes(x.g2)?1:0)+(x.f2?1:0),3)};
  const perMonth={}; for(let m=1;m<=12;m++){ perMonth[m]=out.filter(x=>x.m===m).map(x=>({x,v:(x.f1?2:0)+(x.f2?2:0)+(x.hapD?2:0)})).filter(o=>o.v>=4).sort((a,b)=>b.v-a.v||a.x.d-b.x.d).slice(0,2).map(o=>o.x).sort((a,b)=>a.d-b.d); }
  return {cat,perMonth}; }
const dstr=x=>`${x.m}월 ${x.d}일 (${DOW[x.w]})`;

/* ---------- 조립 ---------- */
function monthText(o){ const a=SS[o.t1], b=SS[o.t2]; let tx=`${SEASON[o.m]} ${a[o.f1?'good':'bad']}`;
  if(o.t2!==o.t1) tx+=` 바탕에는 ${o.t2}의 기운이 깔려 ‘${b.k}’에 관한 일도 함께 움직입니다.`;
  if(o.hapD) tx+=' 일지와 합이 들어 가까운 사람과 마음이 묶이는 달입니다.';
  if(o.chD) tx+=' 일지와 충이 걸려 집이나 가까운 관계에 변동이 생기기 쉽습니다. 큰 결정은 다음 달로 미루십시오.';
  else if(o.chM) tx+=' 월지와 충이 걸려 일터와 집안 환경이 흔들립니다.';
  if(o.dohwa) tx+=' 도화가 피는 달이라 사람들 눈에 띄고 인연이 붙습니다.';
  return tx; }
function areaPick(fn,n=3){ return [...F.MO].map(o=>({o,v:fn(o)})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v||b.o.sc-a.o.sc).slice(0,n).map(x=>x.o).sort((a,b)=>a.m-b.m); }
const mlist=a=>a.length?a.map(o=>o.m+'월').join(', '):'뚜렷한 달 없음';

function build(){ F=facts(); if(!F) return '';
  const {nick,dm,st,cnt,ys,tier,cur,curFav,P,male}=F; const DY=days();
  const YS=3, YB=7; const tS=F.T(YS), tB=F.TB(YB), fS=F.fav(S_.rel(dm,stEl(YS))), fB=F.fav(S_.relBranch(dm,YB));
  const sorted=[...F.MO].sort((a,b)=>b.sc-a.sc), best3=sorted.slice(0,3), warn2=sorted.slice(-2).reverse();
  const need=ELX[F.need], weak=cnt.indexOf(Math.min(...cnt));
  const yLbl=['문이 열리는 해','다지고 쌓는 해','바람이 센 해'][tier];
  const kw=[SS[tS].w, SS[tB].w, SS[best3[0].t1].w, SS[best3[1].t1].w, SS[best3[0].t2].w].filter((v,i,a)=>a.indexOf(v)===i).slice(0,3);
  /* 원국 × 세운 관계 */
  const pil=[['시주',P.h],['일주',P.d],['월주',P.m],['년주',P.y]];
  const rels=[]; pil.forEach(([n,p])=>{ if(!p) return; const b=p[1]; if(S_.isHap(YB,b)) rels.push([n,'합',b]); if(S_.isChung(YB,b)) rels.push([n,'충',b]); if(S_.isHyung(YB,b)) rels.push([n,'형',b]); if(b===YB) rels.push([n,'같은 글자',b]); });
  const relTx={합:'끌어당겨 묶이는 관계라 그 자리의 일이 순하게 풀립니다',충:'정면으로 부딪히는 관계라 그 자리에 변동과 이동이 생깁니다',형:'서로 견제하는 관계라 서류와 약속을 두 번 확인해야 합니다','같은 글자':'같은 기운이 겹쳐 그 자리의 일이 두 배로 커집니다'};
  const seat={시주:'자녀와 말년, 꿈',일주:'나 자신과 배우자',월주:'일터와 부모, 사회',년주:'집안과 어린 시절, 바깥 평판'};
  const svg=panSvg(pil,rels);

  const loveM=areaPick(o=>(o.hapD?3:0)+(o.g1===F.loveG&&o.f1?2:0)+(o.dohwa?2:0)-(o.chD?3:0));
  const moneyM=areaPick(o=>((o.g1===2||o.g2===2)&&(o.f1||o.f2)?3:0)+(o.g1===1&&o.f1?1:0)-(o.g1===0&&!o.f1?2:0));
  const workM=areaPick(o=>((o.g1===3||o.g1===4)&&o.f1?3:0)+((o.g2===3||o.g2===4)&&o.f2?1:0)-(o.chM?2:0));
  const restM=F.MO.filter(o=>o.chD||o.chM||o.sc<50).slice(0,3);
  const loveStar=male?'재성':'관성';

  const H=[];
  /* 1. 표지 */
  H.push(`<div class="pv"><small>삼신 할매의 열두 달 상세 풀이</small><h3>${nick}의 2027</h3><p class="pvl">丁未년 · ${yLbl} · ${ys}점</p><div class="pvk"><span>올해의 세 단어</span><b>${kw.join(' · ')}</b></div><p class="pvq">“${nick}아, 할미가 네 열두 달을 하나하나 짚어 뒀다. 좋은 달은 놓치지 말고, 궂은 달은 미리 알고 피해 가거라.”</p></div>`);
  /* 2. 올해의 판 */
  H.push(`<div class="sec"><h3>올해의 판 · 丁未가 네 사주에 들어오는 법</h3>${svg}
   <p class="p"><b>천간 丁 · ${tS}</b> — ${SS[tS][fS?'good':'bad']}</p>
   <p class="p"><b>지지 未 · ${tB}</b> — ${SS[tB][fB?'good':'bad']}</p>
   ${rels.length?rels.map(r=>`<p class="p"><b>${r[0]} ${JI[r[2]]} × 未 · ${r[1]}</b> — ${r[0]}는 ${seat[r[0]]}의 자리입니다. ${relTx[r[1]]}.</p>`).join(''):'<p class="p">올해의 未는 네 사주의 어느 기둥과도 크게 부딪히지 않습니다. 큰 변동보다 흐름을 타는 해입니다.</p>'}
   <p class="p"><b>대운과 겹쳐 보면</b> — 지금은 ${GAN[cur.s]}${JI[cur.b]} 대운(${cur.age}~${cur.age+9}세)입니다. ${curFav?'큰 흐름이 사주를 받쳐 주니 올해 기운을 마음껏 써도 됩니다.':'큰 흐름이 버거운 때라 올해 기운도 욕심보다 방향을 지키는 데 쓰십시오.'}</p></div>`);
  /* 3. 열두 달 */
  H.push(`<div class="sec"><h3>열두 달 상세<i>달을 누르면 풀이가 열려요</i></h3><div class="mlist">${F.MO.map(o=>{ const b3=best3.includes(o), w2=warn2.includes(o); const dd=DY.perMonth[o.m];
    return `<div class="mrow ${b3?'best':w2?'warn':''}"><button class="mh" type="button"><span class="mm">${o.m}월</span><span class="mg">${GAN[o.mp[0]]}${JI[o.mp[1]]}</span><span class="mt">${SS[o.t1].k}</span><span class="ms2">${o.sc}</span></button>
      <div class="mb"><p class="mterm">${TERM[o.m]} 무렵부터 · 천간 ${o.t1} · 지지 ${o.t2}</p><p class="p">${monthText(o)}</p>
      <div class="m3"><div><small>연애</small><p>${o.hapD?'가까운 사람과 마음이 묶입니다':o.chD?'다툼이 잦아지니 말을 아끼십시오':SS[o.t1].love[o.f1?0:1]}</p></div><div><small>돈</small><p>${SS[o.t1].money[o.f1?0:1]}</p></div><div><small>일</small><p>${o.chM?'일터 환경이 흔들리니 계획부터 세우십시오':SS[o.t1].work[o.f1?0:1]}</p></div></div>
      <div class="mdo"><p><b>할 일</b>${SS[o.t1].do}</p><p><b>멀리할 것</b>${SS[o.t1].avoid}</p>${dd.length?`<p><b>이달의 좋은 날</b>${dd.map(dstr).join(', ')}</p>`:''}</div></div></div>`; }).join('')}</div></div>`);
  /* 4. 좋은 달 · 조심할 달 */
  H.push(`<div class="sec"><h3>좋은 달 셋, 조심할 달 둘</h3><div class="bw">
   ${best3.map((o,i)=>`<div class="bwr good"><b>${o.m}월</b><div><p class="bt">${i===0?'가장 볕이 드는 달':'볕이 드는 달'} · ${SS[o.t1].k}</p><p>${SS[o.t1].good}${o.hapD?' 일지와 합까지 들어 사람 운이 함께 붙습니다.':''}</p></div></div>`).join('')}
   ${warn2.map(o=>`<div class="bwr bad"><b>${o.m}월</b><div><p class="bt">바람이 부는 달 · ${SS[o.t1].k}</p><p>${SS[o.t1].bad}${o.chD?' 일지와 충이 걸려 집과 관계가 흔들립니다.':o.chM?' 월지와 충이 걸려 일터가 흔들립니다.':''}</p></div></div>`).join('')}</div></div>`);
  /* 5. 영역별 */
  const area=(t,ms,body,tip)=>`<div class="ar"><div class="arh"><b>${t}</b><span>좋은 달 · ${mlist(ms)}</span></div><p class="p">${body}</p><p class="tip">할매 한마디 · ${tip}</p></div>`;
  H.push(`<div class="sec"><h3>영역별로 깊게</h3>
   ${area('연애 · 인연',loveM,`${male?'남자':'여자'} 사주에서 인연의 별은 ${loveStar}입니다. ${F.MO.some(o=>o.dohwa)?`올해는 ${mlist(F.MO.filter(o=>o.dohwa))}에 도화가 피어 사람들 눈에 띕니다. `:''}${F.MO.some(o=>o.hapD)?`${mlist(F.MO.filter(o=>o.hapD))}에는 배우자 자리인 일지가 합을 받아 마음이 묶입니다. `:''}${F.MO.some(o=>o.chD)?`반대로 ${mlist(F.MO.filter(o=>o.chD))}에는 일지가 흔들리니 다툼을 키우지 마십시오.`:'올해는 관계를 크게 흔드는 달이 없습니다.'}`, loveM.length?`${loveM[0].m}월엔 약속을 미루지 말거라. 그달 만난 사람은 오래 간다`:'새 인연보다 곁의 사람을 먼저 챙기거라')}
   ${area('돈',moneyM,`${st.strong?'사주에 힘이 있어 들어오는 돈을 쥘 수 있습니다.':'사주에 힘이 모자라 큰돈보다 꾸준한 돈이 맞습니다.'} ${moneyM.length?`${mlist(moneyM)}에 재물의 기운이 움직입니다.`:'올해는 재물의 기운이 크게 움직이는 달이 적습니다. 지키는 해로 삼으십시오.'} ${F.MO.some(o=>o.g1===0&&!o.f1)?`${mlist(F.MO.filter(o=>o.g1===0&&!o.f1))}에는 나갈 돈이 생기니 큰 지출을 피하십시오.`:''}`, st.strong?'벌 때 크게 벌되, 버는 달에 반은 떼어 두거라':'욕심은 반으로 줄이고 새는 돈부터 막거라')}
   ${area('일 · 커리어',workM,`${workM.length?`${mlist(workM)}에 자리와 이름의 기운, 배움과 문서의 기운이 들어옵니다. 이직·승진·시험은 이 달에 맞추십시오.`:'올해는 자리를 옮기기보다 실력을 쌓는 해입니다.'} ${F.MO.some(o=>o.chM)?`${mlist(F.MO.filter(o=>o.chM))}에는 일터가 흔들리니 그 전에 준비를 끝내 두십시오.`:''}`, workM.length?`${workM[0].m}월에 내밀 서류는 지금부터 준비하거라`:'남의 자리 부러워 말고 네 칼을 갈거라')}
   ${area('몸과 마음',restM,`네 사주엔 ${EL[weak]} 기운이 가장 적습니다. ${ELX[weak].rest}. ${restM.length?`${mlist(restM)}은 기운이 꺾이는 달이니 일정을 비워 두고 쉬십시오.`:''}`, '쉬는 것도 일이다. 아픈 데가 오래가면 꼭 병원부터 가거라').replace('<span>좋은 달 · ','<span>쉬어 갈 달 · ')}
  </div>`);
  /* 6. 처방 */
  H.push(`<div class="sec"><h3>할매의 처방 · 모자란 기운 채우기</h3><p class="p">네 사주가 올해 가장 반기는 기운은 <b>${need.n}</b>입니다. ${need.n} 기운을 곁에 두면 좋은 달은 더 좋아지고 궂은 달은 덜 궂어집니다.</p>
   <div class="rx3"><div><small>행운 색</small><b>${need.color}</b></div><div><small>방위</small><b>${need.dir}</b></div><div><small>숫자</small><b>${need.num}</b></div></div>
   <ol class="rxl">${need.acts.map(a=>`<li>${a}</li>`).join('')}</ol>
   <a class="rxm" href="bujeok.html?el=${need.key}"><i style="background-image:url('img/mini/${need.key}.jpg')"></i><span><b>${need.n}의 미니 수호신 ${need.mini}</b><small>${need.mini}의 부적 카드 받기 →</small></span></a></div>`);
  /* 7. 길일 달력 */
  const C=DY.cat, crow=(t,a,n)=>`<div class="dr"><b>${t}</b><div>${a.length?a.map(x=>`<span>${dstr(x)}<em>${GAN[x.s]}${JI[x.b]}일</em></span>`).join(''):'<span>올해는 따로 고른 날이 없습니다</span>'}</div><p>${n}</p></div>`;
  H.push(`<div class="sec"><h3>2027 길일 달력<i>네 사주와 부딪히지 않는 날</i></h3>
   ${crow('이사 · 집',C.move,'일지·월지·년지와 충이 없고 사주가 반기는 날, 주말 위주')}
   ${crow('계약 · 문서',C.deal,'재물·자리·문서의 기운이 반기는 평일')}
   ${crow('고백 · 소개팅',C.love,'배우자 자리와 합이 들거나 인연의 별이 뜨는 날')}
   ${crow('시험 · 면접',C.exam,'자리와 배움의 기운이 반기는 날')}
   <p class="fine2">손 없는 날 같은 민속 택일은 따로 보지 않았습니다. 더 정밀하게 고르려면 택일 메뉴를 이용하세요.</p></div>`);
  /* 8. 편지 */
  H.push(`<div class="sec letter"><h3>할매의 편지</h3><div id="ltx">${letter(best3,warn2,need,yLbl).map(p=>`<p>${p}</p>`).join('')}</div><p class="sign">삼신 할매 <span class="seal">三神</span></p><button class="aiL" id="aiL" type="button" hidden>AI로 할매 편지 다시 받기</button><p class="ainote" id="ainote" hidden>이 편지는 AI가 위 풀이만 재료로 할매 말투로 다시 쓴 글이에요</p></div>`);
  return H.join(''); }

function letter(best3,warn2,need,yLbl){ const n=F.nick, b=best3[0], w=warn2[0];
  return [`${n}아.`,
   `올해 丁未년은 네게 ${yLbl}다. ${F.tier===0?'오래 두드리던 문이 열린다.':F.tier===1?'요란하진 않아도 네 자리가 단단해진다.':'바람이 세게 불지만, 뿌리 깊은 나무는 쓰러지지 않는다.'}`,
   `가장 볕이 드는 달은 ${b.m}월이다. ${SS[b.t1].k}의 기운이 들어오니, 그달엔 망설이지 말고 ‘${SS[b.t1].do}’부터 하거라.`,
   `${w.m}월엔 바람이 분다. 그때는 ‘${SS[w.t1].avoid}’만은 멀리하고, 한 박자 쉬어 가거라.`,
   `네 사주엔 ${need.n} 기운이 모자라니 ${need.color} 빛을 곁에 두고, ${need.acts[0]}부터 하거라.`,
   `한 해는 길다. 좋은 달에 크게 웃고 궂은 달엔 잘 버티면 그걸로 됐다. 할미가 열두 달 내내 지켜보마.`]; }

/* 원국 4기둥 + 세운 기둥, 관계 선 */
function panSvg(pil,rels){ const W=340,cx=[44,108,172,236],sx=302; const col={합:'#3f7d5a',충:'#b3322a',형:'#a7792c','같은 글자':'#4a433a'};
  const VH=rels.length?104+rels.length*14:134; let s=`<svg class="pan" viewBox="0 0 ${W} ${VH}" role="img" aria-label="원국과 2027 세운의 관계">`;
  pil.forEach(([n,p],i)=>{ s+=`<text x="${cx[i]}" y="14" text-anchor="middle" font-size="10.5" fill="#877d70">${n}</text>`;
    if(p){ s+=`<text x="${cx[i]}" y="46" text-anchor="middle" font-size="24" font-weight="900" font-family="Noto Serif KR,serif" fill="#1f1b16">${GAN[p[0]]}</text><text x="${cx[i]}" y="80" text-anchor="middle" font-size="24" font-weight="900" font-family="Noto Serif KR,serif" fill="#1f1b16">${JI[p[1]]}</text>`; }
    else s+=`<text x="${cx[i]}" y="64" text-anchor="middle" font-size="12" fill="#877d70">모름</text>`; });
  s+=`<rect x="${sx-26}" y="20" width="52" height="72" fill="#fff4f0" stroke="#b3322a" stroke-width="1.5"/><text x="${sx}" y="14" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b3322a">2027</text><text x="${sx}" y="46" text-anchor="middle" font-size="24" font-weight="900" font-family="Noto Serif KR,serif" fill="#b3322a">丁</text><text x="${sx}" y="80" text-anchor="middle" font-size="24" font-weight="900" font-family="Noto Serif KR,serif" fill="#b3322a">未</text>`;
  const names=pil.map(p=>p[0]); rels.forEach((r,k)=>{ const i=names.indexOf(r[0]), x1=cx[i], c=col[r[1]], y=100+k*14, h=Math.min(y,140);
    s+=`<path d="M${x1} 88 V${h} H${sx} V92" fill="none" stroke="${c}" stroke-width="1.5" ${r[1]==='충'?'stroke-dasharray="4 3"':''}/><text x="${(x1+sx)/2}" y="${h-4}" text-anchor="middle" font-size="11" font-weight="700" fill="${c}">${r[1]}</text>`; });
  if(!rels.length) s+=`<text x="${W/2}" y="122" text-anchor="middle" font-size="11.5" fill="#877d70">올해 未와 크게 부딪히는 기둥 없음</text>`;
  return s+'</svg>'; }

/* AI로 편지 다시 쓰기 (claude.ai 안에서만, 사실 카드만 재료로) */
async function aiLetter(){ let sample=null; try{ sample=window.claude&&window.claude.use?await window.claude.use('sample'):null; }catch(e){}
  if(!sample) return; const btn=$('aiL'); btn.hidden=false;
  btn.onclick=async()=>{ btn.disabled=true; btn.textContent='할매가 쓰는 중'; const best=[...F.MO].sort((a,b)=>b.sc-a.sc);
    const card={이름:F.nick,세운:'丁未',올해:['문이 열리는 해','다지고 쌓는 해','바람이 센 해'][F.tier],점수:F.ys,좋은달:best.slice(0,3).map(o=>({월:o.m,기운:SS[o.t1].k,할일:SS[o.t1].do})),조심할달:best.slice(-2).map(o=>({월:o.m,기운:SS[o.t1].k,피할것:SS[o.t1].avoid})),모자란기운:ELX[F.need].n,행운색:ELX[F.need].color,처방:ELX[F.need].acts};
    const prompt=`너는 '삼신 할매'다. 손주에게 쓰는 다정하지만 단호한 반말 편지를 쓴다. 아래 사실 카드에 있는 내용만 쓰고, 없는 예언·숫자·날짜·건강 진단·투자 조언은 절대 만들지 마라. 6~8문장, 한국어, 첫 줄은 "${F.nick}아.", 마지막 문장은 할미가 지켜본다는 말. 물음표·느낌표·말줄임표 금지.\n사실 카드: ${JSON.stringify(card)}`;
    try{ const r=await sample(prompt,{modelTier:'default',onText:({text})=>{ $('ltx').innerHTML=text.split(/\n+/).filter(Boolean).map(p=>`<p>${p}</p>`).join(''); }}); $('ltx').innerHTML=r.text.split(/\n+/).filter(Boolean).map(p=>`<p>${p}</p>`).join(''); $('ainote').hidden=false; btn.hidden=true; }
    catch(e){ btn.disabled=false; btn.textContent='AI로 할매 편지 다시 받기'; } }; }

window.SNPrem={open(){ const host=$('prem'); if(!host) return; host.innerHTML=build(); host.hidden=false; const lk=document.querySelector('.lockS'); if(lk) lk.hidden=true;
  host.querySelectorAll('.mh').forEach(b=>b.onclick=()=>b.parentNode.classList.toggle('open'));
  const first=host.querySelector('.mrow.best'); if(first) first.classList.add('open');
  aiLetter(); }};
})();
