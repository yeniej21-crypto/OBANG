import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8777','-d','ptest'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8777/tarot.html"); await pg.wait_for_timeout(1000)
        await pg.evaluate("document.querySelectorAll('.mi').forEach(x=>x.remove())")
        await pg.click('#go1'); await pg.wait_for_timeout(800)
        bb=await (await pg.query_selector('#deckArea')).bounding_box()
        await pg.mouse.move(bb['x']+bb['width']/2, bb['y']+bb['height']*.58); await pg.mouse.down(); await pg.wait_for_timeout(2600); await pg.mouse.up(); await pg.wait_for_timeout(1800)
        cs=await pg.query_selector_all('.cd.pick')
        for k in [3,10,17]:
            r=await cs[k].bounding_box(); x=r['x']+r['width']/2; y=r['y']+r['height']/2
            await pg.mouse.move(x,y); await pg.mouse.down(); await pg.mouse.up(); await pg.wait_for_timeout(500)
        await pg.wait_for_timeout(1800)
        el=(await pg.query_selector_all('#row .fc'))[0]; await el.click(); await pg.wait_for_timeout(2000)
        await pg.mouse.move(40,300,steps=5); await pg.wait_for_timeout(900); await pg.screenshot(path='opv3/ho_a.png')
        await pg.mouse.move(360,500,steps=5); await pg.wait_for_timeout(900); await pg.screenshot(path='opv3/ho_b.png')
        print('errs',errs); await b.close()
asyncio.run(main()); srv.terminate()
