import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort()); await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/home_shadow2.html?ng=geum'); await pg.evaluate("sessionStorage.setItem('toHome','1')")
        await pg.goto('http://localhost:8812/home_shadow2.html?ng=geum'); await pg.wait_for_timeout(1500)
        print(await pg.evaluate("document.querySelector('#ngtB').textContent"))
        await pg.evaluate("document.querySelector('#secLoveHub').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(3000)
        await pg.screenshot(path='n_thr.png',clip={'x':0,'y':250,'width':390,'height':360})
        print('ERR',errs); await b.close()
asyncio.run(main())
