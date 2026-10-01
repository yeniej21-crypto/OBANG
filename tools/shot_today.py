import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto('http://localhost:8766/today.html'); await pg.wait_for_timeout(800)
        await pg.screenshot(path='../t_in.png')
        await pg.fill('#nm','은주'); await pg.select_option('#bh','6'); await pg.click('#goBtn'); await pg.wait_for_timeout(1800)
        out='../t_out%d.png'
        for i,y in enumerate([0,800,1600,2400]):
            await pg.evaluate(f"document.getElementById('sOut').scrollTop={y}"); await pg.wait_for_timeout(500)
            if i==3: await pg.click('#flip'); await pg.wait_for_timeout(1000)
            await pg.screenshot(path=out%i)
        print('ERR',errs)
        # scan scores across 60 days for distribution
        r=await pg.evaluate("(()=>{const a=[];for(let i=0;i<60;i++){const R=readDay(ME,base+i);a.push([R.tot,R.love,R.money,R.work,R.body,R.tg].join(','));}return a;})()")
        print('\n'.join(r[:20]))
        await b.close()
asyncio.run(main())
