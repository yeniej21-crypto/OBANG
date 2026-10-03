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
 love:()=>{ const e=(stEl(F.dm)+(F.male?2:3))%5, n=F.cnt[e], spouse=S_.tgBranch(F.dm,F.P.d[1]); return `자네에게 인연의 별(${F.male?'재성':'관성'}, ${EL[e]})은 원국에 ${n}개이고, 배우자 자리인 일지에는 ${spouse}이 앉아 있네. ${n===0?'인연의 별이 원국에 없으니 인연은 운에서 들어오는 해와 달에 맺어지네. 그때를 놓치지 않는 것이 중요하네.':n>=3?'인연의 별이 많으니 사람이 잘 붙네. 고르는 눈이 곧 자네 복일세.':'인연의 별이 알맞으니 서두르지 않아도 맞는 사람이 곁에 오네.'} 일지의 ${spouse}은 자네가 가까운 사람에게 바라는 모습이기도 하네.`; },
 people:()=>{ const b=F.cnt[stEl(F.dm)], i=F.cnt[(stEl(F.dm)+4)%5]; return `자네 원국에는 나와 같은 기운(비겁)이 ${b}개, 나를 돕는 기운(인성)이 ${i}개 있네. ${b>=3?'곁에 사람이 많고 경쟁도 많으니, 의리와 선을 함께 지키게.':b===0?'혼자 해내는 힘이 강한 대신 기댈 사람을 일부러 만들어 두어야 하네.':'벗과 동료가 알맞게 있어 서로 힘이 되네.'} ${i>=2?'어른과 스승의 도움이 따르는 사주일세.':'윗사람의 도움보다 자네 손으로 길을 내는 사주일세.'}`; },
 body:()=>`자네 원국에서 가장 넘치는 기운은 ${EL[F.cnt.indexOf(Math.max(...F.cnt))]}, 가장 모자란 기운은 ${EL[F.blank]}일세. 오행으로 보면 ${ORG[F.blank]} 쪽을 아끼라고 하네. ${F.st.strong?'기운이 센 사주라 무리해도 버티지만, 버티는 사이에 쌓이니 쉬는 날을 정해 두게.':'기운을 아껴 쓰는 사주라 잠과 밥이 곧 보약일세.'} 이것은 건강 진단이 아니라 기운의 균형을 본 것이니, 몸이 보내는 신호는 꼭 의사에게 보이게.`};
const AREA_DO={money:['좋은 달에 들어온 돈의 절반은 바로 떼어 두기','큰 지출은 좋은 달로 미루기','조심할 달에는 보증과 투자 쉬기'],work:['내밀 서류는 좋은 달 한 달 전에 준비하기','조심할 달에는 큰 결정을 미루고 실력 다지기','좋은 달에 면담과 제안을 몰아 두기'],love:['좋은 달에는 먼저 연락하기','조심할 달에는 말보다 행동으로 마음 보이기','서운한 일은 그날 안에 풀기'],people:['좋은 달에 미뤄 둔 사람을 만나기','조심할 달에는 돈 거래와 큰 약속 피하기','집안 어른께 안부를 정해 두고 드리기'],body:['조심할 달에는 일정을 비워 두기','같은 시간에 자고 일어나기',`${ELX[F?F.blank:0].acts[0]}`]};
function areaBlock(k,l){ const vals=F.months.map(o=>areaScores(o)[k]); const idx=vals.map((v,i)=>({v,i})); const top=[...idx].sort((a,b)=>b.v-a.v).slice(0,2).map(x=>x.i), low=[...idx].sort((a,b)=>a.v-b.v).slice(0,2).map(x=>x.i);
  const mm=i=>F.months[i].start.m+'월';
  return `<div class="ar2"><div class="arh"><b>${l}</b><span>올해 평균 ${Math.round(vals.reduce((a,b)=>a+b,0)/12)}점</span></div>${bars(vals,top)}
   <p class="p"><b>타고난 결.</b> ${AREA_BASE[k]()}</p>
   <p class="p"><b>올해의 흐름.</b> ${N(C.areas[k].sum)}</p>
   <p class="p"><b>볕이 드는 달은 ${top.map(mm).join('과 ')}일세.</b> ${top.map(i=>{ const o=F.months[i]; return `${mm(i)}은 ${o.gz}월로 천간이 ${o.t1}, 지지가 ${o.t2}이네.`; }).join(' ')} <b>걸음을 늦출 달은 ${low.map(mm).join('과 ')}일세.</b> ${low.map(i=>{ const o=F.months[i]; const r=o.br[0]; return `${mm(i)}은 ${r?`${r.at}와 ${r.k}이 걸리고`:`운성이 ${o.us}이라 기운이 낮고`}`; }).join(', ')} 하니 서두르지 말게.</p>
   <ol class="rxl">${AREA_DO[k].map(a=>`<li>${a}</li>`).join('')}</ol>
   <p class="tip">소헌 선생 · ${N(C.areas[k].tip)}</p></div>`; }
function natureDoc(){ const P=F.P, dm=F.dm, mT=S_.tgBranch(dm,P.m[1]), jh=F.johu, G=S_.tgStem;
  const grpCnt=[0,0,0,0,0]; [P.y,P.m,P.d,P.h].forEach((p,i)=>{ if(!p) return; if(i!==2) grpCnt[S_.rel(dm,stEl(p[0]))]++; grpCnt[S_.relBranch(dm,p[1])]++; });
  const mx=grpCnt.indexOf(Math.max(...grpCnt)), mn=grpCnt.indexOf(Math.min(...grpCnt));
  const nat=F.natal.length?F.natal.map(o=>`<li><b>${o.at} · ${o.k}</b> ${NSS[o.k]||SSM[o.k]||''}</li>`).join(''):'<li>원국에 두드러진 신살이 없네. 신살보다 오행과 십성의 흐름으로 읽는 사주일세.</li>';
  return `<div class="doc"><div class="ch"><em>제5장</em><b>타고난 그릇</b><span>일간 · 월지 · 십성의 분포 · 신살</span></div>
   <p class="p"><b>자네는 ${GAN[dm]}${EL[stEl(dm)]}일세.</b> ${DM_HG[dm]}</p>
   <p class="p"><b>사회에서 쓰는 힘은 ${mT}일세.</b> 태어난 달의 지지 ${JI[P.m[1]]}가 자네에게 ${mT}이 되네. 월지는 사주에서 가장 힘이 센 자리라, 자네가 세상에 나가 일할 때 쓰는 연장이 바로 이것일세. ${TG_SOC[mT]||''}</p>
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
   <p class="p"><b>지금은 ${GAN[cur.s]}${JI[cur.b]} 대운(${cur.age}~${cur.age+9}세)일세.</b> ${DU_T2[cg]}이네. 천간은 자네에게 ${S_.tgStem(F.dm,cur.s)}, 지지는 ${S_.tgBranch(F.dm,cur.b)}이니 ${SS[S_.tgStem(F.dm,cur.s)].good.split('. ')[0]}.</p>
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
