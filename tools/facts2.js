const fs=require('fs'),vm=require('vm'); const ctx={window:{},console,Date,Math,JSON}; ctx.globalThis=ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('saju.js','utf8')+';this.MANSE=MANSE;',ctx); vm.runInContext(fs.readFileSync('saju_x.js','utf8'),ctx); vm.runInContext(fs.readFileSync('prem2_core.js','utf8'),ctx);
const F=ctx.window.Prem2Core.build(ctx.window.Saju,ctx.window.SajuX,{y:1996,m:5,d:14,h:6,g:'f'});
console.log(F.key,'blank',F.blank,'age',F.age,'cur',F.cur.age,'nxt',F.nxt&&F.nxt.age);
F.months.forEach(o=>console.log(o.term,o.start.m+'/'+o.start.d,o.gz,o.t1,o.t2,o.us,'fill',o.fill,'sc',o.sc,o.duty,o.ss.join(',')));
