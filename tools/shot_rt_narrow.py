import asyncio, sys
from playwright.async_api import async_playwright
T='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/'
PT=(sys.argv[1] if len(sys.argv)>1 else '1990-3-4').split('-'); TAG=sys.argv[2] if len(sys.argv)>2 else ''
STORED='stored' in sys.argv; STAGE=int(sys.argv[3]) if len(sys.argv)>3 and sys.argv[3].isdigit() else 1; WANT=int(sys.argv[4]) if len(sys.argv)>4 and sys.argv[4].isdigit() else 1
FULL='full' in sys.argv
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':360,'height':740},device_scale_factor=2,reduced_motion='reduce')
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and errs.append(m.text)); pg.on('response',lambda r: r.status>=400 and errs.append(str(r.status)+' '+r.url))
        if STORED: await pg.add_init_script("localStorage.setItem('obMe',JSON.stringify({cal:'s',y:1996,m:5,d:14,g:'f',h:null}))")
        await pg.goto('http://localhost:8766/redthread.html'); await pg.wait_for_timeout(1600)
        if FULL: await pg.screenshot(path=T+f'rtn_0_intro{TAG}.png')
        await pg.click('#startMute'); await pg.wait_for_timeout(2600)
        if FULL: await pg.screenshot(path=T+f'rtn_0b_enter{TAG}.png')
        if STORED:
            await pg.wait_for_selector('.chips button',state='visible',timeout=20000); await pg.wait_for_timeout(500)
            if FULL: await pg.screenshot(path=T+f'rtn_1_saved{TAG}.png')
            await pg.click('.chips button >> nth=0')
        else:
            await pg.wait_for_selector('#kGo',state='visible',timeout=20000); await pg.wait_for_timeout(500)
            await pg.select_option('#kY','1996'); await pg.select_option('#kM','5'); await pg.select_option('#kD','14')
            if FULL: await pg.screenshot(path=T+f'rtn_1_me{TAG}.png')
            await pg.click('#kGo')
        await pg.wait_for_selector('#kGo',state='visible',timeout=20000); await pg.wait_for_timeout(500)
        await pg.select_option('#kY',PT[0]); await pg.select_option('#kM',PT[1]); await pg.select_option('#kD',PT[2])
        if FULL: await pg.screenshot(path=T+f'rtn_2_them{TAG}.png')
        await pg.click('#kGo')
        await pg.wait_for_selector('.chips button >> nth=4',state='visible',timeout=20000); await pg.wait_for_timeout(500)
        if FULL: await pg.screenshot(path=T+f'rtn_3_stage{TAG}.png')
        await pg.click(f'.chips button >> nth={STAGE}')
        await pg.wait_for_timeout(1200); await pg.wait_for_selector('.chips button >> nth=3',state='visible',timeout=20000); await pg.wait_for_timeout(500)
        if FULL: await pg.screenshot(path=T+f'rtn_4_want{TAG}.png')
        await pg.click(f'.chips button >> nth={WANT}')
        await pg.wait_for_selector('#sRit.on',timeout=30000); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=T+f'rtn_5_ritual{TAG}.png')
        a=await pg.locator('#spA').bounding_box(); bb=await pg.locator('#spB').bounding_box()
        ax,ay=a['x']+a['width']/2,a['y']+a['height']/2; bx,by=bb['x']+bb['width']/2,bb['y']+bb['height']/2
        await pg.mouse.move(ax,ay); await pg.mouse.down()
        for i in range(1,21):
            t=i/30; await pg.mouse.move(ax+(bx-ax)*t,ay+(by-ay)*t+40*t); await pg.wait_for_timeout(16)
        await pg.screenshot(path=T+f'rtn_6_drag{TAG}.png')
        for i in range(21,31):
            t=i/30; await pg.mouse.move(ax+(bx-ax)*t+6,ay+(by-ay)*t+30*(1-t)); await pg.wait_for_timeout(16)
        await pg.mouse.up(); await pg.wait_for_timeout(350); await pg.screenshot(path=T+f'rtn_7_attach{TAG}.png')
        await pg.wait_for_selector('#rBt.on',timeout=20000); await pg.wait_for_timeout(900)
        await pg.screenshot(path=T+f'rtn_8_tied{TAG}.png')
        await pg.click('#rGo'); await pg.wait_for_timeout(1600)
        await pg.screenshot(path=T+f'rtn_9_res0{TAG}.png')
        h=await pg.evaluate("document.getElementById('sRes').scrollHeight")
        y=0; i=1
        while y<h and i<12:
            y+=760; await pg.evaluate(f"document.getElementById('sRes').scrollTop={y}"); await pg.wait_for_timeout(1100); await pg.screenshot(path=T+f'rtn_9_res{i}{TAG}.png'); i+=1
        if FULL:
            await pg.click('#payBtn'); await pg.wait_for_timeout(700); await pg.screenshot(path=T+f'rtn_10_pay{TAG}.png')
            await pg.click('.obp [data-agree]'); await pg.click('.obp [data-pay]'); await pg.wait_for_timeout(3600)
            await pg.screenshot(path=T+f'rtn_11_prem0{TAG}.png')
            top=await pg.evaluate("document.getElementById('sRes').scrollTop"); h=await pg.evaluate("document.getElementById('sRes').scrollHeight")
            y=top; i=1
            while y<h-860 and i<10:
                y+=760; await pg.evaluate(f"document.getElementById('sRes').scrollTop={y}"); await pg.wait_for_timeout(500); await pg.screenshot(path=T+f'rtn_11_prem{i}{TAG}.png'); i+=1
            await pg.click('#shareBtn'); await pg.wait_for_timeout(900); await pg.screenshot(path=T+f'rtn_12_share{TAG}.png')
        bad=await pg.evaluate(r"""()=>{ const t=document.querySelector('.stage').innerText; const m=t.match(/[?!…？！]|[\u3400-\u9FFF]|[\u{1F300}-\u{1FAFF}]/gu); return m?[...new Set(m)].join(' ')+' :: '+t.slice(Math.max(0,t.search(/[?!…？！\u3400-\u9FFF]/u)-40),t.search(/[?!…？！\u3400-\u9FFF]/u)+20):'clean'; }""")
        print('COPY',bad)
        info=await pg.evaluate("({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,rw:document.getElementById('sRes').scrollWidth,rcw:document.getElementById('sRes').clientWidth,arch:(JSON.parse(localStorage.getItem('obArch')||'[]')[0]||{}).menu})")
        print('INFO',info); print('ERR',errs)
        await b.close()
asyncio.run(main())
