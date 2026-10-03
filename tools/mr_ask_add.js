/* ---------- v3(10/4 아침): 자네가 물은 것 · 한눈에 보는 2027 · 무료 물음 미끼 ---------- */
const TQ={work:'올해 일과 자리는 어떻겠습니까',job:'올해 자리를 옮기거나 내 일을 시작해도 되겠습니까',money:'올해 돈은 언제 모이고 언제 새겠습니까',love:'올해 인연과 결혼은 어떻겠습니까',people:'올해 가족과 가까운 사람과는 어떻겠습니까',body:'올해 몸과 마음은 어디를 아껴야 하겠습니까',move:'올해 이사나 큰 계약은 언제가 좋겠습니까',exam:'올해 시험과 공부는 어떻겠습니까',flow:'올해 한 해의 흐름은 어떻겠습니까'};
const TL={work:'일과 자리',job:'이직 · 창업',money:'재물',love:'인연',people:'가족과 사람',body:'몸과 마음',move:'이사와 계약',exam:'시험과 공부',flow:'한 해의 흐름'};
const TG_OF={work:'w',job:'w',exam:'w',money:'m',love:'l',people:'p',body:'p',move:'v',flow:'w'};
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
 v:['계약과 이사의 날을 이 철 안에서 고르게','집과 조건을 둘러보고 서류를 미리 갖춰 두게','계약서의 조항을 다시 읽고 일정을 맞춰 두게','계약과 이사는 쉬고 짐과 살림을 줄여 두게']};
const QN=['봄','여름','가을','겨울'], QNM=['2~4월','5~7월','8~10월','11~1월'], QST=['움직일 때','준비할 때','살필 때','다질 때'];
function quarters(vals){ const q=[0,1,2,3].map(j=>vals.slice(j*3,j*3+3).reduce((a,b)=>a+b,0)/3); const ord=[0,1,2,3].sort((a,b)=>q[b]-q[a]); const st=[]; ord.forEach((j,r)=>st[j]=r===0?0:r===3?3:(j<ord[0]?1:2)); return q.map((v,j)=>({v:Math.round(v),st:st[j]})); }
function tDays(k,DY,top){ const map={work:DY.deal,money:DY.deal,love:DY.love,move:DY.move,exam:DY.exam}; if(map[k]&&map[k].length) return map[k];
  return top.map(i=>monthDays(F.months[i]).good[0]).filter(Boolean); }
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
  const D=F.DU&&F.DU.list||[]; const du=D.length?`<div class="dub">${D.map(x=>{ const now=F.cur&&x.age===F.cur.age; const g=S_.rel(F.dm,stEl(x.s)), ok=S_.favorable(F.st,g)&&S_.favorable(F.st,S_.relBranch(F.dm,x.b)), half=S_.favorable(F.st,g)||S_.favorable(F.st,S_.relBranch(F.dm,x.b)); return `<div class="${now?'now':''} ${ok?'ok':half?'half':'no'}"><i></i><small>${x.age}</small></div>`; }).join('')}</div><p class="dubc"><span class="ok"><i></i>순풍</span><span class="half"><i></i>반반</span><span class="no"><i></i>맞바람</span><span>붉은 테가 지금 대운</span></p>`:'';
  return `<div class="doc glance"><div class="ch"><em>한눈에</em><b>한눈에 보는 2027</b><span>계산값으로 그린 그림</span></div>
   <div class="gt"><div><small>올해 점수</small><b>${F.ysc}</b><span>/100</span></div><div><small>볕이 가장 드는 달</small><b>${mm(F.months.map((o,i)=>i).sort((a,b)=>F.months[b].sc-F.months[a].sc)[0])}</b></div><div><small>반기는 기운</small><b>${ELX[needI].n}</b></div></div>
   <p class="gcap"><b>열두 달의 흐름.</b> 붉은 점은 볕이 드는 달, 빈 점은 걸음을 늦출 달일세.${topics.length?` 점선은 자네가 물은 ${topics.map(k=>TL[k]).join('과 ')}의 흐름이네.`:''}</p>${lineSvg(series,{label:'2027 열두 달 점수'})}
   ${topics.length?`<p class="lgd"><span class="m"><i></i>전체</span>${topics.slice(0,2).map((k,j)=>`<span class="t${j}"><i></i>${TL[k]}</span>`).join('')}</p>`:''}
   <div class="g2"><div>${pentSvg()}<p class="gcap c">원국의 오행 · 진한 이름이 자네가 반기는 기운</p></div><div class="gr"><p class="gcap"><b>대운 열 해씩.</b></p>${du}<p class="gcap">${F.cur?`지금은 ${GAN[F.cur.s]}${JI[F.cur.b]} 대운, ${F.cur.age}세부터 열 해일세.`:''}</p></div></div></div>`; }
function askDoc(DY){ const topics=(F.ask.topics||[]).filter(k=>TQ[k]), list=topics.length?topics:['flow'], st=F.ask.status, mm=i=>F.months[i].start.m+'월', dl=a=>a.map(x=>`${x.m}월 ${x.d}일 (${DOW[x.w]})`).join(', ');
  const ysG1=S_.rel(F.dm,stEl(F.ys.s)), duG=F.cur?S_.rel(F.dm,stEl(F.cur.s)):null;
  const GRP={work:[3,4],job:[3,1],exam:[4],money:[2],love:[F.male?2:3],people:[0,4],body:[0,4],move:[],flow:[]};
  const one=(k,n)=>{ const R=tRank(k), topS=[...R.top].sort((a,b)=>a-b), lowS=[...R.low].sort((a,b)=>a-b), avg=Math.round(R.vals.reduce((a,b)=>a+b,0)/12), g=TG_OF[k];
    const verdict=avg>=58?'올해는 이 물음에 볕이 넉넉한 해일세.':avg>=51?'때를 골라 움직이면 풀리는 해일세.':'서두르기보다 다지면서 때를 기다리는 해일세.';
    const base=k==='job'||k==='work'?AREA_BASE.work():k==='money'?AREA_BASE.money():k==='love'?AREA_BASE.love():k==='people'?AREA_BASE.people():k==='body'?AREA_BASE.body():k==='exam'?`자네 원국에서 배움의 기운(인성)은 ${F.cnt[(stEl(F.dm)+4)%5]}개일세. ${F.cnt[(stEl(F.dm)+4)%5]>=2?'배운 것이 몸에 잘 붙는 사주라 꾸준함이 곧 합격일세.':'배움의 기운이 적은 편이라 혼자 하기보다 틀이 있는 공부가 잘 맞네.'}`:k==='move'?`${F.natal.some(x=>x.k==='역마')?'자네 원국에는 역마가 있어 움직일 때 운이 트이는 사주일세.':'자네 원국에는 역마가 없어 자주 옮기기보다 한 번 옮길 때 제대로 고르는 편이 맞네.'}`:`자네는 ${F.st.label}한 사주이고, 올해 점수는 ${F.ysc}점일세.`;
    const yr=GRP[k]&&GRP[k].includes(ysG1)?`올해 천간 ${F.ys.t1}${bt(F.ys.t1)?'이':'가'} 바로 이 물음의 기운이라, 한 해 내내 이 일이 마음에 걸리고 그만큼 움직임도 크네.`:`올해의 기운은 ${F.ys.t1}과 ${F.ys.t2}라, 이 물음은 한 해 전체보다 달을 골라 푸는 편이 맞네.`;
    const du=F.cur?(GRP[k]&&GRP[k].includes(duG)?`지금 대운도 이 물음과 같은 기운이라 올해의 결정이 열 해를 좌우하네.`:`지금 ${GAN[F.cur.s]}${JI[F.cur.b]} 대운은 ${DU_T2[duG]}이니, 이 물음도 그 큰 흐름 안에서 보게.`):'';
    const Q=quarters(R.vals), days=tDays(k,DY,R.top);
    return `<div class="tqa"><p class="tq"><span>물음 ${['하나','둘'][n]}</span>${TQ[k]}</p>
     <p class="vd">${topS.map(mm).join('과 ')}에 움직이고, ${lowS.map(mm).join('과 ')}에는 걸음을 늦추게. ${verdict}</p>
     ${lineSvg([{v:R.vals,hi:R.top,lo:R.low}],{h:132,label:TL[k]+' 열두 달'})}
     <p class="p"><b>왜 그렇게 보는가.</b> ${base} ${yr} ${du}</p>
     <p class="p"><b>볕이 드는 달.</b> ${pair(topS,i=>why(tPos(k,F.months[i]),'사주가 반기는 기운이 드네'))} <b>걸음을 늦출 달.</b> ${pair(lowS,i=>why(tNeg(k,F.months[i]),'사주가 반기지 않는 기운이 드네'))}</p>
     ${st&&STX[st]?`<p class="p"><b>자네 사정에 대어 보면.</b> ${STX[st][g]||STX[st].w}</p>`:''}
     <table class="qp" data-hj="0">${Q.map((q,j)=>`<tr class="s${q.st}"><th>${QN[j]}<small>${QNM[j]}</small></th><td><b>${QST[q.st]}</b>${QACT[g][q.st]}</td></tr>`).join('')}</table>
     ${days.length?`<p class="p"><b>고른 날.</b> ${dl(days)}. 자네 원국과 부딪히지 않고 이 물음의 기운이 반기는 날일세.</p>`:''}</div>`; };
  const w=F.ask.worry;
  const wq=w?`<div class="wq"><small>자네가 적은 사연</small><p>${String(w).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</p></div>${C.qa&&C.qa.length?C.qa.map(p=>`<p class="p">${N(p)}</p>`).join(''):`<p class="p">사연은 잘 읽었네. 위의 흐름을 자네 사정에 대어 보면, ${[...tRank(list[0]).top].sort((a,b)=>a-b).map(mm).join('과 ')}에 마음을 정하고 그 전 달에는 정할 거리를 모아 두는 것이 순서일세. 더 깊이 묻고 싶은 대목은 아래 '소헌 선생에게 묻기'에서 이 사연을 그대로 물어보게.</p>`}`:'';
  return `<div class="doc askd"><div class="ch"><em>제5장</em><b>자네가 물은 것</b><span>${topics.length?'의뢰서에 적은 물음부터 답하네':'물음을 고르지 않아 한 해의 흐름부터 답하네'}</span></div>${list.map(one).join('')}${wq}</div>`; }
/* 무료 미끼: 물음의 실마리만 보이고 답은 봉투 안에 */
function teaserHTML(){ const topics=(F.ask.topics||[]).filter(k=>TQ[k]), list=topics.length?topics:['flow'], half=i=>i<6?'상반기':'하반기';
  const one=k=>{ const R=tRank(k), t=[...R.top].sort((a,b)=>a-b); const sameHalf=half(t[0])===half(t[1]);
    return `<div class="tz"><p class="tq">${TQ[k]}</p>${lineSvg([{v:R.vals}],{h:96,nolab:1,label:TL[k]+' 흐름'})}<p class="p">자네가 물은 ${TL[k]}, 볕이 드는 달은 두 번 오네. ${sameHalf?`두 달 모두 ${half(t[0])}에 있네.`:`한 번은 상반기, 한 번은 하반기에 있네.`} 몇 월 며칠인지, 그달에 무엇을 하고 무엇을 미룰지는 봉투 안 첫 장에 적어 두었네.</p></div>`; };
  const w=F.ask.worry;
  return `<div class="ch"><em>물음</em><b>자네가 물은 것</b><span>실마리만 먼저 보이네</span></div>${list.map(one).join('')}${w?`<p class="p">적어 준 사연도 읽었네. 그 사연에는 봉투 안에서 따로 답하겠네.</p>`:''}`; }
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
.dub .ok i{background:var(--seal);opacity:.8}.dub .half i{background:var(--earth);opacity:.5}.dub .now i{outline:2px solid var(--seal);outline-offset:1px;opacity:1}.dub small{font-size:9.5px;color:var(--ink-3)}
.dubc{display:flex;flex-wrap:wrap;gap:4px 10px;margin:0 0 8px;font-size:10.5px;color:var(--ink-3)}.dubc i{display:inline-block;width:9px;height:9px;margin-right:3px;vertical-align:-1px;background:var(--ink-3);opacity:.35}.dubc .ok i{background:var(--seal);opacity:.8}.dubc .half i{background:var(--earth);opacity:.5}
.tqa{padding:4px 0 16px}.tqa+.tqa{border-top:1px solid var(--rule);padding-top:16px}
.tq{margin:0 0 6px;font-family:var(--serif);font-size:16px;font-weight:900;line-height:1.5}.tq span{display:block;font-size:11px;letter-spacing:.14em;color:var(--seal);margin-bottom:2px}
.vd{margin:0 0 8px;padding:10px 12px;background:var(--seal-bg);border-left:3px solid var(--seal);font-family:var(--serif);font-size:15px;font-weight:700;line-height:1.65}
table.qp{width:100%;border-collapse:collapse;margin:6px 0 10px;border-top:1px solid var(--ink);border-bottom:1px solid var(--ink)}
.qp th{width:62px;padding:9px 0;text-align:left;vertical-align:top;font-family:var(--serif);font-size:14px;border-bottom:1px solid var(--rule-2)}.qp th small{display:block;font-size:10.5px;font-weight:500;color:var(--ink-3)}
.qp td{padding:9px 0;font-size:13.5px;line-height:1.6;border-bottom:1px solid var(--rule-2)}.qp td b{display:block;font-size:12px;color:var(--ink-3)}.qp tr.s0 td b,.qp tr.s0 th{color:var(--seal)}
.wq{margin:16px 0 10px;padding:12px 14px;border:1px solid var(--rule)}.wq small{display:block;font-size:11px;font-weight:700;color:var(--seal);letter-spacing:.1em}.wq p{margin:4px 0 0;font-family:var(--serif);font-size:15px;line-height:1.6}
.tz{padding:2px 0 10px}.tz+.tz{border-top:1px solid var(--rule-2);padding-top:12px}`;
