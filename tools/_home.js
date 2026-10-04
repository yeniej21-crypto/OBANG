const {chromium}=require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); sessionStorage.setItem('toHome','1'); });
 await p.goto('http://localhost:8812/seoha-salon.html'); await p.waitForTimeout(3500);
 const info=await p.evaluate(()=>{ const sc=document.scrollingElement; const secs=[...document.querySelectorAll('section.hSec,section.ngtS,.hFoot,.abBand')].map(s=>({id:s.id||s.className,top:Math.round(s.getBoundingClientRect().top+scrollY),h:Math.round(s.getBoundingClientRect().height),hid:s.hidden})); return {H:document.documentElement.scrollHeight,secs}; });
 console.log(JSON.stringify(info), errs.slice(0,3));
 await p.screenshot({path:'hm_full.png',fullPage:true}); await b.close(); })();
