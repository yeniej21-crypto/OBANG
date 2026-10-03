import asyncio,sys
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},has_touch=True,is_mobile=True); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m: errs.append('C:'+m.text) if m.type=='error' else None)
    await pg.goto('http://localhost:8812/book_v6.html'); await pg.wait_for_timeout(1500)
    try: await pg.tap('text=소리 없이 볼게요',timeout=3000)
    except Exception: print('nogate')
    await pg.wait_for_timeout(800)
    n=await pg.evaluate('N'); print('N',n, await pg.evaluate('pf&&pf.getPageCount()'))
    rng=range(n) if len(sys.argv)<2 else [int(x) for x in sys.argv[1].split(',')]
    for i in rng:
      await pg.evaluate(f'pf.turnToPage({i});cur={i};activate({i})'); await pg.wait_for_timeout(2300)
      await pg.screenshot(path=f'_bk5/q{i:02d}.png')
    print('errs',[e for e in errs if 'Failed to load resource' not in e][:6]); await b.close()
asyncio.run(main())
