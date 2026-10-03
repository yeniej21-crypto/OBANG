import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8812/book.html'); await pg.wait_for_timeout(1500)
    try:
      await pg.click('text=소리 켜고 들어가기',timeout=3000)
    except Exception as e: print('nogate')
    await pg.wait_for_timeout(500)
    n=await pg.evaluate('N'); print('pages',n)
    rng=range(n) if len(sys.argv)<2 else [int(x) for x in sys.argv[1].split(',')]
    for i in rng:
      await pg.evaluate(f'go({i},false)'); await pg.wait_for_timeout(2600)
      info=await pg.evaluate("(()=>{const f=leaves[cur].querySelector('.face.front');return f.className+' | '+PAGES[cur].t})()")
      await pg.screenshot(path=f'_bk5/p{i:02d}.png'); print(i,info)
    print('errs',errs[:5]); await b.close()
asyncio.run(main())
