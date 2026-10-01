import asyncio,base64
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(800)
    await pg.evaluate("S.name='김은주';S.nick='은주';S.date={y:1996,m:5,d:14,cal:'양력'};S.hour=6;R=saju(1996,5,14,6);document.getElementById('splash').classList.add('off');")
    await pg.evaluate("void showResult()"); await pg.wait_for_timeout(9000)
    await pg.evaluate("document.getElementById('result').scrollTo(0,99999)"); await pg.wait_for_timeout(500)
    await pg.screenshot(path='sh0.png')
    await pg.click('#shareBtn'); await pg.wait_for_timeout(2500); await pg.screenshot(path='sh1.png')
    d=await pg.evaluate("new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(cardBlob);})")
    open('card.png','wb').write(base64.b64decode(d.split(',')[1]))
    print(errs); await b.close()
asyncio.run(main())
