const {chromium}=require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); });
 await p.goto('http://localhost:8812/myeongri.html'); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ document.getElementById('enterBtn').click(); grindInk=async()=>{}; document.getElementById('nm').value='김은주'; });
 await p.waitForTimeout(1500);
 await p.click('#intake .tp button[data-k="job"]'); await p.click('#intake .tp button[data-k="money"]'); await p.click('#intake .st button[data-k="emp"]');
 await p.fill('#intake textarea','지금 회사를 옮길지 반년째 고민입니다. 연봉은 오르는데 일이 맞을지 걱정이에요');
 await p.evaluate(()=>{ const s=document.getElementById('sIntro'); s.scrollTop=s.scrollHeight; }); await p.waitForTimeout(400);
 await p.screenshot({path:'ak_form.png'});
 await p.evaluate(()=>document.getElementById('goBtn').click()); await p.waitForTimeout(15000);
 const q=await p.$('#dQ'); if(q){ await q.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await q.screenshot({path:'ak_teaser.png'}); }
 const first=await p.evaluate(()=>document.querySelector('.first p').innerText);
 await p.evaluate(()=>MRPrem.open()); await p.waitForTimeout(1200);
 for(const [sel,f] of [['.glance','ak_glance.png'],['.askd','ak_ask.png']]){ const e=await p.$(sel); if(e){ await e.scrollIntoViewIfNeeded(); await e.screenshot({path:f}); } }
 const t=await p.evaluate(()=>document.getElementById('rep').innerText); require('fs').writeFileSync('dump_ask.txt',t);
 console.log(errs, first, /undefined|NaN/.test(t)); await b.close(); })();
