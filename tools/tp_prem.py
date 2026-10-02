# 프리미엄 열 장 고르기(리본) 검사
import asyncio, sys
from playwright.async_api import async_playwright
SP='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad'
MOCK=open(SP+'/mock2.js').read()
TAG=sys.argv[1] if len(sys.argv)>1 else 'p'
RM=len(sys.argv)>2 and sys.argv[2]=='rm'
W=int(sys.argv[3]) if len(sys.argv)>3 else 400
H=int(sys.argv[4]) if len(sys.argv)>4 else 860
def P(n): return f'{SP}/t/tp_{TAG}_{n}.png'
CTR="(()=>{ const c=document.querySelector('.tpk-area .cd.ctr'); if(!c) return null; const r=c.getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2]; })()"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':W,'height':H},reduced_motion='reduce' if RM else 'no-preference')
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script(MOCK)
        await pg.goto('http://localhost:8766/tarot.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("const T=TarotDev, S=T.S; S.q='그 사람이 먼저 연락할까'; S.topic='love'; S.n=3; S.A=T.R.analyze(S.q); S.k='love'; T.setPos(TAROT_SPREAD.love.pos.slice()); S.kinds=T.R.KINDS.love; S.picked=[6,17,19]; S.rv=[false,true,false]; S.mood='good'; T.render();")
        await pg.wait_for_timeout(1200); await pg.evaluate("const b=document.getElementById('payBtn'); b.dataset.obpaid='1'; b.click()")
        await pg.wait_for_timeout(700); await pg.screenshot(path=P('0shuffle'))
        await pg.wait_for_timeout(2600); await pg.screenshot(path=P('1spread'))
        async def got(): return await pg.evaluate("document.querySelector('.tpk-n em').textContent")
        async def pick(mode):
            G=await pg.evaluate(CTR)
            if not G: return False
            if mode=='pull':
                await pg.mouse.move(G[0],G[1]); await pg.mouse.down()
                for j in range(12): await pg.mouse.move(G[0]+j*1.5,G[1]-j*14); await pg.wait_for_timeout(16)
                await pg.mouse.up()
            else:
                await pg.mouse.move(G[0],G[1]); await pg.mouse.down(); await pg.wait_for_timeout(80); await pg.mouse.up()
            return True
        async def swipe(d):
            G=await pg.evaluate(CTR); y=G[1] if G else H*.7; x=W/2
            await pg.mouse.move(x,y); await pg.mouse.down()
            for j in range(8): await pg.mouse.move(x+d*j*16,y); await pg.wait_for_timeout(14)
            await pg.mouse.up(); await pg.wait_for_timeout(900)
        # 1장: 위로 밀어 올리기 (날아가는 중간 캡처)
        await pg.mouse.move(W/2,H*.5)
        G=await pg.evaluate(CTR); await pg.mouse.move(G[0],G[1]); await pg.mouse.down()
        for j in range(7): await pg.mouse.move(G[0],G[1]-j*12); await pg.wait_for_timeout(16)
        await pg.screenshot(path=P('2pull'))
        for j in range(7,12): await pg.mouse.move(G[0],G[1]-j*12); await pg.wait_for_timeout(16)
        await pg.mouse.up(); await pg.wait_for_timeout(330); await pg.screenshot(path=P('3fly')); await pg.wait_for_timeout(700)
        await swipe(-1)
        await pick('tap'); await pg.wait_for_timeout(1000); await swipe(1)
        await pick('tap'); await pg.wait_for_timeout(1000)
        print('after 3 picks',await got())
        await pg.screenshot(path=P('4three'))
        # 되돌리기
        await pg.evaluate("document.querySelector('.tpk-un').click()"); await pg.wait_for_timeout(300); await pg.screenshot(path=P('5undo_mid')); await pg.wait_for_timeout(900)
        print('after undo',await got(), 'ribbon cards visible', await pg.evaluate("document.querySelectorAll('.tpk-area .cd:not(.gone)').length"))
        # 다시 섞기
        await pg.evaluate("document.querySelector('.tpk-re').click()"); await pg.wait_for_timeout(500); await pg.screenshot(path=P('6reshuffle'))
        await pg.wait_for_timeout(3000); await pg.screenshot(path=P('7reshuffled'))
        # 닫기 → 요약 → 이어서
        await pg.evaluate("document.querySelector('.tpk-x').click()"); await pg.wait_for_timeout(700)
        await pg.evaluate("(()=>{ const sc=document.getElementById('s4s'), h=document.getElementById('rprem'); sc.scrollTop+=h.getBoundingClientRect().top-60; })()"); await pg.wait_for_timeout(300); await pg.screenshot(path=P('8closed'))
        await pg.evaluate("document.querySelector('#rprem .tp-go').click()"); await pg.wait_for_timeout(900)
        # 키보드로 한 장
        await pg.focus('.tpk-area'); await pg.keyboard.press('ArrowRight'); await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(400); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(1000)
        print('after keyboard',await got())
        n=0
        while int(await got())<10 and n<30:
            n+=1; await pick('tap' if n%2 else 'pull'); await pg.wait_for_timeout(900)
            if n%3==0: await swipe(-1 if n%2 else 1)
        await pg.wait_for_timeout(900); await pg.screenshot(path=P('9ten'))
        print('picked',await got(),'go enabled',await pg.evaluate("!document.querySelector('.tpk .tpk-go').disabled"))
        await pg.evaluate("document.querySelector('.tpk .tpk-go').click()"); await pg.wait_for_timeout(2500)
        cc=await pg.evaluate("TarotDev.S.cc&&TarotDev.S.cc.map(x=>x.n+(x.rv?'r':''))")
        print('cc',cc,'unique',len(set(x.rstrip('r') for x in cc)) if cc else None)
        await pg.evaluate("(()=>{ const sc=document.getElementById('s4s'), h=document.getElementById('rprem'); sc.scrollTop+=h.getBoundingClientRect().top-60; })()"); await pg.wait_for_timeout(500); await pg.screenshot(path=P('10reading'))
        st=await pg.evaluate("({tpk:!!document.querySelector('.tpk'),cls:document.getElementById('stage').className,s4:getComputedStyle(document.getElementById('s4')).visibility,hs:document.documentElement.scrollWidth>innerWidth,top:getComputedStyle(document.querySelector('.top')).opacity})")
        print(st); print('ERR',errs); await b.close()
asyncio.run(main())
