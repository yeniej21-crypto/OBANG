import asyncio,time,json,base64,os
from playwright.async_api import async_playwright
FONT_CSS="""@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-400.woff2');font-weight:400}@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-700.woff2');font-weight:700}@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-900.woff2');font-weight:900}"""
OUT='../ad/sc'; os.makedirs(OUT,exist_ok=True)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    ctx=await b.new_context(viewport={'width':414,'height':800},device_scale_factor=2)
    pg=await ctx.new_page(); cdp=await ctx.new_cdp_session(pg); frames=[]; marks={}
    def on_frame(e):
      frames.append((e['metadata']['timestamp'],e['data'])); asyncio.ensure_future(cdp.send('Page.screencastFrameAck',{'sessionId':e['sessionId']}))
    cdp.on('Page.screencastFrame',on_frame)
    def mark(k): marks[k]=time.time()
    await pg.goto('http://localhost:8766/dohwa.html'); await pg.add_style_tag(content=FONT_CSS); await pg.wait_for_timeout(1200)
    await cdp.send('Page.startScreencast',{'format':'jpeg','quality':88,'maxWidth':828,'maxHeight':1600,'everyNthFrame':1})
    await pg.click('#startBtn')
    await pg.wait_for_selector('#nm',timeout=20000); mark('nameAsk')
    await pg.type('#nm','김은주',delay=160); await pg.click('#nmGo'); mark('nameSent')
    await pg.wait_for_selector('.chip',timeout=20000); mark('chips'); await pg.wait_for_timeout(700); await pg.click('.chip.fill'); mark('chipClick')
    await pg.wait_for_selector('#dGo',timeout=20000); await pg.wait_for_timeout(500); await pg.click('#dGo')
    await pg.wait_for_selector('#hGo',timeout=20000); await pg.wait_for_timeout(400); await pg.click('.hgrid button[data-i="6"]'); await pg.wait_for_timeout(400); await pg.click('#hGo')
    await pg.wait_for_function("stage.classList.contains('load')",timeout=60000); mark('load')
    await pg.wait_for_function("stage.classList.contains('res')",timeout=40000); mark('res')
    await pg.wait_for_timeout(3500); mark('end')
    await cdp.send('Page.stopScreencast'); await pg.wait_for_timeout(300)
    idx=[]
    for i,(ts,d) in enumerate(frames):
      fn=f'{OUT}/{i:05d}.jpg'; open(fn,'wb').write(base64.b64decode(d)); idx.append([fn,ts])
    json.dump({'frames':idx,'marks':marks},open(f'{OUT}/index.json','w'))
    print(len(frames), {k:round(v-frames[0][0],2) for k,v in marks.items()})
    await b.close()
asyncio.run(main())
