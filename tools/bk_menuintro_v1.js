/* MenuIntro — 메뉴에 들어오면 캐릭터가 4~6초 한마디 하고 본 화면으로 넘어가는 짧은 인트로.
   소리 정책: 먼저 소리 켠 채 재생을 시도하고, 브라우저가 막으면 무음+자막으로 재생하면서 "탭하면 목소리" 버튼을 띄운다.
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
.mi .snd{position:absolute;left:50%;top:calc(env(safe-area-inset-top,0px) + 50px);transform:translateX(-50%);display:none;align-items:center;gap:7px;border:1px solid rgba(255,255,255,.35);background:rgba(0,0,0,.45);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;font:700 13px/1 'Noto Sans KR',sans-serif;border-radius:999px;padding:9px 14px;cursor:pointer;animation:miPulse 1.6s ease-in-out infinite}
.mi .snd.on{display:flex}
@keyframes miPulse{50%{box-shadow:0 0 0 6px rgba(255,255,255,.12)}}
.mi .x{position:absolute;right:14px;top:calc(env(safe-area-inset-top,0px) + 14px);border:0;background:none;color:rgba(255,255,255,.7);font:500 12.5px/1 'Noto Sans KR',sans-serif;cursor:pointer;padding:6px}`;
  let done=false;
  function play(o){
    if(done) return; done=true;
    try{ if(sessionStorage.getItem('skipMI')===o.src){ sessionStorage.removeItem('skipMI'); return; } }catch(e){}
    const root=o.root||document.querySelector('.stage')||document.body;
    if(!document.getElementById('miCss')){ const s=document.createElement('style'); s.id='miCss'; s.textContent=css; document.head.appendChild(s); }
    const el=document.createElement('div'); el.className='mi';
    el.innerHTML=`<div class="po" style="background-image:url('${o.poster}')"></div><video playsinline preload="auto" src="${o.src}"></video><div class="sh"></div><div class="who">${o.who||''}</div><div class="sub"></div><div class="tt">${o.title||''}</div><button class="snd" type="button">🔊 탭하면 목소리</button><button class="x" type="button">건너뛰기</button>`;
    root.appendChild(el);
    const v=el.querySelector('video'), sub=el.querySelector('.sub'), snd=el.querySelector('.snd');
    let closed=false, last=-1;
    const close=()=>{ if(closed) return; closed=true; el.classList.add('end'); setTimeout(()=>{ el.classList.add('bye'); setTimeout(()=>el.remove(),650); },o.titleHold||900); try{ v.pause(); }catch(e){} };
    const tick=()=>{ if(closed) return; let i=-1; (o.subs||[]).forEach((c,j)=>{ if(v.currentTime>=c[0]) i=j; }); if(i!==last){ last=i; sub.classList.remove('on'); if(i>=0) setTimeout(()=>{ sub.textContent=o.subs[i][1]; sub.classList.add('on'); },110); } requestAnimationFrame(tick); };
    v.addEventListener('ended',close); v.addEventListener('timeupdate',()=>{ if(o.end&&v.currentTime>=o.end) close(); });
    const start=async()=>{ v.muted=false; try{ await v.play(); }catch(e){ v.muted=true; snd.classList.add('on'); try{ await v.play(); }catch(e2){ close(); return; } } requestAnimationFrame(tick); };
    snd.onclick=e=>{ e.stopPropagation(); v.muted=false; v.currentTime=0; snd.classList.remove('on'); v.play().catch(()=>{}); };
    el.querySelector('.x').onclick=e=>{ e.stopPropagation(); closed=false; close(); };
    el.addEventListener('click',()=>{ if(v.muted){ snd.onclick(new Event('click')); } });
    setTimeout(()=>{ if(!closed&&v.readyState<2) close(); },4000); /* 영상이 늦으면 바로 본 화면 */
    start();
  }
  window.MenuIntro={play};
})();
