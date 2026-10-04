/* 오방도감 홈 디자인 고르기(10/4). 기본값 DEFAULT 한 글자만 바꾸면 홈 3종이 같이 바뀐다. 미리보기: 주소 뒤 ?skin=1~5
   1 지금 그대로 · 2 위 분류 탭 알약 · 3 탭 알약 + 칸 둥근 카드 · 4 한지 라이트 · 5 카드형 모던(밝은 바탕) */
(function(){ var DEFAULT=2;
 var MAP={1:'',2:'skP',3:'skP skR',4:'skB',5:'skD',6:'skE'};
 var q=null; try{ q=new URLSearchParams(location.search).get('skin'); }catch(e){}
 var k=MAP[q]!=null?q:DEFAULT; var c=MAP[k]; if(c) c.split(' ').forEach(function(x){ document.documentElement.classList.add(x); });
 window.OB_SKIN={now:+k,map:MAP,set:function(n){ var r=document.documentElement; ['skA','skB','skC','skD','skE','skP','skR'].forEach(function(x){ r.classList.remove(x); }); (MAP[n]||'').split(' ').forEach(function(x){ if(x) r.classList.add(x); }); this.now=+n; }};
})();
