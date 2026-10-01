/* Depth3D — 살아 있는 일러스트.
   그림 + 깊이 지도(X_d.jpg)를 WebGL로 그려서, 폰을 기울이거나 손가락·마우스를 움직이면 가까운 것과 먼 것이 다르게 움직인다(3D 사진).
   가만히 있어도 아주 천천히 숨 쉬듯 흔들린다. WebGL이 안 되면 원래 배경 이미지가 그대로 보인다.
   사용: Depth3D.mount(el, {src:'img/seoha.jpg', pos:[.5,.2], str:1})  또는  <div data-d3="img/seoha.jpg" data-d3pos=".5 .2">
        Depth3D.auto(root)  — data-d3 요소를 화면에 보일 때만 켠다(동시에 최대 8개). */
(function(){
  const VS='attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;v.y=1.-v.y;gl_Position=vec4(p,0.,1.);}';
  const FS=`precision mediump float;varying vec2 v;uniform sampler2D I,D;uniform vec2 sc,of,m;uniform float st,fo,z,rv;uniform vec3 rc;
  void main(){ vec2 c=vec2(.5); vec2 uv=(v-c)/z+c; uv=uv*sc+of;
    vec2 o=m*st; vec2 q=uv; for(int i=0;i<5;i++){ float d=texture2D(D,q).r; q=uv+o*(d-fo); }
    vec4 col=texture2D(I,clamp(q,0.001,.999));
    if(rv>-.5){ float d=texture2D(D,q).r; float e=smoothstep(rv-.015,rv+.07,d); float rim=smoothstep(.09,0.,abs(d-rv))*step(rv,1.02); col.rgb=col.rgb*e+rc*rim*1.6*(1.-e*.5); }
    gl_FragColor=col; }`;
  (function(){ const st=document.createElement('style'); st.textContent='.d3on::before,.d3on::after{z-index:1}'+'.hsh{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:3;mix-blend-mode:color-dodge;opacity:.5;background:linear-gradient(115deg,rgba(255,255,255,0) 32%,rgba(255,214,140,.55) 44%,rgba(255,250,235,.85) 50%,rgba(255,190,120,.5) 56%,rgba(255,255,255,0) 68%);background-size:260% 260%;background-position:var(--sx,50%) var(--sy,50%)}'+'.hgl{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:3;mix-blend-mode:overlay;background:radial-gradient(circle at var(--gx,50%) var(--gy,30%),rgba(255,255,255,.55),rgba(255,255,255,0) 55%)}'+'.hedge{box-shadow:0 1px 0 #6b5327,0 2px 0 #5a4520,0 3px 0 #4a381a,0 4px 0 #3a2c14,0 18px 40px rgba(0,0,0,.6)!important}'; (document.head||document.documentElement).appendChild(st); })();
  /* 세계관 통일: 모든 화면에 같은 필름 질감(그레인), 화면 들어올 때 어둠에서 떠오르고 나갈 때 어둠으로 */
  (function(){ try{
    const c=document.createElement('canvas'); c.width=c.height=160; const x=c.getContext('2d'), d=x.createImageData(160,160);
    for(let i=0;i<d.data.length;i+=4){ const v=Math.random()*255|0; d.data[i]=d.data[i+1]=d.data[i+2]=v; d.data[i+3]=255; } x.putImageData(d,0,0);
    const url=c.toDataURL('image/png'), st=document.createElement('style');
    st.textContent='@view-transition{navigation:auto}'+
      '.obGrain{position:fixed;inset:-50%;z-index:2147480000;pointer-events:none;opacity:.055;mix-blend-mode:overlay;background:url('+url+');animation:obG 1s steps(6) infinite}'+
      '@keyframes obG{0%{transform:translate(0,0)}20%{transform:translate(-3%,2%)}40%{transform:translate(2%,-3%)}60%{transform:translate(-2%,-1%)}80%{transform:translate(3%,3%)}100%{transform:translate(0,0)}}'+
      '.stage{animation:obIn .5s ease-out backwards}@keyframes obIn{from{opacity:0;filter:brightness(.4)}}'+
      'html.obOut .stage{opacity:0;transition:opacity .22s ease-in}'+
      '@media (prefers-reduced-motion:reduce){.obGrain{animation:none}}';
    (document.head||document.documentElement).appendChild(st);
    const add=()=>{ if(document.querySelector('.obGrain')) return; const g=document.createElement('div'); g.className='obGrain'; document.body.appendChild(g); };
    if(document.body) add(); else document.addEventListener('DOMContentLoaded',add);
    window.addEventListener('beforeunload',()=>document.documentElement.classList.add('obOut'));
    window.addEventListener('pageshow',()=>document.documentElement.classList.remove('obOut'));
  }catch(e){} })();
  const S={x:0,y:0,tx:0,ty:0,gyro:false,gx:0,gy:0,pointer:false,t0:performance.now()};
  const list=new Set(), holos=new Map(); let raf=0;
  /* 입력: 마우스/손가락 위치, 기울기 */
  window.addEventListener('pointermove',e=>{ S.pointer=true; S.px=(e.clientX/innerWidth)*2-1; S.py=(e.clientY/innerHeight)*2-1; S.pt=performance.now(); },{passive:true});
  function onOri(e){ if(e.gamma==null) return; if(S.b0==null){ S.b0=e.beta; S.g0=e.gamma; } S.gyro=true; S.gx=Math.max(-1,Math.min(1,(e.gamma-S.g0)/15)); S.gy=Math.max(-1,Math.min(1,(e.beta-S.b0)/15)); S.b0+=(e.beta-S.b0)*.004; S.g0+=(e.gamma-S.g0)*.004; }
  function enableGyro(){ try{ const D=window.DeviceOrientationEvent; if(D&&typeof D.requestPermission==='function'){ D.requestPermission().then(r=>{ if(r==='granted') window.addEventListener('deviceorientation',onOri); }).catch(()=>{}); } else window.addEventListener('deviceorientation',onOri); }catch(e){} }
  /* iOS는 첫 탭에서 권한을 물어야 한다 */
  window.addEventListener('pointerdown',function once(){ enableGyro(); window.removeEventListener('pointerdown',once,true); },true);
  function tick(now){ raf=0; if(!list.size&&!holos.size) return;
    const t=(now-S.t0)/1000; let tx=Math.sin(t*.42)*.45, ty=Math.sin(t*.31+1)*.28; /* 숨쉬기 */
    if(S.gyro){ tx=S.gx; ty=S.gy; } else if(S.pointer&&now-S.pt<2500){ tx=S.px*.9; ty=S.py*.6; }
    S.x+=(tx-S.x)*.06; S.y+=(ty-S.y)*.06;
    list.forEach(r=>r.draw(t)); holos.forEach(h=>h(t)); raf=requestAnimationFrame(tick); }
  const kick=()=>{ if(!raf) raf=requestAnimationFrame(tick); };
  const load=src=>new Promise((ok,no)=>{ const i=new Image(); i.decoding='async'; i.onload=()=>ok(i); i.onerror=no; i.src=src; });
  const dsrc=src=>src.replace(/\.(jpg|jpeg|png)(\?.*)?$/i,'_d.jpg');
  async function mount(el,o){ if(el._d3) return el._d3; o=o||{}; const src=o.src; if(!src) return null;
    const cv=document.createElement('canvas'); cv.className='d3c'; cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;transition:opacity .6s;z-index:0;border-radius:inherit';
    const gl=cv.getContext('webgl',{alpha:false,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:false}); if(!gl) return null;
    const rec={el,cv,gl,dead:false,ox:0,oy:0,t0:0}; el._d3=rec;
    let img,dep; try{ [img,dep]=await Promise.all([load(src),load(o.depth||dsrc(src))]); }catch(e){ el._d3=null; return null; }
    if(rec.dead) return null;
    const sh=(t,s)=>{ const x=gl.createShader(t); gl.shaderSource(x,s); gl.compileShader(x); return x; };
    const pg=gl.createProgram(); gl.attachShader(pg,sh(gl.VERTEX_SHADER,VS)); gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,FS)); gl.linkProgram(pg); if(!gl.getProgramParameter(pg,gl.LINK_STATUS)){ el._d3=null; return null; } gl.useProgram(pg);
    const b=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,b); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const lp=gl.getAttribLocation(pg,'p'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
    const tex=(u,im)=>{ const t=gl.createTexture(); gl.activeTexture(gl.TEXTURE0+u); gl.bindTexture(gl.TEXTURE_2D,t); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,im); };
    tex(0,img); tex(1,dep); gl.uniform1i(gl.getUniformLocation(pg,'I'),0); gl.uniform1i(gl.getUniformLocation(pg,'D'),1);
    const U={rv:gl.getUniformLocation(pg,'rv'),rc:gl.getUniformLocation(pg,'rc'),sc:gl.getUniformLocation(pg,'sc'),of:gl.getUniformLocation(pg,'of'),m:gl.getUniformLocation(pg,'m'),st:gl.getUniformLocation(pg,'st'),fo:gl.getUniformLocation(pg,'fo'),z:gl.getUniformLocation(pg,'z')};
    const pos=o.pos||[.5,.5], str=(o.str||1)*.037, focus=o.focus==null?.55:o.focus, zoom=o.zoom||1.065;
    gl.uniform1f(U.st,str); gl.uniform1f(U.fo,focus);
    /* 깊이 순서로 나타나기: 가까운 것부터 빛의 테두리를 따라 그려진다 */
    let rvv=o.reveal?1.12:-1, rvA=null; const rcol=o.revealColor||[1,.8,.45]; gl.uniform3f(U.rc,rcol[0],rcol[1],rcol[2]);
    rec.reveal=(ms=2200)=>new Promise(ok=>{ rvA={t0:performance.now(),ms,ok}; });
    let W=0,H=0;
    rec.draw=t=>{ if(rec.dead) return; const r=el.getBoundingClientRect(), dpr=Math.min(2,devicePixelRatio||1), w=Math.round(r.width*dpr), h=Math.round(r.height*dpr); if(!w||!h) return;
      if(w!==W||h!==H){ W=w; H=h; cv.width=w; cv.height=h; gl.viewport(0,0,w,h);
        const ia=img.width/img.height, ea=w/h; let sx=1,sy=1; if(ia>ea) sx=ea/ia; else sy=ia/ea; /* cover */
        gl.uniform2f(U.sc,sx,sy); gl.uniform2f(U.of,(1-sx)*pos[0],(1-sy)*pos[1]); }
      if(rvA){ const k=Math.min(1,(performance.now()-rvA.t0)/rvA.ms); rvv=1.12-(1.12+.15)*(1-Math.pow(1-k,2.2)); if(k>=1){ rvv=-1; const f=rvA.ok; rvA=null; f(); } }
      /* 스크롤·스와이프 연동: 화면(스테이지) 중앙에서 얼마나 떨어져 있는지로 시점이 움직인다 */
      const sr=(document.querySelector('.stage')||document.documentElement).getBoundingClientRect();
      const cx=Math.max(-1.3,Math.min(1.3,((r.left+r.width/2)-(sr.left+sr.width/2))/(sr.width/2)));
      const cy=Math.max(-1.3,Math.min(1.3,((r.top+r.height/2)-(sr.top+sr.height/2))/(sr.height/2)));
      rec.ox+=(cx*.85-rec.ox)*.18; rec.oy+=(cy*.75-rec.oy)*.18;
      /* 등장 연출: 처음 나타날 때 카메라가 스르륵 밀려 들어간다 */
      const k=Math.min(1,(performance.now()-rec.t0)/1900), e=1-Math.pow(1-k,3), ent=1-e;
      const mx=Math.max(-1.25,Math.min(1.25,S.x*.8+rec.ox+ent*1.1)), my=Math.max(-1.25,Math.min(1.25,S.y*.8+rec.oy-ent*.55));
      gl.uniform1f(U.rv,rvv); gl.uniform2f(U.m,mx,my); gl.uniform1f(U.z,zoom+ent*.07+Math.sin(t*.5)*.006); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); };
    if(getComputedStyle(el).position==='static') el.style.position='relative';
    [...el.children].forEach(c=>{ const cs=getComputedStyle(c); if(cs.position==='static') c.style.position='relative'; const z=parseInt(cs.zIndex); if(isNaN(z)||z<2) c.style.zIndex=2; }); /* 글자·배지가 그라데이션(::after)에 가려 흐려지지 않게 */ el.insertBefore(cv,el.firstChild); el.classList.add('d3on'); rec.t0=performance.now(); list.add(rec); kick(); requestAnimationFrame(()=>requestAnimationFrame(()=>cv.style.opacity=1));
    return rec; }
  function unmount(el){ const r=el._d3; if(!r) return; r.dead=true; list.delete(r); try{ r.gl.getExtension('WEBGL_lose_context')?.loseContext(); }catch(e){} r.cv.remove(); el.classList.remove('d3on'); el._d3=null; }
  /* data-d3 요소 자동 관리: 화면에 들어오면 켜고, 나가면 끈다 */
  const MAX=8; let io=null;
  function auto(root){ root=root||document; const els=[...root.querySelectorAll('[data-d3]')]; if(!('IntersectionObserver' in window)) return;
    io=io||new IntersectionObserver(es=>{ es.forEach(e=>{ const el=e.target; if(e.isIntersecting){ if(list.size>=MAX) return; const p=(el.dataset.d3pos||'.5 .5').split(/\s+/).map(Number); mount(el,{src:el.dataset.d3,pos:p,str:+(el.dataset.d3str||1),focus:el.dataset.d3focus==null?undefined:+el.dataset.d3focus}); } else unmount(el); }); },{rootMargin:'80px'});
    els.forEach(el=>io.observe(el)); }
  /* 배경 이미지가 깔린 요소들을 그대로 3D로: CSS background-image/position을 읽어 data-d3를 채운다 */
  function fromBg(sel,root,opt){ opt=opt||{}; (root||document).querySelectorAll(sel).forEach(el=>{ if(el.classList.contains('vOn')) return; const cs=getComputedStyle(el), m=/url\(["']?([^"')]+)["']?\)/.exec(cs.backgroundImage||''); if(!m) return; if(el.dataset.d3===m[1]) return; if(el.dataset.d3){ unmount(el); }
      const u=m[1];
      const px=cs.backgroundPosition.split(' ').map(v=>v.endsWith('%')?parseFloat(v)/100:(v==='center'?.5:.5));
      el.dataset.d3=u; el.dataset.d3pos=(px[0]??.5)+' '+(px[1]??.5); if(opt.str) el.dataset.d3str=opt.str; if(opt.focus!=null) el.dataset.d3focus=opt.focus; });
    auto(root); }
  /* 홀로 카드: 기울이면 카드가 3D로 기울고, 금박 광택과 반사광이 흐른다.
     holo(el, {tilt:true, face:el})  tilt=false면 광택만(길쭉한 카드 상단 등). 끌 때 unholo(el). */
  function holo(el,o){ o=o||{}; if(holos.has(el)) return; const face=o.face||el;
    const sh=document.createElement('i'); sh.className='hsh'; const gl=document.createElement('i'); gl.className='hgl'; face.appendChild(sh); face.appendChild(gl);
    if(getComputedStyle(face).position==='static') face.style.position='relative';
    if(o.tilt!==false) el.classList.add('hedge');
    const max=o.max||14;
    const f=t=>{ const x=S.x, y=S.y; face.style.setProperty('--sx',(50+x*38)+'%'); face.style.setProperty('--sy',(50+y*38)+'%'); face.style.setProperty('--gx',(50+x*45)+'%'); face.style.setProperty('--gy',(35+y*40)+'%');
      if(o.tilt!==false) el.style.transform=`perspective(900px) rotateY(${x*max}deg) rotateX(${-y*max*.8}deg)`; };
    f._parts=[sh,gl]; f._tilt=o.tilt!==false; holos.set(el,f); kick(); }
  function unholo(el){ const f=holos.get(el); if(!f) return; holos.delete(el); f._parts.forEach(p=>p.remove()); if(f._tilt){ el.style.transform=''; el.classList.remove('hedge'); } }
  /* 처음 한 번: '기울여 봐' 안내 (이 효과가 후킹 포인트라 눈치채게) */
  let hinted=false;
  function hint(){ if(hinted) return; hinted=true; try{ if(sessionStorage.getItem('d3hint')) return; sessionStorage.setItem('d3hint','1'); }catch(e){}
    const touch=matchMedia('(pointer:coarse)').matches, root=document.querySelector('.stage')||document.body, h=document.createElement('div');
    h.textContent=touch?'📱 폰을 살짝 기울여 봐 · 그림이 살아 움직여':'마우스를 움직여 봐 · 그림이 살아 움직여';
    h.style.cssText='position:absolute;left:50%;top:calc(env(safe-area-inset-top,0px) + 62px);transform:translate(-50%,-6px);z-index:2147480001;padding:9px 15px;border-radius:999px;background:rgba(10,8,12,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(243,215,155,.45);color:#f3d79b;font:700 12.5px/1.2 "Noto Sans KR",sans-serif;white-space:nowrap;opacity:0;transition:all .5s;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,.4)';
    root.appendChild(h); requestAnimationFrame(()=>{ h.style.opacity=1; h.style.transform='translate(-50%,0)'; });
    setTimeout(()=>{ h.style.opacity=0; setTimeout(()=>h.remove(),600); },3800); }
  /* 동적으로 생기는 그림도 자동으로: 선택자에 맞는 요소가 생기거나 그림이 바뀌면 다시 확인 */
  function watch(sel,opt){ let t=0; const run=()=>{ t=0; fromBg(sel,document,opt); }; run(); new MutationObserver(()=>{ if(!t) t=setTimeout(run,250); }).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']}); }
  /* 가려져 있다가 드러날 때(메뉴 인트로가 끝날 때 등) 등장 연출을 다시 */
  function replay(){ const n=performance.now(); list.forEach(r=>r.t0=n); kick(); }
  window.Depth3D={mount,unmount,auto,fromBg,watch,enableGyro,holo,unholo,replay};
})();
