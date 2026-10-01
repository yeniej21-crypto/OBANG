import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8807','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto('http://localhost:8807/tarot.html#re'); await pg.wait_for_timeout(1200)
        await pg.fill('#qin','그 사람이랑 잘 될까?'); await pg.dispatch_event('#qin','input'); print(await pg.evaluate("document.querySelector('.chip.on').textContent"))
        await pg.click('#go1'); await pg.wait_for_timeout(2300)
        bb=await (await pg.query_selector('#deckArea')).bounding_box(); await pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']*.6); await pg.mouse.down(); await pg.wait_for_timeout(700); await pg.screenshot(path='audit_sh/tt_sh.png'); await pg.wait_for_timeout(2000); await pg.mouse.up(); await pg.wait_for_timeout(1500)
        await pg.screenshot(path='audit_sh/tt_fan.png'); print(errs); await b.close()
asyncio.run(main()); srv.terminate()
