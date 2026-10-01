import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8770','-d','ptest'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8770/index.html")
        await pg.wait_for_selector("#goHome",timeout=20000); await pg.wait_for_selector("#enter:not([disabled])",timeout=20000)
        await pg.click("#goHome"); await pg.wait_for_selector("#home.on"); await pg.wait_for_timeout(700); await pg.screenshot(path="h1.png")
        await pg.evaluate("document.getElementById('home').scrollTop=520"); await pg.wait_for_timeout(400); await pg.screenshot(path="h2.png")
        await pg.evaluate("document.getElementById('home').scrollTop=2000"); await pg.wait_for_timeout(400); await pg.screenshot(path="h3.png")
        await pg.click(".kv[data-kv=house]"); await pg.wait_for_selector("#ovKv.on"); await pg.wait_for_timeout(600); await pg.screenshot(path="h4.png")
        await pg.click("#kvClose"); await pg.wait_for_timeout(400)
        await pg.evaluate("document.getElementById('home').scrollTop=0")
        await pg.click(".mem[data-el=fire]"); await pg.wait_for_selector("#home.on",timeout=30000); print('member view returned home')
        await pg.click("#cPartner"); await pg.wait_for_selector("#pPartner.on",timeout=30000); print('partner from home ok')
        print('errors',errs); await b.close()
asyncio.run(main()); srv.terminate()
