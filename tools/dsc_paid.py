import asyncio, sys, re
from playwright.async_api import async_playwright
SP='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad'
tag,name,g,y,m,d,hour,cal=sys.argv[1:9]
BAD=re.compile(r'undefined|NaN|null|\?|!|…|[一-鿿]')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':400,'height':860},device_scale_factor=2,reduced_motion='reduce'); pg=await ctx.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate(f"""()=>{{ document.getElementById('splash').classList.add('off'); S={{name:'{name}',nick:nickOf('{name}'),bro:{'true' if g=='m' else 'false'},date:{{y:{y},m:{m},d:{d},cal:'{cal}'}},hour:{hour}}}; if(S.bro) broDom(stage); R=saju({y},{m},{d},S.hour,'{cal}'); showResult(); }}""")
        await pg.wait_for_timeout(800)
        await pg.click('#th [data-pay]'); await pg.wait_for_timeout(600)
        await pg.screenshot(path=f'{SP}/t/dsc_{tag}_sheet.png')
        await pg.click('.obp [data-agree]'); await pg.click('.obp [data-pay]'); await pg.wait_for_timeout(5500)
        on=await pg.evaluate("document.getElementById('letter').classList.contains('on')")
        H=await pg.evaluate("document.getElementById('letter').scrollHeight"); y0=0; i=0
        while y0<H and i<14:
            await pg.evaluate(f"document.getElementById('letter').scrollTop={y0}"); await pg.wait_for_timeout(250)
            await pg.screenshot(path=f'{SP}/t/dsc_{tag}_L{i}.png'); y0+=780; i+=1
        t=await pg.evaluate("document.getElementById('letter').innerText")
        sw=await pg.evaluate("[document.getElementById('letter').scrollWidth,document.getElementById('letter').clientWidth]")
        open(f'{SP}/t/dsc_{tag}_letter.txt','w').write(t)
        # close letter, check thread button relabel, reopen
        await pg.click('#lClose'); await pg.wait_for_timeout(800)
        lbl=await pg.evaluate("document.querySelector('#th [data-pay]').textContent")
        await pg.click('#th [data-pay]'); await pg.wait_for_timeout(800)
        on2=await pg.evaluate("document.getElementById('letter').classList.contains('on')")
        obp=await pg.evaluate("!!document.querySelector('.obp.on')")
        print('letter on',on,'shots',i,'sw',sw,'bad',sorted(set(BAD.findall(t))),'relabel',lbl,'reopen',on2,'sheet again',obp,'ERR',errs[:5])
        await b.close()
asyncio.run(main())
