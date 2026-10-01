import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    errs=[]; pg.on('pageerror',lambda e: errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'fonts' not in m.text and 'TUNNEL' not in m.text else None)
    await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(800); await pg.screenshot(path='n0.png')
    await pg.fill('#nm','김은주'); await pg.click('#goBtn'); await pg.wait_for_timeout(1200); await pg.screenshot(path='n1.png')
    await pg.wait_for_timeout(3000)
    for i,yy in enumerate([0,700,1400,2100,2800]):
      await pg.evaluate(f"document.getElementById('sRep').scrollTop={yy}"); await pg.wait_for_timeout(400); await pg.screenshot(path=f'n{i+2}.png')
    await pg.evaluate("document.getElementById('sRep').scrollTop=0"); await pg.click('.why button'); await pg.wait_for_timeout(400); await pg.screenshot(path='n7.png')
    print(errs); await b.close()
asyncio.run(main())
