import asyncio, subprocess, time, os
Q=os.environ.get('Q','그 사람이 먼저 연락할까?'); TP=os.environ.get('TP','heart'); PF=os.environ.get('PF','t')
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8776','-d','ptest'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8776/tarot.html"); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelectorAll('.mi').forEach(x=>x.remove())")
        await pg.screenshot(path='opv3/t_s1.png')
        await pg.click(f'.chip[data-k={TP}]'); await pg.fill('#qin',Q); await pg.screenshot(path=f'opv3/{PF}_s1q.png'); await pg.click('#go1'); await pg.wait_for_timeout(800)
        box=await pg.query_selector('#deckArea'); bb=await box.bounding_box()
        await pg.mouse.move(bb['x']+bb['width']/2, bb['y']+bb['height']*.58); await pg.mouse.down(); await pg.wait_for_timeout(1000); await pg.screenshot(path='opv3/t_s2a.png'); await pg.wait_for_timeout(1500); await pg.mouse.up()
        await pg.wait_for_timeout(1800); await pg.screenshot(path='opv3/t_s2b.png')
        cs=await pg.query_selector_all('.cd.pick')
        for k in [3,10,17]:
            r=await cs[k].bounding_box(); x=r['x']+r['width']/2; y=r['y']+r['height']/2
            await pg.mouse.move(x-60,y); await pg.mouse.down(); await pg.mouse.move(x,y,steps=6)
            if k==10: await pg.screenshot(path='opv3/t_s2h.png')
            await pg.mouse.up(); await pg.wait_for_timeout(500)
        await pg.screenshot(path='opv3/t_s2c.png'); await pg.wait_for_timeout(1500)
        for j,el in enumerate(await pg.query_selector_all('#row .fc')):
            await el.click(); await pg.wait_for_timeout(1700)
            if j==0: await pg.screenshot(path='opv3/t_spot.png')
            await pg.click('#spot'); await pg.wait_for_timeout(600)
        await pg.screenshot(path='opv3/t_s3.png'); await pg.wait_for_timeout(8000)
        await pg.screenshot(path=f'opv3/{PF}_s4a.png'); await pg.evaluate("document.getElementById('s4s').scrollTop=500"); await pg.wait_for_timeout(300); await pg.screenshot(path='opv3/t_s4b.png')
        await pg.evaluate("document.getElementById('s4s').scrollTop=1100"); await pg.wait_for_timeout(300); await pg.screenshot(path='opv3/t_s4c.png')
        await pg.click('#rCards .th'); await pg.wait_for_timeout(300); await pg.screenshot(path='opv3/t_zoom.png')
        await pg.click('#zoom'); await pg.evaluate("document.getElementById('how').open=true;document.getElementById('how').scrollIntoView()"); await pg.wait_for_timeout(300); await pg.screenshot(path=f'opv3/{PF}_how.png')
        print('verd', await pg.evaluate("document.getElementById('verd').innerText"), '\nsay', await pg.evaluate("document.getElementById('rSay').innerText"), '\nhow', await pg.evaluate("document.getElementById('howL').innerText"), 'screen', await pg.evaluate("[...document.querySelectorAll('.scr.on')].map(s=>s.id)"), 'errors', errs); await b.close()
asyncio.run(main()); srv.terminate()
