import asyncio,sys
from playwright.async_api import async_playwright
# usage: zoom.py out.png selector [state] [width]
out,sel=sys.argv[1],sys.argv[2]; st=sys.argv[3] if len(sys.argv)>3 else 'solo'; W=int(sys.argv[4]) if len(sys.argv)>4 else 390
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':W,'height':844},device_scale_factor=2)
        await pg.goto('http://localhost:8766/love2.html?m=next'); await pg.wait_for_timeout(800)
        await pg.evaluate(f"document.querySelector('#sSeg [data-v={st}]').click(); document.getElementById('goBtn').click()"); await pg.wait_for_timeout(2600)
        await pg.evaluate("document.querySelectorAll('.lb-anim').forEach(e=>e.classList.add('in'))")
        el=pg.locator(sel).first; await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(500)
        await el.screenshot(path=out); await b.close()
asyncio.run(main())
