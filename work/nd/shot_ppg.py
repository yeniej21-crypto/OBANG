import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
        await pg.goto('http://localhost:8766/ppopgi.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("document.getElementById('go').click()"); await pg.wait_for_timeout(3500)
        h=await pg.evaluate("document.querySelector('#sRs .res').scrollHeight")
        await pg.set_viewport_size({'width':390,'height':h}); await pg.wait_for_timeout(500)
        await pg.screenshot(path='ppg.png')
        await b.close()
asyncio.run(main())
