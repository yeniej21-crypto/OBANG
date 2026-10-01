import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    errs=[]; pg.on('pageerror',lambda e: errs.append(pg.url.split('/')[-1][:20]+': '+str(e)))
    await pg.goto('http://localhost:8766/seoha-salon.html'); await pg.wait_for_timeout(800); await pg.click('#goHome'); await pg.wait_for_timeout(800)
    await pg.evaluate("document.getElementById('home').scrollTop=260"); await pg.wait_for_timeout(300); await pg.screenshot(path='z0.png')
    await pg.click('#pills button[data-c=jt]'); await pg.wait_for_timeout(500); await pg.screenshot(path='z1.png')
    await pg.click('#cTaegil'); await pg.wait_for_load_state(); await pg.wait_for_timeout(700); await pg.screenshot(path='z2.png')
    await pg.click('#goBtn'); await pg.wait_for_timeout(600); await pg.screenshot(path='z3.png')
    await pg.evaluate("document.getElementById('sOut').scrollTop=700"); await pg.wait_for_timeout(300); await pg.screenshot(path='z4.png')
    await pg.goto('http://localhost:8766/gunghap.html'); await pg.wait_for_timeout(600)
    await pg.fill('#wA [data-k=n]','김은주'); await pg.fill('#wB [data-k=n]','박서준'); await pg.click('#wB .seg[data-k=g] button[data-v=m]')
    await pg.screenshot(path='z5.png'); await pg.click('#goBtn'); await pg.wait_for_timeout(3000); await pg.screenshot(path='z6.png')
    await pg.evaluate("document.getElementById('sRs').scrollTop=600"); await pg.wait_for_timeout(300); await pg.screenshot(path='z7.png')
    link=await pg.evaluate("'gunghap.html?f='+enc(window._me)")
    await pg.goto('http://localhost:8766/'+link); await pg.wait_for_timeout(700); await pg.screenshot(path='z8.png')
    # demo ask
    await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(500); await pg.fill('#nm','김은주'); await pg.click('#goBtn'); await pg.wait_for_timeout(3500)
    await pg.evaluate("document.querySelector('.askS').scrollIntoView()"); await pg.click('.askS .qs button'); await pg.wait_for_timeout(12500); await pg.screenshot(path='z9.png')
    await pg.click('.ak-sug button'); await pg.wait_for_timeout(1500); await pg.screenshot(path='z10.png')
    print(errs); await b.close()
asyncio.run(main())
