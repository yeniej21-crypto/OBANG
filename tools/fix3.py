p='myeongri_prem2.js'; s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert a in s, ('MISSING',a[:90]); s=s.replace(a,b,1)
rep("o.br.slice(0,2).forEach(r=>total+=` ${r.at} ${JI[natalAt(r.at)]}와 ${JI[o.b]}의 ${r.k}이니 ${SEAT[r.at]} 쪽에서 ${RELM[r.k]}.`);",
"const gp={}; o.br.forEach(r=>(gp[r.at]=gp[r.at]||[]).push(r.k)); Object.keys(gp).slice(0,3).forEach(at=>{ const ks=gp[at], neg=ks.find(k=>!/합/.test(k)), lead=ks.length>1?(neg||ks[0]):ks[0]; total+=` ${at} ${JI[natalAt(at)]}와 ${JI[o.b]}의 ${ks.length>1?jo(ks.join(' · '),'이','가')+' 함께 걸리니':ks[0]+'이니'} ${SEAT[at]} 쪽에서 ${RELM[lead]||RELM[ks[0]]||'기운이 움직이네'}.`; });")
rep("`지지 미(未)는 자네에게 ${ys.t2}일세. ${SS[ys.t2][S_.favorable(st,S_.relBranch(F.dm,ys.b))?'good':'bad']}`]",
"`지지 미(未)는 자네에게 ${ys.t2}일세. ${SS[ys.t2][S_.favorable(st,S_.relBranch(F.dm,ys.b))?'good':'bad']}`,`올해 자네 일간은 ${ys.us}, 곧 ${USM[ys.us]}에 서네. ${['장생','관대','건록','제왕'].includes(ys.us)?'제 힘이 붙는 해이니 미뤄 둔 일을 앞으로 당기게.':['병','사','묘','절'].includes(ys.us)?'힘이 낮게 깔리는 해이니 일을 넓히기보다 줄여서 깊게 하게.':'힘이 넘치지도 모자라지도 않는 해이니 하던 일을 꾸준히 이어 가면 되네.'}`]")
# 권고 카드 · 맺음말
rep("F.bestI.forEach(i=>C.best[i]=SS[F.months[i].t1].good.split('. ')[0]+'.'); F.warnI.forEach(i=>C.warn[i]=SS[F.months[i].t1].bad.split('. ')[0]+'.');",
"const dl=a=>a.map(x=>`${x.m}월 ${x.d}일`).join('과 ');\n  F.bestI.forEach(i=>{ const o=F.months[i], a=SS[o.t1], D=monthDays(o); C.best[i]=`${a.good} 이달에는 ${a.do}를 권하네.${D.good.length?` 날을 고른다면 ${dl(D.good)}이 좋네.`:''}`; });\n  F.warnI.forEach(i=>{ const o=F.months[i], a=SS[o.t1], D=monthDays(o); C.warn[i]=`${a.bad} 삼갈 일은 ${a.avoid}일세.${D.bad.length?` 특히 ${dl(D.bad)}은 큰일을 피하게.`:''}`; });\n  if(!C.ai) C.letter=letterRule();")
rep("/* ---------- AI 원고 ---------- */",
"""function letterRule(){ const mm=i=>F.months[i].start.m+'월', fg=F.st.strong?[1,2,3]:[0,4], favEls=fg.map(g=>(stEl(F.dm)+g)%5), needI=favEls.reduce((a,e)=>F.cnt[e]<F.cnt[a]?e:a,favEls[0]), need=ELX[needI], cur=F.cur, nx=F.nxt, age=F.age;
  const L=[`자네 감정서를 여기까지 썼네. 자네는 ${DM_HG[F.dm].split('일세.')[0]}일세. 올해 정미년은 자네에게 ${jo(F.ys.t1,'과','와')} ${F.ys.t2}가 드는 해이고, 자네는 지금 ${GAN[cur.s]}${JI[cur.b]} 대운을 걷고 있네.`,
   `올해 볕이 가장 잘 드는 달은 ${F.bestI.map(mm).join(', ')}일세. 큰 결정과 새 시작은 이 달에 몰아 두고, ${F.warnI.map(mm).join('과 ')}에는 걸음을 늦추게. 늦춘다는 것은 멈춘다는 뜻이 아니라, 다음 볕을 위해 힘을 모은다는 뜻일세.`,
   `자네 사주가 가장 반기는 기운은 ${need.n}이네. ${need.color} 빛을 곁에 두고, ${need.acts[0]}부터 해 보게. 운은 큰일에서보다 매일 되풀이하는 작은 습관에서 먼저 움직이네.`,
   nx&&age>=cur.age+7?`${nx.age}세에는 ${GAN[nx.s]}${JI[nx.b]} 대운으로 넘어가네. 문턱 앞의 몇 해는 늘 어수선하니, 올해 거둔 것을 잘 갈무리해 다음 10년의 밑천으로 삼게.`:`지금 대운은 아직 갈 길이 남았네. 이 10년이 자네에게 주려는 것을 서두르지 말고 하나씩 받아 두게.`,
   '사주는 정답이 아니라 지도일세. 지도를 읽었으니 길은 자네가 고르게. 한 해를 걸어 보고 다시 오면, 그때 또 함께 짚어 봄세.'];
  return L; }
/* ---------- AI 원고 ---------- */""")
open(p,'w',encoding='utf-8').write(s); print('ok')
