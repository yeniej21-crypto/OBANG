import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for (y,m,d,h) in [(1996,5,14,6),(1990,3,3,2),(1988,10,21,9),(2001,1,9,11)]:
            pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto('http://localhost:8811/dohwa.html'); await pg.wait_for_timeout(900)
            await pg.evaluate(f"""()=>{{ document.getElementById('splash').classList.add('off'); S={{name:'김서연',nick:nickOf('김서연'),bro:false,date:{{y:{y},m:{m},d:{d},cal:'양력'}},hour:{h}}}; R=saju({y},{m},{d},{h},'양력'); showResult(); }}""")
            await pg.wait_for_timeout(1200); await pg.evaluate("document.getElementById('skipBtn').click()"); await pg.wait_for_timeout(2500)
            r=await pg.evaluate("[...document.querySelectorAll('#th .bub')].map(x=>x.innerText).filter(t=>/도화 지수|오는 길에/.test(t)).map(t=>t.split('\\n').slice(0,4).join(' / '))")
            print((y,m,d), r, errs[:2]); await pg.close()
        await b.close()
asyncio.run(main())
