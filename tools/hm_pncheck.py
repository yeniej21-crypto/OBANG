import asyncio,re,random
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for w,h in [(360,640),(400,860),(430,932)]:
            pg=await b.new_page(viewport={'width':w,'height':h}); await pg.route(re.compile(r'.*cloudfront\.net.*'),lambda r:r.abort())
            await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(800)
            worst=0
            for k in range(25):
                y=random.randint(1950,2007); m=random.randint(1,12); d=random.randint(1,28); hh=random.choice(['x',0,5,9]); g=random.choice(['f','m'])
                r=await pg.evaluate(f"""(()=>{{ document.querySelector('#gSeg button[data-v="{g}"]').click(); by.value={y}; by.onchange(); bm.value={m}; bm.onchange(); bd.value={d}; bh.value='{hh}';
                  render('김은주',{{y:{y},m:{m},d:{d}}},{ 'null' if hh=='x' else hh},{{y:{y},m:{m},d:{d}}}); const band=14; let mx=-999;
                  document.querySelectorAll('#mtrack .pn').forEach(pn=>{{ const pb=pn.getBoundingClientRect().bottom-band; const last=pn.lastElementChild.getBoundingClientRect().bottom; mx=Math.max(mx,last-pb); }}); return mx; }})()""")
                worst=max(worst,r)
            print(w,h,'worst overflow px (>0 bad):',round(worst,1)); await pg.close()
        await b.close()
asyncio.run(main())
