import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/today.html'); await pg.evaluate("sessionStorage.setItem('toHome','1');sessionStorage.removeItem('obBookPg')")
        await pg.goto('http://localhost:8766/seoha-salon.html'); await pg.wait_for_timeout(2000)
        await pg.evaluate("document.querySelector('#bookGo').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(600); await pg.screenshot(path='../b_home.png')
        await pg.goto('http://localhost:8766/book.html'); await pg.wait_for_timeout(2500); await pg.screenshot(path='../b0.png')
        for i in [1,2]:
            await pg.evaluate(f"document.querySelector('#toc [data-i=\"{i}\"]').click()"); await pg.wait_for_timeout(4000 if i==2 else 9000); await pg.screenshot(path=f'../b{i}.png')
        print('ERR',errs); await b.close()
asyncio.run(main())
