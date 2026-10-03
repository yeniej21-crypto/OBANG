import asyncio
from playwright.async_api import async_playwright
SP='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1000)
        await pg.evaluate("()=>{ document.getElementById('splash').classList.add('off'); S={name:'하늘',nick:'하늘',bro:false,date:{y:1990,m:3,d:3,cal:'양력'},hour:-1}; loadingSeq(); }")
        await pg.wait_for_timeout(9500)
        st=await pg.evaluate("document.getElementById('stage').className")
        # mid-sequence re-render
        await pg.wait_for_timeout(2500); await pg.evaluate("showResult()"); await pg.wait_for_timeout(300); await pg.evaluate("showResult()")
        await pg.wait_for_timeout(4000)
        n1=await pg.evaluate("document.querySelectorAll('#th .row').length"); days=await pg.evaluate("document.querySelectorAll('#th .day').length")
        skipOn=await pg.evaluate("document.getElementById('skipBtn').classList.contains('on')")
        await pg.click('#skipBtn'); await pg.wait_for_timeout(800)
        n2=await pg.evaluate("document.querySelectorAll('#th .row').length"); typ=await pg.evaluate("document.querySelectorAll('#th .typing').length"); qr=await pg.evaluate("document.querySelectorAll('#th .qr').length")
        vids=await pg.evaluate("[...document.querySelectorAll('#result video')].map(v=>[v.dataset.src?v.dataset.src.slice(-12):'',!!v.getAttribute('src'),v.muted,v.loop])")
        await pg.click('#replyBtn'); await pg.wait_for_timeout(800)
        ak=await pg.evaluate("[!!document.querySelector('.ak.on'),[...document.querySelectorAll('.ak-sug button')].map(b=>b.textContent)]")
        await pg.screenshot(path=f'{SP}/t/dsc_ask.png')
        print('stage',st,'rows mid',n1,'days',days,'skipOn',skipOn,'after skip',n2,'typing',typ,'qr',qr,'vids',vids,'ask',ak,'ERR',errs[:5])
        await b.close()
asyncio.run(main())
