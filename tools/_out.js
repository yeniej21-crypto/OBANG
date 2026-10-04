const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:390,height:844}});
 await ctx.route(/googleapis|gstatic/,r=>r.abort()); await ctx.route(/cloudfront\.net/,r=>r.abort());
 const css=fs.readFileSync('proto/homeskin.css','utf8');
 const sels=new Set(); css.replace(/([^{}]+)\{[^}]*\}/g,(m,s)=>{ s.split(',').forEach(x=>{ x=x.trim(); if(/^html\.skD\s/.test(x)) sels.add(x.replace(/^html\.skD\s+/,'')); }); });
 for(const pg of ['seoha-salon.html','ian-salon.html','home_v2.html']){ const p=await ctx.newPage(); await p.goto('http://localhost:8812/'+pg); await p.waitForTimeout(1500);
  const r=await p.evaluate(sels=>{ const out=[]; const H=document.getElementById('home'); for(const s of sels){ let els; try{ els=document.querySelectorAll(s.replace(/::?(before|after)$/,'')); }catch(e){ continue; } let o=0; els.forEach(e=>{ if(!H.contains(e)) o++; }); if(o) out.push(s+' x'+o); } return out; },[...sels]);
  console.log(pg, r); await p.close(); }
 await b.close(); })();
