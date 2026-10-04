const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 await p.route(/cloudfront\.net/,r=>{ const u=r.request().url(); if(/\.mp4/.test(u)) return r.abort(); r.fulfill({body:fs.readFileSync('proto/img/seoha.jpg'),contentType:'image/jpeg'}); });
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); sessionStorage.setItem('toHome','1'); });
 for(const s of (process.argv[2]||'0,A,B,C').split(',')){ await p.goto('http://localhost:8812/home_skin.html?s='+s); await p.waitForTimeout(3000);
  await p.evaluate(()=>{ const w=document.getElementById('skSw'); if(w) w.style.display='none'; });
  const H=await p.evaluate(()=>document.getElementById('home').scrollHeight); let n=0;
  for(let y=0;y<H&&n<8;y+=820){ await p.evaluate(y=>document.getElementById('home').scrollTop=y,y); await p.waitForTimeout(500); await p.screenshot({path:`sk_${s}_${n++}.png`}); } }
 await b.close(); })();
