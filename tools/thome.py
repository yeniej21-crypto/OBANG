import asyncio, subprocess, time, sys
TAG=sys.argv[1]
PRE='<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
open('proto/_home.html','w',encoding='utf-8').write(PRE+open('proto/seoha-salon.html',encoding='utf-8').read())
srv=subprocess.Popen(['python3','-m','http.server','8805','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8805/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
N=0
async def main():
    global N
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        await pg.evaluate("sessionStorage.setItem('toHome','1')"); await pg.goto(U+'_home.html'); await pg.wait_for_timeout(2600)
        H=await pg.evaluate("document.getElementById('home').scrollHeight"); print('H',H)
        y=0; i=0
        while y<H and i<14:
            await pg.evaluate(f"document.getElementById('home').scrollTop={y}"); await pg.wait_for_timeout(600); await pg.screenshot(path=f'audit_sh/{TAG}_{i}.png'); y+=780; i+=1
        N=i; print(errs); await b.close()
asyncio.run(main()); srv.terminate()
from PIL import Image
ims=[Image.open(f'audit_sh/{TAG}_{i}.png').convert('RGB').resize((234,506)) for i in range(N)]
S=Image.new('RGB',(240*7,512*((N+6)//7)),(40,40,40))
for i,im in enumerate(ims): S.paste(im,((i%7)*240,(i//7)*512))
S.save(f'home_{TAG}.png')
