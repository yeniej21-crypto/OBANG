from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8812/yeonseo.html'); pg.wait_for_timeout(2000)
    o1=pg.evaluate("getComputedStyle(document.querySelector('#sIn .scrB')).opacity")
    pg.click('#startMute'); pg.wait_for_timeout(800)
    o2=pg.evaluate("getComputedStyle(document.querySelector('#sIn .scrB')).opacity")
    pg.wait_for_timeout(9000)
    o3=pg.evaluate("[getComputedStyle(document.querySelector('#sIn .scrB')).opacity,document.getElementById('itx2').className]")
    print(errs,o1,o2,o3); b.close()
