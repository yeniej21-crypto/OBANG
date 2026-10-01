import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8790','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8790/seoha-salon.html"); await pg.wait_for_timeout(1000)
        await pg.evaluate("sessionStorage.setItem('toHome','1')"); await pg.goto("http://localhost:8790/seoha-salon.html"); await pg.wait_for_timeout(2500)
        await pg.evaluate("document.getElementById('cTarot').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(1500)
        await pg.mouse.move(30,400,steps=5); await pg.wait_for_timeout(1200); await pg.screenshot(path='opv3/h3_a.png')
        await pg.mouse.move(370,400,steps=5); await pg.wait_for_timeout(1200); await pg.screenshot(path='opv3/h3_b.png')
        print('home canvas',await pg.evaluate("document.querySelectorAll('canvas.d3c').length"),errs)
        await pg.goto("http://localhost:8790/today.html"); await pg.wait_for_timeout(1500); await pg.evaluate("document.querySelectorAll('.mi').forEach(x=>x.remove())"); await pg.wait_for_timeout(800)
        await pg.screenshot(path='opv3/h3_c.png'); print('today canvas',await pg.evaluate("document.querySelectorAll('canvas.d3c').length"),errs)
        await b.close()
asyncio.run(main()); srv.terminate()
