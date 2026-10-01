import asyncio, subprocess, time, base64
from PIL import Image
srv=subprocess.Popen(['python3','-m','http.server','8815','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8815/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e))); pg.on("console",lambda m: m.type=='error' and errs.append(m.text))
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        await pg.goto(U+'bujeok.html'); await pg.wait_for_timeout(1800)
        print(await pg.evaluate("el+' '+JSON.stringify(lo)"))
        await pg.screenshot(path='audit_sh/b5_0.png')
        await pg.evaluate("document.querySelector('.scr').scrollTop=560"); await pg.wait_for_timeout(400); await pg.screenshot(path='audit_sh/b5_1.png')
        for i,k in enumerate(['wood','fire','earth','metal','water']):
            await pg.evaluate(f"document.querySelector('.els [data-k={k}]').click()"); await pg.wait_for_timeout(900)
            await pg.evaluate("document.querySelector('.scr').scrollTop=0"); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f'audit_sh/b5_e{i}.png')
            if k in ('fire','water'):
                u=await pg.evaluate("cardPng()"); open(f'audit_sh/b5_png_{k}.png','wb').write(base64.b64decode(u.split(',')[1]))
        await pg.evaluate("document.querySelector('.scr').scrollTop=99999"); await pg.wait_for_timeout(400); await pg.screenshot(path='audit_sh/b5_2.png')
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
ims=[Image.open(f'audit_sh/b5_{n}.png').convert('RGB').resize((312,675)) for n in ['0','1','2']]
S=Image.new('RGB',(317*3,675),(40,40,40))
for i,im in enumerate(ims): S.paste(im,(i*317,0))
S.save('b5a.png')
ims=[Image.open(f'audit_sh/b5_e{i}.png').convert('RGB').crop((0,0,390,620)).resize((260,413)) for i in range(5)]
S=Image.new('RGB',(265*5,413),(40,40,40))
for i,im in enumerate(ims): S.paste(im,(i*265,0))
S.save('b5b.png')
a=Image.open('audit_sh/b5_png_fire.png'); c=Image.open('audit_sh/b5_png_water.png')
S=Image.new('RGB',(a.width*2//3+c.width//3*0+ c.width*1//3*2, max(a.height,c.height)*2//3),(40,40,40))
S.paste(a.resize((a.width//3*2//2*1,a.height//3*2//2*1)),(0,0)); S.paste(c.resize((c.width//3,c.height//3)),(a.width//3+10,0)); S.save('b5c.png')
