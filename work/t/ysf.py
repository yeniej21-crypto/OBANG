from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    pg.goto('http://localhost:8812/love.html'); pg.wait_for_timeout(2500)
    pg.evaluate("document.querySelector('.ysf').scrollIntoView({block:'center'})"); pg.wait_for_timeout(1000)
    pg.locator('.ysf').screenshot(path='t/ysf.png'); b.close()
