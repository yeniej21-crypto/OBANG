# 연서당 영상판 점검: cloudfront 그림 · 영상을 로컬 대역으로 돌려 배치 확인(mock), 또는 막힌 그대로(block)
import asyncio, sys, os, re
from playwright.async_api import async_playwright
S='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad'; T=S+'/t/'; M=S+'/ysmock/'
MODE=sys.argv[1] if len(sys.argv)>1 else 'mock'
PFX=sys.argv[2] if len(sys.argv)>2 else 'ysa'
RMO=('rm' in sys.argv)
IMG={'ac4bb635':'hero','5c12ee04':'exterior','6138087b':'counter','5e44ea50':'drawers','8bd24999':'envelope','7f24a420':'folded','5a9b6a58':'paper','a785a586':'stamps','f62beca5':'seals','d143c0bb':'ending'}
VID={'afe7cc7d':'hero','9c19594f':'exterior','0a58af6b':'counter','2b6d6fc1':'drawers','af116ec2':'envelope','86d35ded':'envelope','dabccc7d':'folded','f7363840':'ending'}
FONT_CSS=''
for pkg,files in [('fontsource-nanum-pen-script-5.3.0',['400.css']),('fontsource-noto-serif-kr-5.3.0',['korean-500.css','korean-600.css','korean-700.css','korean-900.css','latin-700.css'])]:
    for f in files:
        css=open(f'{S}/tfont/{pkg}/package/{f}').read(); FONT_CSS+=css.replace('./files/',f'https://tfont.local/{pkg}/package/files/')
async def route_cf(route):
    u=route.request.url; k=re.search(r'([0-9a-f]{8})-[0-9a-f]{4}',u)
    k=k.group(1) if k else ''
    if u.split('?')[0].endswith('.mp4') and k in VID:
        await route.fulfill(path=M+VID[k]+'.webm',content_type='video/webm',headers={'Access-Control-Allow-Origin':'*'})
    elif k in IMG:
        await route.fulfill(path=M+IMG[k]+'.webp',content_type='image/webp',headers={'Access-Control-Allow-Origin':'*'})
    else: await route.abort()
async def route_font(route):
    await route.fulfill(body=FONT_CSS,content_type='text/css')
async def route_tf(route):
    p=route.request.url.replace('https://tfont.local/',S+'/tfont/')
    await route.fulfill(path=p,content_type='font/woff2',headers={'Access-Control-Allow-Origin':'*'})
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        ctx=await b.new_context(viewport={'width':400,'height':860},device_scale_factor=2,reduced_motion='reduce' if RMO else 'no-preference')
        await ctx.route('**/fonts.googleapis.com/**',route_font); await ctx.route('https://tfont.local/**',route_tf)
        if MODE=='mock': await ctx.route(re.compile(r'https://d(8j0ntlcm91z4|2ol7oe51mr4n9)\.cloudfront\.net/.*'),route_cf)
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and 'net::' not in m.text and 'Failed to load resource' not in m.text and errs.append(m.text))
        async def shot(n,t=0):
            if t: await pg.wait_for_timeout(t)
            await pg.screenshot(path=T+f'{PFX}_{n}.png')
        await pg.goto('http://localhost:8766/yeonseo.html'); await pg.wait_for_timeout(1800); await shot('01_out')
        await pg.click('#start'); await shot('02_door',1500)
        await pg.wait_for_selector('#itx2.on',timeout=20000); await shot('03_hero',1200)
        await pg.click('#goIn')
        await pg.wait_for_selector('#kGo',state='visible',timeout=20000); await shot('04_birth',600)
        await pg.select_option('#kY','1994'); await pg.select_option('#kM','7'); await pg.select_option('#kD','21'); await pg.click('#kGo')
        await pg.wait_for_selector('.chips button',state='visible',timeout=20000); await pg.click('.chips button >> nth=0')
        await pg.wait_for_timeout(1500); await pg.wait_for_selector('.chips button >> nth=3',state='visible',timeout=20000); await shot('05_sit',500)
        await pg.click('.chips button >> nth=0')
        await pg.wait_for_selector('#sDrw.on',timeout=20000); await shot('06_sweep',2600)
        await pg.wait_for_selector('#dBt.on',timeout=20000); await shot('07_lit',600)
        await pg.click('.mc.tg'); await shot('08_env',1800)
        box=await pg.locator('#seal').bounding_box(); await pg.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2); await pg.mouse.down()
        await shot('09_hold',800)
        await pg.wait_for_selector('#seal.crk',timeout=5000); await pg.mouse.up(); await shot('10_crack',300)
        await shot('11_open',1800)
        await pg.wait_for_selector('#sSeal.unf',timeout=15000); await shot('12_unfold',1500)
        await pg.wait_for_selector('#sLet.on',timeout=20000); await shot('13_letter0',700); await shot('14_letter',2600)
        h=await pg.evaluate("document.getElementById('sLet').scrollHeight")
        y=0;i=0
        while y<h and i<12:
            y+=700; i+=1
            await pg.evaluate(f"document.getElementById('sLet').scrollTop={y}"); await shot(f'15_{i:02d}',1700)
        info=await pg.evaluate("({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,lw:document.getElementById('sLet').scrollWidth,lcw:document.getElementById('sLet').clientWidth,ok:[...document.getElementById('stage').classList].join(' '),pen:document.fonts.check('40px \"Nanum Pen Script\"')})")
        print('INFO',info); print('K',await pg.evaluate("[getComputedStyle(document.getElementById('pg1')).getPropertyValue('--k'),getComputedStyle(document.getElementById('pg2')).getPropertyValue('--k'),document.getElementById('stage').className]"))
        await pg.click('#shareBtn'); await pg.wait_for_timeout(2500); await shot('16_share')
        img=await pg.evaluate("(()=>{const i=document.querySelector('.obs .pv img'); return i?i.src.slice(0,30):null})()")
        print('SHAREIMG',img)
        if 'blob:' in (img or ''):
            data=await pg.evaluate("""async()=>{const i=document.querySelector('.obs .pv img'); const r=await fetch(i.src); const b=await r.blob(); return await new Promise(res=>{const f=new FileReader(); f.onload=()=>res(f.result); f.readAsDataURL(b);});}""")
            import base64; open(T+f'{PFX}_17_card.png','wb').write(base64.b64decode(data.split(',')[1]))
        print('ERR',errs)
        await b.close()
asyncio.run(main())
