import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort()); await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/ian-salon.html'); await pg.evaluate("sessionStorage.setItem('toHome','1');sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1996,m:1,d:14,h:6}))")
        await pg.goto('http://localhost:8812/ian-salon.html'); await pg.wait_for_timeout(2500)
        await pg.screenshot(path='gd_top.png')
        await pg.evaluate("document.querySelector('#tday').scrollIntoView({block:'start'})"); await pg.wait_for_timeout(500); await pg.screenshot(path='gd_mid.png')
        print(await pg.evaluate("[document.querySelector('#gChipN').textContent, document.querySelector('#hFortK').textContent, document.querySelector('#ngtK').textContent, localStorage.getItem('obGuard')]"))
        await pg.goto('http://localhost:8812/heukmae.html'); await pg.wait_for_timeout(1200)
        el=await pg.query_selector('#gd'); await el.scroll_into_view_if_needed(); await el.screenshot(path='gd_vil.png')
        print('ERR',errs); await b.close()
asyncio.run(main())
