import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8825','-d','export/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844})
    await pg.goto('http://localhost:8825/index.html'); await pg.wait_for_timeout(2000)
    await pg.evaluate("openHostInfo()"); await pg.wait_for_timeout(500)
    print(await pg.evaluate("""[...document.querySelectorAll('#hostSheet .hsp, #hostSheet .hsh, #hostSheet .hsh i, #hostSheet .hsh p, #hostSheet dl')].map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return e.className+'|'+e.tagName+' '+s.display+' '+s.position+' '+Math.round(r.top)+'-'+Math.round(r.bottom)+' h'+s.height+' ov'+s.overflow})"""))
    await b.close()
asyncio.run(main()); srv.terminate()
