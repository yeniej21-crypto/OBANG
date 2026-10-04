const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 await ctx.route(/googleapis|gstatic/,r=>r.abort()); await ctx.route(/cloudfront\.net/,r=>{ if(/\.mp4/.test(r.request().url())) return r.abort(); r.fulfill({body:fs.readFileSync('proto/img/seoha.jpg'),contentType:'image/jpeg'}); });
 // 1) opening with skin 5 saved
 let p=await ctx.newPage(); await p.addInitScript(()=>{ localStorage.setItem('obSkin','5'); sessionStorage.setItem('obSnd','0'); });
 await p.goto('http://localhost:8812/seoha-salon.html'); await p.waitForTimeout(2500); await p.screenshot({path:'tg_op1.png'});
 // show opEnd + start panel forcibly for check
 await p.evaluate(()=>{ const e=document.querySelector('.opEnd'); if(e){ e.style.opacity=1; e.style.visibility='visible'; e.style.display='block'; } const pk=document.querySelector('.opPick'); if(pk){pk.style.opacity=1;pk.style.visibility='visible';} });
 await p.waitForTimeout(500); await p.screenshot({path:'tg_op2.png'});
 await p.evaluate(()=>{ document.getElementById('op').style.display='none'; const s=document.getElementById('start'); s.style.opacity=1; s.style.visibility='visible'; s.style.display=''; s.classList.add('on'); });
 await p.waitForTimeout(500); await p.screenshot({path:'tg_op3.png'}); await p.close();
 // 2) home default (no storage) then click toggle
 for(const w of [390,360]){ p=await ctx.newPage(); await p.setViewportSize({width:w,height:844}); await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); sessionStorage.setItem('toHome','1'); });
 await p.goto('http://localhost:8812/seoha-salon.html'); await p.waitForTimeout(2500); await p.evaluate(()=>localStorage.removeItem('obSkin'));
 await p.screenshot({path:`tg_h${w}a.png`,clip:{x:0,y:0,width:w,height:300}});
 await p.click('#hSkin'); await p.waitForTimeout(600); await p.screenshot({path:`tg_h${w}b.png`,clip:{x:0,y:0,width:w,height:300}});
 console.log(w, await p.evaluate(()=>[document.documentElement.className, localStorage.getItem('obSkin'), document.getElementById('hSkin').getAttribute('aria-label')]));
 await p.reload(); await p.waitForTimeout(2000); console.log('after reload', await p.evaluate(()=>document.documentElement.className));
 await p.click('#hSkin'); await p.waitForTimeout(300); console.log('back', await p.evaluate(()=>[document.documentElement.className, localStorage.getItem('obSkin')])); await p.close(); }
 await b.close(); })();
