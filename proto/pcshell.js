/* PC 웹 화면 — 넓은 화면에서 가운데 서비스 화면 + 왼쪽 메뉴 + 오른쪽 안내 칸.
   폰에서는 아무것도 하지 않는다. 모든 페이지에 <script src="pcshell.js" defer> 한 줄로 붙는다. */
(function(){
if(window.__pcshell) return; window.__pcshell=1;
const MQ=matchMedia('(min-width:700px)'), WIDE=matchMedia('(min-width:1060px)');
const file=(location.pathname.split('/').pop()||'index.html'), qs=new URLSearchParams(location.search);
const isHome=!!document.getElementById('home')&&!!document.getElementById('op');
const NAV=[
  ['', [['홈','./','home'],['무료 존','free.html'],['연애 상담소','love.html'],['자유 상담','chat.html']]],
  ['오늘', [['오늘의 운세','today.html'],['오방 뽑기','ppopgi.html'],['부적 카드','bujeok.html']]],
  ['정통 풀이', [['2027 신년 기획전','newyear.html'],['2027 신년운세','sinnyeon.html'],['해와 달의 운세','noeul.html'],['2027 명리 감정서','myeongri.html'],['평생 사주','lifetime.html'],['커리어 사주','career.html'],['택일','taegil.html']]],
  ['연애 · 궁합', [['도화 사주','dohwa.html'],['도화 궁합','gunghap.html'],['오방 궁합','obgh.html'],['재회 사주','love2.html?m=re'],['다음 연애','love2.html?m=next']]],
  ['카드 · 고양이', [['무진의 타로','tarot.html'],['묘당','myodang.html']]]
];
const PICK=[['color','사주 퍼스널컬러','내 오행에 맞는 색'],['food','사주 소울푸드','오미로 보는 내 음식'],['pastus','전생에 우리는','둘의 전생 이야기']];
function active(h){ if(h==='./') return isHome; const [f,q]=h.split('?'); if(f!==file) return false; if(!q) return true; const [k,v]=q.split('='); return qs.get(k)===v; }
function lum(){ const c=getComputedStyle(document.body).backgroundColor.match(/\d+/g)||[0,0,0]; return (0.299*c[0]+0.587*c[1]+0.114*c[2])/255; }
const css=`
html.pcw .stage{height:100%!important;margin:0!important;border-radius:0!important}
html.pcw body{padding:0!important}
.pcs{display:none}
html.pcw.pcx .pcs{display:flex}
.pcs{position:fixed;top:0;bottom:0;z-index:30;flex-direction:column;font-family:"Noto Sans KR",sans-serif;color:var(--pcInk);transition:opacity .5s}
.pcs a{color:inherit;text-decoration:none}
html.pcHide .pcs{opacity:0;pointer-events:none}
.pcNav{right:calc(50% + 254px);width:190px;padding:28px 0 20px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--pcLine) transparent}
.pcLogo{display:flex;align-items:center;gap:10px;margin:0 0 22px;padding:0 14px}
.pcLogo img{width:28px;height:28px}.pcLogo img.lw{width:auto;height:24px}
.pcLogo b{font-family:"Noto Serif KR",serif;font-weight:900;font-size:21px;letter-spacing:-.01em;color:var(--pcHi)}
.pcNav h6{margin:14px 0 3px;padding:0 14px;font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--pcDim)}
.pcNav a{display:block;padding:6px 14px;font-size:14px;font-weight:500;border-left:2px solid transparent;transition:color .2s,background .2s}
.pcNav a:hover{color:var(--pcHi);background:var(--pcHov)}
@media (max-height:760px){.pcNav{padding-top:20px}.pcLogo{margin-bottom:12px}.pcNav h6{margin:10px 0 2px}.pcNav a{padding:4px 14px;font-size:13.5px}}
@media (max-height:640px){.pcNav{padding-top:14px}.pcLogo{margin-bottom:6px}.pcNav h6{margin:8px 0 1px;font-size:10.5px}.pcNav a{padding:3px 14px;font-size:13px}.pcSide{padding-top:20px;gap:18px}}
.pcNav a.on{color:var(--pcGold);border-left-color:var(--pcGold);font-weight:700}
.pcSide{left:calc(50% + 258px);width:248px;padding:34px 0 24px;gap:26px;overflow-y:auto;scrollbar-width:none}
.pcSide::-webkit-scrollbar{display:none}
.pcSide h6{margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--pcDim)}
.pcQr{display:flex;gap:14px;align-items:center}
.pcQr i{flex:none;width:84px;height:84px;background:#fff;padding:6px;box-sizing:border-box;display:block}
.pcQr i svg,.pcQr i img{width:100%!important;height:100%!important;display:block}
.pcQr p{margin:0;font-size:13px;line-height:1.6;color:var(--pcInk)}
.pcQr p b{display:block;color:var(--pcHi);font-size:14px;margin-bottom:2px}
.pcPick a{display:flex;gap:12px;align-items:center;padding:8px 0;border-top:1px solid var(--pcLine)}
.pcPick a:first-of-type{border-top:0}
.pcPick a span{flex:none;width:52px;height:52px;background:#222 center/cover no-repeat}
.pcPick a b{display:block;font-size:14px;color:var(--pcHi);font-weight:700}
.pcPick a small{font-size:12px;color:var(--pcDim)}
.pcPick a:hover b{color:var(--pcGold)}
.pcFoot{margin-top:auto;font-size:11px;line-height:1.7;color:var(--pcDim)}
`;
function build(){
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  const dark=lum()<.5, R=document.documentElement.style;
  const T=dark?{pcInk:'rgba(240,232,220,.66)',pcHi:'#f3ebde',pcDim:'rgba(240,232,220,.38)',pcGold:'#D9B46A',pcHov:'rgba(255,255,255,.04)',pcLine:'rgba(255,255,255,.08)'}
             :{pcInk:'rgba(52,40,28,.72)',pcHi:'#2a2018',pcDim:'rgba(52,40,28,.45)',pcGold:'#9a6b2a',pcHov:'rgba(0,0,0,.04)',pcLine:'rgba(52,40,28,.12)'};
  for(const k in T) R.setProperty('--'+k,T[k]);
  const nav=document.createElement('nav'); nav.className='pcs pcNav'; nav.setAttribute('aria-label','전체 메뉴'); nav.dataset.hj='0';
  let h=`<a class="pcLogo" href="./" data-home="1"><img src="img/brand/odg_mark.webp" alt=""><img class="lw" src="img/brand/odg_word_h${dark?'':'_ink'}.webp" alt="오방도감"></a>`;
  NAV.forEach(([t,L])=>{ if(t) h+=`<h6>${t}</h6>`; L.forEach(([n,u,k])=>{ h+=`<a href="${u}"${k?' data-home="1"':''} class="${active(u)?'on':''}">${n}</a>`; }); });
  nav.innerHTML=h;
  nav.addEventListener('click',e=>{ const a=e.target.closest('a'); if(!a) return; try{ sessionStorage.setItem('toHome','1'); }catch(_){}
    if(a.dataset.home&&isHome&&typeof window.showHome==='function'){ e.preventDefault(); window.showHome(); } });
  const side=document.createElement('aside'); side.className='pcs pcSide'; side.dataset.hj='0';
  side.innerHTML=`<div><h6>폰으로 이어 보기</h6><div class="pcQr"><i id="pcQr"></i><p><b>카메라로 찍으면 끝</b>지금 이 화면이 폰에서 그대로 열려요</p></div></div>
    <div class="pcPick"><h6>요즘 많이 하는 무료 테스트</h6>${PICK.map(([k,n,d])=>`<a href="free.html?t=${k}"><span style="background-image:url('img/free/${k}.jpg')"></span><div><b>${n}</b><small>${d}</small></div></a>`).join('')}</div>
    <div class="pcFoot">오방사주 · 다섯 신이 읽어 주는 내 사주<br>만세력 기반 풀이 · 체험판</div>`;
  document.body.appendChild(nav); document.body.appendChild(side);
  qr();
  if(isHome){ const s=document.getElementById('stage'); const f=()=>document.documentElement.classList.toggle('pcHide',!s.classList.contains('homeMode')); f(); new MutationObserver(f).observe(s,{attributes:true,attributeFilter:['class']}); }
}
function qr(){ const box=document.getElementById('pcQr'); if(!box) return; const url=location.href.split('#')[0];
  const draw=()=>{ try{ const q=qrcode(0,'M'); q.addData(url); q.make(); box.innerHTML=q.createSvgTag({cellSize:4,margin:0,scalable:true}); }catch(e){ box.closest('div').parentNode.style.display='none'; } };
  if(window.qrcode) return draw();
  const s=document.createElement('script'); s.src='qrgen.js'; s.onload=draw; s.onerror=()=>{ box.closest('div').parentNode.style.display='none'; }; document.head.appendChild(s); }
let built=false;
function upd(){ const R=document.documentElement; R.classList.toggle('pcw',MQ.matches); R.classList.toggle('pcx',WIDE.matches); if(WIDE.matches&&!built){ built=true; build(); } }
MQ.addEventListener('change',upd); WIDE.addEventListener('change',upd);
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',upd); else upd();
})();

/* 위 막대 바탕: depth3d.js가 없는 화면(다음 연애 · 재회 등)도 내리면 화면 바탕색 막을 깔아 제목 · 버튼이 글자와 겹치지 않게 */
(function(){ if(window.Depth3D||window.__obTsd) return; window.__obTsd=1; try{
  const st=document.createElement('style'); st.textContent='.stage>.top{transition:background .3s}.stage>.top.tsd{background:var(--tsd);box-shadow:0 12px 14px -6px var(--tsd)}'; document.head.appendChild(st);
  let bg=0; const set=on=>{ const top=document.querySelector('.stage>.top'); if(!top) return; if(on&&!bg){ const c=getComputedStyle(document.querySelector('.stage')).backgroundColor||'rgb(12,10,15)', m=c.match(/[\d.]+/g)||[12,10,15]; bg=1; top.style.setProperty('--tsd',`rgba(${m[0]},${m[1]},${m[2]},.96)`); top.style.setProperty('--tsd0',`rgba(${m[0]},${m[1]},${m[2]},0)`); } top.classList.toggle('tsd',on); };
  document.addEventListener('scroll',e=>{ const t=e.target; if(!t||!t.closest||!t.closest('.stage')||t.classList.contains('stage')) return; set(t.scrollTop>40); },true);
}catch(e){} })();
