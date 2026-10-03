const {chromium}=require('playwright');
const cases=[[1988,11,3,'5','m'],[1975,2,20,'x','f'],[2001,8,30,'22','m'],[1963,7,7,'3','f'],[1999,12,25,'12','m']];
(async()=>{ const b=await chromium.launch();
 for(const [y,m,d,h,g] of cases){ const p=await b.newPage({viewport:{width:390,height:844}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); });
  await p.goto('http://localhost:8812/myeongri.html'); await p.waitForTimeout(800);
  await p.evaluate(([y,m,d,h,g])=>{ document.getElementById('enterBtn').click(); grindInk=async()=>{}; document.getElementById('nm').value='테스트';
    const set=(id,v)=>{const e=document.getElementById(id); e.value=String(v); e.dispatchEvent(new Event('change',{bubbles:true}));}; set('by',y); set('bm',m); set('bd',d); set('bh',h);
    document.querySelectorAll('#gSeg button').forEach(x=>x.classList.toggle('on',x.dataset.v===g)); },[y,m,d,h,g]);
  await p.waitForTimeout(300); await p.evaluate(()=>document.getElementById('goBtn').click()); await p.waitForTimeout(14000);
  await p.evaluate(()=>MRPrem.open()); await p.waitForTimeout(800);
  const t=await p.evaluate(()=>document.getElementById('rep').innerText);
  const bad=(t.match(/.{0,30}(undefined|NaN|null|\[object).{0,30}/g)||[]).slice(0,4);
  require('fs').writeFileSync(`dump_${y}.txt`,t); console.log(y,m,d,h,g,t.length,errs,bad); await p.close(); }
 await b.close(); })();
