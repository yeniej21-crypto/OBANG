import asyncio,time,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':390,'height':844}); pg=await ctx.new_page()
        cdp=await ctx.new_cdp_session(pg); await cdp.send('Network.enable')
        await cdp.send('Network.emulateNetworkConditions',{'offline':False,'latency':80,'downloadThroughput':1250000,'uploadThroughput':400000})
        reqs={}; t0=time.time()
        cdp.on('Network.requestWillBeSent',lambda e:reqs.setdefault(e['requestId'],{'url':e['request']['url'].split('8767/')[-1][:60],'s':time.time()-t0}))
        def fin(e):
            r=reqs.get(e['requestId']);
            if r: r['f']=time.time()-t0; r['n']=e.get('encodedDataLength',0)
        cdp.on('Network.loadingFinished',fin)
        await pg.goto('http://localhost:8767/',wait_until='commit')
        ready=None
        for i in range(120):
            await asyncio.sleep(.1)
            rs=await pg.evaluate("(()=>{const v=document.getElementById('opTake');return v?v.readyState:-1})()")
            if rs>=4 and ready is None: ready=time.time()-t0; break
        print('opTake readyState4 at',ready)
        for r in sorted(reqs.values(),key=lambda r:r['s'])[:45]:
            print(f"{r['s']:5.2f} -> {r.get('f',-1):5.2f}  {r.get('n',0)/1024:7.0f}KB  {r['url']}")
        await b.close()
asyncio.run(main())
