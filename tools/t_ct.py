import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort()); await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/cooltime.html'); await pg.evaluate("sessionStorage.setItem('obSnd','0')")
        await pg.goto('http://localhost:8812/cooltime.html'); await pg.wait_for_timeout(800)
        for q,j in [(0,2),(1,2),(2,1)]:
            await pg.click(f'.q[data-q="{q}"] button[data-j="{j}"]')
        await pg.click('#goF'); await pg.wait_for_timeout(600)
        el=await pg.query_selector('#rs'); await el.screenshot(path='ct_rs.png')
        await pg.click('#pdGo'); await pg.wait_for_timeout(500)
        el=await pg.query_selector('#pv'); await el.screenshot(path='ct_pv.png')
        print(await pg.evaluate("window.__CR&&[__CR.gauge,__CR.sajuV,__CR.sitV,__CR.title]"))
        print('ERR',errs); await b.close()
asyncio.run(main())
