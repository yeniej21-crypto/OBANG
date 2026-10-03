import asyncio,sys
U='http://localhost:8766/'
OUT='_spui/'
async def sel_shots(pg,tag):
    await pg.evaluate("document.getElementById('spreads').scrollIntoView({block:'start'}); document.getElementById('s1').scrollTop-=60")
    await pg.wait_for_timeout(400); await pg.screenshot(path=OUT+tag+'.png')
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={"width":390,"height":844}); errs=[]
        pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.goto(U+'tarot.html#re'); await pg.wait_for_timeout(1800)
        await sel_shots(pg,'sel3')
        await pg.click('.sp[data-n="1"]'); await sel_shots(pg,'sel1')
        await pg.click('.sp[data-n="10"]'); await sel_shots(pg,'sel10')
        await pg.evaluate("window.scrollTo(0,0)")
        st=await pg.evaluate("document.getElementById('s1').scrollHeight"); print('s1 scrollH',st)
        await pg.evaluate("document.getElementById('s1').scrollTop=99999"); await pg.wait_for_timeout(300); await pg.screenshot(path=OUT+'sel10_bottom.png')
        for t in ['today','month','contact']:
            await pg.click(f'.chip[data-k="{t}"]'); await sel_shots(pg,'topic_'+t)
        ow=await pg.evaluate("document.documentElement.scrollWidth"); print('scrollWidth',ow)
        print('errs',errs); await b.close()
asyncio.run(main())
