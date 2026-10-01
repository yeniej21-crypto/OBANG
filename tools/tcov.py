import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8817','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader']); pg=await b.new_page(viewport={"width":390,"height":844})
        await pg.goto('http://localhost:8817/book.html'); await pg.wait_for_timeout(3000); await pg.screenshot(path='cov.png')
        print(await pg.evaluate("(()=>{const i=document.querySelector('.cfg img');const r=i.getBoundingClientRect();return [i.naturalWidth,i.naturalHeight,r.width,r.height,r.top,getComputedStyle(document.querySelector('.cfg')).opacity]})()"))
        await b.close()
asyncio.run(main()); srv.terminate()
