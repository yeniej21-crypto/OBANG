import asyncio, subprocess, time
srv=subprocess.Popen(['python3','-m','http.server','8816','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl']); pg=await b.new_page(viewport={"width":1280,"height":900})
        await pg.goto('http://localhost:8816/book.html'); await pg.wait_for_timeout(800)
        # 웹m 대체로 영상 위치 확인: video 요소 대신 poster 비교용 이미지 삽입
        await pg.evaluate("go(8,false)"); await pg.wait_for_timeout(1500); await pg.screenshot(path='bpc8.png')
        print(await pg.evaluate("getComputedStyle(document.querySelectorAll('.leaf')[8].querySelector('video')).objectPosition"))
        await b.close()
asyncio.run(main()); srv.terminate()
