import asyncio
from playwright.async_api import async_playwright
from PIL import Image, ImageChops
async def run(b,page,out):
    pg=await b.new_page(viewport={'width':390,'height':844}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(f'http://localhost:8766/{page}'); await pg.wait_for_timeout(900)
    await pg.evaluate("document.getElementById('nm').value='은주'; document.getElementById('py').value='1994'; document.getElementById('pm').value='3'; document.getElementById('pd').value='8'; document.getElementById('goBtn').click()"); await pg.wait_for_timeout(2600)
    await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(500)
    await pg.evaluate("(()=>{const a=document.querySelector('.obp [data-agree]'); if(!a) return; a.checked=true; a.dispatchEvent(new Event('change')); document.querySelector('.obp [data-pay]').click();})()"); await pg.wait_for_timeout(4200)
    await pg.evaluate("document.querySelectorAll('.lb-anim').forEach(e=>e.classList.add('in'))")
    h=await pg.evaluate("document.getElementById('sRs').scrollHeight"); await pg.evaluate("document.getElementById('sRs').scrollTop=0")
    await pg.set_viewport_size({'width':390,'height':h}); await pg.wait_for_timeout(700); await pg.screenshot(path=out); print(page,h,errs); await pg.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        await run(b,'zz_love2_bk.html','re_old.png'); await run(b,'love2.html','re_new.png'); await b.close()
asyncio.run(main())
a=Image.open('re_old.png').convert('RGB'); b=Image.open('re_new.png').convert('RGB'); print(a.size,b.size, ImageChops.difference(a,b).getbbox() if a.size==b.size else 'size')
