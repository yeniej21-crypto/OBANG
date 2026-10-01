import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/free.html'); await pg.evaluate("sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))")
        for k in ['color','food','pastus','mbti']:
            await pg.goto(f'http://localhost:8766/free.html?t={k}'); await pg.wait_for_timeout(1200)
            if k=='pastus':
                await pg.evaluate("document.getElementById('pNm').value='민준'; document.getElementById('goBtn').click()")
            else:
                await pg.evaluate("document.getElementById('meQ').click()")
            await pg.wait_for_timeout(3200)
            if k=='mbti': await pg.evaluate("document.querySelector('#mbPick [data-m=INFP]').click()")
            h=await pg.evaluate("document.getElementById('sRs').scrollHeight"); y=0; i=0
            while y<h and i<3:
                await pg.evaluate(f"document.getElementById('sRs').scrollTop={y}"); await pg.wait_for_timeout(300); await pg.screenshot(path=f'fr_{k}{i}.png'); y+=820; i+=1
            print(k, i)
        print('ERR',errs[:5]); await b.close()
asyncio.run(main())
