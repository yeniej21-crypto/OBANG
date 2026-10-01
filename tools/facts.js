const fs=require('fs'),vm=require('vm'); const ctx={window:{},console,Date,Math,JSON}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('saju.js','utf8')+';this.MANSE=MANSE;',ctx); vm.runInContext(fs.readFileSync('saju_x.js','utf8'),ctx);
const S=ctx.window.Saju, X=ctx.window.SajuX; const {GAN,JI,EL,stEl}=S;
const [y,m,d,h,male]=[1996,5,14,6,false];
const P=S.pillars(y,m,d,h), dm=P.d[0], st=S.strength(P), cnt=S.elCount(P);
const gz=p=>GAN[p[0]]+JI[p[1]];
const out={원국:{년:gz(P.y),월:gz(P.m),일:gz(P.d),시:gz(P.h)},일간:GAN[dm]+EL[stEl(dm)],강약:st.label,ratio:st.ratio.toFixed(2),오행:Object.fromEntries(cnt.map((c,i)=>[EL[i],c])),
 십성:{년간:S.tgStem(dm,P.y[0]),월간:S.tgStem(dm,P.m[0]),시간:S.tgStem(dm,P.h[0]),년지:S.tgBranch(dm,P.y[1]),월지:S.tgBranch(dm,P.m[1]),일지:S.tgBranch(dm,P.d[1]),시지:S.tgBranch(dm,P.h[1])},
 운성:{년:X.unseong(dm,P.y[1]),월:X.unseong(dm,P.m[1]),일:X.unseong(dm,P.d[1]),시:X.unseong(dm,P.h[1])},
 원국신살:X.natalShinsal(P).map(o=>o.at+':'+o.k), 공망:X.gongmang(P.d).map(b=>JI[b]), 조후:X.johu(P)};
const DU=S.daeun(P,male); out.대운=DU.list.map(x=>x.age+':'+GAN[x.s]+JI[x.b]+'('+S.tgStem(dm,x.s)+'/'+S.tgBranch(dm,x.b)+')').join(' ');
out.세운={간지:'丁未',천간십성:S.tgStem(dm,3),지지십성:S.tgBranch(dm,7),운성:X.unseong(dm,7),지지관계:X.branchRel(7,P),천간관계:X.stemRel(3,P),신살:X.shinsal(7,P,3)};
out.월운=X.solarMonths(2027).map(o=>({절:o.term,시작:`${o.start.y}.${o.start.m}.${o.start.d} ${o.start.hh}:${String(o.start.mi).padStart(2,'0')}`,월:gz(o.mp),간십성:S.tgStem(dm,o.mp[0]),지십성:S.tgBranch(dm,o.mp[1]),운성:X.unseong(dm,o.mp[1]),지지:X.branchRel(o.mp[1],P).map(r=>r.at+r.k).join(','),천간:X.stemRel(o.mp[0],P).map(r=>r.at+r.k).join(','),신살:X.shinsal(o.mp[1],P,o.mp[0]).join(','),세운과:[S.isHap(o.mp[1],7)?'未합':'',S.isChung(o.mp[1],7)?'未충':'',o.mp[1]===7?'未같음':''].filter(Boolean).join(',')}));
console.log(JSON.stringify(out,null,1));
