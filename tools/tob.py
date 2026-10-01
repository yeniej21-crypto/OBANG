import asyncio, subprocess, time
PRE='<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
open('proto/_home.html','w',encoding='utf-8').write(PRE+open('proto/seoha-salon.html',encoding='utf-8').read())
srv=subprocess.Popen(['python3','-m','http.server','8804','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8804/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append((pg.url[-25:],str(e))))
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        await pg.evaluate("sessionStorage.setItem('toHome','1')"); await pg.goto(U+'_home.html'); await pg.wait_for_timeout(2600)
        await pg.screenshot(path='audit_sh/h2_0.png')
        await pg.evaluate("document.getElementById('home').scrollTop=330"); await pg.wait_for_timeout(600); await pg.screenshot(path='audit_sh/h2_1.png')
        await pg.goto(U+'obgh.html'); await pg.wait_for_timeout(1200); await pg.screenshot(path='audit_sh/ob_in.png')
        await pg.click('#meQ'); await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/ob_ld.png'); await pg.wait_for_timeout(2600)
        await pg.screenshot(path='audit_sh/ob_0.png')
        for i,y in enumerate([560,1150,1700]):
            await pg.evaluate(f"document.getElementById('sOut').scrollTop={y}"); await pg.wait_for_timeout(900); await pg.screenshot(path=f'audit_sh/ob_{i+1}.png')
        print(await pg.evaluate("[...document.querySelectorAll('.ri')].map(r=>r.innerText.replace(/\\n/g,' '))"))
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
from PIL import Image
fs=['h2_0','h2_1','ob_in','ob_ld','ob_0','ob_1','ob_2','ob_3']
ims=[Image.open(f'audit_sh/{f}.png').convert('RGB').resize((240,520)) for f in fs]
S=Image.new('RGB',(246*8,520),'white')
for i,im in enumerate(ims): S.paste(im,(i*246,0))
S.save('au_ob.png')
