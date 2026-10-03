import os,re,glob
from playwright.sync_api import sync_playwright
F='fnt'; css=''
for d in glob.glob(F+'/fontsource-*/'):
    c=open(d+'400.css').read(); c=re.sub(r"url\(\./files/([^)]+)\)",lambda m:f"url(https://fnt.test/{os.path.basename(d.rstrip('/'))}/files/{m.group(1)})",c); css+=c
def ff(r):
    p=r.request.url.split('fnt.test/')[1]; r.fulfill(body=open(F+'/'+p,'rb').read(),content_type='font/woff2' if p.endswith('2') else 'font/woff')
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(body=css,content_type='text/css'))
    pg.route('https://fnt.test/**',ff)
    pg.goto('http://localhost:8812/_ysl_test.html'); pg.wait_for_timeout(2500)
    pg.evaluate("""()=>{ const T=window.__yt(); const me={y:1995,m:6,d:12,h:null,cal:'solar'}; T.setA({me,g:'f',sit:0}); T.setR(T.compute(me)); T.toLetter(false); }""")
    pg.wait_for_timeout(4000)
    pg.evaluate("document.querySelectorAll('#sLet .ink').forEach(e=>e.classList.add('in','done'))"); pg.wait_for_timeout(1500)
    pg.screenshot(path='t/ysl_1.png')
    pg.evaluate("document.getElementById('sLet').scrollTop=760"); pg.wait_for_timeout(800)
    pg.screenshot(path='t/ysl_2.png'); print(errs); b.close()
