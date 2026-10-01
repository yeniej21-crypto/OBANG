import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(timezone_id='America/New_York'); pg=await ctx.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/peach.html'); await pg.wait_for_timeout(500)
        r=await pg.evaluate("""(()=>{
          const idx=n=>CITIES.findIndex(c=>c[0].startsWith(n)); const g=p=>p?Saju.GAN[p[0]]+Saju.JI[p[1]]:'-';
          const f=(c)=>[g(c.y),g(c.m),g(c.d),g(c.h),c.corr,c.off].join(' ');
          const out={};
          out.seoul=f(chartOf({y:1996,m:5,d:14,city:idx('Seoul')},{h:12,mi:0}));
          const P=Saju.pillars(1996,5,14,6); out.seoulRef=[g(P.y),g(P.m),g(P.d),g(P.h)].join(' ');
          out.ny_before=f(chartOf({y:1990,m:2,d:3,city:idx('New York')},{h:20,mi:0}));
          out.ny_after=f(chartOf({y:1990,m:2,d:3,city:idx('New York')},{h:22,mi:30}));
          out.ny_dst=f(chartOf({y:1995,m:7,d:10,city:idx('New York')},{h:23,mi:50}));
          out.la_noon=f(chartOf({y:1998,m:11,d:20,city:idx('Los Angeles')},null));
          out.def=defaultCity()+' '+CITIES[defaultCity()][0];
          return out; })()""")
        print(json.dumps(r,ensure_ascii=False,indent=1)); print('ERR',errs)
        await b.close()
asyncio.run(main())
