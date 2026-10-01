import asyncio, subprocess, time
from playwright.async_api import async_playwright
srv=subprocess.Popen(['python3','-m','http.server','8813','-d','proto'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
U='http://localhost:8813/'
ME="sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))"
OLD="localStorage.setItem('obCards',JSON.stringify([{id:'a',el:'wood',use:'pass',r:0,d:'2026.10.01'},{id:'b',el:'wood',use:'health',r:0,d:'2026.10.01'},{id:'c',el:'water',use:'guard',r:2,d:'2026.10.01'},{id:'d',el:'water',use:'guard',r:0,d:'2026.10.01'}]))"
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':412,'height':900},device_scale_factor=1); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append('console:'+m.text) if m.type=='error' else None)
    await pg.goto(U+'today.html'); await pg.evaluate(ME); await pg.evaluate(OLD)
    await pg.goto(U+'bujeok.html'); await pg.wait_for_timeout(1500)
    await pg.screenshot(path='bjt/1_pick.png')
    await pg.evaluate("document.querySelector('.scr').scrollTop=900"); await pg.wait_for_timeout(400); await pg.screenshot(path='bjt/2_scroll.png')
    await pg.evaluate("document.querySelector('.scr').scrollTop=0")
    await pg.click('[data-k=metal]'); await pg.click('#uses [data-k=money]'); await pg.wait_for_timeout(300)
    await pg.click('#draw'); await pg.wait_for_timeout(1600); await pg.screenshot(path='bjt/3_got.png')
    print('got', await pg.evaluate("[document.body.dataset.bjGot, document.getElementById('rar').textContent, document.getElementById('colN').textContent, localStorage.getItem('obDraw')]"))
    await pg.evaluate("document.querySelector('.scr').scrollTop=document.querySelector('.scr').scrollHeight"); await pg.wait_for_timeout(500); await pg.screenshot(path='bjt/4_dex.png')
    await pg.reload(); await pg.wait_for_timeout(1500); print('after reload mode', await pg.evaluate("document.body.dataset.bjGot"), await pg.evaluate("document.getElementById('cT').textContent"))
    await pg.click('#bjMore'); await pg.wait_for_timeout(800); await pg.screenshot(path='bjt/5_pay.png')
    await pg.click('.obp [data-agree]'); await pg.click('.obp [data-pay]'); await pg.wait_for_timeout(3000)
    print('after pay mode', await pg.evaluate("[document.body.dataset.bjGot, document.getElementById('draw').textContent]"))
    await pg.click('[data-k=fire]'); await pg.click('#uses [data-k=love]'); await pg.click('#draw'); await pg.wait_for_timeout(1500)
    print('2nd', await pg.evaluate("[document.getElementById('cT').textContent, document.getElementById('rar').textContent, document.getElementById('colN').textContent]"))
    await pg.click('.grid .c.has'); await pg.wait_for_timeout(2000); await pg.screenshot(path='bjt/6_view.png')
    print('errs',errs); await b.close()
asyncio.run(main()); srv.terminate()
