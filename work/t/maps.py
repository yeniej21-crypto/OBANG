import asyncio
from playwright.async_api import async_playwright
from PIL import Image
S='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/t/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':400,'height':860})
        await pg.goto('http://localhost:8766/love2.html?m=re'); await pg.wait_for_timeout(600); fs=[]
        for k,(y,m,d,pt) in enumerate([(1977,9,8,'1980'),(1983,3,28,'1975'),(2000,6,15,'x'),(1992,4,21,'1999')]):
            await pg.evaluate(f"document.getElementById('by').value={y};document.getElementById('bm').value={m};document.getElementById('bd').value={d};document.getElementById('py').value='{pt}';document.getElementById('py').onchange();document.getElementById('goBtn').click()")
            await pg.wait_for_timeout(2300); el=await pg.query_selector('.l2-map'); f=S+f'map{k}.png'; await el.screenshot(path=f); fs.append(f)
            await pg.evaluate("document.getElementById('again').click()"); await pg.wait_for_timeout(400)
        ims=[Image.open(f) for f in fs]; w=sum(i.size[0] for i in ims); h=max(i.size[1] for i in ims); sh=Image.new('RGB',(w,h),'white'); x=0
        for i in ims: sh.paste(i,(x,0)); x+=i.size[0]
        sh.save(S+'maps.png'); await b.close()
asyncio.run(main())
