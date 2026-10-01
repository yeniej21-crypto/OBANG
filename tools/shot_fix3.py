import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/today.html'); await pg.evaluate("sessionStorage.setItem('toHome','1');sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1996,m:5,d:14,h:6}))")
        await pg.goto('http://localhost:8766/seoha-salon.html'); await pg.wait_for_timeout(2500)
        await pg.evaluate("document.querySelector('#bookGo').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(800); await pg.screenshot(path='../f_book.png')
        await pg.goto('http://localhost:8766/bujeok.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('.why').scrollIntoView({block:'start'})"); await pg.wait_for_timeout(500); await pg.screenshot(path='../f_why.png')
        await pg.evaluate("sessionStorage.removeItem('toHome')")
        await pg.goto('http://localhost:8766/seoha-salon.html'); await pg.wait_for_timeout(500)
        await pg.evaluate("document.querySelector('#op')&&document.querySelector('#op').classList.add('s6')"); await pg.wait_for_timeout(900); await pg.screenshot(path='../f_op.png')
        print('ERR',errs); await b.close()
asyncio.run(main())
