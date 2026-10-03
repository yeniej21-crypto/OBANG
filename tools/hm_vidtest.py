import asyncio,re,os
from playwright.async_api import async_playwright
SP=os.path.dirname(os.path.abspath(__file__))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        async def html(r):
            resp=await r.fetch(); t=await resp.text()
            t=t.replace("vid:{ idle:'', rice:'', scroll:'', pouch:'' }","vid:{ idle:'https://vt.test/v.webm', rice:'https://vt.test/v.webm', scroll:'https://vt.test/v.webm', pouch:'https://vt.test/v.webm' }")
            await r.fulfill(response=resp,body=t)
        await pg.route('**/sinnyeon.html',html)
        await pg.route(re.compile(r'.*vt\.test.*'),lambda r:r.fulfill(path=SP+'/t/hm_vid/v.webm',content_type='video/webm'))
        await pg.route(re.compile(r'.*cloudfront\.net.*'),lambda r:r.abort())
        await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(900); await pg.evaluate("document.querySelectorAll('.mi .x').forEach(b=>b.click())"); await pg.wait_for_timeout(2500)
        st=lambda: pg.evaluate("VIDS.map(v=>[v.dataset.v,v.closest('.scr').id,!v.paused,v.classList.contains('on'),!!v.getAttribute('src')].join(':'))")
        print('room',await st()); await pg.screenshot(path=SP+'/t/hm_v_room.png')
        await pg.evaluate("go()"); await pg.wait_for_timeout(2500); print('rice',await st())
        await pg.evaluate("riceRun++; CUR&&scrollEnter()"); await pg.wait_for_timeout(1500); print('scroll',await st())
        await pg.evaluate("show('sRep')"); await pg.wait_for_timeout(1200); print('rep top',await st())
        await pg.evaluate("document.getElementById('dawn').scrollIntoView()"); await pg.wait_for_timeout(1200); print('rep dawn',await st()); await pg.screenshot(path=SP+'/t/hm_v_dawn.png')
        print('ERR',errs[:3]); await b.close()
asyncio.run(main())
