/* 이직 쿨타임(10/3 21:40 기획 · 은주 승인): 도준이 '옮길 때 / 버티며 준비할 때 / 버틸 때'를 판정.
   근거: 앞으로 12달 월주(절기 기준)가 일간에게 무엇인지(관성=새 자리 · 재성=기회 · 식상=표현 · 인성=머무름 · 비겁=경쟁),
   역마(일지 · 년지 기준), 월지(일터 자리) · 일지와의 충(변동) · 합(머무름). 여기에 지금 상황 3문항을 4 : 6으로 섞는다. */
(function(){
const S=window.Saju, $=id=>document.getElementById(id);
const D2='https://d2ol7oe51mr4n9.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/';
const TALK=window.CT_TALK||''; /* 도준 대사 영상 '옮길 때인지, 버틸 때인지. 내가 봐 줄게.' */
const toast=t=>{ let e=$('toast'); if(!e){ e=document.createElement('div'); e.id='toast'; e.className='toast'; document.body.appendChild(e); } e.textContent=t; e.classList.add('on'); clearTimeout(e._t); e._t=setTimeout(()=>e.classList.remove('on'),1800); };
const loadMe=()=>{ try{ return JSON.parse(sessionStorage.getItem('me')||localStorage.getItem('obMe')||'null'); }catch(e){ return null; } };
const saveMe=o=>{ try{ const n=Object.assign(loadMe()||{},o); sessionStorage.setItem('me',JSON.stringify(n)); localStorage.setItem('obMe',JSON.stringify(n)); }catch(e){} };
$('back').onclick=()=>{ if(history.length>1) history.back(); else location.href='./'; };
addEventListener('scroll',()=>$('top').classList.toggle('sc',scrollY>200),{passive:true});

/* ---------- 1. 도준 등장: 들어오자마자 소리 없이 재생, 첫 터치에 소리 ---------- */
(function hero(){ const v=$('v2'), snd=$('snd'); if(!TALK){ snd.style.display='none'; return; } let on=false;
  v.src=TALK; v.muted=true; v.onplaying=()=>v.classList.add('on');
  const kick=()=>{ const p=v.play(); if(p&&p.catch) p.catch(e=>{ if(e&&e.name==='NotAllowedError'&&!v.muted){ v.muted=true; on=false; v.play().catch(()=>{}); } }); };
  const up=force=>{ if(on&&!force) return; let off=false; try{ off=sessionStorage.getItem('obSnd')==='0'; }catch(e){} if(off&&!force) return; on=true; snd.classList.add('on'); v.muted=false; if(force||v.ended||v.currentTime>1){ try{ v.currentTime=0; }catch(e){} } kick(); };
  let act=false; try{ act=!!(navigator.userActivation&&navigator.userActivation.hasBeenActive); }catch(e){} if(act){ v.muted=false; on=true; snd.classList.add('on'); }
  kick(); addEventListener('obsound',()=>up(false));
  document.addEventListener('pointerdown',function f(e){ if(e.target.closest('#snd')) return; document.removeEventListener('pointerdown',f,true); setTimeout(()=>up(false),260); },true);
  snd.onclick=()=>up(true); })();

/* ---------- 2. 입력 ---------- */
const QS=[['지금 회사에서',['1년 안 됐어','1 ~ 3년','3 ~ 5년','5년 넘었어'],[0,10,18,22]],
  ['요즘 출근길 기분',['그럭저럭','지루해','버거워','당장 나가고 싶어'],[0,8,16,24]],
  ['이직 준비는',['생각만 해','이력서 손보는 중','지원하고 있어','제안 받았어'],[0,8,14,20]]];
const yNow=new Date().getFullYear();
function form(){ const me=loadMe()||{}, ys=[]; for(let y=yNow-17;y>=1950;y--) ys.push(y);
  $('fm').innerHTML=`<label>내 생일</label><div class="seg" id="cS"><button data-v="s" class="${me.cal!=='l'?'on':''}" type="button">양력</button><button data-v="l" class="${me.cal==='l'?'on':''}" type="button">음력</button></div>
   <div class="g3"><select id="Y">${ys.map(y=>`<option ${+me.y===y||(!me.y&&y===1993)?'selected':''}>${y}</option>`).join('')}</select><select id="M">${Array.from({length:12},(_,i)=>`<option value="${i+1}" ${+me.m===i+1?'selected':''}>${i+1}월</option>`).join('')}</select><select id="D"></select></div>
   ${QS.map((q,i)=>`<label class="qt">${q[0]}</label><div class="q" data-q="${i}">${q[1].map((t,j)=>`<button type="button" data-j="${j}">${t}</button>`).join('')}</div>`).join('')}
   <button class="go" id="goF" type="button">쿨타임 보기</button>`;
  const fill=()=>{ const y=+$('Y').value, m=+$('M').value, n=new Date(y,m,0).getDate(), cur=+$('D').value||+me.d||14; $('D').innerHTML=Array.from({length:n},(_,i)=>`<option value="${i+1}" ${cur===i+1?'selected':''}>${i+1}일</option>`).join(''); };
  fill(); $('Y').onchange=$('M').onchange=fill;
  $('cS').querySelectorAll('button').forEach(b=>b.onclick=()=>$('cS').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)));
  $('fm').querySelectorAll('.q').forEach(g=>g.querySelectorAll('button').forEach(b=>b.onclick=()=>g.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))));
  $('goF').onclick=()=>{ const cal=$('cS').querySelector('.on').dataset.v, o={cal,y:+$('Y').value,m:+$('M').value,d:+$('D').value};
    let sol={y:o.y,m:o.m,d:o.d}; if(cal==='l'){ const s=S.lunarToSolar(o.y,o.m,o.d,false); if(!s){ toast('없는 음력 날짜예요'); return; } sol=s; }
    const ans=[...$('fm').querySelectorAll('.q')].map(g=>{ const b=g.querySelector('.on'); return b?+b.dataset.j:-1; });
    if(ans.includes(-1)){ toast('세 가지 다 골라 줘'); return; }
    saveMe(o); show(calc(sol,me.h==null||me.h===''?null:+me.h,ans)); }; }

/* ---------- 3. 계산 ---------- */
const YEOKMA=b=>[2,11,8,5][[[8,0,4],[5,9,1],[2,6,10],[11,3,7]].findIndex(g=>g.includes(b))]; /* 申子辰→寅 · 巳酉丑→亥 · 寅午戌→申 · 亥卯未→巳 */
const GRP=['비겁','식상','재성','관성','인성'];
const IND=[{el:'木',job:'교육 · 콘텐츠 · 기획 · 바이오',vibe:'막 커 가는 회사, 새 일을 벌이는 팀'},{el:'火',job:'마케팅 · 방송 · 플랫폼 · 뷰티',vibe:'빠르고 눈에 띄는 팀, 성과가 바로 보이는 곳'},{el:'土',job:'부동산 · 유통 · 컨설팅 · 공공',vibe:'오래 버틴 회사, 사람을 키우는 조직'},{el:'金',job:'금융 · 법무 · 제조 · 엔지니어링',vibe:'규칙과 평가가 분명한 곳, 숫자로 말하는 팀'},{el:'水',job:'무역 · 물류 · 데이터 · 연구',vibe:'자율과 재택이 되는 곳, 넓게 움직이는 일'}];
function calc(sol,h,ans){ const P=S.pillars(sol.y,sol.m,sol.d,h), dm=P.d[0], db=P.d[1], mb=P.m[1], ym=YEOKMA(db), ym2=YEOKMA(P.y[1]);
  const t=new Date(), months=[];
  for(let i=0;i<12;i++){ const d=new Date(t.getFullYear(),t.getMonth()+i,15), mp=S.monthPillarAt(d.getFullYear(),d.getMonth()+1,15), g=S.rel(dm,S.stEl(mp[0])), b=mp[1];
    const why=[]; let v=50;
    v+=[-8,6,10,14,-6][g]; why.push(GRP[g]+'의 달');
    if(b===ym||b===ym2){ v+=12; why.push('역마'); }
    if(S.isChung(b,mb)){ v+=10; why.push('일터 자리 충'); }
    if(S.isChung(b,db)){ v+=5; why.push('내 자리 충'); }
    if(S.isHap(b,db)){ v-=8; why.push('내 자리와 합'); }
    v=Math.max(20,Math.min(95,Math.round(v)));
    const risky=(S.isChung(b,db)&&g===0)||(g===0&&v<45);
    const tag=risky?'bad':v>=70?'go1':v>=56?'pr':'stay';
    months.push({y:d.getFullYear(),m:d.getMonth()+1,g,b,v,why,tag}); }
  const sajuV=Math.round([...months].sort((a,b)=>b.v-a.v).slice(0,4).reduce((s,o)=>s+o.v,0)/4);
  const sitV=Math.round(ans.reduce((s,j,i)=>s+QS[i][2][j],0)/66*100);
  const gauge=Math.max(5,Math.min(99,Math.round(sajuV*0.6+sitV*0.4)));
  const kind=gauge>=68?0:gauge>=48?1:2;
  const best=[...months].filter(o=>o.tag!=='bad').sort((a,b)=>b.v-a.v);
  best.slice(0,2).forEach(o=>{ if(o.v>=54) o.tag='go1'; });
  const apply=best.slice(0,2).sort((a,b)=>a.y-b.y||a.m-b.m), itv=months.filter(o=>o.g===3&&!S.isChung(o.b,db)).slice(0,2), money=[...months].filter(o=>o.g===2).sort((a,b)=>b.v-a.v)[0], bad=months.filter(o=>o.tag==='bad').slice(0,2);
  const cnt=S.elCount(P), st=S.strength(P); let need=[0,1,2,3,4].filter(e=>S.favorable(st,S.rel(dm,e))); need.sort((a,b)=>cnt[a]-cnt[b]); const ne=need[0];
  const TITLE=['지금 옮길 때야','버티면서 준비할 때야','지금은 버틸 때야'];
  const GD=['쿨타임 다 참','쿨타임 차는 중','쿨타임 남음'];
  const SAY=['기분 탓 아니야. 판이 움직이고 있어. 이번엔 네가 먼저 움직여.','나갈 문은 열리고 있어. 다만 지금 뛰면 손해야. 이력서부터 다듬자.','지금 나가면 같은 고민을 다른 회사에서 하게 돼. 여기서 하나만 더 쌓고 가.'][kind];
  const yy=t.getFullYear(), ap=apply.map(o=>(o.y!==yy?String(o.y).slice(2)+'년 ':'')+o.m+'월').join(' · ')||'-';
  return {P,months,gauge,kind,title:TITLE[kind],gd:GD[kind],say:SAY,apply,itv,money,bad,ne,sajuV,sitV,ap,ans,
    why:`근거 · ${S.GAN_K[dm]}${S.JI_K[db]}일생. 앞으로 12달 월주가 일간에게 무엇인지(관성 · 재성은 움직임, 인성 · 비겁은 머무름), 역마(${S.JI_K[ym]}), 일터 자리(월지 ${S.JI_K[mb]})와의 충 · 합을 봤어요. 사주 ${sajuV}점과 지금 상황 ${sitV}점을 6 : 4로 섞었어요.`}; }

/* ---------- 4. 결과 ---------- */
function gaugeSvg(v){ const a=Math.PI*(1-v/100), x=110+90*Math.cos(a), y=104-90*Math.sin(a);
  return `<svg viewBox="0 0 220 118" aria-hidden="true"><path d="M20 104 A90 90 0 0 1 200 104" fill="none" stroke="#e8e0d4" stroke-width="14"/><path d="M20 104 A90 90 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="#b8862f" stroke-width="14"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="#2a2119"/></svg>`; }
const LBL={go1:'움직이기 좋은 달',pr:'준비하기 좋은 달',stay:'버티는 달',bad:'움직이면 손해'};
function show(R){ const yy=new Date().getFullYear(), mm=o=>(o.y!==yy?String(o.y).slice(2)+'년 ':'')+o.m+'월';
  $('rs').innerHTML=`<div class="hd"><small>도준이 본 이직 쿨타임</small><span class="gd">${R.gd}</span><h2>${R.title}</h2></div>
   <div class="ga">${gaugeSvg(R.gauge)}<b>${R.gauge}<small>%</small></b></div>
   <p class="bb"><em>도준</em>${R.say}</p>
   <dl class="tl"><div><dt>지원하기 좋은 달</dt><dd>${R.ap}</dd></div><div><dt>면접 보기 좋은 달</dt><dd>${R.itv.length?R.itv.map(mm).join(' · '):'-'}</dd></div><div><dt>피할 달</dt><dd>${R.bad.length?R.bad.map(mm).join(' · '):'없음'}</dd></div></dl>
   <h4>앞으로 12달 이직 달력</h4>
   <div class="cal">${R.months.map(o=>`<div class="${o.tag}"><b>${mm(o)}</b><small>${LBL[o.tag]}</small></div>`).join('')}</div>
   <div class="lgd"><span><i style="background:#b8862f"></i>움직이기 좋은 달</span><span><i style="background:#d8c49a"></i>준비하기 좋은 달</span><span><i style="background:#b8352a"></i>움직이면 손해</span></div>
   <ul><li><b>다음 회사는 이런 곳 · ${IND[R.ne].el}</b>${IND[R.ne].job}. ${IND[R.ne].vibe}가 네 기운을 채워 줘요.</li>
   <li><b>사주가 말하는 쪽 · ${R.sajuV}점</b>${R.sajuV>=66?'앞으로 1년, 자리를 바꾸는 기운이 강하게 들어와요.':R.sajuV>=52?'움직일 기운과 머물 기운이 반반이에요. 고르는 달이 중요해요.':'올해는 자리를 지키는 기운이 더 커요. 안에서 키우는 게 남아요.'}</li>
   <li><b>지금 상황이 말하는 쪽 · ${R.sitV}점</b>${R.sitV>=60?'마음은 이미 반쯤 나가 있어요. 준비가 따라오면 돼요.':R.sitV>=30?'흔들리는 중이에요. 충동으로 나가지 않게 날짜를 정해 두세요.':'아직은 버틸 힘이 있어요. 이직은 계획으로만 두세요.'}</li></ul>
   <p class="why">${R.why}</p>
   <button class="go" id="shr" type="button" style="margin-top:12px">결과 친구에게 보내기</button>`;
  $('rs').hidden=false; $('pd').hidden=false; $('pv').classList.remove('on'); window.__CR=R; $('shr').onclick=()=>share(R);
  setTimeout(()=>$('rs').scrollIntoView({behavior:'smooth',block:'start'}),80); }
function share(R){ const url=location.origin+location.pathname+'?ref=share';
  try{ if(window.ObShare&&ObShare.open){ ObShare.open({kicker:'도준 · 이직 쿨타임',head:R.title,sub:R.say,big:String(R.gauge),unit:'%',tags:['이직 쿨타임',R.gd],img:'img/earth.jpg?v=2',menu:'이직 쿨타임',name:'obang-cooltime.jpg',url}); return; } }catch(e){}
  if(navigator.share) navigator.share({title:'이직 쿨타임 · 도준',text:R.title,url}).catch(()=>{}); else { try{ navigator.clipboard.writeText(url); toast('주소를 복사했어요'); }catch(e){} } }

/* ---------- 5. 도준의 이직 플랜(무료) ---------- */
const DO={go1:['지원서를 내고 면접을 잡아요','제안이 오면 이번엔 만나 봐요','가고 싶은 곳에 먼저 연락해요'],pr:['경력 한 줄을 숫자로 바꿔 써요','가고 싶은 회사 세 곳을 정해 둬요','포트폴리오에 최근 성과 하나를 넣어요','헤드헌터 · 지인에게 근황을 알려 둬요'],stay:['지금 자리에서 성과 하나를 만들어요','윗사람에게 내 일을 한 번 보여 줘요','배울 것 하나를 끝까지 해 둬요'],bad:['큰 결정은 미루고 컨디션을 지켜요','충동 사표는 금지, 일기에만 써요']};
function plan(R){ const yy=new Date().getFullYear(), mm=o=>(o.y!==yy?String(o.y).slice(2)+'년 ':'')+o.m+'월';
  const days=[]; if(R.itv.length){ R.itv.forEach(o=>{ for(let d=1;d<=28&&days.length<4;d++){ const dt=new Date(o.y,o.m-1,d), w=dt.getDay(); if(w===0||w===6) continue; const dp=S.dayPillar(o.y,o.m,d); if(S.isChung(dp[1],R.P.d[1])) continue; if(S.rel(R.P.d[0],S.stEl(dp[0]))===3||S.isHap(dp[1],R.P.d[1])){ days.push(`${o.m}월 ${d}일(${'일월화수목금토'[w]})`); d+=6; } } }); }
  return `<div class="rs"><div class="hd"><small>도준의 이직 플랜</small><h2>${['석 달 안에 옮기는 플랜','반년 준비하고 옮기는 플랜','버티면서 몸값 올리는 플랜'][R.kind]}</h2></div>
   <ul>${R.months.slice(0,6).map(o=>`<li><b>${mm(o)} · ${LBL[o.tag]}</b>${DO[o.tag][(o.m+o.y)%DO[o.tag].length]}.${o.why.includes('역마')?' 이동 운이 붙은 달이라 제안이 들어오기 쉬워요.':''}</li>`).join('')}
   <li><b>면접 보기 좋은 날</b>${days.length?days.join(' · '):'다음 달력에서 다시 볼게요'} · 오전 10시에서 오후 2시 사이가 무난해요</li>
   <li><b>연봉 얘기 꺼낼 타이밍</b>${R.money?mm(R.money)+'. 돈의 기운(재성)이 드는 달이라 숫자 얘기가 잘 먹혀요. 원하는 금액을 먼저 말하고, 근거는 성과 하나로.':'1년 안에 돈의 기운이 약해요. 연봉보다 직함 · 업무 범위로 협상해요.'}</li>
   <li><b>도준이 싫어하는 이직</b>지금 회사가 싫어서 나가는 이직. 다음 회사가 좋아서 가는 이직이어야 오래 가요.</li></ul></div>`; }
$('pdGo').onclick=()=>{ const R=window.__CR; if(!R) return; $('pv').innerHTML=plan(R); $('pv').classList.add('on'); setTimeout(()=>$('pv').scrollIntoView({behavior:'smooth',block:'start'}),80); };

/* ---------- 6. 이어서 ---------- */
$('gd').innerHTML=`<a class="gd2" href="career.html"><i style="background-image:url('img/earth.jpg?v=2')"></i><span><small>도준 · 커리어 사주</small><b>나한테 맞는 일 · 업계 · 능력치</b><span>스펙 말고 타고난 판부터 보는 일 사주 리포트</span></span></a>
 <a class="gd2" href="chat.html?h=earth" style="margin-top:8px"><i style="background-image:url('img/earth.jpg?v=2');background-position:center 30%"></i><span><small>도준과 1:1</small><b>이직 고민, 직접 털어놓기</b><span>상황을 말하면 사주에 맞춰 답해 줘요</span></span></a>`;
$('nx').innerHTML=[['workmini.html?t=pay','내 몸값 리포트','세린의 감정 · 990원'],['workmini.html?t=boss','상사 궁합','도준 · 2,900원'],['workmini.html?t=day','오늘의 일운','도준 · 무료 · 매일'],['taegil.html','면접 · 입사 날짜 잡기','택일 · 월하'],['today.html','오늘의 운세','매일 아침 바뀌는 하루'],['./','홈으로','오방도감 처음 화면']].map(x=>`<a class="nx1${x[0]==='./'?' hm':''}" href="${x[0]}"><b>${x[1]}</b><span>${x[2]}</span></a>`).join('');
form();
})();
