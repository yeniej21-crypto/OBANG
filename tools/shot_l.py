import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8812/love.html'); await pg.evaluate("sessionStorage.setItem('obSnd','0')")
        await pg.goto('http://localhost:8812/love.html'); await pg.wait_for_timeout(1500)
        print('gate',await pg.evaluate("!!document.querySelector('.obSg.on')"))
        await pg.evaluate("document.querySelector('.stS').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(2500)
        el=await pg.query_selector('.stS'); await el.screenshot(path='l_st.png')
        await pg.wait_for_timeout(5000); print('started',await pg.evaluate("document.querySelectorAll('video.fx').length"))
        print('ERR',errs); await b.close()
asyncio.run(main())
