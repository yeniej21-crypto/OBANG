import asyncio, subprocess, time
PRE='<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
open('proto/_home.html','w',encoding='utf-8').write(PRE+open('proto/seoha-salon.html',encoding='utf-8').read())
srv=subprocess.Popen(['python3','-m','http.server','8815','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8815/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
ST='''localStorage.setItem('obStamp',JSON.stringify({days:{"2026-09-28":{el:"metal",ex:"joy"},"2026-09-29":{el:"water",ex:"cheer"},"2026-09-30":{el:"water",ex:"pout"}},dex:{metal_joy:1,water_cheer:1,water_pout:1},off:0}))'''
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'today.html'); await pg.evaluate(ME); await pg.evaluate(ST)
        await pg.evaluate("sessionStorage.setItem('toHome','1')"); await pg.goto(U+'_home.html'); await pg.wait_for_timeout(2600)
        await pg.evaluate("const e=document.getElementById('secBook'); document.getElementById('home').scrollTop=e.offsetTop-250"); await pg.wait_for_timeout(900)
        await pg.screenshot(path='cath.png'); await pg.evaluate("document.getElementById('home').scrollTop=0"); await pg.wait_for_timeout(600); await pg.screenshot(path='cath0.png'); print(errs); await b.close()
asyncio.run(main()); srv.terminate()
from PIL import Image
a=Image.open('cath.png'); c=Image.open('cath0.png'); S=Image.new('RGB',(790,844),(255,255,255)); S.paste(c,(0,0)); S.paste(a,(400,0)); S.save('cath_cmp.png')
