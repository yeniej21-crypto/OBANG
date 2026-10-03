/* ObAuth — 로그인 · 회원가입을 한 파일에서 (10/3)
   모드
   - live : Supabase Auth(카카오 · 구글). 처음 로그인하면 자동 가입.
   - mock : 키가 아직 없을 때. 같은 화면 · 같은 흐름으로 동작하고 이 기기에만 저장(체험판 표시).
   설정은 /api/config(넷리파이 함수)가 환경변수 SUPABASE_URL · SUPABASE_ANON_KEY에서 내려 준다. 코드에는 키를 넣지 않는다.
   화면에서 쓰는 법
   - ObAuth.ready.then(user=>…)        첫 확인이 끝나면
   - ObAuth.user()                       지금 사용자(없으면 null)
   - ObAuth.require({reason}).then(u=>…) 로그인 안 했으면 로그인 창 → 끝나면 이어서
   - ObAuth.open() / ObAuth.account()    로그인 창 / 내 계정 창
   - ObAuth.signOut() · ObAuth.on(cb)    로그아웃 · 바뀔 때 알림
   - ObAuth.takePending()                카카오 · 구글 다녀온 뒤 이어서 할 일({pay:true} 등)을 한 번 꺼냄 */
(function(){
  if(window.ObAuth) return;
  var MOCK_KEY='obAuthMock', NEXT_KEY='obAuthNext';
  var cfg={mode:'mock'}, sb=null, me=null, subs=[], waiters=[], el=null, readyResolve;
  var ready=new Promise(function(r){ readyResolve=r; });
  function emit(){ subs.forEach(function(f){ try{ f(me); }catch(e){} }); if(me){ var w=waiters.splice(0); w.forEach(function(f){ try{ f(me); }catch(e){} }); } }
  function norm(u){ if(!u) return null; var m=u.user_metadata||{}; return {id:u.id,name:m.name||m.full_name||m.nickname||m.preferred_username||'',email:u.email||'',avatar:m.avatar_url||m.picture||'',provider:(u.app_metadata&&u.app_metadata.provider)||'',mock:false}; }
  function loadScript(src){ return new Promise(function(ok,no){ var s=document.createElement('script'); s.src=src; s.onload=ok; s.onerror=no; document.head.appendChild(s); }); }
  function toast(t){ var d=document.createElement('div'); d.className='oba-t'; d.textContent=t; document.body.appendChild(d); requestAnimationFrame(function(){ d.classList.add('on'); }); setTimeout(function(){ d.classList.remove('on'); setTimeout(function(){ d.remove(); },400); },2200); }
  (async function(){
    try{ var r=await fetch('/api/config',{cache:'no-store'}); if(r.ok){ var j=await r.json(); if(j&&j.mode) cfg=j; } }catch(e){}
    if(cfg.mode==='live'&&cfg.url&&cfg.anon){
      try{ await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js');
        sb=window.supabase.createClient(cfg.url,cfg.anon,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}});
        var s=await sb.auth.getSession(); me=norm(s&&s.data&&s.data.session&&s.data.session.user);
        sb.auth.onAuthStateChange(function(ev,ss){ me=norm(ss&&ss.user); emit(); });
      }catch(e){ cfg={mode:'mock'}; sb=null; }
    }
    if(cfg.mode!=='live'){ try{ me=JSON.parse(localStorage.getItem(MOCK_KEY)||'null'); }catch(e){ me=null; } }
    readyResolve(me); emit();
    try{ var n=JSON.parse(sessionStorage.getItem(NEXT_KEY)||'null'); if(n&&me&&n.back) toast((me.name?me.name+', ':'')+'로그인됐어요'); }catch(e){}
  })();

  /* ---------- 화면 ---------- */
  var CSS='.oba{position:fixed;inset:0;z-index:2147482000;display:flex;align-items:flex-end;justify-content:center;background:rgba(5,4,7,0);transition:background .35s;pointer-events:none}'
   +'.oba.on{background:rgba(5,4,7,.62);pointer-events:auto}'
   +'.oba .pn{position:relative;width:100%;max-width:520px;background:#141117;color:#f6ecdf;border-top:1px solid rgba(232,196,138,.35);padding:30px 22px calc(env(safe-area-inset-bottom,0px) + 24px);transform:translateY(100%);transition:transform .38s cubic-bezier(.2,.8,.2,1);font-family:"Noto Sans KR",sans-serif}'
   +'.oba.on .pn{transform:none}'
   +'.oba .x{position:absolute;right:10px;top:10px;border:0;background:none;color:rgba(246,236,223,.6);font:500 14px/1 "Noto Sans KR",sans-serif;padding:10px;cursor:pointer}'
   +'.oba h3{margin:0;font-family:"Song Myung","Noto Serif KR",serif;font-weight:400;font-size:24px;letter-spacing:.02em}'
   +'.oba p.s{margin:10px 0 22px;font-size:14.5px;line-height:1.6;color:rgba(246,236,223,.72)}'
   +'.oba .b{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;height:54px;margin-top:10px;border:0;font:700 16px/1 "Noto Sans KR",sans-serif;cursor:pointer}'
   +'.oba .b.k{background:#FEE500;color:rgba(0,0,0,.86)}'
   +'.oba .b.g{background:#fff;color:#1f1f1f}'
   +'.oba .b.o{background:none;color:#f6ecdf;border:1px solid rgba(246,236,223,.2)}'
   +'.oba .b:disabled{opacity:.6}'
   +'.oba .n{margin:16px 0 0;font-size:12.5px;line-height:1.6;color:rgba(246,236,223,.5)}'
   +'.oba .mk{display:inline-block;margin-bottom:12px;font-size:12px;font-weight:700;color:#1a130b;background:#e8c48a;padding:4px 8px}'
   +'.oba .me{display:flex;align-items:center;gap:14px;margin:6px 0 18px}'
   +'.oba .me i{flex:none;width:52px;height:52px;border-radius:50%;background:#2a2430 center/cover;display:grid;place-items:center;font-style:normal;font-family:"Song Myung",serif;font-size:22px;color:#e8c48a}'
   +'.oba .me b{display:block;font-size:17px}.oba .me small{display:block;margin-top:4px;font-size:13px;color:rgba(246,236,223,.6)}'
   +'.oba-t{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 96px);transform:translate(-50%,10px);z-index:2147482001;background:rgba(20,17,23,.94);color:#f6ecdf;font:500 14px/1.4 "Noto Sans KR",sans-serif;padding:11px 16px;opacity:0;transition:all .3s;pointer-events:none}'
   +'.oba-t.on{opacity:1;transform:translate(-50%,0)}'
   +'.oba-row{display:flex;align-items:center;gap:12px;width:100%;margin:4px 0 10px;padding:14px 4px;border:0;border-bottom:1px solid rgba(255,240,220,.1);background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}'
   +'.oba-row i{flex:none;width:36px;height:36px;border-radius:50%;background:#2a2430 center/cover;display:grid;place-items:center;font-style:normal;color:#e8c48a;font-family:"Song Myung",serif}'
   +'.oba-row b{display:block;font-size:15px}.oba-row small{display:block;margin-top:2px;font-size:12.5px;opacity:.6}';
  function ensure(){ if(el) return; var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
    el=document.createElement('div'); el.className='oba'; el.innerHTML='<div class="pn" role="dialog" aria-modal="true"></div>'; document.body.appendChild(el);
    el.addEventListener('click',function(e){ if(e.target===el||e.target.closest('[data-x]')) close(); }); }
  function close(){ if(el) el.classList.remove('on'); }
  function show(html){ ensure(); el.querySelector('.pn').innerHTML='<button class="x" type="button" data-x>닫기</button>'+html; requestAnimationFrame(function(){ el.classList.add('on'); }); }
  var K_ICON='<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#000" d="M12 3.5c-5 0-9 3.1-9 7 0 2.5 1.7 4.7 4.2 5.9l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.3 0 .7.1 1 .1 5 0 9-3.1 9-7s-4-7.2-9-7.2z"/></svg>';
  var G_ICON='<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"/><path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>';
  function open(o){ o=o||{};
    show((cfg.mode!=='live'?'<span class="mk">체험판 로그인 · 실제 계정과 연결되지 않아요</span>':'')
      +'<h3>'+(o.title||'남기려면, 로그인')+'</h3>'
      +'<p class="s">'+(o.reason||'본 결과는 보관함에 남고, 결제한 풀이는 언제든 다시 열려요.')+'</p>'
      +'<button class="b k" type="button" data-p="kakao">'+K_ICON+'카카오로 시작하기</button>'
      +'<button class="b g" type="button" data-p="google">'+G_ICON+'Google로 계속하기</button>'
      +'<p class="n">처음이면 자동으로 가입돼요. 계속하면 이용약관과 개인정보처리방침에 동의하게 돼요.</p>');
    el.querySelectorAll('[data-p]').forEach(function(b){ b.onclick=function(){ signIn(b.dataset.p,o); }; }); }
  async function signIn(p,o){ o=o||{};
    try{ sessionStorage.setItem(NEXT_KEY,JSON.stringify({back:true,pay:!!o.pay,at:Date.now()})); }catch(e){}
    if(cfg.mode==='live'&&sb){
      el.querySelectorAll('.b').forEach(function(b){ b.disabled=true; });
      var opt={redirectTo:location.href.split('#')[0]}; if(p==='kakao') opt.scopes='profile_nickname profile_image';
      var r=await sb.auth.signInWithOAuth({provider:p,options:opt});
      if(r&&r.error){ el.querySelectorAll('.b').forEach(function(b){ b.disabled=false; }); toast('로그인을 시작하지 못했어요. 잠시 뒤 다시 해 줘'); }
      return; }
    me={id:'mock-'+Math.random().toString(36).slice(2,10),name:'',email:'',avatar:'',provider:p,mock:true};
    try{ var m=JSON.parse(sessionStorage.getItem('me')||'null'); if(m&&m.name) me.name=m.name; }catch(e){}
    try{ localStorage.setItem(MOCK_KEY,JSON.stringify(me)); sessionStorage.removeItem(NEXT_KEY); }catch(e){}
    close(); toast((me.name?me.name+', ':'')+'로그인됐어요'); emit(); }
  async function signOut(){ if(sb){ try{ await sb.auth.signOut(); }catch(e){} } try{ localStorage.removeItem(MOCK_KEY); }catch(e){} me=null; emit(); close(); toast('로그아웃했어요'); }
  function account(){ if(!me) return open();
    var pv={kakao:'카카오',google:'Google'}[me.provider]||me.provider||'';
    show('<h3>내 계정</h3><div class="me"><i'+(me.avatar?' style="background-image:url(\''+me.avatar+'\')"':'')+'>'+(me.avatar?'':((me.name||'나').slice(0,1)))+'</i><div><b>'+(me.name||'이름 없음')+'</b><small>'+(pv?pv+'로 로그인':'')+(me.mock?' · 체험판':'')+'</small></div></div>'
      +'<button class="b o" type="button" data-arch>보관함 보기</button><button class="b o" type="button" data-out>로그아웃</button>'
      +'<p class="n">회원 탈퇴는 고객센터로 요청하면 바로 처리해요. 탈퇴하면 결과와 생년월일 정보는 바로 지우고, 결제 기록만 법에서 정한 기간 동안 보관해요.</p>');
    el.querySelector('[data-out]').onclick=signOut;
    el.querySelector('[data-arch]').onclick=function(){ close(); var t=document.querySelector('#tabs [data-t="arch"]'); if(t) t.click(); else location.href='./'; }; }
  function require(o){ return ready.then(function(){ if(me) return me; return new Promise(function(res){ waiters.push(res); open(o); }); }); }
  function takePending(){ try{ var n=JSON.parse(sessionStorage.getItem(NEXT_KEY)||'null'); sessionStorage.removeItem(NEXT_KEY); return me?n:null; }catch(e){ return null; } }
  /* 홈 전체 메뉴 맨 위에 로그인 · 내 계정 줄 */
  function menuRow(){ var hd=document.querySelector('#hMenuS .in .hd'); if(!hd) return; var row=document.getElementById('obaRow');
    if(!row){ ensure(); row=document.createElement('button'); row.type='button'; row.id='obaRow'; row.className='oba-row'; hd.insertAdjacentElement('afterend',row); row.addEventListener('click',function(e){ e.stopPropagation(); var m=document.getElementById('hMenuS'); if(m) m.classList.remove('on'); me?account():open(); }); }
    row.innerHTML=me?'<i'+(me.avatar?' style="background-image:url(\''+me.avatar+'\')"':'')+'>'+(me.avatar?'':((me.name||'나').slice(0,1)))+'</i><span><b>'+(me.name||'내 계정')+'</b><small>내 계정 · 보관함</small></span>':'<i>入</i><span><b>로그인 · 회원가입</b><small>카카오 · Google로 3초</small></span>'; }
  subs.push(menuRow);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',menuRow); else menuRow();
  window.ObAuth={ready:ready,user:function(){ return me; },require:require,open:open,account:account,signOut:signOut,on:function(f){ subs.push(f); },takePending:takePending,mode:function(){ return cfg.mode; }};
})();
