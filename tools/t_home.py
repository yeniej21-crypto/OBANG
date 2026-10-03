import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort()); await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
        for u in ['seoha-salon.html','ian-salon.html','home_v2.html']:
            await pg.goto('http://localhost:8812/'+u); await pg.evaluate("sessionStorage.setItem('toHome','1')")
            await pg.goto('http://localhost:8812/'+u); await pg.wait_for_timeout(1500)
            print(u, await pg.evaluate("[document.querySelector('#ngtB')&&document.querySelector('#ngtB').textContent, !!document.querySelector('#chBan'), !!document.querySelector('#thr'), [...document.querySelectorAll('.hRow .pc[id]')].slice(0,4).map(e=>e.id).join(',')]"))
        print('ERR',errs); await b.close()
asyncio.run(main())
