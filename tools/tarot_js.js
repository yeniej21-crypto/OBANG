(()=>{
const $=id=>document.getElementById(id);
const toast=(t,ms=1800)=>{ const e=$('toast'); e.textContent=t; e.classList.add('on'); clearTimeout(e._t); e._t=setTimeout(()=>e.classList.remove('on'),ms); };
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const show=id=>{ document.querySelectorAll('.scr').forEach(s=>s.classList.toggle('on',s.id===id)); document.querySelector('.top').classList.toggle('solid',id==='s4'); $('dust').style.opacity=id==='s4'?0:1; };
/* 화면 전환: 짧게 어두워졌다가 열린다 */
const go=async id=>{ const v=$('veil'); v.classList.add('on'); await wait(300); show(id); await wait(60); v.classList.remove('on'); };
const ROMAN=['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
const EL_COLOR={'木':'var(--wood)','火':'var(--fire)','土':'var(--earth)','金':'var(--metal)','水':'var(--water)'};
const EL_KO={'木':'나무','火':'불','土':'흙','金':'쇠','水':'물'};
const EL_PLANET={'木':'목성','火':'화성','土':'토성','金':'금성','水':'수성'};
const EL_IDX={'木':0,'火':1,'土':2,'金':3,'水':4};
const GUARD=['하람','이안','도준','시온','재이'];
const jong=w=>{ const c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28>0; };
const ro=(w,a,b)=>w+(jong(w)?a:b);

/* 금가루 */
(()=>{ const d=$('dust'); let h=''; for(let i=0;i<18;i++){ const l=Math.random()*100, dx=(Math.random()-.5)*80, du=9+Math.random()*10, de=-Math.random()*18, s=1.5+Math.random()*2.5;
  h+=`<i style="left:${l}%;--dx:${dx}px;width:${s}px;height:${s}px;animation-duration:${du}s;animation-delay:${de}s"></i>`; } d.innerHTML=h; })();

/* ---------- 소리 (합성) ---------- */
let AC=null, FX=null;
const ctx=()=>{ if(!AC){ AC=new (window.AudioContext||window.webkitAudioContext)(); FX=AC.createGain(); FX.gain.value=1; FX.connect(AC.destination); } AC.resume(); return AC; };
function tick(vol=.12){ try{ const A=ctx(), t=A.currentTime, n=A.sampleRate*.05, b=A.createBuffer(1,n,A.sampleRate), d=b.getChannelData(0); for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);
  const s=A.createBufferSource(), f=A.createBiquadFilter(), g=A.createGain(); s.buffer=b; f.type='bandpass'; f.frequency.value=2200+Math.random()*1800; f.Q.value=.9; g.gain.value=vol; s.connect(f).connect(g).connect(FX); s.start(t); }catch(e){} }
function riffle(){ for(let i=0;i<10;i++) setTimeout(()=>tick(.08+Math.random()*.06),i*22); }
function chime(f=660,vol=.18){ try{ const A=ctx(), t=A.currentTime; [[1,vol,2.2],[2.01,vol*.4,1.4],[3.02,vol*.22,1]].forEach(([r,a,d])=>{ const o=A.createOscillator(), g=A.createGain(); o.frequency.value=f*r; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(a,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+d); o.connect(g).connect(FX); o.start(t); o.stop(t+d+.1); }); }catch(e){} }
function whoosh(vol=.12){ try{ const A=ctx(), t=A.currentTime, n=A.sampleRate*.6, b=A.createBuffer(1,n,A.sampleRate), d=b.getChannelData(0); for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
  const s=A.createBufferSource(), f=A.createBiquadFilter(), g=A.createGain(); s.buffer=b; f.type='bandpass'; f.Q.value=1.2; f.frequency.setValueAtTime(400,t); f.frequency.exponentialRampToValueAtTime(2400,t+.3); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.12); g.gain.exponentialRampToValueAtTime(.0001,t+.55); s.connect(f).connect(g).connect(FX); s.start(t); }catch(e){} }
/* 카드방 공기: 낮은 패드 + 촛불 타닥임. 무진이 말할 땐 작아진다 */
const AMB={g:null,lv:.035,
  start(){ if(this.g) return; try{ const A=ctx(), t=A.currentTime; const g=A.createGain(); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(this.lv,t+3); g.connect(A.destination); this.g=g;
    const lp=A.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=600; lp.Q.value=.6; lp.connect(g);
    const lfo=A.createOscillator(), lg=A.createGain(); lfo.frequency.value=.07; lg.gain.value=220; lfo.connect(lg).connect(lp.frequency); lfo.start();
    [110,164.8,261.6,220.4].forEach((f,i)=>{ const o=A.createOscillator(), og=A.createGain(); o.type=i===3?'sine':'triangle'; o.frequency.value=f; o.detune.value=(Math.random()-.5)*10; og.gain.value=i===3?.25:.33; o.connect(og).connect(lp); o.start(); });
    const cr=A.createGain(); cr.gain.value=.5; cr.connect(g);
    const crackle=()=>{ if(!this.g) return; try{ const t2=A.currentTime, n=A.sampleRate*.012, b=A.createBuffer(1,n,A.sampleRate), d=b.getChannelData(0); for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,4);
      const s=A.createBufferSource(), f=A.createBiquadFilter(), sg=A.createGain(); s.buffer=b; f.type='highpass'; f.frequency.value=1800+Math.random()*2500; sg.gain.value=.25+Math.random()*.6; s.connect(f).connect(sg).connect(cr); s.start(t2); }catch(e){}
      setTimeout(crackle,70+Math.random()*(Math.random()<.2?60:520)); }; crackle();
  }catch(e){} },
  duck(on){ if(!this.g) return; const A=ctx(), t=A.currentTime; this.g.gain.cancelScheduledValues(t); this.g.gain.setValueAtTime(Math.max(.0001,this.g.gain.value),t); this.g.gain.exponentialRampToValueAtTime(on?.01:this.lv,t+(on?.4:1.6)); }};

/* ---------- 1. 질문 ---------- */
const TOPICS=[['love','연애'],['heart','그 사람 속마음'],['work','일 · 커리어'],['money','돈'],['pick','고민 · 선택'],['today','오늘의 카드']];
const PH={love:'예) 이 사람이랑 잘 될까?',heart:'예) 그 사람이 먼저 연락할까?',work:'예) 지금 이직해도 될까?',money:'예) 이번 달 지출, 괜찮을까?',pick:'예) A랑 B 중에 뭘 고를까?',today:'예) 오늘 조심할 건?'};
let S={topic:'love',n:3,q:'',deck:[],picked:[],rv:[]};
$('topics').innerHTML=TOPICS.map(([k,t])=>`<button class="chip${k==='love'?' on':''}" data-k="${k}" type="button">${t}</button>`).join('');
const syncSpread=()=>{ const sp=TAROT_SPREAD[S.topic]; $('sp3').textContent=(sp.pos.length===3?sp.pos:TAROT_SPREAD.love.pos).join(' · '); $('qin').placeholder=PH[S.topic];
  const three=document.querySelector('.sp[data-n="3"]'); three.disabled=S.topic==='today'; three.style.opacity=S.topic==='today'?.35:1; if(S.topic==='today'){ S.n=1; } document.querySelectorAll('.sp').forEach(b=>b.classList.toggle('on',+b.dataset.n===S.n)); };
$('topics').onclick=e=>{ const b=e.target.closest('.chip'); if(!b) return; tick(.06); S.topic=b.dataset.k; document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===b)); if(S.topic!=='today'&&S.n===1&&!S._n1) S.n=3; syncSpread(); };
$('spreads').onclick=e=>{ const b=e.target.closest('.sp'); if(!b||b.disabled) return; tick(.06); S.n=+b.dataset.n; S._n1=S.n===1; syncSpread(); };
syncSpread();
$('back').onclick=()=>{ try{ sessionStorage.setItem('toHome','1'); }catch(e){} if(history.length>1) history.back(); else location.href='./'; };
$('toHome').onclick=$('back').onclick;

/* 무작위 섞기 (crypto) */
const rnd=n=>{ const a=new Uint32Array(1); crypto.getRandomValues(a); return a[0]%n; };
function shuffleDeck(){ const d=TAROT.map(c=>c.n); for(let i=d.length-1;i>0;i--){ const j=rnd(i+1); [d[i],d[j]]=[d[j],d[i]]; } return d; }

/* ---------- 2. 섞기 ---------- */
const area=$('deckArea'); let cards=[], held=0, holding=false, holdT=null, phase='shuffle';
const NEED=2200; /* 섞는 시간(ms) */
function layoutStack(){ area.innerHTML=''; cards=[]; const W=area.clientWidth, H=area.clientHeight;
  for(let i=0;i<22;i++){ const c=document.createElement('div'); c.className='cd'; c.style.left=(W/2-37)+'px'; c.style.top=(H*.58-66)+'px'; c.style.transform=`translate(${(i-11)*.4}px,${-i*.6}px) rotate(${(Math.random()-.5)*3}deg)`; area.appendChild(c); cards.push(c); } }
function jiggle(){ cards.forEach((c,i)=>{ c.classList.add('fast'); const dx=(Math.random()-.5)*70, dy=(Math.random()-.5)*26, r=(Math.random()-.5)*24; c.style.transform=`translate(${dx}px,${dy-i*.4}px) rotate(${r}deg)`; }); }
function settle(){ cards.forEach((c,i)=>{ c.classList.remove('fast'); c.style.transform=`translate(${(i-11)*.4}px,${-i*.6}px) rotate(${(Math.random()-.5)*3}deg)`; }); }
const ringFg=$('ringFg'); const setRing=p=>ringFg.style.strokeDashoffset=String(503*(1-Math.min(1,p)));
function startHold(e){ if(phase!=='shuffle') return; e.preventDefault(); ctx(); holding=true; const t0=performance.now()-held;
  const loop=()=>{ if(!holding) return; held=performance.now()-t0; setRing(held/NEED); jiggle(); riffle(); if(held>=NEED){ holding=false; settle(); doneShuffle(); return; } holdT=setTimeout(loop,130); }; loop(); }
function endHold(){ if(!holding) return; holding=false; clearTimeout(holdT); settle(); if(held<NEED) $('guide').innerHTML='조금만 더 섞어요<small>꾹 누르고 있으면 카드가 섞여요</small>'; }

/* 부채꼴: 손가락을 대고 좌우로 훑으면 카드가 하나씩 떠오르고, 손을 떼면 그 카드를 뽑는다 */
let fan={cx:0,R:0,top:0,cw:0}, hov=null;
function baseT(c){ return `rotate(${c.dataset.a}deg)`; }
function setHov(c){ if(c===hov) return; if(hov&&!hov._picked){ hov.classList.remove('hov'); hov.style.transform=baseT(hov); hov.style.zIndex=hov.dataset.z; }
  hov=c; if(c){ c.classList.add('hov'); c.style.transform=baseT(c)+' translateY(-24px) scale(1.08)'; c.style.zIndex=40; tick(.05); } }
function cardAt(e){ const r=area.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top; if(y<fan.top-fan.cw*1.2) return null;
  let best=null, bd=1e9; cards.forEach(c=>{ if(c._picked) return; const d=Math.abs(+c.dataset.x-x); if(d<bd){ bd=d; best=c; } }); return bd<fan.cw*1.2?best:null; }
area.addEventListener('pointerdown',e=>{ if(phase==='shuffle') return startHold(e); if(phase!=='pick') return; e.preventDefault(); ctx(); area._down=true; try{ area.setPointerCapture(e.pointerId); }catch(_){} setHov(cardAt(e)); });
area.addEventListener('pointermove',e=>{ if(phase!=='pick') return; if(area._down||e.pointerType==='mouse') setHov(cardAt(e)); });
area.addEventListener('pointerleave',e=>{ if(phase==='pick'&&!area._down) setHov(null); });
area.addEventListener('pointerup',e=>{ if(phase!=='pick'||!area._down) return; area._down=false; const c=hov; setHov(null); if(c) pickCard(c); });
window.addEventListener('pointerup',endHold); window.addEventListener('pointercancel',()=>{ endHold(); area._down=false; setHov(null); });

async function doneShuffle(){ phase='spread'; setRing(1); chime(523); S.deck=shuffleDeck(); await wait(350); $('ringFg').parentNode.style.opacity=0;
  const sp=TAROT_SPREAD[S.topic]; const pos=S.n===1?[sp.pos.length===1?sp.pos[0]:'답']:sp.pos;
  $('slots').innerHTML=pos.map(p=>`<div class="slot"><i>${p}</i></div>`).join('');
  $('guide').innerHTML=`끌리는 카드 ${S.n}장을 골라요<small>손가락으로 훑다가, 멈추고 싶은 곳에서 떼요</small>`;
  const W=area.clientWidth, H=area.clientHeight, n=cards.length, cw=Math.min(56,W/7.2), ch=cw*16/9, R=W*.92, cx=W/2, top=Math.max(H*.5,$('slots').offsetTop+ch+44)+ch/2;
  fan={cx,R,top,cw};
  cards.forEach((c,i)=>{ c.classList.remove('fast'); const deg=-30+60*i/(n-1), a=deg*Math.PI/180, xc=cx+R*Math.sin(a), yc=top+R*(1-Math.cos(a));
    c.dataset.a=deg.toFixed(2); c.dataset.x=xc; c.dataset.z=i+1; c.style.zIndex=i+1;
    setTimeout(()=>{ c.style.width=cw+'px'; c.style.left=(xc-cw/2)+'px'; c.style.top=(yc-ch/2)+'px'; c.style.transform=baseT(c); tick(.07); },i*28);
    c.dataset.i=i; c.classList.add('pick'); });
  await wait(n*28+500); phase='pick'; }
function pickCard(c){ if(phase!=='pick'||c._picked) return; const k=S.picked.length; if(k>=S.n) return; c._picked=true;
  const slot=$('slots').children[k], ar=area.getBoundingClientRect(), sr=slot.getBoundingClientRect();
  c.classList.remove('hov'); c.classList.add('fly'); c.style.zIndex=50+k; c.style.width=sr.width+'px'; c.style.left=(sr.left-ar.left)+'px'; c.style.top=(sr.top-ar.top)+'px'; c.style.transform='rotate(0deg)'; whoosh();
  setTimeout(()=>{ c.classList.remove('fly'); chime(784,.07); },720);
  S.picked.push(S.deck[+c.dataset.i]); S.rv.push(rnd(100)<35);
  if(S.picked.length===S.n){ phase='done'; setTimeout(toReveal,1100); } }

/* 셔플 영상: 첫 대사는 목소리와 함께 한 번만, 그 뒤엔 말없이 카드를 만지는 루프 영상으로 넘어간다 */
const SUBS={shuffle:[[0.5,'질문 하나만 떠올려요.'],[2.95,'…그리고 천천히, 카드 섞어요.']],
  good:[[1.55,'…좋은 카드네요.'],[4.5,'기다려도 돼요.']],
  think:[[0.25,'흐음…'],[1.6,'이건 아직 그 사람도 모르는 마음이에요.']],
  think2:[[1.1,'흐음…'],[2.5,'이 카드는,'],[4.3,'아직 답을 정하지 않았어요.']],
  warn:[[0.55,'…이 카드는 조심하라는 뜻이에요.'],[4.6,'끝까지 들어요.']]};
function subsOn(v,cues,el){ let last=-1; const f=()=>{ if(v.paused&&v.ended) return; let i=-1; cues.forEach((c,j)=>{ if(v.currentTime>=c[0]) i=j; }); if(i!==last){ last=i; el.classList.remove('on'); if(i>=0) setTimeout(()=>{ el.textContent=cues[i][1]; el.classList.add('on'); },90); } if(!v.ended) requestAnimationFrame(f); else el.classList.remove('on'); }; requestAnimationFrame(f); }
const vL=$('vL'); let loopOK=true; vL.addEventListener('error',()=>{ loopOK=false; }); vL.addEventListener('loadeddata',()=>{ loopOK=true; });
function toLoop(){ const box=$('s2').querySelector('.vbox'), v=$('vS'); try{ v.pause(); }catch(e){}
  if(loopOK&&!vL.error){ vL.currentTime=0; vL.play().then(()=>box.classList.add('loop')).catch(()=>box.classList.add('still')); } else box.classList.add('still'); }
$('go1').onclick=async()=>{ S.q=$('qin').value.trim(); S.picked=[]; S.rv=[]; held=0; phase='shuffle'; ctx(); AMB.start();
  const box=$('s2').querySelector('.vbox'); box.classList.remove('still','loop'); try{ vL.pause(); }catch(e){}
  await go('s2'); $('ringFg').parentNode.style.opacity=1; setRing(0); $('slots').innerHTML='';
  $('guide').innerHTML='카드를 꾹 누른 채 문질러서 섞어요<small>질문을 마음속으로 한 번 더 떠올리면서</small>';
  layoutStack();
  const v=$('vS'); v.muted=false; v.loop=false; v.currentTime=0; AMB.duck(true);
  v.play().then(()=>subsOn(v,SUBS.shuffle,$('sSub'))).catch(()=>{ AMB.duck(false); toLoop(); });
  v.onended=()=>{ AMB.duck(false); toLoop(); }; };

/* ---------- 3. 공개: 한 장씩 가운데로 불러와 크게 뒤집는다 ---------- */
let POS=[];
const cardHTML=(n,i,cls)=>{ const c=TAROT[n]; return `<div class="fc${cls}${S.rv[i]?' rv':''}" data-i="${i}"><div class="pl">${POS[i]}</div><div class="glow"></div><div class="in"><div class="b"></div><div class="f"><div class="art" style="background-image:url('${c.img}')"></div><div class="no">${ROMAN[n]}</div></div></div><div class="cap">${c.ko}<small>${c.en}</small></div><div class="rvTag">역방향</div></div>`; };
function toReveal(){ const sp=TAROT_SPREAD[S.topic]; POS=S.n===1?[sp.pos.length===1?sp.pos[0]:'답']:sp.pos; try{ $('vS').pause(); vL.pause(); }catch(e){}
  $('row').innerHTML=S.picked.map((n,i)=>cardHTML(n,i,S.n===1?' one':'')).join('');
  $('g3').textContent=S.n===1?'카드를 눌러서 뒤집어요':'한 장씩 눌러서 뒤집어요'; go('s3'); let opened=0, busy=false;
  document.querySelectorAll('#row .fc').forEach(el=>el.onclick=async()=>{ if(busy||el.classList.contains('flip')) return; busy=true; const i=+el.dataset.i;
    await spotlight(i); el.classList.add('flip'); opened++; busy=false;
    if(opened===S.n){ $('g3').textContent='무진이 카드를 읽고 있어요…'; setTimeout(react,1200); }
    else $('g3').textContent=`${S.n-opened}장 남았어요`; }); }
function sparks(host){ for(let k=0;k<26;k++){ const s=document.createElement('i'); s.className='spark'; const a=Math.random()*Math.PI*2, d=90+Math.random()*120; s.style.setProperty('--x',Math.cos(a)*d+'px'); s.style.setProperty('--y',Math.sin(a)*d*1.3+'px'); s.style.animationDelay=(Math.random()*.15)+'s'; host.appendChild(s); setTimeout(()=>s.remove(),1300); } }
function spotlight(i){ return new Promise(res=>{ const sp=$('spot'), n=S.picked[i], c=TAROT[n], rv=S.rv[i];
  const kw=(rv?c.kwR:c.kw).join(' · ');
  sp.innerHTML=cardHTML(n,i,'')+`<div class="mean"><b style="color:var(--gold-2);font-weight:400">${POS[i]}</b><br>${kw}</div><div class="tapn">눌러서 계속</div>`;
  const fc=sp.querySelector('.fc'); fc.style.transform='scale(.55) translateY(40px)'; fc.style.opacity='0';
  sp.classList.add('on'); whoosh(.1);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ fc.style.transform='none'; fc.style.opacity='1'; }));
  setTimeout(()=>{ fc.classList.add('flip'); whoosh(.14); },650);
  setTimeout(()=>{ chime(rv?392:660,.2); if(!rv) setTimeout(()=>chime(990,.08),160); sparks(sp); sp.classList.add('shown'); },1050);
  let can=false; setTimeout(()=>{ can=true; },1500);
  sp.onclick=()=>{ if(!can) return; sp.onclick=null; fc.style.transform='scale(.6)'; fc.style.opacity='0'; sp.classList.remove('shown','on'); setTimeout(()=>{ sp.innerHTML=''; res(); },380); }; }); }

/* 전체 기운: 정방향은 카드 성향 그대로, 역방향은 반대로 약하게 */
function score(){ return S.picked.reduce((s,n,i)=>{ const t=TAROT[n].tone; return s+(S.rv[i]?(t===0?-.5:-t*.5):t); },0); }
function mood(){ const sc=score(); if(S.n===1) return sc>=1?'good':sc<=-1?'warn':'think'; return sc>=1.5?'good':sc<=-1?'warn':'think'; }
async function react(){ const m=mood(); S.mood=m; const clip=(m==='think'&&!['love','heart'].includes(S.topic))?'think2':m; const rx=$('rx'), v=$('rxV'); $('rxPo').style.backgroundImage=`url('img/tarot/${m}.jpg')`; v.src=`v/tarot/${clip}.mp4`; rx.classList.add('on'); AMB.duck(true);
  const done=()=>{ if(rx._done) return; rx._done=true; try{ v.pause(); }catch(e){} AMB.duck(false); render(); rx.classList.remove('on'); setTimeout(()=>{ rx._done=false; },600); };
  rx._done=false; $('rxX').onclick=done; v.onended=done; v.muted=false;
  try{ await v.play(); subsOn(v,SUBS[clip],$('rxSub')); }catch(e){ setTimeout(done,1600); }
  setTimeout(()=>{ if(!rx._done&&v.readyState<2) done(); },5000); }

/* ---------- 4. 풀이 ---------- */
const TITLE={good:'바람이 당신 쪽으로',think:'아직 열려 있는 판',warn:'한 템포 쉬어 갈 때'};
const CLOSE={
  love:{good:'마음이 가는 쪽으로 한 발만 더 가요. 이번엔 타이밍이 당신 편이에요.',think:'아직 서로 온도를 재는 중이에요. 먼저 확인하려 들기보다, 편하게 한 번 웃어 줘요.',warn:'지금 밀어붙이면 서로 지쳐요. 한 주만 거리를 두고 나를 먼저 챙겨요.'},
  heart:{good:'그 사람, 생각보다 당신을 자주 떠올려요. 신호가 오면 모른 척하지 마요.',think:'그 사람도 자기 마음을 정리하는 중이에요. 답을 재촉하면 한 발 물러나요.',warn:'그 사람 마음보다 당신 마음이 먼저예요. 기다리다 지치기 전에 기한을 정해요.'},
  work:{good:'지금 움직여도 돼요. 제안이든 이직이든, 문이 열려 있어요.',think:'큰 결정은 한 달만 미뤄요. 정보를 더 모으면 답이 선명해져요.',warn:'무리한 확장은 멈춤. 지금은 지키는 게 이기는 거예요.'},
  money:{good:'들어오는 흐름이에요. 다만 들어온 만큼 한 번에 쓰지는 말고요.',think:'사고팔 타이밍은 아직이에요. 지출부터 한 번 정리해요.',warn:'충동적인 결제와 투자는 오늘부터 일주일 금지.'},
  pick:{good:'마음이 먼저 기운 쪽을 골라요. 카드도 그쪽 손을 들어 줘요.',think:'둘 다 반반이에요. 결정을 미룰 수 있다면 하루만 더 자고 정해요.',warn:'지금 고르면 후회할 수 있어요. 선택지를 하나 더 만들어 봐요.'},
  today:{good:'오늘은 먼저 연락하고, 먼저 웃어요. 좋은 일이 먼저 와요.',think:'오늘은 크게 벌이지 말고, 흐름을 지켜보는 날.',warn:'오늘은 말 한마디를 조심해요. 한 템포 늦게 답해도 괜찮아요.'}};
function meaning(c,rv){ const k=TAROT_SPREAD[S.topic].k; if(k&&c[k]) return rv?c[k].rv:c[k].up; return rv?c.rv:c.up; }
function loadMe(){ try{ return JSON.parse(sessionStorage.getItem('me')||'null'); }catch(e){ return null; } }
function elOfMe(me){ try{ let y=+me.y,m=+me.m,d=+me.d; if(me.cal==='l'){ const s=Saju.lunarToSolar(y,m,d,false); y=s[0]; m=s[1]; d=s[2]; } const h=(me.h==null||me.h===''||+me.h<0)?null:+me.h; const P=Saju.pillars(y,m,d,h); return Saju.elCount(P); }catch(e){ return null; } }
function ohHTML(){ const els=S.picked.map(n=>TAROT[n].el); const cnt={}; els.forEach(e=>cnt[e]=(cnt[e]||0)+1); const top=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
  const chips=els.map((e,i)=>`<span class="el" style="--c:${EL_COLOR[e]}">${TAROT[S.picked[i]].ko} · ${e} ${EL_PLANET[e]}</span>`).join(' ');
  let h=`<p>서양 점성술의 행성을 동양에서는 <b>목성·화성·토성·금성·수성</b>, 오행의 이름으로 불러요. 그래서 타로 카드마다 오행이 하나씩 붙어 있어요.</p><div style="margin:10px 0;display:flex;flex-wrap:wrap;gap:6px">${chips}</div>`;
  const me=loadMe(), ec=me&&elOfMe(me);
  if(ec){ const mn=Math.min(...ec), lack=[0,1,2,3,4].filter(i=>ec[i]===mn), mx=Math.max(...ec), over=[0,1,2,3,4].filter(i=>ec[i]===mx);
    const hitLack=els.filter(e=>lack.includes(EL_IDX[e])), hitOver=els.filter(e=>over.includes(EL_IDX[e]));
    if(hitLack.length){ const e=hitLack[0], g=GUARD[EL_IDX[e]]; h+=`<p style="margin-top:8px">${me.name?esc(me.name)+'님':'당신'} 사주에 가장 부족한 <b>${EL_KO[e]}(${e})</b> 기운이 카드로 들어왔어요. 비어 있던 칸을 채우는 신호예요. ${ro(g,'이','가')} 문을 두드리는 중.</p>`; }
    else if(hitOver.length){ const e=hitOver[0]; h+=`<p style="margin-top:8px">사주에 이미 넘치는 <b>${EL_KO[e]}(${e})</b> 기운이 또 나왔어요. 좋은 카드여도 과하면 탈이에요. 한 템포 쉬어 가요.</p>`; }
    else h+=`<p style="margin-top:8px">이번 카드의 중심 기운은 <b>${EL_KO[top]}(${top})</b>. 사주의 균형을 크게 흔들지 않는 무난한 흐름이에요.</p>`;
  } else h+=`<p style="margin-top:8px">생년월일을 넣으면 뽑은 카드의 기운이 <b>내 사주의 빈칸</b>을 채우는지 알려 드려요.</p><div class="mini"><input type="date" id="bd" min="1950-01-01" max="2010-12-31" aria-label="생년월일"><button type="button" id="bdGo">연결하기</button></div>`;
  return h; }
/* 무진이 이어서 읽어 주는 문장: 질문 → 자리별 카드 → 마무리 조언 */
function narrative(){ const m=S.mood; let p=[];
  if(S.q) p.push(`<p>"${esc(S.q)}"<br>이 질문에 카드 ${S.n}장이 답했어요.</p>`);
  if(S.n===1){ const c=TAROT[S.picked[0]], rv=S.rv[0]; p.push(`<p><b>${c.ko}</b>${rv?' 역방향':''}${rv?'이':(jong(c.ko)?'이':'가')} 나왔어요. ${meaning(c,rv)}</p>`); }
  else S.picked.forEach((n,i)=>{ const c=TAROT[n], rv=S.rv[i]; p.push(`<p>${ro(POS[i],'에는','에는')} <b>${c.ko}</b>${rv?'(역방향)':''}. ${meaning(c,rv)}</p>`); });
  p.push(`<p class="close">${CLOSE[S.topic][m]}</p>`); return p.join(''); }
function render(){ const sp=TAROT_SPREAD[S.topic]; const m=S.mood;
  $('rhero').style.backgroundImage=`url('img/tarot/${m}.jpg')`; $('rTitle').textContent=TITLE[m]; $('rKick').textContent=`무진의 풀이 · ${sp.t}`;
  $('rQ').textContent=S.q?`"${S.q}"`:(S.n===1?'한 장으로 본 답':'세 장으로 본 흐름');
  $('rCards').innerHTML=S.picked.map((n,i)=>{ const c=TAROT[n], rv=S.rv[i]; return `<div class="cr"><div class="th${rv?' rv':''}" data-i="${i}" style="background-image:url('${c.img}')"></div><div><div class="p">${POS[i]}</div><div class="n">${c.ko}<small>${c.en}</small></div><span class="ud ${rv?'rv':'up'}">${rv?'역방향':'정방향'}</span><span class="el" style="--c:${EL_COLOR[c.el]}">${c.el} · ${EL_PLANET[c.el]}</span><div class="kws">${(rv?c.kwR:c.kw).map(k=>`<span>#${k}</span>`).join('')}</div><p class="m">${meaning(c,rv)}</p></div></div>`; }).join('');
  $('rCards').querySelectorAll('.th').forEach(t=>t.onclick=()=>zoom(+t.dataset.i));
  $('rSay').outerHTML=`<div id="rSay">${narrative()}</div>`;
  $('rOh').innerHTML=ohHTML(); const bg=$('bdGo'); if(bg) bg.onclick=()=>{ const v=$('bd').value; if(!v) return; const [y,mo,d]=v.split('-').map(Number); try{ sessionStorage.setItem('me',JSON.stringify({name:'',g:'f',cal:'s',y,m:mo,d,h:null})); }catch(e){} $('rOh').innerHTML=ohHTML(); };
  $('s4s').scrollTop=0; show('s4'); }
function zoom(i){ const n=S.picked[i], c=TAROT[n], rv=S.rv[i]; $('zc').style.backgroundImage=`url('${c.img}')`; $('zc').classList.toggle('rv',rv);
  $('zn').textContent=`${c.ko} · ${c.en}${rv?' (역방향)':''}`; $('zk').textContent=(rv?c.kwR:c.kw).map(k=>'#'+k).join('  '); $('zoom').classList.add('on'); tick(.06); }
$('zoom').onclick=()=>$('zoom').classList.remove('on');
$('payBtn').onclick=()=>toast('체험판이라 결제는 여기까지예요');
$('again').onclick=()=>{ go('s1'); $('s1').scrollTop=0; };

/* 첫 화면 캐릭터 인트로 */
if(window.MenuIntro) MenuIntro.play({src:'v/tarot/intro.mp4',poster:'img/tarot/mujin.jpg',who:'무진 · 한밤의 카드방',title:'무진의 타로',subs:[[0.3,'앉아요.'],[2.3,'…카드한테 물어보고 싶은 거,'],[5.1,'하나 있죠?']]});
})();
