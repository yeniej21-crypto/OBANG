const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.route(/cloudfront\.net/,r=>{ const u=r.request().url(); if(/\.mp4/.test(u)) return r.abort(); r.fulfill({body:fs.readFileSync(/96ece9bc/.test(u)?'proto/img/metal.jpg':'proto/img/seoha.jpg'),contentType:'image/jpeg'}); });
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); sessionStorage.setItem('toHome','1'); });
 await p.goto('http://localhost:8812/seoha-salon.html'); await p.waitForTimeout(3000);
 await p.evaluate(()=>document.querySelector('.rkL').scrollIntoView({block:'center'})); await p.waitForTimeout(800); await p.screenshot({path:'rk1.png'});
 await p.evaluate(()=>document.querySelector('.dspA').scrollIntoView({block:'center'})); await p.waitForTimeout(800); await p.screenshot({path:'rk2.png'});
 console.log(errs.filter(e=>!/WebGL/.test(e)).slice(0,3)); await b.close(); })();
