import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8781','-d','dtest_t/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]; bad=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        pg.on("response",lambda r: bad.append((r.status,r.url)) if r.status>=400 else None)
        await pg.goto("http://localhost:8781/index.html?skip=1"); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelectorAll('.mi').forEach(x=>x.remove())")
        await pg.evaluate("document.getElementById('cTarot').scrollIntoView()"); await pg.wait_for_timeout(500)
        await pg.screenshot(path='opv3/d_home.png')
        await pg.evaluate("document.getElementById('cTarot').click()"); await pg.wait_for_timeout(1500)
        await pg.screenshot(path='opv3/d_intro.png')
        await pg.wait_for_url("**/tarot/index.html",timeout=15000); await pg.wait_for_timeout(1500)
        mi=await pg.evaluate("document.querySelectorAll('.mi').length")
        await pg.screenshot(path='opv3/d_tarot.png')
        print('url',pg.url,'intro-again',mi,'errors',errs,'bad',bad)
        await b.close()
asyncio.run(main()); srv.terminate()
