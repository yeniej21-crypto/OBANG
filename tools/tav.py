import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8818','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
WEBM=open('/tmp/rv_wood_test.webm','rb').read()
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--autoplay-policy=no-user-gesture-required']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.route("**/v/pop/rv_wood.mp4",lambda r: r.fulfill(status=200,body=WEBM,headers={'content-type':'video/webm'}))
        await pg.goto('http://localhost:8818/book.html'); await pg.wait_for_timeout(800)
        await pg.evaluate("go(9,false)"); 
        for i in range(3):
            await pg.wait_for_timeout(1300); await pg.screenshot(path=f'av_{i}.png')
        print(await pg.evaluate("[!!AV.vid, AV.vid&&AV.vid.readyState, document.querySelector('.leaf[data-i=\"9\"] canvas.fgv').className, document.querySelector('.leaf[data-i=\"9\"] img.fg').className]"))
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
from PIL import Image
ims=[Image.open(f'av_{i}.png').crop((0,0,390,520)) for i in range(3)]
S=Image.new('RGB',(1180,520)); [S.paste(im,(i*395,0)) for i,im in enumerate(ims)]; S.save('av_cmp.png')
