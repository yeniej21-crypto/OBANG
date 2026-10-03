import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=document-user-activation-required']); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8812/love.html'); await pg.wait_for_timeout(1500)
        print('before', await pg.evaluate("[document.getElementById('sv').muted, document.getElementById('sv').paused, document.querySelector('.obSg.on')?1:0]"))
        await pg.click('.obSg .go'); await pg.wait_for_timeout(500)
        print('after', await pg.evaluate("[document.getElementById('sv').muted, document.getElementById('snd').className]"))
        print('ERR',errs); await b.close()
asyncio.run(main())
