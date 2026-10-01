import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8819','-d','export/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8819/index.html'); await pg.wait_for_timeout(2500)
    print(errs, await pg.evaluate("[location.href, document.title, !!document.getElementById('pBirth'), document.querySelectorAll('iframe').length]"))
    await b.close()
asyncio.run(main()); srv.terminate()
