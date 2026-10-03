import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8812/pavilion.html'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path='t/pav0.png')
        for i in range(3):
            await pg.evaluate("document.getElementById('lampBtn').click()"); await pg.wait_for_timeout(1200)
            print(i, await pg.evaluate("[document.querySelector('#dots i.on')?document.querySelectorAll('#dots i.on').length:0, document.getElementById('cueT').textContent]"))
        print('ERR',errs); await b.close()
asyncio.run(main())
