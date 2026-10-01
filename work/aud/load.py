import asyncio, subprocess, time, json, sys
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8830','-d','export/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8830/'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for P in ['index.html','today.html','sinnyeon.html','dohwa.html','book.html','free.html']:
      ctx=await b.new_context(viewport={'width':390,'height':844}); pg=await ctx.new_page(); res=[]
      async def onresp(r):
        try:
          if U in r.url:
            body=await r.body(); res.append((r.url.replace(U,''),len(body),r.request.resource_type))
        except Exception: pass
      pg.on('response',lambda r: asyncio.ensure_future(onresp(r)))
      t0=time.time(); await pg.goto(U+P,wait_until='load'); tl=time.time()-t0
      await pg.wait_for_timeout(3000)
      tot=sum(x[1] for x in res); big=sorted(res,key=lambda x:-x[1])[:6]
      print(P, f'{tot/1e6:.1f}MB', len(res),'req', [ (n,round(s/1e6,2)) for n,s,_ in big])
      await ctx.close()
    await b.close()
asyncio.run(main()); srv.terminate()
