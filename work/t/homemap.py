import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("try{sessionStorage.setItem('toHome','1');sessionStorage.setItem('obLow',JSON.stringify({k:'earth'}));}catch(e){}")
        await pg.route('**/hanja.js', lambda r: r.continue_())
        await pg.goto('http://localhost:8811/seoha-salon.html'); await pg.wait_for_timeout(2500)
        vis=await pg.evaluate("getComputedStyle(document.getElementById('home')).display+' '+document.getElementById('home').className")
        print('home',vis)
        r=await pg.evaluate("""[...document.querySelectorAll('#home > section, #home > div')].filter(s=>!s.hidden&&s.offsetHeight>0).map(s=>[s.id||'-',s.className.slice(0,30),s.offsetTop,s.offsetHeight,(s.querySelector('.sh b,.sh h3,h3,b')||{}).textContent||''].join(' | ').slice(0,140))""")
        print('\n'.join(r)); print('offsetParent of secJt:', await pg.evaluate("(document.getElementById('secJt').offsetParent||{}).id"))
        print('ERR',errs[:3]); await b.close()
asyncio.run(main())
