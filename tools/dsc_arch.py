import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860})
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1000)
        await pg.evaluate("()=>{ document.getElementById('splash').classList.add('off'); S={name:'은주',nick:'은주',bro:false,date:{y:1996,m:5,d:14,cal:'양력'},hour:6}; R=saju(1996,5,14,6,'양력'); showResult(); }")
        await pg.wait_for_timeout(4500)
        print(await pg.evaluate("JSON.stringify(ObArch.list().map(x=>[x.k,x.h,x.s,x.sub,x.lines]))"))
        await b.close()
asyncio.run(main())
