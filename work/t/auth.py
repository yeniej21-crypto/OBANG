import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8812/dohwa.html'); await pg.wait_for_timeout(2000)
        print('auth', await pg.evaluate("[!!window.ObAuth, window.ObAuth&&ObAuth.mode(), window.ObAuth&&ObAuth.user()]"))
        await pg.evaluate("""()=>{ document.getElementById('splash').classList.add('off'); S={name:'김서연',nick:nickOf('김서연'),bro:false,date:{y:1996,m:5,d:14,cal:'양력'},hour:6}; R=saju(1996,5,14,6,'양력'); showResult(); }""")
        await pg.wait_for_timeout(1200); await pg.evaluate("document.getElementById('skipBtn').click()"); await pg.wait_for_timeout(2000)
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(900)
        print('sheet', await pg.evaluate("[!!document.querySelector('.oba.on'), !!document.querySelector('.obp.on')]"))
        await pg.screenshot(path='t/auth1.png')
        await pg.evaluate("document.querySelector('.oba [data-p=kakao]').click()"); await pg.wait_for_timeout(1200)
        print('after', await pg.evaluate("[!!document.querySelector('.oba.on'), !!document.querySelector('.obp.on'), ObAuth.user()&&ObAuth.user().provider]"))
        await pg.goto('http://localhost:8812/seoha-salon.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("sessionStorage.setItem('toHome','1')"); await pg.reload(); await pg.wait_for_timeout(2500)
        await pg.evaluate("document.getElementById('hMenu').click()"); await pg.wait_for_timeout(600)
        print('row', await pg.evaluate("(document.getElementById('obaRow')||{}).textContent"))
        await pg.screenshot(path='t/auth2.png'); print('ERR',errs[:3]); await b.close()
asyncio.run(main())
