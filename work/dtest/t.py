import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    errs=[]; pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None); pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.goto('http://localhost:8765/dohwa.html'); await pg.wait_for_timeout(1500)
    await pg.screenshot(path='s0.png')
    await pg.click('#startBtn')
    await pg.wait_for_selector('#nm',timeout=20000); await pg.fill('#nm','김은주'); await pg.click('#nmGo')
    await pg.wait_for_selector('.chip',timeout=20000); await pg.wait_for_timeout(300); await pg.screenshot(path='s1.png')
    await pg.click('.chip.fill')
    await pg.wait_for_selector('#dGo',timeout=20000); await pg.wait_for_timeout(300); await pg.screenshot(path='s2.png'); await pg.click('#dGo')
    await pg.wait_for_selector('#hGo',timeout=20000); await pg.click('.hgrid button[data-i="6"]'); await pg.wait_for_timeout(300); await pg.screenshot(path='s3.png'); await pg.click('#hGo')
    await pg.wait_for_function("document.getElementById('stage').classList.contains('vid')",timeout=30000); await pg.wait_for_timeout(1200); await pg.screenshot(path='s4.png')
    await pg.wait_for_function("document.getElementById('stage').classList.contains('load')",timeout=30000); await pg.wait_for_timeout(3500); await pg.screenshot(path='s5.png')
    await pg.wait_for_function("document.getElementById('stage').classList.contains('res')",timeout=30000); await pg.wait_for_timeout(2500); await pg.screenshot(path='s6.png')
    await pg.wait_for_function("document.getElementById('pay').classList.contains('on')",timeout=30000)
    await pg.evaluate("document.getElementById('result').scrollTo(0,99999)"); await pg.wait_for_timeout(800); await pg.screenshot(path='s7.png')
    print('errors',errs); await b.close()
asyncio.run(main())
