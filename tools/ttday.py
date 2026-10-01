import asyncio, subprocess, time, sys
PRE='<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
for n,src in [('_h_old.html','bk/seoha-salon.pre-v67.html'),('_h_new.html','proto/seoha-salon.html')]:
    open('proto/'+n,'w',encoding='utf-8').write(PRE+open(src,encoding='utf-8').read())
srv=subprocess.Popen(['python3','-m','http.server','8810','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8810/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl'])
        for n in ['_h_old.html','_h_new.html']:
            pg=await b.new_page(viewport={"width":390,"height":844})
            await pg.goto(U+'today.html'); await pg.evaluate(ME)
            await pg.evaluate("sessionStorage.setItem('toHome','1')"); await pg.goto(U+n); await pg.wait_for_timeout(2600)
            r=await pg.evaluate("(()=>{const t=document.getElementById('tday'),b=t.getBoundingClientRect(),h=document.getElementById('tdH').getBoundingClientRect(),bt=t.querySelector('.bento').getBoundingClientRect();return [Math.round(b.top),Math.round(b.height),Math.round(h.height),Math.round(bt.height),Math.round(document.querySelector('.tday+.band,.band').getBoundingClientRect().top)]})()")
            print(n,r); await pg.screenshot(path=f'td{n}.png'); await pg.close()
        await b.close()
asyncio.run(main()); srv.terminate()
from PIL import Image
a=Image.open('td_h_old.html.png'); c=Image.open('td_h_new.html.png'); S=Image.new('RGB',(790,844),(255,255,255)); S.paste(a,(0,0)); S.paste(c,(400,0)); S.save('td_cmp.png')
