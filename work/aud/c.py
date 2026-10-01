import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8816','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8816/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(U+'today.html'); await pg.evaluate(ME)
    for P,sel in [('love2.html?m=re','#sIn'),('love2.html?m=next','#sIn'),('gunghap.html','#sIn')]:
      await pg.goto(U+P); await pg.wait_for_timeout(2000)
      for y in [120,600]:
        await pg.evaluate(f"(()=>{{const e=document.querySelector('{sel}'); e.scrollTop={y}; e.dispatchEvent(new Event('scroll'));}})()"); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f"aud/c_{P.replace('.html','').replace('?m=','_')}_{y}.png",clip={'x':0,'y':0,'width':390,'height':260})
    print(errs); await b.close()
asyncio.run(main()); srv.terminate()
