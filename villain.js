/* 악역 셋 공통 동작(10/3): 등장 입체 영상 → 대사 영상(소리) → 무료 진단 → 결과 한 장 → 더 보기 풀이(10/3 20:40 은주: 악역 콘텐츠는 전부 무료) → 막아 주는 오방신.
   계산은 saju.js 만세력에 붙인다. 흑매 = 원진 · 귀문 · 충(악연 매듭), 그믐 = 공망(빈칸), 삼재 = 띠 삼합으로 들 · 눌 · 날삼재.
   겁주고 끝내지 않는다. 결과는 늘 '피하는 법'과 '지켜 주는 신'으로 끝난다. */
(function(){
const $=id=>document.getElementById(id), S=window.Saju, JI_K=S.JI_K, GAN_K=S.GAN_K;
const CF='https://d8j0ntlcm91z4.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/hf_20261003_', D2='https://d2ol7oe51mr4n9.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/';
const ANI=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
const V={
 heuk:{name:'흑매',page:'heukmae.html',tag:'그림자 손님 · 원진과 귀문의 실',line:'월하의 옛 제자. 붉은 실 사이에 검은 실을 몰래 섞는다.',
   still:CF+'101836_ccb27e8d-f3d5-430a-975b-c64a04d3c7cf_min.webp',enter:'',talk:'',
   free:'우리 사이 조심할 때',freeSub:'나와 그 사람 생일로, 둘이 언제 조금 어긋나기 쉬운지 봐요.',paid:'관계 풀이',paidSub:'무엇부터 조심할지, 어긋나기 쉬운 달과 풀리는 달, 피하면 좋은 말',
   guard:{who:'월하',img:'img/taegil.jpg',t:'월하의 붉은 실 궁합',d:'흑매가 섞은 검은 실을 끊어 내는 건 월하의 일이야.',href:'redthread.html'}},
 geum:{name:'그믐',page:'geumeum.html',tag:'그림자 손님 · 공망의 화신',line:'달이 사라지는 밤에만 걷는다. 사람마다 비어 있는 자리를 알고 있다.',
   still:CF+'102005_5906aacf-085d-40b2-acda-136da797f5cc_min.webp',enter:'',talk:'',
   free:'내 빈칸 확인',freeSub:'생일 하나로, 내 사주에서 비어 있는 자리와 그 자리가 열리는 달을 봐요.',paid:'빈칸 지키기',paidSub:'빈칸이 열리는 달마다 지키는 법, 다가오는 그믐밤 달력',
   guard:{who:'노을',img:'img/noeul.jpg',t:'노을의 해와 달의 운세',d:'달이 없는 밤에도, 해가 지는 자리는 노을이 지켜.',href:'noeul.html'}},
 sam:{name:'삼재 삼남매',page:'samjae.html',tag:'그림자 손님 · 들이 · 눌이 · 날이',line:'삼 년마다 찾아오는 남매. 들어오고, 눌러앉고, 나간다.',
   still:CF+'102844_e93d3f57-cfef-45d4-ad1d-668f8f7cf23a_min.webp',enter:'',talk:'',
   free:'나의 삼재',freeSub:'띠 하나로, 지금이 삼재인지와 다음 삼재가 언제인지 봐요.',paid:'삼재 넘기기',paidSub:'삼재 해의 달별로 조심할 것과 해 두면 좋은 일',
   guard:{who:'삼신 할매',img:'img/halmae.jpg',t:'할매의 2027 신년운세',d:'한 해 운을 미리 보는 건 할매가 제일 잘해.',href:'sinnyeon.html'}}
};
const K=(window.VIL&&window.VIL.k)||'heuk', C=V[K];
window.VIL_CONF=V;
/* 영상 주소는 생성 뒤 채운다(villain.js 한 곳) */
const VID={heuk:{enter:D2+'9d07049a-9f0b-45e3-9547-21f1841ad87d.mp4',talk:D2+'a62f2756-99cd-4698-ae62-27e670c7ff87.mp4'},geum:{enter:D2+'c046140c-d852-47b8-9472-52acd1fa393c.mp4',talk:D2+'a826d10b-84dc-4210-89af-afaaa102a05a.mp4'},sam:{enter:D2+'9ac5edd8-b3bb-4fee-b064-025be7356f3c.mp4',talk:D2+'a0af08be-6524-4836-b882-7a32404a1ad8.mp4'}};
['heuk','geum','sam'].forEach(k=>{ const u=VID[k]; V[k].enter=u.enter.includes('__')?'':u.enter; V[k].talk=u.talk.includes('__')?'':u.talk; });

const toast=t=>{ let e=$('toast'); if(!e){ e=document.createElement('div'); e.id='toast'; e.className='toast'; document.body.appendChild(e); } e.textContent=t; e.classList.add('on'); clearTimeout(e._t); e._t=setTimeout(()=>e.classList.remove('on'),1800); };
const loadMe=()=>{ try{ return JSON.parse(sessionStorage.getItem('me')||localStorage.getItem('obMe')||'null'); }catch(e){ return null; } };
const saveMe=o=>{ try{ const old=loadMe()||{}; const n=Object.assign(old,o); sessionStorage.setItem('me',JSON.stringify(n)); localStorage.setItem('obMe',JSON.stringify(n)); }catch(e){} };
function solarOf(me){ if(me.cal==='l'){ const s=S.lunarToSolar(+me.y,+me.m,+me.d,!!me.leap); if(s) return s; } return {y:+me.y,m:+me.m,d:+me.d}; }
const PIL=me=>{ const s=solarOf(me); return S.pillars(s.y,s.m,s.d,me.h==null||me.h===''?null:+me.h); };

/* ---------- 1. 등장 ---------- */
function hero(){ const h=$('vh'); h.querySelector('.po').src=C.still;
  h.querySelector('.nm').innerHTML=`<small>${C.tag}</small><h1>${C.name}</h1><p>${C.line}</p>`;
  /* 10/3 21:00 은주: 음성이 너무 늦게 나와 사람들이 이미 내려감 → 대사 영상(입체 움직임 포함)을 들어오자마자 소리 없이 바로 재생,
     '소리 켜고 들어가기'나 첫 터치에 소리 켬(1초 넘게 지났으면 처음부터). 대사가 끝나면 등장 영상 반복 */
  const v1=$('v1'), v2=$('v2'), snd=$('snd'); let sndOn=false;
  const loop=()=>{ if(!C.enter) return; if(!v1.src) v1.src=C.enter; v1.loop=true; v1.muted=true; v1.onplaying=()=>{ v1.classList.add('on'); v2.classList.remove('on'); }; v1.play().catch(()=>{}); };
  const kick=()=>{ const p=v2.play(); if(p&&p.catch) p.catch(e=>{ if(e&&e.name==='NotAllowedError'&&!v2.muted){ v2.muted=true; sndOn=false; v2.play().catch(loop); } else if(!(e&&e.name==='NotAllowedError')) loop(); }); };
  const up=force=>{ if(!C.talk||(sndOn&&!force)) return; let off=false; try{ off=sessionStorage.getItem('obSnd')==='0'; }catch(e){} if(off&&!force) return;
    sndOn=true; snd.classList.add('on'); v1.pause(); v1.classList.remove('on'); v2.classList.add('on'); v2.muted=false; if(force||v2.ended||v2.currentTime>1){ try{ v2.currentTime=0; }catch(e){} } kick(); };
  if(C.talk){ v2.src=C.talk; v2.muted=true; v2.onplaying=()=>v2.classList.add('on'); v2.onended=()=>loop();
    let act=false; try{ act=!!(navigator.userActivation&&navigator.userActivation.hasBeenActive); }catch(e){} if(act){ v2.muted=false; sndOn=true; snd.classList.add('on'); }
    kick(); if(C.enter){ setTimeout(()=>{ v1.src=C.enter; v1.preload='auto'; },1500); }
    window.addEventListener('obsound',()=>up(false));
    document.addEventListener('pointerdown',function f(e){ if(e.target.closest('#snd')) return; document.removeEventListener('pointerdown',f,true); setTimeout(()=>up(false),260); },true); }
  else loop();
  snd.onclick=()=>up(true);
}

/* ---------- 2. 입력 ---------- */
const yNow=new Date().getFullYear();
function dateRow(id,me){ me=me||{}; const ys=[]; for(let y=yNow-17;y>=1950;y--) ys.push(y);
  return `<div class="seg" id="${id}C"><button data-v="s" class="${me.cal!=='l'?'on':''}" type="button">양력</button><button data-v="l" class="${me.cal==='l'?'on':''}" type="button">음력</button></div>
  <div class="g3"><select id="${id}Y">${ys.map(y=>`<option ${+me.y===y||(!me.y&&y===1996)?'selected':''}>${y}</option>`).join('')}</select><select id="${id}M">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${+me.m===i+1?'selected':''}>${i+1}월</option>`).join('')}</select><select id="${id}D"></select></div>`; }
function wireDate(id,me){ me=me||{}; const fill=()=>{ const y=+$(id+'Y').value, m=+$(id+'M').value, n=new Date(y,m,0).getDate(), cur=+$(id+'D').value||+me.d||14; $(id+'D').innerHTML=Array.from({length:n},(_,i)=>`<option value="${i+1}" ${cur===i+1?'selected':''}>${i+1}일</option>`).join(''); };
  fill(); $(id+'Y').onchange=$(id+'M').onchange=fill; seg(id+'C'); }
function seg(id){ $(id).querySelectorAll('button').forEach(b=>b.onclick=()=>$(id).querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))); }
const readDate=id=>{ const cal=$(id+'C').querySelector('.on').dataset.v; const o={cal,y:+$(id+'Y').value,m:+$(id+'M').value,d:+$(id+'D').value}; if(cal==='l'&&!S.lunarToSolar(o.y,o.m,o.d,false)){ toast('없는 음력 날짜예요'); return null; } return o; };

function form(){ const me=loadMe()||{}, f=$('fm'); $('fh').innerHTML=`<small>무료 · 상시</small><b>${C.free}</b>`;
  if(K==='heuk'){ f.innerHTML=`<label>내 생일</label>${dateRow('a',me)}<label style="margin-top:6px">그 사람 생일</label>${dateRow('b',{})}<button class="go" id="goF" type="button">우리 사이 보기</button>`; wireDate('a',me); wireDate('b',{}); }
  else if(K==='geum'){ f.innerHTML=`<label>내 생일</label>${dateRow('a',me)}<button class="go" id="goF" type="button">내 빈칸 보기</button>`; wireDate('a',me); }
  else { const my=me.y?((+me.y-4)%12+12)%12:-1; f.innerHTML=`<label>띠</label><div class="ti" id="tti">${ANI.map((a,i)=>`<button type="button" data-i="${i}" class="${i===my?'on':''}">${a}</button>`).join('')}</div><button class="go" id="goF" type="button">삼재 보기</button>`;
    $('tti').querySelectorAll('button').forEach(b=>b.onclick=()=>$('tti').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))); }
  $('goF').onclick=()=>{ let R;
    if(K==='heuk'){ const a=readDate('a'), b=readDate('b'); if(!a||!b) return; saveMe(a); R=heukCalc(a,b); }
    else if(K==='geum'){ const a=readDate('a'); if(!a) return; saveMe(a); R=geumCalc(a); }
    else { const on=$('tti').querySelector('.on'); if(!on){ toast('띠를 골라 줘요'); return; } R=samCalc(+on.dataset.i); }
    show(R); }; }

/* ---------- 3. 계산 ---------- */
const YUANJIN=[7,6,9,8,11,10,1,0,3,2,5,4];           /* 원진: 子未 丑午 寅酉 卯申 辰亥 巳戌 */
const GWIMUN=[9,6,7,8,11,10,1,2,3,0,5,4];            /* 귀문: 子酉 丑午 寅未 卯申 辰亥 巳戌 */
const LIUHE=[1,0,11,10,9,8,7,6,5,4,3,2];
const MON_BR=m=>m%12;                                  /* 양력 달 ≈ 그달 지지(1월 丑 … 12월 子), 절기 경계는 달 초 */
function nextMonths(n){ const t=new Date(), out=[]; for(let i=0;i<n;i++){ const d=new Date(t.getFullYear(),t.getMonth()+i,1); out.push({y:d.getFullYear(),m:d.getMonth()+1,b:MON_BR(d.getMonth()+1)}); } return out; }
function heukCalc(a,b){ const A=PIL(a), B=PIL(b), ad=A.d[1], bd=B.d[1], ay=A.y[1], by=B.y[1]; const k=[];
  if(YUANJIN[ad]===bd) k.push({t:'원진',w:'가까이 지낼수록 서운함이 쌓이기 쉬운 점',at:'두 사람의 일지(배우자 자리)',c:'#3a2a2a'});
  if(YUANJIN[ay]===by) k.push({t:'원진',w:'처음부터 묘하게 신경 쓰이는 점',at:'두 사람의 띠',c:'#3a2a2a'});
  if(GWIMUN[ad]===bd) k.push({t:'귀문',w:'예민해져서 말꼬리를 잡기 쉬운 점',at:'두 사람의 일지',c:'#7a1f2b'});
  if(GWIMUN[ay]===by&&YUANJIN[ay]!==by) k.push({t:'귀문',w:'괜히 마음이 곤두서기 쉬운 점',at:'두 사람의 띠',c:'#7a1f2b'});
  if(S.isChung(ad,bd)) k.push({t:'충',w:'부딪히면 크게 튀기 쉬운 점',at:'두 사람의 일지',c:'#b8352a'});
  const hap=LIUHE[ad]===bd||S.isHap(ad,bd);
  const n=k.length, gd=n===0?'순한 사이':n===1?'살짝 주의':n===2?'조심할 때 있음':'자주 챙길 사이';
  const title=n===0?'흑매가 끼어들 틈이 없는 사이':n===1?'가끔 실 한 가닥이 걸리는 사이':n===2?'조심할 때를 알면 편해지는 사이':'서로 자주 챙겨야 하는 사이';
  const say=n===0?'재미없네. 이 둘 사이엔 내 실이 안 먹혀.':n===1?'하나쯤은 누구나 있어. 세게 당기지만 않으면 돼.':n===2?'언제 엉키는지 알면, 미리 풀 수 있지.':'엉키기 쉬운 만큼, 순서대로 풀면 돼.';
  /* 부딪히는 달: 앞으로 12달 중 그달 지지가 두 사람 일지와 원진 · 충 */
  const risk=nextMonths(12).filter(o=>YUANJIN[o.b]===ad||YUANJIN[o.b]===bd||S.isChung(o.b,ad)||S.isChung(o.b,bd));
  const easy=nextMonths(12).filter(o=>LIUHE[o.b]===ad||LIUHE[o.b]===bd);
  return {k:'heuk',knots:k,n,hap,gd,title,say,risk,easy,A,B,
    why:`근거 · 나 ${GAN_K[A.d[0]]}${JI_K[ad]}일생(${ANI[ay]}띠), 그 사람 ${GAN_K[B.d[0]]}${JI_K[bd]}일생(${ANI[by]}띠)의 일지 · 띠를 원진 · 귀문 · 충으로 비교했어요${hap?' · 일지가 서로 합이라 풀리는 실도 있어요':''}`}; }
const GROUP=['비겁','식상','재성','관성','인성'];
const AREA=[{a:'사람',d:'내 편, 친구, 동료',keep:'믿는 사람에게도 돈 · 약속은 글로 남겨 둬요. 빈 자리를 사람으로 급하게 채우지 않아요.'},
  {a:'표현',d:'내가 만든 것, 말, 결과물',keep:'그달엔 결과물을 서둘러 내놓지 말고 한 번 더 다듬어요. 말이 앞서면 빈칸이 커져요.'},
  {a:'돈',d:'들어오고 나가는 돈, 재물',keep:'그달엔 큰돈을 움직이지 않아요. 새는 돈(구독 · 할부)을 먼저 막아요.'},
  {a:'자리',d:'일, 직함, 평판(여성에게는 연인 자리도)',keep:'그달엔 자리 이동 · 이직 결정을 미뤄요. 윗사람과 부딪힐 일은 하루 늦춰요.'},
  {a:'집',d:'집, 공부, 나를 돕는 사람',keep:'그달엔 계약 · 이사 서류를 두 번 봐요. 공부는 새로 시작하기보다 이어 가요.'}];
/* 10/3 20:40 은주: '비어 있는 자리는 사람 · 집'이 무슨 뜻인지 모르겠음 → 공망을 쉬운 말로 먼저 풀고, 자리마다 '이렇게 느껴져요 · 이럴 땐'으로 */
const FEEL=['정작 기대고 싶을 때 곁에 있는 사람이 비는 느낌. 사람은 많은데 내 편은 적다고 느끼기 쉬워요.',
  '열심히 만들고 말해도 생각만큼 알아주지 않는 느낌. 결과가 손에서 빠져나가기 쉬워요.',
  '들어온 돈이 오래 머물지 않고 어디론가 새는 느낌. 모으는 것보다 지키는 게 어려워요.',
  '애쓴 만큼 이름 · 자리가 남지 않는 느낌. 자리가 자주 바뀌거나 평가가 늦게 와요.',
  '집 · 서류 · 공부처럼 기반이 되는 일이 자꾸 미뤄지는 느낌. 도와줄 어른이 아쉬울 때가 있어요.'];
function geumCalc(a){ const P=PIL(a); const ds=P.d[0], db=P.d[1];
  let idx=0; for(let i=0;i<60;i++){ if(i%10===ds&&i%12===db){ idx=i; break; } }
  const x=Math.floor(idx/10), kw=[((10-2*x)%12+12)%12,((11-2*x)%12+12)%12];
  const areas=[...new Set(kw.map(b=>S.relBranch(ds,b)))].map(r=>Object.assign({r},AREA[r]));
  const pos=[]; if(kw.includes(P.y[1])) pos.push('띠 자리(어릴 때 · 집안)'); if(kw.includes(P.m[1])) pos.push('달 자리(일터 · 사회)'); if(P.h&&kw.includes(P.h[1])) pos.push('시 자리(말년 · 자식)');
  const open=nextMonths(12).filter(o=>kw.includes(o.b));
  const om=[...new Set(open.map(o=>o.m))].slice(0,2).map(m=>m+'월').join(' · ');
  const say=pos.length?`보이지. 네 사주 여덟 글자 안에 정말 비어 있는 칸이 있어. 거긴 내가 자주 들러.`:`평소엔 티가 안 나. 네 여덟 글자 안엔 빈칸이 없거든. 대신 ${om||'빈 글자가 돌아오는 달'}엔 내가 지나가.`;
  return {k:'geum',kw,areas,pos,open,om,P,gd:JI_K[kw[0]]+JI_K[kw[1]]+' 공망',title:`${areas.map(o=>o.a).join(' · ')} 쪽이 잘 비어`,say,
    why:`근거 · ${GAN_K[ds]}${JI_K[db]}일은 갑${['자','술','신','오','진','인'][x]}순이라 ${JI_K[kw[0]]} · ${JI_K[kw[1]]}이 공망(비어 있는 글자)이에요. 두 글자가 일간에게 무엇인지로 빈 자리를 읽었어요`}; }
const SAMG=[[2,3,4],[11,0,1],[8,9,10],[5,6,7]];        /* 삼재가 드는 해의 지지(들 · 눌 · 날) */
const GRP_OF=b=>[[8,0,4],[5,9,1],[2,6,10],[11,3,7]].findIndex(g=>g.includes(b));
function samCalc(ti){ const g=GRP_OF(ti), yrs=SAMG[g], now=new Date(), Y=now.getFullYear()-((now.getMonth()<1||(now.getMonth()===1&&now.getDate()<4))?1:0);
  const yb=y=>((y-4)%12+12)%12, KIND=['들삼재','눌삼재','날삼재'], WHO=['들이','눌이','날이'];
  const list=[]; for(let y=Y;y<Y+12;y++){ const p=yrs.indexOf(yb(y)); if(p>=0) list.push({y,p,kind:KIND[p],who:WHO[p]}); }
  const cur=list.find(o=>o.y===Y), nxt=list.find(o=>o.y>Y&&(!cur||o.p===0))||list.find(o=>o.y>Y);
  const gd=cur?cur.kind:'삼재 아님'; const title=cur?`${Y}년은 ${cur.kind}, ${cur.who}가 와 있어`:`${Y}년은 삼남매가 안 와`;
  const say=cur?['문 열어. 이제 들어간다.','여기 좀 눌러앉을게.','곧 나갈 거야. 그래도 문단속은 해.'][cur.p]:'이번엔 지나가. 다음에 들를게.';
  const years=list.filter((o,i,a)=>o.y>=Y).slice(0,3);
  return {k:'sam',ti,cur,nxt,years,gd,title,say,Y,why:`근거 · ${ANI[ti]}띠는 ${['신자진','사유축','인오술','해묘미'][g]} 삼합이라 ${yrs.map(b=>JI_K[b]).join(' · ')}년이 삼재예요(입춘 기준).`}; }

/* ---------- 4. 결과 ---------- */
function knotArt(n,hap){ const W=330,H=110, xs=n?Array.from({length:n},(_,i)=>40+(250/(n+1))*(i+1)):[];
  return `<svg class="art" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="M6 60 C 70 40, 120 80, 170 58 S 270 44, 324 62" fill="none" stroke="#2a2119" stroke-width="2.4" stroke-linecap="round"/>
   ${hap?'<path d="M6 76 C 80 64, 140 92, 200 74 S 280 66, 324 78" fill="none" stroke="#c0392b" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>':''}
   ${xs.map(x=>`<g transform="translate(${x} 56)"><circle r="11" fill="#2a1414"/><path d="M-6 -3 C -2 -10, 6 -6, 3 0 C 0 6, -7 5, -4 -1" fill="none" stroke="#c0392b" stroke-width="2"/></g>`).join('')}</svg>`; }
function voidArt(kw){ return `<svg class="art" viewBox="0 0 330 120" aria-hidden="true">${Array.from({length:12},(_,i)=>{ const x=20+i*26.5, v=kw.includes(i);
   return `<g transform="translate(${x} 60)"><circle r="11" fill="${v?'none':'#2b3550'}" stroke="${v?'#2b3550':'none'}" stroke-width="1.6" stroke-dasharray="${v?'3 3':''}"/><text y="28" text-anchor="middle" font-size="10" fill="#8f8475" font-family="Noto Sans KR">${JI_K[i]}</text></g>`; }).join('')}</svg>`; }
function samArt(R){ const yb=y=>((y-4)%12+12)%12; return `<svg class="art" viewBox="0 0 330 96" aria-hidden="true">${Array.from({length:6},(_,i)=>{ const y=R.Y+i, o=R.years.find(z=>z.y===y), x=30+i*54;
   return `<g transform="translate(${x} 40)"><rect x="-22" y="-18" width="44" height="36" fill="${o?['#5b3a8a','#4a3172','#3a2860'][o.p]:'#fff'}" stroke="#d8cfc2"/><text y="5" text-anchor="middle" font-size="12" font-weight="800" fill="${o?'#fff':'#8f8475'}" font-family="Noto Sans KR">${y}</text><text y="38" text-anchor="middle" font-size="10" fill="#8f8475" font-family="Noto Sans KR">${o?o.kind.slice(0,1)+'삼재':JI_K[yb(y)]+'년'}</text></g>`; }).join('')}</svg>`; }
const mlist=a=>a.length?a.slice(0,4).map(o=>`${o.y!==new Date().getFullYear()?String(o.y).slice(2)+'년 ':''}${o.m}월`).join(' · '):'없음';
function show(R){ const box=$('rs'); let h='';
  if(R.k==='heuk'){ h=`<div class="hd"><small>흑매가 본 우리 사이</small><span class="gd">${R.gd}</span><h2>${R.title}</h2></div>${knotArt(R.n,R.hap)}
     <p class="bb"><em>흑매</em>${R.say}</p>
     <dl class="tl"><div><dt>조심할 점</dt><dd>${R.n}가지</dd></div><div><dt>부딪히는 달</dt><dd>${R.risk.length?R.risk[0].m+'월':'없음'}</dd></div><div><dt>풀리는 실</dt><dd>${R.hap?'있음':'없음'}</dd></div></dl>
     ${R.n?`<ul>${R.knots.map(k=>`<li><b>${k.t} · ${k.at}</b>${k.w}</li>`).join('')}</ul>`:''}<p class="why">${R.why}</p>`; }
  else if(R.k==='geum'){ h=`<div class="hd"><small>그믐의 빈칸</small><span class="gd">${R.gd}</span><h2>${R.title}</h2></div>${voidArt(R.kw)}
     <p class="bb"><em>그믐</em>${R.say}</p>
     <div class="ex"><b>빈칸(공망)이 뭐냐면</b>사주의 열두 글자 중 두 글자는 태어날 때부터 '자리는 있는데 주인이 없는' 칸이에요. 네 빈 글자는 <em>${JI_K[R.kw[0]]} · ${JI_K[R.kw[1]]}</em>. 이 두 글자가 맡은 쪽의 일은 애써도 손에 덜 잡히고, 채워도 금방 비는 느낌이 들기 쉬워요. 나쁜 운이라기보다 '새는 곳'이라, 어디가 새는지 알면 막을 수 있어요.</div>
     <dl class="tl"><div><dt>빈 글자</dt><dd>${JI_K[R.kw[0]]} · ${JI_K[R.kw[1]]}</dd></div><div><dt>조심할 달</dt><dd>${R.om||'없음'}</dd></div><div><dt>내 사주 속 빈칸</dt><dd>${R.pos.length?R.pos.length+'곳':'없음'}</dd></div></dl>
     <ul>${R.areas.map(o=>`<li><b>${o.a} 쪽이 비기 쉬워 · ${o.d}</b>${FEEL[o.r]}<span class="kp">이럴 땐 · ${o.keep}</span></li>`).join('')}
     <li><b>내 사주 속 빈칸 · ${R.pos.length?R.pos.length+'곳':'없음'}</b>${R.pos.length?`빈 글자가 네 여덟 글자 안에 실제로 들어 있어요(${R.pos.join(' · ')}). 그 자리의 일은 평소에도 조금씩 비는 느낌이 있어요.`:'빈 글자가 네 여덟 글자 안에는 없어요. 그래서 평소엔 거의 티가 안 나고, 빈 글자가 돌아오는 달에만 살짝 느껴져요.'}</li>
     <li><b>조심할 달 · ${R.om||'없음'}</b>달마다 바뀌는 글자 중 네 빈 글자(${JI_K[R.kw[0]]} · ${JI_K[R.kw[1]]})가 돌아오는 달이에요. 이때 위의 쪽 일이 잘 새니까, 새로 채우기보다 새는 곳을 먼저 막아요.</li></ul><p class="why">${R.why}</p>`; }
  else { h=`<div class="hd"><small>삼남매의 삼재</small><span class="gd">${R.gd}</span><h2>${R.title}</h2></div>${samArt(R)}
     <p class="bb"><em>${R.cur?R.cur.who:'날이'}</em>${R.say}</p>
     <dl class="tl"><div><dt>올해</dt><dd>${R.cur?R.cur.kind:'아님'}</dd></div><div><dt>다음 삼재</dt><dd>${R.nxt?R.nxt.y+'년':'-'}</dd></div><div><dt>띠</dt><dd>${ANI[R.ti]}띠</dd></div></dl>
     <ul><li><b>들삼재 · 들이</b>들어오는 해. 새로 들이는 것(계약 · 사람 · 큰 물건)을 한 번 더 봐요.</li><li><b>눌삼재 · 눌이</b>눌러앉는 해. 무리하게 바꾸기보다 지키는 쪽이 이득이에요.</li><li><b>날삼재 · 날이</b>나가는 해. 끝맺음을 깔끔하게 하면 가볍게 지나가요.</li></ul><p class="why">${R.why}</p>`; }
  h+=`<button class="go" id="shr" type="button" style="margin-top:12px">결과 친구에게 보내기</button>`;
  box.innerHTML=h; box.hidden=false; $('shr').onclick=()=>share(R); $('pd').hidden=false; $('pv').classList.remove('on'); window.__VR=R;
  setTimeout(()=>box.scrollIntoView({behavior:'smooth',block:'start'}),80); }

function share(R){ const url=location.origin+location.pathname+'?ref=share';
  try{ if(window.ObShare&&ObShare.open){ ObShare.open({kicker:C.name+' · '+C.free,head:R.title,sub:R.say,big:R.gd,unit:'',tags:[C.name,C.free],img:C.still,menu:C.free,name:'obang-'+K+'.jpg',url}); return; } }catch(e){}
  if(navigator.share) navigator.share({title:C.free+' · '+C.name,text:R.title,url}).catch(()=>{}); else { try{ navigator.clipboard.writeText(url); toast('주소를 복사했어요'); }catch(e){} } }
/* ---------- 5. 더 보기 풀이(무료) ---------- */
function paidHTML(R){
  if(R.k==='heuk'){ const first=R.knots.slice().sort((x,y)=>['충','귀문','원진'].indexOf(x.t)-['충','귀문','원진'].indexOf(y.t))[0];
    const TALK={원진:'"너는 맨날 그래" 같은 단정하는 말. 서운함을 한 번에 몰아서 말하지 않기.',귀문:'밤늦게 길게 보내는 메시지. 예민한 날은 답을 다음 날 아침으로.',충:'둘 다 화난 상태에서 결론 내기. 자리를 한 번 바꾸고 다시 말하기.'};
    return `<div class="rs"><div class="hd"><small>흑매의 관계 풀이</small><h2>${first?first.t+'부터 조심하면 돼':'크게 조심할 건 없어'}</h2></div>
     <ul>${first?`<li><b>먼저 조심할 것</b>${first.w}. ${first.at}에 걸려 있어서 가까울수록 세게 당겨져요.</li>`:'<li><b>매듭</b>지금은 묶인 게 없어요. 이 사이를 지키는 건 서로의 속도예요.</li>'}
     <li><b>부딪히는 달</b>${mlist(R.risk)}${R.risk.length?' · 이 달엔 중요한 결정을 같이 내리지 않기':''}</li>
     <li><b>풀리는 달</b>${mlist(R.easy)}${R.easy.length?' · 미뤄 둔 얘기는 이 달에':''}</li>
     ${R.knots.map(k=>`<li><b>피할 말 · ${k.t}</b>${TALK[k.t]}</li>`).join('')}
     <li><b>흑매가 싫어하는 것</b>실은 당길수록 엉켜요. 한 번에 다 풀려 하지 말고 하나씩.</li></ul></div>`; }
  if(R.k==='geum'){ const nm=[]; const t=new Date(); for(let i=0;i<200&&nm.length<6;i++){ const d=new Date(t.getFullYear(),t.getMonth(),t.getDate()+i), n=new Date(d.getTime()+86400000); const L=S.solarToLunar(n.getFullYear(),n.getMonth()+1,n.getDate()); if(L&&L.d===1) nm.push(`${d.getMonth()+1}월 ${d.getDate()}일`); }
    return `<div class="rs"><div class="hd"><small>그믐의 빈칸 지키기</small><h2>빈칸이 열리는 달마다 이렇게</h2></div>
     <ul>${R.areas.map(o=>`<li><b>${o.a} 빈칸 지키기</b>${o.keep}</li>`).join('')}
     <li><b>빈칸이 열리는 달</b>${mlist(R.open)} · 이 달엔 '새로 채우기'보다 '새는 곳 막기'</li>
     <li><b>다가오는 그믐밤</b>${nm.join(' · ')}</li>
     <li><b>그믐밤에 할 일</b>그날 밤엔 큰 약속을 잡지 않고, 비어 있는 칸 하나를 적어 두기. 다음 초하루에 하나만 채워요.</li></ul></div>`; }
  const yb=y=>((y-4)%12+12)%12, tgt=R.cur||R.nxt; const months=Array.from({length:12},(_,i)=>i+1);
  const BI=[['새 계약 · 큰 물건 들이기는 한 번 더 확인','설 인사 · 안부 먼저 챙기기'],['이사 · 이직 같은 큰 이동은 미루기','건강 검진 날짜 잡기'],['차 · 운전, 밤길 조심','미뤄 둔 정리 하나 끝내기'],['돈 빌려주기 · 보증 피하기','가족 행사 챙기기'],['말다툼이 길어지지 않게','서류 · 도장은 두 번 보기'],['무리한 여행 일정 줄이기','한 해 마무리 인사 미리 하기']];
  const html_m=BI.map((x,i)=>`<li><b>${i*2+1} · ${i*2+2}월</b>${x[0]}, ${x[1]}</li>`).join('');
  return `<div class="rs"><div class="hd"><small>삼남매 넘기기</small><h2>${tgt?tgt.y+'년 '+tgt.kind+' 넘기기':'삼재 넘기기'}</h2></div>
   <ul><li><b>이 해의 원칙</b>${tgt?['들이는 걸 줄이고 확인을 늘려요.','바꾸기보다 지켜요. 버티는 해예요.','끝맺음을 깔끔히. 나가는 길을 막지 않아요.'][tgt.p]:'삼재가 아닐 때 미리 준비해 두면 가볍게 지나가요.'}</li>
   ${html_m}
   <li><b>해 두면 좋은 일</b>집 안 묵은 물건 정리, 아끼는 사람에게 먼저 연락, 하루 일찍 자기. 삼남매는 정돈된 집엔 오래 못 있어요.</li></ul></div>`; }
function pay(){ const R=window.__VR; if(!R) return; const open=()=>{ $('pv').innerHTML=paidHTML(R); $('pv').classList.add('on'); setTimeout(()=>$('pv').scrollIntoView({behavior:'smooth',block:'start'}),80); };
  open(); }

/* ---------- 6. 막아 주는 신 · 다른 악역 ---------- */
function myGuard(){ /* 10/3 21:15 시안: 내 수호신이 문 앞을 지킴(홈 시안에서 들어왔을 때만) */
  let o=null; try{ o=JSON.parse(localStorage.getItem('obGuard')||'null'); }catch(e){} if(!o||!o.k) return ''; /* 21:20 은주 확정: 항상 */
  const YI={wood:'새아',fire:'별하',earth:'도담',metal:'세린',water:'이슬'}, YA={wood:'하람',fire:'이안',earth:'도준',metal:'시온',water:'재이'};
  const n=o.f==='yin'?YI[o.k]:YA[o.k], img=o.f==='yin'?(o.k==='wood'?'https://d8j0ntlcm91z4.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/hf_20261002_064155_cabdc321-7f5b-47b3-9ba6-e41a246362c2_min.webp':`img/yin/${o.k}.jpg`):`img/${o.k}.jpg`;
  const jo=(w,a,b)=>{ const c=w.charCodeAt(w.length-1)-0xAC00; return (c>=0&&c<11172&&c%28>0)?a:b; };
  return `<a class="gd2 mine" href="chat.html?h=${o.k}${o.f==='yin'?'_y':''}"><i style="background-image:url('${img}')"></i><span><small>나의 수호신 · ${n}</small><b>${C.name}${jo(C.name,'이','가')} 와도, 네 문 앞은 내가 지킬게</b><span>${n}에게 바로 털어놓기</span></span></a>`; }
function rest(){ const g=C.guard; $('gd').innerHTML=myGuard()+`<a class="gd2" href="${g.href}"><i style="background-image:url('${g.img}')"></i><span><small>막아 주는 신 · ${g.who}</small><b>${g.t}</b><span>${g.d}</span></span></a>`;
  $('ot').innerHTML=Object.keys(V).filter(k=>k!==K).map(k=>`<a href="${V[k].page}"><i style="background-image:url('${V[k].still}')"></i><span><b>${V[k].name}</b><small>${V[k].free}</small><em>무료로 보기</em></span></a>`).join('');
  const NX={heuk:[['love.html','연애 상담소','서하가 상황별로 골라 주는 풀이'],['gunghap.html','도화 궁합','둘의 인연 타이밍'],['yeonseo.html','곧 받을 편지','다음 인연이 오는 달 · 무료']],
    geum:[['noeul.html','해와 달의 운세','노을이 보는 올해 흐름'],['today.html','오늘의 운세','매일 아침 바뀌는 무료 운세'],['free.html','무료 운세 모두 보기','오방 뽑기 · 부적 카드']],
    sam:[['sinnyeon.html','할매의 2027 신년운세','한 해 운을 미리'],['ppopgi.html','오방 뽑기','통을 흔들어 뽑는 오늘의 괘 · 무료'],['bujeok.html','부적 카드','오늘 내 부적 한 장 · 무료']]}[K];
  $('nx').innerHTML=NX.map(x=>`<a class="nx1" href="${x[0]}"><b>${x[1]}</b><span>${x[2]}</span></a>`).join('')+`<a class="nx1 hm" href="./"><b>오방도감 홈</b><span>다른 운세 · 캐릭터 상담</span></a>`; }

/* ---------- 시작 ---------- */
document.title=`${C.free} · ${C.name}`;
$('back').onclick=()=>{ if(history.length>1) history.back(); else location.href='./'; };
addEventListener('scroll',()=>$('top').classList.toggle('sc',scrollY>200),{passive:true});
$('top').querySelector('b').textContent=C.name;
document.body.classList.add('v-'+K); hero(); form(); rest();
$('pdT').textContent=C.paid+' · 무료'; $('pdS').textContent=C.paidSub; $('pdGo').onclick=pay;
})();
