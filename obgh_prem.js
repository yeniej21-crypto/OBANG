/* 오방 궁합 프리미엄 — 1위 신이 쓴 2027년 편지 (결제 뒤 결과 아래에 이어짐)
   계산: prem2_core(2027 절월) + 신과의 가까움 점수(그달 오행 · 신의 일주와 합충 · 빈칸 채움) → 가까워지는 달 · 개운 미션
   → AI(그 신의 말투) · 없으면 초안 */
(function(){
const S_=window.Saju, X=window.SajuX, {GAN,JI,EL,stEl,BR_EL}=S_; const $=id=>document.getElementById(id); const K=window.PK;
const EK='木火土金水', EN=['나무','불','흙','쇠','물'];
const VOICE={하람:{st:'하람(木 · 靑龍). 다정한 존댓말(~요). 봄볕처럼 따뜻하게 북돋운다. 비유는 새싹 · 나무 · 봄.',tok:'{P}',jd:1},
 이안:{st:'이안(火 · 朱雀). 직설적인 반말. 짧고 뜨겁게, 돌려 말하지 않는다. 비유는 불씨 · 햇빛 · 여름.',tok:'{N}',jd:0},
 도준:{st:'도준(土 · 黃龍). 무뚝뚝하고 짧은 반말. 말수는 적지만 든든하다. 비유는 땅 · 기둥 · 밥.',tok:'{N}',jd:0},
 시온:{st:'시온(金 · 白虎). 차갑고 정중한 존댓말(~십시오, ~습니다). 군더더기 없이 잘라 말한다. 비유는 칼 · 서리 · 가을.',tok:'{P}',jd:1},
 재이:{st:'재이(水 · 玄武). 조용하고 깊은 반말. 천천히, 낮게 말한다. 비유는 물 · 밤 · 강.',tok:'{N}',jd:0}};
const LUCK=[{col:'초록 · 연두',dir:'동쪽',num:'3 · 8',time:'아침 일찍',place:'숲길 · 공원 · 화분 곁',act:'새로 시작하는 일 하나 정하기',mt:'새 일 하나 시작하기'},
 {col:'빨강 · 주황',dir:'남쪽',num:'2 · 7',time:'한낮',place:'햇빛 드는 창가 · 사람 많은 곳',act:'미뤄 둔 말 한마디 먼저 꺼내기',mt:'먼저 말 꺼내기'},
 {col:'노랑 · 황토',dir:'가운데 · 집',num:'5 · 10',time:'오후',place:'흙길 · 집 부엌 · 오래 다닌 단골집',act:'끼니 거르지 않고 하루 루틴 지키기',mt:'하루 루틴 지키기'},
 {col:'흰색 · 은색',dir:'서쪽',num:'4 · 9',time:'저녁',place:'정돈된 책상 · 조용한 카페',act:'안 쓰는 물건과 끊을 관계 하나 정리하기',mt:'하나 덜어 내기'},
 {col:'검정 · 남색',dir:'북쪽',num:'1 · 6',time:'밤',place:'물가 · 욕조 · 밤 산책길',act:'잠 일찍 자고 혼자 있는 시간 만들기',mt:'혼자 쉬는 밤 만들기'}];
let O=null,F=null,M=null,C=null,ST={},V=null,nick='';
function tk(t){ t=String(t==null?'':t); if(!nick) return K.esc(t.replace(/\{N\}/g,'너').replace(/\{P\}/g,'당신')); return K.tok(t,nick); }
function prep(){ O=window.OGF; if(!O||!O.me||!O.W) return false; const me=O.me, W=O.W; V=VOICE[W.n]; nick=me.name||'';
  let y=+me.y,m=+me.m,d=+me.d; if(me.cal==='l'){ const s=S_.lunarToSolar(y,m,d,!!me.leap); if(s){ y=s.y; m=s.m; d=s.d; } }
  F=window.Prem2Core.build(S_,X,{y,m,d,h:me.h==null||me.h===''||+me.h<0?null:+me.h,g:me.g||'f'});
  M=F.months.map((o,i)=>{ let c=o.sc; const why=[];
    if(BR_EL[o.b]===W.el){ c+=12; why.push(`달의 지지 ${JI[o.b]}가 ${EK[W.el]}`); } if(stEl(o.s)===W.el){ c+=6; why.push(`달의 천간 ${GAN[o.s]}가 ${EK[W.el]}`); }
    if(S_.isHap(o.b,W.d[1])){ c+=8; why.push(`${W.n}의 일지 ${JI[W.d[1]]}와 합`); } if(S_.isChung(o.b,W.d[1])){ c-=8; why.push(`${W.n}의 일지 ${JI[W.d[1]]}와 충`); }
    if(o.fill) why.push('빈칸이 채워짐');
    return {i,o,c:Math.max(30,Math.min(97,Math.round(c))),why}; });
  C=draft(); ST={}; return true; }
function draft(){ const W=O.W, jd=V.jd, top=[...M].sort((a,b)=>b.c-a.c), lo=[...M].sort((a,b)=>a.c-b.c)[0], L=LUCK[W.el], T=V.tok;
  const e=(a,b)=>jd?a:b;
  return {draft:true,
   seen:[e(`${T}, 저는 ${W.n}이에요. ${T} 사주에서 ${EN[W.el]}(${EK[W.el]}) 기운은 ${F.cnt[W.el]}개예요. 제가 곁에 온 이유가 거기 있어요.`,`${T}. 나 ${W.n}. 네 사주에 ${EN[W.el]}(${EK[W.el]}) 기운이 ${F.cnt[W.el]}개야. 내가 온 이유가 그거야.`),
     e(`${T} 일간은 ${GAN[F.dm]}, ${EN[stEl(F.dm)]}의 기운이에요. ${W.R[0]?W.R[0].t+'라서 우리가 잘 맞아요.':''}`,`네 일간은 ${GAN[F.dm]}, ${EN[stEl(F.dm)]}야. ${W.R[0]?W.R[0].t+'. 그래서 우리가 맞아.':''}`)],
   months:M.map(x=>({title:x.c>=75?'가장 가까운 달':x.c>=60?'곁에 있는 달':'멀리서 보는 달',text:`${x.o.term} 달 ${x.o.gz}. ${x.why.join(', ')||e('조용히 지나가는 달이에요.','조용히 지나가는 달이야.')}`,tip:x.c>=75?e('이달엔 먼저 불러 주세요','이달엔 나를 불러'):e('무리하지 마세요','무리하지 마')})),
   missions:[{t:`${top[0].o.start.m}월에 ${L.mt}`,d:e(`저와 가장 가까운 달이에요. ${L.act}.`,`나랑 제일 가까운 달이야. ${L.act}.`)},
     {t:`${L.place.split(' · ')[0]}에 자주 가기`,d:e(`${EK[W.el]} 기운이 모이는 곳이에요. 일주일에 한 번이면 충분해요.`,`${EK[W.el]} 기운이 모이는 데야. 일주일에 한 번.`)},
     {t:`${lo.o.start.m}월엔 쉬어 가기`,d:e('제가 멀어지는 달이에요. 큰 결정은 미뤄 두세요.','내가 멀어지는 달이야. 큰 결정은 미뤄.')}],
   letter:e([`${T}께.`,`올해 우리가 가장 가까운 달은 ${top.slice(0,2).map(x=>x.o.start.m+'월').join('과 ')}이에요.`,'그때 저를 떠올려 주세요. 제가 먼저 가 있을게요.'],[`${T}.`,`올해 우리가 제일 가까운 달은 ${top.slice(0,2).map(x=>x.o.start.m+'월').join('이랑 ')}이야.`,'그때 나 불러. 먼저 가 있을게.'])}; }
function card(ids){ const W=O.W, P=F.P, gz=p=>p?GAN[p[0]]+JI[p[1]]:'모름';
  const c={화자:W.n+' '+W.h+' '+EK[W.el],신의일주:GAN[W.d[0]]+JI[W.d[1]],궁합점수:W.s,궁합근거:W.R.map(r=>r.t+': '+r.p),상대호칭토큰:V.tok,
   상대:{성별:F.male?'남':'여',일간:GAN[F.dm]+EL[stEl(F.dm)],원국:[['년주',P.y],['월주',P.m],['일주',P.d],['시주',P.h]].map(([n,p])=>n+' '+gz(p)),오행개수:[...EK].map((k,i)=>k+F.cnt[i]).join(' '),빈칸:EK[F.blank],원국신살:F.natal.map(x=>x.at+' '+x.k)},
   개운:Object.assign({오행:EK[W.el]},LUCK[W.el])};
  if(ids&&!ids.length) c.달요약=M.map(x=>`${x.o.start.m}월 ${x.o.gz} 가까움${x.c}`);
  else c.달=(ids||[]).map(i=>{ const x=M[i], o=x.o; return {번호:i,달:o.start.m+'월',절기:o.term,간지:o.gz,가까움:x.c,가까움근거:x.why,그달운점수:o.sc,천간십성:o.t1,지지십성:o.t2,관계:o.br.map(r=>r.at+' '+r.k).concat(o.sr.map(r=>r.at+' '+r.k)),신살:o.ss}; });
  return JSON.stringify(c); }
function prompts(){ const A=window.PremAI, W=O.W;
  const ST0=`[문체 규칙 · 오방사주 ${V.st}]\n- 듣는 사람을 부를 때는 ${V.tok} 토큰만 쓴다(화면이 이름으로 바꾼다).\n`+A.COMMON.replace('- 이름을 부를 때는 {N} 토큰만 쓴다(화면이 이름과 호격으로 바꾼다). 이름을 직접 쓰지 않는다.\n','');
  const core=`${ST0}\n\n[할 일] 오방 궁합 프리미엄 '${W.n}의 편지'의 본문을 쓴다. 화자는 ${W.n} 자신이고, 궁합 1위로 뽑힌 신이 2027년 한 해 동안 상대 곁에서 어떻게 함께할지 말한다.
출력 JSON 형식: {"seen":["${W.n}이 본 상대 3단락. 상대의 일간과 오행, 빈칸, 궁합 근거로 왜 자신이 왔는지. 단락마다 120~180자"],"missions":[{"t":"개운 미션 제목 8~16자","d":"구체적인 행동 50~90자. 개운 항목(색 · 방향 · 장소 · 시간)과 가까운 달을 근거로"}],"letter":["${W.n}의 편지 6~7단락, 단락마다 50~110자. 첫 단락은 상대를 부르는 말, 마지막은 다시 만나자는 말"]}
missions는 정확히 3개.

[사실 카드]
${card([])}`;
  const cal=ids=>`${ST0}\n\n[할 일] '${W.n}와 가까워지는 2027' 달별 풀이를 ${W.n}의 목소리로 쓴다. 입춘 기준 절월이다. 가까움 점수와 근거, 그달 운을 함께 본다.
출력 JSON 형식: 배열. 달마다 {"i":달 번호,"title":"그달 제목 6~12자","text":"그달 이야기 140~200자","tip":"그달 한 줄 당부 10~20자"}
대상 달 번호: ${ids.join(', ')}

[사실 카드]
${card(ids)}`;
  const isArr=d=>Array.isArray(d)&&d.every(x=>x&&typeof x.text==='string');
  return [{id:'core',prompt:core,check:d=>d&&Array.isArray(d.seen)&&Array.isArray(d.letter)},{id:'m0',prompt:cal([0,1,2,3,4,5]),check:isArr},{id:'m1',prompt:cal([6,7,8,9,10,11]),check:isArr}]; }
function apply(id,d){ if(id==='core') ['seen','missions','letter'].forEach(k=>{ if(d[k]&&d[k].length) C[k]=d[k]; }); else d.forEach(x=>{ const i=+x.i; if(i>=0&&i<12) C.months[i]=Object.assign({},C.months[i],x); }); }
function build(){ const W=O.W, ps=a=>(a||[]).map(p=>`<p class="pk-p">${tk(p)}</p>`).join(''), L=LUCK[W.el];
  const top=[...M].sort((a,b)=>b.c-a.c), hi=top.slice(0,3), lo=top.slice(-2);
  const H=[`<div class="pk-st" id="ogst" hidden></div>`];
  H.push(K.sec(`${W.n}의 편지 · ${W.n}${K.bt(W.n)?'이':'가'} 본 너`,`<div class="pk-who" style="margin-bottom:10px"><i style="background-image:url('${W.img}')"></i><em>${W.h} ${W.n} · ${GAN[W.d[0]]}${JI[W.d[1]]} 일주 · 궁합 ${W.s}</em></div>`+ps(C.seen)+K.ev(W.R.map(r=>r.t))));
  H.push(K.sec(`${W.n}${K.bt(W.n)?'과':'와'} 가까워지는 2027`,`<div class="pk-acc">${M.map((x,i)=>{ const c=C.months[i]||{}, o=x.o; const tag=hi.includes(x)?'가까움':lo.includes(x)?'멀어짐':'';
    return K.row({k:'o'+i,cls:hi.includes(x)?'pk-hi':lo.includes(x)?'pk-lo':'',a:`${o.start.m}월`,asub:`${o.start.m}.${o.start.d}~`,b:`<em>${o.gz}</em>${tk(c.title||'')}${tag?`<span class="pk-tag">${tag}</span>`:''}`,c:x.c,body:ps([c.text])+(c.tip?`<p class="pk-key"><b>이달 한 줄</b>${tk(c.tip)}</p>`:'')+K.ev(x.why.concat(o.ss))}); }).join('')}</div>`,'입춘 기준 · 숫자는 가까움'));
  H.push(K.sec(`${W.n}의 개운 미션`,`<div class="pk-rx3"><div><small>색</small><b>${L.col}</b></div><div><small>방향</small><b>${L.dir}</b></div><div><small>숫자</small><b>${L.num}</b></div></div><div class="pk-cards">${(C.missions||[]).slice(0,3).map((m,i)=>`<div class="pk-card"><b>${i+1}</b><div><p class="pk-ct">${tk(m.t)}</p><p>${tk(m.d)}</p></div></div>`).join('')}</div>`,`${EK[W.el]} 기운 채우기`));
  H.push(`<div class="pk-sec pk-letter"><h3>${W.n}${K.bt(W.n)?'이':'가'} 쓴 2027년 편지</h3><div class="pk-lt">${(C.letter||[]).map(p=>`<p>${tk(p)}</p>`).join('')}</div><p class="pk-sg">${W.n} <i>${W.h}</i></p></div>`);
  H.push(`<p class="pk-note" style="margin:14px 0 0">${ST.ai?`이 편지는 만세력 계산 근거만 재료로 AI가 ${W.n}의 말투로 쓴 글이에요. 명리 전문가 감수 전 원고예요`:`이 부분은 해석 사전으로 조립한 초안이에요. 정식 서비스에서는 같은 근거로 ${W.n}${K.bt(W.n)?'이':'가'} 길게 써 줘요`}</p>`);
  return H.join(''); }
function render(){ const host=$('oprem'); K.keepOpen(host,()=>{ host.innerHTML=build(); }); K.status($('ogst'),Object.assign({who:O.W.n+'의 편지'},ST)); }
window.OgPrem={open(){ const host=$('oprem'); if(!host||!prep()) return false; host.className='pkx dark'; host.style.setProperty('--pk-acc',O.W.c); host.hidden=false; K.bind(host); render();
  const f=host.querySelector('.pk-row.pk-hi'); if(f) f.classList.add('open');
  K.runAI({key:F.key+'-og-'+O.W.k,ver:'v1',parts:prompts(),apply,rerender:render,S:ST}); return true; }};
})();
