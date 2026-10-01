import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':900})
        for page in ['peach.html','dohwa.html']:
            await pg.goto('http://localhost:8766/today.html'); await pg.evaluate("sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1996,m:5,d:14,h:6}))")
            await pg.goto('http://localhost:8766/_home.html'); await pg.wait_for_timeout(300)
            await pg.goto(f'http://localhost:8766/{page}'); await pg.wait_for_timeout(1200)
            await pg.click('#backBtn',timeout=3000); await pg.wait_for_timeout(1500)
            home=await pg.evaluate("!!document.getElementById('home')&&document.getElementById('home').classList.contains('on')")
            print(page,'->',pg.url,'home shown:',home)
        await b.close()
asyncio.run(main())
