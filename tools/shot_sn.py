import asyncio,sys
from playwright.async_api import async_playwright
page,host,scr,out=sys.argv[1:5]; mock=len(sys.argv)>5
MOCK=open('mock2.js').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        if mock: await pg.add_init_script(MOCK)
        await pg.goto('http://localhost:8766/'+page); await pg.evaluate("sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))")
        await pg.goto('http://localhost:8766/'+page); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelectorAll('button').forEach(b=>{ if(/건너뛰기/.test(b.textContent)) b.click(); })"); await pg.wait_for_timeout(800)
        await pg.evaluate("document.getElementById('goBtn')&&document.getElementById('goBtn').click()"); await pg.wait_for_timeout(5000)
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(2500)
        t=await pg.evaluate(f"document.getElementById('{host}').innerText"); print(t[:1800].replace('\n',' | '))
        if not mock:
            top=await pg.evaluate(f"(()=>{{const h=document.getElementById('{host}'), s=document.getElementById('{scr}'); return h.getBoundingClientRect().top-s.getBoundingClientRect().top+s.scrollTop}})()"); y=top
            for i in range(3):
                await pg.evaluate(f"document.getElementById('{scr}').scrollTop={y}"); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{out}{i}.png'); y+=800
        print('ERR',errs[:3]); await b.close()
asyncio.run(main())
