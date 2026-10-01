import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8795','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8795/today.html"); await pg.evaluate("sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))")
        await pg.goto("http://localhost:8795/lifetime.html"); await pg.wait_for_timeout(1500); await pg.screenshot(path='opv3/lf_0.png')
        await pg.click('#goBtn'); await pg.wait_for_timeout(3600)
        for i,y in enumerate([0,650,1300,1950,2600]):
            await pg.evaluate(f"document.getElementById('sRep').scrollTop={y}"); await pg.wait_for_timeout(400); await pg.screenshot(path=f'opv3/lf_{i+1}.png')
        print('errs',errs); await b.close()
asyncio.run(main()); srv.terminate()
