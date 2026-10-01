/* 신년운세 프리미엄 v2 — 사실 카드 계산 (화면과 무관, node에서도 동작)
   입춘 기준 열두 절월 · 십성 · 12운성 · 합충형파해원진 · 신살 · 빈칸(가장 모자란 오행) 채움 · 당번 신 · 점수 */
(function(root){
function build(S,X,inp){ const {GAN,JI,EL,stEl,BR_EL}=S;
  const P=S.pillars(inp.y,inp.m,inp.d,inp.h), dm=P.d[0], st=S.strength(P), cnt=S.elCount(P), male=inp.g==='m';
  const fav=g=>S.favorable(st,g);
  const blank=cnt.indexOf(Math.min(...cnt)); /* 빈칸 = 가장 모자란 오행 */
  const DUTY=['하람','이안','도준','시온','재이'];
  const YEAR=inp.year||2027, YP=S.yearPillar(YEAR);
  const age=YEAR-inp.y+1, DU=S.daeun(P,male); let cur=DU.list[0], nxt=null; DU.list.forEach((x,i)=>{ if(age>=x.age&&age<x.age+10){ cur=x; nxt=DU.list[i+1]||null; } });
  const months=X.solarMonths(YEAR).map(o=>{ const [s,b]=o.mp; const g1=S.rel(dm,stEl(s)), g2=S.relBranch(dm,b);
    const br=X.branchRel(b,P), sr=X.stemRel(s,P), ss=X.shinsal(b,P,s), us=X.unseong(dm,b);
    const has=(at,k)=>br.some(r=>r.at===at&&r.k===k), shas=(at,k)=>sr.some(r=>r.at===at&&r.k===k);
    const fill=(stEl(s)===blank?1:0)+(BR_EL[b]===blank?1:0);
    let sc=55+(fav(g1)?8:-5)+(fav(g2)?10:-6);
    if(['장생','관대','건록','제왕'].includes(us)) sc+=4; if(['병','사','묘','절'].includes(us)) sc-=4;
    if(has('일지','육합')) sc+=5; if(has('일지','충')) sc-=10; if(has('월지','충')) sc-=5; if(shas('일간','천간충')) sc-=8; if(shas('일간','천간합')) sc+=3;
    if(ss.includes('천을귀인')) sc+=4; if(ss.includes('공망')) sc-=4; if(ss.includes('백호')) sc-=3; sc+=fill*4;
    if(S.isChung(b,YP[1])) sc-=3; sc=Math.max(28,Math.min(96,Math.round(sc)));
    const duty=DUTY[BR_EL[b]];
    return {k:o.k,term:o.term,start:o.start,end:o.end,s,b,gz:GAN[s]+JI[b],t1:S.tgStem(dm,s),t2:S.tgBranch(dm,b),g1,g2,f1:fav(g1),f2:fav(g2),us,br,sr,ss,fill,sc,duty,dutyEl:BR_EL[b]}; });
  const ys={s:YP[0],b:YP[1],t1:S.tgStem(dm,YP[0]),t2:S.tgBranch(dm,YP[1]),us:X.unseong(dm,YP[1]),br:X.branchRel(YP[1],P),sr:X.stemRel(YP[0],P),ss:X.shinsal(YP[1],P,YP[0])};
  return {P,dm,st,cnt,male,blank,age,cur,nxt,DU,months,ys,natal:X.natalShinsal(P),gong:X.gongmang(P.d),johu:X.johu(P),key:[inp.y,inp.m,inp.d,inp.h==null?'x':inp.h,inp.g].join('-')}; }
root.Prem2Core={build};
})(typeof window!=='undefined'?window:globalThis);
