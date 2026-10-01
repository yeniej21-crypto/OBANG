import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8792','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8792/_t_home.html"); await pg.wait_for_timeout(2500)
        await pg.mouse.click(195,420); t0=time.time()
        for i,t in enumerate([0.6,2.2,4.5,7.0,8.4,10.5,16.5,19.5]):
            await pg.wait_for_timeout(max(0,int((t-(time.time()-t0))*1000))); await pg.screenshot(path=f'opv3/op_{i}.png')
        print('take err',await pg.evaluate("document.getElementById('opTake').error"),'rate',await pg.evaluate("document.getElementById('opTake').playbackRate"),'errs',errs)
        await b.close()
asyncio.run(main()); srv.terminate()
