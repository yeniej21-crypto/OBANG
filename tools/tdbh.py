import asyncio, subprocess, time
PRE='<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
open('proto/_home.html','w',encoding='utf-8').write(PRE+open('proto/seoha-salon.html',encoding='utf-8').read())
srv=subprocess.Popen(['python3','-m','http.server','8806','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8806/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        await pg.evaluate("sessionStorage.setItem('toHome','1')"); await pg.goto(U+'_home.html'); await pg.wait_for_timeout(2600)
        await pg.evaluate("const e=document.getElementById('ppgGo'); document.getElementById('home').scrollTop=e.offsetTop-300"); await pg.wait_for_timeout(700)
        await pg.evaluate("document.getElementById('ppgGo').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(700)
        await pg.screenshot(path='dbh.png'); print(errs); await b.close()
asyncio.run(main()); srv.terminate()
