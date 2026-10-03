import asyncio
from playwright.async_api import async_playwright
SP='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/pl'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2); pg=await ctx.new_page()
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate("""()=>{ document.getElementById('splash').classList.add('off'); S={name:'김서연',nick:nickOf('김서연'),bro:false,date:{y:1996,m:5,d:14,cal:'양력'},hour:6}; R=saju(1996,5,14,6,'양력'); showResult(); }""")
        await pg.wait_for_timeout(800); await pg.evaluate("document.getElementById('result').scrollTop=500"); await pg.wait_for_timeout(1500)
        await pg.click('#skipBtn'); await pg.wait_for_timeout(1000)
        for i,y in enumerate([500,1300,2100]):
            await pg.evaluate(f"document.getElementById('result').scrollTop={y}"); await pg.wait_for_timeout(500)
            await pg.screenshot(path=f'{SP}/free_{i}.png')
        await b.close()
asyncio.run(main())
