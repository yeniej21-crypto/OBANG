import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8768','-d','ptest'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8768/index.html")
        await pg.wait_for_selector("#enter:not([disabled])",timeout=20000)
        await pg.click("#skipStory"); await pg.wait_for_selector("#pBirth.on",timeout=40000)
        await pg.click("#birthGo"); await pg.wait_for_selector("#pWorry.on",timeout=60000)
        await pg.click("#worrySkip"); await pg.wait_for_selector("#result.on",timeout=90000)
        await pg.wait_for_timeout(700); await pg.click("#ctaPartner")
        await pg.wait_for_selector("#pPartner.on",timeout=30000); print('partner panel ok, who=',await pg.evaluate("document.getElementById('who').textContent.length"))
        await pg.click("#pchips .chip:nth-child(2)"); await pg.click("#partnerGo")
        await pg.wait_for_selector("#report.on",timeout=30000)
        print('title', repr(await pg.inner_text('#rpTitle')), '| b1', repr(await pg.inner_text('#b1'))[:60], '| b2', repr(await pg.inner_text('#b2'))[:50])
        await pg.screenshot(path="rep1.png")
        await pg.click("#rpMore"); await pg.wait_for_selector("#payWrap.on",timeout=30000); await pg.wait_for_timeout(900)
        await pg.screenshot(path="rep2.png")
        await pg.click("#payGo"); print('errors',errs)
        await b.close()
asyncio.run(main()); srv.terminate()
