import asyncio,re,os
from playwright.async_api import async_playwright
SP=os.path.dirname(os.path.abspath(__file__)); STUB=SP+'/t/hm_stub'
MONTHS=['047f0acf','d6abc742','deb7c371','d4a96c84','9c39c652','52e2c98f','e84aa609','ded33e88','4ad4a1b9','690c0bf1','e4f41cdd','1c65a592']
def stub_for(url):
    for i,k in enumerate(MONTHS):
        if k in url: return STUB+f'/m{i+1}.webp'
    if '3eb5368c' in url: return STUB+'/tray.webp'
    return SP+'/proto/img/halmae.jpg'
async def run(b,w,h,tag):
    pg=await b.new_page(viewport={'width':w,'height':h}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.route(re.compile(r'.*cloudfront\.net.*'),lambda r:r.fulfill(path=stub_for(r.request.url)))
    await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(900); await pg.evaluate("document.querySelectorAll('.mi .x').forEach(b=>b.click())"); await pg.wait_for_timeout(3200)
    await pg.screenshot(path=f'{SP}/t/hm_sz_{tag}_room.png')
    await pg.evaluate("go()"); await pg.wait_for_function("document.getElementById('rTake').classList.contains('on')",timeout=12000); await pg.click('#takeBtn'); await pg.wait_for_timeout(2400); await pg.click('#rSkip'); await pg.wait_for_timeout(5000)
    await pg.screenshot(path=f'{SP}/t/hm_sz_{tag}_rice.png')
    await pg.click('#toScroll'); await pg.wait_for_timeout(6500); await pg.screenshot(path=f'{SP}/t/hm_sz_{tag}_scroll.png')
    print(tag,await pg.evaluate("[document.documentElement.scrollWidth,innerWidth,document.getElementById('sScroll').scrollHeight,document.getElementById('sScroll').clientHeight,document.getElementById('sRice').scrollHeight]"),errs[:2])
    await pg.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        await run(b,360,640,'s'); await run(b,1280,900,'pc'); await b.close()
asyncio.run(main())
