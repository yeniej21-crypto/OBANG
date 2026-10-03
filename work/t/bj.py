import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8812/bujeok.html'); await pg.wait_for_timeout(1800)
        await pg.evaluate("document.getElementById('draw').click()"); await pg.wait_for_timeout(1200)
        print(await pg.evaluate("[document.getElementById('bjStamp').textContent, document.getElementById('bjShare').textContent, getComputedStyle(document.getElementById('bjMore')).display]"))
        await pg.evaluate("localStorage.setItem('obStamp',JSON.stringify({days:{[(d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`)(new Date())]:{el:'wood',ex:'a'}},dex:{},off:0}))")
        await pg.evaluate("bonusUI&&0"); await pg.evaluate("window.dispatchEvent(new Event('focus'))"); await pg.wait_for_timeout(300)
        print(await pg.evaluate("document.getElementById('bjStamp').textContent"))
        await pg.evaluate("document.getElementById('bjStamp').click()"); await pg.wait_for_timeout(1200)
        print(await pg.evaluate("[JSON.parse(localStorage.getItem('obDraw')), document.getElementById('draw').textContent]"))
        await pg.screenshot(path='t/bj.png'); print('ERR',errs); await b.close()
asyncio.run(main())
