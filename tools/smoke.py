import asyncio, os
from playwright.async_api import async_playwright
P="file:///tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/proto/seoha-salon.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        pg=await b.new_page(viewport={"width":390,"height":844})
        errs=[]; pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None); pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(P); await pg.wait_for_timeout(1500)
        await pg.click("#enter")
        await pg.wait_for_selector("#pChoice.on",timeout=40000); print("choice shown")
        await pg.click("#c1b"); await pg.wait_for_selector("#pBirth.on",timeout=40000); print("birth shown")
        await pg.click("#birthGo"); await pg.wait_for_selector("#pWorry.on",timeout=60000); print("worry shown")
        await pg.click("#worrySkip"); await pg.wait_for_selector("#result.on",timeout=90000); print("result shown")
        await pg.screenshot(path="/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/result.png")
        print("errors:",errs[:5])
        await b.close()
asyncio.run(main())
