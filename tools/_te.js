const {chromium}=require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); });
 await p.goto('http://localhost:8812/myeongri_v2.html'); await p.waitForTimeout(1500);
 await p.evaluate(()=>{ document.getElementById('enterBtn').click(); grindInk=async()=>{}; }); await p.waitForTimeout(400);
 await p.evaluate(()=>document.getElementById('goBtn').click()); await p.waitForTimeout(15000);
 await p.evaluate(()=>{ document.getElementById('pay').classList.add('on'); document.getElementById('payBtn').click(); }); await p.waitForTimeout(1200);
 await p.evaluate(()=>{ const b=[...document.querySelectorAll('button')].find(b=>b.offsetParent&&/카카오/.test(b.textContent)); if(b) b.click(); }); await p.waitForTimeout(2500); await p.screenshot({path:'pe0.png'});
 const btns=await p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/결제|원/.test(b.textContent)).map(b=>b.textContent.trim().slice(0,30)));
 console.log(btns);
 await p.evaluate(()=>{ document.querySelectorAll('input[type=checkbox]').forEach(c=>{ if(c.offsetParent&&!c.checked) c.click(); }); }); await p.waitForTimeout(300); await p.evaluate(()=>{ const bs=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&/원 결제|결제하기/.test(b.textContent)); if(bs.length) bs[bs.length-1].click(); });
 for(let i=1;i<=6;i++){ await p.waitForTimeout(i==1?1800:750); await p.screenshot({path:`pe${i}.png`}); }
 await p.waitForTimeout(3000); console.log(await p.evaluate(()=>[document.getElementById('prem').hidden, document.getElementById('prem').innerText.length, document.getElementById('payBtn').textContent]));
 console.log(errs); await b.close(); })();
