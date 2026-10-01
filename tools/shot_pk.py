import asyncio, sys
from playwright.async_api import async_playwright
page=sys.argv[1]; out=sys.argv[2]; pre=sys.argv[3] if len(sys.argv)>3 else ''; n=int(sys.argv[4]) if len(sys.argv)>4 else 8
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/'+page); await pg.wait_for_timeout(1500)
        if pre: await pg.evaluate(pre)
        await pg.evaluate("document.getElementById('goBtn').click()"); await pg.wait_for_timeout(4200)
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(1500)
        h=await pg.evaluate("(()=>{const p=document.getElementById('prem'); const s=p.closest('.scr'); return [s.scrollHeight,p.offsetTop,p.offsetHeight]})()"); print(h)
        top=h[1]; i=0
        while top<h[1]+h[2] and i<n:
            await pg.evaluate(f"document.getElementById('prem').closest('.scr').scrollTop={top}"); await pg.wait_for_timeout(250); await pg.screenshot(path=f'{out}{i}.png'); top+=820; i+=1
        print('n',i,'ERR',errs[:5]); await b.close()
asyncio.run(main())
