import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    await pg.goto('http://localhost:8766/seoha-salon.html'); await pg.wait_for_timeout(800); await pg.click('#goHome'); await pg.wait_for_timeout(800)
    await pg.evaluate("document.getElementById('home').scrollTop=250"); await pg.wait_for_timeout(300); await pg.screenshot(path='h1.png')
    await pg.evaluate("document.querySelector('#cTaegil').parentElement.scrollLeft=700"); await pg.wait_for_timeout(500); await pg.screenshot(path='h2.png')
    await pg.goto('http://localhost:8766/taegil.html'); await pg.wait_for_timeout(700); await pg.screenshot(path='h3.png')
    await b.close()
asyncio.run(main())
