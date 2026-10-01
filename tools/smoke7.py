import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8771','-d','ptest'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        pg=await b.new_page(viewport={"width":390,"height":844},device_scale_factor=2); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8771/index.html")
        await pg.wait_for_selector("#enter:not([disabled])",timeout=20000)
        await pg.click("#goHome"); await pg.wait_for_selector("#home.on"); await pg.wait_for_timeout(900)
        for i,y in enumerate([0,700,1450,2250,3000,3800]):
            await pg.evaluate(f"document.getElementById('home').scrollTop={y}"); await pg.wait_for_timeout(350); await pg.screenshot(path=f"n{i}.png")
        await pg.click("#pills button[data-c=heart]"); await pg.wait_for_timeout(600); await pg.screenshot(path="n6.png")
        print('errors',errs); await b.close()
asyncio.run(main()); srv.terminate()
