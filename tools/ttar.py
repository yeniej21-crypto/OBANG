import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8806','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8806/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        await pg.goto(U+'tarot.html#re'); await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/tr_0.png')
        await pg.evaluate("document.getElementById('s1').scrollTop=500"); await pg.wait_for_timeout(400); await pg.screenshot(path='audit_sh/tr_1.png')
        await pg.fill('#qin','그 사람이랑 잘 될까?'); await pg.dispatch_event('#qin','input'); await pg.click('#go1'); await pg.wait_for_timeout(2500); await pg.screenshot(path='audit_sh/tr_2.png')
        box=await pg.query_selector('#deckArea'); bb=await box.bounding_box()
        await pg.mouse.move(bb['x']+bb['width']/2,bb['y']+bb['height']/2); await pg.mouse.down()
        for i in range(30):
            await pg.mouse.move(bb['x']+bb['width']/2+((i%2)*40-20),bb['y']+bb['height']/2); await pg.wait_for_timeout(90)
            if i==10: await pg.screenshot(path='audit_sh/tr_2b.png')
        await pg.mouse.up(); await pg.wait_for_timeout(2500); await pg.screenshot(path='audit_sh/tr_3.png')
        for k,fx in enumerate([.3,.5,.7]):
            x=bb['x']+bb['width']*fx; y=bb['y']+bb['height']*.6
            await pg.mouse.move(x,y); await pg.mouse.down(); await pg.wait_for_timeout(150); await pg.mouse.up(); await pg.wait_for_timeout(900)
        await pg.screenshot(path='audit_sh/tr_4.png'); await pg.wait_for_timeout(3000); await pg.screenshot(path='audit_sh/tr_5.png')
        # 공개 단계 진행
        for i in range(14):
            cs=await pg.query_selector_all('#row > *')
            for c in cs:
                try: await c.click(timeout=800)
                except: pass
                await pg.wait_for_timeout(1300)
                await pg.wait_for_timeout(600); await pg.screenshot(path='audit_sh/tr_sp.png')
                for _ in range(3):
                    await pg.mouse.click(195,780); await pg.wait_for_timeout(1200)
            if i==0: await pg.screenshot(path='audit_sh/tr_6.png')
            await pg.evaluate("document.querySelectorAll('#rx button, #zoom button').forEach(b=>{ if(b.offsetParent) b.click(); })")
            await pg.wait_for_timeout(1500)
            if await pg.evaluate("document.getElementById('s4').classList.contains('on')"): break
        await pg.evaluate("document.querySelectorAll('button').forEach(b=>{ if(/닫기|건너뛰기/.test(b.textContent)&&b.offsetParent) b.click(); })")
        await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/tr_7.png')
        for i,y in enumerate([700,1400,2100]):
            await pg.evaluate(f"document.getElementById('s4s')&&(document.getElementById('s4s').scrollTop={y})"); await pg.wait_for_timeout(500); await pg.screenshot(path=f'audit_sh/tr_{8+i}.png')
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
from PIL import Image
ims=[Image.open(f'audit_sh/tr_{i}.png').convert('RGB').resize((240,520)) for i in ['2b','sp',7,8,9]]
S=Image.new('RGB',(246*6,526*2),'white')
for i,im in enumerate(ims): S.paste(im,((i%6)*246,(i//6)*526))
S.save('au_tarot.png')
