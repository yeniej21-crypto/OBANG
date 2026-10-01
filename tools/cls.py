import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8801','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8801/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
JS="""(()=>{ const s=[...document.querySelectorAll('#sRep,#sOut,#result')].find(e=>e.classList.contains('on')||e.offsetParent)||document.body; const w=s.querySelector('.wrap,.scroll,.in')||s;
 return [s.id, [...w.children].map(c=>c.tagName.toLowerCase()+'.'+[...c.classList].join('.')+(c.id?'#'+c.id:'')).join(' | ')] })()"""
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":390,"height":844})
        await pg.goto(U+'today.html'); await pg.evaluate(ME)
        for f in ['today','sinnyeon','lifetime','career','taegil','gunghap']:
            await pg.goto(U+f+'.html'); await pg.wait_for_timeout(1300)
            await pg.evaluate("document.querySelectorAll('button').forEach(b=>{ if(/건너뛰기/.test(b.textContent)) b.click(); })"); await pg.wait_for_timeout(500)
            try: await pg.click('#goBtn',timeout=1500)
            except: pass
            await pg.wait_for_timeout(5000); print(f,await pg.evaluate(JS))
        await b.close()
asyncio.run(main()); srv.terminate()
