import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page(); errs=[]
        pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/noeul.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelectorAll('.mi .x').forEach(b=>b.click())"); await pg.wait_for_timeout(800)
        await pg.mouse.click(200,400); await pg.wait_for_timeout(300)
        info=await pg.evaluate("""()=>{ window.__r=0; const o=BELL.ring; BELL.ring=()=>{window.__r++;}; const h=document.querySelector('#sTalk .pp[data-v="hand"]'); return [!!h, h&&h.closest('.scr')&&h.closest('.scr').id, document.getElementById('sTalk').classList.contains('on')]; }""")
        print('host',info)
        await pg.evaluate("""()=>{ const h=document.querySelector('#sTalk .pp[data-v="hand"]'); const t=document.getElementById('sTalk'); t.scrollTop=h.offsetTop-100; }"""); await pg.wait_for_timeout(2000)
        print("bell",await pg.evaluate("[window.__bell, document.getElementById('sndB').className]"))
        print('ERR',errs); await b.close()
asyncio.run(main())
