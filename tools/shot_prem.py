import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append('C:'+m.text) if m.type=='error' else None)
        await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelectorAll('.mi,.menuIntro,#mIntro').forEach(e=>e.remove())")
        await pg.evaluate("document.getElementById('goBtn').click()"); await pg.wait_for_timeout(3600)
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(1500)
        h=await pg.evaluate("(()=>{const r=document.getElementById('sRep'); const p=document.getElementById('prem'); return [r.scrollHeight,p.offsetTop,p.offsetHeight]})()")
        print(h)
        # screenshot prem in chunks
        top=h[1]; i=0
        while top < h[1]+h[2] and i<9:
            await pg.evaluate(f"document.getElementById('sRep').scrollTop={top}"); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f'pm{i}.png'); top+=820; i+=1
        print('n',i); print('ERR',errs[:8]); await b.close()
asyncio.run(main())
