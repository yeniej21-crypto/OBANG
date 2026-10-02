# 무료 타로 흐름 검사: ?t=topic 로 들어가서 섞기 → 리본에서 고르기 → 공개 → 풀이까지
import asyncio, sys
from playwright.async_api import async_playwright
U='http://localhost:8766/tarot.html'
TAG=sys.argv[1] if len(sys.argv)>1 else 'x'
TOPICS=sys.argv[2].split(',') if len(sys.argv)>2 else ['love','heart','flow','contact','month']
async def run(b,topic):
    pg=await b.new_page(viewport={'width':400,'height':860})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto(f'{U}?t={topic}'); await pg.wait_for_timeout(1200)
    await pg.evaluate("document.querySelectorAll('video').forEach(v=>{ try{ v.dispatchEvent(new Event('ended')); }catch(e){} })")
    await pg.evaluate("document.querySelectorAll('.mi, .menuintro, [class*=intro]').forEach(e=>{ if(e.style) e.style.display='none'; })")
    await pg.evaluate("document.getElementById('go1').click()"); await pg.wait_for_timeout(900)
    bb=await (await pg.query_selector('#deckArea')).bounding_box()
    cx,cy=bb['x']+bb['width']/2,bb['y']+bb['height']*.58
    await pg.mouse.move(cx,cy); await pg.mouse.down()
    for i in range(34):
        await pg.mouse.move(cx+((i%2)*30-15),cy); await pg.wait_for_timeout(80)
        if i==8: await pg.screenshot(path=f'/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/tp_{TAG}_{topic}_a.png')
    await pg.mouse.up(); await pg.wait_for_timeout(2200)
    await pg.screenshot(path=f'/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/tp_{TAG}_{topic}_b.png')
    n=await pg.evaluate("TarotDev.S.n")
    tries=0
    while tries<14:
        k=await pg.evaluate("TarotDev.S.picked.length")
        if k>=n: break
        tries+=1
        G=await pg.evaluate("(()=>{ const c=document.querySelector('#deckArea .cd.ctr'); if(!c) return null; const r=c.getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2]; })()")
        if not G: await pg.wait_for_timeout(400); continue
        if k==0:
            await pg.mouse.move(G[0],G[1]); await pg.mouse.down()
            for j in range(10): await pg.mouse.move(G[0],G[1]-j*12); await pg.wait_for_timeout(16)
            await pg.mouse.up()
        else:
            await pg.mouse.move(G[0],G[1]); await pg.mouse.down(); await pg.wait_for_timeout(90); await pg.mouse.up()
        await pg.wait_for_timeout(600)
        if k==0: await pg.screenshot(path=f'/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/tp_{TAG}_{topic}_b2.png')
        await pg.mouse.move(cx+60,G[1]); await pg.mouse.down()
        for j in range(8): await pg.mouse.move(cx+60-j*14,G[1]); await pg.wait_for_timeout(16)
        await pg.mouse.up(); await pg.wait_for_timeout(900)
    await pg.screenshot(path=f'/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/tp_{TAG}_{topic}_c.png')
    await pg.wait_for_timeout(1500)
    picked=await pg.evaluate("TarotDev.S.picked.slice()")
    s3=await pg.evaluate("document.getElementById('s3').classList.contains('on')")
    # 공개: 아직 안 뒤집힌 카드를 하나씩
    for i in range(n*3):
        left=await pg.evaluate("document.querySelectorAll('#row .fc:not(.flip)').length")
        if not left: break
        await pg.evaluate("document.querySelector('#row .fc:not(.flip)').click()"); await pg.wait_for_timeout(1800)
        if i==0: await pg.screenshot(path=f'/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/tp_{TAG}_{topic}_d.png')
        await pg.evaluate("document.getElementById('spot').click()"); await pg.wait_for_timeout(1000)
    for i in range(8):
        if await pg.evaluate("document.getElementById('s4').classList.contains('on')"): break
        await pg.wait_for_timeout(1000); await pg.evaluate("document.getElementById('rx').classList.contains('on')&&document.getElementById('rxX').click()")
    await pg.wait_for_timeout(800)
    s4=await pg.evaluate("document.getElementById('s4').classList.contains('on')")
    await pg.screenshot(path=f'/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/tp_{TAG}_{topic}_e.png')
    hs=await pg.evaluate("document.documentElement.scrollWidth>innerWidth")
    print(topic,'n',n,'picked',picked,'s3',s3,'s4',s4,'hscroll',hs,'ERR',errs)
    await pg.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for t in TOPICS: await run(b,t)
        await b.close()
asyncio.run(main())
