import asyncio,sys,re
from playwright.async_api import async_playwright
SET=sys.argv[1] if len(sys.argv)>1 else 'a'
CASES={'a':"document.querySelector('#wA [data-k=n]').value='은주'; document.querySelector('#wB [data-k=n]').value='민준'; document.querySelector('#wB .seg[data-k=g] [data-v=m]').click();",
       'b':"document.querySelector('#wA [data-k=n]').value='도윤'; document.querySelector('#wA .seg[data-k=g] [data-v=m]').click(); document.querySelector('#wA [data-k=y]').value='1990'; document.querySelector('#wA [data-k=y]').onchange(); document.querySelector('#wA [data-k=h]').value='3'; document.querySelector('#wB [data-k=n]').value='하린'; document.querySelector('#wB [data-k=y]').value='1993'; document.querySelector('#wB [data-k=m]').value='9'; document.querySelector('#wB [data-k=m]').onchange(); document.querySelector('#wB .seg[data-k=c] [data-v=l]').click();",
       'c':"document.querySelector('#wA [data-k=n]').value='서연'; document.querySelector('#wA [data-k=y]').value='1993'; document.querySelector('#wA [data-k=m]').value='3'; document.querySelector('#wA [data-k=m]').onchange(); document.querySelector('#wA [data-k=d]').value='27'; document.querySelector('#wA [data-k=h]').value='0'; document.querySelector('#wB [data-k=n]').value='준호'; document.querySelector('#wB .seg[data-k=g] [data-v=m]').click(); document.querySelector('#wB [data-k=y]').value='1991'; document.querySelector('#wB [data-k=y]').onchange(); document.querySelector('#wB [data-k=d]').value='2'; document.querySelector('#wB [data-k=h]').value='7';"}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/gunghap.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelectorAll('.mi,.menuIntro,[class*=mintro]').forEach(e=>e.remove())")
        await pg.evaluate(CASES[SET]+"document.getElementById('goBtn').click()")
        await pg.wait_for_timeout(3600)
        h=await pg.evaluate("document.getElementById('sRs').scrollHeight")
        await pg.set_viewport_size({'width':400,'height':h}); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f't/gh_free_{SET}.png')
        txt=await pg.evaluate("document.getElementById('sRs').innerText")
        await pg.set_viewport_size({'width':400,'height':860})
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(1800)
        r=await pg.evaluate("(()=>{const o=document.querySelector('.obp.on'); if(o){ const ag=o.querySelector('[data-agree]'); if(ag){ ag.checked=true; ag.onchange(); } const b=[...o.querySelectorAll('button')].find(x=>/결제/.test(x.textContent)&&!/취소/.test(x.textContent)); if(b){ b.click(); return 'obp:'+b.textContent; } } return 'none'; })()")
        await pg.wait_for_timeout(4200)
        h=await pg.evaluate("document.getElementById('sRs').scrollHeight")
        await pg.set_viewport_size({'width':400,'height':h}); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=f't/gh_paid_{SET}.png')
        txt2=await pg.evaluate("document.getElementById('sRs').innerText")
        sw=await pg.evaluate("document.getElementById('sRs').scrollWidth")
        print(SET,'pay',r,'gprem hidden',await pg.evaluate("document.getElementById('gprem').hidden"),'sw',sw)
        for t in (txt,txt2): print('hanja',set(re.findall(r'[㐀-鿿]',t)),'bad',set(re.findall(r'[?!…]',t)),'undef',len(re.findall(r'undefined|NaN',t)))
        print('ERR',errs[:6]); await b.close()
asyncio.run(main())
