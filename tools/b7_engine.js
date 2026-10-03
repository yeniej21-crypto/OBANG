const N=PAGES.length;
const P2=n=>String(n).padStart(2,'0');
const bdy=(b,d=.45)=>`<div class="bd">${b.map((t,j)=>`<p class="rv" style="--d:${(d+j*.12).toFixed(2)}s">${t}</p>`).join('')}</div>`;
const head=p=>`<div class="ch rv" style="--d:.15s">${p.ch}</div>${p.hd?`<div class="hd rv" style="--d:.25s">${p.hd}</div>`:''}`;
const who=p=>p.n?`<div class="ch rv" style="--d:.15s">${p.ch}</div><div class="nm rv" style="--d:.25s"><b>${p.n}</b><span>${p.h}</span></div>`:head(p);
const fo=(p,i)=>`<div class="fo"><span>${p.n||p.hd||''}</span><b>${P2(i)}</b></div>`;
const typeLines=(ls,d0=.35)=>`<h2 class="tyl">${ls.map((t,j)=>`<span style="--d:${(d0+j*.45).toFixed(2)}s">${t}</span>`).join('')}</h2>`;
const DOTS=`<div class="orn rv" style="--d:1s">${Object.values(EL).map(c=>`<i style="background:${c}"></i>`).join('')}</div>`;
const again=`<button class="again" type="button" data-again="1"><i></i>다시 듣기</button>`;
function front(p,i){
  switch(p.t){
  case 'cover': return `<div class="cv-bg" style="background-image:url('img/intro0.jpg')"></div><div class="cv-vg"></div>
    <div class="cv-t"><small>OBANG SAJU ORIGINAL · VOL. 1</small><h1><span>팔자에</span><span>신이</span><span>들었다</span></h1></div>
    <div class="cv-f"><p>빈칸 하나에, 신 다섯이 줄을 섰다</p><em>신 열 명과 그림자 손님 셋, 그리고 당신의 빈칸 이야기</em>
    <div class="cv-five">${['wood','fire','earth','metal','water'].map(k=>`<i style="--c:${EL[k]};background-image:url('img/thumb/${k}.jpg${k==='earth'||k==='water'?'?v=2':''}')"></i>`).join('')}</div>
    <div class="r"><span>옆으로 밀어서 넘기기</span><b>무료</b></div></div>`;
  case 'film': return `<div class="flm" style="background-image:url('${p.bg}')"><video class="mv" playsinline muted preload="auto" data-src="${p.v}"></video></div><div class="flg"></div><div class="flt fit">${head(p)}${bdy(p.body,.6)}</div>`;
  case 'vfull': return `<div class="flm" style="background-image:url('${p.poster}')">${p.loop?`<video class="lv" playsinline muted loop preload="none" data-src="${p.loop}"></video>`:''}<video class="mv" playsinline preload="auto" data-src="${p.v}"></video></div>
    ${p.sub?`<div class="sub">${p.sub}</div>`:''}${again}<div class="flg"></div><div class="flt fit">${who(p)}${bdy(p.body,.6)}</div>`;
  case 'vstage': return `<div class="vs fit"><div class="vs-fr" style="background-image:url('${p.poster}')">${p.loop?`<video class="lv" playsinline muted loop preload="none" data-src="${p.loop}"></video>`:''}<video class="mv" playsinline preload="auto" data-src="${p.v}"></video>${p.sub?`<div class="sub">${p.sub}</div>`:''}${again}</div>
    <div class="vs-nm"><div class="ch rv" style="--d:.5s">${p.ch}</div><div class="nm rv" style="--d:.6s"><b>${p.n}</b><span>${p.h}</span></div></div><div class="vs-tx">${bdy(p.body,.8)}</div></div>${fo(p,i)}`;
  case 'prose': return `<div class="ps fit">${head(p)}${bdy(p.body,.35)}${DOTS}</div>${fo(p,i)}`;
  case 'type': return `${p.bg?`<div class="tyb" style="background-image:url('${p.bg}')"></div>`:''}<div class="tyw"><div class="ch">${p.ch}</div>${typeLines(p.lines)}${p.dots?`<div class="tyd">${Object.values(EL).map((c,j)=>`<i style="background:${c};--d:${(1.3+j*.12).toFixed(2)}s"></i>`).join('')}</div>`:''}<p class="tys">${p.sub}</p></div>${fo({hd:p.toc.split(' · ').pop()},i)}`;
  case 'strips': return `<div class="stp">${p.cols.map(([k,n,s,img],j)=>`<div style="--c:${EL[k]};--d:${(.15+j*.14).toFixed(2)}s;background-image:url('${img}')"><i></i><span><b>${n}</b><small>${s}</small></span></div>`).join('')}</div><div class="lw fit">${head(p)}${bdy(p.body,.9)}</div>${fo(p,i)}`;
  case 'split': return `<div class="spw" style="--c2:${p.c2||'#e8b04a'}"><div class="a" style="background-image:url('${p.a[0]}')"></div><div class="b" style="background-image:url('${p.b[0]}')"></div><span class="la">${p.a[1]}<small>${p.a[2]}</small></span><span class="lb">${p.b[1]}<small>${p.b[2]}</small></span></div><div class="lw fit">${head(p)}${bdy(p.body,.6)}</div>${fo(p,i)}`;
  case 'pairs': return `<div class="prw">${head(p)}<p class="lead rv" style="--d:.3s">${p.lead}</p><div class="prl">${p.rows.map(([k,a,as,b,bs,e,ia,ib],j)=>`<div class="pr" style="--c:${EL[k]};--d:${(.35+j*.16).toFixed(2)}s"><i style="background-image:url('${ia}')"></i><div><b>${a}</b><small>${as}</small></div><em>${e}</em><div class="r"><b>${b}</b><small>${bs}</small></div><i style="background-image:url('${ib}')"></i></div>`).join('')}</div></div>${fo(p,i)}`;
  case 'gal': return `<div class="gal">${p.cards.map(([n,r,img,v],j)=>`<button type="button" data-gal="${j}" style="background-image:url('${img}');--d:${(.3+j*.15).toFixed(2)}s"><video playsinline preload="none" data-src="${v}"></video><em></em><span><b>${n}</b><small>${r}</small></span></button>`).join('')}</div><div class="lw fit">${head(p)}${bdy(p.body,.9)}</div>${fo(p,i)}`;
  case 'shade': return `<div class="shw"><div class="tt"><div class="ch">${p.ch}</div>${typeLines(p.lines,.25)}<p>${p.sub}</p></div>
    <div class="shp g" style="--d:.9s"><img src="${CUT.geum}" alt=""></div><div class="shp h" style="--d:.6s"><img src="${CUT.heuk}" alt=""></div><div class="shp s" style="--d:1.25s"><img src="${CUT.sam}" alt=""></div><div class="fog"></div></div>${fo({hd:'그림자 손님'},i)}`;
  case 'grid8': { const G=[['甲','#3fbf7f'],['丙','#ff5a46'],['庚','#c9d1db'],['壬','#5b8cff'],['子','#5b8cff'],['午','#ff5a46'],['',''],['申','#c9d1db']];
    return `<div class="g8w"><div class="ch" style="color:#ff5a46">${p.ch}</div><div class="g8h">여덟 글자,<br><em>빈칸</em> 하나</div>
      <div class="g8t">${['시','일','월','년'].map(t=>`<small>${t}</small>`).join('')}${G.map(([c,col],j)=>c?`<i style="--gc:${col};--d:${.45+j*.1}s">${c}</i>`:`<i class="emp" style="--d:${.45+j*.1}s"></i>`).join('')}</div>
      <div class="g8b fit">${bdy(p.body,1.2)}<div class="q rv" style="--d:1.6s;--c:#ff5a46">그 틈으로, 신이 들어온다</div></div></div>${fo({hd:'여덟 글자, 빈칸 하나'},i)}`; }
  case 'mini': return `<div class="mini">${['wood','fire','earth','metal','water'].map((k,j)=>`<i style="background-image:url('img/mini/${k}.jpg');--d:${.25+j*.12}s"></i>`).join('')}</div><div class="lw fit">${head(p)}${bdy(p.body)}</div>${fo(p,i)}`;
  case 'how': return `<div class="hw">${head(p)}<ul class="how">
    <li><em>1</em><span><b>문을 두드린다</b>생일을 알려 주면 내 빈칸이 보인다</span></li>
    <li><em>2</em><span><b>내 신을 만난다</b>빈칸을 채워 줄 수호신, 두 얼굴 가운데 하나를 고른다</span></li>
    <li><em>3</em><span><b>매일 조금씩 채운다</b>개운 미션, 당번 도장, 오늘 밤 손님 귀띔</span></li>
    <li><em>4</em><span><b>그림자 손님도 미리 안다</b>흑매 · 그믐 · 삼재, 전부 무료</span></li></ul>
    <div class="cta"><button type="button" data-go="home">내 빈칸 찾으러 가기</button><button class="gh" type="button" data-go="restart">처음부터</button></div></div>`;
  case 'next': return `<div class="nxbg" style="background-image:url('img/kv_house.jpg')"></div><div class="nx"><small>제2권 · 곧 열림</small><h2>오행 하우스<br>다섯 신, 빈 의자 하나</h2><p>빈칸을 채우러 온 신들이 한집에 모여 산다. 여섯 번째 의자는 아직 비어 있다. 그 주인은 당신의 여덟 글자가 알고 있다</p><div class="cta" style="margin-top:22px"><button type="button" data-go="home" style="background:#fff;color:#111">오방도감으로 돌아가기</button></div></div>`;
  } return ''; }

$('book').innerHTML=PAGES.map((p,i)=>`<div class="leaf t-${p.t}${p.lite?' lite':''}" data-i="${i}" data-density="soft"><div class="face" style="${p.c?`--c:${p.c};`:''}${p.c2?`--c2:${p.c2}`:''}">${front(p,i)}</div></div>`).join('');
const leaves=[...document.querySelectorAll('#book .leaf')];
$('tocL').innerHTML=PAGES.map((p,i)=>`<button class="it" type="button" data-i="${i}">${p.toc||p.hd||p.n}<span>${P2(i)}</span></button>`).join('');

/* 글이 한 화면을 넘치면 글자를 한두 단계 줄인다(스크롤 없음) */
function fit(){ leaves.forEach(l=>{ const f=l.querySelector('.face'); f.classList.remove('tight','tight2'); const box=f.querySelector('.fit'); if(!box) return;
  const tgt=box.classList.contains('vs')?box.querySelector('.vs-tx'):box; const over=()=>tgt.scrollHeight>tgt.clientHeight+2;
  if(over()){ f.classList.add('tight'); if(over()) f.classList.add('tight2'); } }); }

/* ---------- 소리 ---------- */
let AC=null; const ac=()=>{ try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==='suspended') AC.resume(); return AC; }catch(e){ return null; } };
function swoosh(){ const A=ac(); if(!A) return; const d=.6, n=A.createBuffer(1,A.sampleRate*d,A.sampleRate), a=n.getChannelData(0);
  for(let i=0;i<a.length;i++){ const t=i/a.length; a[i]=(Math.random()*2-1)*Math.pow(Math.sin(Math.PI*Math.min(1,t*1.15)),1.6)*(.55+.45*Math.sin(t*46)); }
  const s=A.createBufferSource(); s.buffer=n; const f=A.createBiquadFilter(); f.type='bandpass'; f.Q.value=.9; const t0=A.currentTime;
  f.frequency.setValueAtTime(700,t0); f.frequency.exponentialRampToValueAtTime(3600,t0+d*.55); f.frequency.exponentialRampToValueAtTime(1400,t0+d);
  const g=A.createGain(); g.gain.value=.22; s.connect(f); f.connect(g); g.connect(A.destination); s.start(); }
const BG_LV=.12, BG_DUCK=.02; let bgG=null, bgOn=true, bgLv=BG_LV;
try{ bgOn=localStorage.getItem('obBookBgm')!=='0'; }catch(e){}
function bgSet(lv,sec=.8){ bgLv=lv; if(!bgG) return; const g=bgG.gain,t=AC.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(g.value,t); g.linearRampToValueAtTime(bgOn?lv:0,t+sec); }
function bgStart(){ const A=ac(); if(!A||bgG) return; bgG=A.createGain(); bgG.gain.value=0; bgG.connect(A.destination);
  fetch('a/book_bgm.mp3').then(r=>r.arrayBuffer()).then(b=>A.decodeAudioData(b)).then(buf=>{ const s=A.createBufferSource(); s.buffer=buf; s.loop=true; s.connect(bgG); s.start(); bgSet(bgLv,2); }).catch(()=>{}); }
document.addEventListener('pointerdown',bgStart,{once:true,capture:true});
function muUi(){ $('muB').classList.toggle('off',!bgOn); }
$('muB').onclick=e=>{ e.stopPropagation(); bgStart(); bgOn=!bgOn; try{ localStorage.setItem('obBookBgm',bgOn?'1':'0'); }catch(_){} muUi(); bgSet(bgLv,.4); toast(bgOn?'배경음악 켜짐':'배경음악 꺼짐'); };
muUi();
function toast(t){ const e=$('toast'); e.textContent=t; e.classList.add('on'); clearTimeout(e._t); e._t=setTimeout(()=>e.classList.remove('on'),1800); }
const sndOff=()=>{ try{ return sessionStorage.getItem('obSnd')==='0'; }catch(e){ return false; } };

/* ---------- 영상: 쪽이 펼쳐지면 바로 말한다. 끝나면 반복 영상(있으면) ---------- */
const src=v=>{ if(v&&!v.getAttribute('src')) v.src=v.dataset.src; return v; };
function stopAll(l){ l.querySelectorAll('video').forEach(v=>{ try{ v.pause(); }catch(e){} v.classList.remove('on'); }); l.querySelectorAll('.sub').forEach(x=>x.classList.remove('on')); }
function playV(v,{sound=false,loop=false,onend=null}={}){ if(!v) return; src(v); v.loop=loop; v.muted=!sound||sndOff(); try{ v.currentTime=0; }catch(e){}
  v.onplaying=()=>{ v.classList.add('on'); if(!v.muted) bgSet(BG_DUCK,.4); }; v.onended=()=>{ if(!v.muted) bgSet(BG_LV,1.2); onend&&onend(); };
  const p=v.play(); if(p&&p.catch) p.catch(()=>{ if(!v.muted){ v.muted=true; v.play().catch(()=>onend&&onend()); toast('다시 듣기를 누르면 목소리가 들려요'); } else onend&&onend(); }); }
function talk(l,i,force){ const v=l.querySelector('video.mv'), lv=l.querySelector('video.lv'), sb=l.querySelector('.sub'); if(!v) return;
  if(force){ try{ sessionStorage.removeItem('obSnd'); }catch(_){} }
  if(lv){ try{ lv.pause(); }catch(_){} lv.classList.remove('on'); }
  playV(v,{sound:true,onend:()=>{ if(cur!==i) return; if(lv){ v.classList.remove('on'); playV(lv,{loop:true}); } }});
  if(sb){ sb.classList.remove('on'); setTimeout(()=>{ if(cur===i) sb.classList.add('on'); },700); } }
let cur=0, pf=null;
function activate(i){ const l=leaves[i], P=PAGES[i]; if(!l) return; cur=i;
  leaves.forEach((x,j)=>{ if(j!==i){ x.classList.remove('cur'); stopAll(x); } }); l.classList.add('cur'); bgSet(BG_LV);
  if(P.t==='film') setTimeout(()=>{ if(cur===i) playV(l.querySelector('video.mv')); },300);
  if(P.t==='vfull'||P.t==='vstage') talk(l,i);
  if(i>0) $('hint').classList.remove('on');
  $('prev').disabled=i===0; $('next').disabled=i===N-1; $('pgN').textContent=`${i+1} / ${N}`; $('prog').style.width=(i/(N-1)*100)+'%';
  $('runT').textContent=i===0?'팔자에 신이 들었다':(P.toc||P.hd||P.n);
  $('tocL').querySelectorAll('button').forEach((b,j)=>b.classList.toggle('on',j===i)); try{ sessionStorage.setItem('obBookPg7',i); }catch(e){}
  [i+1,i+2].forEach(j=>{ const nx=leaves[j]; if(nx) nx.querySelectorAll('video.mv').forEach(v=>{ src(v); v.preload='auto'; }); }); }

/* 아이폰은 손가락 동작 안에서 한 번 재생한 영상만 나중에 소리 내어 틀 수 있다 → 손짓마다 앞뒤 쪽 목소리 영상을 미리 깨운다 */
function prime(){ [cur-1,cur+1,cur+2].forEach(j=>{ const l=leaves[j]; if(!l) return; l.querySelectorAll('video.mv').forEach(v=>{ if(v._pr||PAGES[j].t==='film') return; v._pr=1; src(v); try{ v.muted=false; const p=v.play(); v.pause(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} }); }); }

/* ---------- 넘기기: 화면 어디서든 좌우로 쓸기, 양 끝 톡, 아래 버튼. 종이가 말리며 넘어가는 그림은 page-flip ---------- */
const next=()=>{ if(pf&&cur<N-1&&pf.getState()==='read') pf.flipNext('bottom'); };
const prev=()=>{ if(pf&&cur>0&&pf.getState()==='read') pf.flipPrev('bottom'); };
function initBook(){ const d=$('desk').getBoundingClientRect(); let start=0; try{ start=+(sessionStorage.getItem('obBookPg7')||0); }catch(e){} if(!(start>=0&&start<N)) start=0;
  try{ const m=location.hash.match(/p=(\d+)/); if(m) start=Math.min(N-1,+m[1]); }catch(e){}
  pf=new St.PageFlip($('book'),{width:Math.round(d.width),height:Math.round(d.height),size:'stretch',minWidth:260,maxWidth:560,minHeight:420,maxHeight:1200,
    usePortrait:true,showCover:false,autoSize:true,drawShadow:true,maxShadowOpacity:.6,flippingTime:800,useMouseEvents:false,startPage:start,startZIndex:2});
  pf.on('flip',e=>activate(e.data));
  pf.on('changeState',e=>{ if(e.data==='flipping'){ swoosh(); $('hint').classList.remove('on'); } });
  pf.on('init',e=>{ fit(); activate(e.data.page||start); });
  pf.loadFromHTML(leaves);
  if(start===0){ setTimeout(()=>{ if(cur===0) $('hint').classList.add('on'); },1200); setTimeout(()=>$('hint').classList.remove('on'),8000); }
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
}
(()=>{ const desk=$('desk'); let s=null;
  desk.addEventListener('pointerdown',e=>{ s={x:e.clientX,y:e.clientY,t:performance.now(),btn:!!e.target.closest('button')}; },{passive:true});
  desk.addEventListener('pointercancel',()=>{ s=null; });
  desk.addEventListener('pointerup',e=>{ if(!s) return; const dx=e.clientX-s.x, dy=e.clientY-s.y, dt=performance.now()-s.t, wasBtn=s.btn; s=null;
    if(Math.abs(dx)>34&&Math.abs(dx)>Math.abs(dy)*1.1&&dt<900){ prime(); dx<0?next():prev(); return; }
    if(wasBtn||Math.abs(dx)>10||Math.abs(dy)>10) return;
    const r=desk.getBoundingClientRect(), fx=(e.clientX-r.left)/r.width; if(fx>.78){ prime(); next(); } else if(fx<.22){ prime(); prev(); } });
})();
$('next').onclick=()=>{ prime(); next(); }; $('prev').onclick=()=>{ prime(); prev(); };
document.addEventListener('keydown',e=>{ if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') prev(); });
$('tocB').onclick=()=>$('toc').classList.add('on');
$('toc').onclick=e=>{ const b=e.target.closest('[data-i]'); if(b&&pf){ const n=+b.dataset.i; pf.turnToPage(n); activate(n); } if(b||e.target.closest('.x')) $('toc').classList.remove('on'); };
$('back').onclick=()=>{ try{ sessionStorage.setItem('toHome','1'); }catch(e){} if(history.length>1) history.back(); else location.href='./'; };
$('book').addEventListener('click',e=>{ const l=e.target.closest('.leaf'); if(!l) return; const i=+l.dataset.i;
  if(e.target.closest('[data-again]')){ talk(l,i,true); return; }
  const g=e.target.closest('[data-gal]'); if(g){ l.querySelectorAll('.gal video').forEach(x=>{ x.pause(); x.classList.remove('on'); }); try{ sessionStorage.removeItem('obSnd'); }catch(_){} const v=g.querySelector('video'); playV(v,{sound:true,onend:()=>v.classList.remove('on')}); return; }
  const b=e.target.closest('[data-go]'); if(b){ if(b.dataset.go==='restart'){ pf.turnToPage(0); activate(0); return; } try{ sessionStorage.setItem('toHome','1'); }catch(_){} location.href='./'; } });
addEventListener('resize',()=>{ clearTimeout(fit._t); fit._t=setTimeout(fit,200); });
requestAnimationFrame(()=>requestAnimationFrame(initBook));
