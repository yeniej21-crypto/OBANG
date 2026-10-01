import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8794','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8794/today.html"); await pg.evaluate("sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))")
        for f,js in [('sinnyeon',"[nm.value,by.value,bm.value,bd.value,bh.value,document.querySelector('#gSeg .on').dataset.v]"),('taegil',"[by.value,bm.value,bd.value,bh.value]"),('gunghap',"[...document.querySelectorAll('#wA input,#wA select')].map(e=>e.value)")]:
            await pg.goto(f"http://localhost:8794/{f}.html"); await pg.wait_for_timeout(800)
            print(f, await pg.evaluate(js))
        # 택일에서 바꾸고 저장되는지
        await pg.goto("http://localhost:8794/taegil.html"); await pg.wait_for_timeout(500); await pg.select_option('#bd','5'); await pg.evaluate("document.querySelectorAll('.mi').forEach(x=>x.remove())"); await pg.click('#goBtn'); await pg.wait_for_timeout(500)
        print('saved', await pg.evaluate("sessionStorage.getItem('me')"))
        await pg.goto("http://localhost:8794/dohwa.html"); await pg.wait_for_timeout(1000)
        print('errs',errs); await b.close()
asyncio.run(main()); srv.terminate()
