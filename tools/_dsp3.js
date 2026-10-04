const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.route(/cloudfront\.net/,r=>{ const u=r.request().url(); if(/\.mp4/.test(u)) return r.abort(); r.fulfill({body:fs.readFileSync('proto/img/seoha.jpg'),contentType:'image/jpeg'}); });
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); sessionStorage.setItem('toHome','1'); });
 for(const f of ['seoha-salon.html','ian-salon.html','home_v2.html']){ await p.goto('http://localhost:8812/'+f); await p.waitForTimeout(3000);
  const r=await p.evaluate(()=>[...document.querySelectorAll('[data-dsp]')].map(e=>e.dataset.dsp+':'+(e.previousElementSibling&&e.previousElementSibling.id||'')+'>'+(e.nextElementSibling&&e.nextElementSibling.id||'')).join(' | '));
  const order=await p.evaluate(()=>[...document.querySelectorAll('.dspA .pc small')].map(e=>e.textContent).join(','));
  console.log(f,r,'\n  ',order); }
 console.log(errs.filter(e=>!/WebGL/.test(e)).slice(0,3)); await b.close(); })();
