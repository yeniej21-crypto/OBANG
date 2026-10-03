import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort()); await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/workmini.html'); await pg.evaluate("sessionStorage.setItem('obSnd','0')")
        for t in ['day','pay','boss']:
            await pg.goto('http://localhost:8812/workmini.html?t='+t); await pg.wait_for_timeout(700)
            await pg.click('#goF'); await pg.wait_for_timeout(500)
            el=await pg.query_selector('#rs'); await el.screenshot(path=f'wm_{t}.png')
            if t!='day':
                await pg.evaluate("window.ObPay=null"); await pg.click('#pdGo'); await pg.wait_for_timeout(400)
                el=await pg.query_selector('#pv'); await el.screenshot(path=f'wm_{t}_full.png')
            print(t, await pg.evaluate("window.__WR&&[__WR.title,__WR.tot||__WR.v]"))
        print('ERR',errs); await b.close()
asyncio.run(main())
