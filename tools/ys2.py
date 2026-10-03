# 연서당 · 작은 편지들 글자 크기 개편 점검(390x844): mock 그림 + 로컬 글꼴(펜 · 명조 · 송명)
import asyncio, sys, re, base64, json
from playwright.async_api import async_playwright
S='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad'; T=S+'/t/'; M=S+'/ysmock/'
WHICH=[a for a in sys.argv[1:]] or ['ys','type','match','week']
IMG={'ac4bb635':'hero','5c12ee04':'exterior','6138087b':'counter','5e44ea50':'drawers','8bd24999':'envelope','7f24a420':'folded','5a9b6a58':'paper','a785a586':'stamps','f62beca5':'seals','d143c0bb':'ending',
     '514adb66':'counter','f02f9001':'envelope','ac7dda5b':'drawers'}
VID={'afe7cc7d':'hero','2b6d6fc1':'drawers','af116ec2':'envelope','dabccc7d':'folded','86d35ded':'envelope'}
FONT_CSS=''
for pkg,files in [('fontsource-nanum-pen-script-5.3.0',['400.css']),('fontsource-noto-serif-kr-5.3.0',['korean-500.css','korean-600.css','korean-700.css','korean-900.css','latin-700.css']),('fontsource-song-myung',['400.css'])]:
    for f in files:
        css=open(f'{S}/tfont/{pkg}/package/{f}').read(); FONT_CSS+=css.replace('./files/',f'https://tfont.local/{pkg}/package/files/')
async def route_cf(route):
    u=route.request.url; k=re.search(r'([0-9a-f]{8})-[0-9a-f]{4}',u); k=k.group(1) if k else ''
    if u.split('?')[0].endswith('.mp4'):
        if k in VID: return await route.fulfill(path=M+VID[k]+'.webm',content_type='video/webm',headers={'Access-Control-Allow-Origin':'*'})
        return await route.abort()
    if k in IMG: return await route.fulfill(path=M+IMG[k]+'.webp',content_type='image/webp',headers={'Access-Control-Allow-Origin':'*'})
    await route.abort()
async def route_font(route): await route.fulfill(body=FONT_CSS,content_type='text/css')
async def route_tf(route):
    p=route.request.url.replace('https://tfont.local/',S+'/tfont/')
    await route.fulfill(path=p,content_type='font/woff2',headers={'Access-Control-Allow-Origin':'*'})
AUDIT="""()=>{ const out=[]; const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n;
 while(n=w.nextNode()){ const t=n.textContent.trim(); if(!t) continue; const el=n.parentElement; if(!el) continue;
  if(el.closest('script,style,noscript,option,select,[hidden],.obs')) continue;
  const r=el.getBoundingClientRect(); if(!r.width||!r.height) continue;
  let a=el, hid=false; while(a&&a!==document.documentElement){ const c=getComputedStyle(a); if(c.display==='none'||c.visibility==='hidden'||+c.opacity===0){hid=true;break;} a=a.parentElement; } if(hid) continue;
  let fs=parseFloat(getComputedStyle(el).fontSize); if(el instanceof SVGElement){ const m=el.getScreenCTM(); if(m) fs*=Math.hypot(m.a,m.b); }
  const cls=(el.className&&el.className.baseVal!==undefined)?el.className.baseVal:el.className;
  if(fs<14) out.push([t.slice(0,28),+fs.toFixed(1),el.tagName+'.'+cls]); }
 return out; }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2)
        await ctx.route('**/fonts.googleapis.com/**',route_font); await ctx.route('https://tfont.local/**',route_tf)
        await ctx.route(re.compile(r'https://d(8j0ntlcm91z4|2ol7oe51mr4n9)\.cloudfront\.net/.*'),route_cf)
        small={}
        async def newpage(me=False):
            pg=await ctx.new_page(); errs=[]; reqs=[]
            pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and 'net::' not in m.text and 'Failed to load resource' not in m.text and errs.append(m.text))
            pg.on('request',lambda r: 'bgm' in r.url and reqs.append(r.url))
            if me: await pg.add_init_script("try{localStorage.setItem('obMe','{\"y\":1994,\"m\":3,\"d\":8,\"cal\":\"s\",\"g\":\"f\",\"h\":null}')}catch(e){}")
            else: await pg.add_init_script("try{localStorage.removeItem('obMe');sessionStorage.removeItem('me')}catch(e){}")
            pg._errs=errs; pg._reqs=reqs; return pg
        async def aud(pg,tag):
            r=await pg.evaluate(AUDIT)
            if r: small[tag]=r
        if 'ys' in WHICH:
            pg=await newpage(); 
            async def shot(n,t=0):
                if t: await pg.wait_for_timeout(t)
                await pg.screenshot(path=T+f'y2_{n}.png'); await aud(pg,'ys_'+n)
            await pg.goto('http://localhost:8766/yeonseo.html'); await pg.wait_for_timeout(1800); await shot('01_out')
            await pg.click('#start')
            await pg.wait_for_selector('#itx2.on',timeout=20000); await shot('03_hero',1200)
            await pg.click('#goIn')
            await pg.wait_for_selector('#kGo',state='visible',timeout=20000); await shot('04_birth',600)
            await pg.select_option('#kY','1994'); await pg.select_option('#kM','7'); await pg.select_option('#kD','21'); await pg.click('#kGo')
            await pg.wait_for_selector('.chips button',state='visible',timeout=20000); await shot('04b_gender',400); await pg.click('.chips button >> nth=0')
            await pg.wait_for_timeout(1500); await pg.wait_for_selector('.chips button >> nth=3',state='visible',timeout=20000); await shot('05_sit',500)
            await pg.click('.chips button >> nth=0')
            await pg.wait_for_selector('#sDrw.on',timeout=20000); await shot('06_sweep',2600)
            await pg.wait_for_selector('#dBt.on',timeout=20000); await shot('07_lit',600)
            await pg.click('.mc.tg'); await shot('08_env',1800)
            box=await pg.locator('#seal').bounding_box(); await pg.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2); await pg.mouse.down()
            await shot('09_hold',800)
            await pg.wait_for_selector('#seal.crk',timeout=5000); await pg.mouse.up()
            await pg.wait_for_selector('#sLet.on',timeout=25000); await shot('14_letter',3000)
            h=await pg.evaluate("document.getElementById('sLet').scrollHeight"); y=0;i=0
            while y<h-844 and i<14:
                y+=640; i+=1
                await pg.evaluate(f"document.getElementById('sLet').scrollTop={y}"); await shot(f'15_{i:02d}',1600)
            info=await pg.evaluate("({sw:document.documentElement.scrollWidth,lw:document.getElementById('sLet').scrollWidth,k:[getComputedStyle(document.getElementById('pg1')).getPropertyValue('--k'),getComputedStyle(document.getElementById('pg2')).getPropertyValue('--k')],fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family).filter((v,i,a)=>a.indexOf(v)===i)})")
            print('YS INFO',info,'BGM',pg._reqs,'ERR',pg._errs)
            print('YS gain',await pg.evaluate("1"))
            await pg.close()
        for t in ['type','match','week']:
            if t not in WHICH: continue
            pg=await newpage(me=(t!='type'))
            async def shot(n,full=False):
                await pg.screenshot(path=T+f'lmz_{t}_{n}.png',full_page=full); await aud(pg,t+'_'+n)
            await pg.goto(f'http://localhost:8766/lovemini.html?t={t}'); await pg.wait_for_timeout(2600); await shot('0')
            if t=='type':
                await pg.evaluate("scrollTo(0,document.getElementById('stage').offsetTop-150)"); await pg.wait_for_timeout(300); await shot('0b_form')
                await pg.click('#kGo'); await pg.wait_for_timeout(900)
                await pg.evaluate("scrollTo(0,document.getElementById('stage').offsetTop-200)"); await pg.wait_for_timeout(300); await shot('1')
                bx=await pg.locator('#seal').bounding_box(); await pg.mouse.move(bx['x']+bx['width']/2,bx['y']+bx['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(1500); await pg.mouse.up()
                await pg.wait_for_timeout(1800); await shot('2')
                await pg.wait_for_timeout(4500)
            if t=='match':
                await pg.evaluate("scrollTo(0,document.getElementById('stage').offsetTop-150)"); await pg.wait_for_timeout(300); await shot('0b_form')
                await pg.select_option('#pY','1992'); await pg.select_option('#pM','11'); await pg.wait_for_timeout(100); await pg.select_option('#pD','21')
                await pg.click('#pGo'); await pg.wait_for_timeout(900)
                await pg.evaluate("scrollTo(0,document.getElementById('stage').offsetTop-200)"); await pg.wait_for_timeout(300); await shot('1')
                sv=await pg.locator('#lsv').bounding_box(); await pg.mouse.click(sv['x']+sv['width']/2,sv['y']+20)
                await pg.wait_for_timeout(1000); await shot('2'); await pg.wait_for_timeout(5000)
            if t=='week':
                await pg.evaluate("scrollTo(0,document.getElementById('stage').offsetTop-200)"); await pg.wait_for_timeout(300); await shot('1')
                await pg.click('#shade'); await pg.wait_for_timeout(2800); await shot('2'); await pg.wait_for_timeout(4500)
            for k in range(5):
                await shot(f'5_{k}'); 
                more=await pg.evaluate("(()=>{const y=scrollY; scrollBy(0,700); return scrollY>y})()")
                if not more: break
                await pg.wait_for_timeout(700)
            print(t,'BGM',pg._reqs,'ERR',pg._errs,'sw',await pg.evaluate("document.documentElement.scrollWidth"))
            await pg.close()
        flat=sorted({(x[0],x[1],x[2]) for v in small.values() for x in v if not x[2].endswith((".foot",".ai"))}); print("SMALL(<14, legal excluded)",flat); print("UNDER13",[x for v in small.values() for x in v if x[1]<13])
        await b.close()
asyncio.run(main())
