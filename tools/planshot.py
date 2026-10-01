import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for name,vp in [('pc',{"width":1280,"height":900}),('mo',{"width":390,"height":844})]:
            pg=await b.new_page(viewport=vp); errs=[]
            pg.on("pageerror",lambda e: errs.append(str(e)))
            await pg.goto("file:///tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/export/오방사주_사업계획서.html"); await pg.wait_for_timeout(1500)
            await pg.screenshot(path=f"opv3/plan_{name}_top.png")
            for sid in ['s1','s4','sP','sG','s10','s11']:
                el=await pg.query_selector('#'+sid)
                await el.screenshot(path=f"opv3/plan_{name}_{sid}.png")
            sw=await pg.evaluate("document.documentElement.scrollWidth"); print(name,'scrollWidth',sw,errs)
        await b.close()
asyncio.run(main())
