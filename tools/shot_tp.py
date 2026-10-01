import asyncio
from playwright.async_api import async_playwright
MOCK=open('mock2.js').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script(MOCK)
        await pg.goto('http://localhost:8766/tarot.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("const T=TarotDev, S=T.S; S.q='그 사람이 먼저 연락할까'; S.topic='love'; S.n=3; S.A=T.R.analyze(S.q); S.k='love'; T.setPos(TAROT_SPREAD.love.pos.slice()); S.kinds=T.R.KINDS.love; S.picked=[6,17,19]; S.rv=[false,true,false]; S.mood='good'; T.render();")
        await pg.wait_for_timeout(1500); await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(800)
        for k in [3,7,1]: await pg.evaluate(f"document.querySelectorAll('#rprem .tp-fan button')[{k}].click()")
        await pg.evaluate("document.getElementById('rprem').scrollIntoView()"); await pg.wait_for_timeout(400); await pg.screenshot(path='tp0.png')
        for k in [0,2,4,5,6,8,9]: await pg.evaluate(f"document.querySelectorAll('#rprem .tp-fan button')[{k}].click()")
        await pg.wait_for_timeout(300); await pg.evaluate("document.getElementById('rprem').scrollIntoView()"); await pg.screenshot(path='tp1.png')
        await pg.evaluate("document.querySelector('#rprem .tp-go').click()"); await pg.wait_for_timeout(2500)
        await pg.evaluate("document.getElementById('rprem').scrollIntoView()"); await pg.wait_for_timeout(300); await pg.screenshot(path='tp2.png')
        P=await pg.evaluate("window.__P"); print('calls',len(P)); print(P[0][:1500] if P else '')
        print('ERR',errs); await b.close()
asyncio.run(main())
