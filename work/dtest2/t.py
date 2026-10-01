import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    pg=await b.new_page(viewport={'width':390,'height':844})
    errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.goto('http://localhost:8766/seoha-salon.html'); await pg.wait_for_timeout(1000)
    await pg.click("#goHome"); await pg.wait_for_timeout(800)
    await pg.evaluate("document.getElementById('cDohwa').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(500)
    await pg.screenshot(path='h.png')
    await pg.click('#cDohwa'); await pg.wait_for_load_state(); await pg.wait_for_timeout(1000)
    print(pg.url)
    await pg.click('#startBtn'); await pg.wait_for_selector('#nm',timeout=20000); await pg.fill('#nm','김은주'); await pg.click('#nmGo')
    await pg.wait_for_selector('.chip',timeout=20000); await pg.wait_for_timeout(400); await pg.screenshot(path='c.png')
    await pg.click('.chip.fill'); await pg.wait_for_selector('#dGo',timeout=20000); await pg.click('#dGo')
    await pg.wait_for_selector('#hNo',timeout=20000); await pg.click('#hNo')
    await pg.wait_for_function("stage.classList.contains('vid')",timeout=30000); await pg.wait_for_timeout(3000); await pg.screenshot(path='v.png')
    await pg.wait_for_function("stage.classList.contains('res')",timeout=40000); await pg.wait_for_timeout(4200); await pg.screenshot(path='r.png')
    await pg.click('#backBtn'); await pg.wait_for_timeout(1500); print('back',pg.url, await pg.evaluate("document.getElementById('home').classList.contains('on')")); await pg.screenshot(path='b.png')
    print('errors',errs); await b.close()
asyncio.run(main())
