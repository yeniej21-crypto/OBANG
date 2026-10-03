import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/home_shadow2.html'); await pg.evaluate("sessionStorage.setItem('toHome','1')")
        for q in ['heuk','geum']:
            await pg.goto('http://localhost:8812/home_shadow2.html?ng='+q); await pg.wait_for_timeout(2000)
            await pg.evaluate("document.querySelector('#secNight').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(400)
            await pg.screenshot(path=f'n_{q}.png',clip={'x':0,'y':250,'width':390,'height':330})
        await pg.evaluate("document.querySelector('#secLoveHub').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(3000)
        el=await pg.query_selector('#secLoveHub'); await el.screenshot(path='n_thr.png')
        print('ERR',errs); await b.close()
asyncio.run(main())
