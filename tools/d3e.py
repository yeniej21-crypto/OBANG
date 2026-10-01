import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8777','-d','ptest'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8777/tarot.html")
        for i,t in enumerate([450,900,1600,3200]):
            await pg.wait_for_timeout(t if i==0 else t-[450,900,1600,3200][i-1]); await pg.screenshot(path=f'opv3/en_{i}.png',clip={'x':0,'y':0,'width':390,'height':440})
        await pg.evaluate("document.getElementById('s1').scrollTop=250"); await pg.wait_for_timeout(900); await pg.screenshot(path='opv3/en_4.png',clip={'x':0,'y':0,'width':390,'height':440})
        print('errs',errs); await b.close()
asyncio.run(main()); srv.terminate()
