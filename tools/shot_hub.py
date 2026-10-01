import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/free.html'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path='hub0.png'); await pg.evaluate("document.getElementById('sHub').scrollTop=700"); await pg.wait_for_timeout(500); await pg.screenshot(path='hub1.png')
        for k in ['color','food','mbti']:
            await pg.goto(f'http://localhost:8766/free.html?t={k}'); await pg.wait_for_timeout(1200)
            await pg.evaluate("document.getElementById('other')&&document.getElementById('other').click()")
            await pg.screenshot(path=f'in_{k}0.png'); await pg.evaluate("document.getElementById('sIn').scrollTop=900"); await pg.wait_for_timeout(300); await pg.screenshot(path=f'in_{k}1.png')
        await pg.evaluate("sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))")
        await pg.goto('http://localhost:8766/free.html?t=food'); await pg.wait_for_timeout(1000); await pg.evaluate("document.getElementById('meQ').click()"); await pg.wait_for_timeout(3200); await pg.screenshot(path='rs_food.png')
        print(errs); await b.close()
asyncio.run(main())
