from playwright.sync_api import sync_playwright
B=open('sb/B.png','rb').read()
with sync_playwright() as p:
    b=p.chromium.launch()
    for w in (390,360):
        pg=b.new_page(viewport={'width':w,'height':844},device_scale_factor=2)
        pg.route('**/*33b4e7df*', lambda r: r.fulfill(body=B,content_type='image/png'))
        pg.add_init_script("try{sessionStorage.setItem('toHome','1');sessionStorage.setItem('obSnd','0')}catch(e){}")
        pg.goto('http://localhost:8812/home_v2.html'); pg.wait_for_timeout(3000)
        pg.evaluate("document.getElementById('lhub').scrollIntoView({block:'center'})"); pg.wait_for_timeout(1200)
        pg.locator('#lhub').screenshot(path=f't/lhv3_{w}.png')
    b.close()
