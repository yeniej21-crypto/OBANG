import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/love2.html?m=next'); await pg.wait_for_timeout(600)
        await pg.evaluate("document.getElementById('goBtn').click()"); await pg.wait_for_timeout(2500)
        await pg.evaluate("document.querySelector('.obs-btn').click()"); await pg.wait_for_timeout(2500)
        r=await pg.evaluate("(()=>{const o=document.querySelector('.obs'); return {on:o&&o.classList.contains('on'), img:!!(o&&o.querySelector('.pv img').src)}})()")
        await pg.screenshot(path='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/l2_v3_share.png'); print(r,errs); await b.close()
asyncio.run(main())
