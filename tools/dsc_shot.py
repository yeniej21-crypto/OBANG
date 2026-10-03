import asyncio, sys, json
from playwright.async_api import async_playwright
SP='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad'
# usage: dsc_shot.py tag name g y m d hour cal [fast]
tag,name,g,y,m,d,hour,cal=sys.argv[1:9]; fast=len(sys.argv)>9 and sys.argv[9]=='fast'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append('console:'+m.text) if m.type=='error' and 'Failed to load' not in m.text and 'net::' not in m.text else None)
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate(f"""()=>{{ document.getElementById('splash').classList.add('off'); S={{name:'{name}',nick:nickOf('{name}'),bro:{'true' if g=='m' else 'false'},date:{{y:{y},m:{m},d:{d},cal:'{cal}'}},hour:{hour}}}; if(S.bro) broDom(stage); R=saju({y},{m},{d},S.hour,'{cal}'); showResult(); }}""")
        if fast:
            await pg.wait_for_timeout(1500); await pg.click('#skipBtn'); await pg.wait_for_timeout(1200)
        else:
            # walk the scene: tap quick replies as they come
            for i in range(80):
                await pg.wait_for_timeout(700)
                q=await pg.query_selector('#th .qr:not(.ask) button')
                if q: await q.click()
                done=await pg.evaluate("!!document.querySelector('#th .qr.ask')")
                if done: break
        await pg.wait_for_timeout(800)
        H=await pg.evaluate("document.getElementById('result').scrollHeight"); y0=0; i=0
        while y0<H and i<12:
            await pg.evaluate(f"document.getElementById('result').scrollTop={y0}"); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f'{SP}/t/dsc_{tag}_{i}.png'); y0+=760; i+=1
        sw=await pg.evaluate("[document.documentElement.scrollWidth,document.getElementById('result').scrollWidth,document.getElementById('result').clientWidth]")
        txt=await pg.evaluate("document.getElementById('result').innerText")
        print('shots',i,'sw',sw,'ERR',errs[:5])
        open(f'{SP}/t/dsc_{tag}.txt','w').write(txt)
        await b.close()
asyncio.run(main())
