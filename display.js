/* 오방도감 홈 전시 영역(10/4 시안) — 설정(ROOMS · SLOTS)만 고치면 홈 어디에든 특집 칸이 생긴다.
   지금: 이 파일의 설정 → 정식: 같은 모양의 설정을 서버(어드민)에서 받아 그대로 그림(ObDisplay.render(cfg)).
   칸 종류: carousel(별관 · 가로로 넘기는 포스터) · split(낮의 방 / 밤의 방 두 문) · daily(오늘 고른 방 하나) · bridge(관련 칸 아래 한 줄 다리)
   칸 공통: id · type · at(기준 칸 선택자) · where(before|after) · cats(홈 분류 탭 data-cats) · from/to(YYYY-MM-DD, 선택) · hours([시작시,끝시], 선택) */
(function(){
const D8='https://d8j0ntlcm91z4.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/', D2='https://d2ol7oe51mr4n9.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/';
/* 방(메뉴) 사전: 한 번 적어 두면 어느 칸에서나 쓴다 */
const ROOMS={
 yeonseo:{who:'하람의 연서당',t:'곧 받을 편지',line:'은행잎 골목 끝 편지 가게. 너에게 올 편지 한 통을 먼저 열어 봐',img:D8+'hf_20261003_002112_ac4bb635-6498-4664-b753-dbc9bf75f580_min.webp',v:D2+'65244db2-d88d-436d-ae73-230afed5f225.mp4',href:'yeonseo.html',badge:'첫 장 무료',c:'#d9b26a',pos:'center 40%'},
 lovemini:{who:'연서당의 작은 편지들',t:'연애 편지 세 장',line:'나의 연애 유형 · 우리 궁합 한 장 · 이번 주 연애 편지',img:D8+'hf_20261003_003011_514adb66-edf2-4b3a-ba17-e308bd4054cd_min.webp',v:D2+'84f23237-3cec-4dfc-8dc7-3c80143618f5.mp4',href:'lovemini.html',badge:'무료',c:'#e7b3a2',pos:'center 35%'},
 heuk:{who:'그림자 손님 · 흑매',t:'우리 사이 조심할 때',line:'붉은 실 사이에 섞인 검은 실. 악연이 드는 때를 먼저 알려 줘',img:D8+'hf_20261003_101836_ccb27e8d-f3d5-430a-975b-c64a04d3c7cf_min.webp',v:D2+'9d07049a-9f0b-45e3-9547-21f1841ad87d.mp4',href:'heukmae.html',badge:'무료',c:'#e0727f',pos:'center 26%'},
 geum:{who:'그림자 손님 · 그믐',t:'내 빈칸 확인',line:'달이 없는 밤엔 비어 있는 게 잘 보여. 내 공망 자리 짚어 보기',img:D8+'hf_20261003_102005_5906aacf-085d-40b2-acda-136da797f5cc_min.webp',v:D2+'c046140c-d852-47b8-9472-52acd1fa393c.mp4',href:'geumeum.html',badge:'무료',c:'#9fb4e8',pos:'center 24%'},
 sam:{who:'그림자 손님 · 삼재 삼남매',t:'나의 삼재',line:'들어간다, 눌러앉는다, 나간다. 삼 년을 머무는 손님 확인',img:D8+'hf_20261003_102844_e93d3f57-cfef-45d4-ad1d-668f8f7cf23a_min.webp',v:D2+'9ac5edd8-b3bb-4fee-b064-025be7356f3c.mp4',href:'samjae.html',badge:'무료',c:'#c3aef0',pos:'center 40%'},
 redthread:{who:'월하의 실타래',t:'붉은 실 궁합',line:'두 사람 사이의 실, 어디서 엉키고 어디서 풀리는지',img:'img/taegil.jpg',href:'redthread.html',badge:'NEW',c:'#e36b5a',pos:'center 25%'},
 meokmul:{who:'묘당 검은 고양이',t:'먹물의 오늘 한 장',line:'하루에 딱 한 장. 같은 걸 두 번 물으면 카드가 삐져',img:'img/cat/water.jpg',v:D2+'6c50abf3-653a-4ed5-92bc-0cacbdcb72b0.mp4',href:'meokmul.html',badge:'하루 한 장 무료',c:'#bfb7ff',pos:'center 30%'}
};
const SLOTS=[
 {id:'annex',type:'carousel',at:'#secBook',where:'before',cats:'all love heart gaeun',k:'오방도감 별관',h:'이번 주, 문을 연 방',items:['yeonseo','heuk','redthread','lovemini','geum','meokmul','sam']},
 {id:'alley',type:'split',at:'#secBook',where:'before',cats:'all love heart gaeun',day:'yeonseo',night:['heuk','geum','sam']},
 {id:'today',type:'daily',at:'#secBook',where:'before',cats:'all love heart gaeun',pool:['yeonseo','heuk','redthread','lovemini','geum','meokmul','sam']},
 {id:'br-love',type:'bridge',at:'#secLoveHub',where:'after',cats:'all love heart re',item:'yeonseo',text:'연서당 · 너에게 올 편지 한 통, 먼저 열어 보기'},
 {id:'br-dohwa',type:'bridge',at:'#secDohwa',where:'after',cats:'all love match',item:'redthread',text:'월하의 붉은 실 궁합 · 두 사람의 실이 어디서 엉키는지'},
 {id:'br-cat',type:'bridge',at:'#secCat',where:'after',cats:'all love heart',item:'meokmul',text:'먹물의 오늘 한 장 · 아직 안 뽑았으면 하루 한 장 무료'}
];
const CSS=`.dsp{--dg:#d9b26a}
.dsp .sh small{color:var(--dg)}
.dspA .rail{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 16px 4px;scrollbar-width:none}.dspA .rail::-webkit-scrollbar{display:none}
.dsp a{color:#fff;text-decoration:none;-webkit-tap-highlight-color:transparent}
.dsp .pc{position:relative;flex:none;width:62%;max-width:250px;aspect-ratio:3/4;overflow:hidden;scroll-snap-align:start;background:#0b0910 center/cover no-repeat;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
.dsp video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s}.dsp video.on{opacity:1}
.dsp .pc::after,.dsp .dd::after,.dsp .tdy::after{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.25) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,.2) 52%,rgba(0,0,0,.92) 100%)}
.dsp .bd{position:absolute;top:10px;left:10px;z-index:2;font-size:10.5px;font-weight:800;letter-spacing:.04em;padding:4px 7px;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.3)}
.dsp .tx{position:absolute;left:14px;right:14px;bottom:14px;z-index:2}
.dsp .tx small{display:block;font-size:11px;font-weight:700;letter-spacing:.06em}
.dsp .tx b{display:block;margin-top:4px;font-family:var(--brush);font-weight:400;font-size:24px;line-height:1.12;letter-spacing:-.01em;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.dsp .tx em{display:block;margin-top:6px;font-style:normal;font-size:12px;line-height:1.5;color:rgba(255,255,255,.78);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dspB .doors{display:flex;gap:2px;height:236px;margin:0 16px}
.dspB .dd{position:relative;flex:1;overflow:hidden;background:#0b0910 center/cover no-repeat;transition:flex .8s cubic-bezier(.6,0,.2,1)}
.dspB .dd.big{flex:1.75}
.dspB .dd .tx b{font-size:24px}.dspB .dd:not(.big) .tx em{display:none}
.dspB .dd .lb{position:absolute;top:10px;left:10px;z-index:2;font-size:10.5px;font-weight:800;letter-spacing:.12em;padding:3px 7px}
.dspB .day .lb{background:#f3e6c6;color:#3a2a12}.dspB .night .lb{background:#1a0e14;color:#f0a5ad;border:1px solid rgba(240,165,173,.45)}
.dspB .day::before{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(255,214,140,.16),rgba(255,214,140,0) 50%);pointer-events:none}
.dspB .night::before{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(120,10,30,.28),rgba(0,0,0,0) 55%);pointer-events:none}
.dspB .fc{display:flex;margin-top:8px}.dspB .fc i{width:24px;height:24px;border-radius:50%!important;background:#222 center/cover;border:1.5px solid #120c10;margin-left:-6px}.dspB .fc i:first-child{margin-left:0}
.dspB .cap{margin:9px 16px 0;font-size:11.5px;color:#8a8590}
.dspC .tdy{position:relative;display:block;margin:0 16px;aspect-ratio:16/10;overflow:hidden;background:#0b0910 center/cover no-repeat}
.dspC .tdy .tx b{font-size:30px}.dspC .tdy .tx em{-webkit-line-clamp:3}
.dspC .tm{position:absolute;top:10px;right:10px;z-index:2;font-size:10.5px;font-weight:700;padding:4px 7px;background:rgba(0,0,0,.55);color:rgba(255,255,255,.85)}
.dspC .nx{display:flex;gap:6px;margin:10px 16px 0;align-items:center;font-size:11.5px;color:#8a8590}.dspC .nx i{width:22px;height:22px;border-radius:50%!important;background:#222 center/cover;opacity:.75}
.dspD{margin:14px 16px 0}
.dspD a{display:flex;align-items:center;gap:10px;padding:10px 2px;border-top:1px solid rgba(217,178,106,.25);border-bottom:1px solid rgba(217,178,106,.25)}
.dspD a i{flex:none;width:34px;height:34px;border-radius:50%!important;background:#222 center/cover}
.dspD a span{flex:1;font-size:13px;line-height:1.4;color:#e9e4ec}.dspD a span b{color:var(--dg);font-weight:700}
.dspD a em{flex:none;font-style:normal;color:var(--dg);font-size:15px}`;
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const R=k=>ROOMS[k];
const vid=r=>r.v?`<video data-src="${r.v}" muted loop playsinline preload="none" disablepictureinpicture controlslist="nofullscreen noremoteplayback nodownload"></video>`:'';
const night=()=>{ const h=new Date().getHours(); return h>=18||h<6; };
const live=s=>{ const d=new Date(), ymd=d.toISOString().slice(0,10); if(s.from&&ymd<s.from) return false; if(s.to&&ymd>s.to) return false; if(s.hours){ const h=d.getHours(), [a,b]=s.hours; if(a<=b?!(h>=a&&h<b):!(h>=a||h<b)) return false; } return true; };
const card=(k,cls)=>{ const r=R(k); return `<a class="${cls}" href="${r.href}" style="background-image:url('${r.img}');background-position:${r.pos||'center'}">${vid(r)}<span class="bd">${esc(r.badge)}</span><span class="tx"><small style="color:${r.c}">${esc(r.who)}</small><b>${esc(r.t)}</b><em>${esc(r.line)}</em></span></a>`; };
const DRAW={
 carousel:s=>`<div class="sh"><small>${esc(s.k)}</small><b>${esc(s.h)}</b></div><div class="rail">${s.items.filter(R).map(k=>card(k,'pc')).join('')}</div>`,
 split:s=>{ const n=night(), d=R(s.day), ng=s.night.map(R).filter(Boolean), m=ng[0];
   return `<div class="sh"><small>골목 안쪽 · 지금은 ${n?'밤':'낮'}</small><b>낮에는 편지가, 밤에는 손님이 와</b></div>
   <div class="doors"><a class="dd day${n?'':' big'}" href="${d.href}" style="background-image:url('${d.img}');background-position:${d.pos}">${vid(d)}<span class="lb">낮의 방</span><span class="tx"><small style="color:${d.c}">${esc(d.who)}</small><b>${esc(d.t)}</b><em>${esc(d.line)}</em></span></a>
   <a class="dd night${n?' big':''}" href="${m.href}" style="background-image:url('${m.img}');background-position:${m.pos}">${vid(m)}<span class="lb">밤의 방</span><span class="tx"><small style="color:${m.c}">그림자 손님 셋</small><b>오늘 밤 손님</b><em>흑매 · 그믐 · 삼재. 내 사주의 빈틈을 먼저 알려 주는 손님들, 전부 무료</em><span class="fc">${ng.map(r=>`<i style="background-image:url('${r.img}');background-position:${r.pos}"></i>`).join('')}</span></span></a></div>
   <p class="cap">해가 지면 밤의 방이 넓어지고, 해가 뜨면 낮의 방이 넓어져.</p>`; },
 daily:s=>{ const pool=s.pool.filter(R), d=new Date(), doy=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5), k=pool[doy%pool.length], nxt=[1,2,3].map(i=>pool[(doy+i)%pool.length]);
   const end=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1), mins=Math.max(0,Math.round((end-d)/6e4));
   return `<div class="sh"><small>오늘 고른 방 · 하루에 한 곳</small><b>오늘은 여기로 가 봐</b></div><a class="tdy" href="${R(k).href}" style="background-image:url('${R(k).img}');background-position:${R(k).pos}">${vid(R(k))}<span class="bd">${esc(R(k).badge)}</span><span class="tm">${Math.floor(mins/60)}시간 ${mins%60}분 뒤 다른 방으로</span><span class="tx"><small style="color:${R(k).c}">${esc(R(k).who)}</small><b>${esc(R(k).t)}</b><em>${esc(R(k).line)}</em></span></a><div class="nx">내일부터 ${nxt.map(x=>`<i style="background-image:url('${R(x).img}');background-position:${R(x).pos}"></i>`).join('')} 차례로</div>`; },
 bridge:s=>{ const r=R(s.item); const [a,b]=s.text.split(' · '); return `<a href="${r.href}"><i style="background-image:url('${r.img}');background-position:${r.pos}"></i><span><b>${esc(a)}</b>${b?' · '+esc(b):''}</span><em>›</em></a>`; }
};
const CLS={carousel:'dspA',split:'dspB',daily:'dspC',bridge:'dspD'};
function css(){ if(document.getElementById('dspCss')) return; const s=document.createElement('style'); s.id='dspCss'; s.textContent=CSS; document.head.appendChild(s); }
function playOnView(root){ const vs=root.querySelectorAll('video[data-src]'); if(!('IntersectionObserver' in window)) return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{ const v=e.target; if(e.isIntersecting){ if(!v.src) v.src=v.dataset.src; v.muted=true; const p=v.play(); if(p&&p.then) p.then(()=>v.classList.add('on')).catch(()=>{}); } else { try{ v.pause(); }catch(x){} } }),{threshold:.35});
  vs.forEach(v=>{ v.addEventListener('error',()=>v.remove()); io.observe(v); }); }
function render(only,cfg){ css(); const slots=(cfg&&cfg.slots)||SLOTS; if(cfg&&cfg.rooms) Object.assign(ROOMS,cfg.rooms);
  const out=[]; slots.forEach(s=>{ if(only&&!only.includes(s.id)) return; if(!live(s)||!DRAW[s.type]) return; const at=document.querySelector(s.at); if(!at) return;
    const el=document.createElement(s.type==='bridge'?'div':'section'); el.className=(s.type==='bridge'?'':'hSec ')+'dsp '+CLS[s.type]; el.dataset.dsp=s.id; if(s.cats) el.dataset.cats=s.cats;
    el.innerHTML=DRAW[s.type](s); if(s.where==='after') at.after(el); else at.before(el); playOnView(el); out.push(el); });
  return out; }
function clear(){ document.querySelectorAll('[data-dsp]').forEach(e=>e.remove()); }
window.ObDisplay={ROOMS,SLOTS,render,clear};
})();
