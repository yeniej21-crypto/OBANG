import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort()); await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
        for u in ['career.html','cooltime.html']:
            await pg.goto('http://localhost:8812/'+u); await pg.wait_for_timeout(1000)
            print(u, await pg.evaluate("document.querySelectorAll('a[href=\"cooltime.html\"]').length"))
        await pg.goto('http://localhost:8812/seoha-salon.html'); await pg.evaluate("sessionStorage.setItem('toHome','1')")
        await pg.goto('http://localhost:8812/seoha-salon.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#secJob').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(400)
        el=await pg.query_selector('#secJob'); await el.screenshot(path='h_job.png')
        await pg.click('#cCool'); await pg.wait_for_timeout(1200); print('nav', pg.url)
        print('ERR',errs); await b.close()
asyncio.run(main())
