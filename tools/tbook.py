import asyncio, subprocess, time
from PIL import Image
srv=subprocess.Popen(['python3','-m','http.server','8814','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8814/'
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'book.html'); await pg.wait_for_timeout(1500)
        n=await pg.evaluate("N")
        for i in range(n):
            if i: await pg.evaluate("go(cur+1,false)")
            await pg.wait_for_timeout(2200 if i else 2200)
            await pg.screenshot(path=f'audit_sh/bk_{i}.png')
        await pg.evaluate("go(3,false)"); await pg.wait_for_timeout(400); await pg.evaluate("document.querySelectorAll('.leaf')[3].style.transform='rotateY(-70deg)';document.querySelectorAll('.leaf')[3].classList.add('drag','moving')"); await pg.wait_for_timeout(200); await pg.screenshot(path='audit_sh/bk_turn.png')
        print(n,errs); await b.close()
    return n
n=asyncio.run(main()); srv.terminate()
ims=[Image.open(f'audit_sh/bk_{i}.png').convert('RGB').resize((234,506)) for i in range(n)]+[Image.open('audit_sh/bk_turn.png').convert('RGB').resize((234,506))]
S=Image.new('RGB',(238*8,510*2),(40,40,40))
for i,im in enumerate(ims): S.paste(im,((i%8)*238,(i//8)*510))
S.save('bk.png')
