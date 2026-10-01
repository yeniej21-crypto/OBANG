import asyncio,time,json
from playwright.async_api import async_playwright
FONT_CSS="""@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-400.woff2');font-weight:400}@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-700.woff2');font-weight:700}@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-900.woff2');font-weight:900}"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    ctx=await b.new_context(viewport={'width':414,'height':800},device_scale_factor=2,record_video_dir='../ad/rec',record_video_size={'width':828,'height':1600})
    pg=await ctx.new_page(); t0=time.time(); marks={}
    def mark(k): marks[k]=round(time.time()-t0,2)
    await pg.goto('http://localhost:8766/dohwa.html'); await pg.add_style_tag(content=FONT_CSS); await pg.wait_for_timeout(1500)
    mark('splash'); await pg.click('#startBtn')
    await pg.wait_for_selector('#nm',timeout=20000); mark('nameAsk')
    await pg.type('#nm','김은주',delay=180); await pg.click('#nmGo'); mark('nameSent')
    await pg.wait_for_selector('.chip',timeout=20000); mark('chips'); await pg.wait_for_timeout(900); await pg.click('.chip.fill'); mark('chipClick')
    await pg.wait_for_selector('#dGo',timeout=20000); mark('date'); await pg.wait_for_timeout(700); await pg.click('#dGo')
    await pg.wait_for_selector('#hGo',timeout=20000); mark('hour'); await pg.wait_for_timeout(500); await pg.click('.hgrid button[data-i="6"]'); await pg.wait_for_timeout(500); await pg.click('#hGo'); mark('hourSent')
    await pg.wait_for_function("stage.classList.contains('vid')",timeout=30000); mark('vid')
    await pg.wait_for_function("stage.classList.contains('load')",timeout=40000); mark('load')
    await pg.wait_for_function("stage.classList.contains('res')",timeout=40000); mark('res')
    await pg.wait_for_timeout(4000); mark('end')
    await ctx.close(); await b.close()
    print(json.dumps(marks))
asyncio.run(main())
