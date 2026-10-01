import asyncio, subprocess, time, os, shutil
SP=os.getcwd(); A=SP+'/audit_srv'
if not os.path.exists(A): os.symlink(SP+'/proto',A) if False else None
PRE='<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
open(SP+'/proto/_home.html','w',encoding='utf-8').write(PRE+open(SP+'/proto/seoha-salon.html',encoding='utf-8').read())
srv=subprocess.Popen(['python3','-m','http.server','8796','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8796/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def scrolls(pg,name,n=4,step=760):
    sel=await pg.evaluate("""(()=>{const s=[...document.querySelectorAll('.scr.on,section.on,.screen.on,.on')].filter(e=>e.scrollHeight>e.clientHeight+20); const e=s[0]||document.scrollingElement; e.id=e.id||'__sc'; return e.id})()""")
    for i in range(n):
        await pg.evaluate(f"(()=>{{const e=document.getElementById('{sel}')||document.scrollingElement; e.scrollTop={i*step};}})()"); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'audit_sh/{name}_{i}.png')
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required'])
        ctx=await b.new_context(viewport={"width":390,"height":844},device_scale_factor=1); pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e: errs.append((pg.url,str(e))))
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        await pg.evaluate("sessionStorage.setItem('toHome','1')"); await pg.goto(U+'_home.html'); await pg.wait_for_timeout(3500)
        await scrolls(pg,'home',7,760)
        for f in ['today','career','taegil','gunghap','sinnyeon','lifetime','chat','dohwa','tarot','peach','avatar']:
            await pg.goto(U+f+'.html'); await pg.wait_for_timeout(1500)
            # 메뉴 인트로 건너뛰기
            await pg.evaluate("document.querySelectorAll('button').forEach(b=>{ if(/건너뛰기/.test(b.textContent)) b.click(); })"); await pg.wait_for_timeout(1200)
            await pg.screenshot(path=f'audit_sh/{f}_in.png')
            if f=='avatar':
                await pg.wait_for_timeout(9000); await pg.screenshot(path=f'audit_sh/{f}_rv.png')
                try: await pg.click('#rvNext',timeout=4000)
                except Exception as e: pass
                await pg.wait_for_timeout(1500); await scrolls(pg,f,5); continue
            if await pg.query_selector('#goBtn'):
                try:
                    await pg.click('#goBtn',timeout=3000); await pg.wait_for_timeout(5000)
                    await scrolls(pg,f,5)
                except Exception as e: errs.append((f,'click '+str(e)[:80]))
        print('\n'.join(map(str,errs))); await b.close()
asyncio.run(main()); srv.terminate()
