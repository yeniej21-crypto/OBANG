import asyncio, subprocess, time, json
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8815','-d','export/site'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8815/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
PAGES=['today.html','sinnyeon.html','lifetime.html','dohwa.html','gunghap.html','love2.html?m=re','love2.html?m=next','tarot.html','myodang.html','career.html','taegil.html','obgh.html','free.html','ppopgi.html','bujeok.html','dangbeon.html','avatar.html','chat.html','book.html','peach.html']
JS="""(()=>{const b=[...document.querySelectorAll('button,a')].find(e=>{const r=e.getBoundingClientRect();return r.top<90&&r.left<80&&r.width>20&&r.width<70&&e.offsetParent});
 if(!b) return {none:1}; let p=b, bar=null; while(p&&p!==document.body){const s=getComputedStyle(p); if(/(absolute|fixed|sticky)/.test(s.position)){bar=p;break} p=p.parentElement}
 if(!bar) return {inflow:1, id:b.id};
 const s=getComputedStyle(bar), r=bar.getBoundingClientRect();
 return {bar:(bar.id?'#'+bar.id:'')+'.'+[...bar.classList].join('.'), tag:bar.tagName, bg:s.backgroundColor, bgi:s.backgroundImage.slice(0,40), h:Math.round(r.height), pos:s.position}})()"""
SCROLL="""(()=>{const c=[...document.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e);return /(auto|scroll)/.test(s.overflowY)&&e.scrollHeight>e.clientHeight+50&&e.offsetParent!==null}).sort((a,b)=>b.clientHeight-a.clientHeight)[0]; if(!c) return 'none'; c.scrollTop=1100; return (c.id?'#'+c.id:'')+'.'+[...c.classList].join('.')})()"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':390,'height':844}); pg=await ctx.new_page()
    await pg.goto(U+'today.html'); await pg.evaluate(ME)
    for P in PAGES:
      await pg.goto(U+P); await pg.wait_for_timeout(2000)
      sc=await pg.evaluate(SCROLL); await pg.wait_for_timeout(300)
      print(P, sc, json.dumps(await pg.evaluate(JS),ensure_ascii=False))
    await b.close()
asyncio.run(main()); srv.terminate()
