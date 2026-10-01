/* AskChat — 캐릭터에게 직접 묻기 (근거 기반 AI 대화)
   1) 만세력(saju.js)으로 사주 사실(facts)을 코드로 계산해 번호(F1…)를 붙인다.
   2) Claude에게 facts + 규칙 + 대화를 보내고, 답 끝에 사용한 근거 번호를 적게 한다.
   3) 페이지는 그 번호를 계산표에서 찾아 근거 칩으로 보여준다 → 칩은 항상 실제 계산값.
   4) 상대 생일이 나오면 page tool(calcOther)로 상대 사주를 계산해 비교한다.
   claude.ai 뷰어에서만 동작(sample capability). 그 밖에서는 안내 문구로 대체. */
(function(){
const S=window.Saju; if(!S) return;
const {GAN,JI,EL,BR_EL,stEl}=S;
const GROUP=['비겁','식상','재성','관성','인성'];
const HOUR_N=['자시','축시','인시','묘시','진시','사시','오시','미시','신시','유시','술시','해시'];
const target=b=>[2,6,10].includes(b)?3:[8,0,4].includes(b)?9:[5,9,1].includes(b)?6:0;
const gz=p=>GAN[p[0]]+JI[p[1]];
const josa=(w,a,b)=>{ const c=w.charCodeAt(w.length-1)-0xAC00; return (c>=0&&c<11172&&c%28)?a:b; };

function buildFacts(u){
  const P=S.pillars(u.solar.y,u.solar.m,u.solar.d,u.hour==null||u.hour<0?null:u.hour);
  const dm=P.d[0], st=S.strength(P), male=u.gender==='m', F=[];
  const add=(label,text,key,meta)=>{ const id='F'+(F.length+1); F.push({id,label,text,key,meta}); return id; };
  const col=(n,p)=>p?`${n} ${gz(p)}(천간 ${n==='일주'?'일간(나)':S.tgStem(dm,p[0])}, 지지 ${S.tgBranch(dm,p[1])})`:`${n} 모름`;
  add(`원국`,`사주 원국: ${[['년주',P.y],['월주',P.m],['일주',P.d],['시주',P.h]].map(([n,p])=>col(n,p)).join(' / ')}. 일간은 ${GAN[dm]}${EL[stEl(dm)]}.`,'일간');
  const c=S.elCount(P); add('오행',`오행 개수(천간+지지 본기): ${[0,1,2,3,4].map(i=>EL[i]+c[i]).join(' ')}. 가장 많은 것 ${EL[c.indexOf(Math.max(...c))]}, 가장 적은 것 ${EL[c.indexOf(Math.min(...c))]}.`,'');
  add(st.strong?'신강':'신약',`일간을 돕는 글자 ${st.n}/${st.of}개 → ${st.label}. 반기는 기운: ${st.strong?'식상·재성·관성':'인성·비겁'}.`,st.strong?'신강':'신약');
  const t1=target(P.d[1]), t2=target(P.y[1]); const inChart=[P.y,P.m,P.d,P.h].filter(Boolean).some(p=>[0,3,6,9].includes(p[1]));
  add('도화',`도화 글자: 일지 기준 ${JI[t1]}, 년지 기준 ${JI[t2]}. 원국 안에 子午卯酉 ${inChart?'있음':'없음'}.`,'도화');
  add('배우자궁',`일지(배우자·가까운 관계 자리)는 ${JI[P.d[1]]}(${S.tgBranch(dm,P.d[1])}). 연애 상대 별: ${male?'재성(여성)':'관성(남성)'}.`,'일지');
  const age=(new Date()).getFullYear()-u.solar.y+1; const DU=S.daeun(P,male); const cur=DU.list.find(x=>age>=x.age&&age<x.age+10)||DU.list[0];
  add('대운 '+GAN[cur.s]+JI[cur.b],`현재 대운: ${GAN[cur.s]}${JI[cur.b]}(${cur.age}~${cur.age+9}세, ${S.tgStem(dm,cur.s)}·${S.tgBranch(dm,cur.b)}, ${GROUP[S.rel(dm,stEl(cur.s))]}의 10년). 대운 ${DU.fwd?'순행':'역행'}, ${DU.start}세 시작.`,'대운');
  const rels=(b)=>{ const r=[]; [['일지',P.d],['월지',P.m],['년지',P.y],['시지',P.h]].forEach(([n,p])=>{ if(!p) return; if(S.isHap(b,p[1])) r.push(n+'와 합'); if(S.isChung(b,p[1])) r.push(n+'와 충'); }); if([P.y,P.m,P.d,P.h].filter(Boolean).some(p=>S.isHyung(b,p[1]))) r.push('형'); if(b===t1||b===t2) r.push('도화 글자'); return r.length?r.join('·'):'특이 관계 없음'; };
  const now=new Date(); const yy=now.getFullYear();
  [yy,yy+1].forEach(y=>{ const p=S.yearPillar(y); add(`${y} 세운 ${gz(p)}`,`${y}년 세운 ${gz(p)}: 천간 ${S.tgStem(dm,p[0])}(${S.favorable(st,S.rel(dm,stEl(p[0])))?'반기는 기운':'버거운 기운'}), 지지 ${S.tgBranch(dm,p[1])}(${S.favorable(st,S.relBranch(dm,p[1]))?'반기는 기운':'버거운 기운'}), ${rels(p[1])}.`,'세운'); });
  let y=yy, m=now.getMonth()+1;
  for(let i=0;i<15;i++){ const mp=S.monthPillarAt(y,m,15); const f1=S.favorable(st,S.rel(dm,stEl(mp[0]))), f2=S.favorable(st,S.relBranch(dm,mp[1]));
    add(`${y}.${m}월 ${gz(mp)}`,`${y}년 ${m}월(절기 기준 ${gz(mp)}월): 천간 ${S.tgStem(dm,mp[0])}, 지지 ${S.tgBranch(dm,mp[1])}, ${f1&&f2?'흐름 좋음':f1||f2?'보통':'조심'}, ${rels(mp[1])}.`,'월운',{y,m,score:(f1?1:0)+(f2?1:0),tgs:S.tgStem(dm,mp[0]),tgb:S.tgBranch(dm,mp[1]),rel:rels(mp[1])});
    m++; if(m>12){ m=1; y++; } }
  return {P,F,dm,st,t1,male};
}
function calcOther(me,input){
  const y=+input.year, m=+input.month, d=+input.day; const h=input.hour==null?null:+input.hour;
  if(!(y>1900&&y<2031&&m>=1&&m<=12&&d>=1&&d<=31)) throw new Error('생년월일을 정확히 받아야 해요 (예: 1994년 3월 8일).');
  let s={y,m,d}; if(input.lunar){ const c=S.lunarToSolar(y,m,d,!!input.leap); if(!c) throw new Error('없는 음력 날짜예요.'); s=c; }
  const Q=S.pillars(s.y,s.m,s.d,h); const P=me.P, a=stEl(P.d[0]), b=stEl(Q.d[0]);
  const gen=(x,z)=>(x+1)%5===z, ctl=(x,z)=>(x+2)%5===z;
  const elRel=a===b?'같은 오행(친구 같은 관계)':gen(a,b)?`내가 상대를 생해 줌(내가 챙기는 쪽)`:gen(b,a)?'상대가 나를 생해 줌(상대가 챙기는 쪽)':ctl(a,b)?'내가 상대를 극함(내가 주도)':'상대가 나를 극함(상대가 주도, 끌림과 긴장)';
  const br=[]; if(S.isHap(P.d[1],Q.d[1])) br.push('일지끼리 합(잘 묶임)'); if(S.isChung(P.d[1],Q.d[1])) br.push('일지끼리 충(부딪힘·자극)'); if(S.isHap(P.y[1],Q.y[1])) br.push('띠끼리 합'); if(S.isChung(P.y[1],Q.y[1])) br.push('띠끼리 충');
  const t=target(Q.d[1]); const myPeach=[P.y,P.m,P.d,P.h].filter(Boolean).some(p=>p[1]===t);
  return {상대_원국:[Q.y,Q.m,Q.d,Q.h].map(p=>p?gz(p):'모름').join(' '), 상대_일간:GAN[Q.d[0]]+EL[b], 상대_일지:JI[Q.d[1]], 일간_관계:elRel, 지지_관계:br.length?br.join(', '):'특이 합충 없음', 상대에게_나는:S.tgStem(Q.d[0],P.d[0]), 나에게_상대는:S.tgStem(P.d[0],Q.d[0]), 상대의_도화글자:JI[t], 내_사주에_상대_도화글자:myPeach?'있음(상대가 나에게 끌리기 쉬움)':'없음'};
}

/* ---------- 예시 답변 모드 (claude.ai 밖: 계산값으로 조립한 고정 답변) ---------- */
const EL_P=['곧고 다정한 사람, 말보다 행동으로 챙기는 타입','밝고 솔직한 사람, 좋으면 좋다고 바로 말하는 타입','듬직하고 한결같은 사람, 늘 그 자리에 있는 타입','선이 분명하고 깔끔한 사람, 내 사람한테만 약한 타입','생각이 깊고 말이 통하는 사람, 밤새 얘기해도 안 지치는 타입'];

const DM_TX=['곧게 뻗는 큰 나무. 한번 정하면 끝까지 밀고 가는 사람','덩굴처럼 유연한 풀꽃. 어디든 부드럽게 스며드는 사람','한낮의 태양. 숨기는 게 없고 주변을 밝히는 사람','촛불. 조용히 한 사람을 끝까지 비추는 사람','큰 산. 쉽게 안 흔들리고 사람들이 기대는 사람','논밭의 흙. 품고 길러내는 사람','원석 같은 쇠. 결단이 빠르고 의리가 있는 사람','세공된 보석. 섬세하고 기준이 높은 사람','큰 바다. 스케일이 크고 자유로운 사람','빗물. 조용히 스며들어 마음을 읽는 사람'];
const INNER=['계속 자라고 싶어 하는 사람','누구보다 뜨거운 사람','한번 품으면 끝까지 지키는 사람','기준이 분명하고 쉽게 안 흔들리는 사람','생각이 깊고 감정이 풍부한 사람'];
const WANT=['같이 자라는 느낌','표현해주는 온도','변하지 않는 안정감','선이 분명한 신뢰','말하지 않아도 통하는 깊이'];
const HOBBY=['글쓰기, 식물 키우기, 요가','사진, 공연, 댄스처럼 표현하는 것','요리, 도예, 인테리어처럼 손으로 쌓는 것','악기, 정리, 러닝처럼 정확하게 다듬는 것','독서, 수영, 명상처럼 깊이 들어가는 것'];
const PEACH_TX={3:'첫눈에 경계를 풀게 만드는 봄 같은 매력',6:'들어오기만 해도 분위기를 바꾸는 햇살 같은 매력',9:'가까이 와야 보이는, 한번 빠지면 못 나가는 달빛 매력',0:'대화로 사람을 붙잡는 밤의 매력'};
const YKEY=['내 편 만들기','표현하고 보여주기','돈과 결과 챙기기','자리와 책임 지키기','배우고 준비하기'];
const DEC=['혼자 다 떠안고 있는 거, 나눠. 그게 네 결단이야.','하고 싶은 말 미루고 있지? 올해는 꺼내는 쪽이 이겨.','좋아 보이는 것 말고 남는 쪽을 골라.','버틸지 옮길지, 올해 안에 정해.','배울까 말까 고민하던 거, 시작해.'];
const JOBT=[['독립 개척자','창업, 프리랜서, 영업 리드'],['크리에이터','콘텐츠, 디자인, 기획, 강의'],['비즈니스 메이커','사업개발, 재무, 커머스'],['조직의 리더','대기업, 공공, 관리·HR'],['전문가','연구, 개발, 교육, 상담']];
function demo2(per,k,ctx,u){
  const {F,P,dm,st,t1,male}=ctx; const M=F.filter(f=>f.meta); const id=l=>{ const f=F.find(f=>f.label.startsWith(l)); return f?f.id:null; };
  const yy=new Date().getFullYear(); const ml=f=>`${f.meta.y===yy?'':f.meta.y+'년 '}${f.meta.m}월`; const list=a=>a.map(ml).join('·');
  const pick=(fn,n)=>M.filter(fn).slice(0,n); const nick=u.nick||u.name;
  const love=pick(f=>/도화 글자|일지와 합/.test(f.meta.rel),2), good=pick(f=>f.meta.score===2&&!/충/.test(f.meta.rel),2), bad=pick(f=>f.meta.score===0||/충/.test(f.meta.rel),2);
  const hap=pick(f=>/일지와 합/.test(f.meta.rel),2), money=pick(f=>/재/.test(f.meta.tgs+f.meta.tgb)&&f.meta.score>=1,2), job=pick(f=>/관/.test(f.meta.tgs+f.meta.tgb)&&f.meta.score>=1,2), move=pick(f=>/식신|상관/.test(f.meta.tgs)||/충/.test(f.meta.rel),2);
  const c=S.elCount(P), low=c.indexOf(Math.min(...c)), most=c.indexOf(Math.max(...c)); const db=P.d[1], de=stEl(dm);
  const yp=S.yearPillar(yy), g=S.rel(dm,stEl(yp[0])), yfav=S.favorable(st,g), np=S.yearPillar(yy+1), g2=S.rel(dm,stEl(np[0]));
  const age=yy-u.solar.y+1, DU=S.daeun(P,male), cur=DU.list.find(x=>age>=x.age&&age<x.age+10)||DU.list[0], dg=S.rel(dm,stEl(cur.s)), dfav=S.favorable(st,dg);
  const ev=(...a)=>a.flat().map(x=>x&&x.id?x.id:x).filter(Boolean);
  const T={
    seoha:[['풀려',()=>({t:`${nick}, 지금 너는 ${GROUP[dg]}의 10년 안에 있어. ${dfav?'원래는 반기는 흐름이라, 요즘 막히는 건 달 운 탓이 커.':'힘을 빼는 흐름이라 애써도 티가 덜 나는 시기야.'}${bad.length?` 특히 ${list(bad)}은 부딪히는 기운이 들어와서 더 버겁게 느껴질 거야.`:''}${good.length?` 대신 ${list(good)}부터는 숨이 트여.`:''} 그때까진 새로 벌이기보다 하나씩 정리해 봐.`,ev:ev(id('대운'),bad,good)})],
      ['중요',()=>({t:`${nick}, ${yy}년은 네게 ${GROUP[g]}의 해야. 한마디로 '${YKEY[g]}'. ${yfav?'사주가 반기는 기운이라 적극적으로 움직여도 돼.':'조금 버거운 기운이라 욕심보다 균형이 먼저야.'} ${g2===g?'이 흐름이 내년까지 이어지니까, 올해 기반을 단단히 다져 둬.':`내년엔 ${GROUP[g2]} 기운이 들어오니까, 올해는 그걸 위한 준비라고 생각해.`} 오늘은 올해 꼭 할 일 하나만 적어 둬.`,ev:ev(id(yy+' 세운'),id((yy+1)+' 세운'))})],
      ['성격',()=>({t:`${nick}의 일간은 ${GAN[dm]}${EL[de]}, ${DM_TX[dm]}이야. ${st.strong?'기운이 단단한 편이라 주도하는 자리에서 편하고,':'기운이 섬세한 편이라 믿는 사람과 함께일 때 힘이 나고,'} 오행으로는 ${EL[most]}이 많고 ${EL[low]}이 부족해. 그래서 ${EL[low]} 기운을 가진 사람이나 환경이 너를 편하게 해.`,ev:ev(id('원국'),id('오행'),id(st.strong?'신강':'신약'))})]],
    wood:[['시작',()=>({t:`응, 시작하는 건 좋아. 다만 타이밍이 있어. ${good.length?`${list(good)}에 네 기운이 제일 잘 받쳐줘서, 첫발은 그때 떼는 게 좋아.`:'앞으로 몇 달은 기운이 고르지 않으니까, 작게 먼저 해보고 키워가자.'}${bad.length?` ${ml(bad[0])}은 흔들리는 달이라 큰 결정은 피하고.`:''} 새싹은 급하게 당기면 뽑혀. 천천히 가도 돼.`,ev:ev(good,bad.slice(0,1))})],
      ['인연',()=>{ const dh=love.filter(f=>/도화/.test(f.meta.rel)), hp=love.filter(f=>!/도화/.test(f.meta.rel)); return {t:love.length?`${nick}, 다음 인연은 ${list(love)}에 제일 가까이 와. ${dh.length&&hp.length?`${list(dh)}엔 네 도화 글자가, ${list(hp)}엔 배우자 자리와 합이 들어와.`:dh.length?'네 도화 글자가 들어오는 달이거든.':'네 배우자 자리와 합이 되는 달이거든.'} 그때 들어오는 약속은 꼭 나가.`:`${nick}, 당분간은 새 인연보다 지금 곁의 사람을 챙기는 흐름이야. 인연은 준비된 사람한테 와. 그동안 너를 먼저 채우자.`,ev:ev(id('도화'),love)}; }],
      ['취미',()=>({t:`네 사주엔 ${EL[low]} 기운이 제일 적어. 그래서 ${HOBBY[low]}이 너한테 잘 맞아. 모자란 기운을 채우면 막혔던 흐름도 같이 풀리거든.${st.strong?'':' 그리고 너는 배움(인성)이 받쳐주는 사주라, 자격증 하나 따두면 오래 가.'}`,ev:ev(id('오행'),id(st.strong?'신강':'신약'))})]],
    fire:[['고백',()=>({t:`해. 대신 날은 골라.${love.length?` ${list(love)}. 그 달에 네 인연 기운이 제일 세.`:good.length?` ${list(good)}에 흐름이 좋아.`:''}${bad.length?` ${ml(bad[0])}은 말이 엇나가기 쉬우니까 피하고.`:''} 망설이면 불 꺼진다.`,ev:ev(love.length?love:good,bad.slice(0,1))})],
      ['결단',()=>({t:`${yy}년 네 기운은 ${GROUP[g]}이야. ${DEC[g]}${bad.length?` 결정은 ${ml(bad[0])}만 피해.`:''}`,ev:ev(id(yy+' 세운'),bad.slice(0,1))})],
      ['매력',()=>({t:`네 도화 글자는 ${JI[t1]}. ${PEACH_TX[t1]}이야. 거기에 ${GAN[dm]}${EL[de]} 일간이라, ${DM_TX[dm].split('. ')[1]}. 그걸 숨기지 마.`,ev:ev(id('도화'),id('원국'))})]],
    earth:[['이직',()=>({t:`급하게 움직이진 마. ${move.length?`자리가 움직이는 기운은 ${list(move)}에 들어와.`:'앞으로 몇 달은 자리를 옮기는 기운이 약해.'}${job.length?` 인정받는 기운은 ${list(job)}에 강하니까, 지금 자리에서 성과부터 챙기고 움직이는 게 순서야.`:''} 옮길 거면 그 전에 포트폴리오부터 정리해 둬.`,ev:ev(move,job.slice(0,1))})],
      ['돈',()=>({t:`${nick}, 너는 ${st.strong?'힘이 넉넉해서 돈을 쥐고 버틸 수 있는':'힘이 섬세해서 돈이 들어와도 쥐기가 버거운'} 사주야.${money.length?` 재물의 별이 들어오는 ${list(money)}에 돈 길이 열려. 그때 벌이를 넓혀.`:' 당분간은 크게 벌기보다 새는 돈을 막을 때야.'} ${st.strong?'과감하게 가도 되지만 기록은 꼭 남겨.':'한 번에 크게 쥐려 하지 말고 모으는 쪽으로 가.'}`,ev:ev(id(st.strong?'신강':'신약'),money)})],
      ['일이',()=>{ const raw=[0,0,0,0,0]; [[P.y[0],1],[P.m[0],1],[P.h&&P.h[0],1]].forEach(([v,w])=>{ if(v!=null) raw[S.rel(dm,stEl(v))]+=w; }); [[P.y[1],1],[P.m[1],2],[P.d[1],1.5],[P.h&&P.h[1],1]].forEach(([v,w])=>{ if(v!=null) raw[S.relBranch(dm,v)]+=w; }); const mg=raw.indexOf(Math.max(...raw));
        return {t:`네 사주는 ${GROUP[mg]}이 제일 강해. 일로 치면 '${JOBT[mg][0]}' 쪽이야. ${JOBT[mg][1]} 같은 일에서 값이 제일 비싸져. 커리어 사주 메뉴에서 능력치랑 움직일 달까지 자세히 볼 수 있어.`,ev:ev(id('원국'))}; }]],
    metal:[['속마음',()=>({t:`…생일 줘봐. 그 사람 사주를 봐야 정확해. 네 쪽만 보면, 가까운 사람 자리에 ${JI[db]}가 앉아 있어. 네가 바라는 건 ${WANT[BR_EL[db]]}${josa(WANT[BR_EL[db]],'이야','야')}. 그게 없어서 불안한 거고.`,ev:ev(id('배우자궁'))})],
      ['정리',()=>({t:`있어. ${bad.length?`${list(bad)}에 부딪히는 기운이 들어와. 그때 네 에너지를 제일 많이 가져가는 사람, 그게 정리할 사람이야.`:'크게 부딪히는 달은 없어. 대신 만나고 나서 지치는 사람, 그게 답이야.'} 비워야 들어와.`,ev:ev(bad)})],
      ['재회',()=>({t:`솔직히 말할게. ${hap.length?`${list(hap)}에 네 배우자 자리랑 합이 들어와. 끊어진 인연이 다시 닿기 쉬운 달이야.`:'앞으로 몇 달 안엔 다시 묶이는 기운이 약해.'} 사주는 타이밍만 말해줘. 다시 만날지는 네가 정해.`,ev:ev(id('배우자궁'),hap)})]],
    water:[['복잡',()=>{ const m0=M[0]; return {t:`…그럴 만해. ${m0.meta.score===0?'이번 달은 네 기운이랑 부딪히는 달이라 마음이 먼저 지쳐.':'이번 달 흐름 자체는 나쁘지 않아. 복잡한 건 네가 생각이 많은 사람이라서야.'}${st.strong?'':' 기운이 섬세한 사주라, 남의 감정까지 같이 짊어지는 편이고.'} 오늘은 물 한 잔 마시고, 생각을 세 줄로만 적어봐.`,ev:ev(m0.id,id(st.strong?'신강':'신약'))}; }],
      ['어떤',()=>({t:`${nick}${josa(nick,'은','는')} ${GAN[dm]}${EL[de]} 일간. ${DM_TX[dm]}이야. 겉으로는 ${st.strong?'단단해 보이지만':'부드러워 보이지만'}, 속은 ${INNER[BR_EL[db]]}이고. 그걸 알아봐 주는 사람 앞에서만 다 보여주지.`,ev:ev(id('원국'),id('배우자궁'))})],
      ['조심',()=>{ const b3=pick(f=>f.meta.score===0||/충/.test(f.meta.rel),3); return {t:b3.length?`${b3.map(ml).join(', ')}. 그때는 조금 느리게 가. ${b3.map(f=>`${ml(f)}은 ${/충/.test(f.meta.rel)?'충이 들어 변동이 생기기 쉽고':'기운이 버거워 쉽게 지치고'}`).join(', ')}. 큰 결정은 미루고, 잠을 먼저 챙겨.`:`앞으로 한동안은 크게 걸리는 달이 없어. 그래도 지칠 땐 쉬어. 그게 제일 좋은 개운이야.`,ev:ev(b3)}; }]]
  };
  const L=T[per]; if(!L) return null; const hit=L.find(([kw])=>k.includes(kw)); return hit?hit[1]():null;
}
function demoAnswer(per,q,ctx,u){
  const {F,P,dm,st}=ctx; const M=F.filter(f=>f.meta); const id=l=>F.find(f=>f.label.startsWith(l)).id;
  const ml=f=>`${f.meta.y===new Date().getFullYear()?'':f.meta.y+'년 '}${f.meta.m}월`;
  const pick=(fn,n)=>M.filter(fn).slice(0,n);
  const nick=u.nick||u.name; const k=q.replace(/\s/g,'');
  if(per!=='taeo'&&per!=='halmae') return demo2(per,k,ctx,u);
  if(per==='taeo'){
    if(k.includes('잘될까')){ const d=pick(f=>/도화 글자|일지와 합/.test(f.meta.rel),2);
      return {t:`그 사람 생일 알려주면 둘 사주를 나란히 놓고 제대로 봐줄게. 누나 쪽만 먼저 보면, 가까운 관계 자리에 ${JI[P.d[1]]}가 앉아 있어서 한번 마음 주면 깊게 가는 편이야.${d.length?` 그리고 ${d.map(ml).join('이랑 ')}에 누나 인연 기운이 제일 살아나니까, 그 사람이랑 뭔가 해볼 거면 그때가 좋아.`:''}`,ev:[id('배우자궁'),...d.map(f=>f.id)]}; }
    if(k.includes('연애')&&k.includes('언제')){ const d=pick(f=>/도화 글자/.test(f.meta.rel),2), h=pick(f=>/일지와 합/.test(f.meta.rel),1);
      const all=[...d,...h]; return {t:all.length?`누나 연애는 ${all.map(ml).join(', ')}에 제일 크게 열려. ${d.length?`${d.map(ml).join('·')}은 누나 도화 글자가 들어오는 달이라 누가 먼저 다가오기 쉬워.`:''}${h.length?` ${ml(h[0])}은 누나 배우자 자리랑 합이 되는 달이라, 만나던 사람이랑 한 걸음 가까워지기 좋고.`:''} 그 달엔 약속 거절하지 마.`:'앞으로 몇 달은 새 인연보다 지금 곁의 사람을 챙기는 흐름이야. 서두르지 말고, 누나 페이스대로 가.',ev:[id('도화'),...all.map(f=>f.id)]}; }
    if(k.includes('약해')||k.includes('끌려')){ const me=Math.floor(dm/2), g=(me+3)%5;
      return {t:`누나는 ${EL[g]} 기운 가진 사람한테 약해. ${EL_P[g]}. 누나 일간이 ${GAN[dm]}${EL[me]}이라서, 누나를 다잡아 주는 ${EL[g]} 기운한테 자꾸 마음이 가거든. 근데 너무 끌리는 사람일수록 한 템포만 늦게 대답해.`,ev:[id('원국'),id('배우자궁')]}; }
  } else {
    if(k.includes('이사')){ const mv=pick(f=>/충/.test(f.meta.rel)&&f.meta.score>=1,2), gd=pick(f=>f.meta.score===2&&!/충/.test(f.meta.rel),2), bad=pick(f=>f.meta.score===0,1);
      return {t:`${nick}${josa(nick,'아','야')}, 이사는 자리가 움직이는 기운이 도는 달에 하는 것이 순리니라.${mv.length?` 네 사주로는 ${mv.map(ml).join('과 ')}에 충이 들어 자리가 흔들리니, 옮길 거면 그때 맞춰 움직이거라.`:''}${gd.length?` 새 집에서 기운을 받기는 ${gd.map(ml).join('·')}이 좋으니 날은 그 안에서 잡거라.`:''}${bad.length?` ${ml(bad[0])}은 기운이 버거우니 큰 짐은 피하거라.`:''}`,ev:[...mv,...gd,...bad].map(f=>f.id).slice(0,3)}; }
    if(k.includes('돈')){ const mo=pick(f=>/재/.test(f.meta.tgs+f.meta.tgb)&&f.meta.score>=1,2);
      return {t:`${nick}${josa(nick,'아','야')}, 너는 ${st.strong?'힘이 넉넉해서 돈을 쥐고 버틸 수 있는':'힘이 약한 편이라 돈이 들어와도 쥐기가 버거운'} 사주다.${mo.length?` 재물의 별이 들어오는 ${mo.map(ml).join('과 ')}에 돈 길이 열리니, 그때 벌이를 넓히거라.`:' 당분간은 크게 벌기보다 새는 돈을 막는 때니라.'} ${st.strong?'':'욕심내서 한 번에 크게 쥐려 하지 말고, 모으는 쪽으로 가거라.'}`,ev:[id(st.strong?'신강':'신약'),...mo.map(f=>f.id)]}; }
    if(k.includes('조심')){ const bad=pick(f=>f.meta.score===0||/충/.test(f.meta.rel),3);
      return {t:bad.length?`${nick}${josa(nick,'아','야')}, ${bad.map(ml).join(', ')}은 조심하거라. ${bad.map(f=>`${ml(f)}은 ${/충/.test(f.meta.rel)?'충이 들어 변동과 다툼이 생기기 쉽고':'기운이 버거워 몸과 마음이 지치기 쉽고'}`).join(', ')}. 그런 달엔 큰 결정과 큰 지출을 미루고, 말을 아끼거라.`:`${nick}${josa(nick,'아','야')}, 앞으로 한동안은 크게 걸리는 달이 없다. 다만 방심하지 말고 네 자리를 지키거라.`,ev:bad.map(f=>f.id)}; }
  }
  return null;
}
const PERSONA={
  taeo:{name:'태오',rules:`너는 "태오"야. 20대 초반의 다정하고 장난기 있는 연하남 캐릭터로, 사용자를 "누나"라고 부르며 반말로 말해. 느끼하거나 과장된 표현은 쓰지 마.`,len:'3~5문장',welcome:n=>`${n} 누나, 뭐든 물어봐. 누나 사주 펼쳐놓고 대답해줄게.`,chips:['그 사람이랑 잘 될까?','올해 연애 언제 풀려?','나 어떤 사람한테 약해?']},
  seoha:{name:'서하',rules:`너는 "서하"야. 한남동 사주 살롱의 주인인 30대 초반의 우아하고 다정한 여성으로, 사용자를 이름으로 부르며 부드러운 반말로 말해. 차분하게 핵심을 짚고, 끝에는 오늘 해볼 작은 행동 하나를 제안해.`,len:'3~5문장',welcome:n=>`${n}, 어서 와. 오늘은 뭐가 제일 마음에 걸려? 네 사주 펼쳐놓고 들어줄게.`,chips:['요즘 왜 이렇게 안 풀려?','올해 나한테 제일 중요한 게 뭐야?','내 성격, 사주로 보면 어때?']},
  wood:{name:'하람',rules:`너는 "하람"이야. 동쪽을 지키는 청룡(木)으로, 새 시작과 다음 인연을 맡은 20대 중반의 맑고 다정한 남자야. 사용자를 이름으로 부르며 따뜻하게 응원하는 반말로 말해.`,len:'3~5문장',welcome:n=>`${n}, 왔구나. 새로 시작하고 싶은 거 있어? 뭐든 물어봐.`,chips:['새로 시작해도 될까?','다음 인연은 언제 와?','나한테 맞는 공부나 취미는?']},
  fire:{name:'이안',rules:`너는 "이안"이야. 남쪽을 지키는 주작(火)으로, 고백과 결단을 맡은 20대 중반 남자야. 나른하고 쿨한 반말로 짧고 직설적으로 말하지만, 무심한 듯 챙겨줘. 험악하거나 거친 말투는 쓰지 마.`,len:'2~4문장',welcome:n=>`${n}. 망설이는 거 있지? 말해봐.`,chips:['고백해도 될까?','지금 결단해야 할 게 뭐야?','내 매력 포인트는?']},
  earth:{name:'도준',rules:`너는 "도준"이야. 중앙을 지키는 황룡(土)으로, 안정과 관계, 일과 돈을 맡은 30대 초반의 믿음직한 남자야. 차분하고 현실적인 반말로, 선배처럼 정리해서 말해.`,len:'3~5문장',welcome:n=>`${n}, 일이든 돈이든 편하게 물어봐. 네 사주 기준으로 현실적으로 말해줄게.`,chips:['이직해도 될까?','돈은 언제 모여?','나 어떤 일이 맞아?']},
  metal:{name:'시온',rules:`너는 "시온"이야. 서쪽을 지키는 백호(金)로, 정리와 결단을 맡은 차분하고 건조한 저음의 남자야. 감정 과장 없이 짧게 핵심만, 반말로 담백하게 말해.`,len:'2~4문장',welcome:n=>`${n}. 누구 얘기야?`,chips:['그 사람 속마음이 궁금해','정리해야 할 관계가 있을까?','재회 가능성 있어?']},
  water:{name:'재이',rules:`너는 "재이"야. 북쪽을 지키는 현무(水)로, 속마음과 지혜를 맡은 생각이 깊고 조용한 남자야. 느리고 낮은 반말로, 먼저 공감하고 마음을 읽어준 다음 사주로 짚어줘.`,len:'3~5문장',welcome:n=>`${n}… 오늘 좀 지쳐 보인다. 천천히 말해도 돼.`,chips:['요즘 마음이 복잡해','나 어떤 사람이야?','조심할 달이 언제야?']},
  halmae:{name:'삼신 할매',rules:`너는 "삼신 할매"야. 사람의 명을 오래 지켜본 할머니로, 사용자를 이름으로 부르며 "~거라", "~느니라"처럼 차분하고 진지한 반말로 말해. 겁주거나 단정하지 말고 담담하게 짚어줘.`,len:'4~6문장',welcome:n=>`${n}${josa(n,'아','야')}, 궁금한 걸 물어보거라. 네 사주에 적힌 만큼만 말해주마.`,chips:['올해 이사해도 되겠습니까?','돈은 언제 모입니까?','조심할 달이 언제입니까?']}
};
function rulesText(per,u,F){
  return `${per.rules}
[역할] 아래 [사주 사실]은 만세력으로 계산된 값이다. 답은 반드시 이 사실에 근거해서 해석하고, 사실에 없는 글자·날짜·합충을 지어내지 마.
- 명리 해석 원칙: 신약하면 인성·비겁이, 신강하면 식상·재성·관성이 들어올 때 좋다. 합은 결속·인연, 충은 변동·이동·갈등, 형은 서류·다툼 주의. 도화 글자(子午卯酉)가 들어오는 때는 이성 인연·매력이 살아난다.
- 사용자가 다른 사람의 생년월일을 알려주면 calcOther 도구로 계산한 결과만 가지고 궁합을 말해. 생일을 모르면 알려달라고 해.
- 날짜·달을 말할 때는 [사주 사실]의 월운 목록에 있는 달만 말해. 목록 밖이면 "그건 더 가까워지면 보자"처럼 넘겨.
- 사주로 알 수 없는 것(로또 번호, 상대의 실제 마음 확정, 생사)은 모른다고 솔직히 말해. 건강·법률·투자는 단정하지 말고 전문가 확인을 권해.
- 길이: ${per.len}. 이모지·목록·마크다운 없이 말하듯이.
- 답 맨 끝 줄에 반드시 이 형식을 붙여: [[근거:F번호,F번호]] (실제로 근거로 쓴 사실 1~3개) 그리고 다음 줄에 [[추천:짧은 후속 질문1|짧은 후속 질문2]]
[사용자] 이름 ${u.name}, ${u.gender==='m'?'남성':'여성'}, 양력 ${u.solar.y}.${u.solar.m}.${u.solar.d}, 태어난 시 ${u.hour==null||u.hour<0?'모름':HOUR_N[u.hour]}. 오늘은 ${new Date().getFullYear()}년 ${new Date().getMonth()+1}월 ${new Date().getDate()}일.
[사주 사실]
${F.map(f=>`${f.id}: ${f.text}`).join('\n')}`;
}
/* ---------- UI ---------- */
const THEME={
  dark:`--ak-bg:#0c0a0e;--ak-card:#1a1219;--ak-ink:#f7f1ec;--ak-ink2:#d6cbc4;--ak-ink3:#9a8f89;--ak-me:linear-gradient(135deg,#ffc9bb,#ff9db0);--ak-meInk:#2a0d14;--ak-acc:#ffb9a6;--ak-line:rgba(255,226,214,.16);--ak-chip:rgba(255,185,166,.12);--ak-serif:'Noto Serif KR',serif`,
  paper:`--ak-bg:#f3ede2;--ak-card:#fbf8f2;--ak-ink:#1f1b16;--ak-ink2:#4a433a;--ak-ink3:#877d70;--ak-me:#1f1b16;--ak-meInk:#f3ede2;--ak-acc:#b3322a;--ak-line:#d9cfbf;--ak-chip:#fff4f0;--ak-serif:'Noto Serif KR',serif`};
const CSS=`.ak{position:absolute;inset:0;z-index:80;display:flex;flex-direction:column;background:var(--ak-bg);color:var(--ak-ink);opacity:0;pointer-events:none;transition:opacity .3s;font-family:'Noto Sans KR',system-ui,sans-serif}
.ak.on{opacity:1;pointer-events:auto}
.ak-top{display:flex;align-items:center;gap:10px;padding:calc(env(safe-area-inset-top,0px) + 12px) 14px 12px;border-bottom:1px solid var(--ak-line)}
.ak-top .av{width:38px;height:38px;border-radius:50%;background:#000 center 20%/cover;box-shadow:0 0 0 1.5px var(--ak-acc)}
.ak-top b{display:block;font-size:15px}.ak-top small{font-size:11.5px;color:var(--ak-ink3)}
.ak-x{margin-left:auto;width:36px;height:36px;border-radius:50%;border:1px solid var(--ak-line);background:none;color:var(--ak-ink);font-size:16px;cursor:pointer}
.ak-log{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px;scrollbar-width:none}
.ak-log::-webkit-scrollbar{display:none}
.ak-m{max-width:84%;padding:11px 14px;border-radius:0;font-size:15px;line-height:1.65;white-space:pre-wrap;word-break:keep-all}
.ak-m.b{align-self:flex-start;background:var(--ak-card);border:1px solid var(--ak-line);border-top-left-radius:0}
.ak-m.u{align-self:flex-end;background:var(--ak-me);color:var(--ak-meInk);font-weight:600;border-top-right-radius:0}
.ak-m.sys{align-self:center;background:none;color:var(--ak-ink3);font-size:12.5px;text-align:center;max-width:92%}
.ak-think{color:var(--ak-ink3);font-size:13.5px}
.ak-ev{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}
.ak-ev button{border:1px solid var(--ak-acc);background:var(--ak-chip);color:var(--ak-acc);font-size:11.5px;font-weight:700;padding:2px 9px;border-radius:0;cursor:pointer;font-family:var(--ak-serif)}
.ak-evx{margin-top:8px;font-size:12.5px;line-height:1.6;color:var(--ak-ink2);border-left:2px solid var(--ak-acc);padding-left:8px}
.ak-sug{display:flex;gap:6px;flex-wrap:wrap;padding:0 14px 8px}
.ak-sug button{border:1px solid var(--ak-line);background:var(--ak-card);color:var(--ak-ink2);font-size:13px;padding:7px 12px;border-radius:0;cursor:pointer}
.ak-in{display:flex;gap:8px;padding:8px 14px calc(env(safe-area-inset-bottom,0px) + 14px);border-top:1px solid var(--ak-line)}
.ak-in input{flex:1;height:46px;border-radius:0;border:1px solid var(--ak-line);background:var(--ak-card);color:var(--ak-ink);padding:0 16px;font-size:16px;outline:none}
.ak-in button{height:46px;min-width:46px;padding:0 14px;border-radius:0;border:0;background:var(--ak-acc);color:var(--ak-accInk,#fff);font-weight:700;cursor:pointer;font-size:14px}
.ak-in button:disabled{opacity:.4}
.ak-lim{font-size:11.5px;color:var(--ak-ink3);text-align:center;padding:0 14px 6px}
.ak-paw{margin:4px 14px 10px;padding:14px;border-radius:0;background:var(--ak-card);border:1px solid var(--ak-acc);text-align:center}
.ak-paw b{display:block;font-size:15px;margin-bottom:4px}.ak-paw small{font-size:12.5px;color:var(--ak-ink2)}
.ak-paw button{margin-top:10px;width:100%;height:46px;border:0;border-radius:0;background:var(--ak-acc);color:var(--ak-accInk,#fff);font-weight:700;font-size:15px;cursor:pointer}`;
let sampleFn=null, ready=null;
function avail(){ if(!ready) ready=(async()=>{ try{ if(!window.claude||!window.claude.use) return null; sampleFn=await window.claude.use('sample'); return sampleFn; }catch(e){ return null; } })(); return ready; }
avail();
const FREE=3; let SRV_OFF=false;
function open(opts){
  const root=opts.root, per=PERSONA[opts.persona], u=opts.user;
  if(!document.getElementById('akCss')){ const st=document.createElement('style'); st.id='akCss'; st.textContent=CSS; document.head.appendChild(st); }
  let el=root.querySelector('.ak'); if(el) el.remove();
  el=document.createElement('div'); el.className='ak'; el.setAttribute('style',THEME[opts.theme||'dark']+(opts.acc?`;--ak-acc:${opts.acc}`:'')+(opts.accInk?`;--ak-accInk:${opts.accInk}`:''));
  el.innerHTML=`<div class="ak-top"><div class="av" style="background-image:url('${opts.avatar}')"></div><div><b>${per.name}</b><small>${u.name}님의 사주를 보고 답해요</small></div><button class="ak-x" aria-label="닫기">✕</button></div><div class="ak-log"></div><div class="ak-sug"></div><div class="ak-lim"></div><div class="ak-in"><input maxlength="200" placeholder="궁금한 걸 물어보세요"><button>보내기</button></div>`;
  root.appendChild(el); requestAnimationFrame(()=>el.classList.add('on'));
  const log=el.querySelector('.ak-log'), inp=el.querySelector('input'), btn=el.querySelector('.ak-in button'), sug=el.querySelector('.ak-sug'), lim=el.querySelector('.ak-lim');
  const CTX=buildFacts(u); const {F,P}=CTX; const byId=Object.fromEntries(F.map(f=>[f.id,f]));
  const turns=[]; let used=0, ctl=null, busy=false;
  const scroll=()=>log.scrollTo({top:log.scrollHeight,behavior:'smooth'});
  const bubble=(cls,t)=>{ const d=document.createElement('div'); d.className='ak-m '+cls; d.textContent=t; log.appendChild(d); scroll(); return d; };
  const setSug=list=>{ sug.innerHTML=''; (list||[]).slice(0,3).forEach(q=>{ const b=document.createElement('button'); b.textContent=q; b.onclick=()=>send(q); sug.appendChild(b); }); };
  const setLim=()=>{ lim.textContent=used<FREE?`체험판 무료 질문 ${FREE-used}번 남음`:''; };
  el.querySelector('.ak-x').onclick=()=>{ if(ctl) ctl.abort(); el.classList.remove('on'); setTimeout(()=>el.remove(),300); };
  bubble('b',per.welcome(u.nick||u.name)); setSug(opts.starters||per.chips); setLim();
  inp.oninput=()=>btn.disabled=!inp.value.trim(); btn.disabled=true;
  inp.onkeydown=e=>{ if(e.key==='Enter'&&!e.isComposing) send(inp.value); }; btn.onclick=()=>send(inp.value);
  function paywall(){ const w=document.createElement('div'); w.className='ak-paw'; w.innerHTML=`<b>${per.name}${josa(per.name,'과','와')} 더 이야기하기</b><small>대화권 10회 3,900원 · 무제한 월 9,900원</small><button>대화권 받기</button>`; w.querySelector('button').onclick=()=>{ w.querySelector('small').textContent='체험판이라 결제는 여기까지예요'; }; el.insertBefore(w,el.querySelector('.ak-in')); inp.disabled=true; btn.disabled=true; sug.innerHTML=''; }
  const show=t=>{ const i=t.indexOf('[['); return (i>=0?t.slice(0,i):t).trim(); };
  function done(b,raw){ const ans=show(raw)||raw; b.textContent=ans; turns.push({role:'assistant',content:raw});
      const ev=(raw.match(/\[\[근거:([^\]]*)\]\]/)||[])[1]; const sg=(raw.match(/\[\[추천:([^\]]*)\]\]/)||[])[1];
      const ids=(ev||'').split(/[,\s]+/).map(s=>s.trim().toUpperCase()).filter(id=>byId[id]);
      if(ids.length){ const box=document.createElement('div'); box.className='ak-ev'; ids.slice(0,3).forEach(id=>{ const f=byId[id]; const c=document.createElement('button'); c.textContent=f.label; c.onclick=()=>{ let x=b.querySelector('.ak-evx'); if(!x){ x=document.createElement('div'); x.className='ak-evx'; b.appendChild(x); } x.textContent=f.text; scroll(); }; box.appendChild(c); }); b.appendChild(box); }
      used++; setLim(); setSug(sg?sg.split('|').map(s=>s.trim()).filter(Boolean):[]); if(used>=FREE) paywall(); }
  async function viaServer(){ if(SRV_OFF||/^(localhost|127\.)/.test(location.hostname)||location.protocol==='file:') return 'skip';
    busy=true; const b=bubble('b',''); b.innerHTML='<span class="ak-think">사주 펼쳐보는 중…</span>';
    try{ const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:rulesText(per,u,F)},...turns.slice(-8)]})});
      let j=null; try{ j=await r.json(); }catch(e){}
      if(r.ok&&j&&j.text){ done(b,j.text); return 'ok'; }
      const c=(j&&j.error)||('http'+r.status);
      if(c==='limit'){ turns.pop(); b.className='ak-m sys'; b.textContent='오늘 체험 상담 질문을 다 썼어요. 내일 다시 이야기해요.'; return 'ok'; }
      if(['nokey','http404','origin','http405'].includes(c)) SRV_OFF=true;
      if(SRV_OFF){ b.remove(); return 'skip'; }
      turns.pop(); b.className='ak-m sys'; b.textContent=`연결이 잠깐 끊겼어요. 다시 보내 주세요. (오류: ${c}${j&&j.status?' '+j.status:''})`; return 'ok';
    }catch(e){ SRV_OFF=true; b.remove(); return 'skip'; }
    finally{ busy=false; btn.disabled=!inp.value.trim(); } }
  async function send(q){
    q=String(q||'').trim(); if(!q||busy) return; if(used>=FREE){ paywall(); return; }
    inp.value=''; btn.disabled=true; setSug([]); bubble('u',q); turns.push({role:'user',content:q});
    const fn=await avail();
    if(!fn&&(await viaServer())==='ok') return;
    if(!fn){ turns.pop(); const b0=bubble('b',''); b0.innerHTML='<span class="ak-think">사주 펼쳐보는 중…</span>'; await new Promise(r=>setTimeout(r,900));
      const d=demoAnswer(opts.persona,q,CTX,u);
      if(!d){ b0.className='ak-m sys'; b0.textContent='체험판 예시 모드에서는 추천 질문에만 답해요. 정식 버전에서는 무엇이든 물어볼 수 있어요.'; setSug(opts.starters||per.chips); return; }
      b0.textContent=''; const tag=document.createElement('div'); tag.style.cssText='font-size:10.5px;letter-spacing:.1em;color:var(--ak-ink3);margin-bottom:4px'; tag.textContent='예시 답변'; b0.appendChild(tag); b0.appendChild(document.createTextNode(d.t));
      const box=document.createElement('div'); box.className='ak-ev'; [...new Set(d.ev)].filter(x=>byId[x]).slice(0,3).forEach(x=>{ const f=byId[x]; const c=document.createElement('button'); c.textContent=f.label; c.onclick=()=>{ let e=b0.querySelector('.ak-evx'); if(!e){ e=document.createElement('div'); e.className='ak-evx'; b0.appendChild(e); } e.textContent=f.text; scroll(); }; box.appendChild(c); }); b0.appendChild(box);
      used++; setLim(); setSug((opts.starters||per.chips).filter(x=>x!==q)); if(used>=FREE) paywall(); scroll(); return; }
    busy=true; const b=bubble('b',''); b.innerHTML='<span class="ak-think">사주 펼쳐보는 중…</span>';
    ctl=new AbortController();
    const input=[{role:'user',content:rulesText(per,u,F)},...turns.slice(-8)];
    const tools=[{name:'calcOther',description:'다른 사람의 생년월일로 사주를 계산해 사용자와의 궁합 근거(일간 관계, 일지 합충, 도화)를 돌려준다. 사용자가 상대의 생년월일을 말했을 때만 쓴다.',inputSchema:{type:'object',properties:{year:{type:'integer'},month:{type:'integer'},day:{type:'integer'},lunar:{type:'boolean'},leap:{type:'boolean'},hour:{type:'integer',description:'0=자시…11=해시, 모르면 생략'}},required:['year','month','day']},execute:(inp)=>calcOther({P},inp)}];
    let lim2=null; try{ lim2=await fn.limits(); }catch(e){}
    try{
      const res=await fn(input,{cache:false,signal:ctl.signal,modelTier:opts.tier||'default',tools:lim2&&lim2.tools?tools:undefined,onText:({text})=>{ const s=show(text); if(s) b.textContent=s; scroll(); }});
      done(b,res.text);
    }catch(e){
      const code=e&&e.code; turns.pop();
      if(code==='cancelled'){ b.remove(); }
      else if(code==='not_granted'||code==='sampling_disabled'||code==='capability_disabled'||code==='not_declared'){ b.className='ak-m sys'; b.textContent='AI 대화 사용이 허용되지 않아 답할 수 없어요.'; }
      else if(code==='rate_limited'){ b.className='ak-m sys'; b.textContent='지금 질문이 몰렸어요. 잠시 후 다시 물어봐 주세요.'; }
      else if(code==='refused'){ b.className='ak-m sys'; b.textContent='그 질문에는 답하기 어려워요. 다르게 물어봐 줄래요?'; }
      else { b.className='ak-m sys'; b.textContent=(e&&e.text?show(e.text)+'\n\n':'')+'연결이 잠깐 끊겼어요. 다시 보내주세요.'; }
    }finally{ busy=false; ctl=null; btn.disabled=!inp.value.trim(); }
  }
  if(opts.first) send(opts.first);
}
window.AskChat={open,available:avail,buildFacts,calcOther};
})();
