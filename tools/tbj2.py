import asyncio, subprocess, time
from PIL import Image
srv=subprocess.Popen(['python3','-m','http.server','8815','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":390,"height":844},device_scale_factor=2)
        await pg.goto('http://localhost:8815/bujeok.html'); await pg.wait_for_timeout(1200)
        for i,k in enumerate(['money','love','pass','health','guard']):
            await pg.click(f'#uses [data-k={k}]'); await pg.wait_for_timeout(900)
            el=await pg.query_selector('.label'); await el.screenshot(path=f'audit_sh/lb_{i}.png')
        await b.close()
asyncio.run(main()); srv.terminate()
ims=[Image.open(f'audit_sh/lb_{i}.png').convert('RGB') for i in range(5)]
w=max(i.size[0] for i in ims); S=Image.new('RGB',(w,sum(i.size[1]+8 for i in ims)),'white'); y=0
for im in ims: S.paste(im,(0,y)); y+=im.size[1]+8
S.save('lb.png')
