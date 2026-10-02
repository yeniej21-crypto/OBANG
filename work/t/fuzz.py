import asyncio,random
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); random.seed(3)
        for mode in ['next','re']:
            pg=await b.new_page(viewport={'width':400,'height':860}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto(f'http://localhost:8766/love2.html?m={mode}'); await pg.wait_for_timeout(600)
            for k in range(14):
                y=random.randint(1960,2008); m=random.randint(1,12); d=random.randint(1,28); g=random.choice(['f','m']); st=random.choice(['solo','some','end'])
                pt=random.random()<.6; xy=random.choice([2026,2025,2023]); xm=random.randint(1,12)
                js=f"""document.querySelector('#gSeg [data-v="{g}"]').click(); document.getElementById('by').value={y}; document.getElementById('bm').value={m}; document.getElementById('bd').value={d};"""
                if mode=='next': js+=f"""document.querySelector('#sSeg [data-v="{st}"]').click();"""
                else: js+=(f"document.getElementById('py').value='{random.randint(1970,2005)}'; document.getElementById('py').onchange(); document.getElementById('pm').value='{random.randint(1,12)}'; document.getElementById('pd').value='{random.randint(1,28)}';" if pt else "document.getElementById('py').value='x';")+f"document.getElementById('xy').value='{xy}'; document.getElementById('xm').value='{xm}';"
                await pg.evaluate(js+"document.getElementById('goBtn').click()"); await pg.wait_for_timeout(2200)
                r=await pg.evaluate("(()=>{const r=document.getElementById('sRs'); const t=r.innerText; return {on:r.classList.contains('on'), han:(t.match(/[\\u3400-\\u9fff]/g)||[]).join(''), bad:(t.match(/[?!…]/g)||[]).join(''), sw:r.scrollWidth, n:document.querySelectorAll('#body .lb-sec').length, wp:document.querySelectorAll('.lb-tl li').length, und:(t.match(/undefined|NaN|null/g)||[]).length}})()")
                print(mode,y,m,d,g,st if mode=='next' else (pt,xy,xm),r)
                await pg.evaluate("document.getElementById('again').click()"); await pg.wait_for_timeout(400)
            print(mode,'ERRS',errs); await pg.close()
        await b.close()
asyncio.run(main())
