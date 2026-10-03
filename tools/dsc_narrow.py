import asyncio
from playwright.async_api import async_playwright
SP='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':320,'height':700},device_scale_factor=2,reduced_motion='reduce'); pg=await ctx.new_page()
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1000)
        await pg.evaluate("()=>{ document.getElementById('splash').classList.add('off'); S={name:'박도윤',nick:'도윤',bro:true,date:{y:1984,m:9,d:24,cal:'양력'},hour:-1}; broDom(stage); R=saju(1984,9,24,-1,'양력'); showResult(); }")
        await pg.wait_for_timeout(600); await pg.evaluate("document.querySelectorAll('#th [data-why]').forEach(b=>b.click())")
        for i,y in enumerate([560,1180,1800]):
            await pg.evaluate(f"document.getElementById('result').scrollTop={y}"); await pg.wait_for_timeout(200); await pg.screenshot(path=f'{SP}/t/dsc_n{i}.png')
        await b.close()
asyncio.run(main())
