const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:390,height:844}});
 await p.route(/cloudfront\.net/,r=>{ const u=r.request().url(); if(/\.mp4/.test(u)) return r.abort(); r.fulfill({body:fs.readFileSync('proto/img/seoha.jpg'),contentType:'image/jpeg'}); });
 await p.addInitScript(()=>{ sessionStorage.setItem('obSnd','0'); sessionStorage.setItem('toHome','1'); });
 await p.goto('http://localhost:8812/home_skin.html?s='+(process.argv[2]||'D')); await p.waitForTimeout(3500);
 const res=await p.evaluate(()=>{
  const parse=c=>{ const m=c.match(/rgba?\(([^)]+)\)/); if(!m) return null; const a=m[1].split(',').map(x=>parseFloat(x)); return {r:a[0],g:a[1],b:a[2],a:a.length>3?a[3]:1}; };
  const L=c=>{ const f=v=>{ v/=255; return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4); }; return .2126*f(c.r)+.7152*f(c.g)+.0722*f(c.b); };
  const out=[]; const home=document.querySelector('.home'); const seen=new Set();
  const walker=document.createTreeWalker(home,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){ const t=walker.currentNode; if(!t.textContent.trim()) continue; const el=t.parentElement; if(!el||seen.has(el)) continue; seen.add(el);
   const cs=getComputedStyle(el); if(cs.visibility==='hidden'||cs.display==='none'||el.closest('[hidden]')) continue; const r=el.getBoundingClientRect(); if(r.width===0||r.height===0) continue;
   const fg=parse(cs.color); if(!fg||fg.a<.2) continue;
   let bg=null, img=false; for(let e=el;e;e=e.parentElement){ const s=getComputedStyle(e); if(s.backgroundImage&&s.backgroundImage!=='none'){ if(/url\(/.test(s.backgroundImage)){ img=true; break; } const g=s.backgroundImage.match(/rgba?\([^)]+\)/g); if(g){ const cs2=g.map(parse).filter(c=>c&&c.a>.5); if(cs2.length){ bg=cs2[cs2.length>1?1:0]; break; } } } const c=parse(s.backgroundColor); if(c&&c.a>.5){ bg=c; break; } if(e.tagName==='VIDEO') {img=true;break;} }
   // 형제 영상/그림 위에 얹힌 글자(.pc 등)는 건너뜀
   if(img){ if(L(fg)<.12){ out.push({cr:0,fg:cs.color,bg:'IMAGE',t:t.textContent.trim().slice(0,24),path:(()=>{ const a=[]; for(let e=el;e&&e!==home&&a.length<4;e=e.parentElement) a.unshift(e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className.trim()?'.'+e.className.trim().split(/\s+/)[0]:'')); return a.join('>'); })()}); } continue; } if(!bg) bg={r:242,g:244,b:246,a:1};
   const l1=L(fg), l2=L(bg), cr=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
   if(cr<3){ const sig=(el.closest('[id]')?'#'+el.closest('[id]').id+' ':'')+el.tagName.toLowerCase()+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/\s+/).join('.'):'');
     out.push({sig,cr:+cr.toFixed(2),fg:cs.color,bg:`rgb(${bg.r},${bg.g},${bg.b})`,t:t.textContent.trim().slice(0,24),path:(()=>{ const a=[]; for(let e=el;e&&e!==home&&a.length<4;e=e.parentElement) a.unshift(e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className.trim()?'.'+e.className.trim().split(/\s+/)[0]:'')); return a.join('>'); })()}); } }
  return out; });
 const by={}; res.forEach(x=>{ (by[x.path]=by[x.path]||[]).push(x); });
 Object.entries(by).forEach(([k,v])=>console.log(v.length, k, '|', v[0].cr, v[0].fg, 'on', v[0].bg, '|', v.map(x=>x.t).slice(0,3).join(' / ')));
 console.log('total',res.length); await b.close(); })();
