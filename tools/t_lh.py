import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort()); await pg.route('**/fonts.googleapis.com/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/home_shadow2.html'); await pg.evaluate("sessionStorage.setItem('toHome','1')")
        for u in ['home_shadow.html','home_shadow2.html','home_shadow2.html?ng=geum']:
            await pg.goto('http://localhost:8812/'+u); await pg.wait_for_timeout(1500)
            print(u, await pg.evaluate("(()=>{const e=document.querySelector('#secLoveHub'); const cs=getComputedStyle(e); return [e.offsetHeight,cs.display,e.hidden, document.querySelector('#home').className]})()"))
        await pg.evaluate("document.querySelector('#secLoveHub').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(3000)
        await pg.screenshot(path='n_thr.png')
        await b.close()
asyncio.run(main())
