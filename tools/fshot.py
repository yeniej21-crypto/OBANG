import asyncio, subprocess, time, sys
from PIL import Image
srv=subprocess.Popen(['python3','-m','http.server','8811','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8811/'; TAG=sys.argv[1] if len(sys.argv)>1 else 'a'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":412,"height":800},device_scale_factor=1); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        await pg.goto(U+'free.html'); await pg.wait_for_timeout(1500); await pg.evaluate("document.querySelectorAll('.mi').forEach(x=>x.remove())"); await pg.screenshot(path=f'fsh/{TAG}_hub.png')
        for t in ['tti','past','bok']:
            await pg.goto(U+'free.html?t='+t); await pg.wait_for_timeout(1300); await pg.evaluate("document.querySelectorAll('.mi').forEach(x=>x.remove())")
            await pg.screenshot(path=f'fsh/{TAG}_{t}_in.png')
            if t=='tti':
                await pg.evaluate("(()=>{const s=document.querySelectorAll('#sIn select'); })()")
            try: await pg.click('.meQ',timeout=2000)
            except Exception as e:
                try: await pg.click('#go',timeout=2000)
                except: pass
            await pg.wait_for_timeout(4500)
            for i,y in enumerate([0,300,900,1500]):
                await pg.evaluate(f"document.getElementById('sRs').scrollTop={y}"); await pg.wait_for_timeout(400); await pg.screenshot(path=f'fsh/{TAG}_{t}_{i}.png')
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
import glob
fs=sorted(glob.glob(f'fsh/{TAG}_*.png'))
ims=[Image.open(f).convert('RGB').resize((206,400)) for f in fs]
S=Image.new('RGB',(212*8,406*((len(ims)+7)//8)),'white')
for i,im in enumerate(ims): S.paste(im,((i%8)*212,(i//8)*406))
S.save(f'fsh_{TAG}.png'); print(fs)
