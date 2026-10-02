import asyncio, json, sys
from playwright.async_api import async_playwright
K0=sys.argv[1] if len(sys.argv)>1 else None
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        await pg.goto('http://localhost:8766/redthread.html'); await pg.wait_for_timeout(600)
        r=await pg.evaluate("""()=>{ const T=window.__rt; let rnd=11; const R=()=>{ rnd=(rnd*1103515245+12345)%2147483648; return rnd/2147483648; };
          const mk=()=>({cal:'s',y:1965+Math.floor(R()*42),m:1+Math.floor(R()*12),d:1+Math.floor(R()*28),h:R()<.5?null:Math.floor(R()*12),g:R()<.5?'f':'m'});
          const sc=[], raw=[], bands=[0,0,0,0,0], knots=[0,0,0,0], taut=0, parts={st:[],dw:[],f:[],s:[],fl:[]};
          let t=0; for(let k=0;k<500;k++){ const a=mk(), b=mk(); if(a.g===b.g) b.g=a.g==='m'?'f':'m'; const x=T.pair(T.person(a),T.person(b)); sc.push(x.score); raw.push(x.raw); bands[x.band]++; knots[x.knots.length]++; if(x.taut) t++;
            parts.st.push(x.sr.w); parts.dw.push(x.dw+x.yw+x.mw); parts.f.push(x.fill.w); parts.s.push(x.starW); parts.fl.push(x.flow.w); }
          sc.sort((a,b)=>a-b); raw.sort((a,b)=>a-b); const q=(a,p)=>a[Math.floor(p*(a.length-1))]; const mean=a=>(a.reduce((s,v)=>s+v,0)/a.length).toFixed(2);
          const hist={}; sc.forEach(v=>{ const k=Math.floor(v/10)*10; hist[k]=(hist[k]||0)+1; });
          return {rawQ:[.01,.02,.05,.1,.25,.5,.75,.9,.95,.98,.99].map(p=>q(raw,p)),min:sc[0],p05:q(sc,.05),p25:q(sc,.25),med:q(sc,.5),p75:q(sc,.75),p95:q(sc,.95),max:sc[sc.length-1],mean:mean(sc),rawMin:raw[0],rawMax:raw[raw.length-1],rawMed:q(raw,.5),hist,bands,knots,taut:t,
            partMeans:Object.fromEntries(Object.entries(parts).map(([k,v])=>[k,mean(v)]))}; }""")
        print(json.dumps(r,ensure_ascii=False))
        await b.close()
asyncio.run(main())
