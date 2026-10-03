import asyncio, random, re, json
from playwright.async_api import async_playwright
SP='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad'
random.seed(7)
BAD=re.compile(r'undefined|NaN|null|\?|!|…|[一-鿿]')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':320,'height':640},reduced_motion='reduce')
        pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(1200)
        # find inputs covering 0/1/2 dohwa, both genders, lunar/solar, with/without hour
        cands=await pg.evaluate("""()=>{ const out={0:[],1:[],2:[]}; for(let i=0;i<4000;i++){ const y=1960+Math.floor(Math.random()*48), m=1+Math.floor(Math.random()*12), d=1+Math.floor(Math.random()*28), h=Math.random()<.3?-1:Math.floor(Math.random()*12), cal=Math.random()<.35?'음력':'양력';
          const P=saju(y,m,d,h,cal); const n=Math.min(2,peachSpots(P).length); if(out[n].length<8) out[n].push([y,m,d,h,cal]); } return out; }""")
        cases=[]
        for n in ['0','1','2']:
            for i,c in enumerate(cands[n][:5]): cases.append((n,'m' if i%2 else 'f',c))
        res=[]
        for n,g,(y,m,d,h,cal) in cases:
            name=random.choice(['은주','김민지','하늘','이서준','박도윤'])
            await pg.evaluate(f"""()=>{{ S={{name:'{name}',nick:nickOf('{name}'),bro:{'true' if g=='m' else 'false'},date:{{y:{y},m:{m},d:{d},cal:'{cal}'}},hour:{h}}}; R=saju({y},{m},{d},S.hour,'{cal}'); showResult(); }}""")
            await pg.wait_for_timeout(500)
            # open all why boxes
            await pg.evaluate("document.querySelectorAll('#th [data-why]').forEach(b=>b.click())")
            t=await pg.evaluate("document.getElementById('result').innerText")
            rows=await pg.evaluate("document.querySelectorAll('#th .row').length")
            sw=await pg.evaluate("[document.getElementById('result').scrollWidth,document.getElementById('result').clientWidth]")
            bad=sorted(set(BAD.findall(t)))
            nu='누나' in t
            res.append((n,g,y,m,d,h,cal,rows,sw,bad,('누나 left' if g=='m' and nu else '')))
            if len(res) in (1,): open(SP+'/t/dsc_fz_sample.txt','w').write(t)
        # re-render duplicate check
        r1=await pg.evaluate("document.querySelectorAll('#th .row').length"); await pg.evaluate("showResult()"); await pg.wait_for_timeout(500); r2=await pg.evaluate("document.querySelectorAll('#th .row').length")
        for r in res: print(r)
        print('rerender rows',r1,r2,'ERR',errs[:5])
        await b.close()
asyncio.run(main())
