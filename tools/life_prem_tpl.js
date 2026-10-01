/* 평생 사주 프리미엄 — 현암의 평생 상세 풀이
   계산: life_core.js → 사실 카드 · 원고: LIFE_SAMPLE(완성본) 또는 AI(현암 문체) · 없으면 해석 사전 초안 */
(function(){
const S_=window.Saju, X=window.SajuX, {GAN,JI,EL,stEl,BR_EL}=S_; const $=id=>document.getElementById(id); const K=window.PK;
/*__DICT__*/
const GRP=['비겁','식상','재성','관성','인성'];
const AREAS=[['love','연애'],['money','돈'],['work','일'],['people','사람'],['body','몸과 마음']];
const LAREAS=[['love','연애 · 결혼'],['money','재물'],['work','일 · 직업'],['family','가족'],['body','건강']];
const RELM={육합:'손을 잡아 일이 순하게 풀립니다',충:'정면으로 부딪혀 변동이 생깁니다',형:'서로 견제하니 서류와 약속을 두 번 보아야 합니다',원진:'이유 없이 서운해지기 쉽습니다',파:'약속 하나가 어긋나기 쉽습니다',해:'작은 섭섭함이 쌓입니다',삼합:'힘을 모아 기운이 커집니다','같은 글자':'같은 기운이 겹쳐 일이 커집니다',천간합:'마음이 묶입니다',천간충:'생각이 부딪힙니다'};
const SEAT={년지:'집안과 어린 시절',월지:'일터와 부모',일지:'배우자와 나 자신',시지:'꿈과 자녀',년간:'집안 어른',월간:'사회의 얼굴',일간:'나 자신',시간:'꿈과 말년'};
let L=null,C=null,ST={};
const nick=()=>L.nick;
function prep(){ const X0=window.LFF; if(!X0) return false; L=window.LifeCore.build(S_,X,X0.inp); L.nick=X0.nick;
  const sm=(window.LIFE_SAMPLE||{})[L.key]; C=sm?Object.assign({fixed:true},JSON.parse(JSON.stringify(sm))):draft(); ST={}; return true; }
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
  const ex=JSON.stringify(Object.assign({i:3},window.LIFE_SAMPLE['1996-5-14-6-f'].daeun[3]));
  const core=`${ST0}\n\n[할 일] 평생 사주 프리미엄의 '타고난 그릇 · 원국의 짜임 · 결정적인 해 · 마지막 글'을 쓴다. 이미 지나온 나이는 과거형으로 쓴다.
출력 JSON 형식: {"cover":{"words":["이 사람을 요약하는 두세 글자 단어 세 개"],"line":"{P}의 로 시작하는 현암의 한마디 1~2문장"},"nature":["타고난 그릇 5단락. 일간의 본성, 태어난 달(월지)의 십성과 사회에서의 모습, 십성 분포가 만드는 마음의 구조, 빈칸, 조후 순서. 단락마다 150~230자"],"frame":["원국 안의 합 · 충과 신살 · 공망 이야기 2~3단락, 단락마다 120~200자"],"turns":{"${L.keys.turn.map(o=>o.y).join('":"그해가 결정적인 이유 2문장","')}":"그해가 결정적인 이유 2문장"},"letter":["{P}께.","현암의 글 4~5단락, 단락마다 60~130자","현암 드림"]}
turns의 키는 위 해로 고정이다.

[사실 카드]
${card([])}`;
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
  H.push(K.sec('타고난 그릇',`<div class="pk-bars">${L.grp.map((v,i)=>`<div><div class="t"><i class="${v?'':'z'}" style="height:${v/mx*100}%"></i></div><b>${GRP[i]}</b><small>${v}</small></div>`).join('')}</div>`+K.ps(C.nature,n)));
  H.push(K.sec('원국의 짜임',K.ps(C.frame,n)+K.ev(L.inner.map(r=>`${r.at} ${r.gz} ${r.k}`).concat(L.natal.map(o=>o.at+' '+o.k)).concat(['공망 '+L.gong.map(b=>JI[b]).join('')]))));
  H.push(K.sec('대운 아홉 마디',`<div class="pk-acc">${L.dl.map((d,i)=>{ const c=C.daeun[i]||{}; const tag=d.now?'지금':d===best?'전성기':d===low?'고비':'';
    return K.row({k:'d'+i,cls:d===best?'hi':d===low?'lo':'',a:`${d.age}~${d.age+9}세`,asub:`${d.from}~${d.to}`,b:`<em>${d.gz}</em>${K.esc(c.title||'')}${tag?`<span class="tag">${tag}</span>`:''}`,c:d.sc,
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
window.LifePrem={open(){ const host=$('prem'); if(!host||!prep()) return; host.classList.add('pk'); host.hidden=false; const lk=document.querySelector('.lockS'); if(lk) lk.hidden=true; K.bind(host); render();
  const cur=host.querySelector(`.pk-row[data-k="d${L.dl.indexOf(L.cur)}"]`); if(cur) cur.classList.add('open');
  if(!C.fixed) K.runAI({key:L.key+'-life',ver:'v1',parts:prompts(),apply,rerender:render,S:ST}); }};
})();
