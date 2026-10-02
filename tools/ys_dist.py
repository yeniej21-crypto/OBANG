import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page()
        await pg.goto('http://localhost:8766/yeonseo.html'); await pg.wait_for_timeout(800)
        r=await pg.evaluate("""()=>{ const S=window.Saju, out={best:{},group:[0,0,0,0,0],sc:{},flags:{peach:0,hap:0,star:0,none:0},n:0}; let rnd=7;
          const R=()=>{ rnd=(rnd*1103515245+12345)%2147483648; return rnd/2147483648; };
          for(let k=0;k<600;k++){ const me={cal:'s',y:1960+Math.floor(R()*47),m:1+Math.floor(R()*12),d:1+Math.floor(R()*28),h:null,g:R()<.5?'f':'m'};
            const o=__ys.compute(me), b=o.best; out.n++; out.best[b.i]=(out.best[b.i]||0)+1; out.group[b.g]++; out.sc[b.sc]=(out.sc[b.sc]||0)+1;
            if(b.f.peach) out.flags.peach++; else if(b.f.hap) out.flags.hap++; else if(b.f.star) out.flags.star++; else out.flags.none++; }
          // sample check: 1994-07-21 f
          const t=__ys.compute({cal:'s',y:1994,m:7,d:21,g:'f',h:null});
          out.sample={dp:S.GAN_K[t.dm]+S.JI_K[t.db],loveEl:t.loveEl,pe:S.JI_K[t.pe],months:t.months.map(m=>[m.y+'.'+m.m,S.GAN_K[m.ms]+S.JI_K[m.mb],m.sc,JSON.stringify(m.f)])};
          const t2=__ys.compute({cal:'s',y:1990,m:2,d:10,g:'m',h:null}); out.sample2={dp:S.GAN_K[t2.dm]+S.JI_K[t2.db],loveEl:t2.loveEl,best:t2.best.y+'.'+t2.best.m,sc:t2.best.sc,g:t2.best.g,sec:t2.second.y+'.'+t2.second.m};
          return out; }""")
        print(json.dumps(r,ensure_ascii=False,indent=0))
        await b.close()
asyncio.run(main())
