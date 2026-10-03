import asyncio,sys,re,base64
from playwright.async_api import async_playwright
SP='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/'
T=SP+'t/'
ME='{"y":1994,"m":3,"d":8,"cal":"s","g":"f","h":null}'
MOCK='mock' in sys.argv
TAG='m' if MOCK else 'f'
async def route_cf(r):
  u=r.request.url
  if not MOCK or u.endswith('.mp4'): return await r.abort()
  f='paper.webp' if '5a9b6a58' in u else 'seals.webp' if 'f62beca5' in u else 'hero.jpg'
  await r.fulfill(path=T+'mock/'+f,headers={'Access-Control-Allow-Origin':'*','Content-Type':'image/webp' if f.endswith('webp') else 'image/jpeg'})
async def shot(pg,n,full=False): await pg.screenshot(path=T+f'lm_{TAG}_{n}.png',full_page=full)
async def grab(pg,n):
  await pg.evaluate("()=>{ window.__b=null; if(window.ObShare) ObShare.sheet=o=>{ const fr=new FileReader(); fr.onload=()=>window.__b=fr.result; fr.readAsDataURL(o.blob); }; }")
  await pg.click('#aSh')
  for i in range(60):
    d=await pg.evaluate('window.__b')
    if d: open(T+f'lm_{TAG}_{n}_card.png','wb').write(base64.b64decode(d.split(',')[1])); return
    await pg.wait_for_timeout(100)
  print('no card',n)
async def main(which):
  async with async_playwright() as p:
    b=await p.chromium.launch()
    async def page(pref=True):
      pg=await b.new_page(viewport={'width':400,'height':860},device_scale_factor=2)
      await pg.route(re.compile(r'.*(googleapis|gstatic).*'),lambda r:r.abort())
      await pg.route(re.compile(r'.*cloudfront\.net.*'),route_cf)
      errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'net::' not in m.text and 'Failed to load' not in m.text else None)
      if pref: await pg.add_init_script(f"try{{localStorage.setItem('obMe','{ME}')}}catch(e){{}}")
      pg._errs=errs; return pg
    if 'type' in which:
      pg=await page(False); await pg.goto('http://localhost:8766/lovemini.html?t=type'); await pg.wait_for_timeout(2600)
      await shot(pg,'type_0')
      await pg.click('#kGo'); await pg.wait_for_timeout(900)
      await pg.evaluate("scrollTo(0,document.getElementById('stage').offsetTop-200)"); await pg.wait_for_timeout(300); await shot(pg,'type_1seal')
      bx=await pg.locator('#seal').bounding_box(); await pg.mouse.move(bx['x']+bx['width']/2,bx['y']+bx['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(700); await shot(pg,'type_2hold')
      await pg.wait_for_timeout(700); await pg.mouse.up(); await pg.wait_for_timeout(700); await shot(pg,'type_3done')
      await pg.wait_for_timeout(900); await shot(pg,'type_4open')
      await pg.wait_for_timeout(4500); await shot(pg,'type_5result')
      await pg.evaluate("scrollBy(0,700)"); await pg.wait_for_timeout(500); await shot(pg,'type_6sheet')
      await pg.evaluate("scrollBy(0,800)"); await pg.wait_for_timeout(500); await shot(pg,'type_7more')
      await grab(pg,'type')
      print('type errs',pg._errs)
    if 'match' in which:
      pg=await page(True); await pg.goto('http://localhost:8766/lovemini.html?t=match'); await pg.wait_for_timeout(2600)
      await shot(pg,'match_0')
      await pg.select_option('#pY','1992'); await pg.select_option('#pM','11'); await pg.wait_for_timeout(100); await pg.select_option('#pD','21')
      await pg.click('#pGo'); await pg.wait_for_timeout(900)
      await pg.evaluate("scrollTo(0,document.getElementById('stage').offsetTop-200)"); await pg.wait_for_timeout(300); await shot(pg,'match_1loom')
      sv=await pg.locator('#lsv').bounding_box(); k=sv['width']/360
      ax,ay=sv['x']+118*k,sv['y']+188*k; bx_,by=sv['x']+(360-118)*k,sv['y']+120*k
      await pg.mouse.move(ax,ay); await pg.mouse.down()
      for i in range(1,8): await pg.mouse.move(ax+(150-118)*k*i/8,ay-(30*k)*i/8); await pg.wait_for_timeout(30)
      await shot(pg,'match_2drag'); await pg.mouse.up()
      await pg.mouse.move(bx_,by); await pg.mouse.down()
      for i in range(1,16): await pg.mouse.move(bx_+((150+20)*k-(360-118)*k)*i/15, by+(158-120)*k*i/15); await pg.wait_for_timeout(30)
      await pg.mouse.up(); await pg.wait_for_timeout(1100); await shot(pg,'match_3tied')
      await pg.wait_for_timeout(4800); await shot(pg,'match_4result')
      await pg.evaluate("scrollBy(0,700)"); await pg.wait_for_timeout(500); await shot(pg,'match_5sheet')
      await grab(pg,'match')
      print('match errs',pg._errs)
    if 'week' in which:
      pg=await page(True); await pg.goto('http://localhost:8766/lovemini.html?t=week'); await pg.wait_for_timeout(2600)
      await shot(pg,'week_0')
      await pg.evaluate("scrollTo(0,document.getElementById('stage').offsetTop-200)"); await pg.wait_for_timeout(300); await shot(pg,'week_1blind')
      sh=await pg.locator('#shade').bounding_box(); x0,y0=sh['x']+sh['width']/2,sh['y']+sh['height']-20
      await pg.mouse.move(x0,y0); await pg.mouse.down()
      for i in range(1,6): await pg.mouse.move(x0,y0-i*9); await pg.wait_for_timeout(30)
      await shot(pg,'week_2drag')
      for i in range(6,14): await pg.mouse.move(x0,y0-i*9); await pg.wait_for_timeout(30)
      await pg.mouse.up(); await pg.wait_for_timeout(1300); await shot(pg,'week_3sweep')
      await pg.wait_for_timeout(1500); await shot(pg,'week_4settled')
      await pg.wait_for_timeout(4500); await shot(pg,'week_5result')
      await pg.evaluate("scrollBy(0,700)"); await pg.wait_for_timeout(500); await shot(pg,'week_6sheet')
      await grab(pg,'week')
      print('week errs',pg._errs)
    if 'love' in which:
      pg=await page(True); await pg.goto('http://localhost:8766/love.html'); await pg.wait_for_timeout(1500)
      await pg.evaluate("document.getElementById('secMini').scrollIntoView({block:'start'}); scrollBy(0,-70)"); await pg.wait_for_timeout(1200); await shot(pg,'love_section')
      print('love errs',pg._errs)
    await b.close()
asyncio.run(main([a for a in sys.argv[1:] if a!='mock'] or ['type','match','week','love']))
