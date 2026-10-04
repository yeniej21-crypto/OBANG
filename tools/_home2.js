const {chromium}=require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); sessionStorage.setItem('toHome','1'); });
 await p.goto('http://localhost:8812/'+(process.argv[2]||'seoha-salon.html')); await p.waitForTimeout(3500);
 const sel=await p.evaluate(()=>{ const c=[...document.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+50&&['auto','scroll'].includes(getComputedStyle(e).overflowY)).sort((a,b)=>b.scrollHeight-a.scrollHeight)[0]; c.setAttribute('data-scr','1'); return [c.id||c.className, c.scrollHeight]; });
 console.log(sel); const H=sel[1]; let n=0;
 for(let y=0;y<H;y+=800){ await p.evaluate(y=>document.querySelector('[data-scr]').scrollTop=y,y); await p.waitForTimeout(700); await p.screenshot({path:`hs_${String(n++).padStart(2,'0')}.png`}); }
 console.log(n); await b.close(); })();
