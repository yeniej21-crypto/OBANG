const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:390,height:844}});
 await ctx.route(/googleapis|gstatic/,r=>r.abort()); await ctx.route(/cloudfront\.net/,r=>{ if(/\.mp4/.test(r.request().url())) return r.abort(); r.fulfill({body:fs.readFileSync('proto/img/seoha.jpg'),contentType:'image/jpeg'}); });
 for(const [pg,home] of [['seoha-salon.html',0],['seoha-salon.html',1],['ian-salon.html',1],['myeongri.html',0],['today.html',0],['samjae.html',0],['cooltime.html',0],['tarot.html',0]]){
  const p=await ctx.newPage(); const req=[]; p.on('request',r=>{ if(/fonts\//.test(r.url())) req.push(r.url().split('/').pop()); });
  const cons=[]; p.on('console',m=>{ if(m.type()==='warning'||m.type()==='error') cons.push(m.text().slice(0,120)); });
  await p.addInitScript(h=>{ sessionStorage.setItem('obSnd','0'); if(h) sessionStorage.setItem('toHome','1'); },home);
  await p.goto('http://localhost:8812/'+pg); await p.waitForTimeout(3000);
  const r=await p.evaluate(()=>{ const st=[...document.fonts].filter(f=>/OBrush/.test(f.family)).map(f=>f.status[0]).join(''); 
    let miss=0,tot=0; document.querySelectorAll('body *').forEach(el=>{ const cs=getComputedStyle(el); if(!/^['"]?OBrush/.test(cs.fontFamily)||el.offsetParent===null) return; const t=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.nodeValue).join('').trim(); if(!t) return; tot++; if(!document.fonts.check(cs.fontSize+' OBrush',t)) miss++; });
    return {st,tot,miss}; });
  console.log(pg,home?'home':'', JSON.stringify(r), [...new Set(req)].join(' '), cons.filter(c=>/preload|font/i.test(c)).join(' | ')); await p.close(); }
 await b.close(); })();
