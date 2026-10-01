import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate("document.getElementById('goBtn').click()"); await pg.wait_for_timeout(3600)
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(800)
        await pg.evaluate("document.querySelector('.vt button[data-v=area]').click()"); await pg.wait_for_timeout(400)
        await pg.evaluate("document.querySelector('.vt').scrollIntoView({block:'start'})"); await pg.wait_for_timeout(300); await pg.screenshot(path='ar0.png')
        await pg.evaluate("document.querySelector('.atabs button[data-a=money]').click()"); await pg.wait_for_timeout(300)
        await pg.evaluate("document.querySelector('.vt').scrollIntoView({block:'start'})"); await pg.screenshot(path='ar1.png')
        # another profile (rule draft)
        await pg.evaluate("document.getElementById('back2').click()"); await pg.wait_for_timeout(500)
        await pg.evaluate("document.getElementById('by').value='1990';document.getElementById('by').onchange();document.getElementById('bm').value='11';document.getElementById('bm').onchange();document.getElementById('goBtn').click()"); await pg.wait_for_timeout(3600)
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(800)
        await pg.evaluate("document.querySelector('#prem .mrow.open')&&document.querySelector('#prem .mrow.open').scrollIntoView({block:'start'})"); await pg.wait_for_timeout(300); await pg.screenshot(path='ar2.png')
        print('ERR',errs); await b.close()
asyncio.run(main())
