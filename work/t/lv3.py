from playwright.sync_api import sync_playwright
A=open('sb/shA.png','rb').read(); C=open('sb/shC.png','rb').read()
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    for tag,q in (('a2',''),('c4','?s=c&g=4')):
        pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.route('**/*4f844788*',lambda r:r.fulfill(body=A,content_type='image/png'))
        pg.route('**/*6bca47ec*',lambda r:r.fulfill(body=C,content_type='image/png'))
        pg.add_init_script("try{localStorage.setItem('obMe',JSON.stringify({cal:'s',y:1996,m:5,d:14,g:'f',h:null}));sessionStorage.setItem('obSnd','0')}catch(e){}")
        pg.goto('http://localhost:8812/love_v3.html'+q); pg.wait_for_timeout(2500)
        pg.evaluate("document.getElementById('secWx').scrollIntoView()"); pg.wait_for_timeout(1500)
        pg.screenshot(path=f't/lv3_{tag}_1.png')
        pg.evaluate("window.scrollBy(0,560)"); pg.wait_for_timeout(800)
        pg.screenshot(path=f't/lv3_{tag}_2.png')
    print(errs); b.close()
