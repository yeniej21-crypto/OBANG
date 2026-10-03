from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.add_init_script("try{sessionStorage.setItem('obSnd','0')}catch(e){}")
    pg.goto('http://localhost:8812/meokmul.html?test=1'); pg.wait_for_timeout(5000)
    pg.screenshot(path='t/m_a.png')
    pg.click('.cd[data-i="3"]'); pg.wait_for_timeout(2200); pg.screenshot(path='t/m_b.png')
    pg.wait_for_timeout(4000); pg.screenshot(path='t/m_c.png')
    print(errs, pg.evaluate("document.getElementById('res').className"))
    b.close()
