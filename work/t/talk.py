import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page()
        await pg.add_init_script("try{sessionStorage.setItem('toHome','1');sessionStorage.setItem('obLow',JSON.stringify({k:'earth'}));localStorage.setItem('obFace','yin');}catch(e){}")
        await pg.goto('http://localhost:8812/seoha-salon.html'); await pg.wait_for_timeout(3000)
        await pg.evaluate("document.getElementById('home').scrollTop=document.getElementById('secTalk').offsetTop-160"); await pg.wait_for_timeout(800)
        await pg.screenshot(path='t/talk.png')
        await pg.evaluate("document.getElementById('home').scrollTop=document.getElementById('fz').offsetTop-120"); await pg.wait_for_timeout(800)
        await pg.screenshot(path='t/fz.png'); await b.close()
asyncio.run(main())
