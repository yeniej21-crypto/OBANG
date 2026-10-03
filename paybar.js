/* 결제 뒤 아래 고정 버튼: 상세 풀이가 화면에 들어오면 숨기고, 그보다 위에 있을 때만 '상세 풀이로 가기'를 보여 준다 */
(function(){
function init(){ const pay=document.getElementById('pay'), prem=document.getElementById('prem'); if(!pay||!prem) return;
  const sc=prem.closest('.scr')||null, tgt=sc||window; let raf=0;
  const upd=()=>{ raf=0; if(!pay.classList.contains('done')||prem.hidden){ pay.style.transform=''; return; }
    const r=prem.getBoundingClientRect(), vb=sc?sc.getBoundingClientRect().bottom:innerHeight; pay.style.transform=(r.top<vb-90)?'translateY(115%)':''; };
  tgt.addEventListener('scroll',()=>{ if(!raf) raf=requestAnimationFrame(upd); },{passive:true});
  new MutationObserver(()=>{ if(!raf) raf=requestAnimationFrame(upd); }).observe(pay,{attributes:true,attributeFilter:['class']}); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
