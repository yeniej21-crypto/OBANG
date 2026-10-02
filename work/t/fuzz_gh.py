import asyncio,random,base64,json
from playwright.async_api import async_playwright
CHK="""(()=>{ const r=document.getElementById('sRs'), t=r.innerText; let wide=0; r.querySelectorAll('*').forEach(e=>{ const b=e.getBoundingClientRect(); if(b.width&&b.right>401&&!e.closest('svg')) wide++; });
  return {on:r.classList.contains('on'),han:(t.match(/[\\u3400-\\u9fff]/g)||[]).join(''),bad:(t.match(/[?!…]/g)||[]).join(''),und:(t.match(/undefined|NaN|null|\\[object/g)||[]).length,sw:r.scrollWidth-r.clientWidth,wide,mon:(t.match(/[0-9]+월/g)||[]).length,secs:r.querySelectorAll('#ghBody .lb-sec').length,sc:document.getElementById('sc').textContent,prem:!document.getElementById('gprem').hidden}; })()"""
def setf(side,n,g,c,y,m,d,h):
    w='#w'+side
    return f"""(()=>{{const w=document.querySelector('{w}'); w.querySelector('[data-k=n]').value='{n}'; w.querySelector('.seg[data-k=g] [data-v={g}]').click(); w.querySelector('.seg[data-k=c] [data-v={c}]').click(); const Y=w.querySelector('[data-k=y]'),M=w.querySelector('[data-k=m]'),D=w.querySelector('[data-k=d]'); Y.value='{y}'; Y.onchange(); M.value='{m}'; M.onchange(); D.value='{d}'; w.querySelector('[data-k=h]').value='{h}';}})()"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); random.seed(5); allerr=[]
        pg=await b.new_page(viewport={'width':400,'height':860}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/gunghap.html'); await pg.wait_for_timeout(1200)
        for k in range(18):
            names=['','은주','민준','그레이스킴','이','박서방님']
            for side in 'AB':
                await pg.evaluate(setf(side,random.choice(names),random.choice('fm'),random.choice('sl'),random.randint(1955,2008),random.randint(1,12),random.randint(1,28),random.choice(['x','x']+[str(i) for i in range(12)])))
            await pg.evaluate("document.getElementById('goBtn').click()"); await pg.wait_for_timeout(2400)
            r=await pg.evaluate(CHK)
            if k%6==0:
                await pg.evaluate("GunghapPrem.open(); document.getElementById('gprem').hidden=false;"); await pg.wait_for_timeout(400); r2=await pg.evaluate(CHK); r['paid']=(r2['han'],r2['bad'],r2['und'],r2['wide'])
            print(k,r,errs[-2:]); await pg.evaluate("document.getElementById('back').click()"); await pg.wait_for_timeout(500)
        # 신청 링크로 온 사람(생일 없이 여덟 글자)
        for k in range(3):
            o={'v':2,'n':random.choice(['지호','하늘']),'g':random.choice('fm'),'p':None}
            P=await pg.evaluate(f"(()=>{{const P=Saju.pillars({random.randint(1970,2005)},{random.randint(1,12)},{random.randint(1,28)},{random.choice(['null','3'])}); return [P.y,P.m,P.d,P.h||[-1,-1]].flat();}})()")
            o['p']=P; e=base64.urlsafe_b64encode(json.dumps(o,ensure_ascii=False).encode()).decode().rstrip('=')
            pg2=await b.new_page(viewport={'width':400,'height':860}); e2=[]; pg2.on('pageerror',lambda x:e2.append(str(x)))
            await pg2.goto('http://localhost:8766/gunghap.html?f='+e); await pg2.wait_for_timeout(1200)
            await pg2.evaluate("document.getElementById('goBtn').click()"); await pg2.wait_for_timeout(2600)
            r=await pg2.evaluate(CHK); await pg2.evaluate("GunghapPrem.open()"); await pg2.wait_for_timeout(300)
            print('link',k,r,e2[:2]); allerr+=e2; await pg2.close()
        allerr+=errs; print('TOTAL ERRS',len(allerr),allerr[:3]); await b.close()
asyncio.run(main())
