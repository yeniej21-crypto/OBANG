import asyncio,sys
from playwright.async_api import async_playwright
S='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/'
ME='{"y":1994,"m":3,"d":8,"cal":"s","g":"f","h":null}'
async def shot(pg,n,full=False): await pg.screenshot(path=S+'mini_'+n+'.png',full_page=full)
async def main(which):
  async with async_playwright() as p:
    b=await p.chromium.launch()
    async def page(pref=True):
      pg=await b.new_page(viewport={'width':400,'height':860},device_scale_factor=2,has_touch=False); await pg.route(__import__('re').compile(r'.*(googleapis|gstatic).*'),lambda r:r.abort())
      errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
      if pref: await pg.add_init_script(f"try{{localStorage.setItem('obMe','{ME}')}}catch(e){{}}")
      pg._errs=errs; return pg
    if 'type' in which:
      pg=await page(False); await pg.goto('http://localhost:8766/lovemini.html?t=type'); await pg.wait_for_timeout(900)
      await shot(pg,'type_0input')
      await pg.click('#kGo'); await pg.wait_for_timeout(900); await shot(pg,'type_1seal')
      bx=await pg.locator('#seal').bounding_box(); await pg.mouse.move(bx['x']+bx['width']/2,bx['y']+bx['height']/2); await pg.mouse.down(); await pg.wait_for_timeout(750); await shot(pg,'type_2hold')
      await pg.wait_for_timeout(700); await pg.mouse.up(); await pg.wait_for_timeout(250); await shot(pg,'type_3crack')
      await pg.wait_for_timeout(700); await shot(pg,'type_4open')
      await pg.wait_for_timeout(1500); await pg.evaluate("scrollTo(0,document.getElementById('stage').offsetTop-60)"); await pg.wait_for_timeout(500); await shot(pg,'type_5result')
      await shot(pg,'type_6full',True)
      await pg.click('#aSh'); await pg.wait_for_timeout(2500); await shot(pg,'type_7share')
      print('type errs',pg._errs)
    if 'match' in which:
      pg=await page(True); await pg.goto('http://localhost:8766/lovemini.html?t=match'); await pg.wait_for_timeout(900)
      await shot(pg,'match_0input')
      await pg.select_option('#pY','1992'); await pg.select_option('#pM','11'); await pg.wait_for_timeout(100); await pg.select_option('#pD','21')
      await pg.click('#pGo'); await pg.wait_for_timeout(900); await shot(pg,'match_1loom')
      sv=await pg.locator('#lsv').bounding_box(); k=sv['width']/360
      ax,ay=sv['x']+118*k,sv['y']+188*k; bx_,by=sv['x']+(360-118)*k,sv['y']+120*k
      await pg.mouse.move(ax,ay); await pg.mouse.down()
      for i in range(1,8): await pg.mouse.move(ax+(150-118)*k*i/8,ay-(30*k)*i/8); await pg.wait_for_timeout(30)
      await shot(pg,'match_2drag')
      await pg.mouse.up()
      await pg.mouse.move(bx_,by); await pg.mouse.down()
      for i in range(1,16): await pg.mouse.move(bx_+((150+20)*k-(360-118)*k)*i/15, by+(158-120)*k*i/15); await pg.wait_for_timeout(30)
      await pg.mouse.up(); await pg.wait_for_timeout(1100); await shot(pg,'match_3tied')
      await pg.wait_for_timeout(1200); await pg.evaluate("scrollTo(0,document.getElementById('stage').offsetTop-60)"); await pg.wait_for_timeout(500); await shot(pg,'match_4result')
      await shot(pg,'match_5full',True)
      await pg.click('#aSh'); await pg.wait_for_timeout(2500); await shot(pg,'match_6share')
      print('match errs',pg._errs)
    if 'week' in which:
      pg=await page(True); await pg.goto('http://localhost:8766/lovemini.html?t=week'); await pg.wait_for_timeout(900)
      await shot(pg,'week_0shade')
      sh=await pg.locator('#shade').bounding_box(); x0,y0=sh['x']+36,sh['y']+sh['height']/2
      await pg.mouse.move(x0,y0); await pg.mouse.down()
      for i in range(1,6): await pg.mouse.move(x0+i*14,y0); await pg.wait_for_timeout(30)
      await shot(pg,'week_1drag')
      for i in range(6,14): await pg.mouse.move(x0+i*14,y0); await pg.wait_for_timeout(30)
      await pg.mouse.up(); await pg.wait_for_timeout(1300); await shot(pg,'week_2sweep')
      await pg.wait_for_timeout(1300); await shot(pg,'week_3settled')
      await pg.wait_for_timeout(1600); await shot(pg,'week_4result')
      await shot(pg,'week_5full',True)
      await pg.click('#aSh'); await pg.wait_for_timeout(2500); await shot(pg,'week_6share')
      print('week errs',pg._errs)
    if 'love' in which:
      pg=await page(True); await pg.goto('http://localhost:8766/love.html'); await pg.wait_for_timeout(1500)
      await pg.evaluate("document.getElementById('secMini').scrollIntoView({block:'start'}); scrollBy(0,-70)"); await pg.wait_for_timeout(600); await shot(pg,'love_section')
      print('love errs',pg._errs)
    await b.close()
asyncio.run(main(sys.argv[1:] or ['type','match','week','love']))
