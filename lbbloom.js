/* 오방도감 꽃 그림 도구 (도화 사주 · 도화 궁합 공용) — 복숭아꽃 한 송이 · 가늘어지는 가지 · 그라데이션 정의
   LBB.bloom(x,y,r,st,{hong,rot,op}) : st 0 봉오리 · 1 움트는 봉오리 · 2 반쯤 핌 · 3 핌 · 4 만개 (SVG 문자열)
   LBB.limb([p0,p1,p2,p3],w0,w1,N) : 3차 곡선을 따라 굵기가 줄어드는 가지 {pts,d,svg}
   그라데이션은 문서에 한 번만 넣는다(숨긴 svg 안의 정의는 그려지지 않아서 0 크기로 둔다). */
(function(){
const f1=n=>(+n).toFixed(1);
function defs(){ if(document.getElementById('lbbDefs')) return; const d=document.createElement('div'); d.innerHTML=`<svg id="lbbDefs" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>
 <linearGradient id="lbbPet" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#df8a76"/><stop offset=".42" stop-color="#f4c1b2"/><stop offset="1" stop-color="#fdece5"/></linearGradient>
 <linearGradient id="lbbHong" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#9e2b21"/><stop offset=".45" stop-color="#cf5444"/><stop offset="1" stop-color="#f2a594"/></linearGradient>
 <linearGradient id="lbbBud" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#d27a66"/><stop offset="1" stop-color="#f3b9a9"/></linearGradient>
 <radialGradient id="lbbGlow"><stop offset="0" stop-color="#fffdf7" stop-opacity=".95"/><stop offset="1" stop-color="#fffdf7" stop-opacity="0"/></radialGradient></defs></svg>`; document.body.appendChild(d.firstChild); }
if(document.body) defs(); else document.addEventListener('DOMContentLoaded',defs);
function petal(L,W){ return `M0 0C${f1(-W*.95)} ${f1(-L*.2)} ${f1(-W*1.08)} ${f1(-L*.8)} ${f1(-W*.4)} ${f1(-L)}Q0 ${f1(-L*.86)} ${f1(W*.4)} ${f1(-L)}C${f1(W*1.08)} ${f1(-L*.8)} ${f1(W*.95)} ${f1(-L*.2)} 0 0Z`; }
function bloom(x,y,r,st,o){ o=o||{}; const rot=o.rot||0, op=o.op==null?1:o.op; let g='';
  if(st<=1){ const h=r*(st?1.5:1.3), w=r*(st?.62:.5);
    g=`<path d="M0 0C${f1(-w*1.2)} ${f1(-h*.3)} ${f1(-w)} ${f1(-h*.85)} 0 ${f1(-h)}C${f1(w)} ${f1(-h*.85)} ${f1(w*1.2)} ${f1(-h*.3)} 0 0Z" fill="url(#lbbBud)" stroke="#c2573f" stroke-opacity=".45" stroke-width=".8"/>`;
    if(st) g+=`<path d="M0 ${f1(-h*.15)}Q${f1(-w*.2)} ${f1(-h*.6)} ${f1(-w*.55)} ${f1(-h*.92)}M0 ${f1(-h*.15)}Q${f1(w*.2)} ${f1(-h*.6)} ${f1(w*.55)} ${f1(-h*.92)}" fill="none" stroke="#fdece5" stroke-width=".9"/>`;
    g+=`<path d="M0 1.5C${f1(-w*.9)} ${f1(-h*.05)} ${f1(-w*.9)} ${f1(-h*.3)} ${f1(-w*.25)} ${f1(-h*.34)}L0 ${f1(-h*.12)}L${f1(w*.25)} ${f1(-h*.34)}C${f1(w*.9)} ${f1(-h*.3)} ${f1(w*.9)} ${f1(-h*.05)} 0 1.5Z" fill="#7d5a43"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot})" opacity="${op}">${g}</g>`; }
  const half=st===2, L=r*(half?.86:st===3?.95:1.04), W=L*(half?.5:.62), fill=o.hong?'url(#lbbHong)':'url(#lbbPet)', sk=o.hong?'#8f2219':'#c2573f';
  if(half){ [[-34,.9],[34,.9],[0,1]].forEach(([a,k])=>{ g+=`<path d="${petal(L*k,L*.56)}" transform="rotate(${a})" fill="${fill}" stroke="${sk}" stroke-opacity=".5" stroke-width=".7"/>`; });
    g+=`<path d="M0 2C${f1(-r*.5)} 1 ${f1(-r*.55)} ${f1(-r*.3)} ${f1(-r*.2)} ${f1(-r*.34)}L0 ${f1(-r*.14)}L${f1(r*.2)} ${f1(-r*.34)}C${f1(r*.55)} ${f1(-r*.3)} ${f1(r*.5)} 1 0 2Z" fill="#7d5a43"/>`; }
  else { for(let k=0;k<5;k++){ const a=k*72; g+=`<path d="${petal(L,W)}" transform="rotate(${a})" fill="${fill}" stroke="${sk}" stroke-opacity=".5" stroke-width=".7"/><path d="M0 ${f1(-L*.3)}L0 ${f1(-L*.72)}" transform="rotate(${a})" stroke="#fff" stroke-opacity=".45" stroke-width=".7"/>`; }
    const cr=r*.2; g+=`<circle r="${f1(cr*1.7)}" fill="${o.hong?'#7e1d15':'#c9604a'}" opacity=".3"/>`;
    if(st===4) for(let k=0;k<12;k++){ const a=(k*30+8)*Math.PI/180, l=r*(.42+(k%2)*.12), ex=f1(Math.cos(a)*l), ey=f1(Math.sin(a)*l); g+=`<line x1="0" y1="0" x2="${ex}" y2="${ey}" stroke="${o.hong?'#7e1d15':'#a5442f'}" stroke-width=".8"/><circle cx="${ex}" cy="${ey}" r="1.3" fill="#c8955a"/>`; }
    g+=`<circle r="${f1(cr)}" fill="${o.hong?'#7e1d15':'#b14a35'}"/>`; }
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot})" opacity="${op}">${g}</g>`; }
function cub(a,b,c,d,t){ const u=1-t; return [u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]]; }
function limb(P,w0,w1,N,col){ N=N||48; const pts=[]; for(let i=0;i<=N;i++) pts.push(cub(P[0],P[1],P[2],P[3],i/N)); const A=[],B=[];
  pts.forEach((p,i)=>{ const q=pts[Math.min(N,i+1)], o=pts[Math.max(0,i-1)], dx=q[0]-o[0], dy=q[1]-o[1], l=Math.hypot(dx,dy)||1, nx=-dy/l, ny=dx/l, w=(w0+(w1-w0)*(i/N))/2; A.push([p[0]+nx*w,p[1]+ny*w]); B.push([p[0]-nx*w,p[1]-ny*w]); });
  const d='M'+A.map(p=>f1(p[0])+' '+f1(p[1])).join('L')+'L'+B.reverse().map(p=>f1(p[0])+' '+f1(p[1])).join('L')+'Z';
  return {pts,d,svg:`<path d="${d}" fill="${col||'#5b4535'}"/><path d="${'M'+A.map(p=>f1(p[0])+' '+f1(p[1]-.6)).join('L')}" fill="none" stroke="#a88b70" stroke-opacity=".55" stroke-width=".9"/>`}; }
const nearX=(pts,x)=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b,pts[0]);
window.LBB={bloom,limb,cub,nearX,petal,defs,f1};
})();
