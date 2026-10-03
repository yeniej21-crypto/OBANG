import asyncio,re,os,json
from playwright.async_api import async_playwright
SP=os.path.dirname(os.path.abspath(__file__))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        # (a) 저장된 내 정보 → 그대로 보기
        ctx=await b.new_context(viewport={'width':400,'height':860}); pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route(re.compile(r'.*cloudfront\.net.*'),lambda r:r.abort())
        await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.evaluate("sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))")
        await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(900); await pg.evaluate("document.querySelectorAll('.mi .x').forEach(b=>b.click())"); await pg.wait_for_timeout(3300)
        await pg.click('#nxSit'); await pg.wait_for_timeout(2600); await pg.screenshot(path=SP+'/t/hm_p_back.png')
        await pg.click('#nxSame'); await pg.wait_for_timeout(2600); print('a cur',await pg.evaluate("cur"), await pg.evaluate("document.getElementById('rTitle').textContent"))
        # 결과까지 빨리 → 보관함 항목 만들기
        await pg.evaluate("show('sRep')"); await pg.wait_for_timeout(4000)
        arch=await pg.evaluate("localStorage.getItem('obArch')"); it=json.loads(arch)[0] if arch else None; print('archived',it and it['h'],it and it['sub'])
        # 뒤로(풀이 → 방)
        await pg.click('#back2'); await pg.wait_for_timeout(1500); await pg.screenshot(path=SP+'/t/hm_p_back2.png')
        # (b) 보관함에서 다시 열기(#re)
        await pg.evaluate(f"sessionStorage.setItem('obRe',{json.dumps(json.dumps(it))})")
        await pg.goto('http://localhost:8766/sinnyeon.html#re'); await pg.wait_for_timeout(3000)
        print('b reopen cur',await pg.evaluate("cur"),await pg.evaluate("document.getElementById('rTitle').textContent"), 'mi',await pg.evaluate("!!document.querySelector('.mi')"))
        await pg.screenshot(path=SP+'/t/hm_p_reopen.png')
        print('ERR a/b',errs[:4]); await ctx.close()
        # (c) 움직임 줄이기
        ctx=await b.new_context(viewport={'width':400,'height':860},reduced_motion='reduce'); pg=await ctx.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.route(re.compile(r'.*cloudfront\.net.*'),lambda r:r.abort())
        await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(900); await pg.evaluate("document.querySelectorAll('.mi .x').forEach(b=>b.click())"); await pg.wait_for_timeout(2000)
        await pg.evaluate("go()"); await pg.wait_for_function("document.getElementById('rTake').classList.contains('on')",timeout=8000); await pg.click('#takeBtn'); await pg.wait_for_timeout(800); await pg.click('#rSkip'); await pg.wait_for_timeout(1500)
        print('c rice',await pg.evaluate("[RICE.mode,document.getElementById('rNext').classList.contains('on')]"))
        await pg.click('#toScroll'); await pg.wait_for_timeout(1200); print('c scroll unrolled',await pg.evaluate("[MS.unrolled,document.getElementById('mscroll').className]"))
        await pg.keyboard.press('ArrowRight'); await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(200); print('c idx',await pg.evaluate("MS.i"))
        await pg.screenshot(path=SP+'/t/hm_p_rm.png'); print('ERR c',errs[:4]); await ctx.close()
        # (d) 인트로 게이트(자동 재생 막힘) 상태 화면
        ctx=await b.new_context(viewport={'width':400,'height':860}); pg=await ctx.new_page()
        await pg.goto('http://localhost:8766/sinnyeon.html'); await pg.wait_for_timeout(1500); await pg.screenshot(path=SP+'/t/hm_p_gate.png')
        print('d gate',await pg.evaluate("[!!document.querySelector('.mi'),document.querySelector('.mi .gate')&&document.querySelector('.mi .gate').className, cur, talked]"))
        await b.close()
asyncio.run(main())
