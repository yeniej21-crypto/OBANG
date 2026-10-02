import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for mode in ['next','re']:
            pg=await b.new_page(viewport={'width':400,'height':860}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(f'http://localhost:8766/love2.html?m={mode}'); await pg.wait_for_timeout(900)
            await pg.evaluate("document.getElementById('nm').value='은주'; document.getElementById('goBtn').click()"); await pg.wait_for_timeout(3000)
            h=await pg.evaluate("document.getElementById('sRs').scrollHeight"); await pg.set_viewport_size({'width':400,'height':h}); await pg.wait_for_timeout(1200)
            await pg.screenshot(path=f't/db_love2chk_{mode}.png'); print(mode,h,errs[:3]); await pg.close()
        await b.close()
asyncio.run(main())
