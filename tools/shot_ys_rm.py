import asyncio
from playwright.async_api import async_playwright
T='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':360,'height':740},device_scale_factor=2,reduced_motion='reduce')
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("localStorage.setItem('obMe',JSON.stringify({cal:'l',y:1990,m:2,d:10,g:'m',h:5}))")
        await pg.goto('http://localhost:8766/yeonseo.html'); await pg.wait_for_timeout(1000)
        await pg.screenshot(path=T+'ys_rm_0.png')
        await pg.click('#startMute'); await pg.wait_for_selector('#kGo',state='visible',timeout=20000); await pg.wait_for_timeout(500); await pg.screenshot(path=T+'ys_rm_1_prefill.png')
        await pg.click('#kGo'); await pg.wait_for_selector('.chips button',state='visible',timeout=20000); await pg.wait_for_timeout(400); await pg.screenshot(path=T+'ys_rm_2_gender.png')
        await pg.click('.chips button >> nth=1'); await pg.wait_for_timeout(1500); await pg.wait_for_selector('.chips button >> nth=3',state='visible',timeout=20000)
        await pg.click('.chips button >> nth=1')
        await pg.wait_for_selector('#dBt.on',timeout=20000); await pg.wait_for_timeout(300); await pg.screenshot(path=T+'ys_rm_3_lit.png')
        await pg.click('#dGo'); await pg.wait_for_selector('#sSeal.on',timeout=5000); await pg.wait_for_timeout(500); await pg.screenshot(path=T+'ys_rm_4_seal.png')
        await pg.focus('#seal'); await pg.keyboard.press('Enter')
        await pg.wait_for_selector('#sLet.on',timeout=8000); await pg.wait_for_timeout(1200); await pg.screenshot(path=T+'ys_rm_5_letter.png')
        await pg.evaluate("document.getElementById('sLet').scrollTop=700"); await pg.wait_for_timeout(600); await pg.screenshot(path=T+'ys_rm_6.png')
        info=await pg.evaluate("({sw:document.documentElement.scrollWidth, lw:document.getElementById('sLet').scrollWidth, cw:document.getElementById('sLet').clientWidth, arch:JSON.parse(localStorage.getItem('obArch')||'[]')[0].h, me:localStorage.getItem('obMe')})")
        print(info, errs); await b.close()
asyncio.run(main())
