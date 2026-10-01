/* 보관함 — 각 메뉴에서 본 결과를 자동으로 모아 두고, 홈 보관함에서 다시 연다.
   저장: localStorage(가능하면) + sessionStorage. 항목 {id,k,menu,h,sub,s,img,url,me,form,lines,at,re}
   다시 열기: url#re → 메뉴 인트로 생략 → 저장해 둔 입력값을 채우고 풀이 버튼을 대신 누름 */
(()=>{
  const KEY='obArch', MAX=40;
  const read=()=>{ for(const st of ['localStorage','sessionStorage']){ try{ const v=window[st].getItem(KEY); if(v) return JSON.parse(v)||[]; }catch(e){} } return []; };
  const write=a=>{ const s=JSON.stringify(a.slice(0,MAX)); ['localStorage','sessionStorage'].forEach(st=>{ try{ window[st].setItem(KEY,s); }catch(e){} }); };
  const abs=u=>{ try{ return new URL(u,location.href).href; }catch(e){ return u; } };
  const T=s=>(s||'').replace(/\s+/g,' ').trim();
  const $=s=>document.querySelector(s);
  const tx=s=>{ const e=$(s); return e?T(e.textContent):''; };
  const vis=s=>{ const e=$(s); return !!e&&(e.classList.contains('on')||(e.offsetParent!==null&&getComputedStyle(e).opacity>.5)); };
  const bgOf=s=>{ const e=$(s); if(!e) return ''; const m=(e.style.backgroundImage||getComputedStyle(e).backgroundImage||'').match(/url\(["']?([^"')]+)/); return m?m[1]:''; };
  const me=()=>{ try{ return JSON.parse(sessionStorage.getItem('me')||'null'); }catch(e){ return null; } };
  const page=(location.pathname.match(/([a-z]+)(\.html)?$/i)||[])[1]||'';
  const isTarot=/\/tarot\/?(index\.html)?$/.test(location.pathname)||page==='tarot';
  const isAvatar=/\/avatar\/?(index\.html)?$/.test(location.pathname)||page==='avatar';
  const key=isTarot?'tarot':isAvatar?'avatar':page;

  /* 입력 화면 상태(선택 버튼 + 입력칸) 저장/복원 */
  function formState(root){ if(!root) return null; const f={seg:[],val:[]};
    root.querySelectorAll('button.on').forEach(b=>{ const at=['data-v','data-p','data-k','data-n'].find(a=>b.hasAttribute(a)); const p=b.parentElement&&b.parentElement.closest('[id]'); if(at&&p) f.seg.push([p.id,b.getAttribute(at),at]); });
    root.querySelectorAll('input[id],select[id]').forEach(i=>{ if(i.type==='checkbox') f.val.push([i.id,i.checked?'1':'']); else f.val.push([i.id,i.value]); });
    return f; }
  function restore(f){ if(!f) return;
    (f.seg||[]).forEach(([p,v,at])=>{ const b=document.querySelector(`#${CSS.escape(p)} button[${at||'data-v'}="${CSS.escape(v)}"]`); if(b&&!b.classList.contains('on')) b.click(); });
    (f.val||[]).forEach(([id,v])=>{ const e=document.getElementById(id); if(!e) return; if(e.type==='checkbox') e.checked=!!v; else e.value=v; e.dispatchEvent(new Event('change',{bubbles:true})); });
    (f.val||[]).forEach(([id,v])=>{ const e=document.getElementById(id); if(e&&e.tagName==='SELECT'&&e.value!==v){ e.value=v; e.dispatchEvent(new Event('change',{bubbles:true})); } }); }

  /* 메뉴별: 결과가 떴는지, 무엇을 남길지 */
  const CFG={
    today:{menu:'오늘의 운세',img:'img/seoha.jpg',form:'#sIn',ready:()=>vis('#sOut')&&tx('#mT'),
      get:()=>({h:tx('#mT'),s:tx('#sc'),sub:`${tx('#dT')} · ${tx('#dGz')}일`,lines:[tx('#sayT'),tx('#kw')]}),re:true,auto:true},
    sinnyeon:{menu:'2027 신년운세',img:'img/halmae.jpg',form:'#sIntro',ready:()=>vis('#sRep')&&tx('#ySc'),
      get:()=>({h:T(($('#yLbl')||{}).firstChild?.textContent)||'2027년 총운',s:tx('#ySc').split('/')[0],sub:tx('#rTitle'),lines:[tx('#qTop'),tx('#yTx').slice(0,90)]}),re:true},
    lifetime:{menu:'평생 사주',img:'img/jeongtong.jpg',form:'#sIntro',ready:()=>vis('#sRep')&&tx('#qTop'),
      get:()=>({h:tx('#qTop').split('.')[0],s:'',sub:tx('#rTitle'),lines:[tx('#qTop'),tx('#giT').slice(0,90)]}),re:true},
    taegil:{menu:'택일',img:'img/taegil.jpg',form:'#sIn',ready:()=>vis('#sOut')&&tx('#oT'),
      get:()=>({h:tx('#oT'),s:'',sub:tx('#oK'),lines:[tx('#qT')]}),re:true},
    career:{menu:'커리어 사주',img:'img/earth.jpg',form:'#sIn',ready:()=>vis('#sOut')&&tx('#tNm'),
      get:()=>({h:tx('#tNm'),s:'',sub:tx('#tEn'),lines:[tx('#tDesc')]}),re:true},
    gunghap:{menu:'도화 궁합',img:'img/taeo/wink.jpg',form:null,ready:()=>tx('#sc')&&tx('#scT')&&vis('#sc'),
      get:()=>({h:tx('#scT'),s:tx('#sc'),sub:`${tx('#nA')} × ${tx('#nB')}`,lines:[tx('#say')]}),re:false},
    dohwa:{menu:'도화 사주',img:'img/taeo/base.jpg',form:null,ready:()=>vis('#result')&&tx('#rType'),
      get:()=>({h:tx('#rType'),s:(tx('#rIdx').match(/\d+/)||[''])[0],sub:tx('#rName'),lines:[tx('#rDesc'),tx('#rSay')]}),re:false},
    tarot:{menu:'무진의 타로',img:'img/tarot/poster.jpg',form:null,ready:()=>vis('#s4')&&tx('#vBig'),
      get:()=>({h:tx('#vBig'),s:'',sub:T(($('#qin')||{}).value)||tx('#vH'),lines:[tx('#vLine'),tx('#vTime')]}),re:false},
    free:{menu:()=>'무료 · '+(document.body.dataset.menu||'테스트'),img:'',form:null,ready:()=>vis('#sRs')&&tx('#rT'),
      get:()=>({h:tx('#rT'),s:(tx('#rV [data-cnt]')||''),sub:tx('#rK'),lines:[tx('#rP'),tx('#sayT')],img:bgOf('#rH')}),re:false},
    bujeok:{menu:'부적 카드',img:'img/card/wood.jpg',form:null,ready:()=>document.body.dataset.bjGot==='1'&&tx('#cT')&&tx('#rar'),
      get:()=>({h:tx('#cT'),s:tx('#rar'),sub:tx('#cB'),lines:[tx('#bT')],img:bgOf('#face')||'img/card/wood.jpg'}),re:false},
    myodang:{menu:'묘당 · 고양이 점집',img:'img/cat/madam.jpg',form:null,ready:()=>vis('#res')&&tx('#res'),
      get:()=>({h:tx('#res .rh b')||tx('#res .ans b'),s:tx('#res .ring em'),sub:'묘당 · '+tx('#ptN'),lines:[tx('#bub')],img:bgOf('#pt')}),re:false},
    dangbeon:{menu:'오늘의 당번',img:'img/mini/tong.jpg',form:null,ready:()=>vis('#got')&&tx('#say'),
      get:()=>({h:tx('#ex'),s:'',sub:'오늘의 당번 · '+tx('#dK'),lines:[tx('#say')],img:bgOf('#stamp')}),re:false},
    ppopgi:{menu:'오방 뽑기',img:'img/mini/tong.jpg',form:null,ready:()=>vis('#sRs')&&tx('#rName'),
      get:()=>({h:tx('#rName'),s:tx('#rGrade'),sub:'오방 뽑기 · '+tx('#rTopic'),lines:[tx('#rLine')],img:bgOf('#rMini')}),re:false},
    obgh:{menu:'오방 궁합',img:'img/kv_house.jpg',form:null,ready:()=>vis('#sOut')&&tx('#wN'),
      get:()=>({h:'1위 '+tx('#wN'),s:tx('#sc'),sub:'다섯 신과 나의 궁합',lines:[tx('#wQ'),tx('#why .why b')],img:bgOf('#win')}),re:false},
    avatar:{menu:'사주가 그린 나',img:'',form:'#sIn',ready:()=>vis('#sOut')&&tx('#oT'),
      get:()=>({h:tx('#oT'),s:'',sub:tx('#oK'),lines:[tx('#oP')],img:bgOf('#pt')}),re:true,auto:true}
  };
  const C=CFG[key];

  function save(){ if(!C) return; const g=C.get(); if(!g.h) return;
    const m=me(), sig=[key,g.h,g.s,g.sub].join('|');
    if(save.last===sig) return; if(save.pend!==sig){ save.pend=sig; return; } /* 숫자 카운트업 중에는 저장하지 않음: 두 번 연속 같을 때만 */ save.last=sig;
    const it={id:sig,k:key,menu:typeof C.menu==='function'?C.menu():C.menu,h:g.h,s:g.s||'',sub:g.sub||'',lines:(g.lines||[]).filter(Boolean).slice(0,3),img:abs(g.img||C.img),
      url:location.href.split('#')[0],me:m,form:C.form?formState($(C.form)):null,re:!!C.re,at:Date.now()};
    const a=read().filter(x=>x.id!==it.id); a.unshift(it); write(a); }
  if(C){ setInterval(()=>{ try{ if(C.ready()) save(); }catch(e){} },1200); }

  /* 보관함에서 다시 열기 */
  if(location.hash==='#re'){ let it=null; try{ it=JSON.parse(sessionStorage.getItem('obRe')||'null'); }catch(e){}
    setTimeout(()=>{ try{ sessionStorage.removeItem('obRe'); }catch(e){} },4000); /* 메뉴 인트로가 이 표시를 보고 건너뜀 */
    if(it&&it.me){ try{ sessionStorage.setItem('me',JSON.stringify(it.me)); }catch(e){} }
    history.replaceState(null,'',location.pathname+location.search);
    if(it&&C&&C.re){ setTimeout(()=>{ restore(it.form); const go=document.getElementById('goBtn'); if(go&&!C.auto&&!C.ready()) setTimeout(()=>go.click(),120); },450); } }

  window.ObArch={ list:read, clear:()=>write([]), remove:id=>write(read().filter(x=>x.id!==id)),
    open:it=>{ try{ sessionStorage.setItem('obRe',JSON.stringify(it)); sessionStorage.setItem('toHome','1'); }catch(e){} location.href=it.url+(it.re?'#re':''); } };
})();
