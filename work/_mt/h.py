import asyncio,subprocess,sys
from playwright.async_api import async_playwright
PORT=8792
async def main():
    srv=subprocess.Popen([sys.executable,'-m','http.server',str(PORT)],cwd='export/site',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    await asyncio.sleep(1)
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(f'http://localhost:{PORT}/newyear.html'); await pg.wait_for_timeout(1800)
        await pg.screenshot(path='_mt/ny0.png')
        h=await pg.evaluate("document.getElementById('scr').scrollHeight"); top=700; i=1
        while top<h and i<9:
            await pg.evaluate(f"document.getElementById('scr').scrollTop={top}"); await pg.wait_for_timeout(350); await pg.screenshot(path=f'_mt/ny{i}.png'); top+=760; i+=1
        await pg.evaluate("sessionStorage.setItem('toHome','1')")
        await pg.goto(f'http://localhost:{PORT}/index.html'); await pg.wait_for_timeout(2500)
        await pg.screenshot(path='_mt/home0.png')
        y=await pg.evaluate("(()=>{const e=document.getElementById('secJt');return e.offsetTop})()")
        await pg.evaluate(f"document.getElementById('home').scrollTop={y-120}"); await pg.wait_for_timeout(500); await pg.screenshot(path='_mt/home1.png')
        print('ERR',errs[:6]); await b.close()
    srv.terminate()
asyncio.run(main())
