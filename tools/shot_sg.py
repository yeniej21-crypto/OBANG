import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort())
        for name,url,sel in [('home','home_shadow.html','#secShadow'),('love','love.html','.sgx'),('free','free.html','.sgx'),('sin','sinnyeon.html','.sgx')]:
            await pg.goto('http://localhost:8812/'+url); await pg.wait_for_timeout(1200)
            n=await pg.evaluate("s=>{const e=document.querySelector(s);return e?e.innerText.slice(0,120)+' | '+e.querySelectorAll('a.c').length:'none'}",sel)
            print(name,n.replace('\n',' / '))
            try:
                await pg.evaluate("s=>{const e=document.querySelector(s); e&&e.scrollIntoView()}",sel); await pg.wait_for_timeout(300)
                el=await pg.query_selector(sel)
                if el and await el.is_visible(): await el.screenshot(path=f'/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/sg_{name}.png')
                else: print(name,'not visible')
            except Exception as e: print(name,'shot err',e)
        print('errs',errs[:5]); await b.close()
asyncio.run(main())
