import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8833','-d','export/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8833/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    for P in ['today.html','sinnyeon.html','tarot.html','career.html']:
      await pg.goto(U+P,wait_until='domcontentloaded')
      c0=await pg.evaluate("document.documentElement.className")
      await pg.wait_for_timeout(800)
      st=await pg.evaluate("[document.documentElement.className, !!document.querySelector('.mi'), [...document.querySelectorAll('video')].map(v=>v.getAttribute('poster')?'P':'-').join('')]")
      await pg.evaluate("(document.querySelector('.mi .x')||{click(){}}).click()")
      await pg.wait_for_timeout(2000)
      after=await pg.evaluate("document.documentElement.className")
      print(P,'start:',c0,'| 0.8s:',st,'| after skip:',after)
    await pg.goto(U+'dohwa.html'); await pg.wait_for_timeout(1500); print('dohwa posters', await pg.evaluate("[...document.querySelectorAll('video')].map(v=>v.getAttribute('poster')?'P':'-').join('')"), await pg.evaluate("document.documentElement.className"))
    print(errs); await b.close()
asyncio.run(main()); srv.terminate()
