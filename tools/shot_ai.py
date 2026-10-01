import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':420,'height':900},device_scale_factor=2)
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("""window.__P=[]; window.claude={use:async n=>{ if(n!=='sample') return null; const f=async()=>({text:''}); f.json=async(prompt)=>{ window.__P.push(prompt); await new Promise(r=>setTimeout(r,300)); if(prompt.includes('대상 달 번호')){ const ids=prompt.match(/대상 달 번호: ([0-9, ]+)/)[1].split(',').map(x=>+x); return ids.map(i=>({i,tag:'테스트 제목 '+i,god:'당번 한마디',total:'AI 총운 '+i,love:'연애',money:'돈',work:'일',people:'사람',body:'몸',do:'하기',avoid:'말기'})); } return {cover:{words:['가','나','다'],line:'{N}, 테스트'},pan:['판1','판2'],threshold:'대운',blank:'빈칸',areas:{love:{sum:'s',tip:'t'},money:{sum:'s',tip:'t'},work:{sum:'s',tip:'t'},people:{sum:'s',tip:'t'},body:{sum:'s',tip:'t'}},best:{'7':'b'},warn:{'3':'w'},letter:['{N}.','편지']}; }; return f; }};""")
        await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(1200)
        await pg.evaluate("document.getElementById('by').value='1990';document.getElementById('by').onchange();document.getElementById('goBtn').click()"); await pg.wait_for_timeout(3600)
        await pg.evaluate("document.getElementById('payBtn').click()"); await pg.wait_for_timeout(2500)
        P=await pg.evaluate("window.__P"); print('calls',len(P)); print(len(P[0]),len(P[1])); open('../prompt_year.txt','w').write(P[0]); open('../prompt_mon.txt','w').write(P[1])
        t=await pg.evaluate("document.getElementById('prem').innerText.slice(0,600)"); print(t)
        print('ERR',errs); await b.close()
asyncio.run(main())
