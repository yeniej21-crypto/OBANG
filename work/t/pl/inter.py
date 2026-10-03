import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1000)
        await pg.evaluate("""()=>{ document.getElementById('splash').classList.add('off'); S={name:'이하늘',nick:nickOf('이하늘'),bro:false,date:{y:2000,m:2,d:29,cal:'양력'},hour:11}; R=saju(2000,2,29,11,'양력'); showResult(); }""")
        await pg.wait_for_timeout(600); await pg.click('#skipBtn'); await pg.wait_for_timeout(400)
        await pg.evaluate("PAID=false; buildLetter(); DohwaPrem.open({mode:'letter',root:document.getElementById('letter')}); openLetter();")
        await pg.wait_for_timeout(5000)
        n0=await pg.evaluate("document.querySelectorAll('.dl-mo.open').length")
        await pg.evaluate("document.querySelector('.dl-mo:not(.open) .h').click(); document.querySelector('#letter [data-why]').click()")
        n1=await pg.evaluate("[document.querySelectorAll('.dl-mo.open').length, document.querySelectorAll('#letter .dl-whyT.on').length]")
        await pg.evaluate("document.getElementById('lVm').click()"); await pg.wait_for_timeout(3000)
        await pg.evaluate("document.getElementById('lEnv').click()"); await pg.wait_for_timeout(1000)
        st=await pg.evaluate("[document.getElementById('letter').scrollTop, document.getElementById('lVm').dataset.st]")
        # old kit mode still works
        await pg.evaluate("DohwaPrem.open()"); await pg.wait_for_timeout(500)
        k=await pg.evaluate("document.querySelectorAll('#dprem .pk-sec').length")
        await pg.evaluate("document.getElementById('lAsk').click()"); await pg.wait_for_timeout(800)
        ask=await pg.evaluate("document.querySelectorAll('[class*=ak]').length")
        print('open',n0,n1,'scroll/st',st,'kitsecs',k,'ask nodes',ask,'ERR',errs)
        await b.close()
asyncio.run(main())
