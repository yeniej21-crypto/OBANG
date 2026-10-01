import asyncio, sys
from playwright.async_api import async_playwright
mock=len(sys.argv)>1
MOCK=open('/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/mockai.py').read().split('MOCK="""')[1].split('"""')[0]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        if mock: await pg.add_init_script(MOCK.replace('\\\\','\\'))
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("S={name:'은주',nick:'은주',bro:false,date:{y:1996,m:5,d:14,cal:'양력'},hour:6}; R=Saju.pillars(1996,5,14,6); RES={T:TYPES[target(R.d[1])],score:82,peachN:1}; buildLetter(); DohwaPrem.open(); document.getElementById('letter').classList.add('on');")
        await pg.wait_for_timeout(2500)
        if mock:
            P=await pg.evaluate("window.__P"); print('calls',len(P),[len(x) for x in P]); t=await pg.evaluate("document.getElementById('dprem').innerText"); print('AI' in t, t[:300].replace('\n',' | '))
        else:
            top=await pg.evaluate("document.getElementById('dprem').offsetTop"); hh=await pg.evaluate("document.getElementById('dprem').offsetHeight"); y=top; i=0
            while y<top+hh and i<6:
                await pg.evaluate(f"document.getElementById('letter').scrollTop={y}"); await pg.wait_for_timeout(250); await pg.screenshot(path=f'dh{i}.png'); y+=820; i+=1
            print('n',i)
        print('ERR',errs[:4]); await b.close()
asyncio.run(main())
