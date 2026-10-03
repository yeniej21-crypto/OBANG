from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=3)
    pg.add_init_script("try{sessionStorage.setItem('toHome','1');sessionStorage.setItem('obSnd','0')}catch(e){}")
    pg.goto('http://localhost:8812/seoha-salon.html'); pg.wait_for_timeout(3500)
    pg.evaluate("document.getElementById('lhub').scrollIntoView({block:'center'})"); pg.wait_for_timeout(1500)
    pg.locator('#lhub').screenshot(path='t/lhub3.png')
    print(pg.evaluate("(()=>{const i=document.querySelector('#lhub .pp');const cs=getComputedStyle(i);return [i.currentSrc,cs.opacity,cs.filter,cs.mixBlendMode,getComputedStyle(i.parentNode).opacity]})()"))
    b.close()
