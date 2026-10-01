/* MenuIntro — 메뉴에 들어오면 캐릭터가 4~6초 한마디 하고 본 화면으로 넘어가는 짧은 인트로.
   소리 정책: 항상 목소리와 함께 재생한다. 홈에서 메뉴를 누르면 그 탭 안에서 바로 재생(=소리 허용)하고 페이지를 넘긴다.
   페이지를 직접 열어 브라우저가 소리 재생을 막으면, 무음으로 틀지 않고 포스터 위에 "탭해서 시작"을 띄워 한 번 누르면 목소리로 처음부터 재생한다.
   사용: MenuIntro.play({src:'v/menu/career.mp4', poster:'img/earth.jpg', who:'도준 · 黃龍', title:'커리어 사주', subs:[[0,'스펙 말고,'],[1.4,'타고난 판부터 보자.']]}) */
(function(){
  const css=`.mi{position:absolute;inset:0;z-index:90;background:#000;overflow:hidden;opacity:1;transition:opacity .6s}
.mi.bye{opacity:0;pointer-events:none}
.mi video,.mi .po{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 18%;background:#000 center 18%/cover no-repeat}
.mi .sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45) 0%,rgba(0,0,0,0) 22%,rgba(0,0,0,0) 52%,rgba(0,0,0,.82) 86%)}
.mi .who{position:absolute;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 22px);text-align:center;font:700 11.5px/1 'Noto Sans KR',sans-serif;letter-spacing:.32em;color:rgba(255,236,200,.85);text-shadow:0 1px 8px rgba(0,0,0,.8)}
.mi .sub{position:absolute;left:24px;right:24px;bottom:calc(env(safe-area-inset-bottom,0px) + 150px);text-align:center;font-family:'Song Myung','Noto Serif KR',serif;font-size:23px;line-height:1.5;color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.95),0 0 2px #000;opacity:0;transform:translateY(6px);transition:all .35s}
.mi .sub.on{opacity:1;transform:none}
.mi .tt{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 70px);text-align:center;font-family:'OBrush','Noto Serif KR',serif;font-size:44px;color:#fff;letter-spacing:.02em;text-shadow:0 3px 22px rgba(0,0,0,.9);opacity:0;transform:scale(1.06);transition:all .7s}
.mi.end .tt{opacity:1;transform:none}
.mi .gate{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;gap:16px;border:0;background:rgba(0,0,0,.38);color:#fff;cursor:pointer;font:700 14px/1.4 'Noto Sans KR',sans-serif;letter-spacing:.04em}
.mi .gate.on{display:flex}
.mi .gate i{width:78px;height:78px;border-radius:50%;border:1.5px solid rgba(255,236,200,.8);display:grid;place-items:center;font-style:normal;font-size:26px;padding-left:5px;box-sizing:border-box;background:rgba(0,0,0,.35);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:miPulse 1.6s ease-in-out infinite}
.mi .gate small{font-weight:500;font-size:12px;opacity:.75}
@keyframes miPulse{50%{box-shadow:0 0 0 10px rgba(255,236,200,.14)}}
.mi .x{position:absolute;right:14px;top:calc(env(safe-area-inset-top,0px) + 14px);border:0;background:none;color:rgba(255,255,255,.7);font:500 12.5px/1 'Noto Sans KR',sans-serif;cursor:pointer;padding:6px}`;
  let pageDone=false;
  const abs=u=>{ try{ return new URL(u,location.href).href; }catch(e){ return u; } };
  const unpre=()=>document.documentElement.classList.remove('mi-pre');
  function play(o){
    if(!o.onDone){ if(pageDone) return; pageDone=true; try{ if(location.hash==='#re'||sessionStorage.getItem('obRe')){ unpre(); return; } }catch(e){} try{ if(sessionStorage.getItem('skipMI')===abs(o.src)){ sessionStorage.removeItem('skipMI'); unpre(); return; } }catch(e){} }
    if(document.querySelector('.mi')){ unpre(); return; }
    const root=o.root||document.querySelector('.stage')||document.body;
    if(!document.getElementById('miCss')){ const s=document.createElement('style'); s.id='miCss'; s.textContent=css; document.head.appendChild(s); }
    const el=document.createElement('div'); el.className='mi';
    el.innerHTML=`<div class="po" style="background-image:url('${o.poster}')"></div><video playsinline preload="auto" src="${o.src}"></video><div class="sh"></div><div class="who">${o.who||''}</div><div class="sub"></div><div class="tt">${o.title||''}</div><button class="gate" type="button"><i>▶</i>탭해서 시작<small>🔊 소리를 켜 주세요</small></button><button class="x" type="button">건너뛰기</button>`;
    root.appendChild(el);
    const v=el.querySelector('video'), sub=el.querySelector('.sub'), gate=el.querySelector('.gate');
    let closed=false, last=-1, playing=false, ticking=false;
    const close=()=>{ if(closed) return; closed=true; el.classList.add('end'); try{ v.pause(); }catch(e){}
      if(o.onDone){ setTimeout(o.onDone,o.titleHold||900); return; }
      setTimeout(()=>{ unpre(); el.classList.add('bye'); if(window.Depth3D) Depth3D.replay(); setTimeout(()=>el.remove(),650); },o.titleHold||900); };
    const tick=()=>{ if(closed) return; let i=-1; (o.subs||[]).forEach((c,j)=>{ if(v.currentTime>=c[0]) i=j; }); if(i!==last){ last=i; sub.classList.remove('on'); if(i>=0) setTimeout(()=>{ sub.textContent=o.subs[i][1]; sub.classList.add('on'); },110); } requestAnimationFrame(tick); };
    v.addEventListener('ended',close); v.addEventListener('timeupdate',()=>{ if(o.end&&v.currentTime>=o.end) close(); });
    v.addEventListener('playing',()=>{ if(!ticking){ ticking=true; requestAnimationFrame(tick); } });
    v.addEventListener('error',()=>{ if(!playing) close(); });
    const go=()=>{ v.muted=false; v.volume=1; const p=v.play(); playing=true; gate.classList.remove('on');
      setTimeout(()=>{ if(!closed&&playing&&v.readyState<2&&v.currentTime===0) close(); },6000); /* 영상이 끝내 안 오면 본 화면으로 */
      return p; };
    gate.onclick=e=>{ e.stopPropagation(); try{ v.currentTime=0; }catch(_){} go().catch(()=>{}); };
    el.querySelector('.x').onclick=e=>{ e.stopPropagation(); close(); };
    /* 소리 켠 채로 바로 재생. 브라우저가 막으면(직접 접속 등) 무음 대신 탭 게이트 */
    go().catch(err=>{ playing=false; if(closed) return; if(err&&err.name==='NotAllowedError') gate.classList.add('on'); else close(); });
  }
  /* 메뉴별 인트로 — 다른 화면에서 누를 때 그 탭 안에서 재생하고 넘어가도록 공용으로 둔다 */
  const MAP={
    'today.html':{src:'v/menu/today.mp4',poster:'img/seoha.jpg',who:'서하 · 오늘의 운세',title:'오늘의 운세',subs:[[1.25,'좋은 아침.'],[3.25,'오늘 네 하루, 먼저 펼쳐봤어.']]},
    'career.html':{src:'v/menu/career.mp4',poster:'img/earth.jpg',who:'도준 · 黃龍',title:'커리어 사주',subs:[[0,'스펙 말고,'],[1.8,'타고난 판부터 보자.'],[4.3,'네가 제일 비싸지는 자리.']]},
    'taegil.html':{src:'v/menu/taegil.mp4',poster:'img/taegil.jpg',who:'월하 · 擇日',title:'택일',subs:[[0.9,'그날…'],[2.2,'해도 되는 날일까.'],[4.6,'날은 내가 골라줄게.']]},
    'gunghap.html':{src:'v/menu/gunghap.mp4',poster:'img/taeo/wink.jpg',who:'태오 · 桃花',title:'도화 궁합',subs:[[1.0,'그 사람 생일 알아?'],[3.8,'누나한테 끌리는지 봐줄게.']]},
    'tarot.html':{src:'v/tarot/intro.mp4',poster:'img/tarot/mujin.jpg',who:'무진 · 한밤의 카드방',title:'무진의 타로',subs:[[0.3,'앉아요.'],[2.3,'…카드한테 물어보고 싶은 거,'],[5.1,'하나 있죠?']]},
    'sinnyeon.html':{src:'v/halmae.mp4',poster:'img/halmae.jpg',who:'삼신 할매 · 三神',title:'2027 신년운세',end:6.3,subs:[[0.3,'왔구나.'],[2.1,'…네 내년 열두 달,'],[4.0,'이 할미가 다 봐 뒀다.']]}
  };
  /* go(url): 클릭한 그 순간 인트로를 소리와 함께 틀고, 끝나면 url로 이동(도착 페이지는 같은 인트로를 건너뜀) */
  function go(url,root){ const key=url.split(/[?#]/)[0], m=MAP[key]; if(!m){ location.href=url; return; }
    play(Object.assign({},m,{root:root||document.querySelector('.stage')||document.body,onDone:()=>{ try{ sessionStorage.setItem('skipMI',abs(m.src)); }catch(e){} location.href=url; }})); }
  window.addEventListener('pageshow',e=>{ if(e.persisted) document.querySelectorAll('.mi').forEach(x=>x.remove()); });
  window.MenuIntro={play,go,MAP};
})();
