import asyncio, subprocess, time, os
SP=os.getcwd(); PRE='<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
open('proto/_home.html','w',encoding='utf-8').write(PRE+open('proto/seoha-salon.html',encoding='utf-8').read())
srv=subprocess.Popen(['python3','-m','http.server','8799','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8799/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def run(pg,f,go=True,extra=None):
    await pg.goto(U+f); await pg.wait_for_timeout(1400)
    await pg.evaluate("document.querySelectorAll('button').forEach(b=>{ if(/건너뛰기/.test(b.textContent)) b.click(); })"); await pg.wait_for_timeout(600)
    if extra: await extra(pg)
    if go and await pg.query_selector('#goBtn'):
        try: await pg.click('#goBtn',timeout=2500)
        except: pass
    await pg.wait_for_timeout(5200)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append((pg.url[-30:],str(e))))
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        await pg.evaluate("sessionStorage.setItem('toHome','1')"); await pg.goto(U+'_home.html'); await pg.wait_for_timeout(2500)
        await pg.click('#tabs button[data-t="box"]'); await pg.wait_for_timeout(700); await pg.screenshot(path='audit_sh/ar_empty.png')
        await run(pg,'today.html',go=False)
        await run(pg,'sinnyeon.html'); await pg.screenshot(path='audit_sh/ar_sin.png')
        async def pick(pg): await pg.click('#purp button:nth-child(2)')
        await run(pg,'taegil.html',extra=pick); await pg.screenshot(path='audit_sh/ar_tg.png')
        await pg.evaluate("document.getElementById('cal').scrollIntoView()"); await pg.wait_for_timeout(300); await pg.screenshot(path='audit_sh/ar_tgcal.png')
        await run(pg,'career.html'); await run(pg,'gunghap.html'); await run(pg,'lifetime.html')
        print('arch', await pg.evaluate("ObArch.list().map(x=>x.k+':'+x.h+':'+x.s+':'+(x.form?JSON.stringify(x.form.seg):''))"))
        await pg.evaluate("sessionStorage.setItem('toHome','1')"); await pg.goto(U+'_home.html'); await pg.wait_for_timeout(2500)
        await pg.click('#tabs button[data-t="box"]'); await pg.wait_for_timeout(900); await pg.screenshot(path='audit_sh/ar_list.png')
        its=await pg.query_selector_all('#archL .it')
        # 택일 항목 열기
        for it in its:
            if '택일' in await it.inner_text(): await it.click(); break
        await pg.wait_for_timeout(600); await pg.screenshot(path='audit_sh/ar_det.png')
        await pg.click('#adGo'); await pg.wait_for_timeout(4500); await pg.screenshot(path='audit_sh/ar_re.png')
        print('reopened', pg.url, await pg.evaluate("document.getElementById('oT')?.textContent"))
        print(errs); await b.close()
asyncio.run(main()); srv.terminate()
