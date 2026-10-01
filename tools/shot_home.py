import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/today.html'); await pg.evaluate("sessionStorage.setItem('toHome','1');sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1996,m:5,d:14,h:6}))")
        await pg.goto('http://localhost:8766/_home.html'); await pg.wait_for_timeout(2500)
        await pg.screenshot(path='../h_top.png'); print('ERR',errs)
        await pg.click('#hFort'); await pg.wait_for_timeout(1500); await pg.screenshot(path='../h_today.png'); print(pg.url)
        await b.close()
asyncio.run(main())
