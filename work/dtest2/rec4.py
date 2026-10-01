import asyncio,time,json,base64,os
from playwright.async_api import async_playwright
FONT_CSS="""@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-400.woff2');font-weight:400}@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-700.woff2');font-weight:700}@font-face{font-family:'Noto Sans KR';src:url('/fonts/nsk-900.woff2');font-weight:900}"""
OUT='../ad/sc3'; os.makedirs(OUT,exist_ok=True)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    ctx=await b.new_context(viewport={'width':414,'height':800},device_scale_factor=2)
    pg=await ctx.new_page(); cdp=await ctx.new_cdp_session(pg); frames=[]; marks={}
    def on_frame(e):
      frames.append((e['metadata']['timestamp'],e['data'])); asyncio.ensure_future(cdp.send('Page.screencastFrameAck',{'sessionId':e['sessionId']}))
    cdp.on('Page.screencastFrame',on_frame)
    await pg.goto('http://localhost:8766/dohwa.html'); await pg.add_style_tag(content=FONT_CSS); await pg.wait_for_timeout(800)
    await pg.evaluate("S.name='김은주';S.nick='은주';S.date={y:1996,m:5,d:14,cal:'양력'};S.hour=6;R=saju(1996,5,14,6,'양력');document.getElementById('splash').classList.add('off');buildLetter();document.getElementById('letter').classList.add('on');document.getElementById('letter').scrollTop=380;")
    await pg.wait_for_timeout(900)
    await cdp.send('Page.startScreencast',{'format':'jpeg','quality':88,'maxWidth':828,'maxHeight':1600,'everyNthFrame':1})
    await pg.wait_for_timeout(400); marks['s']=time.time()
    await pg.evaluate("document.getElementById('letter').scrollTo({top:520,behavior:'smooth'})"); await pg.wait_for_timeout(3200); marks['e']=time.time()
    await cdp.send('Page.stopScreencast'); await pg.wait_for_timeout(200)
    idx=[]
    for i,(ts,d) in enumerate(frames):
      fn=f'{OUT}/{i:05d}.jpg'; open(fn,'wb').write(base64.b64decode(d)); idx.append([fn,ts])
    json.dump({'frames':idx,'marks':marks},open(f'{OUT}/index.json','w')); print(len(frames))
    await b.close()
asyncio.run(main())
