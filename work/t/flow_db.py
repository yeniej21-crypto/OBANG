import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(900)
        await pg.evaluate("S={name:'김은주',nick:'은주',bro:false,date:{y:1996,m:5,d:14,cal:'음력'},hour:-1}; document.getElementById('splash').classList.add('off'); loadingSeq();")
        await pg.wait_for_timeout(12000)
        r=await pg.evaluate("({res:stage.classList.contains('res'),type:document.getElementById('rType').textContent,idx:document.getElementById('rIdx').textContent,secs:document.querySelectorAll('#dhBody .lb-sec').length,pay:document.getElementById('pay').classList.contains('on')})")
        print(r)
        # 결제 시트 → 편지
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(800)
        await pg.evaluate("(()=>{const o=document.querySelector('.obp.on'); const ag=o.querySelector('[data-agree]'); ag.checked=true; ag.onchange(); o.querySelector('[data-pay]').click();})()")
        await pg.wait_for_timeout(6500)
        r=await pg.evaluate("({letter:document.getElementById('letter').classList.contains('on'),prem:!document.getElementById('dprem').hidden,cal:document.querySelectorAll('#cal12>div').length})")
        print(r); await pg.screenshot(path='t/db_letter_top.png'); print('ERR',errs[:4]); await b.close()
asyncio.run(main())
