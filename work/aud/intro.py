import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8826','-d','export/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8826/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(U+'index.html'); await pg.wait_for_timeout(2500); await pg.add_style_tag(content='.op,.start,.opEnd{display:none!important}')
    await pg.evaluate("document.getElementById('pBirth').classList.add('on')"); await pg.wait_for_timeout(600); await pg.screenshot(path='aud/i1_birth.png')
    await pg.evaluate("document.getElementById('birthGo').click()"); await pg.wait_for_timeout(400); print('need', await pg.evaluate("document.getElementById('gSeg').className"))
    await pg.evaluate("document.getElementById('gM').click()"); print('pressed', await pg.evaluate("document.getElementById('gM').getAttribute('aria-pressed')"))
    await pg.evaluate("(document.getElementById('pBirth').classList.remove('on'),document.getElementById('pWorry').classList.add('on'))"); await pg.wait_for_timeout(600); await pg.screenshot(path='aud/i2_worry.png')
    await pg.evaluate("document.getElementById('pWorry').classList.remove('on')"); await pg.evaluate("openHostInfo()"); await pg.wait_for_timeout(600); await pg.screenshot(path='aud/i3_sheet.png')
    await pg.evaluate("document.querySelector('#hostSheet [data-x]').click()")
    await pg.evaluate("document.getElementById('result').classList.add('on')"); await pg.wait_for_timeout(800); await pg.screenshot(path='aud/i4_result.png')
    print(errs); await b.close()
asyncio.run(main()); srv.terminate()
