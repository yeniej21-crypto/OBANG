import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8769','-d','ptest'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8769/index.html")
        await pg.wait_for_selector("#enter:not([disabled])",timeout=20000)
        await pg.click("#skipStory"); await pg.wait_for_selector("#pBirth.on",timeout=40000)
        await pg.click("#birthGo"); await pg.wait_for_selector("#pWorry.on",timeout=60000)
        await pg.click("#worrySkip"); await pg.wait_for_selector("#result.on",timeout=90000)
        await pg.wait_for_timeout(600); await pg.screenshot(path="m0.png",full_page=False)
        await pg.evaluate("document.getElementById('ctaPush').scrollIntoView()"); await pg.click("#ctaPush")
        await pg.wait_for_selector("#ovPre.on"); await pg.wait_for_timeout(500); await pg.screenshot(path="m1.png")
        await pg.click("#preYes"); await pg.wait_for_selector("#ovSys.on"); await pg.wait_for_timeout(500); await pg.screenshot(path="m2.png")
        await pg.click("#sysYes"); await pg.wait_for_selector("#noti.on",timeout=10000); await pg.wait_for_timeout(600); await pg.screenshot(path="m3.png")
        await pg.click("#noti"); await pg.wait_for_timeout(9000); print(await pg.evaluate("[...document.querySelectorAll('video')].map(v=>[v._key,v.paused,v.ended,+v.currentTime.toFixed(2),+(v.duration||0).toFixed(2),v.className,v.readyState,v._ready,v._err])")); print(await pg.evaluate("[document.getElementById('pMission').className, [...document.querySelectorAll('.ov.on')].map(e=>e.id), document.getElementById('who').textContent]")); print(errs); await pg.wait_for_selector("#pMission.on",timeout=3000); await pg.wait_for_timeout(500); await pg.screenshot(path="m4.png")
        await pg.click("#mDone"); await pg.wait_for_selector("#ovGauge.on"); await pg.wait_for_timeout(2600); await pg.screenshot(path="m5.png")
        await pg.evaluate("document.getElementById('ovGauge').scrollTop=600"); await pg.wait_for_timeout(300); await pg.screenshot(path="m6.png")
        await pg.click("#gSub"); await pg.wait_for_selector("#ovSub.on"); await pg.wait_for_timeout(600); await pg.screenshot(path="m7.png")
        print('errors',errs); await b.close()
asyncio.run(main()); srv.terminate()
