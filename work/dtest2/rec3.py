import asyncio,time,json,base64,os
from playwright.async_api import async_playwright
FONT_CSS="""@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-400.woff2');font-weight:400}@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-700.woff2');font-weight:700}@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-900.woff2');font-weight:900}"""
OUT='../ad/sc2'; os.makedirs(OUT,exist_ok=True)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    ctx=await b.new_context(viewport={'width':414,'height':800},device_scale_factor=2)
    pg=await ctx.new_page(); cdp=await ctx.new_cdp_session(pg); frames=[]; marks={}
    def on_frame(e):
      frames.append((e['metadata']['timestamp'],e['data'])); asyncio.ensure_future(cdp.send('Page.screencastFrameAck',{'sessionId':e['sessionId']}))
    cdp.on('Page.screencastFrame',on_frame)
    def mark(k): marks[k]=time.time()
    await pg.goto('http://localhost:8766/gunghap.html'); await pg.add_style_tag(content=FONT_CSS); await pg.wait_for_timeout(1200)
    await cdp.send('Page.startScreencast',{'format':'jpeg','quality':88,'maxWidth':828,'maxHeight':1600,'everyNthFrame':1})
    await pg.wait_for_timeout(600); mark('start')
    await pg.evaluate("document.getElementById('sIn').scrollTo({top:330,behavior:'smooth'})"); await pg.wait_for_timeout(700)
    await pg.type('#wA [data-k=n]','김은주',delay=120); await pg.select_option('#wA [data-k=h]','6')
    await pg.evaluate("document.getElementById('sIn').scrollTo({top:720,behavior:'smooth'})"); await pg.wait_for_timeout(600)
    await pg.type('#wB [data-k=n]','이지훈',delay=120); await pg.click('#wB .seg[data-k=g] button[data-v=m]')
    await pg.select_option('#wB [data-k=y]','1994'); await pg.select_option('#wB [data-k=m]','1'); await pg.select_option('#wB [data-k=d]','3'); await pg.wait_for_timeout(400)
    mark('go'); await pg.click('#goBtn')
    await pg.wait_for_function("document.getElementById('sRs').classList.contains('on')",timeout=20000); mark('res')
    await pg.wait_for_timeout(2600); mark('scroll')
    await pg.evaluate("document.getElementById('sRs').scrollTo({top:430,behavior:'smooth'})"); await pg.wait_for_timeout(2400); mark('end')
    await cdp.send('Page.stopScreencast'); await pg.wait_for_timeout(300)
    idx=[]
    for i,(ts,d) in enumerate(frames):
      fn=f'{OUT}/{i:05d}.jpg'; open(fn,'wb').write(base64.b64decode(d)); idx.append([fn,ts])
    json.dump({'frames':idx,'marks':marks},open(f'{OUT}/index.json','w'))
    print(len(frames), {k:round(v-frames[0][0],2) for k,v in marks.items()})
    await b.close()
asyncio.run(main())
