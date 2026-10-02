import asyncio, sys, json
from playwright.async_api import async_playwright
S='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad'
# 사용: python3 t_og.py 이름 년 월 일 시(x) 성별 태그 [paid]
nm,y,m,d,h,g,tag=sys.argv[1:8]; paid=len(sys.argv)>8 and sys.argv[8]=='paid'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/obgh.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate(f"""()=>{{ if(!document.getElementById('form').hidden===false) document.getElementById('other').click();
          document.getElementById('nm').value='{nm}'; document.querySelector('#gSeg [data-v={g}]').click();
          const by=document.getElementById('by'); by.value='{y}'; by.onchange(); const bm=document.getElementById('bm'); bm.value='{m}'; bm.onchange();
          document.getElementById('bd').value='{d}'; document.getElementById('bh').value='{h}'; document.getElementById('goBtn').click(); }}""")
        await pg.wait_for_timeout(4600)
        if paid:
            await pg.evaluate("document.getElementById('pay').dataset.obpaid='1'; document.getElementById('pay').click()")
            await pg.wait_for_timeout(1500)
        hh=await pg.evaluate("document.getElementById('sOut').scrollHeight")
        await pg.set_viewport_size({'width':400,'height':hh}); await pg.wait_for_timeout(2600)
        await pg.evaluate("document.getElementById('sOut').scrollTop=0"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{S}/t/og_{tag}.png')
        info=await pg.evaluate("""()=>{ const s=document.getElementById('sOut'); const t=s.innerText; return {sw:document.documentElement.scrollWidth, ow:s.scrollWidth, cw:s.clientWidth, bad:(t.match(/[?!…]|undefined|NaN|null/g)||[]).slice(0,8), hanja:(t.match(/[\\u3400-\\u9fff]+/g)||[]).slice(0,8)}; }""")
        print(tag,hh,json.dumps(info,ensure_ascii=False),'ERR',errs[:4]); await b.close()
asyncio.run(main())
