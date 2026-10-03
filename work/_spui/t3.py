import asyncio
U='http://localhost:8766/'; O='_spui/'
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); errs=[]
        for topic,rm in [('month','no-preference'),('contact','reduce')]:
            ctx=await b.new_context(viewport={"width":390,"height":844},reduced_motion=rm); pg=await ctx.new_page(); pg.on("pageerror",lambda e: errs.append(f'{topic}: {e}'))
            await pg.goto(U+'tarot.html#re'); await pg.wait_for_timeout(1500)
            await pg.click(f'.chip[data-k="{topic}"]'); await pg.click('.sp[data-n="10"]')
            print(topic,'S.n', await pg.evaluate("document.querySelector('.sp.on').dataset.n"), await pg.evaluate("document.getElementById('go1').textContent"))
            await pg.click('#go1'); await pg.wait_for_timeout(700)
            print(' coupon visible', await pg.evaluate("getComputedStyle(document.querySelector('.obp .cp')).display"))
            await pg.screenshot(path=O+f'p_{topic}_pay.png')
            await pg.click('.obp [data-agree]'); await pg.click('.obp [data-pay]'); await pg.wait_for_timeout(3000)
            await pg.click('.tpk-x'); await pg.wait_for_timeout(900)
            await pg.evaluate("document.getElementById('s4s').scrollTop=0"); await pg.wait_for_timeout(400); await pg.screenshot(path=O+f'p_{topic}_s4top.png')
            # switch topic to today in s1 -> 10 should fall back
            await pg.click('#again'); await pg.wait_for_timeout(800); await pg.click('.chip[data-k="today"]')
            print(' today ->', await pg.evaluate("document.querySelector('.sp.on').dataset.n"), await pg.evaluate("document.querySelector('.sp.deep').hidden"))
            await ctx.close()
        print('errs',errs); await b.close()
asyncio.run(main())
