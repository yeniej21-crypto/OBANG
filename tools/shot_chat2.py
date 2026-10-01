import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--host-resolver-rules=MAP obang.test 127.0.0.1']); pg=await b.new_page(viewport={'width':420,'height':900})
        errs=[]; pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: errs.append('console:'+m.text) if m.type=='error' else None)
        got={}
        async def handle(route):
            body=json.loads(route.request.post_data); got['n']=len(body['messages']); got['len0']=len(body['messages'][0]['content']); got['has']='[사주 사실]' in body['messages'][0]['content']
            await route.fulfill(status=200,content_type='application/json',body=json.dumps({'text':'테스트 답이야. [[근거:F1]] [[추천:하나|둘]]'}))
        await pg.route('**/api/chat',handle)
        await pg.add_init_script("window.claude={use:async n=>{ const f=async(inp,o)=>{ if(o&&o.onText) o.onText({text:'샘플 경로 답'}); return {text:'샘플 경로 답 [[근거:F1]]'}; }; f.limits=async()=>({tools:false}); return f; }}")
        await pg.goto('http://obang.test:8766/chat.html'); await pg.evaluate("sessionStorage.setItem('me',JSON.stringify({name:'은주',g:'f',cal:'s',y:1993,m:12,d:3,h:10}))")
        await pg.goto('http://obang.test:8766/chat.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate("document.querySelector('[data-k]').click()"); await pg.wait_for_timeout(1200)
        await pg.evaluate("document.querySelector('.ak-in input').value='올해 연애운 어때'; document.querySelector('.ak-in input').dispatchEvent(new Event('input')); document.querySelector('.ak-in button').click()")
        await pg.wait_for_timeout(2500)
        print(await pg.evaluate("[...document.querySelectorAll('.ak-m')].map(e=>e.className+': '+e.textContent.slice(0,80)).join(' || ')"))
        await pg.screenshot(path='chat0.png')
        print('ERR',errs[:5],got); await b.close()
asyncio.run(main())
