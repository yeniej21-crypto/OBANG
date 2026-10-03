from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.add_init_script("try{sessionStorage.setItem('obSnd','0');localStorage.removeItem('obMeok')}catch(e){}")
    pg.goto('http://localhost:8812/meokmul.html'); pg.wait_for_timeout(2500)
    pg.screenshot(path='t/mk0.png')
    pg.click('.cd[data-i="3"]'); pg.wait_for_timeout(2500)
    pg.screenshot(path='t/mk1.png',full_page=True)
    print(errs, pg.evaluate("localStorage.getItem('obMeok')"))
    b.close()
