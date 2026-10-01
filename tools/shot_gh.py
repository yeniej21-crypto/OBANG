import asyncio, sys
from playwright.async_api import async_playwright
mock=len(sys.argv)>1 and sys.argv[1]=='m'
MOCK=open('/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/mock2.js').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        if mock: await pg.add_init_script(MOCK)
        await pg.goto('http://localhost:8766/gunghap.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#wA [data-k=n]').value='은주'; document.querySelector('#wB [data-k=n]').value='민준'; document.querySelector('#wB .seg[data-k=g] [data-v=m]').click(); document.getElementById('goBtn').click()")
        await pg.wait_for_timeout(3500)
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(2500)
        if mock:
            P=await pg.evaluate("window.__P"); print('calls',len(P),[len(x) for x in P]); open('mock_gh0.txt','w').write(P[0] if P else ''); open('mock_gh1.txt','w').write(P[1] if len(P)>1 else '')
            t=await pg.evaluate("document.getElementById('gprem').innerText"); print('AI' in t, t[:600].replace('\n',' | '))
        else:
            top=await pg.evaluate("document.getElementById('gprem').offsetTop"); hh=await pg.evaluate("document.getElementById('gprem').offsetHeight"); y=top; i=0
            while y<top+hh and i<7:
                await pg.evaluate(f"document.getElementById('sRs').scrollTop={y}"); await pg.wait_for_timeout(250); await pg.screenshot(path=f'gh{i}.png'); y+=820; i+=1
            print('n',i,hh)
        print('ERR',errs[:4]); await b.close()
asyncio.run(main())
