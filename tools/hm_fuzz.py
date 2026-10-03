# 할매 신년운세 퍼즈: 무작위 입력 12건(남녀 · 양력/음력/윤달 · 시 있음/없음). 이미지 차단(폴백) 상태로 끝까지 진행하며 오류 · undefined · NaN · ?!… · 가로 스크롤 검사
import asyncio, random, re, os, json, sys
from playwright.async_api import async_playwright
SP=os.path.dirname(os.path.abspath(__file__))
random.seed(int(sys.argv[1]) if len(sys.argv)>1 else 7)
async def run_case(b,i,case,shots):
    pg=await b.new_page(viewport={'width':400,'height':860})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.route(re.compile(r'.*cloudfront\.net.*'),lambda r:r.abort())
    await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.evaluate("sessionStorage.clear()")
    await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(900)
    await pg.evaluate("document.querySelectorAll('.mi .x').forEach(b=>b.click())"); await pg.wait_for_timeout(1500)
    probs=[]
    async def check(tag):
        r=await pg.evaluate("""()=>{ const st=document.getElementById('stage'), t=st.innerText;
          const scr=[...document.querySelectorAll('.scr.on')].map(s=>[s.id,s.scrollWidth,s.clientWidth]);
          return {t, bad:['?','!','…','undefined','NaN','null'].filter(c=>t.includes(c)).map(c=>[c,t.slice(Math.max(0,t.indexOf(c)-40),t.indexOf(c)+10)]),
            dw:[document.documentElement.scrollWidth,innerWidth,document.body.scrollWidth], scr, trk:(document.getElementById('mtrack').textContent.match(/undefined|NaN/g)||[]).length}; }""")
        for c,ctx in r['bad']: probs.append(f'{tag}: char {c} in ..{ctx}..')
        if r['dw'][0]>r['dw'][1] or r['dw'][2]>r['dw'][1]: probs.append(f'{tag}: page hscroll {r["dw"]}')
        for s in r['scr']:
            if s[1]>s[2]+1: probs.append(f'{tag}: {s[0]} hscroll {s}')
        if r['trk']: probs.append(f'{tag}: track undefined/NaN')
    await pg.evaluate(f"""(()=>{{ const c={json.dumps(case)};
      document.querySelector('#gSeg button[data-v="'+c.g+'"]').click(); document.querySelector('#cSeg button[data-v="'+c.cal+'"]').click();
      const set=(id,v)=>{{ const e=document.getElementById(id); e.value=v; if(e.onchange) e.onchange(); }};
      set('by',c.y); set('bm',c.m); set('bd',c.d); if(c.leap){{ const l=document.getElementById('leap'); if(!l.disabled) l.checked=true; }} set('bh',c.h==null?'x':c.h); document.getElementById('nm').value=c.name; }})()""")
    await pg.evaluate("go()"); await pg.wait_for_timeout(2400); await check('rice')
    await pg.wait_for_function("document.getElementById('rTake').classList.contains('on')",timeout=12000)
    await pg.click('#takeBtn'); await pg.wait_for_timeout(2200); await pg.click('#rSkip'); await pg.wait_for_timeout(4800); await check('riceDone')
    if i in shots: await pg.screenshot(path=f'{SP}/t/hm_fz{i}_rice.png')
    el=await pg.evaluate("[CUR.riceEl,document.getElementById('rResT').textContent]")
    await pg.click('#toScroll'); await pg.wait_for_timeout(5600); await check('scroll')
    for k in range(14): await pg.evaluate(f"msGo({k},true)");
    await pg.evaluate("msGo(CUR.warn[0],true)"); await pg.wait_for_timeout(300)
    if i in shots: await pg.screenshot(path=f'{SP}/t/hm_fz{i}_scroll.png')
    await pg.click('#toRep'); await pg.wait_for_timeout(900)
    H=await pg.evaluate("document.getElementById('sRep').scrollHeight"); y=0
    while y<H:
        await pg.evaluate(f"document.getElementById('sRep').scrollTop={y}"); await pg.wait_for_timeout(250); y+=700
    await pg.wait_for_timeout(2400); await check('rep')
    await pg.evaluate("document.getElementById('dawn').scrollIntoView()"); await pg.wait_for_timeout(500)
    if i in shots: await pg.screenshot(path=f'{SP}/t/hm_fz{i}_dawn.png')
    await pg.click('#pouchBtn'); await pg.wait_for_timeout(600)
    await pg.evaluate("(()=>{const a=document.querySelector('.obp [data-agree]'); if(a){a.click();} const g=document.querySelector('.obp [data-pay]'); if(g){g.disabled=false; g.click();}})()")
    await pg.wait_for_timeout(3000)
    H=await pg.evaluate("document.getElementById('sRep').scrollHeight"); y=await pg.evaluate("document.getElementById('prem').offsetTop")
    while y<H:
        await pg.evaluate(f"document.getElementById('sRep').scrollTop={y}"); await pg.wait_for_timeout(200); y+=700
    await pg.wait_for_timeout(800); await check('prem')
    pt=await pg.evaluate("document.getElementById('prem').innerText.length")
    if pt<500: probs.append(f'prem short {pt}')
    await pg.close()
    return el,probs,errs
async def main():
    cases=[]
    for i in range(12):
        cal=['s','l','l'][i%3]; leap=(i%3==2)
        y=random.randint(1950,2007); m=random.randint(1,12)
        if leap:
            # 윤달 있는 해 · 달 찾기
            pass
        cases.append({'name':random.choice(['김은주','박지','이서윤','최민','정하늘','윤아','강다은솔']),'g':random.choice(['f','m']),'cal':cal,'leap':leap,'y':y,'m':m,'d':random.randint(1,28 if cal=='s' else 29),'h':random.choice([None,None,0,3,6,9,11,random.randint(0,11)])})
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(); await pg.goto('http://localhost:8766/sinnyeon.html')
        leaps=await pg.evaluate("(()=>{const o=[]; for(let y=1950;y<=2007;y++) for(let m=1;m<=12;m++) if(Saju.hasLeap(y,m)) o.push([y,m]); return o;})()"); await pg.close()
        for c in cases:
            if c['leap']: y,m=random.choice(leaps); c['y']=y; c['m']=m
        tot=[]
        for i,c in enumerate(cases):
            try:
                el,probs,errs=await run_case(b,i,c,{0,2,5})
                print(i,json.dumps(c,ensure_ascii=False),'->',el,'| probs:',probs[:6],'| errs:',errs[:3]); tot+=probs+errs
            except Exception as e:
                print(i,c,'EXC',str(e)[:300]); tot.append(str(e))
        print('TOTAL problems',len(tot)); await b.close()
asyncio.run(main())
