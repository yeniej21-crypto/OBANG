# 할매 신년운세(섣달 그믐밤) 흐름 스크린샷. python3 hm_flow.py [stub|none] [prefix]
import asyncio, sys, math, os, re
from playwright.async_api import async_playwright
SP=os.path.dirname(os.path.abspath(__file__)); STUB=SP+'/t/hm_stub'
MODE=sys.argv[1] if len(sys.argv)>1 else 'stub'; PRE=sys.argv[2] if len(sys.argv)>2 else 'hm_'
MONTHS=['047f0acf','d6abc742','deb7c371','d4a96c84','9c39c652','52e2c98f','e84aa609','ded33e88','4ad4a1b9','690c0bf1','e4f41cdd','1c65a592']
def stub_for(url):
    for i,k in enumerate(MONTHS):
        if k in url: return STUB+f'/m{i+1}.webp'
    if '3eb5368c' in url: return STUB+'/tray.webp'
    return SP+'/proto/img/halmae.jpg'
async def shot(pg,n): await pg.screenshot(path=f'{SP}/t/{PRE}{n}.png')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg=await b.new_page(viewport={'width':400,'height':860},device_scale_factor=1.5)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append('console:'+m.text) if m.type=='error' and 'Failed to load' not in m.text and 'net::' not in m.text else None)
        async def route(r):
            u=r.request.url
            if MODE=='stub':
                f=stub_for(u); await r.fulfill(path=f,content_type='image/webp' if f.endswith('webp') else 'image/jpeg')
            else: await r.abort()
        await pg.route(re.compile(r'.*cloudfront\.net.*'),route)
        await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.evaluate("sessionStorage.clear()")
        await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate("document.querySelectorAll('.mi .x').forEach(b=>b.click())"); await pg.wait_for_timeout(3600)
        await shot(pg,'01_room')
        await pg.click('#nxSit'); await pg.wait_for_timeout(1500); await shot(pg,'02_name')
        await pg.fill('#nm','김은주'); await pg.click('#nxName'); await pg.wait_for_timeout(2800); await shot(pg,'03_gender')
        await pg.click('#gSeg button[data-v="f"]'); await pg.wait_for_timeout(1700)
        await pg.click('#cSeg button[data-v="l"]'); await pg.select_option('#by','1993'); await pg.select_option('#bm','3'); await pg.wait_for_timeout(200)
        await pg.select_option('#bd','10'); await shot(pg,'04_birth')
        await pg.click('#nxBirth'); await pg.wait_for_timeout(3600); await pg.select_option('#bh','4'); await shot(pg,'05_hour')
        await pg.click('#goBtn'); await pg.wait_for_timeout(2600); await shot(pg,'06_rice')
        await pg.wait_for_timeout(3600); await shot(pg,'07_rice_take')
        await pg.click('#takeBtn'); await pg.wait_for_timeout(1500); await shot(pg,'08_pour')
        await pg.wait_for_timeout(1800)
        bb=await pg.evaluate("(()=>{const r=document.getElementById('rc').getBoundingClientRect();return [r.left,r.top,r.width]})()")
        cx,cy,w=bb[0]+bb[2]/2,bb[1]+bb[2]/2,bb[2]
        await pg.mouse.move(cx+w*.25,cy); await pg.mouse.down()
        for i in range(1,80):
            a=i/80*math.pi*2*1.6; r=w*(.12+.16*(i%20)/20)
            await pg.mouse.move(cx+math.cos(a)*r,cy+math.sin(a)*r,steps=2)
        await shot(pg,'09_swirl')
        for i in range(80,170):
            a=i/80*math.pi*2*1.6; r=w*(.12+.16*(i%20)/20)
            await pg.mouse.move(cx+math.cos(a)*r,cy+math.sin(a)*r,steps=2)
        await pg.mouse.up(); await pg.wait_for_timeout(1400); await shot(pg,'10_forming')
        await pg.wait_for_timeout(3400); await shot(pg,'11_rice_result')
        print('rice',await pg.evaluate("[RICE.mode,RICE.prog,document.getElementById('rResT').textContent,CUR.riceEl]"))
        await pg.click('#toScroll'); await pg.wait_for_timeout(900); await shot(pg,'12_scroll_rolled')
        await pg.wait_for_timeout(5200); await shot(pg,'13_scroll_open')
        box=await pg.evaluate("(()=>{const r=document.getElementById('mwin').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()")
        await pg.mouse.move(box[0]+box[2]*.8,box[1]+box[3]*.5); await pg.mouse.down()
        for i in range(10): await pg.mouse.move(box[0]+box[2]*(.8-i*.05),box[1]+box[3]*.5,steps=1)
        await pg.mouse.up(); await pg.wait_for_timeout(1200); await shot(pg,'14_scroll_drag')
        best=await pg.evaluate("CUR.best");
        await pg.evaluate(f"msGo({best[0]})"); await pg.wait_for_timeout(1200); await shot(pg,'15_scroll_best')
        await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(900)
        print('scroll idx',await pg.evaluate("MS.i"), 'docW',await pg.evaluate("[document.documentElement.scrollWidth,innerWidth,document.body.scrollWidth]"))
        await pg.click('#toRep'); await pg.wait_for_timeout(1500)
        H=await pg.evaluate("document.getElementById('sRep').scrollHeight"); y=0; k=0
        while y<H and k<14:
            await pg.evaluate(f"document.getElementById('sRep').scrollTop={y}"); await pg.wait_for_timeout(700); await shot(pg,f'16_rep{k:02d}'); y+=780; k+=1
        await pg.evaluate("document.getElementById('dawn').scrollIntoView()"); await pg.wait_for_timeout(900); await shot(pg,'17_dawn')
        await pg.click('#pouchBtn'); await pg.wait_for_timeout(800); await shot(pg,'18_paysheet')
        await pg.evaluate("(()=>{const a=document.querySelector('.obp [data-agree]'); if(a){a.click();} const g=document.querySelector('.obp [data-pay]'); if(g){g.disabled=false; g.click();}})()")
        await pg.wait_for_timeout(3500); await shot(pg,'19_paid')
        await pg.evaluate("document.getElementById('dawn').scrollIntoView()"); await pg.wait_for_timeout(900); await shot(pg,'20_dawn_paid')
        top=await pg.evaluate("document.getElementById('prem').offsetTop"); H=await pg.evaluate("document.getElementById('sRep').scrollHeight"); y=top; k=0
        while y<H and k<6:
            await pg.evaluate(f"document.getElementById('sRep').scrollTop={y}"); await pg.wait_for_timeout(600); await shot(pg,f'21_prem{k}'); y+=800; k+=1
        await pg.evaluate("document.querySelector('#askBtn').scrollIntoView()"); await pg.click('#askBtn'); await pg.wait_for_timeout(1200); await shot(pg,'22_ask')
        txt=await pg.evaluate("document.getElementById('stage').innerText")
        bad=[c for c in '?!…' if c in txt]
        print('bad chars',bad, [txt[max(0,txt.find(c)-30):txt.find(c)+5] for c in bad])
        print('ERR',errs[:8]); await b.close()
asyncio.run(main())
