/* 무료 존 추가 테스트 4종 — 사주 퍼스널 컬러 · 사주 소울푸드 · 전생에 우리는 · 팔자 MBTI
   free.html이 window.FREE_PLUS를 T에 합친다. run(A, K) → {k,t,p,vis,say,body,share,host?,swatches?,after?}
   K: free.html이 넘겨주는 도구 {Sj, tgCount, esc, jo, bat, hash, PAST, build, B(상대 사주)} */
(function(){
const EK='木火土金水', EN=['나무','불','흙','쇠','물'], GODK=['har','ian','doj','sion','jae'], GODN=['하람','이안','도준','시온','재이'];
const ANI=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];

/* ---------- 공통: 오행 세기와 돕는 오행 ---------- */
function elInfo(Sj,P){ const cnt=Sj.elCount(P), st=Sj.strength(P), dm=P.d[0];
  const fav=[0,1,2,3,4].filter(e=>Sj.favorable(st,Sj.rel(dm,e)));
  const pool=(fav.length?fav:[0,1,2,3,4]).slice().sort((a,b)=>cnt[a]-cnt[b]||a-b);
  const main=pool[0], sub=pool[1]!=null?pool[1]:[0,1,2,3,4].filter(e=>e!==main).sort((a,b)=>cnt[a]-cnt[b])[0];
  const over=[0,1,2,3,4].sort((a,b)=>cnt[b]-cnt[a]||a-b)[0];
  return {cnt,st,main,sub,over,blank:cnt.indexOf(Math.min(...cnt))}; }

/* ================= 1. 사주 퍼스널 컬러 ================= */
const PAL=[
 {tone:'새순 청자 톤',season:'봄 라이트',temp:'웜',key:'맑고 가벼운 초록과 버터빛',best:[['청자','#8FC1B5'],['연두','#B8DB8E'],['민트','#A8E2CC'],['피스타치오','#CADFA2'],['쑥','#7F9A6A'],['버터','#F3E3A0']],
  lip:['피치 코랄','#F2A285'],eye:['웜 베이지','#B8906A'],nail:['세이지 그린','#A7BFA0'],hair:['밀크 브라운','#8A6A4F'],metal:'로즈골드',fabric:'린넨 · 얇은 니트',mood:'풋풋하고 생기 있는 인상'},
 {tone:'다홍 연지 톤',season:'여름 비비드',temp:'웜',key:'선명한 다홍과 연지빛',best:[['다홍','#E5533D'],['연지','#DD4A6E'],['산호','#FF8066'],['살구','#F6A375'],['홍매','#C93463'],['크림','#F6E7D4']],
  lip:['체리 레드','#C9283E'],eye:['코랄 브라운','#C0715A'],nail:['토마토 레드','#D33A3A'],hair:['레드 브라운','#7A3B2E'],metal:'옐로 골드',fabric:'새틴 · 광택 있는 소재',mood:'한눈에 들어오는 화사한 인상'},
 {tone:'치자 황토 톤',season:'가을 뮤트',temp:'웜',key:'따뜻하게 가라앉은 흙빛',best:[['치자','#E8B04B'],['황토','#C38F45'],['카멜','#C09A6E'],['테라코타','#C46A4C'],['올리브','#8B8A4F'],['모카','#8B6B52']],
  lip:['브릭 MLBB','#A9554A'],eye:['카키 브라운','#8C7454'],nail:['머스터드','#D3A43A'],hair:['초콜릿 브라운','#5A3E2E'],metal:'앤틱 골드',fabric:'스웨이드 · 코듀로이',mood:'편안하고 깊이 있는 인상'},
 {tone:'백자 은회 톤',season:'여름 라이트',temp:'쿨',key:'희고 맑은 백자빛과 은회색',best:[['백자','#F3EFE7'],['은회','#B8BEC6'],['라벤더','#BDB5D6'],['하늘','#AFCBEA'],['로즈쿼츠','#EFC3D0'],['진주','#E8E1D5']],
  lip:['쿨 로즈','#D9798F'],eye:['그레이 모브','#9C8E9F'],nail:['밀키 핑크','#F2D3DA'],hair:['애쉬 브라운','#6E6461'],metal:'실버',fabric:'셔츠 코튼 · 시폰',mood:'깨끗하고 단정한 인상'},
 {tone:'쪽빛 먹 톤',season:'겨울 딥',temp:'쿨',key:'깊은 쪽빛과 먹빛',best:[['쪽빛','#2E4C8F'],['감청','#1E2A5C'],['먹','#2A2A2E'],['버건디','#7B1E3E'],['딥 틸','#145D63'],['아이스 블루','#D4E6F4']],
  lip:['베리 플럼','#8E2F55'],eye:['차콜','#4A4652'],nail:['딥 네이비','#23305E'],hair:['블루 블랙','#1C1F2A'],metal:'화이트골드',fabric:'울 · 가죽',mood:'또렷하고 시크한 인상'}];
const lum=h=>{ const n=parseInt(h.slice(1),16), r=n>>16&255, g=n>>8&255, b=n&255; return (r*299+g*587+b*114)/1000; };
const ink=h=>lum(h)>150?'#1b1714':'#fff';
function runColor(A,K){ const I=elInfo(K.Sj,A.P), M=PAL[I.main], S=PAL[I.sub], O=PAL[I.over]===M?null:PAL[I.over];
  const avoid=O?[O.best[0],O.best[4]]:[['형광 네온','#39FF14'],['쨍한 오렌지','#FF6A00']];
  const t=new Date(), today=M.best[(t.getDate()+A.P.d[1])%6];
  const nm=A.name||'너';
  const chip=([n,h],big)=>`<div class="pc-chip${big?' big':''}" style="--c:${h};color:${ink(h)}"><b>${n}</b><small>${h.toUpperCase()}</small></div>`;
  const vis=`<div class="pc-card" style="--m:${M.best[0][1]};--m2:${M.best[2][1]};--s:${S.best[0][1]}">
     <div class="pc-top" style="color:${ink(M.best[0][1])}"><small>SAJU PERSONAL COLOR · ${M.temp}톤</small><h2>${M.tone}</h2><p>${M.season} · ${M.key}</p></div>
     <div class="pc-grid">${M.best.map((c,i)=>chip(c,i===0)).join('')}</div>
     <div class="pc-sub"><span>서브 컬러 · ${S.tone}</span><i style="background:${S.best[0][1]}"></i><i style="background:${S.best[1][1]}"></i><i style="background:${S.best[2][1]}"></i></div>
   </div>`;
  const drape=`<div class="box pc-dr"><h3>내 얼굴에 대 보기</h3>
     <p class="pc-note">셀카를 올리면 잘 받는 색과 피할 색 위에 얼굴을 올려 비교해 줘요. 사진은 이 기기 안에서만 쓰이고 어디에도 올라가지 않아요.</p>
     <div class="pc-dg" id="pcDg">${[[M.best[0],'생기 UP'],[M.best[3],'화사함 UP'],[avoid[0],'칙칙해짐'],[avoid[1],'피곤해 보임']].map(([c,l],i)=>`<div class="pc-d${i>1?' bad':''}" style="--c:${c[1]}"><span class="pc-face"></span><b>${c[0]}</b><small>${l}</small></div>`).join('')}</div>
     <label class="pc-up"><input type="file" accept="image/*" id="pcFile" hidden>셀카 올려서 대 보기</label></div>`;
  const beauty=`<div class="box"><h3>나에게 맞는 뷰티 · 스타일</h3><div class="pc-bt">${[['립',M.lip],['아이',M.eye],['네일',M.nail],['헤어',M.hair]].map(([l,c])=>`<div><i style="background:${c[1]}"></i><small>${l}</small><b>${c[0]}</b></div>`).join('')}</div>
     <div class="li"><i>✦</i><span>액세서리는 <b>${M.metal}</b>, 소재는 <b>${M.fabric}</b>이 잘 어울려요.</span></div>
     <div class="li"><i>✦</i><span>이 팔레트를 입으면 <b>${M.mood}</b>이 살아나요.</span></div></div>`;
  const why=`<div class="box"><h3>왜 이 색이냐면</h3><p>${K.esc(nm)}의 사주 여덟 글자에서 오행을 세면 ${EK.split('').map((e,i)=>`${EN[i]} ${I.cnt[i]}`).join(' · ')}이에요. ${I.st.label}한 사주라 <b>${EN[I.main]}(${EK[I.main]})</b> 기운이 들어올 때 가장 균형이 맞아요. 그래서 ${EN[I.main]}의 색이 메인 컬러가 됐어요.</p>
     <p>${O?`반대로 이미 넘치는 <b>${EN[I.over]}(${EK[I.over]})</b>의 색(${avoid.map(c=>c[0]).join(' · ')})은 얼굴을 더 무겁게 만들 수 있어 피하는 게 좋아요.`:'넘치는 기운이 메인과 같아서, 형광처럼 너무 쨍한 색만 피하면 돼요.'}</p>
     <p class="pc-today"><span style="background:${today[1]}"></span>오늘의 행운 색 · <b>${today[0]}</b></p></div>`;
  return {host:GODK[I.main],k:`사주 퍼스널 컬러 · ${M.temp}톤`,t:M.tone,p:`${M.season} · ${M.key}`,vis,
    say:[`이 색, 너한테 진짜 잘 어울려요. 봄볕처럼.`,`이 색 입고 나가. 시선 다 너한테 온다.`,`이 색이 네 얼굴을 받쳐 준다. 믿어.`,`이 색이 당신을 가장 깨끗하게 보이게 합니다.`,`이 색, 너랑 닮았어. 조용히 깊은 색.`][I.main],
    body:drape+beauty+why,swatches:M.best.map(c=>c[1]),share:[`${nm==='너'?'내':K.esc(nm)} 사주 퍼스널 컬러`,M.tone,`${M.season} · 메인 ${M.best[0][0]} · 립 ${M.lip[0]}`],
    after(){ const f=document.getElementById('pcFile'); if(!f) return; f.onchange=()=>{ const x=f.files&&f.files[0]; if(!x) return; const u=URL.createObjectURL(x);
      document.querySelectorAll('#pcDg .pc-face').forEach(e=>{ e.style.backgroundImage=`url('${u}')`; e.classList.add('on'); }); f.parentNode.lastChild.textContent='다른 사진으로 바꾸기'; }; }}; }

/* ================= 2. 사주 소울푸드 ================= */
const FOOD=[
 {taste:'신맛',col:'초록',soul:['쌈밥 정식','나물 비빔밥','초계국수','그린 샐러드볼','키위 요거트','청포도 타르트'],drink:'유자차',snack:'청포도',why:'새순처럼 시작하는 힘을 채워 줘요. 지칠 때 상큼한 게 당기는 이유예요.'},
 {taste:'쓴맛',col:'빨강',soul:['토마토 스튜','육회 비빔밥','김치찌개','딸기 케이크','다크 초콜릿','아메리카노'],drink:'오미자차',snack:'딸기',why:'꺼진 불씨를 다시 지펴요. 의욕이 바닥일 때 붉은 음식이 힘이 돼요.'},
 {taste:'단맛',col:'노랑',soul:['단호박죽','군고구마','꿀떡','옥수수 버터구이','된장찌개','카스텔라'],drink:'식혜',snack:'호떡',why:'흔들리는 마음에 바닥을 깔아 줘요. 불안할 때 달달한 게 당기는 이유예요.'},
 {taste:'매운맛',col:'하양',soul:['마라탕','설렁탕','마늘 보쌈','양파 수프','배숙','생강 쿠키'],drink:'생강차',snack:'배',why:'흐릿한 머리를 맑게 정리해 줘요. 결정 앞에서 칼칼한 게 당기는 이유예요.'},
 {taste:'짠맛',col:'검정',soul:['짜장면','미역국','장어덮밥','오징어 먹물 파스타','김밥','흑임자 라떼'],drink:'검은콩 두유',snack:'김부각',why:'메마른 마음을 적셔 줘요. 밤에 짭짤한 게 당기는 이유예요.'}];
function runFood(A,K){ const Sj=K.Sj, I=elInfo(Sj,A.P), F=FOOD[I.main], O=FOOD[I.over];
  const t=new Date(), dp=Sj.dayPillar(t.getFullYear(),t.getMonth()+1,t.getDate()); const c2=I.cnt.slice(); c2[Sj.stEl(dp[0])]++; c2[Sj.BR_EL[dp[1]]]++;
  const te=c2.indexOf(Math.min(...c2)), TF=FOOD[te], pick=TF.soul[(t.getDate()+A.P.d[0])%6];
  const db=A.P.d[1]; let mate=-1; for(let z=0;z<12;z++) if(Sj.isHap(z,db)) mate=z;
  const nm=A.name||'너';
  const vis=`<div class="fd-board"><div class="fd-h"><small>주막 차림표</small><b>${K.esc(nm==='너'?'내':nm)} 사주의 소울푸드</b></div>
     <div class="fd-strips">${F.soul.map((x,i)=>`<span style="--r:${[-2,1.5,-1,2,-1.5,1][i]}deg">${x}</span>`).join('')}</div>
     <div class="fd-taste"><span>${F.taste}</span><span>${F.col} 음식</span><span>${EN[I.main]}(${EK[I.main]}) 기운</span></div></div>`;
  const body=`<div class="box fd-today"><h3>오늘의 정식</h3><div class="fd-set"><b>${pick}</b><small>곁들임 · ${TF.snack}　마실 것 · ${TF.drink}</small></div>
      <p>오늘 일진은 ${Sj.GAN[dp[0]]}${Sj.JI[dp[1]]}이에요. 내 사주에 오늘 기운을 더하면 <b>${EN[te]}</b>${K.bat(EN[te])?'이':'가'} 가장 모자라서, ${TF.taste} 나는 ${TF.col} 음식이 오늘 몸을 맞춰 줘요.</p></div>
    <div class="box"><h3>왜 이 맛이 당기냐면</h3><p>내 사주에서 가장 필요한 기운은 <b>${EN[I.main]}(${EK[I.main]})</b>이에요. 옛 오행 이론에서 ${EN[I.main]}은 <b>${F.taste}</b>과 <b>${F.col}</b> 음식과 짝이에요. ${F.why}</p>
      <p>${I.over!==I.main?`이미 넘치는 ${EN[I.over]}의 ${O.taste}(예: ${O.soul.slice(0,2).join(', ')})은 매일 먹기보다 가끔이 좋아요.`:''}</p></div>
    <div class="box"><h3>밥 궁합</h3>
      <div class="li"><i>✦</i><span>같이 먹으면 맛있는 사람 · <b>${EN[I.main]} 기운이 넘치는 친구</b>. 내 빈 접시를 채워 주는 사람이에요.</span></div>
      ${mate>=0?`<div class="li"><i>✦</i><span>밥 친구로 찰떡인 띠 · <b>${ANI[mate]}띠</b>. 내 일지 ${Sj.JI[db]}와 합이라 메뉴 고를 때 안 싸워요.</span></div>`:''}
      <div class="li"><i>✦</i><span>나한테 맞는 식사 시간 · ${['아침 일찍','점심 한낮','오후 서너 시','저녁 무렵','밤 늦게'][I.main]}에 먹는 한 끼가 제일 잘 맞아요.</span></div></div>`;
  return {host:GODK[I.main],k:`사주 소울푸드 · ${F.taste}`,t:F.soul[0],p:`${EN[I.main]} 기운을 채우는 ${F.taste}, ${F.col} 음식`,vis,
    say:[`오늘은 이거 드세요. 제가 사 드리고 싶네요.`,`이거 먹어. 먹고 힘내서 나랑 놀자.`,`밥은 먹고 다니냐. 이거 먹어.`,`식사는 거르지 마십시오. 이 메뉴로.`,`이거 먹고 푹 자. 내일은 괜찮을 거야.`][I.main],
    body,share:[`${nm==='너'?'내':K.esc(nm)} 사주 소울푸드`,F.soul[0],`${F.taste} · ${F.col} 음식 · 오늘의 정식 ${pick}`]}; }

/* ================= 3. 전생에 우리는 ================= */
const ERA=['태종','세종','성종','중종','선조','숙종','영조','정조'], TOWN=['한양 운종가','개성 장터','전주 객사','동래 포구','평양 대동문','경주 저잣거리','제주 관덕정','강릉 경포'];
function roleOf(K,P){ const c=K.tgCount(P), m=K.Sj.tgBranch(P.d[0],P.m[1]); let b=m; Object.keys(c).forEach(k=>{ if(c[k]>c[b]) b=k; }); return K.PAST[b]; }
function runPair(A,K){ const Sj=K.Sj, B=K.B; if(!B) return null; const a=A.P, b=B.P, na=A.name||'나', nb=B.name||'그 사람';
  const ea=Sj.stEl(a.d[0]), eb=Sj.stEl(b.d[0]), ra=roleOf(K,a), rb=roleOf(K,b);
  const SAMH=[[8,0,4],[2,6,10],[5,9,1],[11,3,7]], WJ=[[0,7],[1,6],[2,9],[3,8],[4,11],[5,10]];
  const wj=WJ.some(([x,y])=>(a.d[1]===x&&b.d[1]===y)||(a.d[1]===y&&b.d[1]===x));
  let R;
  if(Sj.isHap(a.d[1],b.d[1])) R={k:'일지 육합',t:'혼례 올린 부부',s:'장터에서 첫눈에 반해 결국 혼례까지 올린 사이',now:'이번 생에도 이유 없이 편하고, 떨어지면 허전한 사이예요.',sc:96};
  else if(Math.abs(a.d[0]-b.d[0])===5) R={k:'일간 천간합',t:'몰래 연서 주고받던 사이',s:'담장 너머로 밤마다 연서를 주고받던 사이',now:'말 안 해도 마음이 통하는 순간이 자주 와요. 문자 답장이 유난히 기다려지는 사이.',sc:93};
  else if(wj) R={k:'일지 원진',t:'원수 집안의 두 사람',s:'원수 집안에서 태어나 몰래 마음을 나눈 사이',now:'괜히 서운하다가도 결국 다시 찾게 되는 사이예요. 오해는 그날 풀기.',sc:81};
  else if(Sj.isChung(a.d[1],b.d[1])) R={k:'일지 충',t:'숙명의 라이벌',s:'같은 장터에서 매일 붙던 숙명의 라이벌',now:'부딪히는 만큼 서로를 키워 줘요. 같은 편이 되면 무서운 팀이에요.',sc:84};
  else if(SAMH.some(g=>g.includes(a.d[1])&&g.includes(b.d[1]))&&a.d[1]!==b.d[1]) R={k:'일지 삼합',t:'등을 맡긴 한 패',s:'같은 패에서 서로 등을 맡기던 동료',now:'같이 뭘 하면 일이 되는 사이예요. 둘이 하는 프로젝트 하나 만들어 봐요.',sc:90};
  else if(ea===eb) R={k:`같은 ${EN[ea]} 일간`,t:'의형제를 맺은 사이',s:'술잔을 나누며 의형제를 맺은 사이',now:'말투도 고집도 닮았어요. 친구로는 최고, 다툼도 금방 풀려요.',sc:88};
  else if((ea+1)%5===eb) R={k:`${EN[ea]}이 ${EN[eb]}을 살림`,t:'스승과 제자',s:`${na}이(가) 스승, ${nb}이(가) 제자로 만난 사이`,now:`이번 생에도 ${na} 쪽이 챙겨 주고 가르쳐 주는 사이예요.`,sc:86};
  else if((eb+1)%5===ea) R={k:`${EN[eb]}이 ${EN[ea]}을 살림`,t:'제자와 스승',s:`${nb}이(가) 스승, ${na}이(가) 제자로 만난 사이`,now:`이번 생에도 ${nb} 쪽이 기대게 해 주는 사이예요.`,sc:86};
  else if((ea+2)%5===eb) R={k:`${EN[ea]}이 ${EN[eb]}을 다스림`,t:'주막 주인과 외상 단골',s:`${na}은(는) 주막 주인, ${nb}은(는) 외상값이 쌓인 단골`,now:`${na} 쪽이 주도권을 쥐어요. 대신 ${nb} 덕에 웃을 일이 많아요.`,sc:79};
  else R={k:`${EN[eb]}이 ${EN[ea]}을 다스림`,t:'주막 주인과 외상 단골',s:`${nb}은(는) 주막 주인, ${na}은(는) 외상값이 쌓인 단골`,now:`${nb} 쪽이 주도권을 쥐어요. 대신 ${na} 덕에 웃을 일이 많아요.`,sc:79};
  const fix=s=>s.replace(/(\S+)이\(가\)/g,(m,w)=>K.jo(w,'이','가')).replace(/(\S+)은\(는\)/g,(m,w)=>K.jo(w,'은','는'));
  R.s=fix(R.s); R.now=fix(R.now);
  const h=K.hash(a.d.join('')+b.d.join('')), era=ERA[h%8], town=TOWN[Math.floor(h/8)%8];
  const tag=(n,r)=>`<div class="pl-tag"><small>${r.j}</small><b>${K.esc(n)}</b><span>${r.n}</span></div>`;
  const vis=`<div class="pl-scroll"><div class="pl-in"><small class="pl-era">${era} 시절 · ${town}</small>
     <div class="pl-tags">${tag(na,ra)}<div class="pl-knot"><i></i><b>${R.sc}</b><small>인연 지수</small></div>${tag(nb,rb)}</div>
     <h2>${R.t}</h2><p>${R.s}</p></div></div>`;
  const body=`<div class="box"><h3>그때 두 사람은</h3><div class="li"><i>1</i><span><b>${K.esc(na)}</b> · ${ra.s}</span></div><div class="li"><i>2</i><span><b>${K.esc(nb)}</b> · ${rb.s}</span></div>
      <p style="margin-top:10px">${R.s}. 그 인연이 이번 생까지 이어졌어요.</p></div>
    <div class="box"><h3>이번 생에서는</h3><p>${R.now}</p><p style="font-size:12.5px;color:var(--ink-3);margin:0">근거 · 두 사람 일주 ${Sj.GAN[a.d[0]]}${Sj.JI[a.d[1]]} × ${Sj.GAN[b.d[0]]}${Sj.JI[b.d[1]]} · ${R.k}. 전생 역할은 각자 여덟 글자에서 가장 강한 십성으로 정했어요.</p></div>`;
  return {host:'taeo',k:`전생에 우리는 · ${R.k}`,t:R.t,p:`${era} 시절 ${town}, ${R.s}`,vis,
    say:R.sc>=90?'와, 전생부터 엮였네. …이번 생에도 놓치지 마, 누나.':R.sc>=84?'전생에도 붙어 있었구나. 이번 생은 같은 편 해.':'외상값은 이번 생에 갚는 걸로. 웃기다, 둘.',
    body,share:[`${na} × ${nb}, 전생에 우리는`,R.t,R.s]}; }

/* ================= 4. 팔자 MBTI ================= */
const MB={
 ESTJ:['육의전 행수','시장 질서를 바로 세우던 대상인','판을 정리하고 사람을 움직이는 힘'],ESTP:['남사당 줄광대','줄 위에서 장터를 뒤집던 광대','위기에서 더 빛나는 순발력'],
 ESFJ:['주막 안주인','손님 사정을 다 기억하던 주막 안주인','사람을 챙기고 분위기를 만드는 힘'],ESFP:['장터 꽃광대','어디서든 판을 벌이던 꽃광대','있기만 해도 즐거워지는 에너지'],
 ENTJ:['병조판서','큰 판을 짜고 지휘하던 대신','목표를 정하면 길을 만드는 추진력'],ENTP:['팔도 이야기꾼','저잣거리에서 소설을 읽어 주던 전기수','말과 아이디어로 판을 뒤집는 재치'],
 ENFJ:['서당 훈장','아이들 재능을 먼저 알아보던 훈장','사람을 키우고 이끄는 힘'],ENFP:['유랑 화공','팔도를 떠돌며 그림을 그리던 화공','새로운 걸 보면 가슴이 뛰는 호기심'],
 ISTJ:['호조 서리','한 푼도 틀리지 않던 장부 담당','맡은 일은 끝까지 해내는 성실함'],ISTP:['대장장이','말없이 쇠를 두드려 명검을 만들던 장인','손으로 문제를 푸는 실전 감각'],
 ISFJ:['내의원 의녀','조용히 사람을 살리던 의녀','티 안 나게 챙기는 따뜻함'],ISFP:['도공','흙으로 마음을 빚던 도공','자기만의 감각과 취향'],
 INTJ:['관상감 천문관','별을 읽어 앞날을 계산하던 천문관','멀리 보고 혼자 설계하는 힘'],INTP:['실학 발명가','이상한 기계를 만들던 실학자','끝까지 파고드는 탐구심'],
 INFJ:['서원 은둔 선비','세상을 꿰뚫어 보던 은둔 선비','말없이 사람 속을 읽는 통찰'],INFP:['규방 시인','밤마다 시를 쓰던 규방 시인','상처도 아름답게 바꾸는 감수성']};
const AXN={E:'외향',I:'내향',S:'감각',N:'직관',T:'사고',F:'감정',J:'계획',P:'즉흥'};
function runMbti(A,K){ const Sj=K.Sj, P=A.P, c=K.tgCount(P), e=Sj.elCount(P), yang=P.d[0]%2===0;
  const ax=[['E','I',c['비견']*.5+c['겁재']+c['식신']+c['상관']+c['편재']+e[1]*.4+(yang?.6:0), c['정인']+c['편인']+c['정관']+c['정재']*.5+e[4]*.4+(yang?0:.6)],
    ['S','N',c['정재']+c['정관']+c['식신']*.5+e[2]*.5+e[3]*.3, c['편인']+c['상관']+c['편재']*.5+e[4]*.3+e[0]*.3+e[1]*.2],
    ['T','F',c['편관']+c['정관']*.5+c['겁재']*.5+c['편재']*.5+e[3]*.6, c['식신']+c['정인']+c['상관']*.5+e[0]*.4+e[1]*.3+e[4]*.3],
    ['J','P',c['정관']+c['정재']+c['정인']*.5+e[2]*.5, c['편재']+c['상관']+c['편관']*.5+c['편인']*.5+e[1]*.3]];
  const L=ax.map(([x,y,a,b])=>{ let p=a+b>0?a/(a+b):.5; p=Math.max(.15,Math.min(.85,p)); if(Math.abs(p-.5)<.02) p=yang?.56:.44; return {x,y,p,w:p>=.5?x:y}; });
  const type=L.map(o=>o.w).join(''), R=MB[type], nm=A.name||'너';
  const vis=`<div class="mb-card"><div class="mb-type">${[...type].map((ch,i)=>`<span style="--c:${['#ff7a5c','#7ea6ff','#e8b64f','#5fcf95'][i]}">${ch}</span>`).join('')}</div><b>${R[0]}</b><small>${R[1]}</small></div>
    <div class="box mb-ax">${L.map(o=>`<div class="mb-row"><span class="${o.w===o.x?'on':''}">${o.x} ${AXN[o.x]}</span><div class="mb-bar"><i style="width:${Math.round(o.p*100)}%"></i></div><span class="${o.w===o.y?'on':''}">${AXN[o.y]} ${o.y}</span></div>`).join('')}</div>`;
  const body=`<div class="box"><h3>사주가 본 ${K.esc(nm)}</h3><p>${R[0]}. ${R[1]}처럼, <b>${R[2]}</b>을 타고났어요.</p>
      <p style="font-size:12.5px;color:var(--ink-3);margin:0">근거 · 여덟 글자의 십성 ${Object.entries(c).filter(x=>x[1]>0).sort((p,q)=>q[1]-p[1]).slice(0,4).map(x=>x[0]+' '+x[1]).join(' · ')}, 일간 ${Sj.GAN[P.d[0]]}(${yang?'양':'음'})으로 네 축을 계산했어요. 바깥으로 뻗는 십성(식신 · 상관 · 재성)이 많으면 E, 안으로 모으는 십성(인성 · 관성)이 많으면 I 쪽이에요.</p></div>
    <div class="box"><h3>실제 내 MBTI랑 비교하기</h3><div class="mb-pick" id="mbPick">${Object.keys(MB).map(k=>`<button type="button" data-m="${k}">${k}</button>`).join('')}</div><div id="mbCmp"></div></div>`;
  return {host:'ian',k:'팔자 MBTI',t:type,p:`${R[0]} · ${R[1]}`,vis,
    say:`사주로 보면 넌 ${type}. …맞지. 아니라고 하면, 그게 더 재밌고.`,body,share:[`${nm==='너'?'내':K.esc(nm)} 팔자 MBTI`,`${type} ${R[0]}`,R[2]],
    after(){ const pk=document.getElementById('mbPick'); if(!pk) return; pk.onclick=ev=>{ const bt=ev.target.closest('[data-m]'); if(!bt) return; pk.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===bt));
      const m=bt.dataset.m, same=[...m].filter((ch,i)=>ch===type[i]).length, diff=[...m].map((ch,i)=>ch!==type[i]?i:-1).filter(i=>i>=0);
      const msg=same===4?'사주 그대로 사는 중이에요. 타고난 대로 살아서 에너지가 덜 새요.':same>=2?'반은 타고났고, 반은 살면서 만든 나예요.':'타고난 것과 거의 반대로 살고 있어요. 쉽게 지친다면 여기서 새는 거예요.';
      document.getElementById('mbCmp').innerHTML=`<div class="mb-res"><b>${same} / 4 일치</b><p>${msg}</p>${diff.map(i=>`<p class="mb-d">${type[i]} → ${m[i]} · 타고난 건 <b>${AXN[type[i]]}</b>인데 지금은 <b>${AXN[m[i]]}</b>으로 살고 있어요. ${[['사람을 만나고 나서 유난히 지친다면 여기','혼자 있는 시간이 길어지면 처지는 이유'],['디테일에 쫓겨 큰 그림을 놓치기 쉬움','현실 감각을 억지로 끌어 쓰는 중'],['마음 쓰는 일에 에너지를 많이 씀','감정을 누르고 판단부터 하는 중'],['즉흥이 편한데 계획에 맞추느라 피곤함','계획이 편한데 상황에 끌려다니는 중']][i][type[i]===L[i].x?0:1]}</p>`).join('')}</div>`; }; }}; }

/* ---------- 스타일 ---------- */
const css=`
.pc-card{position:relative;overflow:hidden;background:linear-gradient(160deg,var(--m),var(--m2));box-shadow:0 18px 40px rgba(0,0,0,.35)}
.pc-top{padding:22px 20px 16px}.pc-top small{display:block;font-size:11px;font-weight:800;letter-spacing:.18em;opacity:.8}
.pc-top h2{margin:8px 0 4px;font-family:var(--brush,'Noto Serif KR');font-weight:400;font-size:40px;line-height:1.1}.pc-top p{margin:0;font-size:13.5px;opacity:.85}
.pc-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:0}
.pc-chip{background:var(--c);padding:12px 10px 10px;min-height:86px;display:flex;flex-direction:column;justify-content:flex-end;animation:pcIn .5s both}
.pc-chip:nth-child(2){animation-delay:.08s}.pc-chip:nth-child(3){animation-delay:.16s}.pc-chip:nth-child(4){animation-delay:.24s}.pc-chip:nth-child(5){animation-delay:.32s}.pc-chip:nth-child(6){animation-delay:.4s}
.pc-chip.big{grid-row:span 2;min-height:172px}.pc-chip:nth-child(6){grid-column:1/-1;min-height:54px;flex-direction:row;align-items:center;justify-content:space-between}.pc-chip b{font-size:15px;font-weight:800}.pc-chip small{font-size:10.5px;opacity:.75;letter-spacing:.06em;margin-top:2px}
@keyframes pcIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.pc-sub{display:flex;align-items:center;gap:6px;padding:12px 16px;background:rgba(0,0,0,.28);color:#fff;font-size:12.5px;font-weight:700}
.pc-sub span{margin-right:auto}.pc-sub i{width:22px;height:22px;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,.6)}
.pc-note{font-size:12.5px;color:var(--ink-3)}
.pc-dg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0 12px}
.pc-d{background:var(--c);padding:16px 10px 10px;text-align:center;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.35)}
.pc-d .pc-face{display:block;width:92px;height:92px;margin:0 auto 8px;border-radius:50%;background:rgba(255,255,255,.22) center/cover;box-shadow:0 0 0 3px rgba(255,255,255,.5)}
.pc-d .pc-face:not(.on){background-image:radial-gradient(circle at 50% 38%,rgba(255,255,255,.55) 0 17%,transparent 18%),radial-gradient(ellipse at 50% 95%,rgba(255,255,255,.45) 0 38%,transparent 39%)}
.pc-d b{display:block;font-size:14px}.pc-d small{font-size:11.5px;font-weight:700}.pc-d.bad small{opacity:.9}.pc-d.bad b:before{content:"✕ "}
.pc-up{display:block;text-align:center;padding:13px;border:1px solid var(--line-2,rgba(227,184,102,.4));font-weight:800;font-size:14px;cursor:pointer}
.pc-bt{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}.pc-bt div{text-align:center}
.pc-bt i{display:block;width:44px;height:44px;margin:0 auto 6px;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,.25)}
.pc-bt small{display:block;font-size:11px;color:var(--ink-3)}.pc-bt b{font-size:12.5px}
.pc-today{display:flex;align-items:center;gap:8px;margin:0}.pc-today span{width:18px;height:18px;border-radius:50%}
.fd-board{position:relative;padding:20px 16px 18px;background:linear-gradient(180deg,#3b2a1d,#2a1d14);box-shadow:inset 0 0 0 6px #4a3424,inset 0 0 0 7px #6b4e34,0 18px 40px rgba(0,0,0,.35);color:#f6ead6}
.fd-h small{display:block;font-size:11px;letter-spacing:.2em;color:#e3b866;font-weight:800}.fd-h b{display:block;margin-top:4px;font-family:var(--brush,'Noto Serif KR');font-weight:400;font-size:26px}
.fd-strips{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0 14px}
.fd-strips span{display:flex;align-items:center;justify-content:center;min-height:64px;padding:8px 6px;background:#f4ead6;color:#2a1d14;font-family:var(--bmj,'Noto Serif KR');font-size:16px;line-height:1.25;text-align:center;transform:rotate(var(--r));box-shadow:0 4px 10px rgba(0,0,0,.35)}
.fd-strips span:first-child{background:#c8372d;color:#fff4e6}
.fd-taste{display:flex;gap:6px;flex-wrap:wrap}.fd-taste span{padding:4px 10px;border:1px solid rgba(227,184,102,.5);font-size:12px;font-weight:700;color:#e3b866}
.fd-set{padding:14px;margin-bottom:10px;background:rgba(227,184,102,.08);border:1px solid rgba(227,184,102,.35);text-align:center}
.fd-set b{display:block;font-family:var(--brush,'Noto Serif KR');font-weight:400;font-size:30px}.fd-set small{font-size:12.5px;color:var(--ink-2)}
.pl-scroll{padding:14px;background:linear-gradient(90deg,#5a3a22 0 10px,transparent 10px calc(100% - 10px),#5a3a22 calc(100% - 10px)),#efe2c6;box-shadow:0 18px 40px rgba(0,0,0,.35)}
.pl-in{padding:18px 14px 20px;background:repeating-linear-gradient(0deg,rgba(120,90,50,.05) 0 2px,transparent 2px 6px),#f6ecd4;color:#2b2016;text-align:center}
.pl-era{display:block;font-size:12px;font-weight:800;letter-spacing:.08em;color:#a0522d}
.pl-tags{display:flex;align-items:center;justify-content:center;gap:8px;margin:14px 0}
.pl-tag{width:104px;padding:12px 6px;background:#e9d7ae;box-shadow:inset 0 0 0 2px #b08a52,0 4px 10px rgba(0,0,0,.18)}
.pl-tag small{display:block;font-family:var(--bmj,'Noto Serif KR');font-size:20px;color:#7a2e1f;letter-spacing:.1em}.pl-tag b{display:block;margin:4px 0 2px;font-size:16px}.pl-tag span{font-size:11.5px;color:#5c4632}
.pl-knot{text-align:center}.pl-knot i{display:block;width:44px;height:2px;margin:0 auto 6px;background:#c8372d;box-shadow:0 0 6px rgba(200,55,45,.6)}
.pl-knot b{display:block;font-family:var(--serif);font-size:24px;color:#c8372d}.pl-knot small{font-size:10.5px;color:#7a6650}
.pl-in h2{margin:6px 0 6px;font-family:var(--brush,'Noto Serif KR');font-weight:400;font-size:34px;color:#2b2016}.pl-in p{margin:0;font-size:14px;line-height:1.6;color:#4a3828}
.mb-card{padding:22px 16px 18px;text-align:center;background:radial-gradient(circle at 50% 0,rgba(255,122,92,.25),transparent 60%),#1b1520;box-shadow:inset 0 0 0 1px rgba(255,240,220,.12)}
.mb-type{display:flex;justify-content:center;gap:6px;margin-bottom:10px}
.mb-type span{width:62px;height:76px;display:grid;place-items:center;font-family:var(--serif);font-weight:900;font-size:44px;color:var(--c);background:rgba(255,255,255,.04);box-shadow:inset 0 -3px 0 var(--c);animation:pcIn .5s both}
.mb-type span:nth-child(2){animation-delay:.1s}.mb-type span:nth-child(3){animation-delay:.2s}.mb-type span:nth-child(4){animation-delay:.3s}
.mb-card b{display:block;font-family:var(--brush,'Noto Serif KR');font-weight:400;font-size:28px}.mb-card small{color:var(--ink-2);font-size:13px}
.mb-row{display:grid;grid-template-columns:62px 1fr 62px;align-items:center;gap:8px;margin:8px 0;font-size:12px;color:var(--ink-3)}
.mb-row span:last-child{text-align:right}.mb-row span.on{color:var(--ink);font-weight:800}
.mb-bar{height:8px;background:rgba(126,166,255,.35)}.mb-bar i{display:block;height:100%;background:#ff7a5c}
.mb-pick{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.mb-pick button{height:36px;border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--ink);font-weight:800;font-family:inherit;cursor:pointer}
.mb-pick button.on{border-color:#ff7a5c;color:#ff7a5c}
.mb-res{margin-top:12px}.mb-res b{font-family:var(--serif);font-size:20px;color:#ff7a5c}.mb-res p{margin:6px 0 0;font-size:14px;line-height:1.65}.mb-d{color:var(--ink-2)}
`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);


/* ---------- 입력 화면 미리보기(아래 빈 공간을 채우는 결과 맛보기) ---------- */
const PV={
 color:()=>`<h4>다섯 가지 사주 톤 중 하나가 나와요</h4><div class="pv-tone">${PAL.map(p=>`<div><span>${p.best.slice(0,3).map(c=>`<i style="background:${c[1]}"></i>`).join('')}</span><b>${p.tone}</b><small>${p.season} · ${p.temp}</small></div>`).join('')}</div>`,
 food:()=>`<h4>다섯 맛 · 다섯 색, 내 사주는 어디</h4><div class="pv-food">${FOOD.map((f,i)=>`<div><b>${f.taste}</b><small>${f.col} · ${EN[i]}</small><span>${f.soul[0]}</span></div>`).join('')}</div>`,
 pastus:()=>`<h4>이런 사이가 나와요</h4><div class="pv-chips">${['혼례 올린 부부','몰래 연서 주고받던 사이','원수 집안의 두 사람','숙명의 라이벌','등을 맡긴 한 패','의형제를 맺은 사이','스승과 제자','주막 주인과 외상 단골'].map(t=>`<span>${t}</span>`).join('')}</div>`,
 mbti:()=>`<h4>열여섯 유형, 조선 직업으로</h4><div class="pv-mb">${Object.entries(MB).map(([k,v])=>`<div><b>${k}</b><small>${v[0]}</small></div>`).join('')}</div>`};
const css2=`.pv{margin:18px 0 0;padding:16px 0 4px;border-top:1px solid var(--line)}.pv h4{margin:0 0 12px;font-size:13px;letter-spacing:.06em;color:var(--gold-2,#f3d79b)}
.pv-tone{display:grid;gap:8px}.pv-tone div{display:grid;grid-template-columns:70px 1fr auto;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,.03);border:1px solid var(--line)}
.pv-tone span{display:flex;gap:4px}.pv-tone i{width:18px;height:18px;border-radius:50%}.pv-tone b{font-size:14px}.pv-tone small{font-size:11.5px;color:var(--ink-3)}
.pv-food{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.pv-food div{padding:12px 4px;text-align:center;background:rgba(255,255,255,.03);border:1px solid var(--line)}
.pv-food b{display:block;font-family:var(--bmj);font-size:17px}.pv-food small{display:block;font-size:10.5px;color:var(--ink-3);margin:2px 0 6px}.pv-food span{font-size:11.5px;color:var(--ink-2);line-height:1.35}
.pv-chips{display:flex;flex-wrap:wrap;gap:6px}.pv-chips span{padding:8px 12px;border:1px solid rgba(200,55,45,.45);background:rgba(200,55,45,.08);font-size:13px}
.pv-mb{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.pv-mb div{padding:9px 4px;text-align:center;background:rgba(255,255,255,.03);border:1px solid var(--line)}
.pv-mb b{display:block;font-family:var(--serif);font-size:15px;color:#ff9b80}.pv-mb small{font-size:10.5px;color:var(--ink-2)}`;
const st2=document.createElement('style'); st2.textContent=css2; document.head.appendChild(st2);
window.FREE_PLUS={
 color:{preview:()=>PV.color(),cat:'saju',t:'사주 퍼스널 컬러',tt:'타고난 색은<br>따로 있다',teaser:'오행으로 찾는 내 컬러 팔레트 · 셀카로 대 보기',host:'sion',input:'birth',ld:['오행 섞는 중…','물감 개는 중…','팔레트 짜는 중…'],run:runColor,
   up:{k:'사주가 그린 나',t:'이 색을 입은 내 캐릭터는?',s:'여덟 글자로 그린 2.5D 캐릭터',go:'avatar.html',img:'img/avatar/wood_f.jpg'}},
 food:{preview:()=>PV.food(),cat:'saju',t:'사주 소울푸드',tt:'네 사주가<br>당기는 맛',teaser:'빈칸을 채우는 소울푸드와 오늘의 정식',host:'doj',input:'birth',ld:['주막 차림표 펼치는 중…','오미 맞춰 보는 중…','오늘 일진 간 보는 중…'],run:runFood,
   up:{k:'오늘의 운세 · 서하',t:'오늘 하루, 전부 펼쳐 볼래?',s:'총운·연애·재물·시간대별 흐름',go:'today.html',img:'img/seoha.jpg'}},
 pastus:{preview:()=>PV.pastus(),cat:'love',t:'전생에 우리는',tt:'전생에 우리,<br>무슨 사이였게',teaser:'두 사람 생일로 보는 전생 인연 한 장면',host:'taeo',input:'pair',ld:['두 사람 호패 찾는 중…','조선 팔도 수소문하는 중…','붉은 실 따라가는 중…'],run:runPair,
   up:{k:'도화 궁합 · 태오',t:'이번 생 궁합은 몇 점?',s:'끌림·오래 감 점수, 2027 인연 타이밍',go:'gunghap.html',img:'img/taeo/wink.jpg'}},
 mbti:{preview:()=>PV.mbti(),cat:'psy',t:'팔자 MBTI',tt:'사주로 보면<br>너는 이 유형',teaser:'여덟 글자로 보는 타고난 MBTI, 지금 나와 비교',host:'ian',input:'birth',ld:['여덟 글자 펼치는 중…','십성 세는 중…','네 글자 맞추는 중…'],run:runMbti,
   up:{k:'평생 사주 · 현암',t:'타고난 그릇, 한평생으로 보면?',s:'대운 아홉 마디와 결정적인 해',go:'lifetime.html',img:'img/jeongtong.jpg'}}
};
window.FREE_PLUS_ORDER=['color','food','pastus','mbti'];
})();
