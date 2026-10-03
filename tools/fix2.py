import re
p='myeongri_prem2.js'; s=open(p,encoding='utf-8').read()
def rep(a,b,cnt=1):
    global s
    assert s.count(a)>=1, ('MISSING',a[:80])
    s=s.replace(a,b) if cnt==0 else s.replace(a,b,cnt)

# 1. monthDays: 정확한 절입 시각 기준으로 하루를 한 달에만 배정(정오 기준)
rep("function monthDays(o){ const {P,dm,st}=F, db=P.d[1], mb=P.m[1], yb=P.y[1], loveG=F.male?2:3; const s0=Date.UTC(o.start.y,o.start.m-1,o.start.d), e0=Date.UTC(o.end.y,o.end.m-1,o.end.d); const all=[];\n  for(let t=s0;t<=e0;t+=864e5){ const d=new Date(t),",
"function monthDays(o){ const {P,dm,st}=F, db=P.d[1], mb=P.m[1], yb=P.y[1], loveG=F.male?2:3; const s0=Date.UTC(o.start.y,o.start.m-1,o.start.d), e0=Date.UTC(o.end.y,o.end.m-1,o.end.d); const all=[];\n  const T=x=>Date.UTC(x.y,x.m-1,x.d,x.hh||0,x.mi||0), nx=F.months[F.months.indexOf(o)+1], sT=T(o.start), eT=nx?T(nx.start):e0+864e5;\n  for(let t=s0;t<=e0+864e5;t+=864e5){ if(t+432e5<sT||t+432e5>=eT) continue; const d=new Date(t),")

# 2. GOODWHY 같은 십성 반복
rep("S_.favorable(F.st,x.g1)&&S_.favorable(F.st,x.g2)?`${jo(S_.tgStem(F.dm,x.s),'과','와')} ${jo(S_.tgBranch(F.dm,x.b),'이','가')} 모두 자네 편인 날`",
"S_.favorable(F.st,x.g1)&&S_.favorable(F.st,x.g2)?(S_.tgStem(F.dm,x.s)===S_.tgBranch(F.dm,x.b)?`천간과 지지가 모두 ${S_.tgStem(F.dm,x.s)}, 자네 편인 날`:`${jo(S_.tgStem(F.dm,x.s),'과','와')} ${jo(S_.tgBranch(F.dm,x.b),'이','가')} 모두 자네 편인 날`)")

# 3. why(): 들고 -> 드네
rep("const why=(arr,dflt)=>{ const a=arr.filter(Boolean); return a.length?a.slice(0,2).join(' ').replace(/고$/,'네'):dflt; };",
"const why=(arr,dflt)=>{ const a=arr.filter(Boolean); return a.length?a.slice(0,2).join(' ').replace(/들고$/,'드네').replace(/고$/,'네'):dflt; };\nconst rankA=k=>{ const idx=F.months.map((o,i)=>({i,v:areaScores(o)[k]})); return {top:[...idx].sort((a,b)=>b.v-a.v||a.i-b.i).slice(0,2).map(x=>x.i),low:[...idx].sort((a,b)=>a.v-b.v||a.i-b.i).slice(0,2).map(x=>x.i)}; };\nconst pair=(ids,fn)=>{ const mm=i=>F.months[i].start.m+'월', t=ids.map(fn); if(ids.length===2&&t[0]===t[1]) return `${mm(ids[0])}(${F.months[ids[0]].gz})과 ${mm(ids[1])}(${F.months[ids[1]].gz})은 모두 ${t[0]}.`; return ids.map((i,j)=>`${mm(i)}(${F.months[i].gz})은 ${t[j]}.`).join(' '); };")

# 4. areaBlock: rankA + pair
rep("const idx=vals.map((v,i)=>({v,i})); const top=[...idx].sort((a,b)=>b.v-a.v).slice(0,2).map(x=>x.i), low=[...idx].sort((a,b)=>a.v-b.v).slice(0,2).map(x=>x.i);",
"const {top,low}=rankA(k);")
rep("${top.map(i=>{ const o=F.months[i]; return `${mm(i)}(${o.gz})은 ${why(AREA_POS[k](o),'사주가 반기는 기운이 드네')}.`; }).join(' ')}",
"${pair(top,i=>why(AREA_POS[k](F.months[i]),'사주가 반기는 기운이 드네'))}")
rep("${low.map(i=>{ const o=F.months[i]; return `${mm(i)}(${o.gz})은 ${why(AREA_NEG[k](o),'사주가 반기지 않는 기운이 드네')}.`; }).join(' ')}",
"${pair(low,i=>why(AREA_NEG[k](F.months[i]),'사주가 반기지 않는 기운이 드네'))}")

# 5. FAQ: 영역 블록과 같은 순위 사용
rep("const w=sc('work'), m=sc('money'), l=sc('love'), b=sc('body');",
"const R=k=>{ const r=rankA(k); return [{i:r.top[0]},{i:r.top[1]}].concat(Array(8).fill({i:0}),[{i:r.low[1]},{i:r.low[0]}]); }; const w=R('work'), m=R('money'), l=R('love'), b=R('body');")
rep("기운이 가장 낮은 달은 ${mm(b[11].i)}과 ${mm(b[10].i)}일세.","기운이 가장 낮은 달은 ${mm(b[11].i)}과 ${mm(b[10].i)}일세.")

# 6. 십성 분포: 동률 처리
rep("const mx=grpCnt.indexOf(Math.max(...grpCnt)), mn=grpCnt.indexOf(Math.min(...grpCnt));",
"const mx=grpCnt.indexOf(Math.max(...grpCnt)), mn=grpCnt.indexOf(Math.min(...grpCnt)); const mxA=grpCnt.map((n,i)=>n===grpCnt[mx]?i:-1).filter(i=>i>=0), mnA=grpCnt.map((n,i)=>n===grpCnt[mn]?i:-1).filter(i=>i>=0); const GN=i=>GRPN[i].split('(')[0], GL=a=>a.map(GN).join('과 ');\n  const MXT=['스스로 서려는 힘이 앞서는 사주일세. 남의 손을 빌리는 법을 익히면 더 멀리 가네.','재주와 표현이 앞서는 사주일세. 꺼내 보인 만큼 길이 열리네.','재물과 현실 감각이 앞서는 사주일세. 지키는 습관이 붙으면 크게 모이네.','책임과 자리가 앞서는 사주일세. 무거운 짐을 덜어 내는 법도 알아 두게.','배움과 생각이 앞서는 사주일세. 배운 것을 손으로 옮길 때 결실을 보네.'];\n  const MNT=['나와 같은 기운이 적으니 혼자 버티기보다 곁에 설 사람을 일부러 두게.','내보내는 기운이 적으니 속에 든 것을 말과 결과물로 꺼내는 연습이 필요하네.','재물의 기운이 적으니 돈은 들어오는 때를 골라 거두는 것이 요령일세.','자리의 기운이 적으니 남이 정한 틀보다 자네가 정한 규칙이 힘이 되네.','돕는 기운이 적으니 배움과 쉼을 스스로 챙겨야 지치지 않네.'];")
rep("<p class=\"p\">여덟 글자를 십성으로 나누어 보면 ${GRPN[mx]}이 ${grpCnt[mx]}개로 가장 많고, ${GRPN[mn]}이 ${grpCnt[mn]}개로 가장 적네. ${['스스로 서려는 힘이 앞서는 사주일세. 남의 손을 빌리는 법을 익히면 더 멀리 가네.','재주와 표현이 앞서는 사주일세. 꺼내 보인 만큼 길이 열리네.','재물과 현실 감각이 앞서는 사주일세. 지키는 습관이 붙으면 크게 모이네.','책임과 자리가 앞서는 사주일세. 무거운 짐을 덜어 내는 법도 알아 두게.','배움과 생각이 앞서는 사주일세. 배운 것을 손으로 옮길 때 결실을 보네.'][mx]} 가장 적은 ${GRPN[mn].split('(')[0]}은 자네가 운에서 받아 써야 할 기운이니, 그 기운이 드는 해와 달을 잘 쓰게.</p>",
"<p class=\"p\">여덟 글자를 십성으로 나누어 보면 ${mxA.length>1?`${GL(mxA)}이 ${grpCnt[mx]}개씩으로 가장 많고`:`${GRPN[mx]}이 ${grpCnt[mx]}개로 가장 많고`}, ${grpCnt[mn]===0?`${GL(mnA)}${mnA.length>1?'은 하나도 없네':(bt(GN(mn))?'은':'는')+' 하나도 없네'}`:`${GL(mnA)}이 ${grpCnt[mn]}개${mnA.length>1?'씩':''}으로 가장 적네`}. ${mxA.map(i=>MXT[i]).join(' ')} ${mnA.map(i=>MNT[i]).join(' ')} 모자란 기운은 운에서 받아 써야 하니, 그 기운이 드는 해와 달을 잘 쓰게.</p>")

# 7. 대운: 공망 · 다음 대운 바람
rep("${S_.favorable(F.st,cg)?'큰 흐름이 자네 사주를 받쳐 주는 10년일세.':'큰 흐름이 자네 사주에 버거운 10년이니, 속도보다 방향을 챙기게.'}</p>",
"${S_.favorable(F.st,cg)?'큰 흐름이 자네 사주를 받쳐 주는 10년일세.':'큰 흐름이 자네 사주에 버거운 10년이니, 속도보다 방향을 챙기게.'}${F.gong&&F.gong.includes(cur.b)?` 다만 대운의 지지 ${JI[cur.b]}는 자네 공망 자리라, 애쓴 만큼 손에 남지 않는다고 느낄 때가 있네. 이 10년은 결과보다 쌓이는 실력과 사람을 보게.`:''}</p>")
rep("${DU_T2[S_.rel(F.dm,stEl(nx.s))]}이 기다리고 있네.",
"${DU_T2[S_.rel(F.dm,stEl(nx.s))]}이 기다리고 있네. ${(()=>{ const a=S_.favorable(F.st,S_.rel(F.dm,stEl(nx.s))), b=S_.favorable(F.st,S_.relBranch(F.dm,nx.b)); return a&&b?'천간과 지지가 모두 자네 편이라 한결 순한 바람이 부는 10년일세.':a||b?'반쯤은 자네 편인 바람이라, 고를 일과 버릴 일을 가리면 순하게 지나가네.':'자네 사주에 맞바람이 부는 10년이니, 지금부터 체력과 저축을 쌓아 두게.'; })()}")

# 8. 권고 문구: 반기는 기운과 조후를 함께
rep("${need.n} 기운을 곁에 두면 좋은 달은 더 좋아지고 궂은 달은 덜 궂어지네.${jh&&jh.need!=null?` 또 자네는 ${hage(jh.why)}.`:''}</p>",
"${need.n} 기운을 곁에 두면 좋은 달은 더 좋아지고 궂은 달은 덜 궂어지네.${jh&&jh.need!=null?(jh.need!==needI?` 한편 자네는 ${hage(jh.why)}. ${need.n}이 자네 힘을 북돋운다면 ${ELX[jh.need].n}은 계절의 치우침을 덜어 주니, 둘을 함께 챙기게.`:` 계절로 봐도 자네는 ${hage(jh.why)}. 힘과 계절이 같은 기운을 가리키니 더 믿고 챙기게.`):''}</p>")

# 9. 권고 카드: 근거 라벨
rep("<p class=\"bt\">${g?'볕이 드는 달':'걸음을 늦출 달'} · ${C.months[i].tag}</p>",
"<p class=\"bt\">${g?'볕이 드는 달':'걸음을 늦출 달'} · ${o.gz}월 · ${o.t1} · 운성 ${o.us}</p>")

# 10. 개운표: 이름 통일 + 행동 다양화
rep("${EL[F.blank]} 기운이 저절로 들어 빈칸이 채워지는 달일세.<small>${ELX[e==null?F.blank:e].acts[(o.start.m+1)%3]}</small>`:`${ex.n} 기운 · ${ex.color} · ${ex.dir}<small>${ex.acts[(o.start.m)%3]}</small>`}",
"${ELX[F.blank].n} 기운이 저절로 들어 빈칸이 채워지는 달일세. 이달은 그 기운을 받아 쓰기만 하면 되네.<small>${ACT6[F.blank][ix%6]}</small>`:`${ex.n} 기운 · ${ex.color} · ${ex.dir}<small>${ACT6[e==null?F.blank:e][ix%6]}</small>`}")
rep("${F.months.map(o=>{ const inM=[stEl(o.s),BR_EL[o.b]];","${F.months.map((o,ix)=>{ const inM=[stEl(o.s),BR_EL[o.b]];")
rep("function gaeunTable(){",
"const ACT6=[ELX[0].acts.concat(['초록 잎이 보이는 자리에 앉기','아침 일찍 하루 시작하기','계획을 종이에 적어 두기']),ELX[1].acts.concat(['밝은 색 옷 한 벌 입기','좋아하는 사람에게 먼저 연락하기','낮에 햇볕 쬐기']),ELX[2].acts.concat(['흙 만지는 일 하나 하기','지출 장부 한 번 맞춰 보기','오래된 약속 하나 지키기']),ELX[3].acts.concat(['쓰는 물건 하나 손질하기','하루 할 일을 셋으로 줄이기','하기 싫은 일 먼저 끝내기']),ELX[4].acts.concat(['따뜻한 물로 하루 마무리하기','혼자 생각하는 시간 갖기','밤늦은 연락 줄이기'])];\nfunction gaeunTable(){")
open(p,'w',encoding='utf-8').write(s); print('ok')
