import asyncio, subprocess, time, json
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8814','-d','export/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8814/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
PAGES=['index.html','today.html','sinnyeon.html','lifetime.html','dohwa.html','gunghap.html','love2.html?m=re','love2.html?m=next','tarot.html','myodang.html','career.html','taegil.html','obgh.html','free.html','ppopgi.html','bujeok.html','dangbeon.html','avatar.html','chat.html','book.html','peach.html','ian-salon.html']
SCROLL="""(()=>{const c=[...document.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e);return /(auto|scroll)/.test(s.overflowY)&&e.scrollHeight>e.clientHeight+50&&e.offsetParent!==null}).sort((a,b)=>b.clientHeight-a.clientHeight)[0]||document.scrollingElement; c.scrollTop=%d; return c.scrollHeight})()"""
OVER="""(()=>{const W=innerWidth,bad=[];document.querySelectorAll('body *').forEach(e=>{const r=e.getBoundingClientRect(); if(r.width>0&&r.right>W+2&&getComputedStyle(e).position!=='fixed'){ let p=e.parentElement, clip=false; while(p){const s=getComputedStyle(p); if(/(hidden|clip|auto|scroll)/.test(s.overflowX)){const pr=p.getBoundingClientRect(); if(pr.right<=W+2){clip=true;break}} p=p.parentElement} if(!clip) bad.push((e.id||e.className||e.tagName).toString().slice(0,40)+':'+Math.round(r.right)); }}); return bad.slice(0,5)})()"""
BROKEN="""[...document.images].filter(i=>i.complete&&i.naturalWidth===0&&i.src&&!i.src.startsWith('data:')).map(i=>i.src.replace(location.origin,'')).slice(0,5)"""
async def main():
  out={}
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    for vw,vh,tag in [(390,844,'m'),(1366,768,'pc')]:
      ctx=await b.new_context(viewport={'width':vw,'height':vh}); pg=await ctx.new_page()
      await pg.goto(U+'today.html'); await pg.evaluate(ME)
      for P in PAGES:
        errs=[]; bad=[]
        h1=lambda e: errs.append(str(e)[:160]); pg.on('pageerror',h1)
        h2=lambda r: bad.append(f"{r.status} {r.url.replace(U,'')}") if r.status>=400 and U in r.url else None; pg.on('response',h2)
        h3=lambda m: errs.append('console:'+m.text[:140]) if m.type=='error' and 'TUNNEL' not in m.text and 'fonts.g' not in m.text else None; pg.on('console',h3)
        try: await pg.goto(U+P,wait_until='load',timeout=20000)
        except Exception as e: errs.append('goto '+str(e)[:80])
        await pg.wait_for_timeout(2500)
        name=P.replace('.html','').replace('?m=','_')
        await pg.screenshot(path=f'aud/{tag}_{name}_0.png')
        ov=await pg.evaluate(OVER); br=await pg.evaluate(BROKEN)
        if tag=='m':
          await pg.evaluate(SCROLL%1100); await pg.wait_for_timeout(700); await pg.screenshot(path=f'aud/{tag}_{name}_1.png')
        pg.remove_listener('pageerror',h1); pg.remove_listener('response',h2); pg.remove_listener('console',h3)
        out[tag+':'+P]={'err':errs,'bad':bad,'over':ov,'broken':br}
      await ctx.close()
    await b.close()
  for k,v in out.items():
    if any(v.values()): print(k, json.dumps(v,ensure_ascii=False))
asyncio.run(main()); srv.terminate()
