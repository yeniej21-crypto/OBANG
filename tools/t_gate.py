import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=document-user-activation-required']); pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8812/love.html'); await pg.wait_for_timeout(1200)
        print('gate',await pg.evaluate("!!document.querySelector('.obSg.on')"), 'fx before',await pg.evaluate("document.querySelectorAll('video.fx').length"))
        await pg.click('.obSg .go'); await pg.wait_for_timeout(800)
        print('after tap', await pg.evaluate("[...document.querySelectorAll('video.fx')].map(v=>v.src.slice(-12)+' muted='+v.muted+' rate='+v.playbackRate).join(' | ')"))
        print('ERR',errs); await b.close()
asyncio.run(main())
