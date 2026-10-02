const { chromium } = require('playwright');
(async()=>{
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:420,height:880}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  for (const f of ['seoha-salon.html','ian-salon.html']){
    await p.goto('http://localhost:8766/_t_'+f); await p.waitForTimeout(1200); 
    await p.evaluate(()=>{ __S({low:'fire',P:[{l:'시',s:null,b:null},{l:'일',s:2,b:3},{l:'월',s:5,b:7},{l:'년',s:8,b:1}],cnt:[2,1,0,3,2]}); __show(); document.querySelectorAll('.start').forEach(e=>e.style.display='none'); document.getElementById('result').style.zIndex=55; });
    await p.waitForTimeout(1200);
    await p.screenshot({path:`res_top_${f}.png`});
    await p.evaluate(()=>{ const r=document.getElementById('result'); r.scrollTop=r.scrollHeight; });
    await p.waitForTimeout(500);
    await p.screenshot({path:`res_bot_${f}.png`});
    const sh=await p.evaluate(()=>{ const b=document.getElementById('ctaShare'); return b? b.getBoundingClientRect().width : -1; });
    console.log(f,'shareW',sh);
  }
  console.log('errors',errs.slice(0,5)); await b.close();
})();
