import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8791','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8791/avatar.html"); await pg.wait_for_timeout(1200); await pg.screenshot(path='opv3/av_in.png')
        await pg.select_option('#by','1993'); await pg.select_option('#bm','12'); await pg.select_option('#bd','3'); await pg.select_option('#bh','10'); await pg.fill('#nm','은주')
        await pg.click('#goBtn'); 
        for i,t in enumerate([2600,1100,900,2400]):
            await pg.wait_for_timeout(t); await pg.screenshot(path=f'opv3/av_r{i}.png')
        await pg.click('#rvNext'); await pg.wait_for_timeout(1500); await pg.screenshot(path='opv3/av_o0.png')
        for i,y in enumerate([600,1150,1700]):
            await pg.evaluate(f"document.getElementById('sOut').scrollTop={y}"); await pg.wait_for_timeout(600); await pg.screenshot(path=f'opv3/av_o{i+1}.png')
        await pg.click('#shareBtn'); await pg.wait_for_timeout(2500); await pg.screenshot(path='opv3/av_sh.png')
        print('errs',errs); await b.close()
asyncio.run(main()); srv.terminate()
