import asyncio, subprocess, time
from PIL import Image
srv=subprocess.Popen(['python3','-m','http.server','8813','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8813/'
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U+'ppopgi.html'); await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/pp_0.png')
        await pg.click('#topics [data-k=love]'); await pg.click('#go'); await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/pp_1.png')
        await pg.wait_for_timeout(1800); await pg.screenshot(path='audit_sh/pp_2.png')
        await pg.evaluate("document.getElementById('sRs').scrollTop=600"); await pg.wait_for_timeout(400); await pg.screenshot(path='audit_sh/pp_3.png')
        await pg.click('#save'); await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/pp_4.png')
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
ims=[Image.open(f'audit_sh/pp_{i}.png').convert('RGB').resize((312,675)) for i in range(5)]
S=Image.new('RGB',(317*5,675),(40,40,40))
for i,im in enumerate(ims): S.paste(im,(i*317,0))
S.save('pp.png')
