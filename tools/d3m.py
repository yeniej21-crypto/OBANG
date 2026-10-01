import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8793','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8793/chat.html"); await pg.wait_for_timeout(2500); await pg.evaluate("document.querySelector('.scr').scrollTop=300"); await pg.wait_for_timeout(1500)
        await pg.screenshot(path='opv3/m_chat.png'); c1=await pg.evaluate("document.querySelectorAll('canvas.d3c').length")
        await pg.evaluate("sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))")
        await pg.goto("http://localhost:8793/today.html"); await pg.wait_for_timeout(1500); await pg.evaluate("document.querySelectorAll('.mi').forEach(x=>x.remove())")
        await pg.evaluate("document.getElementById('flip').scrollIntoView({block:'center'}); document.getElementById('flip').click()"); await pg.wait_for_timeout(2000)
        await pg.screenshot(path='opv3/m_today.png'); c2=await pg.evaluate("document.querySelectorAll('canvas.d3c').length")
        print('chat',c1,'today',c2,'errs',errs); await b.close()
asyncio.run(main()); srv.terminate()
