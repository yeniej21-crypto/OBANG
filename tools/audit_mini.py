import asyncio,re,json
from playwright.async_api import async_playwright
BAD=re.compile(r'[?!…一-鿿]')
PROF=[{"y":1994,"m":3,"d":8,"cal":"s","g":"f","h":None},{"y":1988,"m":7,"d":21,"cal":"l","g":"m","h":10},{"y":2001,"m":12,"d":2,"cal":"s","g":"m","h":3},{"y":1979,"m":1,"d":30,"cal":"s","g":"f","h":6}]
THEM=[{"cal":"s","y":1990,"m":1,"d":5},{"cal":"l","y":1997,"m":9,"d":9},{"cal":"s","y":2000,"m":2,"d":29}]
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.route(re.compile(r'.*(googleapis|gstatic).*'),lambda r:r.abort())
    seen=set()
    for me in PROF:
      for th in (THEM if me is PROF[0] else THEM[:1]):
        await pg.goto('http://localhost:8766/lovemini.html?t=type')
        await pg.evaluate(f"localStorage.setItem('obMe',JSON.stringify({json.dumps(me)}));sessionStorage.setItem('me',JSON.stringify({json.dumps(me)}));sessionStorage.setItem('lmThem',JSON.stringify({json.dumps(th)}))")
        for t in (['type','match','week'] if th is THEM[0] else ['match']):
          await pg.goto(f'http://localhost:8766/lovemini.html?t={t}'); await pg.wait_for_timeout(300)
          if t=='type':
            bx=await pg.locator('#seal').bounding_box(); await pg.mouse.move(bx['x']+88,bx['y']+88); await pg.mouse.down(); await pg.wait_for_timeout(1400); await pg.mouse.up(); await pg.wait_for_timeout(2000)
            seen.add(await pg.locator('#tcard h2').inner_text())
          if t=='match':
            await pg.click('#pGo'); await pg.wait_for_timeout(400); await pg.click('#lsv',position={'x':200,'y':40}); await pg.wait_for_timeout(2300)
            seen.add(await pg.locator('.mcard h2').inner_text())
          if t=='week':
            await pg.click('#shade'); await pg.wait_for_timeout(3700)
          txt=await pg.evaluate("document.body.innerText")
          bad=set(BAD.findall(txt))
          if bad: print('BAD',t,me,bad,[l for l in txt.split('\n') if BAD.search(l)][:3])
    print('variants',len(seen)); print('\n'.join(sorted(seen)))
    print('errs',errs); await b.close()
asyncio.run(main())
