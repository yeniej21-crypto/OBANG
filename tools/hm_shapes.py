import asyncio,re,os
from playwright.async_api import async_playwright
SP=os.path.dirname(os.path.abspath(__file__))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860},device_scale_factor=1.5)
        await pg.route(re.compile(r'.*cloudfront\.net.*'),lambda r:r.fulfill(path=SP+'/t/hm_stub/tray.webp',content_type='image/webp') if '3eb5368c' in r.request.url else r.abort())
        await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(900)
        await pg.evaluate("document.querySelectorAll('.mi .x').forEach(b=>b.click())"); await pg.wait_for_timeout(1200)
        await pg.evaluate("go()"); await pg.wait_for_timeout(1500)
        await pg.wait_for_function("document.getElementById('rTake').classList.contains('on')",timeout=12000)
        await pg.click('#takeBtn')
        for k in range(5):
            await pg.wait_for_timeout(2600); await pg.evaluate(f"RICE.pour()"); await pg.wait_for_timeout(2400)
            await pg.evaluate(f"RICE.form({k})"); await pg.wait_for_timeout(2600)
            el=await pg.query_selector('#tray'); await el.screenshot(path=f'{SP}/t/hm_shape{k}.png')
        await b.close()
asyncio.run(main())
