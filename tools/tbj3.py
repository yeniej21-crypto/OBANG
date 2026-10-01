import asyncio, subprocess, time
from PIL import Image
srv=subprocess.Popen(['python3','-m','http.server','8816','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":390,"height":844})
        await pg.goto('http://localhost:8816/bujeok.html'); await pg.wait_for_timeout(1000)
        for i,k in enumerate(['money','love','pass','health','guard']):
            await pg.click(f'#uses [data-k={k}]'); await pg.wait_for_timeout(900)
            await pg.evaluate("document.querySelector('.scr').scrollTop=0"); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f'audit_sh/ch_{i}.png',clip={'x':0,'y':120,'width':390,'height':330})
        await b.close()
asyncio.run(main()); srv.terminate()
ims=[Image.open(f'audit_sh/ch_{i}.png').convert('RGB') for i in range(5)]
S=Image.new('RGB',(395*5,330),'white')
for i,im in enumerate(ims): S.paste(im,(i*395,0))
S.save('ch.png')
