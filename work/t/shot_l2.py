import asyncio,sys
from playwright.async_api import async_playwright
S='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad'
TAG=sys.argv[1] if len(sys.argv)>1 else 'x'
MODES=sys.argv[2].split(',') if len(sys.argv)>2 else ['next','re']
async def full(pg,path):
    h=await pg.evaluate("document.getElementById('sRs').scrollHeight")
    await pg.set_viewport_size({'width':400,'height':min(h,16000)}); await pg.wait_for_timeout(1600)
    await pg.screenshot(path=path)
    await pg.set_viewport_size({'width':400,'height':860}); await pg.wait_for_timeout(200)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for mode in MODES:
          for pt in ([True,False] if mode=='re' else [True]):
            pg=await b.new_page(viewport={'width':400,'height':860},device_scale_factor=1)
            errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append('C:'+m.text) if m.type=='error' else None)
            await pg.goto(f'http://localhost:8766/love2.html?m={mode}'); await pg.wait_for_timeout(900)
            js="document.getElementById('nm').value='은주';"
            if mode=='re' and pt: js+="document.getElementById('py').value='1994'; document.getElementById('py').onchange(); document.getElementById('pm').value='3'; document.getElementById('pd').value='8';"
            await pg.evaluate(js+"document.getElementById('goBtn').click()")
            await pg.wait_for_timeout(2800)
            suf=f'{mode}' + ('' if pt else '_nopt')
            chk=await pg.evaluate("(()=>{const r=document.getElementById('sRs'); const t=[...r.querySelectorAll('*')].filter(e=>!e.closest('#lprem')&&e.children.length===0).map(e=>e.textContent).join(' ')+' '+[...r.querySelectorAll('svg text')].map(e=>e.textContent).join(' '); return {han:(t.match(/[\\u3400-\\u9fff]/g)||[]).join(''), bad:(t.match(/[?!…]/g)||[]).join(''), sw:r.scrollWidth, cw:r.clientWidth}})()")
            print(mode,pt,'CHECK',chk)
            await full(pg,f'{S}/t/l2_{TAG}_{suf}_free.png')
            if pt:
                await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(600)
                await pg.screenshot(path=f'{S}/t/l2_{TAG}_{suf}_sheet.png')
                await pg.evaluate("(()=>{const a=document.querySelector('.obp [data-agree]'); a.checked=true; a.onchange(); document.querySelector('.obp [data-pay]').click();})()")
                await pg.wait_for_timeout(3500)
                await full(pg,f'{S}/t/l2_{TAG}_{suf}_paid.png')
            print(mode,pt,'ERR',errs[:5]); await pg.close()
        await b.close()
asyncio.run(main())
