import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        async def h(route): await route.fulfill(path='/tmp/hv/e1.webm', content_type='video/webm')
        await pg.route('**/v/sion/e1.mp4', h)
        await pg.goto('http://localhost:8812/heart.html'); await pg.wait_for_timeout(2000)
        await pg.click('#start')
        for i in range(5):
            await pg.wait_for_timeout(600)
            print(await pg.evaluate("(()=>{const v=document.getElementById('iv'); return [v.paused, v.currentTime.toFixed(2), v.className, v.readyState, getComputedStyle(v).opacity, getComputedStyle(v).display, document.getElementById('isub').textContent]})()"))
            if i==1: await pg.screenshot(path='t/heart1.png')
        print(errs); await b.close()
asyncio.run(main())
