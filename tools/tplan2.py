import asyncio
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":1200,"height":1300})
        await pg.goto('file:///tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/export/오방사주_사업계획서_v2.html'); await pg.wait_for_timeout(1200)
        el=pg.locator('.castLab').nth(1); await el.scroll_into_view_if_needed(); await pg.evaluate("window.scrollBy(0,-60)"); await pg.wait_for_timeout(300); await pg.screenshot(path='pl_cast.png')
        await b.close()
asyncio.run(main())
