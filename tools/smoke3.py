import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8767','-d','ptest2'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
INIT=r"""
window.__g=[];const _o=window.AudioContext;window.AudioContext=function(){const a=new _o();const cg=a.createGain.bind(a);a.createGain=()=>{const g=cg();window.__gn=g;return g};return a};
window.__log=[];
document.addEventListener('playing',e=>{const v=e.target; if(v.muted) return;
  const o=[...document.querySelectorAll('video')].find(x=>x!==v);
  const rem=o&&o.duration&&!o.paused?(o.duration-o.currentTime):null;
  window.__log.push({t:performance.now()|0,key:v._key,blob:String(v.currentSrc).startsWith('blob:'),otherRemaining:rem==null?null:+rem.toFixed(3)});},true);
"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--autoplay-policy=no-user-gesture-required"])
        pg=await b.new_page(viewport={"width":390,"height":844})
        errs=[]; pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None); pg.on("pageerror",lambda e: errs.append(str(e)))
        await pg.add_init_script(INIT)
        t0=time.time(); await pg.goto("http://localhost:8767/index.html")
        await pg.wait_for_selector("#enter:not([disabled])",timeout=20000); print("enter ready in %.2fs"%(time.time()-t0), await pg.inner_text('#loadtxt'))
        await pg.screenshot(path="ian_start.png")
        await pg.click("#enter")
        await pg.wait_for_selector("#pChoice.on",timeout=40000)
        await pg.wait_for_timeout(800); c=await pg.evaluate("performance.now()|0"); await pg.click("#c1a"); await pg.wait_for_selector("#pBirth.on",timeout=40000)
        await pg.wait_for_timeout(800); await pg.click("#birthGo"); await pg.wait_for_selector("#pWorry.on",timeout=60000)
        await pg.wait_for_timeout(800); await pg.click("#worrySkip"); await pg.wait_for_selector("#result.on",timeout=90000)
        log=await pg.evaluate("window.__log")
        print("click c1b at",c)
        for l in log: print(l)
        print("errors:",errs[:5]); await pg.screenshot(path="ian_result.png")
        await b.close()
asyncio.run(main()); srv.terminate()
