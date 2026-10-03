import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort()); await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/love_v5.html'); await pg.evaluate("sessionStorage.setItem('obSnd','0')")
        await pg.goto('http://localhost:8812/love_v5.html'); await pg.wait_for_timeout(1500)
        for i,y in enumerate([700,1500,2400]):
            await pg.evaluate(f"window.scrollTo(0,{y})"); await pg.wait_for_timeout(500); await pg.screenshot(path=f'v5_{i}.png')
        print(await pg.evaluate("document.body.scrollHeight"))
        print('ERR',errs); await b.close()
asyncio.run(main())
