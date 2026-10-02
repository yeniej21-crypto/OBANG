/* 오방사주 결제 시트 — 모든 유료 메뉴가 같은 결제 화면을 쓴다(체험판은 모의 결제).
   결제 버튼(#payBtn 등)을 누르면 먼저 이 시트가 뜨고, 결제가 끝나면 원래 버튼 동작(상세 풀이 열기)이 이어진다.
   정식 오픈 때는 pay() 안의 모의 처리만 부트페이 호출로 바꾸면 된다. */
(function(){
if(window.ObPay) return;
const file=(location.pathname.split('/').pop()||'index.html'), q=new URLSearchParams(location.search);
const isHome=!!document.getElementById('op')&&!!document.getElementById('home');
const $=id=>document.getElementById(id);
const P={
 'dohwa.html':{btn:'payBtn',name:'도화 사주 · 태오의 도화 편지',who:'태오',desc:'앞으로 열두 달 인연 달력 · 끌리는 사람 · 도화 살리는 법 · 음성 편지',price:14900,was:19800,img:'img/taeo/base.jpg',after:()=>$('payNow')&&$('payNow').click()},
 'gunghap.html':{btn:'payBtn',name:'도화 궁합 · 둘의 인연 타이밍',who:'태오',desc:'앞으로 열두 달 둘의 흐름 · 먼저 연락할 달 · 조심할 달',price:14900,img:'img/taeo/base.jpg'},
 'love2.html':q.get('m')==='next'?{btn:'payBtn',name:'다음 연애 · 서하의 인연 노트',who:'서하',desc:'인연이 오는 달 · 그 사람 · 만나는 장면 · 서하의 편지',price:9900,img:'img/seoha.jpg'}
   :{btn:'payBtn',name:'재회 사주 · 시온의 재회 노트',who:'시온',desc:'다시 닿는 시기 · 열두 달 흐름 · 먼저 연락해도 되는 날',price:14900,img:'img/sion.jpg'},
 'myeongri.html':{btn:'payBtn',name:'소헌 선생의 2027 명리 감정서',who:'명리관 소헌 선생',desc:'열두 달 월운 감정 · 영역별 감정 · 권고 · 길일표 · 감정서 저장',price:19900,was:29000,img:'img/soheon.jpg',skip:()=>$('pay')&&$('pay').classList.contains('done')},
 'sinnyeon.html':{btn:'payBtn',name:'2027 신년운세 · 할매의 열두 달',who:'삼신 할매',desc:'열두 달 상세 풀이 · 분야별 운 · 조심할 날',price:19900,was:29000,img:'img/halmae.jpg',skip:()=>$('pay')&&$('pay').classList.contains('done')},
 'lifetime.html':{btn:'payBtn',name:'평생 사주 · 현암의 상세 풀이',who:'현암',desc:'열 해씩 펼친 대운 · 재물 · 일 · 인연의 평생 결',price:39000,was:59000,img:'img/jeongtong.jpg',skip:()=>$('pay')&&$('pay').classList.contains('done')},
 'career.html':{btn:'payBtn',name:'커리어 사주 · 도준의 2027 로드맵',who:'도준',desc:'달별 액션 플랜 · 면접 · 입사일 택일',price:19900,img:'img/earth.jpg'},
 'taegil.html':{btn:'payBtn',name:'택일 · 정밀 택일',who:'월하',desc:'좋은 날의 시간대 · 방향 · 함께할 사람까지',price:9900,img:'img/taegil.jpg'},
 'tarot.html':{btn:'payBtn',name:'무진의 타로 · 전체 풀이',who:'무진',desc:'켈틱 크로스 10장 · 3개월 흐름',price:9900,img:'img/tarot/mujin.jpg'},
 'heart':{btn:'payBtn',name:'시온의 은거울 리포트',who:'시온',desc:'그 사람의 연애 방식 · 요즘 왜 그럴까 · 앞으로 석 달 · 보낼 문장 세 가지 · 다시 볼 날',price:19900,img:'img/sion.jpg'},
 'obgh.html':{btn:'pay',name:'오방 궁합 · 다섯 신의 편지',who:'오방신',desc:'다섯 신과의 궁합 전체 · 신의 편지',price:9900,img:'img/intro0.jpg'},
 'home':{btn:'payGo',name:'그 사람 속마음 · 시온의 리포트',who:'시온',desc:'속마음 전문 · 다시 닿는 시기 · 열두 달 흐름 · 개운 처방',price:29000,was:39000,img:'img/sion.jpg',after:()=>ObPay.toast('체험판이라 리포트는 여기까지예요. 정식 오픈 때 열려요')}
};
const won=n=>n.toLocaleString('ko-KR')+'원';
const css=`.obp{position:absolute;inset:0;z-index:190;display:flex;flex-direction:column;justify-content:flex-end;background:rgba(0,0,0,.6);opacity:0;pointer-events:none;transition:opacity .25s}
.obp.on{opacity:1;pointer-events:auto}
.obp .in{position:relative;background:#141117;color:#f3ebde;padding:18px 18px calc(env(safe-area-inset-bottom,0px) + 16px);transform:translateY(24px);transition:transform .3s;font-family:"Noto Sans KR",sans-serif;max-height:94%;overflow-y:auto;border-top:1px solid rgba(233,201,139,.28)}
.obp.on .in{transform:none}
.obp .hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.obp .hd b{font-size:16px;font-weight:700}
.obp .hd button{border:0;background:none;color:rgba(243,235,222,.6);font-size:13px;cursor:pointer;padding:6px 2px;font-family:inherit}
.obp .pr{display:flex;gap:12px;align-items:center;padding-bottom:14px;border-bottom:1px solid rgba(243,235,222,.1)}
.obp .pr i{flex:none;width:58px;height:58px;background:#222 center 18%/cover no-repeat}
.obp .pr b{display:block;font-size:15px;font-weight:700;line-height:1.4}
.obp .pr small{display:block;margin-top:3px;font-size:12px;line-height:1.5;color:rgba(243,235,222,.55)}
.obp .ln{display:flex;justify-content:space-between;align-items:center;padding:10px 0;font-size:14px;color:rgba(243,235,222,.75)}
.obp .ln s{color:rgba(243,235,222,.4);margin-right:6px;font-size:13px}
.obp .ln.tot{border-top:1px solid rgba(243,235,222,.1);padding-top:12px;color:#f3ebde;font-weight:800;font-size:17px}
.obp .ln.tot em{font-style:normal;color:#E9C98B;font-size:20px}
.obp .cp{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:2px 0 4px;padding:11px 12px;border:1px dashed rgba(233,201,139,.45);font-size:13px;color:#E9C98B}
.obp .cp button{flex:none;border:0;background:#E9C98B;color:#17120a;font-size:12.5px;font-weight:800;padding:7px 10px;cursor:pointer;font-family:inherit}
.obp .cp.got{border-style:solid}
.obp .mt{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:12px 0}
.obp .mt button{height:44px;border:1px solid rgba(243,235,222,.18);background:transparent;color:rgba(243,235,222,.8);font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit}
.obp .mt button.on{border-color:#E9C98B;color:#E9C98B;background:rgba(233,201,139,.08)}
.obp label{display:flex;gap:10px;align-items:flex-start;font-size:12.5px;line-height:1.55;color:rgba(243,235,222,.7);cursor:pointer;margin:6px 0 14px}
.obp label input{margin-top:3px;accent-color:#D9B46A;width:16px;height:16px;flex:none}
.obp .go{width:100%;height:54px;border:0;background:#D9B46A;color:#17120a;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit}
.obp .go:disabled{opacity:.4;cursor:default}
.obp .nt{margin:10px 0 0;font-size:11.5px;color:rgba(243,235,222,.45);text-align:center}
.obp .done{position:absolute;inset:0;background:#141117;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center}
.obp .done.on{display:flex}
.obp .done i{width:64px;height:64px;border-radius:50%;border:2px solid #E9C98B;display:grid;place-items:center;color:#E9C98B}
.obp .done b{font-size:17px}
.obp .done small{font-size:13px;color:rgba(243,235,222,.6)}`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
function root(){ return document.querySelector('.stage')||document.body; }
function toast(t){ if(window.ObShare) return ObShare.toast(t); alert(t); }
let el=null, cur=null, disc=false, method='카드';
function build(){ el=document.createElement('div'); el.className='obp'; el.dataset.hj='0'; root().appendChild(el);
  el.addEventListener('click',e=>{ if(e.target===el||e.target.closest('[data-x]')) close(); }); }
function render(){ const p=cur, price=disc?Math.round(p.price/2/100)*100:p.price, today=p.trial?0:price;
  el.innerHTML=`<div class="in"><div class="hd"><b>결제하기</b><button type="button" data-x>닫기</button></div>
  <div class="pr"><i style="background-image:url('${p.img}')"></i><div><b>${p.name}</b><small>${p.desc}</small></div></div>
  <div class="ln"><span>상품 금액</span><span>${p.was?`<s>${won(p.was)}</s>`:''}${won(p.price)}</span></div>
  ${p.trial?'':`<div class="cp${disc?' got':''}">${disc?'<span>공유 할인 50% 적용됨</span>':'<span>결과를 공유하면 50% 할인</span><button type="button" data-share>공유하고 할인받기</button>'}</div>`}
  ${p.trial?`<div class="ln"><span>${p.trial}</span><span>${won(price)}/월</span></div>`:''}<div class="ln tot"><span>${p.trial?'오늘 결제 금액':'결제 금액'}</span><em>${won(today)}</em></div>
  <div class="mt">${['카드','카카오페이','네이버페이','토스페이'].map(m=>`<button type="button" class="${m===method?'on':''}" data-m="${m}">${m}</button>`).join('')}</div>
  <label><input type="checkbox" data-agree>${p.agree||'디지털 콘텐츠 특성상 풀이 열람을 시작하면 결제 취소가 제한되는 것을 확인했고, 구매 조건에 동의합니다.'}</label>
  <button class="go" type="button" data-pay disabled>${p.cta||won(today)+' 결제하기'}</button>
  <p class="nt">체험판에서는 실제로 결제되지 않아요</p>
  <div class="done"><i><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></i><b>${p.okTitle||'결제가 완료됐어요'}</b><small>${p.okText||p.who+'의 풀이를 여는 중이에요'}</small></div></div>`;
  el.onclick=null; const ag=el.querySelector('[data-agree]'), go=el.querySelector('[data-pay]');
  ag.onchange=()=>go.disabled=!ag.checked;
  el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ method=b.dataset.m; el.querySelectorAll('[data-m]').forEach(x=>x.classList.toggle('on',x===b)); });
  const sh=el.querySelector('[data-share]'); if(sh) sh.onclick=shareForDiscount;
  go.onclick=pay; }
function shareForDiscount(){ const b=document.querySelector('.obs-btn')||$('shareBtn')||$('ctaShare');
  const on=()=>{ window.removeEventListener('obshare:done',on); disc=true; const ag=el.querySelector('[data-agree]').checked; render(); if(ag){ el.querySelector('[data-agree]').checked=true; el.querySelector('[data-pay]').disabled=false; } };
  window.addEventListener('obshare:done',on);
  if(b) b.click(); else toast('이 화면은 공유 카드가 아직 없어요'); }
async function pay(){ const go=el.querySelector('[data-pay]'); go.disabled=true; go.textContent='결제 중';
  await new Promise(r=>setTimeout(r,1000)); el.querySelector('.done').classList.add('on');
  await new Promise(r=>setTimeout(r,1100)); close(); const p=cur; p._paid=true; const b=$(p.btn); if(b) b.dataset.obpaid='1';
  if(p.after) p.after(); else if(b) b.click(); }
function open(p){ if(!el) build(); cur=p; disc=false; render(); requestAnimationFrame(()=>el.classList.add('on')); }
function close(){ if(el) el.classList.remove('on'); }
const key=isHome?'home':file, C=P[key];
if(C) document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('#'+C.btn); if(!b) return; if(b.dataset.obpaid==='1') return; if(C.skip&&C.skip()) return;
  e.preventDefault(); e.stopImmediatePropagation(); open(C); },true);
window.ObPay={open,close,toast,products:P};
/* 알림 받기: 브라우저가 알림을 받을 수 있으면(안드로이드 · PC) 웹 알림, 아니면(아이폰) 카카오톡 */
const canPush=('Notification' in window)&&('serviceWorker' in navigator)&&('PushManager' in window);
function ask(o){ return new Promise(res=>{ if(!el) build(); const kakaoFirst=!canPush;
  el.innerHTML=`<div class="in"><div class="hd"><b>${o.title||'알림 받기'}</b><button type="button" data-x>닫기</button></div>
  ${o.img?`<div class="pr"><i style="background-image:url('${o.img}');border-radius:50%"></i><div><b>${o.head||''}</b><small>${o.sub||''}</small></div></div>`:''}
  <div style="display:grid;gap:8px;margin-top:14px">${kakaoFirst
   ?`<button class="go" type="button" data-k>카카오톡으로 받기</button><p class="nt" style="margin:2px 0 0">아이폰은 사파리에서 '홈 화면에 추가'를 하면 알림도 받을 수 있어요</p>`
   :`<button class="go" type="button" data-p>이 기기로 알림 받기</button><button type="button" data-k style="height:48px;border:1px solid rgba(243,235,222,.22);background:transparent;color:#f3ebde;font-size:14.5px;font-weight:600;cursor:pointer;font-family:inherit">카카오톡으로 받기</button>`}
  <button type="button" data-n style="border:0;background:none;color:rgba(243,235,222,.55);font-size:13px;padding:8px;cursor:pointer;font-family:inherit">다음에</button></div></div>`;
  const fin=v=>{ close(); res(v); };
  el.onclick=e=>{ if(e.target===el||e.target.closest('[data-x]')||e.target.closest('[data-n]')) return fin(null);
    if(e.target.closest('[data-k]')){ toast('정식 오픈 때 오방사주 카카오톡 채널로 연결돼요'); return fin('kakao'); }
    if(e.target.closest('[data-p]')){ try{ Notification.requestPermission().then(()=>fin('push'),()=>fin('push')); }catch(_){ fin('push'); } } };
  requestAnimationFrame(()=>el.classList.add('on')); }); }
window.ObNotify={ask,canPush};

})();
