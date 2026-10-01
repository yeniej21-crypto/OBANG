import asyncio, subprocess, time
from PIL import Image
srv=subprocess.Popen(['python3','-m','http.server','8812','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8812/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'today.html'); await pg.evaluate(ME); await pg.evaluate("localStorage.removeItem('obCookie')")
        await pg.goto(U+'myodang.html'); await pg.wait_for_timeout(1200); await pg.screenshot(path='audit_sh/my_0.png')
        await pg.evaluate("document.getElementById('sLobby').scrollTop=500"); await pg.wait_for_timeout(300); await pg.screenshot(path='audit_sh/my_1.png')
        steps={'madam':"document.getElementById('go').click()",
               'water':"document.getElementById('dT').value='큰 뱀이 집에 들어오고 이빨이 빠졌어'; document.getElementById('go').click()",
               'fire':"document.getElementById('hN').value='지훈'; document.getElementById('go').click()",
               'earth':"document.getElementById('go').click()",
               'metal':"document.getElementById('qT').value='먼저 연락할까'; document.getElementById('go').click()",
               'wood':"for(let i=0;i<3;i++) document.getElementById('ck').click()"}
        i=2
        for k,js in steps.items():
            await pg.evaluate(f"open('{k}')"); await pg.wait_for_timeout(700)
            await pg.evaluate(js); await pg.wait_for_timeout(1800)
            await pg.screenshot(path=f'audit_sh/my_{i}.png'); i+=1
            await pg.evaluate("lobby()")
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
ims=[Image.open(f'audit_sh/my_{i}.png').convert('RGB').resize((260,563)) for i in range(8)]
S=Image.new('RGB',(265*4,568*2),(40,40,40))
for i,im in enumerate(ims): S.paste(im,((i%4)*265,(i//4)*568))
S.save('my.png')
