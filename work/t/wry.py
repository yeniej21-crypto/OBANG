import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("try{sessionStorage.setItem('toHome','1');sessionStorage.setItem('me',JSON.stringify({name:'은주',y:1990,m:3,d:3,h:null,g:'f',cal:'s'}));localStorage.setItem('obWorry',JSON.stringify({tag:'새 인연',text:'',at:1}));}catch(e){}")
        await pg.goto('http://localhost:8812/seoha-salon.html'); await pg.wait_for_timeout(3000)
        print(await pg.evaluate("[document.getElementById('secWry').hidden, getComputedStyle(document.getElementById('home')).display, document.getElementById('wyWho').textContent]"))
        await pg.screenshot(path='t/home_wry.png'); print(errs[:3]); await b.close()
asyncio.run(main())
