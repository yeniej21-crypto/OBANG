import asyncio
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":1200,"height":900}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto('file:///tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/export/오방사주_사업계획서_v2.html'); await pg.wait_for_timeout(1500)
        for i,sel in enumerate(['#s3 .cases','#s4 .castLab','#s6 .ladder','#s6 .sub:last-of-type','#s9 .sub','#s10 .stats','#s10 .sub']):
            el=pg.locator(sel).first; await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f'pl_{i}.png')
        print(errs, await pg.evaluate("[...document.querySelectorAll('.section-num')].map(e=>e.textContent).join(',')"))
        await b.close()
asyncio.run(main())
