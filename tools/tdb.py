import asyncio, subprocess, time, base64
from PIL import Image
srv=subprocess.Popen(['python3','-m','http.server','8816','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8816/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'today.html'); await pg.evaluate(ME); await pg.evaluate("localStorage.removeItem('obStamp')")
        await pg.goto(U+'dangbeon.html'); await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/db_0.png')
        await pg.click('#go'); await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/db_1.png')
        for i in range(5):
            await pg.click('#next'); await pg.wait_for_timeout(300); await pg.click('#go'); await pg.wait_for_timeout(900)
        await pg.evaluate("document.querySelector('.scr').scrollTop=0"); await pg.wait_for_timeout(400); await pg.screenshot(path='audit_sh/db_2.png')
        await pg.evaluate("document.querySelector('.scr').scrollTop=99999"); await pg.wait_for_timeout(400); await pg.screenshot(path='audit_sh/db_3.png')
        u=await pg.evaluate("stickerPng()"); open('audit_sh/db_png.png','wb').write(base64.b64decode(u.split(',')[1]))
        print(await pg.evaluate("JSON.stringify(ST)"))
        await pg.goto(U+'_home.html' if False else U+'seoha-salon.html'); await pg.wait_for_timeout(2500)
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
ims=[Image.open(f'audit_sh/db_{i}.png').convert('RGB').resize((312,675)) for i in range(4)]+[Image.open('audit_sh/db_png.png').convert('RGB').resize((540,675))]
S=Image.new('RGB',(317*4+545,675),(40,40,40))
for i,im in enumerate(ims): S.paste(im,(i*317,0))
S.save('db.png')
