import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort()); await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/home_career.html'); await pg.evaluate("sessionStorage.setItem('toHome','1')")
        await pg.goto('http://localhost:8812/home_career.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#secJob').scrollIntoView({block:'start'})"); await pg.wait_for_timeout(400)
        el=await pg.query_selector('#secJob'); await el.screenshot(path='jb.png')
        print('ERR',errs); await b.close()
asyncio.run(main())
