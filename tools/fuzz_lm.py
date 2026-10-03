import asyncio,re,json,random,sys
from playwright.async_api import async_playwright
BAD=re.compile(r'[?!…一-鿿㐀-䶿]|undefined|NaN|null')
random.seed(int(sys.argv[1]) if len(sys.argv)>1 else 7)
def rp(g=True):
  o={"y":random.randint(1955,2006),"m":random.randint(1,12),"d":random.randint(1,28),"cal":random.choice("ss l".split()) if False else random.choice(["s","s","l"])}
  if g: o["g"]=random.choice("fm"); o["h"]=random.choice([None]+list(range(12)))
  return o
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.route(re.compile(r'.*(googleapis|gstatic|cloudfront).*'),lambda r:r.abort())
    seen=set(); issues=0
    for n in range(8):
      me=rp(); th=rp(False)
      await pg.goto('http://localhost:8766/lovemini.html?t=type')
      await pg.evaluate(f"localStorage.setItem('obMe',JSON.stringify({json.dumps(me)}));sessionStorage.setItem('me',JSON.stringify({json.dumps(me)}));sessionStorage.setItem('lmThem',JSON.stringify({json.dumps(th)}))")
      for t in ['type','match','week']:
        await pg.goto(f'http://localhost:8766/lovemini.html?t={t}'); await pg.wait_for_timeout(300)
        if t=='type':
          await pg.locator('#seal').scroll_into_view_if_needed(); bx=await pg.locator('#seal').bounding_box(); await pg.mouse.move(bx['x']+88,bx['y']+88); await pg.mouse.down(); await pg.wait_for_timeout(1400); await pg.mouse.up(); await pg.wait_for_timeout(3000)
          seen.add(await pg.locator('#tcard h2').inner_text())
        if t=='match':
          await pg.click('#pGo'); await pg.wait_for_timeout(400); await pg.locator('#lsv').scroll_into_view_if_needed(); await pg.click('#lsv',position={'x':200,'y':40}); await pg.wait_for_timeout(2600)
          seen.add(await pg.locator('#mcard h2').inner_text())
        if t=='week':
          await pg.locator('#shade').scroll_into_view_if_needed(); await pg.click('#shade'); await pg.wait_for_timeout(4200)
        await pg.wait_for_timeout(2500)
        txt=await pg.evaluate("document.body.innerText")
        bad=set(BAD.findall(txt))
        sw=await pg.evaluate("[document.documentElement.scrollWidth,document.documentElement.clientWidth]")
        # 편지 안 넘침 검사: 편지 높이가 종이 비율보다 크게 늘어났는지
        lt=await pg.evaluate("(()=>{const l=document.querySelector('.letter'); if(!l) return null; const r=l.getBoundingClientRect(); return +(r.height/r.width).toFixed(3); })()")
        if bad or sw[0]>sw[1] or (lt and lt>1910/1080+.02):
          issues+=1; print('ISSUE',t,me,th,bad,[l for l in txt.split('\n') if BAD.search(l)][:3],sw,lt)
    print('variants',len(seen)); print(' | '.join(sorted(seen)))
    print('issues',issues,'errs',errs); await b.close()
asyncio.run(main())
