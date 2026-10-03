import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page(); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate("""()=>{ document.getElementById('splash').classList.add('off'); S={name:'김서연',nick:nickOf('김서연'),bro:false,date:{y:1996,m:5,d:14,cal:'양력'},hour:6}; R=saju(1996,5,14,6,'양력'); showResult(); }""")
        await pg.wait_for_timeout(600); await pg.evaluate("document.getElementById('result').scrollTop=document.getElementById('th').offsetTop-200")
        await pg.wait_for_timeout(9000)
        await pg.evaluate("document.getElementById('result').scrollTop=0"); await pg.wait_for_timeout(5000)
        n1=await pg.evaluate("document.querySelectorAll('#th .row').length"); pill=await pg.evaluate("document.getElementById('nPill').classList.contains('on')")
        await pg.wait_for_timeout(5000); n2=await pg.evaluate("document.querySelectorAll('#th .row').length"); print('scrolled up rows',n1,'->',n2,'pill',pill)
        await pg.evaluate("document.getElementById('nPill').click()"); await pg.wait_for_timeout(5000); print('after pill',await pg.evaluate("document.querySelectorAll('#th .row').length"))
        await pg.evaluate("document.getElementById('skipBtn').click()"); await pg.wait_for_timeout(1500); print('after skip',await pg.evaluate("document.querySelectorAll('#th .row').length"),await pg.evaluate("[...document.querySelectorAll('#th video')].map(v=>v.loop)"))
        print('ERR',errs); await b.close()
asyncio.run(main())
