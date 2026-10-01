import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8777','-d','ptest'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto("http://localhost:8777/tarot.html"); await pg.wait_for_timeout(1200)
        await pg.evaluate("document.querySelectorAll('.mi').forEach(x=>x.remove())")
        for i,(x,y) in enumerate([(20,300),(370,300),(195,100)]):
            await pg.mouse.move(x,y,steps=4); await pg.wait_for_timeout(1500); await pg.screenshot(path=f'opv3/d3_{i}.png',clip={'x':0,'y':0,'width':390,'height':480})
        print('canvas',await pg.evaluate("document.querySelectorAll('canvas.d3c').length"),'errs',errs)
        await b.close()
asyncio.run(main()); srv.terminate()
