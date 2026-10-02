/* 오방사주 공유 — 모든 결과 화면이 같은 공유 시트를 쓴다.
   ObShare.sheet({blob|src, name, title, text, url})  : 이미 만든 카드 이미지로 시트 열기
   ObShare.open({kicker, head, sub, big, unit, tags, img, menu, name}) : 공통 스토리 카드(1080×1920)를 만들어 시트 열기
   페이지별 설정(CFG)이 있으면 결과 화면에 '결과 공유하기' 버튼을 자동으로 붙인다. */
(function(){
if(window.ObShare) return;
const file=(location.pathname.split('/').pop()||'index.html');
const isHome=!!document.getElementById('op')&&!!document.getElementById('home');
const $=id=>document.getElementById(id);
const T=id=>{ const e=$(id); return e?e.textContent.replace(/\s+/g,' ').trim():''; };
const BG=id=>{ const e=$(id); if(!e) return ''; const m=getComputedStyle(e).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/); return m?m[1]:''; };
const shown=id=>{ const e=$(id); return !!e&&e.offsetParent!==null; };

/* 페이지별: 버튼 놓을 곳(before) · 결과가 보일 때(ready) · 카드 내용(data) */
const CFG={
 'today.html':{before:()=>document.querySelector('#sOut .cta'),ready:()=>T('mT'),data:()=>({menu:'오늘의 운세',kicker:'오늘의 운세 · '+T('dT'),big:T('sc'),unit:'점',head:T('mT'),sub:T('sayT'),img:'img/seoha.jpg'})},
 'sinnyeon.html':{before:()=>$('prem'),ready:()=>T('qTop'),data:()=>({menu:'2027 신년운세',kicker:'2027 신년운세 · 삼신 할매',big:T('ySc'),unit:'점',head:T('qTop'),sub:T('yTx'),img:'img/halmae.jpg'})},
 'lifetime.html':{before:()=>$('prem'),ready:()=>T('qTop'),data:()=>({menu:'평생 사주',kicker:'평생 사주 · 현암',head:T('qTop'),sub:T('giT'),img:'img/jeongtong.jpg'})},
 'love2.html':{before:()=>$('lockL'),ready:()=>T('rT'),data:()=>({menu:document.title.split('·')[0].trim(),kicker:T('rK'),big:T('rN'),unit:'',head:T('rT'),sub:T('rP'),img:BG('rHero')})},
 'career.html':{before:()=>$('lockC'),ready:()=>T('tNm'),data:()=>({menu:'커리어 사주',kicker:'커리어 사주 · '+T('tEn'),head:T('tNm'),sub:T('tDesc'),img:'img/earth.jpg'})},
 'taegil.html':{before:()=>$('lockT'),ready:()=>T('oT'),data:()=>({menu:'택일',kicker:T('oK'),head:T('oT'),sub:T('oS'),img:'img/taegil.jpg'})},
 'gunghap.html':{before:()=>$('lockG'),ready:()=>T('scT'),data:()=>({menu:'도화 궁합',kicker:`${T('nA')} × ${T('nB')} · 도화 궁합`,big:T('sc'),unit:'점',head:T('scT'),sub:T('say'),img:'img/taeo/base.jpg'})},
 'tarot.html':{before:()=>$('lockR'),ready:()=>T('vBig'),data:()=>({menu:'무진의 타로',kicker:T('rKick'),head:T('vBig'),sub:T('vLine'),img:'img/tarot/mujin.jpg'})},
 'home':{before:()=>$('ctaShare'),replace:true,ready:()=>T('rName'),data:()=>({menu:'수호신 카드',kicker:'나의 수호신 · '+T('rGod'),head:T('rName'),sub:T('rMission'),img:BG('rHero')})}
};

/* ---------- 스타일 ---------- */
const css=`.obs{position:absolute;inset:0;z-index:200;display:flex;flex-direction:column;justify-content:flex-end;background:rgba(0,0,0,.62);opacity:0;pointer-events:none;transition:opacity .25s}
.obs.on{opacity:1;pointer-events:auto}
.obs .in{background:#141117;color:#f3ebde;padding:18px 18px calc(env(safe-area-inset-bottom,0px) + 18px);transform:translateY(24px);transition:transform .3s;font-family:"Noto Sans KR",sans-serif;max-height:94%;overflow-y:auto;border-top:1px solid rgba(233,201,139,.28)}
.obs.on .in{transform:none}
.obs .hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.obs .hd b{font-size:16px;font-weight:700}
.obs .hd button{border:0;background:none;color:rgba(243,235,222,.6);font-size:13px;cursor:pointer;padding:6px 2px;font-family:inherit}
.obs .pv{display:flex;justify-content:center;background:#0b090d;padding:10px 0;margin-bottom:14px}
.obs .pv img{display:block;max-height:46vh;max-width:100%;box-shadow:0 10px 30px rgba(0,0,0,.6)}
.obs .go svg{width:18px;height:18px;flex:none}
.obs .go{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:52px;border:0;background:#D9B46A;color:#17120a;font-size:15.5px;font-weight:800;cursor:pointer;font-family:inherit}
.obs .row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.obs .row button{height:46px;border:1px solid rgba(243,235,222,.22);background:transparent;color:#f3ebde;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}
.obs .nt{margin:12px 0 0;font-size:12px;line-height:1.6;color:rgba(243,235,222,.5);text-align:center}
.obs-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;height:50px;margin:14px 0 4px;border:1px solid currentColor;background:transparent;color:inherit;font-size:15px;font-weight:700;cursor:pointer;font-family:"Noto Sans KR",sans-serif;opacity:.92}
.obs-btn svg{width:18px;height:18px}
.obs-toast{position:absolute;left:50%;bottom:110px;transform:translateX(-50%);z-index:210;background:rgba(20,17,23,.94);color:#f3ebde;font:500 13.5px/1.4 "Noto Sans KR",sans-serif;padding:10px 16px;opacity:0;transition:opacity .25s;pointer-events:none;white-space:nowrap}
.obs-toast.on{opacity:1}`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
const ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6h14v-6"/></svg>';

function root(){ return document.querySelector('.stage')||document.body; }
let toastEl=null;
function toast(t){ if(!toastEl){ toastEl=document.createElement('div'); toastEl.className='obs-toast'; root().appendChild(toastEl); } toastEl.textContent=t; toastEl.classList.add('on'); clearTimeout(toastEl._t); toastEl._t=setTimeout(()=>toastEl.classList.remove('on'),2000); }
function shareUrl(){ const u=new URL(location.href); u.hash=''; ['me','f'].forEach(k=>u.searchParams.delete(k)); u.searchParams.set('ref','share'); return u.toString(); }

/* ---------- 시트 ---------- */
let el=null, cur=null;
function build(){ el=document.createElement('div'); el.className='obs'; el.dataset.hj='0';
  el.innerHTML=`<div class="in"><div class="hd"><b>결과 공유하기</b><button type="button" data-x>닫기</button></div><div class="pv"><img alt="공유 카드"></div>
  <button class="go" type="button" data-send>${ICON}카톡 · 인스타로 보내기</button>
  <div class="row"><button type="button" data-save>이미지 저장</button><button type="button" data-link>링크 복사</button></div>
  <p class="nt">공유한 링크로 친구가 들어오면 할인 쿠폰을 드려요. 쿠폰은 정식 오픈 때부터 적용돼요.</p></div>`;
  el.addEventListener('click',e=>{ if(e.target===el||e.target.closest('[data-x]')) close(); });
  el.querySelector('[data-save]').onclick=save; el.querySelector('[data-link]').onclick=copy; el.querySelector('[data-send]').onclick=send;
  root().appendChild(el); }
function close(){ if(el) el.classList.remove('on'); }
async function toBlob(o){ if(o.blob) return o.blob; if(o.src){ const r=await fetch(o.src); return await r.blob(); } return null; }
async function sheet(o){ if(!el) build(); cur=Object.assign({name:'obang-card.png',title:'오방사주',text:'',url:shareUrl()},o); cur.blob=await toBlob(o);
  const img=el.querySelector('.pv img'); img.src=o.src||URL.createObjectURL(cur.blob); el.querySelector('.pv').hidden=!cur.blob;
  requestAnimationFrame(()=>el.classList.add('on')); }
function done(){ try{ window.dispatchEvent(new CustomEvent('obshare:done',{detail:{key:file}})); }catch(e){} }
function save(){ if(!cur||!cur.blob) return; const a=document.createElement('a'); a.href=URL.createObjectURL(cur.blob); a.download=cur.name; document.body.appendChild(a); a.click(); a.remove(); toast('이미지를 저장했어요'); done(); }
async function copy(){ const t=cur.url; try{ await navigator.clipboard.writeText(t); }catch(e){ const i=document.createElement('textarea'); i.value=t; document.body.appendChild(i); i.select(); try{ document.execCommand('copy'); }catch(_){} i.remove(); } toast('링크를 복사했어요'); done(); }
async function send(){ const text=(cur.text?cur.text+'\n':'')+cur.url;
  try{ if(cur.blob){ const f=new File([cur.blob],cur.name,{type:cur.blob.type||'image/png'}); if(navigator.canShare&&navigator.canShare({files:[f]})){ await navigator.share({files:[f],title:cur.title,text}); done(); return; } }
    if(navigator.share){ await navigator.share({title:cur.title,text:cur.text,url:cur.url}); done(); return; } }catch(e){ if(e&&e.name==='AbortError') return; }
  await copy(); toast('링크를 복사했어요. 카톡이나 인스타에 붙여 넣어 주세요'); }

/* ---------- 공통 스토리 카드 ---------- */
function loadImg(src){ return new Promise((r,j)=>{ if(!src) return j(); const i=new Image(); i.crossOrigin='anonymous'; i.onload=()=>r(i); i.onerror=j; i.src=src; }); }
function wrap(x,t,w,max){ const out=[]; let line=''; for(const ch of [...String(t||'')]){ const n=line+ch; if(x.measureText(n).width>w&&line){ out.push(line); line=ch.trim()?ch:''; if(out.length>=max) break; } else line=n; } if(out.length<max&&line) out.push(line); return out; }
async function card(d){ const W=1080,H=1920,c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d');
  const SANS='"Noto Sans KR",sans-serif', SERIF='"Noto Serif KR",serif';
  try{ await Promise.all(['900 84px "Noto Serif KR"','700 34px "Noto Sans KR"','500 40px "Noto Sans KR"','italic 700 150px "Cormorant Garamond"'].map(f=>document.fonts.load(f))); }catch(e){}
  x.fillStyle='#0d0b10'; x.fillRect(0,0,W,H);
  try{ const im=await loadImg(d.img); const s=Math.max(W/im.width,1240/im.height), iw=im.width*s, ih=im.height*s; x.drawImage(im,(W-iw)/2,0,iw,ih); }catch(e){}
  const g=x.createLinearGradient(0,0,0,H); g.addColorStop(0,'rgba(13,11,16,.5)'); g.addColorStop(.14,'rgba(13,11,16,0)'); g.addColorStop(.42,'rgba(13,11,16,.08)'); g.addColorStop(.62,'rgba(13,11,16,.92)'); g.addColorStop(.7,'#0d0b10'); x.fillStyle=g; x.fillRect(0,0,W,H);
  x.textBaseline='alphabetic'; x.textAlign='left'; const L=88; let y=1190;
  x.fillStyle='#E9C98B'; x.font=`700 34px ${SANS}`; x.fillText(String(d.kicker||d.menu||'').slice(0,34),L,y); y+=40;
  if(d.big){ x.font=`italic 700 150px "Cormorant Garamond",serif`; x.fillStyle='#E9C98B'; x.fillText(d.big,L-6,y+130); const bw=x.measureText(d.big).width; if(d.unit){ x.font=`700 52px ${SANS}`; x.fillText(d.unit,L+bw+8,y+128); } y+=170; } else y+=40;
  x.fillStyle='#ffffff'; x.font=`900 80px ${SERIF}`; wrap(x,d.head,W-L*2,3).forEach(l=>{ y+=100; x.fillText(l,L,y); }); y+=30;
  x.fillStyle='#d6ccc3'; x.font=`500 38px ${SANS}`; wrap(x,d.sub,W-L*2,4).forEach(l=>{ y+=58; x.fillText(l,L,y); });
  x.fillStyle='rgba(233,201,139,.35)'; x.fillRect(L,1798,W-L*2,1.5);
  x.fillStyle='#bfb3a8'; x.font=`600 30px ${SANS}`; x.fillText(`오방사주 · ${d.menu||''}`,L+56,1856);
  try{ const mk=await loadImg('img/brand/mark.svg'); x.drawImage(mk,L,1822,42,42); }catch(e){}
  x.textAlign='right'; x.fillStyle='#8f857c'; x.font=`500 26px ${SANS}`; x.fillText(location.host||'',W-L,1856);
  return await new Promise(r=>c.toBlob(r,'image/png')); }
async function open(d){ toast('공유 카드를 만드는 중이에요'); const b=await card(d); sheet({blob:b,name:`obang-${(d.menu||'card').replace(/\s/g,'')}.png`,title:`오방사주 · ${d.menu||''}`,text:d.head?`${d.head}`:''}); }

/* ---------- 자동 버튼 ---------- */
function attach(){ const key=isHome?'home':file, C=CFG[key]; if(!C) return;
  const tryAttach=()=>{ const anchor=C.before&&C.before(); if(!anchor||!anchor.parentNode) return false;
    if(C.replace){ anchor.onclick=e=>{ e.preventDefault(); open(C.data()); }; return true; }
    if(anchor.parentNode.querySelector(':scope > .obs-btn')) return true;
    const b=document.createElement('button'); b.type='button'; b.className='obs-btn'; b.innerHTML=ICON+'결과 공유하기'; b.onclick=()=>open(C.data());
    anchor.parentNode.insertBefore(b,anchor); return true; };
  if(!tryAttach()){ const mo=new MutationObserver(()=>{ if(tryAttach()) mo.disconnect(); }); mo.observe(document.body,{childList:true,subtree:true}); } }
window.ObShare={sheet,open,card,close,toast};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',attach); else attach();
})();
