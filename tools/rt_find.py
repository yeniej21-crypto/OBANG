import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        await pg.goto('http://localhost:8766/redthread.html'); await pg.wait_for_timeout(500)
        r=await pg.evaluate("""()=>{ const T=window.__rt, A=T.person({cal:'s',y:1996,m:5,d:14,h:null,g:'f'}), out={k2:[],taut:[],low:[]};
          for(let y=1990;y<=2000;y++) for(let m=1;m<=12;m+=1) for(let d=1;d<=28;d+=3){ const o={cal:'s',y,m,d,h:null,g:'m'}, x=T.pair(A,T.person(o));
            if(x.knots.length>=2&&out.k2.length<4) out.k2.push([y,m,d,x.score,x.knots.map(k=>k.n).join('/'),x.dr.join(',')]);
            if(x.taut&&x.score>=72&&out.taut.length<4) out.taut.push([y,m,d,x.score,x.knots.length,x.sr.k,x.dr.join(',')]);
            if(x.score<35&&out.low.length<4) out.low.push([y,m,d,x.score,x.knots.length]); }
          return {me:A.dayK,out}; }""")
        print(json.dumps(r,ensure_ascii=False))
        await b.close()
asyncio.run(main())
