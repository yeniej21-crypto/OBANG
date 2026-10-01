import asyncio, subprocess, time, sys
from PIL import Image
srv=subprocess.Popen(['python3','-m','http.server','8812','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8812/'; TAG=sys.argv[1]
PAGES=['today','career','gunghap','dohwa','sinnyeon','lifetime','taegil','obgh','chat','avatar','peach','tarot']
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":760}); errs=[]
        pg.on("pageerror",lambda e: errs.append(pg.url+' '+str(e)))
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        for f in PAGES:
            await pg.goto(U+f+'.html#re'); await pg.wait_for_timeout(1800); await pg.evaluate("document.querySelectorAll('.mi').forEach(x=>x.remove())")
            await pg.screenshot(path=f'fsh/{TAG}s_{f}_0.png')
            await pg.evaluate("(()=>{const c=[...document.querySelectorAll('.scr.on,.scr.on .scroll,.scroll,.scr,body *')].filter(x=>x.scrollHeight>x.clientHeight+50&&getComputedStyle(x).overflowY!='visible'&&x.offsetParent!==null);if(c[0])c[0].scrollTop=650;})()")
            await pg.wait_for_timeout(600); await pg.screenshot(path=f'fsh/{TAG}s_{f}_1.png')
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
ims=[Image.open(f'fsh/{TAG}s_{f}_{i}.png').convert('RGB').resize((195,380)) for f in PAGES for i in (0,1)]
S=Image.new('RGB',(200*8,385*((len(ims)+7)//8)),(40,40,40))
for i,im in enumerate(ims): S.paste(im,((i%8)*200,(i//8)*385))
S.save(f'sub_{TAG}.png')
