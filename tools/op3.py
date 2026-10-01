import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8773','-d','ptest'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--autoplay-policy=document-user-activation-required"])
        pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e))); pg.on("console",lambda m: m.type=="error" and errs.append(m.text))
        await pg.goto("http://localhost:8773/index.html"); await pg.wait_for_timeout(2600); await pg.screenshot(path="opv3/g0.png")
        await pg.mouse.click(195,600)
        for t,n in [(300,'t1'),(900,'t2'),(1300,'t3'),(1000,'t4'),(1350,'t5'),(2700,'t6'),(1600,'t7'),(2500,'t8')]:
            await pg.wait_for_timeout(t); await pg.screenshot(path=f"opv3/{n}.png")
        print(await pg.evaluate("document.getElementById('op').className"))
        await pg.select_option('#opYr','1992'); await pg.wait_for_timeout(700); await pg.screenshot(path="opv3/t9.png")
        await pg.click('#opHome'); await pg.wait_for_selector('#home.on'); await pg.wait_for_timeout(800)
        await pg.evaluate("document.getElementById('cCareer').scrollIntoView()"); await pg.click('#cCareer'); await pg.wait_for_timeout(1500); await pg.screenshot(path="opv3/mi1.png")
        print('mi present', await pg.evaluate("!!document.querySelector('.mi')"), 'gate', await pg.evaluate("document.querySelector('.mi .gate')?.className"))
        await pg.wait_for_timeout(8000); print('url', pg.url, 'skipMI', await pg.evaluate("sessionStorage.getItem('skipMI')"), 'mi on page', await pg.evaluate("!!document.querySelector('.mi')"))
        # direct open without gesture -> gate
        pg2=await (await b.new_context(viewport={"width":390,"height":844})).new_page()
        await pg2.goto("http://localhost:8773/career_t.html"); await pg2.wait_for_timeout(1500); await pg2.screenshot(path="opv3/mi2.png")
        print('direct gate', await pg2.evaluate("document.querySelector('.mi .gate')?.className"))
        print('errors',errs); await b.close()
asyncio.run(main()); srv.terminate()
