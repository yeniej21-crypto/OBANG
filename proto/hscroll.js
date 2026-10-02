/* PC(마우스)에서 가로 스크롤 줄을 움직이게: 끌어서 넘기기 + 좌우 화살표 버튼 + 가로 휠(트랙패드)
   터치 기기에서는 아무것도 바꾸지 않는다. */
(function(){
  const SEL='.hRow,.chRow,.chMini,.cRow,.oRow,.fzRow,.hs,.pills,.du,.yrRow,.fl,.atabs,.pk-tabs';
  const ARROW='.hRow,.chRow,.chMini,.cRow,.oRow,.fzRow,.hs';
  const fine=window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const css=`.hsW{position:relative}
.hsB{position:absolute;top:50%;z-index:6;width:40px;height:40px;margin-top:-20px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(18,16,20,.78);color:#fff;display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 6px 18px rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s}
.hsB svg{width:18px;height:18px}
.hsB.l{left:6px}.hsB.r{right:6px}
.hsB.on{opacity:.9;pointer-events:auto}.hsW:hover .hsB.on{opacity:1}
.hsB:hover{transform:scale(1.08)}
.hsDrag{cursor:grab}.hsDrag.hsNow{cursor:grabbing;scroll-snap-type:none!important;scroll-behavior:auto!important}
.hsDrag.hsNow *{pointer-events:none}`;
  function init(){
    if(!fine) return;
    const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
    document.querySelectorAll(SEL).forEach(el=>{
      if(el.dataset.hs) return; el.dataset.hs=1; el.classList.add('hsDrag');
      /* drag */
      let down=false,sx=0,sl=0,moved=false;
      el.addEventListener('pointerdown',e=>{ if(e.pointerType!=='mouse'||e.button!==0) return; down=true; moved=false; sx=e.clientX; sl=el.scrollLeft; });
      window.addEventListener('pointermove',e=>{ if(!down) return; const dx=e.clientX-sx; if(!moved&&Math.abs(dx)>6){ moved=true; el.classList.add('hsNow'); } if(moved){ el.scrollLeft=sl-dx; e.preventDefault(); } });
      window.addEventListener('pointerup',()=>{ if(!down) return; down=false; if(moved){ el.classList.remove('hsNow'); snap(el); setTimeout(()=>moved=false,0); } });
      el.addEventListener('click',e=>{ if(moved){ e.preventDefault(); e.stopPropagation(); } },true);
      el.addEventListener('dragstart',e=>e.preventDefault());
      /* arrows */
      if(!el.matches(ARROW)) return;
      const w=document.createElement('div'); w.className='hsW'; el.parentNode.insertBefore(w,el); w.appendChild(el);
      const mk=(c,d)=>{ const b=document.createElement('button'); b.type='button'; b.className='hsB '+c; b.setAttribute('aria-label',c==='l'?'이전':'다음'); b.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${c==='l'?'M15 18l-6-6 6-6':'M9 6l6 6-6 6'}"/></svg>`; b.onclick=e=>{ e.stopPropagation(); const step=Math.max(160,el.clientWidth*.75); el.scrollBy({left:d*step,behavior:'smooth'}); }; w.appendChild(b); return b; };
      const L=mk('l',-1), R=mk('r',1);
      const upd=()=>{ const max=el.scrollWidth-el.clientWidth; L.classList.toggle('on',el.scrollLeft>4); R.classList.toggle('on',el.scrollLeft<max-4); };
      el.addEventListener('scroll',upd,{passive:true}); w.addEventListener('mouseenter',upd); window.addEventListener('resize',upd); setTimeout(upd,300); setTimeout(upd,1500); upd(); new MutationObserver(()=>setTimeout(upd,60)).observe(el,{childList:true}); el.querySelectorAll('img').forEach(i=>i.addEventListener('load',upd));
    });
  }
  function snap(el){ /* 끌기 후 가장 가까운 카드에 맞춤 */
    if(getComputedStyle(el).scrollSnapType.indexOf('x')<0) return;
    const kids=[...el.children]; if(!kids.length) return; const pad=parseFloat(getComputedStyle(el).paddingLeft)||0;
    let best=0,bd=1e9; kids.forEach(k=>{ const d=Math.abs(k.offsetLeft-pad-el.scrollLeft); if(d<bd){ bd=d; best=k.offsetLeft-pad; } });
    el.scrollTo({left:best,behavior:'smooth'});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
  window.HScroll={init};
})();
