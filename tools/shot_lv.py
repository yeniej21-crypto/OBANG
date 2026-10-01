import asyncio,sys
from playwright.async_api import async_playwright
MOCK=open('mock2.js').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for mode in ['re','next']:
          for mock in [False,True]:
            pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
            errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            if mock: await pg.add_init_script(MOCK)
            await pg.goto(f'http://localhost:8766/love2.html?m={mode}'); await pg.wait_for_timeout(1000)
            await pg.evaluate("document.getElementById('nm').value='은주'; if(document.getElementById('py')){ document.getElementById('py').value='1994'; document.getElementById('pm').value='3'; document.getElementById('pd').value='8'; } document.getElementById('goBtn').click()")
            await pg.wait_for_timeout(2600)
            if not mock:
                await pg.screenshot(path=f'lv_{mode}0.png'); await pg.evaluate("document.getElementById('sRs').scrollTop=820"); await pg.wait_for_timeout(300); await pg.screenshot(path=f'lv_{mode}1.png')
            await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(2500)
            if mock:
                P=await pg.evaluate("window.__P||[]"); print(mode,'calls',len(P),[len(x) for x in P]); open(f'lv_{mode}_p0.txt','w').write(P[0] if P else '')
            else:
                top=await pg.evaluate("(()=>{const h=document.getElementById('lprem'), s=document.getElementById('sRs'); return h.getBoundingClientRect().top-s.getBoundingClientRect().top+s.scrollTop})()")
                for i in range(2):
                    await pg.evaluate(f"document.getElementById('sRs').scrollTop={top-40+i*820}"); await pg.wait_for_timeout(300); await pg.screenshot(path=f'lv_{mode}{i+2}.png')
            print(mode,mock,'ERR',errs[:3]); await pg.close()
        await b.close()
asyncio.run(main())
