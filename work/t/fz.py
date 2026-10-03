from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    pg.add_init_script("try{sessionStorage.setItem('obSnd','0')}catch(e){}")
    pg.goto('http://localhost:8812/free.html'); pg.wait_for_timeout(2500)
    pg.screenshot(path='t/fz_top.png'); b.close()
