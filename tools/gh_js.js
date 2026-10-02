/* 화면에는 한자 대신 한글 읽기 */
const {GAN_K,JI_K}=Sj, EN=['나무','불','흙','쇠','물'], ANI=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
const bt=w=>{ const c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28>0; }, jo=(w,x,y)=>w+(bt(w)?x:y);
const an=b=>`${JI_K[b]}(${ANI[b]})`;
function compat(A,B,a,b){
  const ea=stEl(A.d[0]), eb=stEl(B.d[0]); const gen=(x,z)=>(x+1)%5===z, ctl=(x,z)=>(x+2)%5===z;
  const chA=[A.y,A.m,A.d,A.h].filter(Boolean).map(p=>p[1]), chB=[B.y,B.m,B.d,B.h].filter(Boolean).map(p=>p[1]);
  const tA=target(A.d[1]), tB=target(B.d[1]);
  let pull=48, stay=50; const pts=[];
  if(chA.includes(tB)){ pull+=16; pts.push([`${a.n}의 사주에 ${b.n}의 도화 글자 ${jo(an(tB),'이','가')} 있어. ${b.n} 쪽에서 먼저 눈길이 가기 쉬운 사이야.`,`${JI_K[tB]} 도화`,1]); }
  if(chB.includes(tA)){ pull+=16; pts.push([`${b.n}의 사주에 ${a.n}의 도화 글자 ${jo(an(tA),'이','가')} 있어. ${ga(a.n)} 이유 없이 끌리는 쪽이야.`,`${JI_K[tA]} 도화`,1]); }
  if(ctl(ea,eb)||ctl(eb,ea)){ pull+=10; const who=ctl(ea,eb)?a.n:b.n; pts.push([`타고난 나(일간)가 ${jo(EN[ea],'과','와')} ${EN[eb]}, 한쪽이 한쪽을 이기는 관계야. ${who} 쪽이 주도하고, 그 긴장이 곧 설렘이 돼.`,`${GAN_K[A.d[0]]} · ${GAN_K[B.d[0]]} 상극`,1]); }
  if(gen(ea,eb)||gen(eb,ea)){ stay+=15; const giver=gen(ea,eb)?a.n:b.n; pts.push([`타고난 나(일간)가 ${jo(EN[ea],'과','와')} ${EN[eb]}, 서로 살려 주는 상생이야. ${giver} 쪽이 챙겨 주고 받는 쪽이 편안해지는 사이.`,`${GAN_K[A.d[0]]} · ${GAN_K[B.d[0]]} 상생`,1]); }
  if(ea===eb){ stay+=8; pull-=2; pts.push([`둘 다 ${EN[ea]}의 사람이야. 친구처럼 말이 잘 통하지만, 둘 다 고집이 같은 방향이라 양보가 필요해.`,`같은 ${EN[ea]}`,0]); }
  if(Sj.isHap(A.d[1],B.d[1])){ stay+=18; pts.push([`배우자 자리(일지) ${jo(JI_K[A.d[1]],'과','와')} ${jo(JI_K[B.d[1]],'이','가')} 합이야. 한번 묶이면 쉽게 안 풀리는 사이.`,`${JI_K[A.d[1]]}${JI_K[B.d[1]]} 합`,1]); }
  if(Sj.isChung(A.d[1],B.d[1])){ stay-=14; pull+=8; pts.push([`배우자 자리(일지) ${jo(JI_K[A.d[1]],'과','와')} ${jo(JI_K[B.d[1]],'이','가')} 충이야. 만나면 불꽃 튀고 싸워도 크게 싸워. 대신 서로를 확 깨워 주는 사이.`,`${JI_K[A.d[1]]}${JI_K[B.d[1]]} 충`,-1]); }
  if(Sj.isHap(A.y[1],B.y[1])){ stay+=7; pts.push([`띠끼리도 합이 돼. 집안이나 주변 사람들과도 잘 어울리는 조합이야.`,`${JI_K[A.y[1]]}${JI_K[B.y[1]]} 합`,1]); }
  if(Sj.isChung(A.y[1],B.y[1])){ stay-=7; pts.push([`띠끼리는 충이야. 사는 방식이나 주변 환경이 달라서 맞춰 가는 시간이 필요해.`,`${JI_K[A.y[1]]}${JI_K[B.y[1]]} 충`,-1]); }
  const cA=Sj.elCount(A), cB=Sj.elCount(B); const wA=cA.indexOf(Math.min(...cA)), sB=cB.indexOf(Math.max(...cB)), wB=cB.indexOf(Math.min(...cB)), sA=cA.indexOf(Math.max(...cA));
  if(wA===sB){ stay+=9; pts.push([`${a.n}에게 부족한 ${EN[wA]} 기운을 ${ga(b.n)} 넉넉히 갖고 있어. 옆에 있으면 채워지는 느낌이 드는 이유.`,`${EN[wA]} 보완`,1]); }
  if(wB===sA){ stay+=9; pts.push([`반대로 ${b.n}에게 모자란 ${EN[wB]} 기운은 ${ga(a.n)} 채워 줘.`,`${EN[wB]} 보완`,1]); }
  if(!pts.length) pts.push([`둘 사이에 크게 부딪히거나 묶이는 글자는 없어. 극적인 사이보다는 천천히 쌓아 가는 사이야.`,'무난',0]);
  pull=Math.max(35,Math.min(97,pull)); stay=Math.max(30,Math.min(97,stay));
  const total=Math.max(52,Math.min(98,Math.round((pull+stay)/2+6)));
  const title=pull>=70&&stay>=65?'끌리고, 오래 가는 사이':pull>=70?'불꽃 튀는 사이':stay>=65?'편안하게 스며드는 사이':'천천히 알아가야 하는 사이';
  const say={ '끌리고, 오래 가는 사이':`솔직히 좀 부럽다. 끌림도 있고 버티는 힘도 있어. 이런 조합은 타이밍만 맞으면 금방이야.`, '불꽃 튀는 사이':`첫 만남부터 확 끌리는 사이야. 근데 불은 빨리 붙고 빨리 번져. 싸운 날은 그날 풀기, 그것만 지키면 돼.`, '편안하게 스며드는 사이':`설렘보다 편안함이 먼저 오는 사이야. 근데 그게 제일 오래 가. 누나가 먼저 한 번만 다가가 봐.`, '천천히 알아가야 하는 사이':`처음엔 잘 모르겠는 사이야. 대신 알면 알수록 달라지는 조합이니까, 한두 번 만나고 판단하지 마.`}[title];
  return {pull,stay,total,title,pts,say,tA,tB,chA,chB};
}
/* ---------- 두 꽃의 접목 기록: 그림 조각 ---------- */
const {bloom,limb,cub,nearX,f1}=window.LBB;
const ROWS=[['y','태어난 해'],['m','태어난 달'],['d','태어난 날'],['h','태어난 시']];
const gsec=(no,t,hint,body)=>`<section class="lb-sec"><div class="lb-h"><span class="lb-no">${no}</span><h3>${t}</h3>${hint?`<small>${hint}</small>`:''}</div>${body}</section>`;
const gwhy=(...ps)=>`<div class="lb-why"><small>근거</small>${ps.filter(Boolean).map(p=>`<p>${p}</p>`).join('')}</div>`;
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const short=n=>n.length>4?n.slice(0,4):n;
/* 위: 두 가지가 가운데서 한 몸으로 묶인 그림 */
function graftSvg(R){ const L=limb([[-8,170],[60,168],[130,142],[180,116]],13,6,60,'#5b4535'), Rr=limb([[368,170],[300,168],[230,142],[180,116]],13,6,60,'#5b4535');
  const up=limb([[180,118],[182,96],[186,76],[192,58]],6,2.2,24);
  const sA=limb([[78,165],[74,146],[66,128],[60,112]],4.4,1.6,20), sB=limb([[282,165],[286,146],[294,128],[300,112]],4.4,1.6,20);
  const wraps=[0,1,2,3].map(k=>`<path d="M${166+k*7} ${104+k*1.5} l10 26" stroke="#c2573f" stroke-width="3.2" stroke-linecap="square" opacity="${.92-k*.08}"/>`).join('');
  return `<svg viewBox="0 0 360 196" role="img" aria-label="두 사람의 가지가 가운데에서 한 몸으로 묶인 그림"><circle cx="60" cy="96" r="58" fill="url(#lbbGlow)"/><circle cx="300" cy="96" r="58" fill="url(#lbbGlow)"/>
   ${L.svg}${Rr.svg}${up.svg}${sA.svg}${sB.svg}<path d="M158 122 Q180 132 202 122 L200 110 Q180 118 160 110Z" fill="#efe2cc" stroke="#a88b70" stroke-width=".8"/>${wraps}
   ${bloom(60,96,27,4,{rot:-8})}${bloom(300,96,27,4,{rot:8})}${bloom(192,56,7,1,{rot:10})}${bloom(120,150,6,0,{rot:-30})}${bloom(242,150,6,0,{rot:30})}
   <text x="180" y="190" text-anchor="middle" font-size="10" fill="#9a8b7a" letter-spacing=".08em">접붙인 자리</text></svg>`; }
/* 01 · 두 원국 나란히 + 맞닿는 선 */
function relKind(x,y){ const ks=window.SajuX.branchRel(x,{y:[x%2,y]}).map(r=>r.k); return ks.includes('충')?'충':ks.includes('육합')?'합':ks.includes('원진')?'원진':ks.includes('삼합')?'삼합':''; }
function zig(x1,y1,x2,y2){ const n=Math.max(6,Math.round(Math.hypot(x2-x1,y2-y1)/9)); let d=`M${f1(x1)} ${f1(y1)}`; const dx=(x2-x1)/n, dy=(y2-y1)/n, l=Math.hypot(dx,dy)||1, nx=-dy/l*4.5, ny=dx/l*4.5;
  for(let k=1;k<n;k++) d+=`L${f1(x1+dx*k+(k%2?nx:-nx))} ${f1(y1+dy*k+(k%2?ny:-ny))}`; return d+`L${f1(x2)} ${f1(y2)}`; }
function relSvg(A,B,a,b,R){ const W=360, cw=112, top=40, rh=66, ch=56, lines=[];
  const cell=(P,side,tgt)=>ROWS.map(([k,lab],r)=>{ const x0=side?W-cw:0, y0=top+r*rh, p=P[k], day=k==='d';
    if(!p) return `<rect x="${x0+.5}" y="${y0+.5}" width="${cw-1}" height="${ch-1}" fill="none" stroke="#9a8b7a" stroke-dasharray="3 3"/><text x="${x0+9}" y="${y0+16}" font-size="9.5" fill="#9a8b7a">${lab}</text><text x="${x0+cw/2}" y="${y0+40}" text-anchor="middle" font-size="13" font-weight="700" fill="#9a8b7a">모름</text>`;
    const mk=p[1]===tgt&&!day;
    return `<rect x="${x0+.5}" y="${y0+.5}" width="${cw-1}" height="${ch-1}" fill="#fffdf8" stroke="${day?'#c2573f':'rgba(42,33,25,.2)'}" stroke-width="${day?1.6:1}"/>
     <text x="${x0+9}" y="${y0+16}" font-size="9.5" font-weight="700" fill="${day?'#a13f2c':'#9a8b7a'}">${day?'배우자 자리':lab}</text><text x="${x0+cw-9}" y="${y0+16}" text-anchor="end" font-size="9.5" fill="#9a8b7a">${ANI[p[1]]}</text>
     <text x="${x0+cw/2}" y="${y0+44}" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="20" font-weight="900" fill="#2a2119">${GAN_K[p[0]]+JI_K[p[1]]}</text>${mk?bloom(side?x0+12:x0+cw-12,y0+ch-12,8,3,{}):''}`; }).join('');
  ROWS.forEach(([ka],i)=>ROWS.forEach(([kb],j)=>{ const pa=A[ka], pb=B[kb]; if(!pa||!pb) return; if(!(i===j||ka==='d'||kb==='d')) return; const k=relKind(pa[1],pb[1]); if(k) lines.push({i,j,k}); }));
  const cnt={}; let L='', lab='';
  lines.forEach((o,n)=>{ cnt['a'+o.i]=(cnt['a'+o.i]||0)+1; cnt['b'+o.j]=(cnt['b'+o.j]||0)+1;
    const ya=top+o.i*rh+ch/2+(cnt['a'+o.i]-1)*7-4, yb=top+o.j*rh+ch/2+(cnt['b'+o.j]-1)*7-4, x1=cw, x2=W-cw;
    const d=`M${x1} ${f1(ya)}C${x1+52} ${f1(ya)} ${x2-52} ${f1(yb)} ${x2} ${f1(yb)}`;
    if(o.k==='충') L+=`<path d="${zig(x1+4,ya,x2-4,yb)}" fill="none" stroke="#2a2119" stroke-width="1.6" stroke-linejoin="miter"/>`;
    else if(o.k==='원진') L+=`<path d="${d}" fill="none" stroke="#6b5d4f" stroke-width="1.6" stroke-dasharray="5 4"/>`;
    else L+=`<path d="${d}" fill="none" stroke="#c2573f" stroke-width="${o.k==='합'?2.4:1.4}"/>`;
    L+=`<circle cx="${x1}" cy="${f1(ya)}" r="3" fill="${o.k==='충'||o.k==='원진'?'#2a2119':'#c2573f'}"/><circle cx="${x2}" cy="${f1(yb)}" r="3" fill="${o.k==='충'||o.k==='원진'?'#2a2119':'#c2573f'}"/>`;
    const t=.5+((n%3)-1)*.16, mx=x1+(x2-x1)*t, my=ya+(yb-ya)*t;
    lab+=`<text x="${f1(mx)}" y="${f1(my+4)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${o.k==='충'||o.k==='원진'?'#2a2119':'#a13f2c'}" paint-order="stroke" stroke="#faf4ea" stroke-width="4">${o.k}</text>`; });
  const none=lines.length?'':`<text x="180" y="${top+2*rh-4}" text-anchor="middle" font-size="10.5" fill="#9a8b7a">맞닿는 선이</text><text x="180" y="${top+2*rh+11}" text-anchor="middle" font-size="10.5" fill="#9a8b7a">없어요</text>`;
  const head=`<text x="${cw/2}" y="24" text-anchor="middle" font-size="12.5" font-weight="900" fill="#2a2119">${esc(short(a.n))}</text><text x="${W-cw/2}" y="24" text-anchor="middle" font-size="12.5" font-weight="900" fill="#2a2119">${esc(short(b.n))}</text>`;
  return {svg:`<svg viewBox="0 0 360 ${top+4*rh}" role="img" aria-label="두 사람의 원국을 나란히 놓고 맞닿는 글자를 선으로 이은 그림">${head}${cell(A,0,R.tB)}${cell(B,1,R.tA)}${L}${lab}${none}</svg>`,lines}; }
/* 02 · 누가 누구에게 끌리나 */
function pullSvg(a,b,ab,ba){ const arr=(on,up,lbl)=>{ const y=up?60:112, d=up?`M118 ${y}Q180 ${y-26} 240 ${y}`:`M242 ${y}Q180 ${y+26} 120 ${y}`, hx=up?240:120;
    return on?`<path d="${d}" fill="none" stroke="#c2573f" stroke-width="2.4"/><path d="M${hx} ${y}l${up?-11:11} ${up?-6:-7}l${up?2:-2} ${up?11:12}z" fill="#c2573f"/><text x="180" y="${up?y-20:y+30}" text-anchor="middle" font-size="11" font-weight="700" fill="#a13f2c" paint-order="stroke" stroke="#faf4ea" stroke-width="4">${lbl}</text>`
      :`<path d="${d}" fill="none" stroke="#9a8b7a" stroke-width="1.3" stroke-dasharray="3 5"/><text x="180" y="${up?y-20:y+30}" text-anchor="middle" font-size="10.5" fill="#9a8b7a" paint-order="stroke" stroke="#faf4ea" stroke-width="4">닿지 않음</text>`; };
  const c=(x,n,on)=>`<circle cx="${x}" cy="86" r="${on?58:0}" fill="url(#lbbGlow)"/><circle cx="${x}" cy="86" r="42" fill="#fffaf1" stroke="${on?'#c2573f':'rgba(42,33,25,.3)'}" stroke-width="1.6"/><text x="${x}" y="92" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="16" font-weight="900" fill="#2a2119">${esc(short(n))}</text>`;
  return `<svg viewBox="0 0 360 172" role="img" aria-label="한 사람의 도화 글자가 상대 원국에 있으면 끌림 화살표를 그린 그림">${c(70,a.n,ba)}${c(290,b.n,ab)}${arr(ab,1,`${short(a.n)} → ${short(b.n)}`)}${arr(ba,0,`${short(b.n)} → ${short(a.n)}`)}</svg>`; }
/* 03 · 두 가지 열두 달 */
function twinSvg(M,top,a,b){ const A=limb([[-6,66],[120,56],[240,72],[366,60]],7,2.4,160), B=limb([[-6,136],[120,146],[240,130],[366,142]],7,2.4,160); let fl='',cn='',lab='',gl='';
  M.forEach((o,i)=>{ const x=24+i*28.36, na=nearX(A.pts,x), nb=nearX(B.pts,x), sa=o.la>=80?4:o.la>=70?3:o.la>=60?2:o.la>=50?1:0, sb=o.lb>=80?4:o.lb>=70?3:o.lb>=60?2:o.lb>=50?1:0, ra=[7,8,11,13,15][sa], rb=[7,8,11,13,15][sb], isT=o===top;
    fl+=sa>=3?bloom(na[0],na[1]-ra*.8,ra,sa,{rot:i%2?8:-8}):bloom(na[0],na[1]-3,ra,sa,{rot:i%2?10:-10});
    fl+=sb>=3?bloom(nb[0],nb[1]+rb*.8,rb,sb,{rot:i%2?-8:8}):bloom(nb[0],nb[1]+3,rb,sb,{rot:180+(i%2?10:-10)});
    const y1=na[1]+5, y2=nb[1]-5;
    if(o.both){ cn+=`<path d="M${f1(x)} ${f1(y1)}V88M${f1(x)} 112V${f1(y2)}" stroke="#c2573f" stroke-width="2.4"/><path d="M${f1(x-4)} ${f1(y1+6)}l8 4M${f1(x-4)} ${f1(y2-10)}l8 4" stroke="#c2573f" stroke-width="1.6"/>`; }
    else if(o.clash) cn+=`<path d="${zig(x,y1,x,88)}" fill="none" stroke="#2a2119" stroke-width="1.3"/><path d="${zig(x,112,x,y2)}" fill="none" stroke="#2a2119" stroke-width="1.3"/>`;
    if(isT) gl+=`<rect x="${f1(x-13)}" y="86" width="26" height="28" fill="#c2573f" opacity=".12"/>`;
    lab+=`<text x="${f1(x)}" y="104" text-anchor="middle" font-size="11.5" font-weight="${isT?900:600}" fill="${isT?'#a13f2c':'#6b5d4f'}">${o.start.m}</text>`;
    if(i===0||o.start.m===1) lab+=`<text x="${f1(x)}" y="${i===0?84:84}" text-anchor="middle" font-size="8.5" fill="#9a8b7a">${i===0?'지금':o.start.y}</text>`; });
  return `<svg viewBox="0 0 360 196" role="img" aria-label="두 사람의 열두 달을 위아래 두 가지로 그리고, 둘 다 열리는 달을 이은 그림">${gl}${A.svg}${B.svg}${cn}${fl}${lab}<text x="8" y="14" font-size="10" font-weight="700" fill="#6b5d4f">위 가지 · ${esc(short(a.n))}</text><text x="8" y="192" font-size="10" font-weight="700" fill="#6b5d4f">아래 가지 · ${esc(short(b.n))}</text></svg>`; }
function showScr(id){ ['sIn','sLd','sRs'].forEach(s=>$(s).classList.toggle('on',s===id)); document.body.classList.toggle('bright',id==='sRs'); }
$('goBtn').onclick=async()=>{
  const a=read($('wA')); const b=FROM||read($('wB'));
  const A=toP(a), B=toP(b); const R=compat(A,B,a,b);
  showScr('sLd');
  $('sLd').classList.remove('go'); requestAnimationFrame(()=>requestAnimationFrame(()=>$('sLd').classList.add('go')));
  for(const t of ['두 사람 만세력 세우는 중','도화 글자 맞대 보는 중','일지 합 · 충 확인하는 중']){ $('lTx').textContent=t; await new Promise(r=>setTimeout(r,650)); }
  const now=new Date(); $('mDate').textContent=`태오 기록 · ${now.getFullYear()}. ${now.getMonth()+1}. ${now.getDate()}`;
  $('graft').innerHTML=graftSvg(R);
  $('nA').textContent=a.n; $('nB').textContent=b.n; $('tA').textContent=TYPES[R.tA][0]; $('tB').textContent=TYPES[R.tB][0];
  $('scT').textContent=R.title; $('v1').textContent=R.pull; $('v2').textContent=R.stay; $('sc').textContent='0';
  $('scP').textContent=`${a.n}의 ${TYPES[R.tA][0]}와 ${b.n}의 ${TYPES[R.tB][0]}. 끌림은 처음 눈길이 가는 힘, 오래 감은 곁에 남는 힘이에요.`;
  /* 01 */
  const rel=relSvg(A,B,a,b,R), hp=Sj.isHap(A.d[1],B.d[1]), ch=Sj.isChung(A.d[1],B.d[1]), ks=rel.lines.map(o=>o.k);
  const cntK=k=>ks.filter(x=>x===k).length;
  const lead1=rel.lines.length?`두 원국이 맞닿는 선은 <b>${rel.lines.length}개</b>예요. ${[cntK('합')?`끌어당기는 합 ${cntK('합')}`:'',cntK('삼합')?`한 팀으로 묶이는 삼합 ${cntK('삼합')}`:'',cntK('충')?`부딪히는 충 ${cntK('충')}`:'',cntK('원진')?`괜히 서운한 원진 ${cntK('원진')}`:''].filter(Boolean).join(', ')}.`:'두 원국 사이에 직접 맞닿는 선은 없어요. 크게 묶이지도 부딪히지도 않는 사이예요.';
  const LG=`<div class="gh-lg"><span><svg viewBox="0 0 28 10"><path d="M1 5H27" stroke="#c2573f" stroke-width="2.4"/></svg>합 · 끌어당김</span><span><svg viewBox="0 0 28 10"><path d="M1 5H27" stroke="#c2573f" stroke-width="1.4"/></svg>삼합 · 한 팀</span><span><svg viewBox="0 0 28 10"><path d="${zig(1,5,27,5)}" fill="none" stroke="#2a2119" stroke-width="1.4"/></svg>충 · 부딪힘</span><span><svg viewBox="0 0 28 10"><path d="M1 5H27" stroke="#6b5d4f" stroke-width="1.6" stroke-dasharray="5 4"/></svg>원진 · 괜한 서운함</span></div>`;
  const s1=gsec('01','두 원국 나란히','맞닿는 선',`<p class="lb-lead">${lead1}</p><div class="gh-board lb-anim">${rel.svg}</div>${LG}
    ${gwhy(`같은 줄의 글자끼리, 그리고 배우자 자리(태어난 날의 지지)는 상대의 네 자리 모두와 맞대 봤어요. 배우자 자리끼리는 <b>${jo(an(A.d[1]),'과','와')} ${an(B.d[1])}</b>, ${hp?'합이라 한번 묶이면 쉽게 안 풀려요.':ch?'충이라 만나면 불꽃이 튀어요.':'크게 묶이지도 부딪히지도 않아요.'}`,'칸 모서리의 작은 꽃은 그 글자가 상대의 도화 글자라는 표시예요.')}`);
  /* 02 */
  const posOf=(P,t)=>ROWS.filter(([k])=>P[k]&&P[k][1]===t).map(([,l])=>l.replace('태어난 ',''));
  const pB=posOf(B,R.tA), pA=posOf(A,R.tB), ab=pB.length>0, ba=pA.length>0;
  const ea=stEl(A.d[0]), eb=stEl(B.d[0]), gen=(x,z)=>(x+1)%5===z, ctl=(x,z)=>(x+2)%5===z;
  const elT=ctl(ea,eb)?`${jo(EN[ea],'이','가')} ${jo(EN[eb],'을','를')} 이기는 관계라 ${a.n} 쪽이 주도하기 쉬워요.`:ctl(eb,ea)?`${jo(EN[eb],'이','가')} ${jo(EN[ea],'을','를')} 이기는 관계라 ${b.n} 쪽이 주도하기 쉬워요.`:gen(ea,eb)?`${jo(EN[ea],'이','가')} ${jo(EN[eb],'을','를')} 살리는 관계라 ${a.n} 쪽이 챙겨 주는 편이에요.`:gen(eb,ea)?`${jo(EN[eb],'이','가')} ${jo(EN[ea],'을','를')} 살리는 관계라 ${b.n} 쪽이 챙겨 주는 편이에요.`:`둘 다 ${EN[ea]}의 사람이라 말은 잘 통하고 고집은 같은 방향이에요.`;
  const lead2=ab&&ba?'서로의 사주에 서로의 도화 글자가 있어요. 양쪽에서 끌리는 사이예요.':ab?`${b.n}의 사주에 ${a.n}의 도화 글자가 있어요. ${ga(a.n)} 끌리는 쪽이에요.`:ba?`${a.n}의 사주에 ${b.n}의 도화 글자가 있어요. ${b.n} 쪽에서 먼저 눈길이 가요.`:'서로의 도화 글자가 상대 사주에 없어요. 끌림은 첫눈보다 시간이 만드는 사이예요.';
  const s2=gsec('02','누가 누구에게 끌리나','도화 글자',`<p class="lb-lead">${lead2}</p><div class="gh-board lb-anim">${pullSvg(a,b,ab,ba)}</div>
    <div class="gh-cards"><div class="lb-card${ab?'':' off'}"><small>${esc(a.n)} → ${esc(b.n)}</small><p style="margin-top:4px">${esc(a.n)}의 도화 글자는 <b>${an(R.tA)}</b>. ${ab?`${esc(b.n)} 사주의 ${pB.join(' · ')} 자리에 있어요.`:`${esc(b.n)} 사주에는 없어요.`}</p></div>
     <div class="lb-card${ba?'':' off'}"><small>${esc(b.n)} → ${esc(a.n)}</small><p style="margin-top:4px">${esc(b.n)}의 도화 글자는 <b>${an(R.tB)}</b>. ${ba?`${esc(a.n)} 사주의 ${pA.join(' · ')} 자리에 있어요.`:`${esc(a.n)} 사주에는 없어요.`}</p></div>
     <div class="lb-card"><small>타고난 나끼리</small><p style="margin-top:4px">${esc(a.n)}는 <b>${EN[ea]}</b>, ${esc(b.n)}는 <b>${EN[eb]}</b>의 사람이에요. ${esc(elT)}</p></div></div>
    ${gwhy('도화 글자는 태어난 날의 지지가 속한 무리마다 하나씩 정해져 있어요. 내 도화 글자가 상대 원국에 있으면, 내가 그 사람에게 이유 없이 끌리기 쉽다고 봐요. 화살표 하나마다 끌림 점수에 16을 더했어요.')}`);
  /* 03 · 열두 달 */
  let s3='', top1=null, Q=null; try{ Q=window.GunghapPrem&&GunghapPrem.calc({a,b,R}); }catch(e){ Q=null; }
  if(Q&&Q.M&&Q.M.length){ const M=Q.M, srt=[...M].sort((x,y)=>y.t-x.t||x.i-y.i); top1=srt[0]; const t2=srt[1], both=M.filter(o=>o.both), cl=M.filter(o=>o.clash), ml=L=>L.length?L.map(o=>o.start.m+'월').join(' · '):'없음', dr=o=>`${o.start.m}.${o.start.d} ~ ${o.end.m}.${o.end.d}`;
    s3=gsec('03','열두 달 접목 달력','절기 기준 월',`<p class="lb-lead">위 가지는 ${esc(a.n)}, 아래 가지는 ${esc(b.n)}의 열두 달이에요. 둘이 함께 가장 크게 피는 달은 <b>${top1.start.m}월</b>${both.length?`, 둘 다 열려서 이어 붙인 달은 <b>${ml(both)}</b>`:''}이에요.</p>
      <div class="gh-board lb-anim">${twinSvg(M,top1,a,b)}</div>
      <div class="gh-lg"><span><svg viewBox="0 0 28 10"><path d="M1 5H27" stroke="#c2573f" stroke-width="2.4"/></svg>둘 다 열리는 달</span><span><svg viewBox="0 0 28 10"><path d="${zig(1,5,27,5)}" fill="none" stroke="#2a2119" stroke-width="1.3"/></svg>한쪽 배우자 자리가 부딪히는 달</span></div>
      <div style="height:14px"></div><div class="lb-tiles"><div><small>함께 가장 크게</small><b>${top1.start.y}년 ${top1.start.m}월</b><em>${dr(top1)} · ${top1.term}부터</em></div><div><small>한 번 더</small><b>${t2.start.y}년 ${t2.start.m}월</b><em>${dr(t2)} · ${t2.term}부터</em></div>
      <div><small>둘 다 열리는 달</small><b>${ml(both)}</b><em>두 사람 점수가 모두 62 이상</em></div><div><small>부딪히기 쉬운 달</small><b>${ml(cl)}</b><em>말보다 만남이 먼저인 달</em></div></div>
      ${gwhy('두 사람 각자 달마다 연애 점수를 매겼어요. 그달 기운이 도화를 띄우면 15, 배우자 자리와 끌어당기면 12, 타고난 나와 마음이 맞으면 10을 더하고, 배우자 자리와 부딪히면 15를 빼는 식이에요. 둘의 점수는 두 사람의 평균에 둘 다 62를 넘으면 5, 둘 다 배우자 자리가 묶이면 4를 더하고, 한쪽이라도 부딪히면 6을 뺐어요.','달마다의 이야기와 먼저 연락하기 좋은 날짜는 궁합 노트에 적어 뒀어요.')}`); }
  /* 04 · 오행 */
  const cA=Sj.elCount(A), cB=Sj.elCount(B), mx=Math.max(...cA,...cB,1);
  const fillA=EN.map((k,i)=>cA[i]===0&&cB[i]>0?i:-1).filter(i=>i>=0), fillB=EN.map((k,i)=>cB[i]===0&&cA[i]>0?i:-1).filter(i=>i>=0);
  const jn=v=>v.map(i=>EN[i]).join(' · ');
  const elTx=fillA.length||fillB.length?[fillA.length?`<b>${esc(a.n)}</b>에게 없는 ${jo(jn(fillA),'을','를')} <b>${esc(jo(b.n,'이','가'))}</b> 갖고 있어요.`:'',fillB.length?`<b>${esc(b.n)}</b>에게 없는 ${jo(jn(fillB),'은','는')} <b>${esc(jo(a.n,'이','가'))}</b> 채워 줘요.`:''].filter(Boolean).join(' ')+' 곁에 있으면 빈칸이 메워지는 조합이에요.'
    :'둘 다 비어 있는 기운이 겹치거나, 서로 채워 줄 칸이 크지 않아요. 부족한 기운은 둘이 함께 채워 가야 하는 사이예요.';
  const s4=gsec(Q?'04':'03','오행 겹쳐 보기','여덟 글자의 기운',`<p class="lb-lead">${elTx}</p><div class="gh-el lb-anim">${EN.map((k,i)=>`<div class="${(cA[i]===0&&cB[i]>0)||(cB[i]===0&&cA[i]>0)?'fill':''}"><span class="k">${k}</span><div class="bb"><i class="a${cA[i]?'':' z'}" data-w="${(cA[i]/mx*100).toFixed(1)}"></i><i class="b${cB[i]?'':' z'}" data-w="${(cB[i]/mx*100).toFixed(1)}"></i></div><span class="n"><b>${cA[i]}</b> · ${cB[i]}</span></div>`).join('')}</div>
    <div class="gh-lg"><span><i style="display:inline-block;width:18px;height:7px;background:var(--acc)"></i>${esc(a.n)}</span><span><i style="display:inline-block;width:18px;height:7px;background:repeating-linear-gradient(135deg,#6b5d4f 0 2px,rgba(107,93,79,.55) 2px 4px)"></i>${esc(b.n)}</span><span>채움 · 한쪽에 없는 기운을 다른 쪽이 가짐</span></div>
    ${gwhy(`천간과 지지 여덟 글자(시를 모르면 여섯 글자)를 나무 · 불 · 흙 · 쇠 · 물로 나눠 센 숫자예요.`)}`);
  /* 05 · 이렇게 봤어 + 한마디 */
  const act=top1?`${top1.start.m}월에 둘만의 약속 하나 잡기`:ch?'싸운 날은 그날 풀기':'서운한 건 바로 말하기';
  const s5=gsec(Q?'05':'04','이렇게 봤어',`근거 ${Math.min(5,R.pts.length)}가지`,`<ol class="gh-pts">${R.pts.slice(0,5).map((p,i)=>`<li class="${p[2]<0?'neg':''}"><span class="lb-o"><span>${i+1}</span></span><div><p>${esc(p[0])}</p><div class="lb-chips"><span class="${p[2]<0?'neg':'pos'}">${esc(p[1])}</span></div></div></li>`).join('')}</ol>
    <div style="height:18px"></div><div class="lb-quote"><div class="lb-av" style="background-image:url('img/taeo/base.jpg')"></div><div><small>태오</small><p id="say"></p></div></div><div class="lb-act"><small>할 일 하나</small><b>${esc(act)}</b></div>`);
  $('ghBody').innerHTML=s1+s2+s3+s4+s5; $('lkNo').textContent=Q?'06':'05';
  $('say').textContent=a.g==='m'&&window.HJ?HJ.bro(R.say):R.say;
  $('lkBl').textContent=`${a.n}, 둘이 먼저 연락해도 되는 날은 ○월 ○일이야. 그날엔 ○○ 이야기로 시작해. ○월엔 서운한 말이 크게 들리니까 만나서 풀어.`;
  $('lkS').innerHTML=[['달마다 둘 사이의 이야기','열두 달'],['먼저 연락하기 좋은 날','날짜까지'],['부딪히는 지점과 푸는 법','순서까지'],['서로에게 어떤 사람인가','두 방향'],['오래 가는 법 세 가지 · 태오의 편지','']].map(l=>`<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"><rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>${l[0]}<em>${l[1]}</em></li>`).join('');
  $('ghFine').textContent='체험판이에요. 두 사람의 원국과 월운은 실제 만세력(절기 시각)으로 계산하고, 점수는 도화 글자 · 배우자 자리의 합과 충 · 일간 관계 · 오행 보완으로 산출해요. 이름은 계산에 쓰지 않아요. 관계는 결국 두 사람의 선택이 가장 큰 변수예요.';
  if(a.g==='m'&&window.HJ){ const w=document.createTreeWalker($('sRs'),NodeFilter.SHOW_TEXT); let n; while((n=w.nextNode())){ if(/누나|예쁘|예뻐/.test(n.nodeValue)) n.nodeValue=HJ.bro(n.nodeValue); } }
  showScr('sRs'); $('sRs').scrollTop=0; ghAnim();
  setTimeout(()=>{ $('b1').style.width=R.pull+'%'; $('b2').style.width=R.stay+'%'; $('sRs').querySelectorAll('.gh-el .bb i').forEach(x=>x.style.width=x.dataset.w+'%'); const t0=performance.now(); (function f(t){ const p=Math.min(1,(t-t0)/1500); $('sc').textContent=Math.round(R.total*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(f); })(t0); },200);
  window._me=a; window.GHF={a,b,R}; $('lockG').hidden=false; $('payBtn').hidden=false; $('gprem').hidden=true;
};
function ghAnim(){ const root=$('sRs'), L=[...root.querySelectorAll('.lb-anim')]; L.forEach(e=>e.classList.remove('in')); if(!('IntersectionObserver' in window)){ L.forEach(e=>e.classList.add('in')); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{root,threshold:.15}); L.forEach(e=>io.observe(e)); }
$('invBtn').onclick=async()=>{ const me=window._me||read($('wA')); const url=new URL('gunghap.html?f='+enc({v:2,n:me.n,g:me.g,p:packP(toP(me))}),location.href).href;
  try{ if(navigator.share){ await navigator.share({title:'도화 궁합',text:`${me.n}님이 너랑 도화 궁합을 보고 싶대`,url}); return; } }catch(e){ if(e&&e.name==='AbortError') return; }
  try{ await navigator.clipboard.writeText(url); toast('신청 링크를 복사했어요. 생일은 안 담겨요'); }catch(e){ prompt('이 링크를 보내세요',url); } };
$('myBtn').onclick=()=>{ location.href='dohwa.html'; };
$('payBtn').onclick=()=>{ if(window.GunghapPrem&&GunghapPrem.open()){ $('lockG').hidden=true; $('payBtn').hidden=true; const h=$('gprem'); if(!h.querySelector('.gh-open')) h.insertAdjacentHTML('afterbegin','<div class="gh-open"><div class="lb-stamp is-fill" style="--sz:74px"><small>봉인</small><b>열림</b></div><div><small>태오의 궁합 노트</small><b>둘이 가까워지는 날까지 적어 뒀어</b></div></div>'); setTimeout(()=>$('gprem').scrollIntoView({behavior:'smooth',block:'start'}),60); } else toast('체험판이라 결제는 여기까지예요'); };
$('back').onclick=()=>{ if($('sRs').classList.contains('on')&&!FROM){ showScr('sIn'); return; } if(history.length>1) history.back(); else location.href='./'; };
