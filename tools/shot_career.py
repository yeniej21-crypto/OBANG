import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/career.html'); await pg.wait_for_timeout(700)
        await pg.screenshot(path='../c_in.png')
        await pg.fill('#nm','은주'); await pg.select_option('#bh','6'); await pg.click('#goBtn'); await pg.wait_for_timeout(1900); await pg.screenshot(path='../c_load.png')
        await pg.wait_for_timeout(3600)
        for i,y in enumerate([0,760,1520,2280,3040,3800]):
            await pg.evaluate(f"document.getElementById('sOut').scrollTop={y}"); await pg.wait_for_timeout(700); await pg.screenshot(path=f'../c_out{i}.png')
        print('ERR',errs)
        await b.close()
asyncio.run(main())
