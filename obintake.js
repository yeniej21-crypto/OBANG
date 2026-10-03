/* 오방도감 공용 부품 (10/4)
   ObIntake — 의뢰인의 물음 받기: 묻고 싶은 것(최대 둘) · 지금 사정 · 한 줄 사연(120자)
     값은 지금은 sessionStorage('obAsk'), 정식 서비스에서는 계정 DB로 옮긴다. 사연 원문은 풀이 프롬프트에만 쓴다.
     ObIntake.mount(el,{voice}) · ObIntake.value() · ObIntake.topic(k) · ObIntake.status(k)
   ObScope — 결제 전 안내 띠: 무료로 보는 것 · 결제하면 열리는 것 · 가격 · 환불 기준
     ObScope.html({free:[...],paid:[...],price,was,note}) */
(function(){
const TOPICS=[
 {k:'work',l:'일과 자리',q:'올해 일과 자리는 어떻겠습니까'},
 {k:'job',l:'이직 · 창업',q:'올해 자리를 옮기거나 내 일을 시작해도 되겠습니까'},
 {k:'money',l:'재물',q:'올해 돈은 언제 모이고 언제 새겠습니까'},
 {k:'love',l:'인연 · 결혼',q:'올해 인연과 결혼은 어떻겠습니까'},
 {k:'people',l:'가족 · 사람',q:'올해 가족과 가까운 사람과는 어떻겠습니까'},
 {k:'body',l:'몸과 마음',q:'올해 몸과 마음은 어디를 아껴야 하겠습니까'},
 {k:'move',l:'이사 · 계약',q:'올해 이사나 큰 계약은 언제가 좋겠습니까'},
 {k:'exam',l:'시험 · 공부',q:'올해 시험과 공부는 어떻겠습니까'}];
const STATUS=[{k:'emp',l:'직장에 다님'},{k:'seek',l:'일을 찾는 중'},{k:'own',l:'내 일을 함'},{k:'study',l:'공부하는 중'},{k:'home',l:'집안을 돌봄'},{k:'rest',l:'쉬어 가는 중'}];
const KEY='obAsk', EMPTY=()=>({topics:[],status:'',worry:''});
const get=()=>{ try{ const v=JSON.parse(sessionStorage.getItem(KEY)||'null'); return v&&Array.isArray(v.topics)?v:EMPTY(); }catch(e){ return EMPTY(); } };
const put=v=>{ try{ sessionStorage.setItem(KEY,JSON.stringify(v)); }catch(e){} };
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const VOICE={
 soheon:{h:'묻고 싶은 것',hs:'둘까지 고르게. 고른 물음부터 답하겠네',st:'지금 자네 사정',w:'한 줄 사연',ws:'적지 않아도 되네',ph:'예) 지금 회사를 옮길지 반년째 고민일세',pv:'사연은 감정서를 쓰는 데에만 씁니다. 이름 · 연락처 · 병명처럼 민감한 내용은 적지 말아 주세요.'},
 plain:{h:'궁금한 것',hs:'둘까지 골라 주세요. 고른 것부터 먼저 풀어 드려요',st:'지금 상황',w:'한 줄 사연',ws:'선택',ph:'예) 회사를 옮길지 반년째 고민 중이에요',pv:'사연은 풀이를 쓰는 데에만 씁니다. 이름 · 연락처 · 병명처럼 민감한 내용은 적지 말아 주세요.'}};
const CSS=`.oi{margin-top:16px;border-top:1px solid var(--oi-ink,#171512);border-bottom:1px solid var(--oi-ink,#171512);padding:14px 0 12px}
.oi .h{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin:0 0 8px}
.oi .h b{font-family:var(--serif,serif);font-size:14px;font-weight:900;letter-spacing:.08em;color:var(--oi-ink,#171512)}
.oi .h small{font-size:11.5px;color:var(--oi-mute,#857e74)}
.oi .cs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.oi .cs button{height:34px;padding:0 11px;border:1px solid var(--oi-line,#d9d0c0);background:transparent;color:var(--oi-ink2,#46413a);font-family:var(--serif,serif);font-size:13.5px;cursor:pointer;border-radius:0}
.oi .cs button.on{background:var(--oi-acc,#a3261f);border-color:var(--oi-acc,#a3261f);color:#fff;font-weight:700}
.oi .cs.st button.on{background:var(--oi-ink,#171512);border-color:var(--oi-ink,#171512)}
.oi textarea{display:block;width:100%;box-sizing:border-box;min-height:64px;resize:none;border:1px solid var(--oi-line,#d9d0c0);background:transparent;color:var(--oi-ink,#171512);padding:10px;font-family:var(--serif,serif);font-size:15px;line-height:1.6;outline:none;border-radius:0}
.oi textarea:focus{border-color:var(--oi-ink,#171512)}
.oi .wc{display:flex;justify-content:space-between;gap:10px;margin-top:6px;font-size:11px;line-height:1.5;color:var(--oi-mute,#857e74)}
.oi .wc span:last-child{flex:none}
.osc{margin-top:14px;border:1px solid var(--oi-line,#d9d0c0);font-size:12.5px;line-height:1.6;color:var(--oi-ink2,#46413a)}
.osc>div{display:grid;grid-template-columns:74px 1fr;border-top:1px solid var(--oi-line,#d9d0c0)}.osc>div:first-child{border-top:0}
.osc>div>b{display:grid;place-items:center;padding:8px 4px;font-family:var(--serif,serif);font-size:12.5px;font-weight:900;color:var(--oi-ink,#171512);border-right:1px solid var(--oi-line,#d9d0c0);text-align:center}
.osc>div>p{margin:0;padding:8px 10px}.osc .pd>b{color:var(--oi-acc,#a3261f)}
.osc .pr s{color:var(--oi-mute,#857e74);margin-right:4px}.osc .pr strong{color:var(--oi-ink,#171512)}
.osc .nt{display:block;padding:8px 10px;border-top:1px solid var(--oi-line,#d9d0c0);font-size:11px;color:var(--oi-mute,#857e74)}`;
function css(){ if(document.getElementById('oiCss')) return; const s=document.createElement('style'); s.id='oiCss'; s.textContent=CSS; document.head.appendChild(s); }
function mount(el,o){ o=o||{}; css(); const V=VOICE[o.voice]||VOICE.plain, max=o.max||2; const v=get();
  el.innerHTML=`<div class="oi"><div class="h"><b>${V.h}</b><small>${V.hs}</small></div>
   <div class="cs tp">${TOPICS.map(t=>`<button type="button" data-k="${t.k}" class="${v.topics.includes(t.k)?'on':''}">${t.l}</button>`).join('')}</div>
   <div class="h"><b>${V.st}</b></div>
   <div class="cs st">${STATUS.map(t=>`<button type="button" data-k="${t.k}" class="${v.status===t.k?'on':''}">${t.l}</button>`).join('')}</div>
   <div class="h"><b>${V.w}</b><small>${V.ws}</small></div>
   <textarea maxlength="120" rows="2" placeholder="${esc(V.ph)}">${esc(v.worry)}</textarea>
   <div class="wc"><span>${V.pv}</span><span class="n">${(v.worry||'').length}/120</span></div></div>`;
  el.querySelector('.tp').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const s=get(); const k=b.dataset.k;
    if(s.topics.includes(k)) s.topics=s.topics.filter(x=>x!==k); else { s.topics.push(k); if(s.topics.length>max) s.topics.shift(); }
    put(s); el.querySelectorAll('.tp button').forEach(x=>x.classList.toggle('on',s.topics.includes(x.dataset.k))); });
  el.querySelector('.st').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const s=get(); s.status=s.status===b.dataset.k?'':b.dataset.k; put(s);
    el.querySelectorAll('.st button').forEach(x=>x.classList.toggle('on',x.dataset.k===s.status)); });
  const ta=el.querySelector('textarea'), n=el.querySelector('.wc .n');
  ta.addEventListener('input',()=>{ const s=get(); s.worry=ta.value.slice(0,120); put(s); n.textContent=s.worry.length+'/120'; }); }
function value(){ const v=get(); v.worry=String(v.worry||'').replace(/\s+/g,' ').trim().slice(0,120); return v; }
const topic=k=>TOPICS.find(t=>t.k===k)||null, status=k=>STATUS.find(t=>t.k===k)||null;
window.ObIntake={TOPICS,STATUS,mount,value,topic,status};
function html(o){ css(); return `<div class="osc"><div><b>무료</b><p>${o.free.join(' · ')}</p></div><div class="pd"><b>결제하면</b><p>${o.paid.join(' · ')}</p></div><div class="pr"><b>가격</b><p>${o.was?`<s>${o.was}</s>`:''}<strong>${o.price}</strong>${o.tag?` · ${o.tag}`:''}</p></div><span class="nt">${o.note||'결제하면 바로 열립니다. 디지털 콘텐츠라 열람한 뒤에는 환불이 제한되며, 무료 부분은 결제 전에 충분히 보실 수 있습니다.'}</span></div>`; }
window.ObScope={html};
})();
