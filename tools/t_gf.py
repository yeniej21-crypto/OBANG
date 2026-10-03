import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort()); await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
        for u in ['seoha-salon.html','ian-salon.html']:
            await pg.goto('http://localhost:8812/'+u); await pg.evaluate("sessionStorage.setItem('toHome','1');sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1996,m:1,d:14,h:6}))")
            await pg.goto('http://localhost:8812/'+u); await pg.wait_for_timeout(1800)
            await pg.click('#tdH .gFace'); await pg.wait_for_timeout(1200)
            print(u, pg.url.split('/')[-1], await pg.evaluate("[...document.querySelectorAll('.ov.on,.panel.on,[class*=mem].on,#memV.on')].map(e=>e.id||e.className).join('|')"))
        print('ERR',errs); await b.close()
asyncio.run(main())
