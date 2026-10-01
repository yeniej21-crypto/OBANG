/* 평생 사주 프리미엄 — 사실 카드 계산 (화면과 무관, node에서도 동작)
   원국의 짜임 · 대운 9마디 상세 · 해마다의 세운 신호(결혼 · 재물 · 이동 · 결정적인 해) */
(function(root){
function build(S,X,inp){ const {GAN,JI,EL,stEl,BR_EL}=S;
  const P=S.pillars(inp.y,inp.m,inp.d,inp.h), dm=P.d[0], st=S.strength(P), cnt=S.elCount(P), male=inp.g==='m';
  const fav=g=>S.favorable(st,g), blank=cnt.indexOf(Math.min(...cnt)), nowY=inp.now||2026, age=nowY-inp.y+1;
  const pil=[['년주',P.y],['월주',P.m],['일주',P.d],['시주',P.h]];
  /* 원국 안의 관계 */
  const inner=[]; for(let i=0;i<4;i++) for(let j=i+1;j<4;j++){ const a=pil[i][1], b=pil[j][1]; if(!a||!b) continue;
    const n=pil[i][0]+'-'+pil[j][0];
    if(S.isHap(a[1],b[1])) inner.push({at:n,k:'육합',gz:JI[a[1]]+JI[b[1]]}); if(S.isChung(a[1],b[1])) inner.push({at:n,k:'충',gz:JI[a[1]]+JI[b[1]]}); if(S.isHyung(a[1],b[1])) inner.push({at:n,k:'형',gz:JI[a[1]]+JI[b[1]]});
    if(X.ganHap(a[0],b[0])) inner.push({at:n,k:'천간합',gz:GAN[a[0]]+GAN[b[0]]}); if(X.ganChung(a[0],b[0])) inner.push({at:n,k:'천간충',gz:GAN[a[0]]+GAN[b[0]]}); }
  const tg=[]; pil.forEach(([n,p])=>{ if(!p) return; if(n!=='일주') tg.push(S.rel(dm,stEl(p[0]))); tg.push(S.relBranch(dm,p[1])); });
  const grp=[0,1,2,3,4].map(g=>tg.filter(x=>x===g).length);
  const DU=S.daeun(P,male);
  const dl=DU.list.map(x=>{ const g1=S.rel(dm,stEl(x.s)), g2=S.relBranch(dm,x.b), br=X.branchRel(x.b,P), sr=X.stemRel(x.s,P), ss=X.shinsal(x.b,P,x.s), us=X.unseong(dm,x.b);
    const fill=(stEl(x.s)===blank?1:0)+(BR_EL[x.b]===blank?1:0); const has=(at,k)=>br.some(r=>r.at===at&&r.k===k);
    let sc=55+(fav(g1)?10:-6)+(fav(g2)?13:-7)+fill*4; if(has('일지','육합')) sc+=5; if(has('일지','충')) sc-=8; if(has('월지','충')) sc-=5; if(['건록','제왕','관대','장생'].includes(us)) sc+=3; if(['병','사','절','묘'].includes(us)) sc-=3; if(ss.includes('천을귀인')) sc+=3;
    sc=Math.max(30,Math.min(95,Math.round(sc)));
    return {age:x.age,from:inp.y+x.age-1,to:inp.y+x.age+8,s:x.s,b:x.b,gz:GAN[x.s]+JI[x.b],t1:S.tgStem(dm,x.s),t2:S.tgBranch(dm,x.b),g1,g2,f1:fav(g1),f2:fav(g2),us,br,sr,ss,fill,sc,now:age>=x.age&&age<x.age+10}; });
  /* 해마다 신호 */
  const loveG=male?2:3, yb=P.y[1], db=P.d[1], mb=P.m[1], yrs=[];
  for(let y=inp.y+15;y<=inp.y+80;y++){ const a=y-inp.y+1, [s,b]=S.yearPillar(y), d=dl.find(x=>a>=x.age&&a<x.age+10)||null;
    const g1=S.rel(dm,stEl(s)), g2=S.relBranch(dm,b), br=X.branchRel(b,P), ss=X.shinsal(b,P,s), sr=X.stemRel(s,P); const has=(at,k)=>br.some(r=>r.at===at&&r.k===k);
    const love=((g1===loveG||g2===loveG)&&(fav(g1)||fav(g2))?2:0)+(has('일지','육합')||has('일지','삼합')?2:0)+(ss.includes('도화')?1.5:0)+(sr.some(r=>r.at==='일간'&&r.k==='천간합')?1.5:0)-(has('일지','충')?1:0);
    const money=(g1===2||g2===2?1.5:0)+(fav(g1)&&fav(g2)?1.5:(fav(g1)||fav(g2)?0.5:0))+(d&&d.sc>=65?1:0)+(st.strong&&(g1===2||g2===2)?1:0)-(ss.includes('공망')?1:0);
    const move=(ss.includes('역마')?2:0)+(has('일지','충')?2:0)+(has('월지','충')?1.5:0)+(d&&a===d.age?1.5:0);
    const turn=(d&&a===d.age?2:0)+(has('일지','충')||has('일지','육합')?1.5:0)+(sr.some(r=>r.at==='일간')?1.5:0)+(fav(g1)&&fav(g2)?1:0)+(ss.includes('천을귀인')?1:0);
    yrs.push({y,a,gz:GAN[s]+JI[b],t1:S.tgStem(dm,s),t2:S.tgBranch(dm,b),br:br.map(r=>r.at+' '+r.k),sr:sr.map(r=>r.at+' '+r.k),ss,love,money,move,turn,du:d?d.gz:''}); }
  const future=yrs.filter(o=>o.y>=nowY);
  const top=(k,n,lo,hi,gap=3,min=3)=>{ const c=future.filter(o=>o.a>=lo&&o.a<=hi&&o[k]>=min).sort((a,b)=>b[k]-a[k]||a.y-b.y); const r=[]; for(const o of c){ if(r.some(x=>Math.abs(x.y-o.y)<gap)) continue; r.push(o); if(r.length===n) break; } return r.sort((a,b)=>a.y-b.y); };
  const keys={turn:top('turn',3,age,75,6),love:top('love',4,Math.max(age,22),48,2,2),money:top('money',4,Math.max(age,25),68,3,2.5),move:top('move',4,Math.max(age,20),70,3)};
  return {P,dm,st,cnt,male,blank,age,grp,inner,natal:X.natalShinsal(P),gong:X.gongmang(P.d),johu:X.johu(P),pilUs:pil.map(([n,p])=>p?X.unseong(dm,p[1]):null),dl,keys,cur:dl.find(x=>x.now)||dl[0],key:[inp.y,inp.m,inp.d,inp.h==null?'x':inp.h,inp.g].join('-')}; }
root.LifeCore={build};
})(typeof window!=='undefined'?window:globalThis);
