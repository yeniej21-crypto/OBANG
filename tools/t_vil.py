import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort())
        for u in ['heukmae.html','geumeum.html','samjae.html','love.html','free.html','sinnyeon.html','home_shadow.html']:
            await pg.goto('http://localhost:8812/'+u); await pg.wait_for_timeout(900)
            print(u, await pg.evaluate("document.querySelectorAll('.sgx a.c, #ot a, #nx a').length"))
        print('errs',errs); await b.close()
asyncio.run(main())
