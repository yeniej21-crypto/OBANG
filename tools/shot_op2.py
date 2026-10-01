import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':860},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/_home.html'); await pg.wait_for_timeout(3000)
        print(await pg.evaluate("document.getElementById('opDots').innerHTML.slice(0,400)"))
        await pg.evaluate("const e=document.querySelector('.opEnd'); let p=e; while(p&&p!==document.body){ p.style.opacity=1; p.style.display=p.style.display||''; p.style.visibility='visible'; p=p.parentElement; } e.classList.add('on'); e.style.opacity=1")
        await pg.wait_for_timeout(800); el=await pg.query_selector('.opEnd'); await el.screenshot(path='../opend.png')
        print(errs); await b.close()
asyncio.run(main())
