import asyncio, sys
from playwright.async_api import async_playwright
mock=len(sys.argv)>1 and sys.argv[1]=='m'
MOCK=open('/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/mock2.js').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        if mock: await pg.add_init_script(MOCK)
        await pg.goto('http://localhost:8766/obgh.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.getElementById('nm').value='은주'; document.getElementById('bh').value='6'; document.getElementById('goBtn').click()")
        await pg.wait_for_timeout(4500)
        await pg.evaluate("document.getElementById('pay').click()"); await pg.wait_for_timeout(2500)
        if mock:
            P=await pg.evaluate("window.__P"); print('calls',len(P),[len(x) for x in P]); open('mock_og0.txt','w').write(P[0] if P else '')
            t=await pg.evaluate("document.getElementById('oprem').innerText"); print('AI' in t, t[:500].replace('\n',' | '))
        else:
            top=await pg.evaluate("document.getElementById('oprem').offsetTop"); hh=await pg.evaluate("document.getElementById('oprem').offsetHeight"); y=top-40; i=0
            while y<top+hh and i<7:
                await pg.evaluate(f"document.getElementById('sOut').scrollTop={y}"); await pg.wait_for_timeout(250); await pg.screenshot(path=f'og{i}.png'); y+=820; i+=1
            print('n',i,hh)
        print('ERR',errs[:4]); await b.close()
asyncio.run(main())
