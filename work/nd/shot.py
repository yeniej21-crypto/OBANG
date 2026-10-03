import asyncio,sys,json
from playwright.async_api import async_playwright
tag=sys.argv[1] if len(sys.argv)>1 else 'a'
only=sys.argv[2] if len(sys.argv)>2 else None
SMALL="""(()=>{const out=[];const root=document.getElementById('sRs');const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const t=n.textContent.trim();if(!t)continue;const el=n.parentElement;if(!el||el.closest('[hidden]'))continue;const r=el.getBoundingClientRect();if(!r.width)continue;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none')continue;let fs=parseFloat(cs.fontSize);
 const svg=el.closest('svg');if(svg){const vb=svg.viewBox.baseVal;if(vb&&vb.width){fs=fs*svg.getBoundingClientRect().width/vb.width;}}
 if(fs<12.95)out.push([Math.round(fs*10)/10,t.slice(0,30),el.className&&el.className.baseVal!==undefined?el.className.baseVal:el.className]);}return out;})()"""
async def run(b,mode,st,paid):
    pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(f'http://localhost:8766/love2.html?m={mode}' if mode=='next' else 'http://localhost:8766/love2.html'); await pg.wait_for_timeout(900)
    js="document.getElementById('nm').value='은주';"
    if mode=='next': js+=f"document.querySelector('#sSeg [data-v={st}]').click();"
    else: js+="document.getElementById('py').value='1994'; document.getElementById('pm').value='3'; document.getElementById('pd').value='8';"
    js+="document.getElementById('goBtn').click()"
    await pg.evaluate(js); await pg.wait_for_timeout(2600)
    if paid:
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(500)
        await pg.evaluate("(()=>{const a=document.querySelector('.obp [data-agree]'); a.checked=true; a.dispatchEvent(new Event('change')); document.querySelector('.obp [data-pay]').click();})()"); await pg.wait_for_timeout(4200)
    await pg.evaluate("document.querySelectorAll('.lb-anim').forEach(e=>e.classList.add('in'))")
    small=await pg.evaluate(SMALL)
    h=await pg.evaluate("document.getElementById('sRs').scrollHeight")
    # top view at real viewport
    await pg.evaluate("document.getElementById('sRs').scrollTop=0"); await pg.wait_for_timeout(400)
    await pg.screenshot(path=f'{tag}_{mode}_{st}{"_p" if paid else ""}_top.png')
    await pg.set_viewport_size({'width':390,'height':min(h,16000)}); await pg.wait_for_timeout(700)
    await pg.screenshot(path=f'{tag}_{mode}_{st}{"_p" if paid else ""}.png')
    print(mode,st,paid,'h',h,'ERR',errs[:3]); print(' small:',json.dumps(small[:40],ensure_ascii=False))
    await pg.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        jobs=[('next','solo',False),('next','some',False),('next','end',False),('next','solo',True),('re','x',False),('re','x',True)]
        for j in jobs:
            if only and only not in '%s_%s_%s'%j: continue
            await run(b,*j)
        await b.close()
asyncio.run(main())
