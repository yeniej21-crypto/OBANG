import asyncio, subprocess, time
from PIL import Image
srv=subprocess.Popen(['python3','-m','http.server','8814','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8814/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        await pg.goto(U+'bujeok.html'); await pg.wait_for_timeout(1800); await pg.mouse.move(300,300,steps=5); await pg.wait_for_timeout(600); await pg.screenshot(path='audit_sh/bj_0.png')
        await pg.evaluate("document.querySelector('.scr').scrollTop=620"); await pg.wait_for_timeout(500); await pg.screenshot(path='audit_sh/bj_1.png')
        await pg.evaluate("document.querySelector('.scr').scrollTop=1400"); await pg.wait_for_timeout(500); await pg.screenshot(path='audit_sh/bj_2.png')
        await pg.click('#save'); await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/bj_3.png'); await pg.click('#shX')
        await pg.click('#wall'); await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/bj_4.png')
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
ims=[Image.open(f'audit_sh/bj_{i}.png').convert('RGB').resize((312,675)) for i in range(5)]
S=Image.new('RGB',(317*5,675),(40,40,40))
for i,im in enumerate(ims): S.paste(im,(i*317,0))
S.save('bj.png')
