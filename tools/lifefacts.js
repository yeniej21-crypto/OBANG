const fs=require('fs'),vm=require('vm'); const ctx={window:{},console,Date,Math,JSON}; ctx.globalThis=ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('saju.js','utf8')+';this.MANSE=MANSE;',ctx); vm.runInContext(fs.readFileSync('saju_x.js','utf8'),ctx); vm.runInContext(fs.readFileSync('life_core.js','utf8'),ctx);
const L=ctx.window.LifeCore.build(ctx.window.Saju,ctx.window.SajuX,{y:1996,m:5,d:14,h:6,g:'f',now:2026});
console.log('age',L.age,'grp',L.grp,'inner',JSON.stringify(L.inner),'us',L.pilUs);
L.dl.forEach(d=>console.log(d.age,d.from+'-'+d.to,d.gz,d.t1,d.t2,d.us,'fill',d.fill,'sc',d.sc,d.now?'NOW':'',d.br.map(r=>r.at+r.k).join(','),d.sr.map(r=>r.at+r.k).join(','),d.ss.join(',')));
for(const k in L.keys) console.log(k, L.keys[k].map(o=>`${o.y}(${o.a}세 ${o.gz} ${o.t1}/${o.t2} ${o.br.join('|')} ${o.sr.join('|')} ${o.ss.join('|')} 대운${o.du})`).join('  '));
