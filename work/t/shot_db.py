import asyncio,sys
from playwright.async_api import async_playwright
SET=sys.argv[1] if len(sys.argv)>1 else 'a'
CASES={'a':"S={name:'김은주',nick:'은주',bro:false,date:{y:1996,m:5,d:14,cal:'양력'},hour:6}",
       'b':"S={name:'이민준',nick:'민준',bro:true,date:{y:1990,m:11,d:3,cal:'음력'},hour:-1}",
       'c':"S={name:'박서연',nick:'서연',bro:false,date:{y:1993,m:3,d:27,cal:'양력'},hour:0}"}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and errs.append('console:'+m.text))
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate(CASES[SET]+"; if(S.bro){ broDom(stage); } document.getElementById('splash').classList.add('off'); R=saju(S.date.y,S.date.m,S.date.d,S.hour,S.date.cal); showResult();")
        await pg.wait_for_timeout(4500)
        h=await pg.evaluate("document.getElementById('result').scrollHeight")
        await pg.set_viewport_size({'width':400,'height':h}); await pg.wait_for_timeout(900)
        await pg.evaluate("document.querySelectorAll('#result .lb-anim').forEach(e=>e.classList.add('in'))"); await pg.wait_for_timeout(700)
        await pg.screenshot(path=f't/db_free_{SET}.png')
        # 결제 뒤
        await pg.set_viewport_size({'width':400,'height':860})
        await pg.evaluate("buildLetter(); DohwaPrem.open(); document.getElementById('letter').classList.add('on'); document.getElementById('pay').classList.remove('on');")
        await pg.wait_for_timeout(1500)
        h=await pg.evaluate("document.getElementById('letter').scrollHeight")
        await pg.set_viewport_size({'width':400,'height':h}); await pg.wait_for_timeout(900)
        await pg.screenshot(path=f't/db_paid_{SET}.png')
        txt=await pg.evaluate("document.getElementById('result').innerText+'\\n'+document.getElementById('letter').innerText")
        import re
        print('hanja',set(re.findall(r'[㐀-鿿]',txt)),'bad',set(re.findall(r'[?!…]',txt)),'undef',len(re.findall(r'undefined|NaN',txt)))
        print('ERR',errs[:6]); await b.close()
asyncio.run(main())
