const {chromium}=require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); });
 await p.goto('http://localhost:8812/myeongri.html'); await p.waitForTimeout(2500);
 await p.evaluate(()=>{ document.getElementById('enterBtn').click(); }); await p.waitForTimeout(1800);
 console.log(await p.evaluate(()=>{ const s=$('sub'); return JSON.stringify({th:$('th').getBoundingClientRect().bottom, rq:document.querySelector('#sIntro .req').getBoundingClientRect().top, st:$('stage').getBoundingClientRect(), sb:s.style.getPropertyValue('--sb'), cls:s.className, r:s.getBoundingClientRect(), op:s.offsetParent&&s.offsetParent.id}); }));
 await b.close(); })();
