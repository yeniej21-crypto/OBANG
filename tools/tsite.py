import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8819','-d','export/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]; bad=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        pg.on("response",lambda r: bad.append(r.url) if r.status>=400 and 'localhost' in r.url else None)
        for u in ['index.html','book.html','myodang.html','bujeok.html','dangbeon.html','ppopgi.html','today.html','tarot.html']:
            await pg.goto('http://localhost:8819/'+u); await pg.wait_for_timeout(1500)
        print('errs',errs[:5]); print('404',sorted(set(bad))[:20]); await b.close()
asyncio.run(main()); srv.terminate()
