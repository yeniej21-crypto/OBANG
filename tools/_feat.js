const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const ph={heuk:'proto/img/fire.jpg',geum:'proto/img/water.jpg',sam:'proto/img/mini/tong.jpg'};
 await p.route(/cloudfront\.net/,r=>{ const u=r.request().url(); if(/\.mp4/.test(u)) return r.abort(); const f=/101836/.test(u)?'proto/img/fire.jpg':/102005/.test(u)?'proto/img/water.jpg':/102844/.test(u)?'proto/img/metal.jpg':/003011/.test(u)?'proto/img/wood.jpg':'proto/img/seoha.jpg'; r.fulfill({body:fs.readFileSync(f),contentType:'image/jpeg'}); });
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); sessionStorage.setItem('toHome','1'); });
 for(const [o,f] of [['annex','fa'],['alley','fb'],['today','fc'],['br-love,br-dohwa,br-cat','fd']]){
  await p.goto('http://localhost:8812/home_feat.html?v='+encodeURIComponent(o)); await p.waitForTimeout(3000);
  await p.screenshot({path:f+'.png'});
  if(o.startsWith('br')){ for(const [sel,g] of [['#secDohwa','fd2'],['#secCat','fd3']]){ await p.evaluate(s=>document.querySelector(s).scrollIntoView({block:'end'}),sel); await p.waitForTimeout(500); await p.screenshot({path:g+'.png'}); } }
 }
 console.log(errs.slice(0,3)); await b.close(); })();
