const {chromium}=require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{ const t=new Date(); const dk=t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate(); localStorage.setItem('obMeok',JSON.stringify({d:dk,c:3,rv:false,n:1})); localStorage.setItem('obSeen','1'); });
 await p.goto('http://localhost:8812/meokmul.html'); await p.waitForTimeout(1200);
 console.log(await p.evaluate(()=>[document.getElementById('sub').textContent, document.getElementById('va').src||document.getElementById('vb').src, localStorage.getItem('obMeok')]));
 await p.reload(); await p.waitForTimeout(1200);
 console.log(await p.evaluate(()=>[document.getElementById('sub').textContent, localStorage.getItem('obMeok')]));
 console.log(errs); await b.close(); })();
