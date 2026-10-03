const {chromium}=require('playwright');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true}); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error'&&!/net::|Failed to load|404/.test(m.text())) errs.push(m.text()); });
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); localStorage.setItem('obSeen','1'); });
 await p.goto('http://localhost:8812/myeongri_v2.html'); await p.waitForTimeout(2500);
 await p.screenshot({path:'m2_0.png'});
 await p.click('#enterBtn'); await p.waitForTimeout(1500); await p.screenshot({path:'m2_1.png'});
 await p.click('#goBtn'); await p.waitForTimeout(13500); await p.screenshot({path:'m2_2.png'});
 // rub
 for(let k=0;k<40;k++){ const a=k/6; await p.mouse.move(195+80*Math.cos(a),420+80*Math.sin(a)); if(k===0) await p.mouse.down(); }
 // simulate via pointer events in loop
 await p.evaluate(async()=>{ const el=document.getElementById('sInk'), r=el.getBoundingClientRect(); const ev=(t,x,y)=>el.dispatchEvent(new PointerEvent(t,{clientX:r.left+x,clientY:r.top+y,bubbles:true})); ev('pointerdown',275,420); for(let i=0;i<400;i++){ const a=i/8; ev('pointermove',195+80*Math.cos(a),420+80*Math.sin(a)); await new Promise(r=>setTimeout(r,8)); } });
 await p.waitForTimeout(500); await p.screenshot({path:'m2_3.png'});
 await p.waitForTimeout(9000); await p.screenshot({path:'m2_4.png'});
 await p.waitForTimeout(6000); await p.screenshot({path:'m2_5.png'});
 const H=await p.evaluate(()=>document.getElementById('sRep').scrollHeight); console.log('repH',H, await p.evaluate(()=>document.getElementById('sRep').classList.contains('on')));
 for(const y of [900,1800,2700,3600,4500,5400]){ await p.evaluate(y=>document.getElementById('sRep').scrollTop=y,y); await p.waitForTimeout(600); await p.screenshot({path:`m2_r${y}.png`}); }
 console.log(errs); await b.close(); })();
