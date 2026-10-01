import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':900})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/_home.html'); await pg.evaluate("sessionStorage.setItem('toHome','1');sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))")
        await pg.goto('http://localhost:8766/_home.html'); await pg.wait_for_timeout(4000)
        await pg.evaluate("document.getElementById('fzRow').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(800)
        await pg.screenshot(path='pc_fz.png')
        await pg.goto('http://localhost:8766/free.html'); await pg.wait_for_timeout(2500); await pg.screenshot(path='pc_free.png')
        print(errs); await b.close()
asyncio.run(main())
