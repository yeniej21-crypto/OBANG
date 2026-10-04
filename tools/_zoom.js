const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
 await p.route(/cloudfront\.net/,r=>{ const u=r.request().url(); if(/\.mp4/.test(u)) return r.abort(); r.fulfill({body:fs.readFileSync('proto/img/seoha.jpg'),contentType:'image/jpeg'}); });
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); sessionStorage.setItem('toHome','1'); });
 for(const s of ['D','B']){ await p.goto('http://localhost:8812/home_skin.html?s='+s); await p.waitForTimeout(3000);
  await p.evaluate(()=>document.getElementById('skSw').style.display='none');
  for(const [sel,n] of [['.bento',1],['#secTalk',2],['#secBook',3],['#secDb',4]]){ const e=await p.$(sel); if(e){ await e.scrollIntoViewIfNeeded(); await p.waitForTimeout(400); await e.screenshot({path:`z_${s}${n}.png`}); } } }
 await b.close(); })();
