from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    for f in ('heukmae','geumeum','samjae'):
        pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
        pg.on('pageerror',lambda e,f=f:errs.append(f+': '+str(e)))
        pg.add_init_script("try{localStorage.setItem('obMe',JSON.stringify({cal:'s',y:1996,m:5,d:14,g:'f'}));sessionStorage.setItem('obSnd','0')}catch(e){}")
        pg.goto(f'http://localhost:8812/{f}.html'); pg.wait_for_timeout(1500)
        pg.evaluate("document.querySelectorAll('.snd-gate,#sndGate').forEach(e=>e.remove())")
        if f=='heukmae': pg.select_option('#bY','1993'); pg.select_option('#bM','11')
        pg.evaluate("document.getElementById('goF').click()"); pg.wait_for_timeout(900)
        pg.evaluate("document.getElementById('rs').scrollIntoView()"); pg.wait_for_timeout(500)
        pg.screenshot(path=f't/vil_{f}_1.png')
        pg.evaluate("document.getElementById('pv').innerHTML=''; window.ObPay=null;")
        pg.evaluate("(()=>{ const R=window.__VR; })()")
        pg.evaluate("document.getElementById('pdGo').click()"); pg.wait_for_timeout(1200)
        pg.evaluate("(()=>{const o=document.querySelector('.obp.on'); if(o){ const ag=o.querySelector('[data-agree]'); if(ag){ag.checked=true; ag.dispatchEvent(new Event('change'));} const pb=o.querySelector('[data-pay]'); pb&&pb.click(); }})()"); pg.wait_for_timeout(1500)
        pg.evaluate("document.getElementById('pv').scrollIntoView()"); pg.wait_for_timeout(500)
        pg.screenshot(path=f't/vil_{f}_2.png'); print(f, pg.evaluate("document.getElementById('pv').classList.contains('on')"))
    print(errs); b.close()
