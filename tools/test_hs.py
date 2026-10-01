import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':900})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/today.html'); await pg.evaluate("sessionStorage.setItem('toHome','1');sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1996,m:5,d:14,h:6}))")
        await pg.goto('http://localhost:8766/_home.html'); await pg.wait_for_timeout(2500)
        row=pg.locator('.hRow').first; await row.scroll_into_view_if_needed(); bb=await row.bounding_box()
        await pg.mouse.move(bb['x']+bb['width']/2, bb['y']+bb['height']/2); await pg.wait_for_timeout(400)
        await pg.screenshot(path='../hs0.png')
        before=await row.evaluate('e=>e.scrollLeft')
        await pg.mouse.down(); await pg.mouse.move(bb['x']+50, bb['y']+bb['height']/2, steps=10); await pg.mouse.up(); await pg.wait_for_timeout(800)
        after=await row.evaluate('e=>e.scrollLeft'); print('drag',before,after, pg.url)
        await pg.click('.hsW >> nth=0 >> .hsB.r'); await pg.wait_for_timeout(800); print('arrow',await row.evaluate('e=>e.scrollLeft'))
        await pg.screenshot(path='../hs1.png')
        await pg.click('.hsW >> nth=0 >> .hsB.l'); await pg.wait_for_timeout(800); print('arrowL',await row.evaluate('e=>e.scrollLeft'))
        # click still works without drag
        await pg.locator('#cTaegil').click(); await pg.wait_for_timeout(1000); print('click->',pg.url)
        print('ERR',errs); await b.close()
asyncio.run(main())
