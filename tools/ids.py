import asyncio, subprocess, time, json
srv=subprocess.Popen(['python3','-m','http.server','8797','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8797/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
JS="""(()=>{const s=[...document.querySelectorAll('.scr.on,section.on,.on')].find(e=>e.scrollHeight>300)||document.body; return [...s.querySelectorAll('[id]')].slice(0,40).map(e=>e.id+'='+(e.textContent||'').trim().replace(/\\s+/g,' ').slice(0,40))})()"""
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":390,"height":844})
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        for f in ['today','sinnyeon','lifetime','taegil','career','gunghap']:
            await pg.goto(U+f+'.html'); await pg.wait_for_timeout(1500)
            await pg.evaluate("document.querySelectorAll('button').forEach(b=>{ if(/건너뛰기/.test(b.textContent)) b.click(); })"); await pg.wait_for_timeout(800)
            try: await pg.click('#goBtn',timeout=2000)
            except: pass
            await pg.wait_for_timeout(4200)
            print('==',f, await pg.evaluate(JS))
        await b.close()
asyncio.run(main()); srv.terminate()
