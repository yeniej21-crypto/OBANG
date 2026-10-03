const {chromium}=require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); });
 await p.goto('http://localhost:8812/myeongri.html'); await p.waitForTimeout(1000);
 await p.evaluate(()=>{ document.getElementById('enterBtn').click(); grindInk=async()=>{}; document.getElementById('nm').value='김은주'; }); await p.waitForTimeout(300);
 await p.evaluate(()=>document.getElementById('goBtn').click()); await p.waitForTimeout(15000);
 await p.evaluate(()=>MRPrem.open()); await p.waitForTimeout(1200);
 const t=await p.evaluate(()=>document.getElementById('rep').innerText);
 require('fs').writeFileSync('dump.txt',t); console.log(t.length, errs); await b.close(); })();
