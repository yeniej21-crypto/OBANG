import asyncio,random,re
from playwright.async_api import async_playwright
CHK="""(()=>{ const out={}; for(const id of ['result','letter']){ const r=document.getElementById(id), t=r.innerText; let wide=0; r.querySelectorAll('*').forEach(e=>{ const b=e.getBoundingClientRect(); if(b.width&&b.right>401&&!e.closest('svg')) wide++; });
  out[id]={han:(t.match(/[\\u3400-\\u9fff]/g)||[]).join(''),bad:(t.match(/[?!…]/g)||[]).join(''),und:(t.match(/undefined|NaN|null|\\[object/g)||[]).length,sw:r.scrollWidth-r.clientWidth,wide,mon:(t.match(/[0-9]+월/g)||[]).length}; } return out; })()"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); random.seed(11); allerr=[]
        for k in range(20):
            y=random.randint(1955,2008); m=random.randint(1,12); d=random.randint(1,28 if random.random()<.8 else 30); cal=random.choice(['양력','음력']); h=random.choice([-1,-1]+list(range(12))); bro=random.random()<.45
            pg=await b.new_page(viewport={'width':400,'height':860}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
            await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(700)
            await pg.evaluate(f"S={{name:'테스트',nick:'테스트',bro:{str(bro).lower()},date:{{y:{y},m:{m},d:{d},cal:'{cal}'}},hour:{h}}}; if(S.bro) broDom(stage); document.getElementById('splash').classList.add('off'); R=saju(S.date.y,S.date.m,S.date.d,S.hour,S.date.cal); showResult();")
            await pg.wait_for_timeout(2600)
            await pg.evaluate("buildLetter(); DohwaPrem.open(); document.getElementById('letter').classList.add('on');"); await pg.wait_for_timeout(500)
            r=await pg.evaluate(CHK); print(k,y,m,d,cal,h,'m' if bro else 'f',r,errs[:2]); allerr+=errs; await pg.close()
        print('TOTAL ERRS',len(allerr)); await b.close()
asyncio.run(main())
