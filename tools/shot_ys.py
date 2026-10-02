import asyncio, sys, json
from playwright.async_api import async_playwright
T='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/'
STORED = len(sys.argv)>1 and sys.argv[1]=='stored'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':400,'height':860},device_scale_factor=2,has_touch=False)
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and errs.append(m.text))
        if STORED:
            await pg.add_init_script("localStorage.setItem('obMe',JSON.stringify({cal:'s',y:1994,m:7,d:21,g:'f',h:null}))")
        await pg.goto('http://localhost:8766/yeonseo.html'); await pg.wait_for_timeout(1800)
        await pg.screenshot(path=T+'ys_0_intro.png')
        await pg.click('#startMute'); await pg.wait_for_timeout(700); await pg.screenshot(path=T+'ys_0b_doors.png')
        await pg.wait_for_selector('#kGo',state='visible',timeout=20000); await pg.wait_for_timeout(600); await pg.screenshot(path=T+'ys_1_birth.png')
        if not STORED:
            await pg.select_option('#kY','1994'); await pg.select_option('#kM','7'); await pg.select_option('#kD','21')
        await pg.click('#kGo')
        await pg.wait_for_selector('.chips button',state='visible',timeout=20000); await pg.wait_for_timeout(600); await pg.screenshot(path=T+'ys_2_gender.png')
        await pg.click('.chips button >> nth=0')
        await pg.wait_for_timeout(1500); await pg.wait_for_selector('.chips button >> nth=3',state='visible',timeout=20000); await pg.wait_for_timeout(600); await pg.screenshot(path=T+'ys_3_sit.png')
        await pg.click('.chips button >> nth=0')
        await pg.wait_for_selector('#sDrw.on',timeout=20000); await pg.wait_for_timeout(2000); await pg.screenshot(path=T+'ys_4_sweep.png'); await pg.wait_for_timeout(1200); await pg.screenshot(path=T+'ys_4b_sweep.png')
        await pg.wait_for_selector('#dBt.on',timeout=20000); await pg.wait_for_timeout(500); await pg.screenshot(path=T+'ys_5_lit.png')
        await pg.click('.cell.tg'); await pg.wait_for_timeout(900); await pg.screenshot(path=T+'ys_6_drawer.png')
        await pg.wait_for_timeout(700); await pg.screenshot(path=T+'ys_6b_fly.png')
        await pg.wait_for_timeout(1200); await pg.screenshot(path=T+'ys_7_seal.png')
        box=await pg.locator('#seal').bounding_box(); await pg.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2); await pg.mouse.down()
        await pg.wait_for_timeout(800); await pg.screenshot(path=T+'ys_8_hold.png')
        await pg.wait_for_selector('#seal.crk',timeout=5000); await pg.wait_for_timeout(120); await pg.screenshot(path=T+'ys_9a_crack.png'); await pg.mouse.up()
        await pg.wait_for_timeout(450); await pg.screenshot(path=T+'ys_9b_fall.png')
        await pg.wait_for_timeout(650); await pg.screenshot(path=T+'ys_10a_flap.png')
        await pg.wait_for_timeout(700); await pg.screenshot(path=T+'ys_10b_rise.png')
        await pg.wait_for_selector('#sLet.on',timeout=20000); await pg.wait_for_timeout(500); await pg.screenshot(path=T+'ys_11a_folded.png')
        await pg.wait_for_timeout(800); await pg.screenshot(path=T+'ys_11b_unfold.png')
        await pg.wait_for_timeout(500); await pg.screenshot(path=T+'ys_11c_unfold.png')
        await pg.wait_for_timeout(2200); await pg.screenshot(path=T+'ys_12_letter.png')
        for i,y in enumerate([520,1000,1500,2000,2500,3000]):
            await pg.evaluate(f"document.getElementById('sLet').scrollTop={y}"); await pg.wait_for_timeout(1100); await pg.screenshot(path=T+f'ys_13_{i}.png')
        await pg.click('#thickBtn'); await pg.wait_for_timeout(300); await pg.screenshot(path=T+'ys_14_toast.png')
        await pg.click('#notiBtn'); await pg.wait_for_timeout(600); await pg.screenshot(path=T+'ys_15_noti.png')
        info=await pg.evaluate("({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth, lw:document.getElementById('sLet').scrollWidth})")
        print('INFO',info); print('ERR',errs)
        await b.close()
asyncio.run(main())
