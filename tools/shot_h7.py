import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort()); await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/home_shadow2.html'); await pg.evaluate("sessionStorage.setItem('toHome','1')")
        await pg.goto('http://localhost:8812/home_shadow2.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#secTalk').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(500)
        el=await pg.query_selector('#secTalk'); await el.screenshot(path='c_ban.png')
        await pg.click('#chBan'); await pg.wait_for_timeout(800); print('prf', await pg.evaluate("document.querySelector('#prf').classList.contains('on')"))
        print('ERR',errs); await b.close()
asyncio.run(main())
