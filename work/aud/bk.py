import asyncio, subprocess, time, sys
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8817','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8817/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
    for vw,vh,tag in [(360,740,'b'),(360,640,'c')]:
      pg=await b.new_page(viewport={'width':vw,'height':vh}); errs=[]
      pg.on('pageerror',lambda e:errs.append(str(e)))
      await pg.goto(U+'book.html'); await pg.evaluate("localStorage.removeItem('obBookPg')"); await pg.goto(U+'book.html'); await pg.wait_for_timeout(2500)
      n=await pg.evaluate("typeof N!=='undefined'?N:0"); print(tag,'pages',n)
      for i in range(n):
        await pg.evaluate(f"go({i},false)"); await pg.wait_for_timeout(1400)
        await pg.screenshot(path=f'aud/bk_{tag}_{i:02d}.png')
      print(tag,errs); await pg.close()
    await b.close()
asyncio.run(main()); srv.terminate()
