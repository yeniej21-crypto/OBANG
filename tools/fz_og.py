import asyncio, random, json
from playwright.async_api import async_playwright
random.seed(7)
CASES=[]
for i in range(22):
    CASES.append(dict(nm=random.choice(['','은주','민준','<b>x','하늘']),y=random.randint(1950,2008),m=random.randint(1,12),d=random.randint(1,28),
      h=random.choice(['x']+[str(k) for k in range(12)]),g=random.choice(['f','m']),cal=random.choice(['s','s','l']),paid=i%2==1))
CHK="""()=>{ const s=document.getElementById('sOut'); const t=s.innerText; const over=[...s.querySelectorAll('*')].filter(e=>{ const r=e.getBoundingClientRect(); return r.width>0&&(r.right>401||r.left<-1)&&!e.closest('svg'); }).map(e=>e.className||e.tagName).slice(0,4);
  return {on:s.classList.contains('on'), sw:document.documentElement.scrollWidth, ow:s.scrollWidth, cw:s.clientWidth, over, bad:(t.match(/[?!…]|undefined|NaN|null|\\[object/g)||[]).slice(0,8), hanja:(t.match(/[\\u3400-\\u9fff]+/g)||[]).slice(0,8), w:document.getElementById('wN').textContent, sc:document.getElementById('sc').textContent, prem:document.getElementById('oprem').hidden?0:document.getElementById('oprem').innerText.length}; }"""
async def one(b,c,i):
    pg=await b.new_page(viewport={'width':400,'height':860}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://localhost:8766/obgh.html'); await pg.wait_for_timeout(900)
    await pg.evaluate("""(c)=>{ const $=id=>document.getElementById(id); if($('form').hidden) $('other').click(); $('nm').value=c.nm; document.querySelector('#gSeg [data-v='+c.g+']').click(); document.querySelector('#cSeg [data-v='+c.cal+']').click();
      $('by').value=String(c.y); $('by').onchange(); $('bm').value=String(c.m); $('bm').onchange(); $('bd').value=String(c.d); $('bh').value=c.h; $('goBtn').click(); }""",c)
    await pg.wait_for_timeout(4300)
    if c['paid']:
        await pg.evaluate("document.getElementById('pay').dataset.obpaid='1'; document.getElementById('pay').click()"); await pg.wait_for_timeout(1200)
    r=await pg.evaluate(CHK); await pg.close()
    flag=errs or r['bad'] or r['hanja'] or r['over'] or r['sw']>400 or r['ow']>r['cw'] or not r['on'] or (c['paid'] and r['prem']<500)
    print(('FAIL ' if flag else 'ok   ')+json.dumps(c,ensure_ascii=False),json.dumps(r,ensure_ascii=False),errs[:2])
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for k in range(0,len(CASES),6): await asyncio.gather(*[one(b,c,k+j) for j,c in enumerate(CASES[k:k+6])])
        await b.close()
asyncio.run(main())
