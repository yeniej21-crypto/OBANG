const N=PAGES.length;
const P2=n=>String(n).padStart(2,'0');
const bdy=(b,d=.45)=>`<div class="bd">${b.map((t,j)=>`<p class="rv" style="--d:${(d+j*.12).toFixed(2)}s">${t}</p>`).join('')}</div>`;
const head=p=>`<div class="ch rv" style="--d:.15s">${p.ch}</div>${p.hd?`<div class="hd rv" style="--d:.25s">${p.hd}</div>`:''}`;
const who=p=>`<div class="ch rv" style="--d:.15s">${p.ch}</div><div class="nm rv" style="--d:.25s"><b>${p.n}</b><span>${p.h}</span></div>${p.spec?`<div class="spec rv" style="--d:.32s">${p.spec}</div>`:''}`;
const qq=p=>p.q?`<div class="q rv" style="--d:.8s">${p.q}</div>`:'';
const fo=(p,i)=>`<div class="fo"><span>${p.n||p.hd||''}</span><b>${P2(i)}</b></div>`;
const tapBtn=(p,cls='')=>p.tap?`<button class="tapv ${cls}" type="button" data-tap="1"><i></i>목소리 듣기</button><video class="vv" playsinline preload="none" data-src="${p.tap}"></video>`:'';
const typeLines=(ls,d0=.35)=>`<h2 class="tyl">${ls.map((t,j)=>`<span style="--d:${(d0+j*.45).toFixed(2)}s">${t}</span>`).join('')}</h2>`;
const DOTS=`<div class="orn">${Object.values(EL).map(c=>`<i style="background:${c}"></i>`).join('')}</div>`;
function front(p,i){
  switch(p.t){
  case 'cover': return `<div class="cv-bg" style="background-image:url('img/intro0.jpg')"></div><div class="cv-vg"></div>
    <div class="cv-t"><small>OBANG SAJU ORIGINAL · VOL. 1</small><h1><span>팔자에</span><span>신이</span><span>들었다</span></h1></div>
    <div class="cv-f"><p>빈칸 하나에, 신 다섯이 줄을 섰다</p><em>신 열 명과 그림자 손님 셋, 그리고 당신의 빈칸 이야기</em>
    <div class="cv-five">${['wood','fire','earth','metal','water'].map(k=>`<i style="--c:${EL[k]};background-image:url('img/thumb/${k}.jpg${k==='earth'||k==='water'?'?v=2':''}')"></i>`).join('')}</div>
    <div><span>손가락으로 넘겨서 읽기</span><b>무료</b></div></div>`;
  case 'film': return `<div class="flm" style="background-image:url('${p.bg}')"><video class="lp" playsinline muted preload="auto" data-src="${p.v}"></video></div><div class="flg"></div><div class="flt">${head(p)}${bdy(p.body,.6)}</div>`;
  case 'reveal': return `<div class="flm" style="background-image:url('${p.poster}')"><video class="rvv" playsinline preload="auto" data-src="${p.v}" ${p.voice?'':'muted'}></video></div>
    <div class="rvname" style="--c2:${p.c2||'#fff'}"><small>${p.ch}</small><b>${p.n}</b></div>
    <div class="sheet" style="--c2:${p.c2||'#fff'}"><i class="grip"></i><div class="scr">${who(p)}${bdy(p.body,.35)}${qq(p)}</div></div>
    <button class="tapv skip" type="button" data-skip="1"><i></i>${p.voice?'글 먼저 보기':'글 보기'}</button>${p.tap?`<video class="vv" playsinline preload="none" data-src="${p.tap}"></video>`:''}`;
  case 'full': return `<div class="fl-im" style="background-image:url('${p.img}')"></div>${tapBtn(p)}<div class="fl-g"></div><div class="fl-t" style="--c2:${p.c2||p.c}"><div class="scr">${who(p)}${bdy(p.body)}${qq(p)}</div></div>${fo(p,i)}`;
  case 'frame': return `<div class="fr-box"><div class="im" style="background-image:url('${p.img}')"></div>${p.loop?`<video class="lp" playsinline muted loop preload="none" data-src="${p.loop}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s"></video>`:''}${tapBtn(p)}</div><div class="fr-t"><div class="scr">${who(p)}${bdy(p.body)}${qq(p)}</div></div>${fo(p,i)}`;
  case 'mag': return `<div class="mg-im" style="background-image:url('${p.img}')">${p.tap?`<video class="vv" playsinline preload="none" data-src="${p.tap}"></video>`:''}</div><div class="mg-nm">${p.n}</div><div class="mg-hj">${p.h}</div>${p.tap?`<button class="tapv" type="button" data-tap="1"><i></i>목소리 듣기</button>`:''}<div class="mg-t"><div class="scr"><div class="ch rv" style="--d:.15s">${p.ch}</div>${p.spec?`<div class="spec rv" style="--d:.25s">${p.spec}</div>`:''}${bdy(p.body,.4)}${qq(p)}</div></div>${fo(p,i)}`;
  case 'card': return `<div class="cdl"><div class="cd-w"><div class="cd"><div class="im" style="background-image:url('${p.img}')"></div>${p.tap?`<video class="vv" playsinline preload="none" data-src="${p.tap}"></video>`:''}<i class="gl"></i><div class="lb">${p.n}<small>${p.h}</small></div></div>${p.tap?`<button class="tapv" type="button" data-tap="1"><i></i>목소리 듣기</button>`:''}</div><div class="scr"><div class="ch rv" style="--d:.2s">${p.ch}</div>${p.spec?`<div class="spec rv" style="--d:.28s">${p.spec}</div>`:''}${bdy(p.body,.4)}${qq(p)}</div></div>${fo(p,i)}`;
  case 'prose': return `<div class="ps scr">${head(p)}<div class="bd">${p.por?`<i class="por${i%2?' l':''}" style="background-image:url('${p.por}')"></i>`:''}${p.body.map((t,j)=>`<p class="rv" style="--d:${(.35+j*.12).toFixed(2)}s">${t}</p>`).join('')}</div>${DOTS}</div>${fo(p,i)}`;
  case 'type': return `${p.bg?`<div class="tyb" style="background-image:url('${p.bg}')"></div>`:''}<div class="tyw"><div class="ch">${p.ch}</div>${typeLines(p.lines)}${p.dots?`<div class="tyd">${Object.values(EL).map((c,j)=>`<i style="background:${c};--d:${(1.3+j*.12).toFixed(2)}s"></i>`).join('')}</div>`:''}<p class="tys">${p.sub}</p></div>${fo(p,i)}`;
  case 'strips': return `<div class="stp">${p.cols.map(([k,n,s,img],j)=>`<div style="--c:${EL[k]};--d:${(.15+j*.14).toFixed(2)}s;background-image:url('${img}')"><i></i><span><b>${n}</b><small>${s}</small></span></div>`).join('')}</div><div class="st-t"><div class="scr">${head(p)}${bdy(p.body,.9)}</div></div>${fo(p,i)}`;
  case 'split': return `<div class="spw"><div class="a" style="background-image:url('${p.a[0]}')"></div><div class="b" style="background-image:url('${p.b[0]}')"></div><span class="la">${p.a[1]}<small>${p.a[2]}</small></span><span class="lb">${p.b[1]}<small>${p.b[2]}</small></span></div><div class="sp-t"><div class="scr">${head(p)}${bdy(p.body,.6)}</div></div>${fo(p,i)}`;
  case 'pairs': return `<div class="prw">${head(p)}<p class="lead rv" style="--d:.3s">${p.lead}</p><div class="prl">${p.rows.map(([k,a,as,b,bs,e,ia,ib],j)=>`<div class="pr" style="--c:${EL[k]};--d:${(.35+j*.16).toFixed(2)}s"><i style="background-image:url('${ia}')"></i><div><b>${a}</b><small>${as}</small></div><em>${e}</em><div class="r"><b>${b}</b><small>${bs}</small></div><i style="background-image:url('${ib}')"></i></div>`).join('')}</div></div>${fo(p,i)}`;
  case 'gal': return `<div class="gal">${p.cards.map(([n,r,img,v],j)=>`<button type="button" data-gal="${j}" style="background-image:url('${img}');--d:${(.3+j*.15).toFixed(2)}s"><video playsinline preload="none" data-src="${v}"></video><span><b>${n}</b><small>${r}</small></span></button>`).join('')}</div><div class="ga-t"><div class="scr">${head(p)}${bdy(p.body,.9)}</div></div>${fo(p,i)}`;
  case 'shade': return `<div class="shw"><div class="tt"><div class="ch">${p.ch}</div>${typeLines(p.lines,.25)}<p>${p.sub}</p></div>
    <div class="shp g" style="--d:.9s;--z:7px"><img src="${CUT.geum}" alt=""></div><div class="shp h" style="--d:.6s;--z:10px"><img src="${CUT.heuk}" alt=""></div><div class="shp s" style="--d:1.25s;--z:15px"><img src="${CUT.sam}" alt=""></div><div class="fog"></div></div>${fo({hd:'그림자 손님'},i)}`;
  case 'voice': return `<div class="flm" style="background-image:url('${p.still}')"><video class="en" playsinline muted loop preload="none" data-src="${p.enter}"></video><video class="vc" playsinline preload="auto" data-src="${p.v}"></video></div>
    <div class="vsub">${p.sub}</div><button class="tapv skip" type="button" data-voice="1"><i></i>다시 듣기</button><div class="flg"></div><div class="flt" style="--c2:${p.c2}"><div class="scr" style="max-height:100%">${head(p)}${bdy(p.body,.8)}</div></div>`;
  case 'grid8': { const G=[['甲','#3fbf7f'],['丙','#ff5a46'],['庚','#c9d1db'],['壬','#5b8cff'],['子','#5b8cff'],['午','#ff5a46'],['',''],['申','#c9d1db']];
    return `<div class="g8w"><div class="ch" style="color:#ff5a46">${p.ch}</div><div class="g8h">여덟 글자,<br><em>빈칸</em> 하나</div>
      <div class="g8t">${['시','일','월','년'].map(t=>`<small>${t}</small>`).join('')}${G.map(([c,col],j)=>c?`<i style="--gc:${col};--d:${.45+j*.1}s">${c}</i>`:`<i class="emp" style="--d:${.45+j*.1}s"></i>`).join('')}</div></div>
      <div class="g8b"><div class="scr">${bdy(p.body,1.2)}<div class="q rv" style="--d:1.6s;--c:#ff5a46">그 틈으로, 신이 들어온다</div></div></div>${fo({hd:'여덟 글자, 빈칸 하나'},i)}`; }
  case 'mini': return `<div class="mini">${['wood','fire','earth','metal','water'].map((k,j)=>`<i style="background-image:url('img/mini/${k}.jpg');--d:${.25+j*.12}s"></i>`).join('')}</div><div class="fr-t" style="top:calc(40% + 40px)"><div class="scr">${head(p)}${bdy(p.body)}</div></div>${fo(p,i)}`;
  case 'how': return `<div class="fr-box" style="height:30%"><div class="im" style="background-image:url('img/op_take_end.jpg');background-position:center 60%"></div></div><div class="fr-t" style="top:calc(30% + 36px)"><div class="scr">${head(p)}<ul class="how">
    <li><em>1</em><span><b>문을 두드린다</b>생일을 알려 주면 내 빈칸이 보인다</span></li>
    <li><em>2</em><span><b>내 신을 만난다</b>빈칸을 채워 줄 수호신, 두 얼굴 가운데 하나를 고른다</span></li>
    <li><em>3</em><span><b>매일 조금씩 채운다</b>개운 미션, 당번 도장, 오늘 밤 손님 귀띔</span></li>
    <li><em>4</em><span><b>그림자 손님도 미리 안다</b>흑매 · 그믐 · 삼재, 전부 무료</span></li></ul>
    <div class="cta"><button type="button" data-go="home">내 빈칸 찾으러 가기</button><button class="gh" type="button" data-go="restart">처음부터</button></div></div></div>`;
  case 'next': return `<div class="nxbg" style="background-image:url('img/kv_house.jpg')"></div><div class="nx"><small>제2권 · 곧 열림</small><h2>오행 하우스<br>다섯 신, 빈 의자 하나</h2><p>빈칸을 채우러 온 신들이 한집에 모여 산다. 여섯 번째 의자는 아직 비어 있다. 그 주인은 당신의 여덟 글자가 알고 있다</p><div class="cta" style="margin-top:22px"><button type="button" data-go="home" style="background:#fff;color:#111">오방도감으로 돌아가기</button></div></div>`;
  } return ''; }

const DARK=new Set(['cover','film','reveal','voice','type','strips','split','shade','grid8','next','full']);
$('book').innerHTML=PAGES.map((p,i)=>`<div class="leaf t-${p.t}${p.dark?' dark':''}${DARK.has(p.t)||p.dark?' dk':''}" data-i="${i}" data-density="soft"><div class="face" style="${p.c?`--c:${p.c}`:''}">${front(p,i)}</div></div>`).join('');
const leaves=[...document.querySelectorAll('#book .leaf')];
$('tocL').innerHTML=PAGES.map((p,i)=>`<button class="it" type="button" data-i="${i}">${p.toc||p.hd||p.n}<span>${P2(i)}</span></button>`).join('');

/* ---------- 소리: 종이 넘기는 '슉' + 배경음악 ---------- */
let AC=null; const ac=()=>{ try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==='suspended') AC.resume(); return AC; }catch(e){ return null; } };
function swoosh(){ const A=ac(); if(!A) return; const d=.62, n=A.createBuffer(1,A.sampleRate*d,A.sampleRate), a=n.getChannelData(0);
  for(let i=0;i<a.length;i++){ const t=i/a.length; a[i]=(Math.random()*2-1)*Math.pow(Math.sin(Math.PI*Math.min(1,t*1.15)),1.6)*(.55+.45*Math.sin(t*46)); }
  const s=A.createBufferSource(); s.buffer=n; const f=A.createBiquadFilter(); f.type='bandpass'; f.Q.value=.9; const t0=A.currentTime;
  f.frequency.setValueAtTime(700,t0); f.frequency.exponentialRampToValueAtTime(3600,t0+d*.55); f.frequency.exponentialRampToValueAtTime(1400,t0+d);
  const g=A.createGain(); g.gain.value=.22; s.connect(f); f.connect(g); g.connect(A.destination); s.start(); }
const BG_LV=.13, BG_DUCK=.02; let bgG=null, bgOn=true, bgLv=BG_LV;
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

/* ---------- 영상 ---------- */
const src=v=>{ if(v&&!v.getAttribute('src')){ v.src=v.dataset.src; } return v; };
function stopAll(l){ l.querySelectorAll('video').forEach(v=>{ try{ v.pause(); }catch(e){} v.classList.remove('on'); }); l.querySelectorAll('.vsub').forEach(x=>x.classList.remove('on')); const sh=l.querySelector('.sheet'); if(sh) sh.classList.remove('up'); }
function playV(v,{sound=false,loop=false,onend=null}={}){ if(!v) return; src(v); v.loop=loop; v.muted=!sound||sndOff(); try{ v.currentTime=0; }catch(e){}
  v.onplaying=()=>{ v.classList.add('on'); if(!v.muted) bgSet(BG_DUCK,.4); }; v.onended=()=>{ if(!v.muted) bgSet(BG_LV,1.2); onend&&onend(); };
  const p=v.play(); if(p&&p.catch) p.catch(err=>{ if(!v.muted){ v.muted=true; v.play().catch(()=>onend&&onend()); toast('목소리 버튼을 누르면 소리가 들려요'); } else onend&&onend(); }); }
function activate(i){ const l=leaves[i], P=PAGES[i]; if(!l) return;
  leaves.forEach((x,j)=>{ if(j!==i){ x.classList.remove('cur'); stopAll(x); } }); l.classList.add('cur'); bgSet(BG_LV);
  if(P.t==='film'){ const v=l.querySelector('video.lp'); setTimeout(()=>{ if(cur===i) playV(v); },300); }
  if(P.t==='frame'&&P.loop){ const v=l.querySelector('video.lp'); setTimeout(()=>{ if(cur===i) playV(v,{loop:true}); },500); }
  if(P.t==='reveal'){ const v=l.querySelector('video.rvv'), sh=l.querySelector('.sheet'); const up=()=>{ if(cur===i) sh.classList.add('up'); };
    playV(v,{sound:!!P.voice,onend:up}); clearTimeout(l._t); l._t=setTimeout(up,P.voice?14000:9000); }
  if(P.t==='voice'){ const v=l.querySelector('video.vc'), en=l.querySelector('video.en'), sb=l.querySelector('.vsub');
    playV(v,{sound:true,onend:()=>{ v.classList.remove('on'); if(cur===i) playV(en,{loop:true}); }}); setTimeout(()=>{ if(cur===i) sb.classList.add('on'); },900); }
  $('prev').disabled=i===0; $('next').disabled=i===N-1; $('pgN').textContent=`${i+1} / ${N}`; $('prog').style.width=(i/(N-1)*100)+'%';
  $('runT').textContent=i===0?'팔자에 신이 들었다':(P.toc||P.hd||P.n);
  $('tocL').querySelectorAll('button').forEach((b,j)=>b.classList.toggle('on',j===i)); try{ sessionStorage.setItem('obBookPg6',i); }catch(e){}
  moreCheck(l);
  /* 다음 쪽 영상 미리 받기 */
  const nx=leaves[i+1]; if(nx) nx.querySelectorAll('video.rvv,video.vc,video.lp').forEach(v=>{ src(v); v.preload='auto'; });
}
/* 글이 더 있으면 '아래로' 표시 */
function moreCheck(l){ l.querySelectorAll('.more').forEach(m=>m.remove()); const s=l.querySelector('.scr'); if(!s) return; setTimeout(()=>{ if(s.scrollHeight>s.clientHeight+8){ const m=document.createElement('div'); m.className='more on'; m.textContent='아래로 더 읽기'; l.querySelector('.face').appendChild(m); s.addEventListener('scroll',()=>{ if(s.scrollTop>20) m.classList.remove('on'); },{passive:true,once:true}); } },1400); }

/* ---------- 책: 손가락으로 쓸어 넘기면 종이 모서리가 말리며 넘어간다 ---------- */
let cur=0, pf=null;
function initBook(){ const d=$('desk').getBoundingClientRect(); let start=0; try{ start=+(sessionStorage.getItem('obBookPg6')||0); }catch(e){} if(!(start>=0&&start<N)) start=0;
  try{ const m=location.hash.match(/p=(\d+)/); if(m) start=Math.min(N-1,+m[1]); }catch(e){}
  pf=new St.PageFlip($('book'),{width:Math.round(d.width),height:Math.round(d.height),size:'stretch',minWidth:260,maxWidth:560,minHeight:420,maxHeight:1200,
    usePortrait:true,showCover:false,autoSize:true,drawShadow:true,maxShadowOpacity:.55,flippingTime:850,mobileScrollSupport:true,swipeDistance:24,clickEventForward:true,disableFlipByClick:true,startPage:start,startZIndex:2});
  pf.on('flip',e=>{ cur=e.data; activate(cur); });
  pf.on('changeState',e=>{ if(e.data==='flipping') swoosh(); if(e.data==='user_fold'||e.data==='flipping') $('hint').classList.remove('on'); });
  pf.on('init',e=>{ cur=e.data.page||start; activate(cur); });
  pf.loadFromHTML(leaves);
  if(start===0) setTimeout(()=>$('hint').classList.add('on'),1200);
}
$('next').onclick=()=>pf&&pf.flipNext('bottom'); $('prev').onclick=()=>pf&&pf.flipPrev('bottom');
document.addEventListener('keydown',e=>{ if(!pf) return; if(e.key==='ArrowRight') pf.flipNext(); if(e.key==='ArrowLeft') pf.flipPrev(); });
$('tocB').onclick=()=>$('toc').classList.add('on');
$('toc').onclick=e=>{ const b=e.target.closest('[data-i]'); if(b&&pf){ const n=+b.dataset.i; if(Math.abs(n-cur)<=1) pf.flip(n); else { pf.turnToPage(n); cur=n; activate(n); } } if(b||e.target.closest('.x')) $('toc').classList.remove('on'); };
$('back').onclick=()=>{ try{ sessionStorage.setItem('toHome','1'); }catch(e){} if(history.length>1) history.back(); else location.href='./'; };

/* 쪽 안의 버튼(목소리 듣기 · 글 보기 · 다시 듣기 · 명인 카드 · 홈) */
$('book').addEventListener('click',e=>{ const l=e.target.closest('.leaf'); if(!l) return; const i=+l.dataset.i, P=PAGES[i];
  const t=e.target.closest('[data-tap]'); if(t){ try{ sessionStorage.removeItem('obSnd'); }catch(_){} const v=l.querySelector('video.vv'); t.style.opacity='0'; playV(v,{sound:true,onend:()=>{ v.classList.remove('on'); t.style.opacity=''; }}); return; }
  const sk=e.target.closest('[data-skip]'); if(sk){ const sh=l.querySelector('.sheet'); if(sh) sh.classList.add('up'); return; }
  const vc=e.target.closest('[data-voice]'); if(vc){ try{ sessionStorage.removeItem('obSnd'); }catch(_){} const v=l.querySelector('video.vc'), en=l.querySelector('video.en'); if(en){ en.pause(); en.classList.remove('on'); } playV(v,{sound:true,onend:()=>{ v.classList.remove('on'); playV(en,{loop:true}); }}); return; }
  const g=e.target.closest('[data-gal]'); if(g){ l.querySelectorAll('.gal video').forEach(x=>{ x.pause(); x.classList.remove('on'); }); try{ sessionStorage.removeItem('obSnd'); }catch(_){} const v=g.querySelector('video'); playV(v,{sound:true,onend:()=>v.classList.remove('on')}); return; }
  const b=e.target.closest('[data-go]'); if(b){ if(b.dataset.go==='restart'){ pf.turnToPage(0); cur=0; activate(0); return; } try{ sessionStorage.setItem('toHome','1'); }catch(_){} location.href='./'; } });

/* 입체감: 마우스 · 폰 기울기 → 지금 펼친 쪽에만(카드 · 액자). 입력이 없으면 계산하지 않는다 */
(()=>{ let gx=0,gy=0,x=0,y=0,run=false;
  const loop=()=>{ x+=(gx-x)*.12; y+=(gy-y)*.12; const f=leaves[cur]&&leaves[cur].querySelector('.face'); if(f){ f.style.setProperty('--tx',x.toFixed(3)); f.style.setProperty('--ty',y.toFixed(3)); }
    if(Math.abs(gx-x)>.004||Math.abs(gy-y)>.004) requestAnimationFrame(loop); else run=false; };
  const set=(a,b)=>{ gx=Math.max(-1,Math.min(1,a)); gy=Math.max(-1,Math.min(1,b)); if(!run){ run=true; requestAnimationFrame(loop); } };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  addEventListener('pointermove',e=>{ if(e.pointerType!=='mouse') return; const r=$('stage').getBoundingClientRect(); set(((e.clientX-r.left)/r.width-.5)*2,((e.clientY-r.top)/r.height-.5)*2); },{passive:true});
  let lo=0; addEventListener('deviceorientation',e=>{ if(e.gamma==null) return; const t=performance.now(); if(t-lo<60) return; lo=t; set(e.gamma/22,(e.beta-40)/24); },{passive:true});
})();

requestAnimationFrame(()=>requestAnimationFrame(initBook));
