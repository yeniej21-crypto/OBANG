import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(800)
    await pg.evaluate("S.name='김은주';S.nick='은주';S.date={y:1996,m:5,d:14,cal:'양력'};S.hour=6;R=saju(1996,5,14,6,'양력');document.getElementById('splash').classList.add('off');")
    await pg.evaluate("void showResult()"); await pg.wait_for_timeout(8000)
    await pg.click('#payBtn'); await pg.wait_for_timeout(600); await pg.screenshot(path='l0.png')
    await pg.click('#payNow'); await pg.wait_for_timeout(1500); await pg.screenshot(path='l1.png')
    await pg.wait_for_timeout(5500); await pg.screenshot(path='l2.png'); await pg.wait_for_timeout(9000); await pg.screenshot(path='l2b.png'); print(await pg.evaluate("[document.getElementById('vL').currentSrc.slice(0,20),document.getElementById('vL').currentTime,document.getElementById('ls').textContent]"))
    for i,y in enumerate([600,1150,1700]):
      await pg.evaluate(f"document.getElementById('letter').scrollTop={y}"); await pg.wait_for_timeout(300); await pg.screenshot(path=f'l{i+3}.png')
    print(errs); await b.close()
asyncio.run(main())
