from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    pg.add_init_script("try{sessionStorage.setItem('toHome','1');sessionStorage.setItem('obSnd','0')}catch(e){}")
    pg.goto('http://localhost:8812/seoha-salon.html'); pg.wait_for_timeout(3500)
    pg.evaluate("document.getElementById('chRow').scrollIntoView({block:'center'})"); pg.wait_for_timeout(1200)
    pg.locator('#chRow').screenshot(path='t/chrow.png')
    pg.evaluate("document.getElementById('chRow').scrollLeft=400"); pg.wait_for_timeout(600)
    pg.locator('#chRow').screenshot(path='t/chrow2.png'); b.close()
