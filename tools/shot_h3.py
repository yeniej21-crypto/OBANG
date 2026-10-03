import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/home_shadow.html'); await pg.evaluate("sessionStorage.setItem('toHome','1')")
        await pg.goto('http://localhost:8812/home_shadow.html'); await pg.wait_for_timeout(2500)
        await pg.screenshot(path='h_top.png')
        await pg.evaluate("window.scrollBy(0,800)"); await pg.wait_for_timeout(500); await pg.screenshot(path='h_top2.png')
        await pg.evaluate("document.querySelector('#hChat,.chHub,[id*=Char]')&&document.querySelector('#hChat,.chHub,[id*=Char]').scrollIntoView()"); await pg.wait_for_timeout(500); await pg.screenshot(path='h_char.png')
        print(await pg.evaluate("[...document.querySelectorAll('.home section')].filter(s=>!s.hidden&&s.offsetHeight).map(s=>(s.id||s.className)+':'+s.offsetTop).join(' | ')"))
        print('ERR',errs); await b.close()
asyncio.run(main())
