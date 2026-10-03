import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context(viewport={'width':390,'height':844})).new_page()
        await pg.goto('http://localhost:8766/sinnyeon_v2.html'); await pg.wait_for_timeout(1500)
        r=await pg.evaluate("""()=>{ const pr=document.getElementById('prem'); pr.hidden=false; document.getElementById('sRep').classList.add('on');
          pr.innerHTML='<div class="sec letter"><h3>할매의 편지</h3><div id="ltx"><p>은주야.</p><p>5월엔 바람이 가장 세다. 그때는 아무것도 정하지 말고 버티기만 하거라. 대신 8월부터 10월까지는 망설이지 말거라. 그 석 달은 네 목소리에 힘이 실리고, 사람이 모이고, 문서가 네 편이 된다.</p></div></div>';
          return new Promise(res=>setTimeout(()=>{ const b=document.querySelector('#ltx b.mo'); const cs=b&&getComputedStyle(b); res([document.getElementById('ltx').innerHTML, cs&&[cs.display,cs.width,cs.position,cs.float,cs.borderBottom, cs.writingMode]]); },400)); }""")
        print(r)
        await pg.evaluate("document.getElementById('ltx').scrollIntoView()"); await pg.wait_for_timeout(300); await pg.screenshot(path='/tmp/ltx.png'); await b.close()
asyncio.run(main())
