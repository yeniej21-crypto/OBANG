import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8800','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8800/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844})
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        for f in ['sinnyeon','lifetime','career','taegil','gunghap']:
            await pg.goto(U+f+'.html'); await pg.wait_for_timeout(1300)
            await pg.evaluate("document.querySelectorAll('button').forEach(b=>{ if(/건너뛰기/.test(b.textContent)) b.click(); })"); await pg.wait_for_timeout(600)
            await pg.click('#goBtn')
            for i,t in enumerate([300,1200,5000]):
                await pg.wait_for_timeout(t if i==0 else t-[300,1200,5000][i-1]); await pg.screenshot(path=f'audit_sh/ld_{f}_{i}.png')
        await b.close()
asyncio.run(main()); srv.terminate()
from PIL import Image
fs=[f'ld_{f}_{i}' for f in ['sinnyeon','lifetime','career','taegil','gunghap'] for i in range(3)]
ims=[Image.open(f'audit_sh/{f}.png').convert('RGB').resize((220,477)) for f in fs]
S=Image.new('RGB',(226*6,483*3),'white')
for i,im in enumerate(ims): S.paste(im,((i%6)*226,(i//6)*483))
S.save('au_load.png')
