from playwright.sync_api import sync_playwright
R={'7f843edf':'sb/t_sts.png','4ea3150d':'sb/t_cute.png','70dfb768':'sb/t_wx.png','e6586493':'sb/t_cute.png'}
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    pg.on('pageerror',lambda e:errs.append(str(e)))
    for k,f in R.items():
        pg.route(f'**/*{k}*',(lambda dd:(lambda r:r.fulfill(body=dd,content_type='image/png')))(open(f,'rb').read()))
    pg.add_init_script("try{localStorage.setItem('obMe',JSON.stringify({cal:'s',y:1996,m:5,d:14,g:'f',h:null}))}catch(e){}")
    pg.goto('http://localhost:8812/love_v4.html'); pg.wait_for_timeout(3000)
    pg.screenshot(path='t/lv4_0.png')
    pg.evaluate("window.scrollTo(0,document.getElementById('secWx').offsetTop-70)"); pg.wait_for_timeout(1200)
    pg.screenshot(path='t/lv4_1.png'); print(errs); b.close()
