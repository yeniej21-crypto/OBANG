import asyncio,sys
from playwright.async_api import async_playwright
out=sys.argv[1]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    await pg.goto('http://localhost:8766/seoha-salon.html'); await pg.wait_for_timeout(800)
    await pg.click('#goHome'); await pg.wait_for_timeout(900)
    for i,y in enumerate([0,760,1520,2280,3040]):
      await pg.evaluate(f"document.getElementById('home').scrollTop={y}"); await pg.wait_for_timeout(350)
      await pg.screenshot(path=f'{out}{i}.png')
    await b.close()
asyncio.run(main())
