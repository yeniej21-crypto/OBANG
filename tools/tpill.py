import asyncio, subprocess, time
from PIL import Image
PRE='<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
open('proto/_home.html','w',encoding='utf-8').write(PRE+open('proto/seoha-salon.html',encoding='utf-8').read())
srv=subprocess.Popen(['python3','-m','http.server','8817','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8817/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'today.html'); await pg.evaluate(ME+";sessionStorage.setItem('toHome','1')")
        await pg.goto(U+'_home.html'); await pg.wait_for_timeout(2500); await pg.screenshot(path='audit_sh/pl_0.png')
        for i,c in enumerate(['jt','match','job','tg','gaeun']):
            await pg.click(f'#pills [data-c={c}]'); await pg.wait_for_timeout(1400); await pg.screenshot(path=f'audit_sh/pl_{i+1}.png')
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
ims=[Image.open(f'audit_sh/pl_{i}.png').convert('RGB').resize((260,563)) for i in range(6)]
S=Image.new('RGB',(265*6,563),(40,40,40))
for i,im in enumerate(ims): S.paste(im,(i*265,0))
S.save('pl.png')
