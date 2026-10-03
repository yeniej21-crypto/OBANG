import asyncio,sys
U='http://localhost:8766/'
O='_spui/'
async def free(b,n,errs):
    pg=await b.new_page(viewport={"width":390,"height":844}); pg.on("pageerror",lambda e: errs.append(f'free{n}: {e}'))
    await pg.goto(U+'tarot.html#re'); await pg.wait_for_timeout(1500)
    await pg.fill('#qin','그 사람이랑 잘 될까?'); await pg.dispatch_event('#qin','input')
    await pg.click(f'.sp[data-n="{n}"]'); await pg.click('#go1'); await pg.wait_for_timeout(1500)
    await pg.evaluate("document.getElementById('vS').dispatchEvent(new Event('ended'))"); await pg.wait_for_timeout(600)
    bb=await (await pg.query_selector('#deckArea')).bounding_box()
    cx,cy=bb['x']+bb['width']/2,bb['y']+bb['height']*.6
    await pg.mouse.move(cx,cy); await pg.mouse.down()
    for i in range(45): await pg.mouse.move(cx+((i%2)*40-20),cy); await pg.wait_for_timeout(80)
    await pg.mouse.up(); await pg.wait_for_timeout(2500)
    await pg.focus('#deckArea')
    for k in range(n): await pg.keyboard.press('Enter'); await pg.wait_for_timeout(1200)
    await pg.wait_for_timeout(1500); await pg.screenshot(path=O+f'f{n}_reveal.png')
    for k in range(n):
        await pg.click(f'#row .fc[data-i="{k}"]'); await pg.wait_for_timeout(1700); await pg.mouse.click(195,600); await pg.wait_for_timeout(600)
    await pg.wait_for_timeout(1800); await pg.evaluate("document.getElementById('rxX').click()"); await pg.wait_for_timeout(1200)
    on=await pg.evaluate("document.getElementById('s4').classList.contains('on')+' deep='+document.getElementById('s4').classList.contains('deep')")
    print('free',n,'s4 on',on)
    await pg.screenshot(path=O+f'f{n}_result.png')
    if n==3:
        await pg.evaluate("document.getElementById('lockR').scrollIntoView({block:'center'})"); await pg.wait_for_timeout(400); await pg.screenshot(path=O+'f3_lock.png')
        await pg.click('#payBtn'); await pg.wait_for_timeout(600)
        await pg.click('.obp [data-agree]'); await pg.click('.obp [data-pay]'); await pg.wait_for_timeout(3000)
        print('upsell picker open', await pg.evaluate("!!document.querySelector('.tpk.on')"))
        await pg.screenshot(path=O+'f3_upsell_picker.png')
    await pg.close()
async def deep(b,errs,topic=None):
    pg=await b.new_page(viewport={"width":390,"height":844}); pg.on("pageerror",lambda e: errs.append(f'deep: {e}'))
    await pg.goto(U+'tarot.html#re'); await pg.wait_for_timeout(1500)
    if topic: await pg.click(f'.chip[data-k="{topic}"]')
    await pg.fill('#qin','이직 준비, 석 달 안에 될까'); await pg.dispatch_event('#qin','input')
    await pg.click('.sp[data-n="10"]'); await pg.click('#go1'); await pg.wait_for_timeout(700)
    await pg.screenshot(path=O+'d_pay.png')
    await pg.click('.obp [data-agree]'); await pg.click('.obp [data-pay]'); await pg.wait_for_timeout(3200)
    print('deep picker open', await pg.evaluate("!!document.querySelector('.tpk.on')"), 'paybtn obpaid', await pg.evaluate("document.getElementById('payBtn').dataset.obpaid||'-'"))
    await pg.screenshot(path=O+'d_picker0.png'); await pg.wait_for_timeout(3500); await pg.screenshot(path=O+'d_picker1.png')
    await pg.focus('.tpk-area')
    for k in range(3): await pg.keyboard.press('ArrowRight'); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(1000)
    await pg.click('.tpk-x'); await pg.wait_for_timeout(1200); await pg.screenshot(path=O+'d_closed.png')
    await pg.click('#rprem .tp-go'); await pg.wait_for_timeout(1200); await pg.focus('.tpk-area')
    for k in range(7): await pg.keyboard.press('ArrowRight'); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(1000)
    await pg.wait_for_timeout(800); await pg.screenshot(path=O+'d_picker10.png')
    await pg.click('.tpk-go'); await pg.wait_for_timeout(2500); await pg.screenshot(path=O+'d_result.png')
    await pg.evaluate("document.getElementById('s4s').scrollTop+=700"); await pg.wait_for_timeout(500); await pg.screenshot(path=O+'d_result2.png')
    await pg.click('#again'); await pg.wait_for_timeout(900); await pg.evaluate("document.getElementById('s1').scrollTop=99999"); await pg.wait_for_timeout(300); await pg.screenshot(path=O+'d_again.png')
    await pg.close()
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--autoplay-policy=no-user-gesture-required']); errs=[]
        await free(b,1,errs); await free(b,3,errs); await deep(b,errs)
        print('errs',errs); await b.close()
asyncio.run(main())
