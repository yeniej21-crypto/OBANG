/* 그림자 손님 입구 카드(10/3). 어느 화면이든 <div class="sgx" data-sg="all"></div> 한 줄 + 이 스크립트면 된다.
   data-sg: all(전부 · 첫 손님 큰 카드 + 나머지 반 카드) 또는 heuk / geum / sam(하나만 가로 카드)
   data-h: 머리글 큰 줄(선택) · data-k: 머리글 작은 줄(선택)
   손님이 늘면 아래 G에 한 줄 추가하고 ORDER에 넣으면 끝. 영상은 화면에 보일 때만 소리 없이 반복 재생 */
(function(){
const CF='https://d8j0ntlcm91z4.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/hf_20261003_', D2='https://d2ol7oe51mr4n9.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/';
const G={
 heuk:{n:'흑매',k:'붉은 실 사이 검은 실',t:'우리 사이 조심할 때',s:'그 실, 내가 묶은 거 아닌데.',href:'heukmae.html',
   img:CF+'101836_ccb27e8d-f3d5-430a-975b-c64a04d3c7cf_min.webp',v:D2+'9d07049a-9f0b-45e3-9547-21f1841ad87d.mp4',c:'#a8283a',c2:'#f0a5ad',pos:'center 26%'},
 geum:{n:'그믐',k:'달 없는 밤의 빈칸',t:'내 빈칸 확인',s:'달이 없는 밤엔, 비어 있는 게 잘 보이거든.',href:'geumeum.html',
   img:CF+'102005_5906aacf-085d-40b2-acda-136da797f5cc_min.webp',v:D2+'c046140c-d852-47b8-9472-52acd1fa393c.mp4',c:'#3b5a9a',c2:'#b8c8ee',pos:'center 24%'},
 sam:{n:'삼재 삼남매',k:'삼 년을 머무는 손님',t:'나의 삼재',s:'들어간다. 눌러앉는다. 나간다.',href:'samjae.html',
   img:CF+'102844_e93d3f57-cfef-45d4-ad1d-668f8f7cf23a_min.webp',v:D2+'9ac5edd8-b3bb-4fee-b064-025be7356f3c.mp4',c:'#6a4aa8',c2:'#cbb8f0',pos:'center 40%'}
};
const ORDER=['heuk','geum','sam'];
const css=`
.sgx{display:block;margin:0 16px;color:inherit;font-family:'Noto Sans KR',system-ui,sans-serif}
.sgx .sgh{padding:0 2px 12px}
.sgx .sgh small{display:block;font-size:11px;font-weight:800;letter-spacing:.14em;color:#c77f8a}
.sgx .sgh b{display:block;margin-top:6px;font-size:20px;font-weight:800;letter-spacing:-.02em;line-height:1.35}
.sgx a.c{position:relative;display:block;overflow:hidden;background:#08060a center/cover no-repeat;text-decoration:none;color:#fff;-webkit-tap-highlight-color:transparent}
.sgx a.c video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s}
.sgx a.c video.on{opacity:1}
.sgx a.c:after{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.9) 100%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.sgx .fr{position:absolute;top:10px;left:10px;z-index:2;font-size:11px;font-weight:800;letter-spacing:.04em;padding:4px 8px;color:#fff;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.35)}
.sgx .tx{position:absolute;left:14px;right:14px;bottom:14px;z-index:2}
.sgx .tx small{display:block;font-size:10.5px;font-weight:800;letter-spacing:.1em;color:var(--c2)}
.sgx .tx b{display:block;margin-top:6px;font-family:var(--brush,'Noto Serif KR',serif);font-weight:400;font-size:34px;line-height:1.05;letter-spacing:0}
.sgx .tx i{display:block;margin-top:7px;font-style:normal;font-size:13px;line-height:1.5;color:rgba(255,255,255,.8)}
.sgx .tx em{display:inline-block;margin-top:11px;font-style:normal;font-size:12.5px;font-weight:800;padding:7px 13px;background:var(--c);color:#fff}
.sgx .big{height:clamp(400px,122vw,540px)}
.sgx .row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.sgx .half{height:clamp(260px,76vw,340px)}
.sgx .half .tx{left:11px;right:11px;bottom:12px}
.sgx .half .tx b{font-size:25px}
.sgx .half .tx i{font-size:11.5px}
.sgx .half .tx em{margin-top:9px;font-size:11.5px;padding:6px 10px}
.sgx .wide{height:clamp(220px,62vw,280px)}
.sgx .wide:after{background:linear-gradient(90deg,rgba(0,0,0,.86) 0%,rgba(0,0,0,.55) 46%,rgba(0,0,0,0) 72%)}
.sgx .wide .tx{right:auto;width:72%;top:50%;bottom:auto;transform:translateY(-50%)}
.sgx .wide .tx b{font-size:27px;white-space:nowrap}
.sgx .wide .tx i{font-size:12.5px}
`;
function ensureCss(){ if(document.getElementById('sgxCss')) return; const s=document.createElement('style'); s.id='sgxCss'; s.textContent=css; document.head.appendChild(s); }
function card(k,cls){ const g=G[k];
  return `<a class="c ${cls}" href="${g.href}" style="--c:${g.c};--c2:${g.c2};background-image:url('${g.img}');background-position:${cls==='wide'?'70% 30%':g.pos}" data-v="${g.v}" data-pos="${cls==='wide'?'70% 30%':g.pos}">`+
    `<span class="fr">무료</span><span class="tx"><small>그림자 손님 · ${g.n}</small><b>${g.t}</b><i>${g.s}</i><em>무료로 보기</em></span></a>`; }
const saveData=(()=>{ try{ return !!(navigator.connection&&navigator.connection.saveData); }catch(e){ return false; } })();
let io=null;
function watch(a){
  if(saveData||!('IntersectionObserver' in window)) return;
  if(!io) io=new IntersectionObserver(es=>es.forEach(e=>{ const a=e.target; let v=a.querySelector('video');
    if(e.isIntersecting){
      if(!v){ v=document.createElement('video'); v.muted=true; v.loop=true; v.playsInline=true; v.setAttribute('playsinline',''); v.setAttribute('muted',''); v.preload='auto';
        v.style.objectPosition=a.dataset.pos; v.src=a.dataset.v; v.addEventListener('playing',()=>v.classList.add('on'),{once:true}); a.insertBefore(v,a.firstChild); }
      const p=v.play(); if(p&&p.catch) p.catch(()=>{});
    } else if(v){ try{ v.pause(); }catch(_){} } }),{threshold:.35});
  io.observe(a);
}
function build(el){ if(el.dataset.done) return; el.dataset.done='1';
  const mode=el.dataset.sg||'all';
  const kk=el.dataset.k||'NEW · 그림자 손님', hh=el.dataset.h||'운의 틈에 숨어 있는 손님들';
  let h=`<div class="sgh"><small>${kk}</small><b>${hh}</b></div>`;
  if(mode==='all'){ const [a,...rest]=ORDER; h+=card(a,'big'); for(let i=0;i<rest.length;i+=2) h+=`<div class="row">${rest.slice(i,i+2).map(k=>card(k,'half')).join('')}</div>`; }
  else h+=mode.split(',').filter(k=>G[k]).map(k=>card(k,'wide')).join('<div style="height:8px"></div>');
  el.innerHTML=h; el.querySelectorAll('a.c').forEach(watch);
}
function init(){ ensureCss(); document.querySelectorAll('.sgx').forEach(build); }
window.ObShadow={init,G};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
