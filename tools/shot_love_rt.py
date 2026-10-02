import asyncio
from playwright.async_api import async_playwright
T='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860},device_scale_factor=2); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/love.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('#st [data-i=\"3\"]').click()"); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=T+'rt_13_love_sheet.png'); print('ERR',errs)
        await b.close()
asyncio.run(main())
