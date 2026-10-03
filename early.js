/* 첫 화면 깜빡임 막기 — 모든 화면 <head>에서 가장 먼저 읽는다.
   1) 카톡 · 안드로이드 웹뷰는 영상이 첫 장면을 받기 전까지 회색 판 + 재생 단추를 그린다 → 투명 포스터를 넣고 기본 단추를 숨긴다.
   2) 메뉴 인트로가 있는 화면은 인트로가 뜨기 전에 본 화면이 잠깐 보인다 → 인트로가 붙을 때까지 검은 화면으로 덮는다(menuintro.js가 걷어 냄, 2.5초 안전장치). */
(function(){
  var d=document.documentElement, T='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  var st=document.createElement('style');
  st.textContent='video::-webkit-media-controls,video::-webkit-media-controls-panel,video::-webkit-media-controls-start-playback-button,video::-webkit-media-controls-overlay-play-button{display:none!important;-webkit-appearance:none!important;opacity:0!important}'
    +'html.mi-pre .stage>*:not(.mi){visibility:hidden!important}html.mi-pre .stage{background:#000!important}html.mi-pre body>.pcNav,html.mi-pre body>.pcSide{visibility:hidden!important}';
  (document.head||d).appendChild(st);
  function fix(v){ if(!v.getAttribute('poster')) v.setAttribute('poster',T); }
  try{ new MutationObserver(function(ms){ for(var i=0;i<ms.length;i++){ var a=ms[i].addedNodes; for(var j=0;j<a.length;j++){ var n=a[j]; if(n.nodeType!==1) continue; if(n.tagName==='VIDEO') fix(n); else if(n.getElementsByTagName){ var vs=n.getElementsByTagName('video'); for(var k=0;k<vs.length;k++) fix(vs[k]); } } } }).observe(d,{childList:true,subtree:true}); }catch(e){}
  try{ if(/(today|career|taegil|gunghap|sinnyeon|myeongri|lifetime)\.html$|\/tarot(\.html|\/|\/index\.html)$/.test(location.pathname)&&location.hash!=='#re'&&!sessionStorage.getItem('obRe')&&!sessionStorage.getItem('skipMI')){ d.classList.add('mi-pre'); setTimeout(function(){ d.classList.remove('mi-pre'); },2500); } }catch(e){}
})();

/* 10/2: 화면을 벗어나면 소리 멈춤 — 다른 탭 · 다른 앱으로 가거나 창을 닫으면 음악 · 영상 소리 · 효과음을 모두 멈추고,
   돌아오면 멈췄던 것만 다시 재생한다. (아이폰 무음 스위치용 audioSession 'playback' 때문에 백그라운드에서도 계속 나던 문제)
   v3(10/2 저녁): 뒤에 있는 동안 타이머 · 다음 클립이 play() · resume()을 다시 불러 소리가 되살아나던 문제 → 뒤에 있는 동안은
   재생 · 재개 요청을 막고 돌아올 때 대신 재생. 1초마다 감시, 폰에서는 창 포커스를 잃을 때도 멈춤. */
(function(){
  var live=[], was=[], ctxs=[], sess=null, P=window.HTMLMediaElement&&HTMLMediaElement.prototype, op=P&&P.play, off=false;
  function keep(m){ if(was.indexOf(m)<0) was.push(m); }
  if(op){ P.play=function(){ if(live.indexOf(this)<0) live.push(this);
    if(off){ keep(this); return Promise.resolve(); }
    return op.apply(this,arguments); }; }
  var AC=window.AudioContext||window.webkitAudioContext;
  if(AC){ try{ var W=class extends AC{ constructor(){ super(...arguments); ctxs.push(this); }
      resume(){ if(off){ this.__ob=1; return Promise.resolve(); } return super.resume(); } };
    if(window.AudioContext) window.AudioContext=W; if(window.webkitAudioContext) window.webkitAudioContext=W; }catch(e){} }
  function silence(){
    var all=live.slice(); try{ document.querySelectorAll('audio,video').forEach(function(m){ if(all.indexOf(m)<0) all.push(m); }); }catch(e){}
    all.forEach(function(m){ try{ if(!m.paused){ keep(m); m.pause(); } }catch(e){} });
    ctxs.forEach(function(c){ try{ if(c.state==='running'){ c.__ob=1; c.suspend(); } }catch(e){} });
  }
  function hide(){ if(off){ silence(); return; } off=true; was=[]; silence();
    try{ if(navigator.audioSession){ sess=navigator.audioSession.type; navigator.audioSession.type='auto'; } }catch(e){}
  }
  function show(){ if(!off) return; if(document.hidden) return; off=false;
    try{ if(navigator.audioSession&&sess) navigator.audioSession.type=sess; }catch(e){}
    ctxs.forEach(function(c){ try{ if(c.__ob){ c.__ob=0; c.resume(); } }catch(e){} });
    was.forEach(function(m){ try{ var p=op.call(m); if(p&&p.catch) p.catch(function(){}); }catch(e){} }); was=[];
  }
  document.addEventListener('visibilitychange',function(){ document.hidden?hide():show(); });
  window.addEventListener('pagehide',hide);
  window.addEventListener('pageshow',function(e){ if(e.persisted||!document.hidden) show(); });
  document.addEventListener('freeze',hide);
  try{ if(window.matchMedia&&matchMedia('(pointer:coarse)').matches){ window.addEventListener('blur',hide); window.addEventListener('focus',show); } }catch(e){}
  setInterval(function(){ if(document.hidden) hide(); },1000);
})();

/* 10/3: 소리 켜고 들어가기 — 폰 브라우저는 화면을 한 번 누르기 전까지 소리를 막는다.
   이 화면이 소리를 내려다 막히면(재생 거부 · 멈춘 오디오 엔진), 화면 아래쪽에 조용한 문을 하나 띄운다.
   누르면 막혔던 소리를 그 자리에서 다시 틀고, '소리 없이 볼게요'를 고르면 이번 방문 동안은 다시 묻지 않는다.
   화면마다 이미 있는 시작 단추(오프닝 '문을 두드려' · 도화 시작 · 메뉴 인트로 탭)가 보이는 동안은 띄우지 않는다. */
(function(){
  var P=window.HTMLMediaElement&&HTMLMediaElement.prototype, op=P&&P.play, opause=P&&P.pause, AC=window.AudioContext||window.webkitAudioContext;
  if(!op) return;
  var BL=[], CX=[], el=null, timer=0, done=false, FORCE=false;
  /* 소리가 중심인 화면은 막히기 전이라도 처음 들어오면 문을 띄운다 */
  var SND=/(avatar|book|free|lovemini|noeul|obgh|ppopgi|sinnyeon|sinnyeon_v2|meokmul|heukmae|geumeum|samjae|love|cooltime|workmini)\.html$/;
  function act(){ try{ return !!(navigator.userActivation&&navigator.userActivation.hasBeenActive); }catch(e){ return false; } }
  function no(){ try{ return sessionStorage.getItem('obSnd')==='0'; }catch(e){ return false; } }
  P.play=function(){ var m=this, r=op.apply(m,arguments);
    if(r&&r.catch&&!done){ var want=!m.muted; r.catch(function(e){ if(e&&e.name==='NotAllowedError'&&want&&BL.indexOf(m)<0){ BL.push(m); ask(); } }); }
    return r; };
  P.pause=function(){ var i=BL.indexOf(this); if(i>=0) BL.splice(i,1); return opause.apply(this,arguments); };
  if(AC){ try{ var W=class extends AC{ constructor(){ super(...arguments); var c=this; if(c.state==='suspended'&&!act()){ CX.push(c); ask(); } } };
    if(window.AudioContext) window.AudioContext=W; if(window.webkitAudioContext) window.webkitAudioContext=W; }catch(e){} }
  function own(){ /* 화면 자체 시작 단추가 보이면 그쪽을 따른다 */
    var s=['.mi .gate.on','#splash:not(.off)','#startBtn','#startMute','[data-sound-gate]'];
    for(var i=0;i<s.length;i++){ var n=document.querySelector(s[i]); if(n&&n.offsetParent!==null&&getComputedStyle(n).visibility!=='hidden'&&getComputedStyle(n).opacity!=='0') return true; }
    return false; }
  function need(){ return !done&&!act()&&(FORCE||BL.length||CX.some(function(c){ return c.state==='suspended'; })); }
  function ask(){ if(done||no()||timer) return; timer=setTimeout(check,700); }
  function check(){ timer=0; if(!need()) return; if(own()){ timer=setTimeout(check,600); return; } show(); }
  function unlock(){ done=true;
    CX.forEach(function(c){ try{ c.resume(); }catch(e){} });
    BL.splice(0).forEach(function(m){ try{ var p=op.call(m); if(p&&p.catch) p.catch(function(){}); }catch(e){} });
    try{ window.dispatchEvent(new Event('obsound')); }catch(e){} }
  function mute(){ done=true; try{ sessionStorage.setItem('obSnd','0'); }catch(e){}
    BL.splice(0).forEach(function(m){ if(m.tagName==='VIDEO'){ try{ m.muted=true; var p=op.call(m); if(p&&p.catch) p.catch(function(){}); }catch(e){} } }); }
  function close(){ if(!el) return; el.classList.remove('on'); var x=el; setTimeout(function(){ if(x.parentNode) x.parentNode.removeChild(x); },500); el=null; }
  function show(){ if(el||!document.body) return;
    var st=document.createElement('style');
    st.textContent='.obSg{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse 70% 32% at 50% 50%,rgba(6,5,8,.62) 0%,rgba(6,5,8,.38) 100%),rgba(6,5,8,.12);-webkit-backdrop-filter:blur(1.5px);backdrop-filter:blur(1.5px);opacity:0;transition:opacity .45s;pointer-events:none;cursor:pointer;-webkit-tap-highlight-color:transparent}'
      +'.obSg.on{opacity:1;pointer-events:auto}'
      +'.obSg .go{display:flex;flex-direction:column;align-items:center;gap:14px;border:0;background:none;color:#f6ecdf;cursor:pointer;padding:24px;font:inherit;-webkit-tap-highlight-color:transparent}'
      +'.obSg .c{flex:none;box-sizing:border-box;width:64px;height:64px;min-height:64px;border-radius:50%;border:1px solid rgba(232,196,138,.8);display:grid;place-items:center;color:#e8c48a;background:rgba(10,8,12,.4);animation:obSgP 2.4s ease-in-out infinite}'
      +'.obSg .t{font-family:"Song Myung","Noto Serif KR",serif;font-size:20px;letter-spacing:.06em;text-shadow:0 2px 14px rgba(0,0,0,.85)}'
      +'.obSg .s{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);margin:0 auto;width:max-content;border:0;background:none;color:rgba(246,236,223,.6);font:500 13px/1 "Noto Sans KR",sans-serif;letter-spacing:.04em;padding:12px 14px;cursor:pointer}'
      +'@keyframes obSgP{0%,100%{box-shadow:0 0 0 0 rgba(232,196,138,.28)}50%{box-shadow:0 0 0 13px rgba(232,196,138,0)}}'
      +'@media (prefers-reduced-motion:reduce){.obSg .c{animation:none}}';
    document.head.appendChild(st);
    el=document.createElement('div'); el.className='obSg'; el.setAttribute('role','dialog'); el.setAttribute('aria-label','소리 켜고 들어가기');
    el.innerHTML='<button type="button" class="go"><span class="c"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/></svg></span><span class="t">소리 켜고 들어가기</span></button><button type="button" class="s">소리 없이 볼게요</button>';
    el.addEventListener('click',function(e){ if(e.target.closest('.s')) return; unlock(); close(); });
    el.querySelector('.s').addEventListener('click',function(){ mute(); close(); });
    document.body.appendChild(el); requestAnimationFrame(function(){ requestAnimationFrame(function(){ if(el) el.classList.add('on'); }); }); }
  try{ if(SND.test(location.pathname)){ var go=function(){ FORCE=true; ask(); }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){ setTimeout(go,200); }); else setTimeout(go,200); } }catch(e){}
  /* 다른 곳을 눌러도 소리는 풀린다: 막혔던 것을 다시 틀고 문을 닫는다 */
  document.addEventListener('pointerup',function(e){ if(done||(el&&el.contains(e.target))) return; if(BL.length||CX.length||FORCE){ setTimeout(function(){ if(!done&&act()){ unlock(); close(); } },0); } },true);
})();

/* 10/3: 로그인 · 회원가입 모듈(obauth.js)을 모든 화면에 */
(function(){ try{ if(window.ObAuth||document.querySelector('script[src*="obauth.js"]')) return; var s=document.createElement('script'); s.src='obauth.js?v=1'; s.async=true; (document.head||document.documentElement).appendChild(s); }catch(e){} })();
