import asyncio
from playwright.async_api import async_playwright
MOCK="""
window.__calls=[];
window.claude={use:async(n)=>{ if(n!=='sample') return null; const f=async(input,o)=>{ window.__calls.push(input); let tr=null; if(o.tools){ tr=await o.tools[0].execute({year:1994,month:3,day:8}); }
  const t='누나, 그 사람 사주 보니까 일지끼리 부딪히는 기운이 있어. 끌리긴 하는데 싸우면 크게 싸우는 사이야. 그래도 2027년 9월엔 누나 도화가 피니까 그때 다시 가까워질 수 있어.\\n[[근거:F5,F12,F99]]\\n[[추천:언제 연락하면 좋아?|내가 먼저 해도 돼?]]';
  o.onText&&o.onText({text:t.slice(0,40),delta:''}); await new Promise(r=>setTimeout(r,300)); o.onText&&o.onText({text:t,delta:''}); window.__tool=tr; return {text:t,truncated:false}; };
  f.limits=async()=>({maxPromptBytes:262144,tools:{maxCount:8}}); return f; }};
"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.add_init_script(MOCK)
    await pg.goto('http://localhost:8766/dohwa.html'); await pg.wait_for_timeout(700)
    await pg.evaluate("S.name='김은주';S.nick='은주';S.date={y:1996,m:5,d:14,cal:'양력'};S.hour=6;R=saju(1996,5,14,6,'양력');document.getElementById('splash').classList.add('off');")
    await pg.evaluate("void showResult()"); await pg.wait_for_timeout(8000)
    await pg.click('.askBox .qs button'); await pg.wait_for_timeout(1500)
    await pg.click('.ak-ev button'); await pg.wait_for_timeout(300); await pg.screenshot(path='a0.png')
    c=await pg.evaluate("window.__calls[0]"); print(len(c[0]['content']),'chars'); print(c[0]['content'][:2600]); print('TOOL',await pg.evaluate("JSON.stringify(window.__tool)"))
    await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(600); await pg.fill('#nm','김은주'); await pg.click('#goBtn'); await pg.wait_for_timeout(3600)
    await pg.evaluate("document.querySelector('.askS').scrollIntoView()"); await pg.wait_for_timeout(300); await pg.screenshot(path='a1.png')
    await pg.click('.askS .qs button'); await pg.wait_for_timeout(1500); await pg.screenshot(path='a2.png')
    print(errs); await b.close()
asyncio.run(main())
