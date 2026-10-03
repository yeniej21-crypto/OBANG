import asyncio,re
from playwright.async_api import async_playwright
ME='{"y":1990,"m":12,"d":31,"cal":"l","g":"m","h":3}'
BAD=re.compile(r'[?!…一-鿿]|undefined|NaN')
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for w in (320,360,430):
      for rm in ('reduce','no-preference'):
        ctx=await b.new_context(viewport={'width':w,'height':760},reduced_motion=rm); pg=await ctx.new_page(); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route(re.compile(r'.*(googleapis|gstatic|cloudfront).*'),lambda r:r.abort())
        await pg.add_init_script(f"localStorage.setItem('obMe','{ME}')")
        for t in ('type','match','week'):
          await pg.goto(f'http://localhost:8766/lovemini.html?t={t}'); await pg.wait_for_timeout(400)
          if t=='type': await pg.locator('#seal').focus(); await pg.keyboard.down(' '); await pg.wait_for_timeout(1500); await pg.keyboard.up(' '); await pg.wait_for_timeout(3200)
          if t=='match': await pg.click('#pGo'); await pg.wait_for_timeout(300); await pg.click('#lsv',position={'x':100,'y':30}); await pg.wait_for_timeout(2800)
          if t=='week': await pg.locator('#shade').focus(); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(4200)
          ok=await pg.evaluate("!!document.querySelector('.letter')")
          sw=await pg.evaluate("[document.documentElement.scrollWidth,innerWidth]")
          txt=await pg.evaluate("document.body.innerText")
          print(w,rm,t,'letter',ok,'sw',sw,'bad',set(BAD.findall(txt)))
        await pg.goto('http://localhost:8766/love.html'); await pg.wait_for_timeout(600)
        print(w,rm,'love sw',await pg.evaluate("[document.documentElement.scrollWidth,innerWidth]"),errs)
        await ctx.close()
    await b.close()
asyncio.run(main())
