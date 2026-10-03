import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page(); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8811/dohwa.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate("""()=>{ document.getElementById('splash').classList.add('off'); S={name:'김서연',nick:nickOf('김서연'),bro:false,date:{y:1996,m:5,d:14,cal:'양력'},hour:6}; R=saju(1996,5,14,6,'양력'); showResult(); }""")
        await pg.wait_for_timeout(1500); await pg.evaluate("document.getElementById('skipBtn').click()"); await pg.wait_for_timeout(2500)
        # 결과 맨 아래로 스크롤해 둔 상태에서 결제
        await pg.evaluate("document.getElementById('result').scrollTop=99999")
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(500)
        await pg.wait_for_timeout(600); await pg.evaluate("(()=>{const o=document.querySelector('.obp.on'); const ag=o.querySelector('[data-agree]'); ag.checked=true; ag.onchange&&ag.onchange(); ag.dispatchEvent(new Event('change')); o.querySelector('[data-pay]').click();})()")
        for t in [300,1500,3000,5000,8000]:
            await pg.wait_for_timeout(t if t==300 else 1500 if t==1500 else 1500)
            print(t, await pg.evaluate("(()=>{const L=document.getElementById('letter'); return [L.classList.contains('on'),L.scrollTop,L.scrollHeight,L.clientHeight, document.activeElement&&document.activeElement.id, document.getElementById('result').scrollTop]})()"))
        await pg.screenshot(path='t/let_a.png')
        print('obp on',await pg.evaluate("document.querySelectorAll('.obp.on').length"), await pg.evaluate("getComputedStyle(document.getElementById('letter')).cssText.length"))
        print('env', await pg.evaluate("(()=>{const e=document.getElementById('lEnv'),p=document.getElementById('lPaper');return [e.offsetTop,p.offsetTop,p.className, getComputedStyle(document.getElementById('letter')).scrollBehavior]})()"))
        await pg.evaluate("document.getElementById('lEnv').click()"); await pg.wait_for_timeout(2500)
        print('after env', await pg.evaluate("(()=>{const L=document.getElementById('letter'),p=document.getElementById('lPaper');return [L.scrollTop,p.offsetTop,p.className,p.getBoundingClientRect().top]})()"))
        await pg.screenshot(path='t/let_b.png'); print('ERR',errs); await b.close()
asyncio.run(main())
