/* vidguard.js — 영상 위에 브라우저가 띄우는 버튼(삼성 인터넷 '동영상 도우미'의 팝업 재생 · 전체 화면 버튼) 막기.
   1) 모든 브라우저: <video>에 팝업 재생 · 원격 재생 · 다운로드 끄기 속성.
   2) 삼성 인터넷: 페이지 쪽에서 끄는 방법이 없어서, 원래 영상은 2px로 숨겨 재생만 시키고
      같은 자리에 canvas를 두고 매 프레임을 그린다. video를 가리키던 CSS 규칙은 canvas.vgc로 복제한다.
   ?vg=1 을 붙이면 삼성이 아니어도 canvas 방식으로 돈다(점검용). */
(function(){
  'use strict';
  var Q = location.search || '';
  var MIRROR = /SamsungBrowser/i.test(navigator.userAgent) || /[?&]vg=1\b/.test(Q);
  window.__vgMirror = MIRROR;

  function harden(v){
    if(v.__vgH) return; v.__vgH = 1;
    try{ v.disablePictureInPicture = true; }catch(e){}
    try{ v.disableRemotePlayback = true; }catch(e){}
    v.setAttribute('disablepictureinpicture','');
    v.setAttribute('disableremoteplayback','');
    v.setAttribute('controlslist','nodownload nofullscreen noremoteplayback noplaybackrate');
    v.setAttribute('x-webkit-airplay','deny');
    v.removeAttribute('controls');
  }

  /* ---- 삼성: canvas로 비추기 ---- */
  var seen = [], baseDone = false;
  function cloneCss(){
    var add = [];
    var re = /(^|[\s>+~,(])video(?![\w-])/g;
    for(var i=0;i<document.styleSheets.length;i++){
      var sh = document.styleSheets[i];
      if(seen.indexOf(sh)>=0 || (sh.ownerNode && sh.ownerNode.getAttribute && sh.ownerNode.getAttribute('data-vg'))) continue;
      seen.push(sh);
      var rules; try{ rules = sh.cssRules; }catch(e){ continue; }
      if(!rules) continue;
      walk(rules);
    }
    function walk(rules){
      for(var j=0;j<rules.length;j++){
        var r = rules[j];
        if(r.cssRules && r.media){ // @media 안쪽
          var inner = [];
          for(var k=0;k<r.cssRules.length;k++){ var x=r.cssRules[k]; if(x.selectorText && re.test(x.selectorText)){ re.lastIndex=0; inner.push(x.selectorText.replace(re,'$1canvas.vgc')+'{'+x.style.cssText+'}'); } re.lastIndex=0; }
          if(inner.length) add.push('@media '+r.media.mediaText+'{'+inner.join('')+'}');
          continue;
        }
        if(r.selectorText && re.test(r.selectorText)){ re.lastIndex=0; add.push(r.selectorText.replace(re,'$1canvas.vgc')+'{'+r.style.cssText+'}'); }
        re.lastIndex=0;
      }
    }
    if(!baseDone){ baseDone = true; add.push('video.vgs{position:fixed!important;left:0!important;top:0!important;right:auto!important;bottom:auto!important;width:2px!important;height:2px!important;min-width:0!important;min-height:0!important;opacity:.01!important;pointer-events:none!important;z-index:-1!important;transform:none!important;filter:none!important;transition:none!important}');
    add.push('canvas.vgc{display:block}'); }
    if(!add.length) return;
    var st = document.createElement('style'); st.setAttribute('data-vg','1'); st.textContent = add.join('\n');
    (document.head||document.documentElement).appendChild(st);
  }

  function syncAttr(v, c){
    var cls = (v.getAttribute('class')||'').split(/\s+/).filter(function(n){ return n && n!=='vgs'; });
    cls.push('vgc'); c.setAttribute('class', cls.join(' '));
    var s = v.getAttribute('style')||'';
    var p = v.getAttribute('poster');
    if(p) s = 'background:url("'+p+'") center/cover no-repeat;' + s;
    c.setAttribute('style', s);
    if(v.id) c.setAttribute('data-vid-of', v.id);
  }

  function mirror(v){
    if(v.__vgC || !v.parentNode) return;
    if(v.closest && v.closest('[data-vg-skip]')) return;
    var c = document.createElement('canvas');
    c.setAttribute('aria-hidden','true');
    v.__vgC = c; c.__vgV = v;
    syncAttr(v, c);
    v.parentNode.insertBefore(c, v);
    v.classList.add('vgs');
    new MutationObserver(function(){ syncAttr(v, c); }).observe(v, {attributes:true, attributeFilter:['class','style','poster']});
    // 영상에 직접 걸린 클릭은 canvas에서 넘겨준다
    c.addEventListener('click', function(e){ if(v.onclick || v.__vgClick){ e.stopPropagation(); v.click(); } });
    var ctx = null, raf = 0, rvfc = !!v.requestVideoFrameCallback;
    function size(){ if(v.videoWidth && (c.width!==v.videoWidth || c.height!==v.videoHeight)){ c.width=v.videoWidth; c.height=v.videoHeight; ctx=null; } }
    function draw(){
      if(!v.videoWidth || v.readyState < 2) return;
      size();
      if(!ctx) ctx = c.getContext('2d', {alpha:true});
      try{ ctx.drawImage(v, 0, 0, c.width, c.height); }catch(e){}
    }
    function loopRaf(){ draw(); if(!v.paused && !v.ended) raf = requestAnimationFrame(loopRaf); else raf = 0; }
    function loopV(){ draw(); if(!v.paused && !v.ended) v.requestVideoFrameCallback(loopV); }
    function start(){ if(rvfc){ v.requestVideoFrameCallback(loopV); } else if(!raf){ raf = requestAnimationFrame(loopRaf); } }
    v.addEventListener('play', start);
    v.addEventListener('playing', function(){ draw(); start(); });
    v.addEventListener('seeked', draw);
    v.addEventListener('loadeddata', draw);
    v.addEventListener('emptied', function(){ if(ctx) ctx.clearRect(0,0,c.width,c.height); });
    // 영상이 지워지면 canvas도 지운다
    var parentMo = new MutationObserver(function(){ if(!v.isConnected){ c.remove(); parentMo.disconnect(); } });
    if(v.parentNode) parentMo.observe(v.parentNode, {childList:true});
    if(!v.paused) start(); else draw();
  }

  function handle(v){ harden(v); if(MIRROR){ cloneCss(); mirror(v); } }
  function scan(root){
    if(root.tagName === 'VIDEO') handle(root);
    if(root.querySelectorAll){ var l = root.querySelectorAll('video'); for(var i=0;i<l.length;i++) handle(l[i]); }
  }
  function boot(){
    scan(document);
    new MutationObserver(function(ms){
      for(var i=0;i<ms.length;i++){ var a = ms[i].addedNodes; for(var j=0;j<a.length;j++){ if(a[j].nodeType===1) scan(a[j]); } }
    }).observe(document.documentElement, {childList:true, subtree:true});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
