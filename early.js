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
   돌아오면 멈췄던 것만 다시 재생한다. (아이폰 무음 스위치용 audioSession 'playback' 때문에 백그라운드에서도 계속 나던 문제) */
(function(){
  var live=[], was=[], ctxs=[], sess=null, P=window.HTMLMediaElement&&HTMLMediaElement.prototype, op=P&&P.play;
  if(op){ P.play=function(){ if(live.indexOf(this)<0) live.push(this); return op.apply(this,arguments); }; }
  var AC=window.AudioContext||window.webkitAudioContext;
  if(AC){ try{ var W=class extends AC{ constructor(){ super(...arguments); ctxs.push(this); } };
    if(window.AudioContext) window.AudioContext=W; if(window.webkitAudioContext) window.webkitAudioContext=W; }catch(e){} }
  var off=false;
  function hide(){ if(off) return; off=true; was=[];
    var all=live.slice(); try{ document.querySelectorAll('audio,video').forEach(function(m){ if(all.indexOf(m)<0) all.push(m); }); }catch(e){}
    all.forEach(function(m){ try{ if(!m.paused){ was.push(m); m.pause(); } }catch(e){} });
    ctxs.forEach(function(c){ try{ if(c.state==='running'){ c.__ob=1; c.suspend(); } }catch(e){} });
    try{ if(navigator.audioSession){ sess=navigator.audioSession.type; navigator.audioSession.type='auto'; } }catch(e){}
  }
  function show(){ if(!off) return; off=false;
    try{ if(navigator.audioSession&&sess) navigator.audioSession.type=sess; }catch(e){}
    ctxs.forEach(function(c){ try{ if(c.__ob){ c.__ob=0; c.resume(); } }catch(e){} });
    was.forEach(function(m){ try{ var p=op.call(m); if(p&&p.catch) p.catch(function(){}); }catch(e){} }); was=[];
  }
  document.addEventListener('visibilitychange',function(){ document.hidden?hide():show(); });
  window.addEventListener('pagehide',hide);
  window.addEventListener('pageshow',function(e){ if(e.persisted) show(); });
})();
