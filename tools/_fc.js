const {chromium}=require('playwright'); const fs=require('fs');
const pages=process.argv[2].split(','); const out={};
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:390,height:844}});
 await ctx.route(/googleapis|gstatic/,r=>r.abort()); await ctx.route(/cloudfront\.net/,r=>{ const u=r.request().url(); if(/\.mp4/.test(u)) return r.abort(); r.fulfill({body:fs.readFileSync('proto/img/seoha.jpg'),contentType:'image/jpeg'}); });
 for(const pg of pages){ for(const mode of ['op','home']){
  const p=await ctx.newPage();
  await p.addInitScript(m=>{ try{ sessionStorage.setItem('obSnd','0'); if(m==='home') sessionStorage.setItem('toHome','1'); }catch(e){} },mode);
  try{ await p.goto('http://localhost:8812/'+pg,{timeout:15000}); await p.waitForTimeout(2500);
   const s=await p.evaluate(()=>{ let set=new Set(); const all=document.querySelectorAll('body *');
    for(const el of all){ const ff=getComputedStyle(el).fontFamily||''; if(!/^['"]?OBrush/i.test(ff.trim())) continue;
      for(const n of el.childNodes) if(n.nodeType===3) for(const c of n.nodeValue) set.add(c);
      for(const ps of ['::before','::after']){ const c=getComputedStyle(el,ps).content; if(c&&c!=='none'&&c!=='normal') for(const ch of c.replace(/^"|"$/g,'')) set.add(ch); }
      if(el.placeholder) for(const c of el.placeholder) set.add(c); }
    return [...set].join(''); });
   out[pg+'|'+mode]=s; }catch(e){ out[pg+'|'+mode]='ERR '+e.message; }
  await p.close(); if(!/salon|home_v2/.test(pg)) break; } }
 fs.writeFileSync('_fc.json',JSON.stringify(out)); await b.close(); })();
