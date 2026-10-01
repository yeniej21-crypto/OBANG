import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8772','-d','ptest'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8772/index.html")
        await pg.wait_for_selector("#enter:not([disabled])",timeout=20000)
        await pg.click("#goHome"); await pg.wait_for_selector("#home.on")
        await pg.click("#cPartner"); await pg.wait_for_timeout(1500); await pg.screenshot(path="b1.png")
        await pg.click("#backBtn"); await pg.wait_for_selector("#home.on"); print('back from partner video ok')
        await pg.click("#cPartner"); await pg.wait_for_selector("#pPartner.on",timeout=20000); await pg.click("#backBtn"); await pg.wait_for_selector("#home.on"); print('back from partner panel ok', await pg.evaluate("document.getElementById('pPartner').className"))
        await pg.click("#tBal"); await pg.wait_for_selector("#ovGauge.on"); await pg.click("#backBtn"); await pg.wait_for_selector("#home.on"); print('back from gauge ok', await pg.evaluate("[...document.querySelectorAll('.ov.on')].length"))
        await pg.evaluate("document.querySelector('[data-kv=halmae]').scrollIntoView()"); await pg.click("[data-kv=halmae]"); await pg.wait_for_timeout(1200); await pg.click("#backBtn"); await pg.wait_for_selector("#home.on"); await pg.wait_for_timeout(6000)
        print('after halmae back: kv open?', await pg.evaluate("document.getElementById('ovKv').classList.contains('on')"), 'home on', await pg.evaluate("document.getElementById('home').classList.contains('on')"))
        await pg.click("#hMis"); await pg.wait_for_selector("#pMission.on",timeout=20000); await pg.click("#backBtn"); await pg.wait_for_selector("#home.on"); print('back from mission ok')
        print('errors',errs); await b.close()
asyncio.run(main()); srv.terminate()
