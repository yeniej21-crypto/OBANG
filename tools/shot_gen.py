# 사용: python3 shot_gen.py page host_id scroller_id pre_js pay_js out_prefix [m]
import asyncio, sys
from playwright.async_api import async_playwright
page,host,scr,pre,pay,out=sys.argv[1:7]; mock=len(sys.argv)>7
MOCK=open('/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/mock2.js').read()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        if mock: await pg.add_init_script(MOCK)
        await pg.goto('http://localhost:8766/'+page); await pg.wait_for_timeout(1500)
        await pg.evaluate(pre); await pg.wait_for_timeout(5000)
        await pg.evaluate(pay); await pg.wait_for_timeout(2500)
        if mock:
            P=await pg.evaluate("window.__P||[]"); print('calls',len(P),[len(x) for x in P]); open(out+'_p0.txt','w').write(P[0] if P else ''); open(out+'_p1.txt','w').write(P[1] if len(P)>1 else '')
            t=await pg.evaluate(f"document.getElementById('{host}').innerText"); print('AI' in t, t[:700].replace('\n',' | '))
        else:
            top=await pg.evaluate(f"(()=>{{const h=document.getElementById('{host}'), s=document.getElementById('{scr}'); return h.getBoundingClientRect().top-s.getBoundingClientRect().top+s.scrollTop}})()"); hh=await pg.evaluate(f"document.getElementById('{host}').offsetHeight"); y=top-60; i=0
            while y<top+hh and i<8:
                await pg.evaluate(f"document.getElementById('{scr}').scrollTop={y}"); await pg.wait_for_timeout(250); await pg.screenshot(path=f'{out}{i}.png'); y+=820; i+=1
            print('n',i,hh)
        print('ERR',errs[:4]); await b.close()
asyncio.run(main())
