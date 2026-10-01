import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8798','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        for chip,q in [(None,'지금 이직해도 될까?'),('love','이번 달 지출 괜찮을까?'),(None,''),(None,'그 사람이 먼저 연락할까?'),('work',''),(None,'회사 남을까 아니면 대학원 갈까?'),('love','그 사람이랑 잘 될까?')]:
            pg=await b.new_page(viewport={"width":390,"height":844}); pg.on("pageerror",lambda e: errs.append(str(e)))
            await pg.goto('http://localhost:8798/tarot.html#re'); await pg.wait_for_timeout(800)
            if chip: await pg.click(f'.chip[data-k="{chip}"]')
            await pg.fill('#qin',q); await pg.dispatch_event('#qin','input')
            hint=await pg.inner_text('#qhint'); sel=await pg.evaluate("document.querySelector('.chip.on')?.textContent")
            await pg.click('#go1'); await pg.wait_for_timeout(600)
            print(chip,'|',q,'| chip:',sel,'| hint:',hint,'| POS:',await pg.evaluate("window._tS"))
            await pg.close()
        print('errs',errs); await b.close()
asyncio.run(main()); srv.terminate()
