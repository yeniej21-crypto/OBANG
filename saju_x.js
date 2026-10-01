/* 사주 엔진 확장 — 12운성 · 신살 · 천간 합충 · 삼합/방합 · 원진/파/해 · 공망 · 조후 · 육친 · 절입 시각
   saju.js 다음에 불러 쓴다. 모든 판단은 정해진 규칙(무작위 없음). */
(function(){
const S=window.Saju; const {GAN,JI,BR_EL,stEl}=S;
const UNSEONG=['장생','목욕','관대','건록','제왕','쇠','병','사','묘','절','태','양'];
const US_START={0:11,2:2,4:2,6:5,8:8,1:6,3:9,5:9,7:0,9:3};
function unseong(dm,b){ const st=US_START[dm]; const i=dm%2===0?(b-st+12)%12:(st-b+12)%12; return UNSEONG[i]; }
const SAMHAP=[[8,0,4,4],[2,6,10,1],[5,9,1,3],[11,3,7,0]]; /* 지지 셋 + 오행 */
const BANGHAP=[[2,3,4,0],[5,6,7,1],[8,9,10,3],[11,0,1,4]];
const grpOf=b=>SAMHAP.findIndex(g=>g.slice(0,3).includes(b));
const YEOKMA=[2,8,11,5], DOHWA=[9,3,6,0], HWAGAE=[4,10,1,7]; /* 申子辰 · 寅午戌 · 巳酉丑 · 亥卯未 순 */
const GWIIN={0:[1,7],4:[1,7],6:[1,7],1:[0,8],5:[0,8],2:[11,9],3:[11,9],7:[2,6],8:[5,3],9:[5,3]};
const YANGIN={0:3,2:6,4:6,6:9,8:0};
const HONGYEOM={0:6,1:6,2:2,3:7,4:4,5:4,6:10,7:9,8:0,9:8};
const MUNCHANG={0:5,1:6,2:8,3:9,4:8,5:9,6:11,7:0,8:2,9:3};
const BAEKHO=[[0,4],[1,7],[2,10],[3,1],[4,4],[8,10],[9,1]];
const pair=(a,b,L)=>L.some(([x,y])=>(a===x&&b===y)||(a===y&&b===x));
const WONJIN=[[0,7],[1,6],[2,9],[3,8],[4,11],[5,10]], PA=[[0,9],[1,4],[2,11],[3,6],[5,8],[7,10]], HAE=[[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];
const ganHap=(a,b)=>Math.abs(a-b)===5, ganChung=(a,b)=>a%5!==4&&Math.abs(a-b)===6;
function i60(s,b){ for(let i=0;i<60;i++) if(i%10===s&&i%12===b) return i; return 0; }
function gongmang(dp){ const x=Math.floor(i60(dp[0],dp[1])/10); return [((10-2*x)%12+12)%12,((11-2*x)%12+12)%12]; }
/* 지지 하나가 원국과 만드는 관계 전부 */
function branchRel(b,P){ const out=[]; [['년지',P.y],['월지',P.m],['일지',P.d],['시지',P.h]].forEach(([n,p])=>{ if(!p) return; const x=p[1];
  if(x===b) out.push({at:n,k:'같은 글자'});
  if(S.isHap(b,x)) out.push({at:n,k:'육합'});
  if(S.isChung(b,x)) out.push({at:n,k:'충'});
  if(S.isHyung(b,x)) out.push({at:n,k:'형'});
  if(pair(b,x,WONJIN)) out.push({at:n,k:'원진'});
  if(pair(b,x,PA)&&!S.isHap(b,x)) out.push({at:n,k:'파'});
  if(pair(b,x,HAE)&&!pair(b,x,WONJIN)) out.push({at:n,k:'해'});
  const g=grpOf(b); if(g>=0&&grpOf(x)===g&&x!==b) out.push({at:n,k:'삼합',el:SAMHAP[g][3]}); });
  return out; }
function stemRel(s,P){ const out=[]; [['년간',P.y],['월간',P.m],['일간',P.d],['시간',P.h]].forEach(([n,p])=>{ if(!p) return; const x=p[0]; if(ganHap(s,x)) out.push({at:n,k:'천간합'}); if(ganChung(s,x)) out.push({at:n,k:'천간충'}); }); return out; }
/* 신살: 어떤 지지(또는 간지)가 이 사주에서 무슨 신살이 되는지 */
function shinsal(b,P,s){ const out=[], yg=grpOf(P.y[1]), dg=grpOf(P.d[1]), dm=P.d[0];
  if(b===YEOKMA[yg]||b===YEOKMA[dg]) out.push('역마');
  if(b===DOHWA[yg]||b===DOHWA[dg]) out.push('도화');
  if(b===HWAGAE[yg]||b===HWAGAE[dg]) out.push('화개');
  if((GWIIN[dm]||[]).includes(b)) out.push('천을귀인');
  if(YANGIN[dm]===b) out.push('양인');
  if(HONGYEOM[dm]===b) out.push('홍염');
  if(MUNCHANG[dm]===b) out.push('문창귀인');
  if(gongmang(P.d).includes(b)) out.push('공망');
  if(s!=null&&BAEKHO.some(([x,y])=>x===s&&y===b)) out.push('백호');
  return out; }
/* 원국 자체의 신살 */
function natalShinsal(P){ const R=[]; [['년주',P.y],['월주',P.m],['일주',P.d],['시주',P.h]].forEach(([n,p])=>{ if(!p) return; shinsal(p[1],P,p[0]).filter(k=>k!=='공망'||n!=='일주').forEach(k=>R.push({at:n,k})); }); return R; }
/* 조후: 태어난 계절의 덥고 추움 */
function johu(P){ const mb=P.m[1]; if([5,6,7].includes(mb)) return {season:'여름',need:4,why:'뜨거운 여름에 태어나 물로 열을 식혀야 균형이 맞는다'};
  if([11,0,1].includes(mb)) return {season:'겨울',need:1,why:'차가운 겨울에 태어나 불로 몸을 데워야 균형이 맞는다'};
  if([2,3,4].includes(mb)) return {season:'봄',need:null,why:'봄에 태어나 크게 덥거나 춥지 않다'}; return {season:'가을',need:null,why:'가을에 태어나 크게 덥거나 춥지 않다'}; }
/* 육친: 십성 무리 → 사람 */
function yukchin(g,male){ return male?['형제·친구','재능·후배','아내·아버지·재물','자녀·직장','어머니·문서'][g]:['형제·친구','자녀·재능','아버지·재물','남편·직장','어머니·문서'][g]; }
const GUNG={년주:'조상·집안·어린 시절',월주:'부모·형제·사회·일터',일주:'나와 배우자',시주:'자녀·말년·꿈'};
/* 절입: 그해 입춘부터 다음 해 소한까지 12절 */
function solarMonths(year){ const J=MANSE.jie; const L=[]; for(let i=1;i<12;i++) L.push([J[year][i],(i+1)%12]); L.push([J[year+1][0],1]);
  const toDate=t=>{ const d=S.fromIdx(Math.floor(t/1440)), mm=t%1440; return Object.assign(d,{hh:Math.floor(mm/60),mi:mm%60}); };
  const NAME=['소한','입춘','경칩','청명','입하','망종','소서','입추','백로','한로','입동','대설'];
  return L.map(([t,b],k)=>{ const nxt=k<11?L[k+1][0]:J[year+1][1]; const mid=toDate(Math.floor((t+nxt)/2)); const mp=S.monthPillarAt(mid.y,mid.m,mid.d); return {k,b,term:NAME[(k+1)%12],start:toDate(t),end:toDate(nxt-1),mp}; }); }
window.SajuX={UNSEONG,unseong,branchRel,stemRel,shinsal,natalShinsal,gongmang,johu,yukchin,GUNG,solarMonths,ganHap,ganChung,i60};
})();
