import asyncio,json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for mode in ['next','re']:
            pg=await b.new_page(); await pg.goto(f'http://localhost:8766/love2.html?m={mode}'); await pg.wait_for_timeout(600)
            for y,m,d in [(1996,5,14),(1990,1,3),(1985,11,20),(2001,8,8),(1993,3,27)]:
                r=await pg.evaluate(f"""(()=>{{ document.getElementById('by').value={y}; document.getElementById('bm').value={m}; document.getElementById('bd').value={d};
                  {"document.getElementById('py').value='1994'; document.getElementById('py').onchange(); document.getElementById('pm').value='3'; document.getElementById('pd').value='8';" if mode=='re' else ''}
                  document.getElementById('goBtn').click(); return 1; }})()""")
                await pg.wait_for_timeout(2300)
                D=await pg.evaluate("(()=>{const D=window._love2.D; return {idx:D.idx, sc:D.M.map(x=>x.o.start.m+':'+x.sc+':'+x.v.toFixed(1)), pts:D.pts.map(p=>p[0]+'|'+p[1]+'|'+(+p[2]).toFixed(2)), cur:D.F.cur, natal:D.F.natal, starEl:D.starEl, stars:D.stars, xb:D.xb}})()")
                print(mode,y,m,d,json.dumps(D,ensure_ascii=False))
                await pg.evaluate("document.getElementById('again').click()"); await pg.wait_for_timeout(500)
        await b.close()
asyncio.run(main())
