from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844})
    pg.goto('http://localhost:8811/seoha-salon.html')
    pg.evaluate("localStorage.setItem('obFace','yin');sessionStorage.setItem('obLow',JSON.stringify({k:'earth'}))")
    pg.reload(); pg.wait_for_timeout(2500)
    print(pg.evaluate("Array.from(document.querySelectorAll('#chRow [data-c]')).map(b=>b.dataset.c+':'+b.querySelector('b').textContent).join(' ')"))
    b.close()
