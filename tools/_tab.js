const {chromium}=require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
 await p.goto('http://localhost:8812/about.html',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(1500);
 const H=await p.evaluate(()=>document.documentElement.scrollHeight); console.log('H',H, 'sw', await p.evaluate(()=>document.documentElement.scrollWidth));
 let i=0; for(let y=0;y<H;y+=800){ await p.evaluate(y=>window.scrollTo(0,y),y); await p.waitForTimeout(700); await p.screenshot({path:`ab_${String(i).padStart(2,'0')}.png`}); i++; }
 console.log(await p.evaluate(()=>{ const e=document.querySelector('#now,.now,[id*=live]'); return e?e.innerText:'nolive'; }));
 console.log('errs',errs.filter(e=>!/cloudfront|net::|Failed to load/.test(e)));
 await b.close(); })();
