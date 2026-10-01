import asyncio,subprocess,sys
from playwright.async_api import async_playwright
PORT=8791
async def main():
    srv=subprocess.Popen([sys.executable,'-m','http.server',str(PORT)],cwd='proto',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    await asyncio.sleep(1)
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append('C:'+m.text) if m.type=='error' else None)
        await pg.goto(f'http://localhost:{PORT}/myeongri.html'); await pg.wait_for_timeout(2500)
        await pg.screenshot(path='_mt/0intro_mi.png')
        await pg.evaluate("document.querySelectorAll('.mi').forEach(e=>e.remove());document.documentElement.classList.remove('mi-pre')")
        await pg.wait_for_timeout(400); await pg.screenshot(path='_mt/1intro.png')
        await pg.evaluate("document.getElementById('sIntro').scrollTop=600"); await pg.wait_for_timeout(300); await pg.screenshot(path='_mt/1intro_b.png')
        await pg.evaluate("document.getElementById('goBtn').click()"); await pg.wait_for_timeout(4200); await pg.screenshot(path='_mt/2write_mid.png')
        await pg.wait_for_timeout(5600); await pg.screenshot(path='_mt/3write_end.png')
        await pg.wait_for_timeout(2500); await pg.screenshot(path='_mt/4rep.png')
        h=await pg.evaluate("document.getElementById('sRep').scrollHeight"); i=0; top=0
        while top<h and i<8:
            await pg.evaluate(f"document.getElementById('sRep').scrollTop={top}"); await pg.wait_for_timeout(300); await pg.screenshot(path=f'_mt/5r{i}.png'); top+=780; i+=1
        await pg.evaluate("MRPrem.open()"); await pg.wait_for_timeout(1500)
        info=await pg.evaluate("(()=>{const p=document.getElementById('prem');return [p.offsetTop,p.offsetHeight,document.getElementById('sRep').scrollHeight]})()"); print(info)
        top=info[0]; i=0
        while top<info[0]+info[1] and i<10:
            await pg.evaluate(f"document.getElementById('sRep').scrollTop={top}"); await pg.wait_for_timeout(300); await pg.screenshot(path=f'_mt/6p{i}.png'); top+=780; i+=1
        print('ERR',errs[:10]); await b.close()
    srv.terminate()
asyncio.run(main())
