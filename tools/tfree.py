import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8803','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8803/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'free.html'); await pg.evaluate(ME); await pg.goto(U+'free.html'); await pg.wait_for_timeout(1200); await pg.screenshot(path='audit_sh/fr_hub.png')
        for k in ['past','animal','bok','bujeok','tti','mind']:
            await pg.goto(U+'free.html?t='+k); await pg.wait_for_timeout(900); await pg.screenshot(path=f'audit_sh/fr_{k}_in.png')
            if k=='mind':
                await pg.click('#goBtn'); await pg.wait_for_timeout(400)
                for i in range(8):
                    await pg.click(f'#qO button:nth-child({(i%5)+1})'); await pg.wait_for_timeout(420)
            elif k=='tti': await pg.click('#goBtn')
            else: await pg.click('#meQ')
            await pg.wait_for_timeout(2600)
            if k=='bujeok':
                await pg.screenshot(path='audit_sh/fr_bujeok_pre.png'); await pg.click('.bj[data-i="1"]'); await pg.wait_for_timeout(1300)
            await pg.screenshot(path=f'audit_sh/fr_{k}_0.png')
            await pg.evaluate("document.getElementById('sRs').scrollTop=700"); await pg.wait_for_timeout(900); await pg.screenshot(path=f'audit_sh/fr_{k}_1.png')
            print(k, await pg.inner_text('#rT'), '|', await pg.inner_text('#rP'))
        print('arch', await pg.evaluate("ObArch.list().map(x=>x.menu+':'+x.h+':'+x.s)"))
        await pg.click('#shareBtn'); await pg.wait_for_timeout(1500); await pg.screenshot(path='audit_sh/fr_share.png')
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
from PIL import Image
fs=['fr_hub','fr_past_in','fr_past_0','fr_past_1','fr_animal_0','fr_animal_1','fr_bok_0','fr_bok_1','fr_bujeok_pre','fr_bujeok_0','fr_bujeok_1','fr_tti_0','fr_tti_1','fr_mind_0','fr_mind_1','fr_share']
ims=[Image.open(f'audit_sh/{f}.png').convert('RGB').resize((240,520)) for f in fs]
S=Image.new('RGB',(246*8,526*2),'white')
for i,im in enumerate(ims): S.paste(im,((i%8)*246,(i//8)*526))
S.save('au_free.png')
