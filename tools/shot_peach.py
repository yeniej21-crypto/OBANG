import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required']); ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,timezone_id='America/New_York'); pg=await ctx.new_page()
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/peach.html'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path='../p0.png')
        await pg.click('#whatBtn'); await pg.wait_for_timeout(500); await pg.screenshot(path='../p0b.png'); await pg.click('#whatX'); await pg.wait_for_timeout(400)
        await pg.evaluate("window.playSeq=async()=>{await new Promise(r=>setTimeout(r,800))}; window.playHero=async()=>{}; window.playLetter=async()=>{};"); await pg.click('#startBtn'); await pg.wait_for_selector('#nm',timeout=20000); await pg.fill('#nm','emma'); await pg.click('#nmGo')
        await pg.wait_for_selector('.chip',timeout=20000); await pg.screenshot(path='../p1.png'); await pg.click('.chip >> nth=0')
        await pg.wait_for_selector('#dGo',timeout=20000); await pg.wait_for_timeout(300); await pg.screenshot(path='../p2.png'); await pg.click('#dGo')
        await pg.wait_for_selector('#tGo',timeout=20000); await pg.wait_for_timeout(300); await pg.screenshot(path='../p3.png'); await pg.click('#tGo')
        for i in range(0):
            await pg.wait_for_timeout(2500); await pg.screenshot(path=f'../pv{i}.png')
        await pg.wait_for_selector('#stage.res',timeout=60000); await pg.wait_for_timeout(3000); await pg.screenshot(path='../p4.png')
        for i,y in enumerate([500,1100,1700,2300]):
            await pg.evaluate(f"document.getElementById('result').scrollTop={y}"); await pg.wait_for_timeout(500); await pg.screenshot(path=f'../p5_{i}.png')
        await pg.click('#payBtn'); await pg.wait_for_timeout(600); await pg.screenshot(path='../p6.png'); await pg.click('#payNow'); await pg.wait_for_timeout(5000); await pg.screenshot(path='../p7.png')
        for i,y in enumerate([550,1150,1750]):
            await pg.evaluate(f"document.getElementById('letter').scrollTop={y}"); await pg.wait_for_timeout(500); await pg.screenshot(path=f'../p8_{i}.png')
        await pg.evaluate("document.getElementById('letter').classList.remove('on')"); await pg.click('#shareBtn'); await pg.wait_for_timeout(2500); await pg.screenshot(path='../p9.png')
        print('ERR',errs)
        await b.close()
asyncio.run(main())
