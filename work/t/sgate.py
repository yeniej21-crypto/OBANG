import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=user-gesture-required'])
        for page in ['yeonseo.html','lovemini.html','heart.html','noeul.html','sinnyeon.html','book.html','dohwa.html','seoha-salon.html','career.html']:
            pg=await (await b.new_context(viewport={'width':390,'height':844},has_touch=True)).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto('http://localhost:8811/'+page); await pg.wait_for_timeout(3500)
            g=await pg.evaluate("(()=>{const e=document.querySelector('.obSg.on'); const m=document.querySelector('.mi .gate.on'); return [!!e, !!m]})()")
            if page=='yeonseo.html': await pg.screenshot(path='t/sgate_'+page.split('.')[0]+'.png')
            if page=='sinnyeon.html': await pg.screenshot(path='t/sgate_mi.png')
            if g[0]:
                await pg.click('.obSg .go'); await pg.wait_for_timeout(1200)
                r=await pg.evaluate("[...document.querySelectorAll('audio,video')].filter(m=>!m.paused&&!m.muted).length")
            else: r='-'
            print(page,g,'playing-with-sound after tap:',r,errs[:2]); await pg.close()
        await b.close()
asyncio.run(main())
