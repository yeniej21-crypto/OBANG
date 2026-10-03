# 연서당 영상판 무작위 점검: 생일 · 성별 · 요즘 상황을 바꿔 가며 끝까지 가 보고 화면 글자와 편지지 넘침을 본다
import asyncio, random, re, sys, json
from playwright.async_api import async_playwright
N=int(sys.argv[1]) if len(sys.argv)>1 else 10
W=int(sys.argv[2]) if len(sys.argv)>2 else 400
random.seed(int(sys.argv[3]) if len(sys.argv)>3 else 7)
S='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad'
FONT_CSS=''
for pkg,files in [('fontsource-nanum-pen-script-5.3.0',['400.css']),('fontsource-noto-serif-kr-5.3.0',['korean-500.css','korean-600.css','korean-700.css','korean-900.css','latin-700.css'])]:
    for f in files:
        css=open(f'{S}/tfont/{pkg}/package/{f}').read(); FONT_CSS+=css.replace('./files/',f'https://tfont.local/{pkg}/package/files/')
NOFONT='nofont' in sys.argv
async def route_font(route): await route.fulfill(body=FONT_CSS,content_type='text/css')
async def route_tf(route): await route.fulfill(path=route.request.url.replace('https://tfont.local/',S+'/tfont/'),content_type='font/woff2',headers={'Access-Control-Allow-Origin':'*'})
BAD=re.compile(r'[?!…一-鿿]|undefined|NaN|null|\[object')
async def run(b,case):
    ctx=await b.new_context(viewport={'width':W,'height':860},reduced_motion='reduce')
    await ctx.route(re.compile(r'https://(d8j0ntlcm91z4|d2ol7oe51mr4n9)\.cloudfront\.net/.*'),lambda r:r.abort())
    if NOFONT: await ctx.route('**/fonts.googleapis.com/**',lambda r:r.abort())
    else: await ctx.route('**/fonts.googleapis.com/**',route_font); await ctx.route('https://tfont.local/**',route_tf)
    pg=await ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m: m.type=='error' and 'net::' not in m.text and 'Failed to load' not in m.text and errs.append(m.text))
    await pg.goto('http://localhost:8766/yeonseo.html'); await pg.wait_for_timeout(500)
    await pg.click('#startMute'); await pg.wait_for_selector('#itx2.on',timeout=15000); await pg.click('#goIn')
    await pg.wait_for_selector('#kGo',state='visible',timeout=20000)
    if case['cal']=='l': await pg.click('#kCal button[data-v=l]')
    await pg.select_option('#kY',str(case['y'])); await pg.select_option('#kM',str(case['m'])); await pg.select_option('#kD',str(case['d']))
    await pg.select_option('#kH',case['h'])
    await pg.click('#kGo')
    if await pg.locator('#kGo').is_visible():  # 없는 음력 날짜
        await pg.select_option('#kD','1'); await pg.click('#kGo')
    await pg.wait_for_selector('.chips button',state='visible',timeout=20000); await pg.click(f'.chips button >> nth={case["g"]}')
    await pg.wait_for_timeout(900); await pg.wait_for_selector('.chips button >> nth=3',state='visible',timeout=20000); await pg.click(f'.chips button >> nth={case["s"]}')
    await pg.wait_for_selector('#dBt.on',timeout=30000)
    txt=await pg.evaluate("document.getElementById('sDrw').innerText")
    await pg.click('#dGo'); await pg.wait_for_selector('#sSeal.on',timeout=10000); await pg.wait_for_timeout(300)
    txt+=await pg.evaluate("document.getElementById('sSeal').innerText")
    await pg.click('#sSkip'); await pg.wait_for_selector('#sLet.on',timeout=20000); await pg.wait_for_timeout(800)
    txt+=await pg.evaluate("document.getElementById('sLet').innerText")
    m=await pg.evaluate("""()=>{const r={}; for(const id of ['pg1','pg2']){ const p=document.getElementById(id), w=p.getBoundingClientRect().width, nat=w*1910/1080;
        const inks=[...p.querySelectorAll('.ink')]; const top=p.getBoundingClientRect().top; const last=Math.max(...inks.map(e=>e.getBoundingClientRect().bottom-top));
        r[id]={h:Math.round(p.offsetHeight),nat:Math.round(nat),last:+(last/nat).toFixed(3)}; }
        r.sw=document.documentElement.scrollWidth; r.lw=document.getElementById('sLet').scrollWidth-document.getElementById('sLet').clientWidth; r.month=document.querySelector('#pg1 .m').textContent; return r;}""")
    await ctx.close()
    bad=sorted(set(BAD.findall(txt)))
    return m,bad,errs
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for k in range(N):
            case={'cal':random.choice('ssl'),'y':random.randint(1962,2006),'m':random.randint(1,12),'d':random.randint(1,28),'h':random.choice(['']+[str(i) for i in range(12)]),'g':random.randint(0,1),'s':random.randint(0,3)}
            try:
                m,bad,errs=await run(b,case); print(json.dumps(case),'|',json.dumps(m,ensure_ascii=False),'| BAD',bad,'| ERR',errs[:3],flush=True)
            except Exception as e: print(json.dumps(case),'FAIL',str(e)[:200],flush=True)
        await b.close()
asyncio.run(main())
