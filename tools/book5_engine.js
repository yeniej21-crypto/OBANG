const N=PAGES.length;
const bdy=b=>`<div class="bd">${b.map(t=>`<p>${t}</p>`).join('')}</div>`;
const head=p=>`<div class="ch">${p.ch}</div><div class="hd">${p.hd}</div>`;
const ft=(p,i)=>`<div class="ft"><span>${p.t==='god'?p.n+' · '+p.h:(p.hd||p.toc||'')}</span><b>${String(i).padStart(2,'0')}</b></div>`;
function popBox(p,cls){ const sy=`--sy:${p.sy||'-8%'}`;
  const lp=p.loop||p.once||(p.auto?p.vid:null), tk=p.auto?null:p.vid;
  const fgs=p.t==='crowd'?`<div class="fgi">${p.people.map(([k,x,s,d,dl,src])=>`<div class="p" style="--dl:${dl}s"><img class="fg" src="${src||`img/pop/${k}.webp`}" alt="" style="--x:${x};--s:${s};--d:${d}"></div>`).join('')}</div>`
    : p.fg?`<div class="fgi"><img class="fg" src="${p.fg}" alt=""></div>`:'';
  return `<div class="pop ${lp?'scene':''} ${cls||''} ${p.t==='crowd'?'crowd':''}" style="${sy}"><div class="win"><img class="bg" src="${p.bg}" alt="">${lp?`<video class="lp" playsinline muted ${p.once?'':'loop'} preload="none" data-src="${lp}"></video>`:''}${tk?`<video class="tk" playsinline preload="none" data-src="${tk}"></video>`:''}</div>${fgs?`<div class="fgc">${fgs}</div>`:''}${tk?`<div class="hit" data-wake="1"></div><div class="tap"><i></i>${p.t==='god'?'눌러서 목소리 듣기':'눌러서 말 걸기'}</div>`:''}</div>`; }
const typeLines=(ls,d0=.35)=>`<h2 class="tyl">${ls.map((t,j)=>`<span style="--d:${(d0+j*.45).toFixed(2)}s">${t}</span>`).join('')}</h2>`;
function front(p,i){
  if(p.t==='cover') return `<div class="cbg" style="background-image:url('img/intro0.jpg');background-position:center 40%"></div>
    <div class="ctl"><small>OBANG SAJU ORIGINAL · VOL. 1</small><h1><span>팔자에</span><span>신이</span><span>들었다</span></h1></div>
    <div class="cfg"><img src="img/pop/house.webp" alt=""></div><div class="cbt"></div>
    <div class="cft"><p>빈칸 하나에, 신 다섯이 줄을 섰다</p><div><span>넘겨서 읽기 →</span><b>무료</b></div></div>`;
  if(p.t==='god') return `${popBox(p)}<div class="txt"><div class="ch">${p.yin?'음의 현신':'오방의 신'} · ${p.dir}</div><div class="nm"><b>${p.n}</b><span>${p.h} · ${p.el}</span></div><div class="spec">${p.col} · ${p.job}</div>${bdy(p.body)}<div class="q">${p.q}</div></div>${ft(p,i)}`;
  if(p.t==='film') return `<div class="flm" style="background-image:url('${p.bg}')"><video class="lp" playsinline muted preload="auto" data-src="${p.once}"></video></div><div class="flg"></div><div class="flt">${head(p)}${bdy(p.body)}</div>`;
  if(p.t==='voice') return `<div class="flm" style="background-image:url('${p.still}');background-position:center 22%"><video class="en" playsinline muted loop preload="none" data-src="${p.enter}"></video><video class="vc" playsinline preload="auto" data-src="${p.talk}"></video></div>
    <div class="vsub">${p.sub}</div><button class="vrep" type="button" data-voice="1"><i></i><span>다시 듣기</span></button><div class="flg"></div><div class="flt" style="--c2:${p.c2}">${head(p)}${bdy(p.body)}</div>`;
  if(p.t==='grid8'){ const G=[['甲','#3fbf7f'],['丙','#ff5a46'],['庚','#c9d1db'],['壬','#5b8cff'],['子','#5b8cff'],['午','#ff5a46'],['',''],['申','#c9d1db']];
    return `<div class="g8w"><div class="ch">${p.ch}</div><div class="g8h">여덟 글자,<br><em>빈칸</em> 하나</div>
      <div class="g8t">${['시','일','월','년'].map(t=>`<small>${t}</small>`).join('')}${G.map(([c,col],j)=>c?`<i style="--gc:${col};--d:${.45+j*.1}s">${c}</i>`:`<i class="emp" style="--d:${.45+j*.1}s"></i>`).join('')}</div>
      <div class="g8e">${[['木',1],['火',2],['土',0],['金',2],['水',2]].map(([k,n])=>`<div class="${n?'':'z'}">${k}<b>${n}</b></div>`).join('')}</div>
      <div class="g8b">${bdy(p.body)}<div class="q">그 틈으로, 신이 들어온다</div></div></div>${ft(p,i)}`; }
  if(p.t==='prose'){ const f=p.fig;
    const vig=f?`<div class="vig"><div class="w" style="--fw:${f.fw||'250px'};--fy:${f.fy||'-6px'}"><div class="cir"><i style="background-image:url('${f.bg}')"></i></div><img class="a" src="${f.img}" alt=""><img class="b" src="${f.img}" alt=""></div></div>`:'';
    return `<div class="prs">${vig}${head(p)}${bdy(p.body)}${f?'':DOTS}</div>${ft(p,i)}`; }
  if(p.t==='type') return `${p.bg?`<div class="tyb" style="background-image:url('${p.bg}')"></div>`:''}<div class="tyw"><div class="ch">${p.ch}</div>${typeLines(p.lines)}${p.dots?`<div class="tyd">${Object.values(EL).map((c,j)=>`<i style="background:${c};--d:${(1.3+j*.12).toFixed(2)}s"></i>`).join('')}</div>`:''}<p class="tys">${p.sub}</p></div>${ft(p,i)}`;
  if(p.t==='pairs') return `<div class="prw">${head(p)}<p class="lead">${p.lead}</p><div class="prl">${p.rows.map(([k,a,as,b,bs,e,ia,ib],j)=>`<div class="pr" style="--c:${EL[k]};--d:${(.35+j*.16).toFixed(2)}s"><i style="background-image:url('${ia}')"></i><div><b>${a}</b><small>${as}</small></div><em>${e}</em><div class="r"><b>${b}</b><small>${bs}</small></div><i style="background-image:url('${ib}')"></i></div>`).join('')}</div></div>${ft(p,i)}`;
  if(p.t==='gal') return `<div class="gal">${p.cards.map(([n,r,img,pos],j)=>`<div style="background-image:url('${img}');background-position:${pos};--d:${(.3+j*.15).toFixed(2)}s;--z:${[5,8,8,5][j]}px"><span><b>${n}</b><small>${r}</small></span></div>`).join('')}</div><div class="txt">${head(p)}${bdy(p.body)}</div>${ft(p,i)}`;
  if(p.t==='shade') return `<div class="shw"><div class="tt"><div class="ch">${p.ch}</div>${typeLines(p.lines,.25)}<p>${p.sub}</p></div>
    <div class="shp g" style="--d:.9s;--z:7px"><img src="${CUT.geum}" alt=""></div><div class="shp h" style="--d:.6s;--z:10px"><img src="${CUT.heuk}" alt=""></div><div class="shp s" style="--d:1.25s;--z:15px"><img src="${CUT.sam}" alt=""></div><div class="fog"></div></div>${ft(p,i)}`;
  if(p.t==='mini') return `<div class="mini">${['wood','fire','earth','metal','water'].map((k,j)=>`<i style="background-image:url('img/mini/${k}.jpg');--d:${.25+j*.12}s"></i>`).join('')}</div><div class="txt">${head(p)}${bdy(p.body)}</div>${ft(p,i)}`;
  if(p.t==='how') return `${popBox(p,'scene')}<div class="txt">${head(p)}<ul class="how">
    <li><em>1</em><span><b>문을 두드린다</b>생일을 알려 주면 내 빈칸이 보인다</span></li>
    <li><em>2</em><span><b>내 신을 만난다</b>빈칸을 채워 줄 수호신, 두 얼굴 가운데 하나를 고른다</span></li>
    <li><em>3</em><span><b>매일 조금씩 채운다</b>개운 미션, 당번 도장, 오늘 밤 손님 귀띔</span></li>
    <li><em>4</em><span><b>그림자 손님도 미리 안다</b>흑매 · 그믐 · 삼재, 전부 무료</span></li></ul>
    <div class="cta"><button type="button" data-go="home">내 빈칸 찾으러 가기</button><button class="gh" type="button" data-go="restart">처음부터</button></div></div>`;
  if(p.t==='next') return `<div class="cbg" style="background-image:url('img/kv_house.jpg');filter:brightness(.42);background-position:center 85%"></div><div class="nx"><small>제2권 · 곧 열림</small><h2>오행 하우스<br>다섯 신, 빈 의자 하나</h2><p>빈칸을 채우러 온 신들이 한집에 모여 산다. 여섯 번째 의자는 아직 비어 있다. 그 주인은 당신의 여덟 글자가 알고 있다</p><div class="cta" style="margin-top:22px"><button type="button" data-go="home" style="background:#fff;color:#111">오방도감으로 돌아가기</button></div></div>`;
  return `${popBox(p,p.t==='scene'?'scene':'')}<div class="txt">${head(p)}${bdy(p.body)}${p.q?`<div class="q">${p.q}</div>`:''}</div>${ft(p,i)}`; }
$('book').innerHTML=PAGES.map((p,i)=>`<div class="leaf t-${p.t}${p.yin?' yin':''}${p.sharp?' sharp':''}${p.dark?' dark':''}" data-i="${i}" style="z-index:${N-i}${p.c?`;--c:${p.c}`:''}"><div class="face front">${front(p,i)}</div><div class="face back"></div><div class="shade"></div></div>`).join('');
const leaves=[...document.querySelectorAll('.leaf')];
$('tocL').innerHTML=PAGES.map((p,i)=>`<button class="it" type="button" data-i="${i}">${p.toc||`${p.ch} · ${p.hd}`}<span>${String(i).padStart(2,'0')}</span></button>`).join('');

/* 글이 넘치면 그림 액자를 줄이고, 그래도 넘치면 글자를 줄인다 */
function fitPages(){ document.querySelectorAll('#book .face.front').forEach(f=>{ f.classList.remove('tight','tight2','tight3'); const H=f.clientHeight; if(!H) return;
  const tx=f.querySelector('.txt'), box=f.querySelector('.pop,.mini,.gal'), g8=f.querySelector('.g8w'), prs=f.querySelector('.prs,.prw'), flt=f.closest('.t-voice')?f.querySelector('.flt'):null;
  if(tx&&box){ const how=f.closest('.t-how'), gap=how?22:32, bot=how?16:48, maxP=H*(how?.30:.44), minP=H*(how?.2:.26);
    const run=()=>{ tx.style.top='58px'; tx.style.bottom='auto'; const need=tx.offsetHeight; tx.style.bottom=''; const ph=Math.max(minP,Math.min(maxP,H-58-gap-bot-need)); box.style.height=ph+'px'; tx.style.top=(58+ph+gap)+'px'; return need<=H-58-ph-gap-bot+1; };
    if(!run()){ f.classList.add('tight'); if(!run()){ f.classList.add('tight2'); run(); } } return; }
  if(prs){ const over=()=>prs.scrollHeight>prs.clientHeight+1; for(const c of ['tight','tight2']){ if(!over()) break; f.classList.add(c); } return; }
  if(flt){ if(flt.offsetTop<H*.4) f.classList.add('tight'); return; }
  if(g8){ const fits=()=>{ g8.style.bottom='auto'; const h=g8.offsetHeight; g8.style.bottom=''; return h<=H-36; }; for(const c of ['tight','tight2','tight3']){ if(fits()) break; f.classList.add(c); } return; }
  }); }
fitPages(); addEventListener('resize',()=>{ clearTimeout(fitPages._t); fitPages._t=setTimeout(fitPages,150); });
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fitPages); setTimeout(fitPages,1200);

let AC=null; const ac=()=>{ try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); return AC; }catch(e){ return null; } };
function rustle(){ const A=ac(); if(!A) return; const d=.45, n=A.createBuffer(1,A.sampleRate*d,A.sampleRate), a=n.getChannelData(0); for(let i=0;i<a.length;i++){ const t=i/a.length; a[i]=(Math.random()*2-1)*Math.pow(1-t,2.2)*(t<.08?t/.08:1)*(.6+.4*Math.sin(t*38)); }
  const s=A.createBufferSource(); s.buffer=n; const f=A.createBiquadFilter(); f.type='bandpass'; f.frequency.value=2600; f.Q.value=.7; const g=A.createGain(); g.gain.value=.08; s.connect(f); f.connect(g); g.connect(A.destination); s.start(); }

/* 배경음악: 첫 터치에 잔잔하게 시작, 목소리가 나올 땐 낮춘다 */
const BG_LV=.14, BG_DUCK=.025; let bgG=null, bgOn=true, bgLv=BG_LV;
try{ bgOn=localStorage.getItem('obBookBgm')!=='0'; }catch(e){}
function bgSet(lv,sec=.8){ bgLv=lv; if(!bgG) return; const g=bgG.gain,t=AC.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(g.value,t); g.linearRampToValueAtTime(bgOn?lv:0,t+sec); }
function bgStart(){ const A=ac(); if(!A||bgG) return; if(A.state==='suspended') A.resume();
  bgG=A.createGain(); bgG.gain.value=0; bgG.connect(A.destination);
  fetch('a/book_bgm.mp3').then(r=>r.arrayBuffer()).then(b=>A.decodeAudioData(b)).then(buf=>{ const s=A.createBufferSource(); s.buffer=buf; s.loop=true; s.connect(bgG); s.start(); bgSet(bgLv,2); }).catch(()=>{}); }
document.addEventListener('pointerdown',bgStart,{once:true});
function muUi(){ $('muB').classList.toggle('off',!bgOn); }
$('muB').onclick=e=>{ e.stopPropagation(); bgStart(); bgOn=!bgOn; try{ localStorage.setItem('obBookBgm',bgOn?'1':'0'); }catch(_){} muUi(); bgSet(bgLv,.4); toastS(bgOn?'배경음악 켜짐':'배경음악 꺼짐'); };
muUi();

let cur=0;
function stopVids(l){ l.querySelectorAll('video').forEach(v=>{ try{ v.pause(); }catch(e){} v.classList.remove('on'); }); const p=l.querySelector('.pop'); if(p) p.classList.remove('awake'); const s=l.querySelector('.vsub'); if(s) s.classList.remove('on'); }
function startLoop(l){ const v=l.querySelector('video.lp'); if(!v) return; setTimeout(()=>{ if(leaves[cur]!==l) return; if(!v.getAttribute('src')) v.src=v.dataset.src; v.muted=true; try{ v.currentTime=0; }catch(e){} v.onplaying=()=>v.classList.add('on'); v.play().catch(()=>{}); },500); }
/* 목소리 쪽: 넘기는 터치 안에서 바로 소리 내어 재생. 막히면 소리 없이 시작하고 '다시 듣기'로 소리 */
function enterLoop(l){ const e=l.querySelector('video.en'); if(!e||leaves[cur]!==l) return; if(!e.getAttribute('src')) e.src=e.dataset.src; e.muted=true; e.onplaying=()=>e.classList.add('on'); e.play().catch(()=>{}); }
function playVoice(l,quiet){ const v=l.querySelector('video.vc'); if(!v) return; const sub=l.querySelector('.vsub');
  if(!v.getAttribute('src')) v.src=v.dataset.src; try{ v.currentTime=0; }catch(e){}
  const e=l.querySelector('video.en'); if(e){ try{ e.pause(); }catch(_){} e.classList.remove('on'); }
  v.muted=false; v.onplaying=()=>{ v.classList.add('on'); if(!v.muted) bgSet(BG_DUCK,.4); setTimeout(()=>{ if(leaves[cur]===l&&sub) sub.classList.add('on'); },500); };
  v.onended=()=>{ bgSet(BG_LV,1.2); v.classList.remove('on'); enterLoop(l); };
  v.play().catch(()=>{ v.muted=true; v.play().catch(()=>enterLoop(l)); if(!quiet) toastS('다시 듣기를 누르면 목소리가 들려요'); }); }
function activate(){ leaves.forEach((l,i)=>{ const on=i===cur; l.classList.toggle('cur',on); if(!on) stopVids(l); else startLoop(l); });
  const p=PAGES[cur]; bgSet(BG_LV); if(p.t==='voice') playVoice(leaves[cur]);
  $('prev').disabled=cur===0; $('next').disabled=cur===N-1; $('pgN').textContent=`${cur+1} / ${N}`; $('prog').style.width=(cur/(N-1)*100)+'%';
  $('runT').textContent=p.t==='cover'?'팔자에 신이 들었다':(p.toc||`${p.ch} · ${p.hd}`);
  $('tocL').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i===cur)); try{ sessionStorage.setItem('obBookPg',cur); }catch(e){}
  /* 다음 쪽이 목소리 쪽이면 미리 받아 둔다 */
  const nx=leaves[cur+1]; if(nx){ const v=nx.querySelector('video.vc'); if(v&&!v.getAttribute('src')){ v.src=v.dataset.src; v.preload='auto'; try{ v.load(); }catch(e){} } } }
function go(n,sound=true){ n=Math.max(0,Math.min(N-1,n)); if(n===cur) return;
  leaves.forEach((l,i)=>{ const t=i<n; if(l.classList.contains('turned')!==t){ l.classList.add('moving'); setTimeout(()=>l.classList.remove('moving'),950); } l.classList.toggle('turned',t); });
  cur=n; if(sound) rustle(); try{ navigator.vibrate&&navigator.vibrate(8); }catch(e){} activate(); }
$('next').onclick=()=>go(cur+1); $('prev').onclick=()=>go(cur-1);
document.addEventListener('keydown',e=>{ if(e.key==='ArrowRight') go(cur+1); if(e.key==='ArrowLeft') go(cur-1); });
setTimeout(()=>{ try{ const m=location.hash.match(/p=(\d+)/); if(m) go(+m[1],false); }catch(e){} },300);

function toastS(t){ const e=$('snd'); e.textContent=t; e.classList.add('on'); clearTimeout(e._t); e._t=setTimeout(()=>e.classList.remove('on'),1800); }
function wake(l){ const P=PAGES[+l.dataset.i], pop=l.querySelector('.pop');
  const v=pop&&pop.querySelector('video.tk'); if(!v) return;
  if(!v.getAttribute('src')) v.src=v.dataset.src; v.muted=!P.talk; try{ v.currentTime=0; }catch(e){} pop.classList.add('awake');
  const done=()=>{ v.classList.remove('on'); pop.classList.remove('awake'); bgSet(BG_LV,1.2); };
  v.onplaying=()=>{ v.classList.add('on'); bgSet(BG_DUCK,.4); }; v.onended=done; v.onerror=done; v.onpause=()=>{ if(!v.ended) bgSet(BG_LV,1.2); };
  v.play().catch(()=>{ v.muted=true; v.play().catch(done); toastS('소리를 켜면 목소리가 들려요'); }); }

let drag=null;
$('book').addEventListener('pointerdown',e=>{ if(e.target.closest('button,[data-wake]')) return; const r=$('book').getBoundingClientRect(); drag={x:e.clientX,w:r.width,left:e.clientX-r.left<r.width*.3,moved:false,leaf:null,dir:0,k:0}; });
addEventListener('pointermove',e=>{ if(!drag) return; const dx=e.clientX-drag.x; if(!drag.moved&&Math.abs(dx)<8) return;
  if(!drag.moved){ drag.moved=true; drag.dir=dx<0?1:-1; drag.leaf=drag.dir>0?leaves[cur]:leaves[cur-1]; if(!drag.leaf||(drag.dir>0&&cur===N-1)){ drag.leaf=null; return; } drag.leaf.classList.add('drag','moving'); }
  if(!drag.leaf) return; const k=Math.max(0,Math.min(1,drag.dir>0?-dx/drag.w:1-dx/drag.w)); drag.k=k; drag.leaf.style.transform=`rotateY(${-178*k}deg)`; });
addEventListener('pointerup',e=>{ if(!drag) return; const d=drag; drag=null;
  if(d.leaf){ d.leaf.classList.remove('drag'); d.leaf.style.transform=''; setTimeout(()=>d.leaf.classList.remove('moving'),950); if(d.dir>0){ if(d.k>.25) go(cur+1); } else { if(d.k<.75) go(cur-1); } return; }
  if(!d.moved&&!e.target.closest('button,[data-wake]')){ if(d.left) go(cur-1); else go(cur+1); } });
$('book').addEventListener('click',e=>{ const w=e.target.closest('[data-wake]'); if(w){ wake(w.closest('.leaf')); return; } const vb=e.target.closest('[data-voice]'); if(vb){ playVoice(vb.closest('.leaf')); return; } const b=e.target.closest('[data-go]'); if(!b) return; if(b.dataset.go==='restart'){ go(0); return; } try{ sessionStorage.setItem('toHome','1'); }catch(_){} location.href='./'; });
$('tocB').onclick=()=>$('toc').classList.add('on');
$('toc').onclick=e=>{ const b=e.target.closest('[data-i]'); if(b) go(+b.dataset.i); if(b||e.target.closest('.x')) $('toc').classList.remove('on'); };
$('back').onclick=()=>{ try{ sessionStorage.setItem('toHome','1'); }catch(e){} if(history.length>1) history.back(); else location.href='./'; };

/* 입체감: 손가락 · 마우스 · 폰 기울기에 따라 책 · 배경 · 인물이 서로 다른 깊이로 움직인다. 입력이 없으면 숨 쉬듯 아주 느리게 흔들린다 */
(()=>{ const st=$('stage'); let gx=0,gy=0,x=0,y=0,last=-1e9;
  const set=(a,b)=>{ gx=Math.max(-1,Math.min(1,a)); gy=Math.max(-1,Math.min(1,b)); last=performance.now(); };
  addEventListener('pointermove',e=>{ if(drag&&drag.moved) return; const r=st.getBoundingClientRect(); set(((e.clientX-r.left)/r.width-.5)*2,((e.clientY-r.top)/r.height-.5)*2); },{passive:true});
  addEventListener('deviceorientation',e=>{ if(e.gamma==null) return; set(e.gamma/22,(e.beta-40)/24); },{passive:true});
  const tick=t=>{ let tx=gx,ty=gy; if(t-last>2500){ tx=Math.sin(t/2600)*.35; ty=Math.cos(t/3400)*.22; }
    x+=(tx-x)*.06; y+=(ty-y)*.06; st.style.setProperty('--tx',x.toFixed(3)); st.style.setProperty('--ty',y.toFixed(3)); requestAnimationFrame(tick); };
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(tick); })();

(()=>{ let s=0; try{ s=+(sessionStorage.getItem('obBookPg')||0); }catch(e){} if(s>0&&s<N){ go(s,false); } else activate(); })();
