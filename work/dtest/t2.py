import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    pg=await b.new_page(viewport={'width':390,'height':844})
    pg.on('console',lambda m: print('C',m.text)); pg.on('pageerror',lambda e: print('E',e))
    await pg.goto('http://localhost:8765/dohwa.html'); await pg.wait_for_timeout(800)
    await pg.evaluate("S.date={y:1996,m:5,d:14,cal:'양력'};S.hour=6;S.name='김은주';S.nick='은주';")
    await pg.click('#startBtn'); await pg.evaluate("void toVideo()")
    for i in range(8):
      await pg.wait_for_timeout(1000)
      print(await pg.evaluate("[stage.className,[vA,vB].map(v=>[v.src.slice(0,30),v.currentTime.toFixed(2),v.duration,v.paused,v.readyState,v.error&&v.error.code])]"))
    await b.close()
asyncio.run(main())
