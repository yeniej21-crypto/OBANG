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
