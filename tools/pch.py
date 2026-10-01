import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8775','-d','export/deploy_c/seoha-demo'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8775/peach.html"); await pg.wait_for_timeout(2500)
        print('voice', await pg.evaluate("VOICE"), 'enmiss', await pg.evaluate("JSON.stringify(ENMISS)"), 'blob en_v1', await pg.evaluate("!!BLOB['en_v1']"))
        await pg.click('#vsel button[data-v=ko]'); print('after', await pg.evaluate("VOICE"))
        await pg.screenshot(path='opv3/peach_vsel.png'); print('errors',errs); await b.close()
asyncio.run(main()); srv.terminate()
