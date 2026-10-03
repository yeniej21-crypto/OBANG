import asyncio, sys, re
from playwright.async_api import async_playwright
SP='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/pl'
tag=sys.argv[1]; g=sys.argv[2] if len(sys.argv)>2 else 'f'; rm=(sys.argv[3]=='rm') if len(sys.argv)>3 else False
BAD=re.compile(r'undefined|NaN|null|\?|!|…|[一-鿿]')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,reduced_motion='reduce' if rm else 'no-preference'); pg=await ctx.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.on('console',lambda m: errs.append('console:'+m.text) if m.type=='error' and 'Failed to load' not in m.text and 'net::' not in m.text else None)
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1200)
        name='김서연'; y,m,d,hour,cal=1996,5,14,6,'양력'
        await pg.evaluate(f"""()=>{{ document.getElementById('splash').classList.add('off'); S={{name:'{name}',nick:nickOf('{name}'),bro:{'true' if g=='m' else 'false'},date:{{y:{y},m:{m},d:{d},cal:'{cal}'}},hour:{hour}}}; if(S.bro) broDom(stage); R=saju({y},{m},{d},S.hour,'{cal}'); showResult(); }}""")
        await pg.wait_for_timeout(800)
        if await pg.is_visible('#skipBtn.on'): await pg.click('#skipBtn')
        await pg.wait_for_timeout(600)
        await pg.click('#th [data-pay]'); await pg.wait_for_timeout(600)
        if await pg.query_selector('.obp.on'):
            await pg.click('.obp [data-agree]'); await pg.click('.obp [data-pay]')
        else:
            await pg.click('#payNow')
        await pg.wait_for_timeout(8500)
        await pg.screenshot(path=f'{SP}/{tag}_0.png')
        H=await pg.evaluate("document.getElementById('letter').scrollHeight"); y0=0; i=0
        # slow scroll so reveal observers fire
        while y0<H and i<30:
            for k in range(4):
                await pg.evaluate(f"document.getElementById('letter').scrollTop={y0+k*170}"); await pg.wait_for_timeout(220)
            y0+=680; i+=1
            await pg.evaluate(f"document.getElementById('letter').scrollTop={y0}"); await pg.wait_for_timeout(900)
            await pg.screenshot(path=f'{SP}/{tag}_{i}.png')
            H=await pg.evaluate("document.getElementById('letter').scrollHeight")
        t=await pg.evaluate("document.getElementById('letter').innerText")
        sw=await pg.evaluate("[document.getElementById('letter').scrollWidth,document.getElementById('letter').clientWidth]")
        open(f'{SP}/{tag}_letter.txt','w').write(t)
        await pg.click('#lClose'); await pg.wait_for_timeout(800)
        lbl=await pg.evaluate("document.querySelector('#th [data-pay]').textContent")
        await pg.click('#th [data-pay]'); await pg.wait_for_timeout(1500)
        on2=await pg.evaluate("document.getElementById('letter').classList.contains('on')")
        print('H',H,'shots',i,'sw',sw,'bad',sorted(set(BAD.findall(t))),'relabel',lbl,'reopen',on2,'ERR',errs[:8])
        await b.close()
asyncio.run(main())
