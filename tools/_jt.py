import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); 
    for f in ['seoha-salon.html','ian-salon.html']:
      pg=await b.new_page(viewport={'width':390,'height':844}); errs=[]
      await pg.add_init_script("try{sessionStorage.setItem('toHome','1');localStorage.setItem('obMe',JSON.stringify({y:1994,m:5,d:14,h:9,cal:'s',g:'f',name:'은주'}));sessionStorage.setItem('me',localStorage.getItem('obMe'));localStorage.setItem('obSeen','1')}catch(e){}")
      pg.on('pageerror',lambda e,errs=errs:errs.append(str(e)))
      await pg.goto('http://localhost:8812/'+f); await pg.wait_for_timeout(2500)
      if 'salon' in f or 'home' in f:
        el=await pg.query_selector('#secBook')
        if el:
          await pg.evaluate("document.querySelector('#secBook').scrollIntoView()"); await pg.wait_for_timeout(800); await el.screenshot(path=f'_job_{f}.png')
      else: await pg.screenshot(path=f'_job_{f}.png')
      print(f,errs[:3])
    await b.close()
asyncio.run(main())
