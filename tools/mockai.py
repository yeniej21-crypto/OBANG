import asyncio, sys, json
from playwright.async_api import async_playwright
page=sys.argv[1]; pre=sys.argv[2] if len(sys.argv)>2 else ''
MOCK="""window.__P=[]; window.claude={use:async n=>{ if(n!=='sample') return null; const f=async()=>({text:''}); f.json=async(prompt)=>{ window.__P.push(prompt); await new Promise(r=>setTimeout(r,200));
 const ids=(prompt.match(/대상 [^ ]+ 번호: ([0-9, ]+)/)||[])[1]; if(ids){ return ids.split(',').map(x=>+x).map(i=>({i,title:'AI제목'+i,tag:'AI'+i,god:'신',total:'AI 총론 '+i,text:'AI 텍스트 '+i,love:'연애',money:'돈',work:'일',people:'사람',body:'몸',do:'하기',avoid:'말기',key:'열쇠 10년'})); }
 const m=prompt.match(/출력 JSON 형식: (\\{[\\s\\S]*?\\})\\n/); return JSON.parse(JSON.stringify({cover:{words:['가','나','다'],line:'{P}, 테스트'},nature:['n1'],frame:['f1'],pan:['p'],threshold:'t',blank:'b',letter:['{P}께.','편지'],turns:{},areas:{love:{sum:'s',tip:'t'},money:{sum:'s',tip:'t'},work:{sum:'s',tip:'t'},family:{sum:'s',tip:'t'},people:{sum:'s',tip:'t'},body:{sum:'s',tip:'t'}}})); }; return f; }};"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script(MOCK)
        await pg.goto('http://localhost:8766/'+page); await pg.wait_for_timeout(1300)
        await pg.evaluate("document.getElementById('by').value='1990';document.getElementById('by').onchange&&document.getElementById('by').onchange();"+pre)
        await pg.evaluate("document.getElementById('goBtn').click()"); await pg.wait_for_timeout(4200)
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(3000)
        P=await pg.evaluate("window.__P"); print('calls',len(P),[len(x) for x in P])
        if P: open('mock_prompt0.txt','w').write(P[0])
        t=await pg.evaluate("document.getElementById('prem').innerText"); print(t[:400].replace('\n',' | '))
        print('AI제목' in t, 'ERR',errs[:4]); await b.close()
asyncio.run(main())
