import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=user-gesture-required']); pg=await (await b.new_context(viewport={'width':390,'height':844},has_touch=True)).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8812/heart.html'); await pg.wait_for_timeout(2500)
        print('gate', await pg.evaluate("!!document.querySelector('.obSg.on')"))
        await pg.screenshot(path='t/heart0.png')
        if await pg.evaluate("!!document.querySelector('.obSg.on')"): await pg.click('.obSg .go'); await pg.wait_for_timeout(600)
        await pg.click('#start'); 
        for i in range(4):
            await pg.wait_for_timeout(700)
            print(await pg.evaluate("(()=>{const v=document.getElementById('iv'); return [v.paused, v.currentTime.toFixed(2), v.className, v.readyState, getComputedStyle(v).opacity]})()"))
        await pg.screenshot(path='t/heart1.png'); print(errs); await b.close()
asyncio.run(main())
