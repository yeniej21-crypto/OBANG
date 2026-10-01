import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8767/'); await pg.wait_for_timeout(2500)
        await pg.mouse.click(195,500); await pg.wait_for_timeout(1500); await pg.screenshot(path='o1.png')
        await pg.wait_for_timeout(14000); await pg.screenshot(path='o2.png')
        await pg.evaluate("sessionStorage.setItem('toHome','1')"); await pg.goto('http://localhost:8767/'); await pg.wait_for_timeout(2500)
        await pg.evaluate("document.querySelector('#fzRow').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(800); await pg.screenshot(path='o3.png')
        print('ERR',errs); await b.close()
asyncio.run(main())
