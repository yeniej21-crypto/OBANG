/* 묘당 · 마담 도화의 이달의 연애운 상세 (990원 상품 본문)
   계산: 이번 달 날마다 일진 → 도화 · 인연의 별(여 관성 · 남 재성) · 일지 합충 · 홍염 → 주별 점수 · 연락하기 좋은 날과 시간 · 이달 만나는 사람의 결
   → AI(마담 문체) · 없으면 초안 */
(function(){
const S_=window.Saju, X=window.SajuX, {GAN,JI,EL,stEl}=S_; const K=window.PK;
const WD='일월화수목금토', WK=['첫째 주','둘째 주','셋째 주','넷째 주','다섯째 주'];
const HR=['자시 23:30~01:29','축시 01:30~03:29','인시 03:30~05:29','묘시 05:30~07:29','진시 07:30~09:29','사시 09:30~11:29','오시 11:30~13:29','미시 13:30~15:29','신시 15:30~17:29','유시 17:30~19:29','술시 19:30~21:29','해시 21:30~23:29'];
const WHO={비견:'친구처럼 편한 사람. 취미나 일로 자주 마주치는 동갑내기',겁재:'경쟁심을 건드리는 사람. 다른 사람과 겹쳐 보이는 인연',식신:'같이 있으면 배부르고 편한 사람. 맛집 · 취미 모임에서',상관:'말 잘하고 재치 있는 사람. 대화가 끊기지 않는 타입',편재:'활달하고 발 넓은 사람. 모임 · 여행 · 소개에서',정재:'다정하고 현실적인 사람. 약속을 잘 지키는 타입',편관:'카리스마 있고 조금 위험한 사람. 첫인상이 센 타입',정관:'반듯하고 믿음직한 사람. 일 · 공식 자리에서',편인:'독특하고 생각이 깊은 사람. 혼자 있는 시간을 아는 타입',정인:'어른스럽고 챙겨 주는 사람. 배움 · 상담 자리에서'};
let O=null,W=null,C=null,ST={},nick='',host=null;
function prep(){ const P=O.P, dm=P.d[0], db=P.d[1], f=O.g!=='m', loveG=f?3:2, dh=X.shinsal, y=O.today.getFullYear(), m=O.today.getMonth()+1, n=new Date(y,m,0).getDate();
  const days=[]; for(let d=1;d<=n;d++){ const [s,b]=S_.dayPillar(y,m,d), w=new Date(y,m-1,d).getDay(), ss=X.shinsal(b,P,s); let v=0; const why=[];
    if(ss.includes('도화')){ v+=3; why.push('도화'); } if(S_.rel(dm,stEl(s))===loveG){ v+=2; why.push(f?'관성(인연의 별)':'재성(인연의 별)'); } if(S_.isHap(b,db)){ v+=2; why.push('일지 합'); } if(X.ganHap(s,dm)){ v+=1.5; why.push('일간 합'); }
    if(ss.includes('홍염')){ v+=1; why.push('홍염'); } if(S_.isChung(b,db)){ v-=4; why.push('일지 충'); } if(X.branchRel(b,P).some(r=>r.at==='일지'&&r.k==='원진')){ v-=1; why.push('일지 원진'); }
    days.push({y,m,d,w,s,b,v,why}); }
  W=[0,7,14,21,28].filter(a=>a<n).map((a,i)=>{ const ds=days.slice(a,a+7), sum=ds.reduce((t,x)=>t+x.v,0); const best=[...ds].sort((p,q)=>q.v-p.v)[0], bad=ds.filter(x=>x.why.includes('일지 충'));
    return {i,from:a+1,to:Math.min(n,a+7),ds,sc:Math.max(35,Math.min(96,Math.round(56+sum*1.6*7/ds.length))),best,bad}; });
  const cand=days.filter(x=>x.v>=3&&!x.why.includes('일지 충')).sort((p,q)=>q.v-p.v||p.d-q.d).slice(0,3).sort((p,q)=>p.d-q.d);
  O.call=cand.map(x=>{ let bh=-1,bv=-9; for(let hb=6;hb<=11;hb++){ if(S_.isChung(hb,db)||S_.isChung(hb,x.b)) continue; const v=(S_.isHap(hb,db)?2:0)+(S_.isHap(hb,x.b)?1:0)+(X.shinsal(hb,P).includes('도화')?1.5:0); if(v>bv){ bv=v; bh=hb; } } return Object.assign({},x,{bh}); });
  const mp=S_.pillars(y,m,15,null).m; O.mp=mp; O.mt=S_.tgStem(dm,mp[0]); O.dm=dm; O.f=f; O.y=y; O.mo=m;
  C=draft(); ST={}; return true; }
function draft(){ const top=[...W].sort((a,b)=>b.sc-a.sc)[0];
  return {draft:true,
   weeks:W.map(w=>({title:w.sc>=72?'시선이 모이는 주':w.bad.length?'말 조심할 주':w.sc>=60?'은근히 데워지는 주':'나를 챙기는 주',text:`${w.best?`${w.best.d}일 ${GAN[w.best.s]}${JI[w.best.b]}일이 이 주의 꽃이야. ${w.best.why.filter(k=>k!=='일지 충').join(', ')||'조용한 날'}.`:''}${w.bad.length?` ${w.bad.map(x=>x.d+'일').join(', ')}은 일지와 부딪혀. 다툼은 다음 날로.`:''}`,tip:w.sc>=70?'먼저 웃어 주기':'서두르지 않기'})),
   who:[`이달의 기운은 ${GAN[O.mp[0]]}${JI[O.mp[1]]}, 너한테는 ${O.mt}이야. ${WHO[O.mt]||''}.`,`가장 뜨거운 주는 ${WK[top.i]}야.`],
   solo:'끌림 날에 약속을 잡아. 집에만 있으면 아무 일도 안 생겨.',couple:'충이 드는 날엔 큰 이야기는 미뤄. 끌림 날엔 둘만의 시간을.',
   letter:['이달 장부는 여기까지.','고르는 건 너야. 난 보여 줄 뿐이고.']}; }
function card(){ const P=O.P, gz=p=>p?GAN[p[0]]+JI[p[1]]:'모름';
  return JSON.stringify({달:`${O.y}년 ${O.mo}월`,성별:O.f?'여':'남',일간:GAN[O.dm]+EL[stEl(O.dm)],일지:JI[P.d[1]],원국:[['년주',P.y],['월주',P.m],['일주',P.d],['시주',P.h]].map(([n,p])=>n+' '+gz(p)),원국신살:X.natalShinsal(P).map(x=>x.at+' '+x.k),
   이달간지:GAN[O.mp[0]]+JI[O.mp[1]],이달십성:O.mt,인연의별:O.f?'관성':'재성',
   주:W.map(w=>({번호:w.i,이름:WK[w.i],기간:`${w.from}~${w.to}일`,점수:w.sc,꽃날:w.best?`${w.best.d}일(${WD[w.best.w]}) ${GAN[w.best.s]}${JI[w.best.b]} ${w.best.why.join(', ')}`:'',충날:w.bad.map(x=>x.d+'일')})),
   연락하기좋은날:O.call.map(x=>`${x.d}일(${WD[x.w]}) ${HR[x.bh]||'저녁'} ${x.why.join(', ')}`)}); }
function prompts(){ const A=window.PremAI, ST0=A.STYLE.madam+'\n'+A.COMMON;
  const core=`${ST0}\n\n[할 일] 묘당 마담 도화의 '이달의 연애운' 상세를 쓴다.
출력 JSON 형식: {"who":["이달 만나는 사람 2~3단락. 이달 십성과 인연의 별, 원국 신살로 본 그 사람의 결과 만나는 장면. 단락마다 100~160자"],"solo":"솔로라면 이달 할 일 80~130자","couple":"연애 중이라면 이달 할 일 80~130자","letter":["마담의 한마디 3~4단락, 단락마다 30~80자. 나른하고 도도하게"]}

[사실 카드]
${card()}`;
  const wk=`${ST0}\n\n[할 일] 이달의 연애 장부를 주별로 쓴다. 점수 · 꽃날 · 충날을 근거로.
출력 JSON 형식: 배열. 주마다 {"i":번호,"title":"그 주 제목 6~12자","text":"그 주 이야기 100~160자","tip":"한 줄 당부 8~18자"}
대상 주 번호: ${W.map(w=>w.i).join(', ')}

[사실 카드]
${card()}`;
  return [{id:'core',prompt:core,check:d=>d&&Array.isArray(d.who)},{id:'wk',prompt:wk,check:d=>Array.isArray(d)&&d.every(x=>x&&typeof x.text==='string')}]; }
function apply(id,d){ if(id==='core') ['who','solo','couple','letter'].forEach(k=>{ if(d[k]&&d[k].length) C[k]=d[k]; }); else d.forEach(x=>{ const i=+x.i; if(i>=0&&i<W.length) C.weeks[i]=Object.assign({},C.weeks[i],x); }); }
function build(){ const ps=a=>K.ps(a,nick), t=x=>K.tok(x,nick), top=[...W].sort((a,b)=>b.sc-a.sc)[0];
  const H=[`<div class="pk-st" id="mdst" hidden></div>`];
  H.push(K.sec(`마담의 ${O.mo}월 연애 장부`,`<div class="pk-acc">${W.map((w,i)=>{ const c=C.weeks[i]||{};
    return K.row({k:'w'+i,cls:w===top?'pk-hi':w.bad.length&&w.sc<55?'pk-lo':'',a:WK[i],asub:`${w.from}~${w.to}일`,b:`${t(c.title||'')}${w===top?'<span class="pk-tag">가장 뜨거움</span>':''}`,c:w.sc,
      body:ps([c.text])+(c.tip?`<p class="pk-key"><b>이 주 한 줄</b>${t(c.tip)}</p>`:'')+K.ev(w.best?[`꽃날 ${w.best.d}일 ${GAN[w.best.s]}${JI[w.best.b]}`].concat(w.best.why):[])}); }).join('')}</div>`,'숫자는 끌림 점수'));
  H.push(K.sec('이달 만나는 사람',ps(C.who)+K.ev([`이달 ${GAN[O.mp[0]]}${JI[O.mp[1]]} · ${O.mt}`])));
  H.push(K.sec('연락하기 좋은 날',O.call.length?`<div class="pk-cards">${O.call.map(x=>`<div class="pk-card"><b>${x.m}.${x.d}<small>${WD[x.w]}요일 · ${GAN[x.s]}${JI[x.b]}일</small></b><div><p class="pk-ct">${HR[x.bh]||'저녁'}</p><p>${x.why.join(' · ')}</p></div></div>`).join('')}</div>`:'<p class="pk-p">이달은 먼저 연락하기보다 기다리는 달이야.</p>'));
  H.push(K.sec('솔로라면 · 연애 중이라면',K.items(C,[['solo','솔로라면'],['couple','연애 중이라면']],nick)));
  H.push(K.letter(C.letter||[],{title:'마담의 한마디',name:'마담 도화'},'猫堂',nick));
  H.push(`<p class="pk-note" style="margin:14px 0 0">${ST.ai?'이 장부는 만세력 일진 계산 근거만 재료로 AI가 마담의 말투로 쓴 글이에요. 명리 전문가 감수 전 원고예요':'이 부분은 해석 사전으로 조립한 초안이에요. 정식 서비스에서는 같은 근거로 마담이 길게 써 줘요'}</p>`);
  return H.join(''); }
function render(){ K.keepOpen(host,()=>{ host.innerHTML=build(); }); K.status(host.querySelector('#mdst'),Object.assign({who:'마담이 연애 장부'},ST)); }
window.MadamPrem={open(el,o){ if(!el||!o||!o.P) return false; host=el; O=Object.assign({},o); nick=o.name||''; prep(); host.className='pkx dark'; host.style.setProperty('--pk-acc','var(--c)'); host.hidden=false; K.bind(host); render();
  const f=host.querySelector('.pk-row.pk-hi'); if(f) f.classList.add('open');
  const P=O.P, k=[P.y,P.m,P.d,P.h].map(p=>p?p.join('.'):'x').join('-')+'-madam-'+O.g+'-'+O.y+'.'+O.mo;
  K.runAI({key:k,ver:'v1',parts:prompts(),apply,rerender:render,S:ST}); return true; }};
})();
