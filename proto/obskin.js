/* 오방도감 홈 디자인 스위치 (10/4 10:50)
   번호: 1 지금 그대로 · 2 지금 + 탭 알약(skP) · 3 2 + 둥근 칸(skP skR) · 4 한지 라이트(skB) · 5 카드형 모던(skD)
   기본 짝 PAIR: [어두운 화면, 밝은 화면]. 홈 머리의 해 · 달 버튼 한 번에 바뀌고, 고른 것은 이 기기에 기억(localStorage 'obSkin').
   처음 오는 사람이 보는 화면은 DEFAULT 숫자 하나로 정한다. 주소 뒤 ?skin=번호 는 미리보기용(기억하지 않음). */
(function(){
 var DEFAULT=2, PAIR=[2,5], KEY='obSkin';
 var MAP={1:'',2:'skP',3:'skP skR',4:'skB',5:'skD',6:'skE'};
 var ALL=['skA','skB','skC','skD','skE','skP','skR'], LIGHT={4:1,5:1};
 var q=null, saved=null;
 try{ q=new URLSearchParams(location.search).get('skin'); }catch(e){}
 try{ saved=localStorage.getItem(KEY); }catch(e){}
 var k=MAP[q]!=null?q:(MAP[saved]!=null?saved:DEFAULT);
 function apply(n){ var r=document.documentElement; ALL.forEach(function(x){ r.classList.remove(x); }); (MAP[n]||'').split(' ').forEach(function(x){ if(x) r.classList.add(x); }); }
 apply(k);
 var SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M5.4 18.6l1.5-1.5M17.1 6.9l1.5-1.5"/></svg>';
 var MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
 function paint(b){ var lt=!!LIGHT[window.OB_SKIN.now]; b.innerHTML=lt?MOON:SUN; b.setAttribute('aria-label',lt?'어두운 화면으로 바꾸기':'밝은 화면으로 바꾸기'); b.title=lt?'어두운 화면':'밝은 화면'; }
 window.OB_SKIN={now:+k,map:MAP,pair:PAIR,
  set:function(n,keep){ apply(n); this.now=+n; if(keep){ try{ localStorage.setItem(KEY,String(n)); }catch(e){} } var b=document.getElementById('hSkin'); if(b) paint(b); },
  toggle:function(){ this.set(LIGHT[this.now]?PAIR[0]:PAIR[1],true); }};
 function mount(){ if(document.getElementById('hSkin')) return; var ic=document.querySelector('.home .hIc'); if(!ic) return;
  var b=document.createElement('button'); b.id='hSkin'; b.type='button'; paint(b);
  b.addEventListener('click',function(){ window.OB_SKIN.toggle(); });
  var bell=document.getElementById('hBell'); ic.insertBefore(b,bell&&bell.parentNode===ic?bell:null); }
 if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount); else mount();
})();
