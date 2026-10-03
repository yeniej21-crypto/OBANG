import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route('**/*cloudfront.net/**',lambda r:r.abort())
        await pg.goto('http://localhost:8812/geumeum.html'); await pg.evaluate("sessionStorage.setItem('obSnd','0')")
        await pg.goto('http://localhost:8812/geumeum.html'); await pg.wait_for_timeout(1200)
        el=await pg.query_selector('.vh .nm'); await el.screenshot(path='g_nm.png')
        sels=await pg.evaluate("[...document.querySelectorAll('#fm select')].map(s=>s.id)"); print(sels)
        ids=sels
        await pg.select_option('#'+ids[0],'1990'); await pg.select_option('#'+ids[1],'1'); await pg.select_option('#'+ids[2],'14')
        await pg.click('#goF'); await pg.wait_for_timeout(800)
        el=await pg.query_selector('#rs'); await el.screenshot(path='g_rs.png')
        print(await pg.evaluate("document.querySelector('#pd').innerText"))
        await pg.click('#pdGo'); await pg.wait_for_timeout(500); print('pv on',await pg.evaluate("document.querySelector('#pv').classList.contains('on')"))
        el=await pg.query_selector('#ot'); await el.screenshot(path='g_ot.png')
        print('ERR',errs); await b.close()
asyncio.run(main())
