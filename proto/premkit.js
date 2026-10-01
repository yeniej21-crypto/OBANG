/* 오방사주 상세 풀이 공통 도구 — 화면 조각 · 호칭 토큰 · AI 원고 진행 표시
   {N} = 이름+호격(아/야) · {P} = 이름+님 · {S} = 누나(도화 태오) */
(function(){
const bt=w=>{ const c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28>0; };
const esc=t=>String(t==null?'':t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function tok(t,nick){ let s=!nick?esc(t).replace(/\{N\}/g,'너').replace(/\{P\}/g,'당신').replace(/\{S\}/g,'누나'):esc(t).replace(/\{N\}/g,nick+(bt(nick)?'아':'야')).replace(/\{P\}/g,nick+'님').replace(/\{S\}/g,'누나');
  return K.male&&window.HJ&&HJ.bro?HJ.bro(s):s; }
const K={
 tok,esc,bt,
 gl:x=>window.HJ?HJ.glAll(x):x,
 cover:o=>`<div class="pk-cv"><small>${o.kick}</small><h3>${o.title}</h3>${o.sub?`<p class="pk-sub">${o.sub}</p>`:''}${o.words?`<div class="pk-kw"><span>${o.wlabel||'세 단어'}</span><b>${o.words.map(esc).join(' · ')}</b></div>`:''}${o.line?`<p class="pk-q">“${o.line}”</p>`:''}${o.who?`<div class="pk-who"><i style="background-image:url('${o.img}')"></i><em>${o.who}</em></div>`:''}</div>`,
 sec:(t,body,hint)=>`<div class="pk-sec"><h3>${t}${hint?`<i>${hint}</i>`:''}</h3>${body}</div>`,
 ps:(arr,nick)=>(arr||[]).map(p=>`<p class="pk-p">${tok(p,nick)}</p>`).join(''),
 items:(o,labels,nick)=>`<div class="pk-items">${labels.filter(([k])=>o[k]).map(([k,l])=>`<div><small>${l}</small><p>${tok(o[k],nick)}</p></div>`).join('')}</div>`,
 ev:list=>list&&list.length?`<p class="pk-ev">근거 · ${list.map(x=>esc(window.HJ?HJ.evItem(x):x)).join(' · ')}</p>`:'',
 row:(o)=>`<div class="pk-row ${o.cls||''}" data-k="${o.k}"><button class="pk-h" type="button"><span class="pk-a">${o.a}${o.asub?`<small>${o.asub}</small>`:''}</span><span class="pk-b2">${o.b}</span><span class="pk-c">${o.c==null?'':o.c}</span></button><div class="pk-b">${o.body}</div></div>`,
 letter:(paras,sign,seal,nick)=>`<div class="pk-sec pk-letter"><h3>${sign.title}</h3><div class="pk-lt">${paras.map(p=>`<p>${tok(p,nick)}</p>`).join('')}</div><p class="pk-sg">${sign.name} <i>${seal}</i></p></div>`,
 bind(host){ if(host._pk) return; host._pk=1; host.addEventListener('click',e=>{ const h=e.target.closest('.pk-h'); if(h){ h.parentNode.classList.toggle('open'); } }); },
 /* AI 진행 표시 */
 status(el,st){ if(!el) return; const S=st||{}; let h='';
  if(S.state==='run') h=`<i></i><span>${S.who||'상세 풀이'}를 쓰는 중 · ${S.done}/${S.n} 완성</span><small>다 쓰기 전까지는 초안이 먼저 보여요. 1분 안팎 걸려요</small>`;
  else if(S.state==='fail') h='<span>지금은 AI 풀이를 쓸 수 없어 초안으로 보여 드려요</span>';
  else if(S.state==='limit') h='<span>오늘 체험판 풀이 횟수를 다 썼어요</span><small>내일 다시 열면 이어서 써 드려요. 지금은 초안으로 보여 드려요</small>';
  else if(S.state==='off') h='<span>이 화면에서는 초안만 보여요</span><small>claude.ai 체험판이나 정식 서비스에서는 이 근거로 상세 풀이를 길게 써 드려요</small>';
  el.hidden=!h; el.innerHTML=h; },
 /* parts 실행 → apply(id,data) 후 rerender, 상태 객체 갱신 */
 runAI({key,ver,parts,apply,rerender,S}){ if(!window.PremAI) return; let got=0;
  window.PremAI.run({key,ver,parts,
   onStart:n=>{ Object.assign(S,{n,done:0,state:'run'}); rerender(); },
   onPart:(id,d,fromCache)=>{ apply(id,d); got++; S.done=(S.done||0)+1; if(got>=parts.length) S.ai=true; if(!fromCache) rerender(); },
   onDone:(ok,allCached)=>{ if(allCached) S.ai=true; S.state=S.ai||ok?'':'fail'; rerender(); },
   onFail:code=>{ S.state=code==='unavailable'?'off':code==='limit'?'limit':'fail'; rerender(); }}); },
 keepOpen(host,fn){ const open=[...host.querySelectorAll('.pk-row.open')].map(e=>e.dataset.k); const sc=host.closest('.scr'), y=sc?sc.scrollTop:0; fn(); open.forEach(k=>{ const r=host.querySelector(`.pk-row[data-k="${k}"]`); if(r) r.classList.add('open'); }); if(sc) sc.scrollTop=y; }
};
window.PK=K;
})();
