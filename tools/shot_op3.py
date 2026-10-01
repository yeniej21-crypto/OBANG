import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for f in ['_home','_home_b']:
            pg=await b.new_page(viewport={'width':420,'height':860},device_scale_factor=2)
            await pg.goto(f'http://localhost:8766/{f}.html'); await pg.wait_for_timeout(2500)
            await pg.evaluate("const e=document.querySelector('.opEnd'); let p=e; while(p&&p!==document.body){ p.style.opacity=1; p.style.visibility='visible'; p=p.parentElement; } e.style.opacity=1; document.querySelector('.op').classList.add('s3')")
            await pg.wait_for_timeout(1500); el=await pg.query_selector('.opEnd'); await el.screenshot(path=f'../{f}.png'); await pg.close()
        await b.close()
asyncio.run(main())
