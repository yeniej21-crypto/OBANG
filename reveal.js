/* 결과 공개 연출 (모든 메뉴 공통)
   결과 화면(#sOut·#sRep·#sRs)이 켜지면: 카드가 스크롤에 맞춰 차례로 떠오르고, 원국 여덟 글자가 도장 찍히듯 내려앉고, 점수가 0부터 올라간다. */
(()=>{
  if(!('IntersectionObserver' in window)) return;
  try{ if(matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
  const st=document.createElement('style'); st.textContent=`
.rvB{opacity:0;transform:translateY(18px);transition:opacity .55s ease var(--rd,0ms),transform .75s cubic-bezier(.2,.8,.2,1) var(--rd,0ms)}
.rvB.in{opacity:1;transform:none}
.rvG{display:inline-block;opacity:0;transform:scale(1.7);filter:blur(5px);transition:opacity .3s ease var(--gd,0ms),transform .55s cubic-bezier(.3,1.5,.5,1) var(--gd,0ms),filter .4s ease var(--gd,0ms)}
.rvG.in{opacity:1;transform:none;filter:none}`; document.head.appendChild(st);
  const IDS=['sOut','sRep','sRs'];
  const fixed=c=>{ const p=getComputedStyle(c).position; return p==='absolute'||p==='fixed'||p==='sticky'; };
  function blocks(s){ const w=s.querySelector(':scope > .rep, :scope > .wrap, :scope > .rs')||s;
    return [...w.children].filter(c=>!/^(SCRIPT|STYLE|CANVAS)$/.test(c.tagName)&&!c.classList.contains('top')&&!fixed(c)); }
  function countUp(el){ const tn=[...el.childNodes].find(n=>n.nodeType===3&&/\d/.test(n.textContent)); if(!tn||el._cu) return; const to=parseInt(tn.textContent,10); if(!(to>0)) return;
    el._cu=1; const t0=performance.now()+450; const f=t=>{ const p=Math.max(0,Math.min(1,(t-t0)/1300)); tn.textContent=Math.round(to*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(f); else el._cu=0; }; tn.textContent='0'; requestAnimationFrame(f); }
  function run(s){ const bl=blocks(s); if(!bl.length) return;
    let batch=0, bt=0;
    const io=new IntersectionObserver(es=>{ const now=performance.now(); if(now-bt>250){ batch=0; } bt=now;
      es.forEach(e=>{ if(!e.isIntersecting) return; const b=e.target; b.style.setProperty('--rd',(batch++*90)+'ms'); b.classList.add('in'); io.unobserve(b);
        b.querySelectorAll('.rvG').forEach(g=>g.classList.add('in')); }); },{threshold:.06});
    bl.forEach(b=>{ b.classList.remove('in'); b.classList.add('rvB'); b.style.removeProperty('--rd'); io.observe(b); });
    /* 원국 여덟 글자: 시주부터 도장 찍히듯 */
    s.querySelectorAll('.ms .ch').forEach((g,i)=>{ g.classList.remove('in'); g.classList.add('rvG'); g.style.setProperty('--gd',(380+(i%4)*120+Math.floor(i/4)*60)+'ms'); });
    s.querySelectorAll('#ySc,[data-cnt]').forEach(countUp);
    /* 안전장치: 관찰이 막힌 환경(인쇄·캡처)에서 안 보이는 채로 남지 않게 */
    setTimeout(()=>{ bl.forEach(b=>{ const r=b.getBoundingClientRect(); if(r.top<innerHeight&&r.bottom>0&&!b.classList.contains('in')){ b.classList.add('in'); b.querySelectorAll('.rvG').forEach(g=>g.classList.add('in')); } }); },2200); }
  function watch(){ IDS.forEach(id=>{ const s=document.getElementById(id); if(!s) return;
    let was=s.classList.contains('on'); if(was) setTimeout(()=>run(s),40);
    new MutationObserver(()=>{ const on=s.classList.contains('on'); if(on&&!was) setTimeout(()=>run(s),40); was=on; }).observe(s,{attributes:true,attributeFilter:['class']}); }); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',watch); else watch();
})();
