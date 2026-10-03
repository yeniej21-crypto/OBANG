import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/home_shadow.html'); await pg.evaluate("sessionStorage.setItem('toHome','1')")
        await pg.goto('http://localhost:8812/home_shadow.html'); await pg.wait_for_timeout(2500)
        await pg.screenshot(path='h_top.png')
        await pg.evaluate("document.querySelector('#secTalk').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(600)
        el=await pg.query_selector('#secTalk'); await el.screenshot(path='h_talk.png')
        await pg.goto('http://localhost:8812/love.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('.stS').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(500)
        el=await pg.query_selector('.stS'); await el.screenshot(path='l_st.png')
        print('gate', await pg.evaluate("!!document.querySelector('.obSg')"))
        print('ERR',errs); await b.close()
asyncio.run(main())
