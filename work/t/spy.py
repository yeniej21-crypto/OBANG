import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page()
        await pg.add_init_script("try{sessionStorage.setItem('toHome','1');}catch(e){}")
        await pg.goto('http://localhost:8812/seoha-salon.html'); await pg.wait_for_timeout(2500); await pg.wait_for_timeout(1200); renderW=await pg.evaluate("try{renderWry();1}catch(e){String(e)}"); print('rw',renderW)
        secs=await pg.evaluate("[...document.querySelectorAll('#home > section, #home > div')].filter(s=>!s.hidden&&s.offsetHeight>0).map(s=>[s.id||'-',s.offsetTop])")
        for sid,top in secs:
            await pg.evaluate(f"document.getElementById('home').scrollTop={top}-120"); await pg.wait_for_timeout(250)
            print(sid, await pg.evaluate("document.querySelector('#pills button.on').textContent"))
        await pg.evaluate("document.getElementById('home').scrollTop=0"); await pg.wait_for_timeout(400)
        await pg.screenshot(path='t/home_top.png')
        await pg.evaluate("document.getElementById('home').scrollTop=document.getElementById('secLoveHub').offsetTop-140"); await pg.wait_for_timeout(500); await pg.screenshot(path='t/home_lhub.png')
        for c in ['love','gaeun','heart','match']:
            await pg.evaluate(f"document.querySelector('#pills button[data-c={c}]').click()"); await pg.wait_for_timeout(1300)
            print('click',c,'->',await pg.evaluate("document.getElementById('home').scrollTop"), await pg.evaluate("document.querySelector('#pills button.on').textContent"))
        await b.close()
asyncio.run(main())
