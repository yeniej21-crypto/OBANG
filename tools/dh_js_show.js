/* ---------- 도화 개화 일지: 그림 조각 (화면에는 한자 대신 한글 읽기) ---------- */
const POSN={y:['태어난 해','집안 자리'],m:['태어난 달','사회 자리'],d:['태어난 날','배우자 자리'],h:['태어난 시','자녀 자리']};
const ELW=['나무','불','흙','쇠','물'], TTI_L=['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
const LOCKI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"><rect x="5" y="11" width="14" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
const gzK=p=>GAN_K[p[0]]+JI_K[p[1]], f1=n=>(+n).toFixed(1), bt=w=>{ const c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28>0; };
const STG=['봉오리','움트는 중','반쯤 핌','활짝 핌','만개'], STG_S=['봉오리','움틈','반개','활짝','만개'];
const stageOf=v=>v<55?0:v<65?1:v<75?2:v<85?3:4, mStage=v=>v>=80?4:v>=70?3:v>=60?2:v>=50?1:0;
const dsec=(no,t,hint,body)=>`<section class="lb-sec"><div class="lb-h"><span class="lb-no">${no}</span><h3>${t}</h3>${hint?`<small>${hint}</small>`:''}</div>${body}</section>`;
const dwhy=(...ps)=>`<div class="lb-why"><small>근거</small>${ps.filter(Boolean).map(p=>`<p>${p}</p>`).join('')}</div>`;
function petal(L,W){ return `M0 0C${f1(-W*.95)} ${f1(-L*.2)} ${f1(-W*1.08)} ${f1(-L*.8)} ${f1(-W*.4)} ${f1(-L)}Q0 ${f1(-L*.86)} ${f1(W*.4)} ${f1(-L)}C${f1(W*1.08)} ${f1(-L*.8)} ${f1(W*.95)} ${f1(-L*.2)} 0 0Z`; }
/* 꽃 한 송이: st 0 봉오리 · 1 움트는 봉오리 · 2 반쯤 핌 · 3 핌 · 4 만개 · hong 홍염 빛 */
function bloom(x,y,r,st,o){ o=o||{}; const rot=o.rot||0, op=o.op==null?1:o.op; let g='';
  if(st<=1){ const h=r*(st?1.5:1.3), w=r*(st?.62:.5);
    g=`<path d="M0 0C${f1(-w*1.2)} ${f1(-h*.3)} ${f1(-w)} ${f1(-h*.85)} 0 ${f1(-h)}C${f1(w)} ${f1(-h*.85)} ${f1(w*1.2)} ${f1(-h*.3)} 0 0Z" fill="url(#dhBud)" stroke="#c2573f" stroke-opacity=".45" stroke-width=".8"/>`;
    if(st) g+=`<path d="M0 ${f1(-h*.15)}Q${f1(-w*.2)} ${f1(-h*.6)} ${f1(-w*.55)} ${f1(-h*.92)}M0 ${f1(-h*.15)}Q${f1(w*.2)} ${f1(-h*.6)} ${f1(w*.55)} ${f1(-h*.92)}" fill="none" stroke="#fdece5" stroke-width=".9"/>`;
    g+=`<path d="M0 1.5C${f1(-w*.9)} ${f1(-h*.05)} ${f1(-w*.9)} ${f1(-h*.3)} ${f1(-w*.25)} ${f1(-h*.34)}L0 ${f1(-h*.12)}L${f1(w*.25)} ${f1(-h*.34)}C${f1(w*.9)} ${f1(-h*.3)} ${f1(w*.9)} ${f1(-h*.05)} 0 1.5Z" fill="#7d5a43"/>`;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot})" opacity="${op}">${g}</g>`; }
  const half=st===2, L=r*(half?.86:st===3?.95:1.04), W=L*(half?.5:.62), fill=o.hong?'url(#dhHong)':'url(#dhPet)', sk=o.hong?'#8f2219':'#c2573f';
  for(let k=0;k<5;k++){ const a=half?-56+k*28:k*72; g+=`<path d="${petal(L,W)}" transform="rotate(${a})" fill="${fill}" stroke="${sk}" stroke-opacity=".5" stroke-width=".7"/>`; }
  if(!half){ const cr=r*.2; g+=`<circle r="${f1(cr*1.7)}" fill="${o.hong?'#7e1d15':'#c9604a'}" opacity=".3"/>`;
    if(st===4) for(let k=0;k<12;k++){ const a=(k*30+8)*Math.PI/180, l=r*(.42+(k%2)*.12), ex=f1(Math.cos(a)*l), ey=f1(Math.sin(a)*l); g+=`<line x1="0" y1="0" x2="${ex}" y2="${ey}" stroke="${o.hong?'#7e1d15':'#a5442f'}" stroke-width=".8"/><circle cx="${ex}" cy="${ey}" r="1.3" fill="#c8955a"/>`; }
    g+=`<circle r="${f1(cr)}" fill="${o.hong?'#7e1d15':'#b14a35'}"/>`; }
  else g+=`<path d="M0 0C-3 -4 3 -4 0 0" fill="none"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot})" opacity="${op}">${g}</g>`; }
function cub(a,b,c,d,t){ const u=1-t; return [u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]]; }
/* 가늘어지는 가지 하나(먹 번짐 대신 두 겹 명암) */
function limb(P,w0,w1,N){ N=N||48; const pts=[]; for(let i=0;i<=N;i++) pts.push(cub(P[0],P[1],P[2],P[3],i/N)); const A=[],B=[];
  pts.forEach((p,i)=>{ const q=pts[Math.min(N,i+1)], o=pts[Math.max(0,i-1)], dx=q[0]-o[0], dy=q[1]-o[1], l=Math.hypot(dx,dy)||1, nx=-dy/l, ny=dx/l, w=(w0+(w1-w0)*(i/N))/2; A.push([p[0]+nx*w,p[1]+ny*w]); B.push([p[0]-nx*w,p[1]-ny*w]); });
  const d='M'+A.map(p=>f1(p[0])+' '+f1(p[1])).join('L')+'L'+B.reverse().map(p=>f1(p[0])+' '+f1(p[1])).join('L')+'Z';
  return {pts,d,svg:`<path d="${d}" fill="#5b4535"/><path d="${'M'+A.map(p=>f1(p[0])+' '+f1(p[1]-.6)).join('L')}" fill="none" stroke="#a88b70" stroke-opacity=".55" stroke-width=".9"/>`}; }
const nearX=(pts,x)=>pts.reduce((b,p)=>Math.abs(p[0]-x)<Math.abs(b[0]-x)?p:b,pts[0]);
/* 01 · 원국 가지: 해 → 달 → 날 → 시, 도화 자리에 꽃 */
function branchSvg(spots,hongAt){ const main=limb([[-6,170],[96,190],[214,96],[368,104]],12,2.6,120); let tw='',fl='',gl='';
  ['y','m','d','h'].forEach((k,i)=>{ const x=45+i*90, n=nearX(main.pts,x), up=i%2?-1:1, bx=n[0]+up*10, by=n[1]-62-(i%2?6:0), p=R[k];
    const t=limb([n,[n[0]+up*2,n[1]-22],[bx-up*6,by+24],[bx,by]],4.2,1.4,24); tw+=t.svg;
    if(!p){ fl+=`<circle cx="${f1(bx)}" cy="${f1(by)}" r="15" fill="#fffaf1" stroke="#9a8b7a" stroke-dasharray="3 3"/><text x="${f1(bx)}" y="${f1(by+4)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#9a8b7a">모름</text>`; return; }
    const dh=spots.includes(k), hg=hongAt.includes(k);
    if(dh||hg){ gl+=`<circle cx="${f1(bx)}" cy="${f1(by)}" r="46" fill="url(#dhGlow)"/>`; fl+=bloom(bx,by,dh?25:22,4,{hong:!dh&&hg,rot:up*8}); if(dh&&hg) fl+=bloom(bx+up*24,by+16,12,3,{hong:true,rot:-up*20}); }
    else fl+=bloom(bx,by,9,0,{rot:up*14}); });
  const stubs=[[.08,-1],[.3,1],[.55,-1],[.78,1]].map(([t,s])=>{ const a=cub([-6,170],[96,190],[214,96],[368,104],t); return limb([a,[a[0]+8,a[1]+s*8],[a[0]+16,a[1]+s*12],[a[0]+22,a[1]+s*14]],2.2,.8,12).svg; }).join('');
  return `<svg viewBox="0 0 360 200" role="img" aria-label="원국 네 자리를 한 가지로 그린 그림. 도화가 있는 자리에 꽃이 피어 있어요">${gl}${main.svg}${stubs}${tw}${fl}<text x="12" y="22" font-size="10" fill="#9a8b7a">가지 하나가 원국 · 왼쪽이 태어난 해</text></svg>`; }
/* 03 · 열두 달 개화 가지 */
function monthsSvg(CAL){ const M=CAL.months, top=CAL.top[0], main=limb([[-6,124],[110,142],[240,98],[368,118]],7.5,2.4,140); let tw='',fl='',gl='',lab='';
  M.forEach((o,i)=>{ const x=24+i*28.36, n=nearX(main.pts,x), st=mStage(o.love), r=[7,8,11.5,13.5,15.5][st], by=n[1]-24-r*.9, isT=o===top;
    tw+=limb([n,[n[0],n[1]-8],[n[0],by+10],[n[0],by]],2.6,1,10).svg;
    if(isT){ gl+=`<circle cx="${f1(n[0])}" cy="${f1(by)}" r="34" fill="url(#dhGlow)"/>`; lab+=`<text x="${f1(n[0])}" y="${f1(by-r-8)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#a13f2c">가장 크게</text>`; }
    fl+=bloom(n[0],by,r,st,{rot:(i%2?8:-8)});
    const hp=o.br.some(q=>q.at==='일지'&&(q.k==='육합'||q.k==='삼합')), ch=o.br.some(q=>q.at==='일지'&&q.k==='충'), pk=o.ss.includes('도화');
    lab+=`<text x="${f1(n[0])}" y="168" text-anchor="middle" font-size="11" font-weight="${isT?900:500}" fill="${isT?'#a13f2c':'#6b5d4f'}">${o.start.m}</text>`;
    if(i===0||o.start.m===1) lab+=`<text x="${f1(n[0])}" y="${i===0?150:150}" text-anchor="middle" font-size="8.5" fill="#9a8b7a">${i===0?'지금':o.start.y}</text>`;
    const mk=pk?`<circle cx="${f1(n[0])}" cy="182" r="3.6" fill="#c2573f"/>`:hp?`<circle cx="${f1(n[0])}" cy="182" r="3.4" fill="#fffaf1" stroke="#c2573f" stroke-width="1.4"/>`:ch?`<rect x="${f1(n[0]-3)}" y="179" width="6" height="6" transform="rotate(45 ${f1(n[0])} 182)" fill="#2a2119"/>`:'';
    lab+=mk; });
  return `<svg viewBox="0 0 360 192" role="img" aria-label="앞으로 열두 달, 달마다 피는 정도를 꽃으로 그린 그림">${gl}${main.svg}${tw}${fl}${lab}</svg>`; }
/* 04 · 끌림의 방향 */
function pullSvg(me,gw,sk){ const c=(x,r,fill,stroke,t1,t2,tc)=>`<circle cx="${x}" cy="66" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/><text x="${x}" y="${t2?64:71}" text-anchor="middle" font-family="Noto Serif KR,serif" font-size="${t2?19:17}" font-weight="900" fill="${tc}">${t1}</text>${t2?`<text x="${x}" y="83" text-anchor="middle" font-size="10.5" font-weight="700" fill="${tc}" opacity=".85">${t2}</text>`:''}`;
  const arr=(x1,x2,y,lbl)=>`<line x1="${x1}" y1="${y}" x2="${x2+7}" y2="${y}" stroke="#c2573f" stroke-width="2"/><path d="M${x2} ${y}l9 -5v10z" fill="#c2573f"/><text x="${(x1+x2)/2}" y="${y-8}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#a13f2c">${lbl}</text>`;
  return `<svg viewBox="0 0 360 140" role="img" aria-label="누나가 끌리는 기운과 누나에게 끌려오는 기운"><circle cx="180" cy="66" r="62" fill="url(#dhGlow)"/>
   ${c(62,38,'#fffaf1','#c2573f',ELW[gw],'','#2a2119')}${c(180,42,'#c2573f','#c2573f','나',ELW[me],'#fffaf2')}${c(298,38,'#fffaf1','rgba(42,33,25,.35)',ELW[sk],'','#2a2119')}
   ${arr(134,104,58,'끌림')}${arr(256,226,58,'다가옴')}
   <text x="62" y="124" text-anchor="middle" font-size="11" font-weight="700" fill="#6b5d4f">누나가 끌리는 결</text><text x="298" y="124" text-anchor="middle" font-size="11" font-weight="700" fill="#6b5d4f">누나에게 끌려오는 결</text></svg>`; }
const HONGYEOM={0:6,1:6,2:2,3:7,4:4,5:4,6:10,7:9,8:0,9:8};
async function showResult(){
  const br=[R.y[1],R.m[1],R.d[1]].concat(R.h?[R.h[1]]:[]);
  const tg=target(R.d[1]), tg2=target(R.y[1]), spots=peachSpots(R), peachN=spots.length;
  const hong=br.includes(HONGYEOM[R.d[0]]), dm=R.d[0], loveG=S.bro?2:3;
  const rel=(el)=>(el-Math.floor(dm/2)+5)%5, BREL=[4,2,0,0,2,1,1,2,3,3,2,4];
  const stars=[R.y[0],R.m[0]].concat(R.h?[R.h[0]]:[]).filter(x=>rel(Math.floor(x/2))===loveG).length+br.filter(b=>rel(BREL[b])===loveG).length;
  let pkMonth=null; try{ if(window.Prem2Core&&window.SajuX){ const u=askUser(); const F=Prem2Core.rolling(Saju,SajuX,{y:u.solar.y,m:u.solar.m,d:u.solar.d,h:S.hour>=0?S.hour:null,g:S.bro?'m':'f'},12); const o=F.months.find(x=>x.ss.includes('도화')); if(o) pkMonth=o.start.m; } }catch(e){}
  /* 도화 지수: 이름과 무관. 원국의 실제 도화 · 홍염 · 인연의 별로만 */
  const pP=14*Math.min(peachN,2), pH=hong?8:0, pS=stars===0?-4:stars<=2?6:3, pD=spots.some(k=>k==='d'||k==='h')?4:0, raw=50+pP+pH+pS+pD;
  const score=Math.max(42,Math.min(96,raw));
  const T=TYPES[tg];
  RES={T,score,peachN};
  const now=new Date(), hongAt=['y','m','d','h'].filter(k=>R[k]&&R[k][1]===HONGYEOM[dm]), stg=stageOf(score);
  $('mDate').textContent=`태오 기록 · ${now.getFullYear()}. ${now.getMonth()+1}. ${now.getDate()}`;
  $('rName').textContent=`${S.nick} 누나의 도화 유형`;
  $('rType').textContent=T.n; $('rDesc').textContent=T.d;
  $('rTags').innerHTML=T.t.map(t=>`<span class="pos">${t.replace(/^#/,'').replace(/_/g,' ')}</span>`).join('');
  $('mSt').innerHTML=`<div class="lb-stamp is-fill" style="--sz:92px"><small>개화</small><b>${STG_S[stg]}</b><em>도화 지수 ${score}</em></div>`;
  /* 01 원국 가지 */
  const pil=['y','m','d','h'].map(k=>{ const p=R[k], dh=spots.includes(k), hg=hongAt.includes(k);
    return p?`<div class="${k==='d'?'is-d':''}"><small>${POSN[k][0]}</small><b>${gzK(p)}</b><em>${TTI_L[p[1]]} · ${POSN[k][1]}</em><span class="${dh?'on':hg?'hg':''}">${dh&&hg?'도화 · 홍염':dh?'도화':hg?'홍염':'봉오리'}</span></div>`:`<div class="none"><small>${POSN[k][0]}</small><b>모름</b><em>시간을 넣으면 보여요</em><span>빈자리</span></div>`; }).join('');
  const where=spots.map(k=>POSN[k][0].replace('태어난 ','')).join(' · ');
  const lead1=peachN?`네 자리 가운데 <b>${where}</b> 자리에 도화가 피었어요.${hong?` 홍염도 <b>${hongAt.map(k=>POSN[k][0].replace('태어난 ','')).join(' · ')}</b> 자리에 붉게 맺혀 있어요.`:''}`
    :`원국에는 아직 핀 도화가 없어요.${hong?` 대신 <b>${hongAt.map(k=>POSN[k][0].replace('태어난 ','')).join(' · ')}</b> 자리에 홍염이 붉게 맺혀 있어요.`:''} ${pkMonth?`운에서 도화가 드는 <b>${pkMonth}월</b>에 피는 타입이에요.`:'운에서 도화가 드는 달에 피는 타입이에요.'}`;
  const s1=dsec('01','원국 가지','네 자리',`<p class="lb-lead">${lead1}</p><div class="dh-board lb-anim">${branchSvg(spots,hongAt)}<div class="dh-pil">${pil}</div></div>
   ${dwhy(`도화 글자는 태어난 날의 지지와 태어난 해의 지지가 속한 무리마다 하나씩 정해져 있어요. 누나는 날 기준 <b>${JI_K[tg]}</b>(${TTI_L[tg]})${tg2!==tg?`, 해 기준 <b>${JI_K[tg2]}</b>(${TTI_L[tg2]})`:', 해 기준도 같은 글자'}. 네 자리 지지 가운데 이 글자와 같은 곳에 꽃을 그렸어요. 기준이 된 자리 자신은 세지 않아요.`,
     `홍염은 타고난 나(태어난 날의 천간 ${GAN_K[dm]})마다 정해진 글자 <b>${JI_K[HONGYEOM[dm]]}</b>예요. ${hong?'원국에 이 글자가 있어서 붉은 꽃으로 표시했어요.':'원국에는 이 글자가 없어요.'}`)}`);
  /* 02 개화 정도 */
  const rows=[['원국 도화',`${peachN}곳 · 한 곳마다 14, 두 곳까지`,pP],['홍염',hong?'원국에 있음':'원국에 없음',pH],['인연의 별',`${stars}개 · ${S.bro?'내가 다루는 기운':'나를 다스리는 기운'}`,pS],['날 · 시 자리의 도화',pD?'가까운 자리에 핌':'해당 없음',pD]];
  const mx=Math.max(...rows.map(r=>Math.abs(r[2])),1);
  const gl5=[45,58,70,82,93].map((v,i)=>{ const x=10+(v/100)*340; return bloom(x,44,[7,8,11,13,15][i],i,{op:i<=stg?1:.28})+`<text x="${f1(x)}" y="70" text-anchor="middle" font-size="10" font-weight="${i===stg?900:500}" fill="${i===stg?'#a13f2c':'#9a8b7a'}">${STG_S[i]}</text>`; }).join('');
  const s2=dsec('02','개화 정도','도화 지수',`<div class="dh-meter lb-anim"><div class="hd"><div><small>도화 지수</small><span class="num"><b id="rIdx" style="font-weight:900">0</b><i>%</i></span></div><div class="r"><small>지금 단계</small><strong>${STG[stg]}</strong></div></div>
    <svg viewBox="0 0 360 76" aria-hidden="true">${gl5}</svg><div class="dh-track"><i id="rGauge"></i></div><div class="sc"><span>0</span><span>50</span><span>100</span></div><p class="top" id="rTop"></p></div>
    <div style="height:18px"></div><div class="lb-bars">${rows.map(r=>{ const w=Math.abs(r[2])/mx*50, n=r[2]<0; return `<div class="lb-sb"><div class="l"><b>${r[0]} ${r[2]>0?'+':r[2]<0?'−':''}${Math.abs(r[2])||''}</b><small>${r[1]}</small></div><div class="g">${r[2]?`<i class="${n?'neg':''}" style="${n?'right:50%':'left:50%'};width:${f1(w)}%"></i>`:''}</div></div>`; }).join('')}</div>
    <div class="lb-sb-ax"><span></span><span><em style="font-style:normal">낮춤</em><em style="font-style:normal">높임</em></span></div>
    ${dwhy(`지수는 이름과 상관없이 원국만으로 계산했어요. 50에서 시작해 막대만큼 더하고 뺐어요${raw!==score?`(합 ${raw}을 42에서 96 사이로 맞춤)`:''}. 인연의 별은 ${S.bro?'남성에게 내가 다루는 기운(재성)':'여성에게 나를 다스리는 기운(관성)'}이에요. 한두 개면 6, 세 개 넘게 몰리면 3, 없으면 4를 뺐어요.`)}`);
  $('dhBody').innerHTML=s1+s2;
  /* 03 열두 달 개화 */
  let CAL=null, peakM=pkMonth; try{ CAL=window.DohwaPrem&&DohwaPrem.calc(); }catch(e){ CAL=null; }
  let s3='';
  if(CAL&&CAL.months&&CAL.months.length){ const M=CAL.months, t1=CAL.top[0], t2=CAL.top[1]; peakM=t1.start.m;
    const hps=M.filter(o=>o.br.some(q=>q.at==='일지'&&(q.k==='육합'||q.k==='삼합'))), chs=M.filter(o=>o.br.some(q=>q.at==='일지'&&q.k==='충')), pks=M.filter(o=>o.ss.includes('도화'));
    const dr=o=>`${o.start.m}.${o.start.d} ~ ${o.end.m}.${o.end.d}`, ml=L=>L.length?L.map(o=>o.start.m+'월').join(' · '):'없음';
    s3=dsec('03','열두 달 개화 달력','절기 기준 월',`<p class="lb-lead">앞으로 열두 달 가운데 가장 크게 피는 달은 <b>${t1.start.m}월</b>, 그다음은 <b>${t2.start.m}월</b>이에요. 꽃이 클수록 인연의 기운이 센 달이에요.</p>
      <div class="dh-board lb-anim">${monthsSvg(CAL)}</div>
      <div class="lb-legend"><span><i class="f"></i>도화가 드는 달</span><span><i></i>배우자 자리가 묶이는 달</span><span><i class="q" style="border-radius:0;transform:rotate(45deg) scale(.8);background:#2a2119;border:0"></i>흔들리는 달</span></div>
      <div style="height:14px"></div><div class="lb-tiles"><div><small>가장 크게 피는 달</small><b>${t1.start.y}년 ${t1.start.m}월</b><em>${dr(t1)} · ${t1.term}부터 · 점수 ${t1.love}</em></div><div><small>한 번 더 피는 달</small><b>${t2.start.y}년 ${t2.start.m}월</b><em>${dr(t2)} · ${t2.term}부터 · 점수 ${t2.love}</em></div>
      <div><small>도화가 드는 달</small><b>${ml(pks)}</b><em>그달 기운이 누나 사주에 도화를 띄워요</em></div><div><small>흔들리는 달</small><b>${ml(chs)}</b><em>${hps.length?`묶이는 달은 ${ml(hps)}`:'배우자 자리가 부딪히는 달'}</em></div></div>
      ${dwhy('달마다 점수를 매겼어요. 그달 기운이 누나 사주에 도화를 띄우면 15, 홍염이면 6, 배우자 자리(태어난 날의 지지)와 끌어당기면 12, 타고난 나와 마음이 맞으면 10, 인연의 별이 뜨면 4에서 8을 더했어요. 배우자 자리와 정면으로 부딪히면 15, 괜한 서운함이 걸리면 6, 기운이 비는 달이면 4를 뺐어요.','절기로 나눈 달이라 달력의 1일과 조금 어긋나요. 달마다의 이야기와 고백하기 좋은 날은 편지에 적어 뒀어요.')}`); }
  /* 04 끌림의 방향 */
  const me=Math.floor(dm/2), gw=S.bro?(me+2)%5:(me+3)%5, sk=(me+1)%5;
  const blur=t=>t.replace(/[가-힣]/g,'○');
  const s4=dsec(CAL?'04':'03','끌림의 방향','두 갈래',`<p class="lb-lead">누나가 끌리는 사람과 누나에게 다가오는 사람은 결이 달라요. 왼쪽은 <b>${ELW[gw]}</b>의 결, 오른쪽은 <b>${ELW[sk]}</b>의 결이에요.</p>
    <div class="dh-board lb-anim">${pullSvg(me,gw,sk)}</div>
    <div class="dh-two"><div class="lb-card"><small>누나가 끌리는 사람</small><b>${ELW[gw]}의 결</b><em>${S.bro?'내가 다루는 기운 · 인연의 별':'나를 다스리는 기운 · 인연의 별'}</em><p class="lk">${LOCKI}<span>${blur(EL_P[gw])}</span></p></div>
     <div class="lb-card"><small>누나에게 끌려오는 사람</small><b>${ELW[sk]}의 결</b><em>내가 낳는 기운 · 표현과 베풂</em><p class="lk">${LOCKI}<span>${blur(EL_P[sk])}</span></p></div></div>
    ${dwhy(`타고난 나(태어난 날의 천간 ${GAN_K[dm]})는 <b>${ELW[me]}</b>예요. ${S.bro?`${ELW[me]}${bt(ELW[me])?'이':'가'} 이기는 ${ELW[gw]}${bt(ELW[gw])?'이':'가'} 남성에게 인연의 별(재성)이라`:`${ELW[me]}${bt(ELW[me])?'을':'를'} 이기는 ${ELW[gw]}${bt(ELW[gw])?'이':'가'} 여성에게 인연의 별(관성)이라`} 그 결의 사람에게 마음이 가기 쉽고, ${ELW[me]}${bt(ELW[me])?'이':'가'} 낳는 ${ELW[sk]}${bt(ELW[sk])?'은':'는'} 내가 표현하고 베푸는 기운이라 그 결의 사람이 먼저 다가오기 쉬워요.`,'두 사람의 성격과 오래 남는 쪽이 누구인지는 편지에서 열려요.')}`);
  /* 05 태오의 한마디 + 할 일 하나 */
  const act=peakM?`${peakM}월엔 들어오는 약속을 거절하지 않기`:'사람 많은 자리에 한 번 더 나가 보기';
  const s5=dsec(CAL?'05':'04','태오의 한마디','',`<div class="lb-quote"><div class="lb-av" style="background-image:url('${IMG.base}')"></div><div><small>태오</small><p id="rSay"></p></div></div><div class="lb-act"><small>할 일 하나</small><b>${act}</b></div>`);
  $('dhBody').innerHTML=s1+s2+s3+s4+s5; $('lkNo').textContent=CAL?'06':'05';
  $('rTop').textContent=peachN?`원국에 도화 ${peachN}곳${hong?' · 홍염 있음':''} · 도화 글자 ${JI_K[tg]}${tg2!==tg?' · '+JI_K[tg2]:''}`:`원국엔 도화 글자가 없어요${hong?', 대신 홍염이 있어요':''}. ${pkMonth?`운에서 도화가 드는 ${pkMonth}월에 피는 타입이에요`:'운에서 도화가 드는 달에 피는 타입이에요'}`;
  $('rSay').textContent=T.s.replace(/…/g,', ').replace(/\.\.\./g,', ');
  $('lkBl').textContent=`${S.nick} 누나, 누나 도화가 제일 크게 피는 날은 ○월 ○일이야. 그날 만나는 사람은 ○○ 쪽에서 와. 일지가 ○인 사람은 조심해.`;
  const L=[['달마다의 이야기와 고백하기 좋은 날','날짜까지'],['끌리는 사람, 오래 남는 사람','두 갈래'],['도화 살리는 색 · 향 · 시간 · 장소','네 가지'],['조심해야 할 인연','일지 기준'],['태오의 음성 편지','두 편']];
  $('rLock').innerHTML=L.map(l=>`<li>${LOCKI}${l[0]}<em>${l[1]}</em></li>`).join('');
  $('rFine').textContent='체험판이에요. 원국과 월운은 실제 만세력(절기 시각)으로 계산하고, 도화 지수는 원국의 도화 · 홍염 · 인연의 별 자리로만 산출해요. 이름은 계산에 쓰지 않아요. 인연은 결국 두 사람의 선택이 가장 큰 변수예요.';
  broDom($('result')); stage.classList.remove('load','push'); stage.classList.add('res'); $('result').scrollTop=0; dhAnim();
  bgm(.2,1.5);
  await wait(700);
  $('rGauge').style.width=score+'%';
  const t0=performance.now(); (function cnt(t){ const p=Math.min(1,(t-t0)/1600); $('rIdx').textContent=Math.round(score*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(cnt); })(t0);
  await wait(1200);
  await playHero();
  $('pay').classList.add('on');
}
/* 도장 · 그림이 화면에 들어올 때 한 번 */
function dhAnim(){ const root=$('result'), L=[...root.querySelectorAll('.lb-anim')]; if(!('IntersectionObserver' in window)){ L.forEach(e=>e.classList.add('in')); return; }
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{root,threshold:.15}); L.forEach(e=>io.observe(e)); }
