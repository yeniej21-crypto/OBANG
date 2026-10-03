const {chromium}=require('playwright');
(async()=>{ const b=await chromium.launch(); const errs=[];
 for(const f of ['seoha-salon.html','ian-salon.html','home_v2.html']){
 const c=await b.newContext({viewport:{width:390,height:700}}); const p=await c.newPage();
 p.on('pageerror',e=>errs.push(f+': '+e.message));
 await p.addInitScript(()=>{ try{ sessionStorage.setItem('toHome','1'); localStorage.setItem('obSeen','1'); localStorage.setItem('obMe',JSON.stringify({y:1994,m:5,d:12,h:6,g:'f',n:'테스트'})); }catch(e){} });
 await p.goto('http://localhost:8812/'+f,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(2500);
 await p.evaluate(()=>document.getElementById('hMenu').click()); await p.waitForTimeout(800);
 const r=await p.evaluate(()=>{ const i=document.querySelector('#hMenuS .in'); i.scrollTop=99999; const its=[...i.querySelectorAll('button,a')]; const last=its[its.length-1].getBoundingClientRect(); return {sh:i.scrollHeight,ch:i.clientHeight,last:last.bottom,txt:its.slice(0,4).map(x=>x.innerText.replace(/\n/g,' ')),lastTxt:its[its.length-1].innerText}; });
 console.log(f,JSON.stringify(r)); await p.waitForTimeout(300); await p.screenshot({path:'_dr_'+f+'.png'});
 await p.evaluate(()=>document.getElementById('hMenuS').classList.remove('on'));
 const band=await p.evaluate(()=>{ const a=document.querySelector('.abBand'); a.scrollIntoView({block:'center'}); return !!a; }); await p.waitForTimeout(500); await p.screenshot({path:'_band_'+f+'.png'});
 await p.evaluate(()=>document.getElementById('cTarot1').scrollIntoView({block:'center'})); await p.waitForTimeout(1500);
 console.log('meok vid', await p.evaluate(()=>[...document.querySelectorAll('.pc[data-vid]')].map(x=>x.id+':'+(x.querySelector('video')?1:0)+':'+!!x.closest('#home')).join(' ')));
 await c.close(); }
 console.log('errs',errs); await b.close(); })();
