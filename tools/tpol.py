import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8802','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8802/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append((pg.url[-20:],str(e))))
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        await pg.goto(U+'gunghap.html'); await pg.wait_for_timeout(1300)
        await pg.evaluate("document.querySelectorAll('button').forEach(b=>{ if(/건너뛰기/.test(b.textContent)) b.click(); })"); await pg.wait_for_timeout(500)
        await pg.fill('#wB [data-k=n]','지훈'); await pg.select_option('#wB [data-k=y]','1994'); await pg.select_option('#wB [data-k=m]','1'); await pg.select_option('#wB [data-k=d]','3')
        await pg.click('#goBtn'); await pg.wait_for_timeout(3200)
        for i,y in enumerate([0,500,1000,1500]):
            await pg.evaluate(f"document.getElementById('sRs').scrollTop={y}"); await pg.wait_for_timeout(900); await pg.screenshot(path=f'audit_sh/gh_{i}.png')
        await pg.goto(U+'taegil.html'); await pg.wait_for_timeout(1300)
        await pg.evaluate("document.querySelectorAll('button').forEach(b=>{ if(/건너뛰기/.test(b.textContent)) b.click(); })"); await pg.wait_for_timeout(500)
        await pg.click('#goBtn'); await pg.wait_for_timeout(1300); await pg.screenshot(path='audit_sh/tl_0.png'); await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/tl_1.png')
        await pg.goto(U+'sinnyeon.html'); await pg.wait_for_timeout(1300)
        await pg.evaluate("document.querySelectorAll('button').forEach(b=>{ if(/건너뛰기/.test(b.textContent)) b.click(); })"); await pg.wait_for_timeout(500)
        await pg.click('#goBtn'); await pg.wait_for_timeout(3150); await pg.screenshot(path='audit_sh/sn_0.png'); await pg.wait_for_timeout(700); await pg.screenshot(path='audit_sh/sn_1.png'); await pg.wait_for_timeout(1800); await pg.screenshot(path='audit_sh/sn_2.png')
        await pg.evaluate("document.getElementById('sRep').scrollTop=1200"); await pg.wait_for_timeout(250); await pg.screenshot(path='audit_sh/sn_3.png'); await pg.wait_for_timeout(1000); await pg.screenshot(path='audit_sh/sn_4.png')
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
from PIL import Image
fs=['gh_0','gh_1','gh_2','gh_3','tl_0','tl_1','sn_0','sn_1','sn_2','sn_3','sn_4']
ims=[Image.open(f'audit_sh/{f}.png').convert('RGB').resize((260,563)) for f in fs]
S=Image.new('RGB',(266*6,569*2),'white')
for i,im in enumerate(ims): S.paste(im,((i%6)*266,(i//6)*569))
S.save('au_pol.png')
