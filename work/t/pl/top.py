import asyncio, sys
from playwright.async_api import async_playwright
SP='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/pl'
g=sys.argv[1]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2); pg=await ctx.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate("""()=>{ document.getElementById('splash').classList.add('off'); S={name:'김서준',nick:nickOf('김서준'),bro:%s,date:{y:1993,m:11,d:2,cal:'양력'},hour:-1}; if(S.bro) broDom(stage); R=saju(1993,11,2,-1,'양력'); showResult(); }"""%('true' if g=='m' else 'false'))
        await pg.wait_for_timeout(800); await pg.click('#skipBtn'); await pg.wait_for_timeout(500)
        await pg.click('#th [data-pay]'); await pg.wait_for_timeout(600)
        await pg.click('.obp [data-agree]'); await pg.click('.obp [data-pay]')
        for i in range(6):
            await pg.wait_for_timeout(1500)
            st=await pg.evaluate("[document.getElementById('letter').classList.contains('on'),[...document.getElementById('lTh').children].map(x=>x.className).join('|'),document.getElementById('lVm').className]")
            print(i,st)
        await pg.screenshot(path=f'{SP}/top_{g}.png')
        print(await pg.evaluate("document.getElementById('lTh').innerText"))
        print('ERR',errs)
        await b.close()
asyncio.run(main())
