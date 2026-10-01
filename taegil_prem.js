/* 택일 프리미엄 — 월하의 정밀 택일 (결제 뒤 결과 아래에 이어짐)
   계산: 추천 다섯 날마다 좋은 시간 둘 · 피할 시간 · 길한 방향 · 피할 방향 · 함께하면 좋은 띠 · 피할 띠 · 그날 입을 색
   → AI(월하 문체) · 없으면 초안 */
(function(){
const S_=window.Saju, X=window.SajuX, {GAN,JI,EL,stEl,BR_EL}=S_; const $=id=>document.getElementById(id); const K=window.PK;
const WD='일월화수목금토', ZOD=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
const HR=['자시 23:30~01:29','축시 01:30~03:29','인시 03:30~05:29','묘시 05:30~07:29','진시 07:30~09:29','사시 09:30~11:29','오시 11:30~13:29','미시 13:30~15:29','신시 15:30~17:29','유시 17:30~19:29','술시 19:30~21:29','해시 21:30~23:29'];
const BDIR=['북쪽','북동쪽','북동쪽','동쪽','남동쪽','남동쪽','남쪽','남서쪽','남서쪽','서쪽','북서쪽','북서쪽'];
const EDIR=['동쪽','남쪽','집 가운데','서쪽','북쪽'], ENM=['나무','불','흙','쇠','물'], ECOL=['초록 · 연두','빨강 · 분홍','노랑 · 베이지','흰색 · 회색','검정 · 남색'];
const RANGE={move:[4,8],contract:[4,8],exam:[3,7],talk:[5,9],love:[6,10],open:[3,7]};
const SAM=[[8,0,4],[2,6,10],[5,9,1],[11,3,7]];
let O=null,DS=null,C=null,ST={},FAV=0,nick='';
function detail(x){ const P=O.P, dm=O.dm, b=x.p[1], s=x.p[0], [h0,h1]=RANGE[O.purpose]||[4,8], hs=[];
  for(let hb=h0;hb<=h1;hb++){ if(S_.isChung(hb,b)||S_.isChung(hb,P.d[1])) continue; const why=[]; let v=0;
    if(S_.isHap(hb,b)){ v+=2; why.push('일진과 합'); } if(S_.isHap(hb,P.d[1])){ v+=2; why.push('내 일지와 합'); }
    if(X.shinsal(hb,P).includes('천을귀인')){ v+=1.5; why.push('천을귀인'); } if(S_.favorable(O.st,S_.relBranch(dm,hb))){ v+=1; why.push('나를 돕는 기운'); }
    hs.push({hb,v,why}); }
  hs.sort((a,c)=>c.v-a.v||a.hb-c.hb); const good=hs.slice(0,2).sort((a,c)=>a.hb-c.hb);
  const badH=[(b+6)%12,(O.P.d[1]+6)%12].filter((v,i,a)=>a.indexOf(v)===i);
  const g=SAM.find(t=>t.includes(b)), mate=[(()=>{ for(let z=0;z<12;z++) if(S_.isHap(z,b)) return z; return -1; })()].concat(g.filter(z=>z!==b)).filter(z=>z>=0&&!S_.isChung(z,P.d[1]));
  return {good,badH,dir:EDIR[FAV],badDir:BDIR[(b+6)%12],mate:[...new Set(mate)],badZ:(b+6)%12,col:ECOL[FAV],rel:X.branchRel(b,P).map(r=>r.at+' '+r.k).concat(X.stemRel(s,P).map(r=>r.at+' '+r.k)),ss:X.shinsal(b,P,s)}; }
function prep(){ O=window.TGF; if(!O||!O.top||!O.top.length) return false; nick=O.name||'';
  const dm=O.dm, cnt=S_.elCount(O.P); const favs=[0,1,2,3,4].filter(e=>S_.favorable(O.st,S_.rel(dm,e))); FAV=(favs.length?favs:[0,1,2,3,4]).sort((a,b)=>cnt[a]-cnt[b])[0];
  DS=O.top.map(x=>Object.assign({},x,detail(x))); C=K.gl(draft()); ST={}; return true; }
const lab=hb=>HR[hb].split(' ')[0], tim=hb=>HR[hb].split(' ')[1];
function draft(){ const U=O.U, t=DS[0];
  return {draft:true,
   sum:[`${U.n}에 맞춰 앞으로 ${O.range}일을 다 넘겨 봤다. 그중 ${t.dd.m}월 ${t.dd.d}일 ${GAN[t.p[0]]}${JI[t.p[1]]}일이 으뜸이다.`,`네 사주를 돕는 기운은 ${ENM[FAV]}(${EL[FAV]})다. 그날은 ${EDIR[FAV]}${K.bt(EDIR[FAV])?'을':'를'} 향하고, ${ECOL[FAV]} 옷을 입으면 기운이 더 붙는다.`],
   days:DS.map(x=>({title:x.why.length?x.why.map(w=>w[0]).slice(0,2).join(' · '):'무난한 날',text:`${GAN[x.p[0]]}${JI[x.p[1]]}일, ${x.tg}의 날이다. ${x.rel.length?x.rel.join(', ')+'.':''} 좋은 시간은 ${x.good.map(h=>lab(h.hb)).join(' · ')}.`,tip:x.good[0]?`${lab(x.good[0].hb)}에 시작하기`:'오전에 시작하기'})),
   rituals:[{t:'전날 밤 정리',d:'신발을 가지런히 두고 일찍 잔다.'},{t:`${ECOL[FAV].split(' · ')[0]} 하나 지니기`,d:'옷이든 소품이든 하나면 된다.'},{t:'첫 마디를 정해 두기',d:'그날 처음 할 말을 미리 정해 두면 흔들리지 않는다.'}],
   letter:['날은 내가 골랐다.','시간과 방향까지 맞췄으니, 나머지는 네 마음이다.']}; }
function card(){ const P=O.P, gz=p=>p?GAN[p[0]]+JI[p[1]]:'모름';
  return JSON.stringify({목적:O.U.n,목적뜻:O.U.q,기간:O.range+'일',원국:[['년주',P.y],['월주',P.m],['일주',P.d],['시주',P.h]].map(([n,p])=>n+' '+gz(p)),일간:GAN[O.dm]+EL[stEl(O.dm)],신강약:O.st.label,돕는오행:EL[FAV],
   추천날:DS.map((x,i)=>({번호:i,날짜:`${x.dd.y}.${x.dd.m}.${x.dd.d}(${WD[x.wd]})`,일진:GAN[x.p[0]]+JI[x.p[1]],십성:x.tg,점수:x.sc,좋은이유:x.why.map(w=>w[0]),음력:x.lun?`${x.lun.m}.${x.lun.d}`:'',
     좋은시간:x.good.map(h=>HR[h.hb]+' '+h.why.join('·')),피할시간:x.badH.map(h=>HR[h]),길한방향:x.dir,피할방향:x.badDir,함께하면좋은띠:x.mate.map(z=>ZOD[z]),피할띠:ZOD[x.badZ],관계:x.rel,신살:x.ss})),
   피할날:(O.worst||[]).map(x=>`${x.dd.m}.${x.dd.d} ${GAN[x.p[0]]}${JI[x.p[1]]}일 ${x.bad.join(', ')}`)}); }
function prompts(){ const A=window.PremAI;
  const ST0=`[문체 규칙 · 오방사주 택일 명인 월하(月下)]\n- 화자는 날을 고르는 노련한 택일 명인 월하. 차분하고 담백한 반말(~다, ~거라). 옛 택일 말투를 살짝 섞되 어렵지 않게. 비유는 달 · 물때 · 문 · 길.\n- 문장은 짧게, 한 문장 40자 안팎.\n`+A.COMMON;
  const core=`${ST0}\n\n[할 일] 택일 프리미엄 '월하의 정밀 택일' 본문을 쓴다. 목적은 ${O.U.n}.
출력 JSON 형식: {"sum":["정밀 택일 총평 2~3단락. 왜 이 날들인지, 돕는 오행과 방향 · 색. 단락마다 110~170자"],"rituals":[{"t":"그날 준비 제목 6~14자","d":"구체적인 행동 40~80자. 목적과 돕는 오행을 근거로"}],"letter":["월하의 한마디 3~4단락, 단락마다 40~90자"]}
rituals는 정확히 3개.

[사실 카드]
${card()}`;
  const days=`${ST0}\n\n[할 일] 추천 다섯 날 각각의 정밀 풀이를 쓴다. 목적은 ${O.U.n}. 좋은 시간 · 방향 · 함께할 띠 · 관계 · 신살을 근거로 그날 어떻게 움직이면 되는지.
출력 JSON 형식: 배열. 날마다 {"i":번호,"title":"그날 제목 6~12자","text":"그날 풀이 130~200자","tip":"그날 한 줄 당부 10~20자"}
대상 날 번호: 0, 1, 2, 3, 4

[사실 카드]
${card()}`;
  return [{id:'core',prompt:core,check:d=>d&&Array.isArray(d.sum)&&Array.isArray(d.rituals)},{id:'days',prompt:days,check:d=>Array.isArray(d)&&d.every(x=>x&&typeof x.text==='string')}]; }
function apply(id,d){ if(id==='core') ['sum','rituals','letter'].forEach(k=>{ if(d[k]&&d[k].length) C[k]=d[k]; }); else d.forEach(x=>{ const i=+x.i; if(i>=0&&i<DS.length) C.days[i]=Object.assign({},C.days[i],x); }); }
function build(){ const ps=a=>K.ps(a,nick), t=x=>K.tok(x,nick);
  const H=[`<div class="pk-st" id="tgst" hidden></div>`];
  H.push(K.sec('월하의 정밀 택일 · 총평',ps(C.sum)+K.ev([`돕는 오행 ${EL[FAV]}`,`길한 방향 ${EDIR[FAV]}`,`그날의 색 ${ECOL[FAV]}`])));
  H.push(K.sec('다섯 날 정밀 풀이',`<div class="pk-acc">${DS.map((x,i)=>{ const c=C.days[i]||{};
    return K.row({k:'t'+i,cls:i===0?'pk-hi':'',a:`${x.dd.m}.${x.dd.d}`,asub:`${WD[x.wd]}요일`,b:`<em>${GAN[x.p[0]]}${JI[x.p[1]]}</em>${t(c.title||'')}${i===0?'<span class="pk-tag">으뜸</span>':''}`,c:x.sc,
      body:`<div class="pk-rx3"><div><small>좋은 시간</small><b>${x.good[0]?lab(x.good[0].hb):'오전'}</b></div><div><small>길한 방향</small><b>${x.dir}</b></div><div><small>함께할 띠</small><b>${x.mate.slice(0,2).map(z=>ZOD[z]).join(' · ')||'누구나'}</b></div></div>`+ps([c.text])
       +`<div class="pk-items">${[['좋은 시간',x.good.map(h=>`${HR[h.hb]} (${h.why.join(' · ')||'무난'})`).join('<br>')],['피할 시간',x.badH.map(h=>HR[h]).join(', ')],['피할 방향',x.badDir],['피할 띠',ZOD[x.badZ]+'띠'],['그날의 색',x.col]].map(([l,v])=>`<div><small>${l}</small><p>${v}</p></div>`).join('')}</div>`
       +(c.tip?`<p class="pk-key"><b>그날 한 줄</b>${t(c.tip)}</p>`:'')+K.ev(x.why.map(w=>w[0]).concat(x.rel).concat(x.ss))}); }).join('')}</div>`,'숫자는 택일 점수'));
  if(O.worst&&O.worst.length) H.push(K.sec('이날은 피하거라',`<div class="pk-cards">${O.worst.map(x=>`<div class="pk-card"><b>${x.dd.m}.${x.dd.d}<small>${WD[x.wd]}요일 · ${GAN[x.p[0]]}${JI[x.p[1]]}일</small></b><div><p>${x.bad.join(' · ')}. 내 일지와 부딪혀 일이 뒤집히기 쉬운 날이다.</p></div></div>`).join('')}</div>`));
  H.push(K.sec('그날의 준비',`<div class="pk-cards">${(C.rituals||[]).slice(0,3).map((r,i)=>`<div class="pk-card"><b>${i+1}</b><div><p class="pk-ct">${t(r.t)}</p><p>${t(r.d)}</p></div></div>`).join('')}</div>`));
  H.push(K.letter(C.letter||[],{title:'월하의 한마디',name:'월하'},'擇日',nick));
  H.push(`<p class="pk-note" style="margin:14px 0 0">${ST.ai?'이 풀이는 만세력 일진 계산 근거만 재료로 AI가 월하의 말투로 쓴 글이에요. 명리 전문가 감수 전 원고예요':'이 부분은 해석 사전으로 조립한 초안이에요. 정식 서비스에서는 같은 근거로 월하가 길게 써 줘요'}</p>`);
  return H.join(''); }
function render(){ const host=$('tprem'); K.keepOpen(host,()=>{ host.innerHTML=build(); }); K.status($('tgst'),Object.assign({who:'월하가 정밀 택일'},ST)); }
window.TaegilPrem={open(){ const host=$('tprem'); if(!host||!prep()) return false; host.className='pkx'; host.hidden=false; K.bind(host); render();
  const f=host.querySelector('.pk-row.pk-hi'); if(f) f.classList.add('open');
  const k=[O.P.y,O.P.m,O.P.d,O.P.h].map(p=>p?p.join('.'):'x').join('-')+'-tg-'+O.purpose+'-'+DS.map(x=>x.dd.m+'.'+x.dd.d).join('_');
  K.runAI({key:k,ver:'v2',parts:prompts(),apply,rerender:render,S:ST}); return true; }};
})();
