/* 오방사주 타로 — 78장 덱 공통 도우미 (2026-10-03)
   tarot_data.js(메이저 22) → tarot_minor.js(마이너 56) → 이 파일 순서로 불러온다.
   - 카드 이름표: 메이저는 로마 숫자, 마이너는 한글 이름(잔 3, 칼 시동 등)
   - 수트 정보(이름·오행·주제), 궁정 카드 판별
   - 연애 배치 추가: contact(연락 올까, 1장) · month(이번 달 연애, 4장)
   - 효과음(합성) · 진동: TarotDeck.sfx
   - 리본 덱 엔진: TarotDeck.ribbon(area, 옵션) — 무료 풀이(tarot.html)와 열 장 프리미엄(tarot_prem.js)이 같이 쓴다 */
(function(){
const ROMAN=['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
const SUIT={
  wa:{ko:'지팡이',el:'木',theme:'열정과 움직임',short:'지팡이'},
  cu:{ko:'잔',el:'水',theme:'감정과 관계',short:'잔'},
  sw:{ko:'칼',el:'金',theme:'생각과 결단',short:'칼'},
  pe:{ko:'엽전',el:'土',theme:'돈과 현실',short:'엽전'}};
const RANK_KO=['','에이스','2','3','4','5','6','7','8','9','10','시동','기사','여왕','왕'];
const isMajor=c=>!c.suit;
const isCourt=c=>!!c.suit&&c.rank>=11;
/* 카드 앞면 위쪽 이름표 */
const label=c=>isMajor(c)?ROMAN[c.n]:c.ko;
/* 그림이 늦게 오거나 못 올 때 보이는 바탕(한자 이름 + 카드 이름) */
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const fbAttr=c=>`data-s="${esc(c.han||'')}" data-l="${esc(c.ko)}"`;
const pre={}; function preload(c){ if(!c||pre[c.n]) return; pre[c.n]=1; try{ const im=new Image(); im.decoding='async'; im.src=c.img; }catch(e){} }

if(window.TAROT_SPREAD){
  if(!TAROT_SPREAD.contact) TAROT_SPREAD.contact={t:'연락 올까', k:'love', pos:['연락의 답']};
  if(!TAROT_SPREAD.month) TAROT_SPREAD.month={t:'이번 달 연애', k:'love', pos:['첫째 주','둘째 주','셋째 주','넷째 주']};
}
/* 주제마다 카드 수가 정해진 배치 */
const FIXED_N={today:1,contact:1,month:4};

/* 무작위(crypto) */
const rnd=n=>{ const a=new Uint32Array(1); crypto.getRandomValues(a); return a[0]%n; };

/* ---------- 소리 (합성) · 진동 ---------- */
let AC=null, FX=null;
function ctx(){ if(!AC){ AC=new (window.AudioContext||window.webkitAudioContext)(); FX=AC.createGain(); FX.gain.value=1; FX.connect(AC.destination); } AC.resume(); return AC; }
function tick(vol=.12){ try{ const A=ctx(), t=A.currentTime, n=A.sampleRate*.05, b=A.createBuffer(1,n,A.sampleRate), d=b.getChannelData(0); for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);
  const s=A.createBufferSource(), f=A.createBiquadFilter(), g=A.createGain(); s.buffer=b; f.type='bandpass'; f.frequency.value=2200+Math.random()*1800; f.Q.value=.9; g.gain.value=vol; s.connect(f).connect(g).connect(FX); s.start(t); }catch(e){} }
function riffle(){ for(let i=0;i<10;i++) setTimeout(()=>tick(.08+Math.random()*.06),i*22); }
function chime(f=660,vol=.18){ try{ const A=ctx(), t=A.currentTime; [[1,vol,2.2],[2.01,vol*.4,1.4],[3.02,vol*.22,1]].forEach(([r,a,d])=>{ const o=A.createOscillator(), g=A.createGain(); o.frequency.value=f*r; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(a,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+d); o.connect(g).connect(FX); o.start(t); o.stop(t+d+.1); }); }catch(e){} }
function whoosh(vol=.12){ try{ const A=ctx(), t=A.currentTime, n=A.sampleRate*.6, b=A.createBuffer(1,n,A.sampleRate), d=b.getChannelData(0); for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
  const s=A.createBufferSource(), f=A.createBiquadFilter(), g=A.createGain(); s.buffer=b; f.type='bandpass'; f.Q.value=1.2; f.frequency.setValueAtTime(400,t); f.frequency.exponentialRampToValueAtTime(2400,t+.3); g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.12); g.gain.exponentialRampToValueAtTime(.0001,t+.55); s.connect(f).connect(g).connect(FX); s.start(t); }catch(e){} }
const buzz=ms=>{ try{ navigator.vibrate&&navigator.vibrate(ms); }catch(e){} };
const sfx={ctx,tick,riffle,chime,whoosh,buzz};
const reduced=()=>{ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } };

/* ---------- 리본 덱 엔진 ----------
   area 안에 카드 뒷면 count장을 만들고 세 단계를 돈다.
   1) stack(true): 덱을 쌓아 두고, 꾹 누르는 동안 반으로 갈라 엇갈려 떨어뜨린다(리플). 다 섞이면 onShuffled
      stack(false) + riffles(n): 누르지 않아도 n번 저절로 섞는다(프리미엄 · 다시 섞기)
   2) spread(): 길게 겹친 리본으로 펼친다. 좌우로 밀면 관성으로 흐르고, 가운데를 지나는 카드가 3D로 돌아서며 커진다.
      카드 한 장 지날 때마다 짧은 틱과 진동
   3) 카드를 누르거나 위로 밀어 올리면 pick(카드, 덱 번호)를 묻는다. {el, rz, z}를 돌려주면 그 자리로 날아가 놓이고 onLand.
      null이면 뽑지 않는다. 뽑힌 카드는 줄에서 빠진다. unpick(덱 번호, 자리)로 다시 줄에 돌려놓는다.
   키보드: 좌우 화살표로 넘기고, Enter · Space로 가운데 카드를 뽑는다. 움직임 줄이기 설정이면 섞기 · 관성 · 날아가기를 줄인다.
   옵션: count, need(섞는 시간 ms), floor()(리본 위쪽 한계 y), layout(G)(G의 sx·sy·ry 등 고치기), onHold(p), onShort(),
         onShuffled(), pick(c,i), onLand(c,i), hideOnLand(놓인 뒤 카드 숨김), label(스크린리더 이름) */
function ribbon(area,o){
  o=Object.assign({count:78,need:2200,riff:640,floor:()=>150,layout:null,onHold:null,onShort:null,onShuffled:null,pick:null,onLand:null,hideOnLand:false,label:'카드 줄. 좌우 화살표로 넘기고 Enter로 가운데 카드를 뽑아요'},o||{});
  const RM=reduced();
  let G={W:0,H:0,cw:60,ch:107,sx:0,sy:0,ry:0,sp:26};
  let cards=[], stk=[], rib=[], held=0, holding=false, phase='idle', gen=0, lt=0;
  let rif=null, rafS=0, rafP=0, off=0, offT=null, vel=0, spreadT0=0, drag=null, lastCi=-1, lastBuzz=0, ctr=null, tH=0, tP=0;
  area.classList.add('deckArea'); area.tabIndex=0; area.setAttribute('role','group'); area.setAttribute('aria-label',o.label);
  function geom(keep){ const W=area.clientWidth, H=area.clientHeight, cw=keep?G.cw:Math.round(Math.min(66,W/5.6)), ch=keep?G.ch:Math.round(cw*16/9);
    G={W,H,cw,ch,sx:W/2,sy:H*.58,ry:Math.min(H-ch*.7,Math.max(H*.68,o.floor()+ch*.72)),sp:cw*.44}; if(o.layout) o.layout(G); }
  /* 모든 움직임은 transform 하나로: 위치 → 기울기(Z) → 3D 회전(Y) → 크기 */
  const TF=(x,y,rz,ry,s)=>`translate3d(${(x-G.cw/2).toFixed(1)}px,${(y-G.ch/2).toFixed(1)}px,0) rotateZ(${rz.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${s.toFixed(3)})`;
  const stackPose=(c,k)=>({x:G.sx+c._j*1.2,y:G.sy-k*.3,rz:c._j,ry:0,s:1.25});
  const put=(c,P)=>{ c.style.transform=TF(P.x,P.y,P.rz,P.ry,P.s); };
  function halt(){ gen++; cancelAnimationFrame(rafS); cancelAnimationFrame(rafP); rafS=rafP=0; rif=null; drag=null; vel=0; offT=null; holding=false; tH=0; tP=0; }
  function stack(hold){ halt(); rib=[]; ctr=null; lastCi=-1; spreadT0=0; held=0;
    area.classList.remove('rib'); area.innerHTML=''; cards=[]; geom();
    const fr=document.createDocumentFragment();
    for(let i=0;i<o.count;i++){ const c=document.createElement('div'); c.className='cd'; c.style.width=G.cw+'px'; c.style.height=G.ch+'px'; c._j=(Math.random()-.5)*2.6; c.style.zIndex=i+1; c.dataset.i=i; fr.appendChild(c); cards.push(c); }
    area.appendChild(fr); stk=cards.slice(); stk.forEach((c,k)=>put(c,stackPose(c,k))); phase=hold?'shuffle':'idle'; }
  /* 리플: 위쪽 절반은 왼손, 아래쪽 절반은 오른손. 살짝 휘어 들렸다가 한 장씩 번갈아 떨어지며 섞인다 */
  function riffStart(){ const N=stk.length, h=N>>1, L=stk.slice(0,h), Rr=stk.slice(h), order=[];
    for(let i=0;i<Math.max(L.length,Rr.length);i++){ const a=L[i], b=Rr[i]; if(rnd(5)===0){ if(b) order.push(b); if(a) order.push(a); } else { if(a) order.push(a); if(b) order.push(b); } }
    stk.forEach((c,k)=>{ c._side=k<h?-1:1; c._hk=k<h?k:k-h; });
    order.forEach((c,k)=>{ c._to=k; c._td=.32+.5*k/Math.max(1,N-1); c._dropped=false; });
    rif={t0:performance.now(),order,N}; tick(.06); }
  function riffFrame(now){ const r=rif, p=Math.min(1,(now-r.t0)/o.riff); let tk=0;
    const spl=Math.min(1,p/.28), e=1-Math.pow(1-spl,3);
    r.order.forEach(c=>{ const s=c._side, sxp=G.sx+s*G.cw*1.02*e, syp=G.sy-c._hk*.3-14*e-Math.sin(e*Math.PI)*6, rzs=s*9*e+c._j*(1-e), rys=-s*24*e; let x,y,rz,ry;
      if(p<c._td){ x=sxp; y=syp; rz=rzs; ry=rys; }
      else { const f=Math.min(1,(p-c._td)/.14), q=f*f*(3-2*f); if(!c._dropped){ c._dropped=true; c.style.zIndex=200+c._to; if(c._to%6===0) tk++; }
        x=sxp+(G.sx+c._j*1.2-sxp)*q; y=syp+(G.sy-c._to*.3-syp)*q-Math.sin(q*Math.PI)*7; rz=rzs+(c._j-rzs)*q; ry=rys*(1-q); }
      c.style.transform=TF(x,y,rz,ry,1.25); });
    if(tk){ tick(.045+Math.random()*.04); }
    if(p>=1){ stk=r.order; stk.forEach((c,k)=>c.style.zIndex=k+1); rif=null; } }
  function holdLoop(now){ rafS=0; if(holding){ held=Math.min(o.need,held+(tH?now-tH:0)); o.onHold&&o.onHold(held/o.need); } tH=now;
    if(!rif&&holding&&held<o.need){ if(RM){ if(now-lt>320){ lt=now; tick(.05); } } else { riffStart(); buzz(8); } }
    if(rif) riffFrame(now);
    if(holding&&held>=o.need) holding=false;
    if(rif||holding){ rafS=requestAnimationFrame(holdLoop); return; }
    tH=0; if(held>=o.need&&phase==='shuffle'){ phase='wait'; o.onShuffled&&o.onShuffled(); } }
  function startHold(e){ if(phase!=='shuffle') return; e.preventDefault(); ctx(); holding=true; if(!rafS){ tH=0; rafS=requestAnimationFrame(holdLoop); } }
  function endHold(){ if(!holding) return; holding=false; if(held<o.need) o.onShort&&o.onShort(); }
  /* 저절로 n번 섞기 */
  function riffles(n){ return new Promise(res=>{ if(RM||n<=0){ tick(.06); return res(); } let k=0; const my=gen;
    const st=now=>{ if(my!==gen) return res(); if(!rif){ if(k>=n) return res(); riffStart(); k++; buzz(8); } riffFrame(now); requestAnimationFrame(st); }; requestAnimationFrame(st); }); }
  const tween=(ms,f)=>new Promise(res=>{ const my=gen, t0=performance.now(); const st=now=>{ if(my!==gen) return res(); const e=Math.min(1,(now-t0)/ms); f(e); if(e<1) requestAnimationFrame(st); else res(); }; requestAnimationFrame(st); });

  /* 가운데는 넉넉히, 바깥으로 갈수록 촘촘히 겹쳐서 긴 줄이 화면 밖까지 이어지는 느낌 */
  function ribPose(u){ const a=Math.abs(u), g=Math.exp(-u*u/1.6), sg=u<0?-1:1, m=Math.min(a,10);
    const X=G.sp*(1.7*Math.min(a,1)+.8*Math.max(0,Math.min(a,4)-1)+.46*Math.max(0,a-4));
    return {x:G.sx+sg*X, y:G.ry+m*m*.75-16*g, rz:sg*Math.min(a,10)*2.1, ry:-sg*Math.min(60,a*18), s:1+.22*g, a}; }
  const mix=(A,B,e)=>({x:A.x+(B.x-A.x)*e,y:A.y+(B.y-A.y)*e,rz:A.rz+(B.rz-A.rz)*e,ry:A.ry+(B.ry-A.ry)*e,s:A.s+(B.s-A.s)*e});
  function setCtr(c){ if(c===ctr) return; if(ctr) ctr.classList.remove('ctr'); ctr=c; if(c&&!c._picked) c.classList.add('ctr'); }
  function ribFrame(now){ rafP=0; const dt=tP?Math.min(40,now-tP):16; tP=now; const mx=rib.length-1;
    if(!drag){ if(Math.abs(vel)>.0005){ off+=vel*dt; vel*=Math.pow(.94,dt/16); if(off<0){ off*=.8; vel*=.4; } if(off>mx){ off=mx+(off-mx)*.8; vel*=.4; } }
      else { vel=0; const tg=Math.max(0,Math.min(Math.max(0,mx),offT!=null?offT:Math.round(off))); off+=(tg-off)*Math.min(1,dt/(offT!=null?140:90)); if(Math.abs(tg-off)<.003){ off=tg; offT=null; } } }
    const sT=spreadT0?Math.min(1,(now-spreadT0)/1300):1; let moving=!!drag||vel!==0||sT<1||off!==Math.round(off);
    for(let i=0;i<rib.length;i++){ const c=rib[i]; if(c._p!==i){ c._p+=(i-c._p)*Math.min(1,dt/110); if(Math.abs(i-c._p)<.003) c._p=i; moving=true; }
      const u=c._p-off; let P=ribPose(u); const a=P.a;
      if(sT<1){ const q=Math.max(0,Math.min(1,(sT-Math.min(.45,a*.035))/.5)), e=1-Math.pow(1-q,3); P=mix(c._st,P,e); }
      if(c._py){ P.y+=c._py; P.x+=c._px*.35; const k=Math.min(1,-c._py/120); P.rz*=1-k*.8; P.ry*=1-k*.8; P.s+=Math.min(.25,-c._py/420);
        if(!(drag&&drag.card===c)){ c._py*=Math.pow(.8,dt/16); c._px*=Math.pow(.8,dt/16); if(c._py>-.5){ c._py=0; c._px=0; } } moving=true; }
      const back=c._back&&now<c._back; if(back) moving=true;
      const hide=a>11.5&&sT>=1&&!back; if(hide!==c._hid){ c._hid=hide; c.classList.toggle('off',hide); } if(hide) continue;
      c.style.transform=TF(P.x,P.y,P.rz,P.ry,P.s);
      const z=back?940:c._py?900:500-Math.round(a*10); if(z!==c._z){ c._z=z; c.style.zIndex=z; } }
    const ci=Math.max(0,Math.min(mx,Math.round(off)));
    if(sT>=1&&ci!==lastCi&&rib.length){ if(lastCi>=0){ tick(.035); if(now-lastBuzz>45){ lastBuzz=now; buzz(6); } } lastCi=ci; setCtr(rib[ci]); }
    if(sT>=1&&phase==='spread'){ phase='pick'; spreadT0=0; }
    if(moving) rafP=requestAnimationFrame(ribFrame); else tP=0; }
  const kick=()=>{ if(!rafP){ tP=0; rafP=requestAnimationFrame(ribFrame); } };
  function spread(){ geom(true); area.classList.add('rib'); stk.forEach((c,k)=>{ c._st=stackPose(c,k); });
    rib=cards.filter(c=>!c._picked); rib.forEach((c,i)=>{ c._p=i; c._px=0; c._py=0; c._hid=false; c._z=0; c._back=0; c.classList.remove('off'); });
    off=Math.floor((rib.length-1)/2); offT=null; vel=0; lastCi=-1; ctr=null; spreadT0=RM?0:performance.now(); phase='spread'; whoosh(.1); kick(); }
  function cardAt(cx,cy){ const r=area.getBoundingClientRect(), x=cx-r.left, y=cy-r.top; if(y<G.ry-G.ch*1.05||y>G.ry+G.ch*.95) return null;
    let best=null, bd=1e9; rib.forEach(c=>{ if(c._hid) return; const u=c._p-off, d=Math.abs(ribPose(u).x-x)+Math.abs(u)*.5; if(d<bd){ bd=d; best=c; } }); return bd<G.cw*.75?best:null; }
  /* 자리(요소)의 가운데와 크기를 area 좌표로. rz가 90이면 옆으로 누운 자리 */
  function tgt(t){ const ar=area.getBoundingClientRect(), el=t.el||t, r=el.getBoundingClientRect(), rz=t.rz||0, w=(rz%180?r.height:r.width);
    return {x:r.left-ar.left+r.width/2,y:r.top-ar.top+r.height/2,rz,s:w/G.cw}; }
  function pickCard(c){ if(phase!=='pick'||!c||c._picked||!o.pick) return; const i=+c.dataset.i, t=o.pick(c,i); if(!t) return;
    c._picked=true; c._back=0; const ri=rib.indexOf(c); if(ri>=0) rib.splice(ri,1); if(ctr===c) ctr=null; lastCi=-1;
    c.classList.remove('ctr','pull','off','gone','land'); c._hid=false; c._py=0; c._px=0; c.style.zIndex=950+(t.z||0); c._z=-1;
    const T=tgt(t); if(!RM) c.classList.add('fly'); c.style.transform=TF(T.x,T.y,T.rz,0,T.s);
    whoosh(); buzz(14); clearTimeout(c._ft);
    c._ft=setTimeout(()=>{ c.classList.remove('fly'); c.classList.add('land'); if(o.hideOnLand) c.classList.add('gone'); chime(784,.07); o.onLand&&o.onLand(c,i); },RM?60:740);
    kick(); }
  function unpick(i,from){ const c=cards[i]; if(!c||!c._picked) return false; c._picked=false; clearTimeout(c._ft);
    if(from){ const T=tgt(from); c.classList.remove('fly'); c.style.transform=TF(T.x,T.y,T.rz,0,T.s); }
    c.classList.remove('gone','land','ctr'); void c.offsetWidth;
    let at=rib.findIndex(x=>+x.dataset.i>i); if(at<0) at=rib.length; rib.splice(at,0,c);
    c._p=at; c._px=0; c._py=0; c._hid=false; c._z=-1; offT=at; vel=0; lastCi=-1;
    if(!RM){ c.classList.add('fly'); c._back=performance.now()+760; c._ft=setTimeout(()=>c.classList.remove('fly'),760); }
    whoosh(.09); kick(); return true; }
  /* 남은 카드를 모아 다시 섞고 다시 펼친다 */
  async function reshuffle(n=2){ if(phase!=='pick') return false; const my=++gen; cancelAnimationFrame(rafP); rafP=0; drag=null; vel=0; offT=null; setCtr(null); phase='gather';
    const from=rib.map(c=>({c,P:ribPose(c._p-off)})); stk=rib.slice(); area.classList.remove('rib');
    stk.forEach((c,k)=>{ c.classList.remove('off','ctr','pull','fly'); c._hid=false; c._py=0; c._px=0; c._back=0; c.style.zIndex=k+1; c._z=-1; });
    whoosh(.1);
    if(RM) stk.forEach((c,k)=>put(c,stackPose(c,k)));
    else await tween(520,e=>{ const q=1-Math.pow(1-e,3); from.forEach((f,k)=>put(f.c,mix(f.P,stackPose(f.c,k),q))); });
    if(my!==gen) return false;
    await riffles(n); if(my!==gen) return false;
    spread(); return true; }
  function step(d){ if(phase!=='pick'||!rib.length) return; vel=0; offT=Math.max(0,Math.min(rib.length-1,Math.round(offT!=null?offT:off)+d)); kick(); }
  function pickCenter(){ if(phase!=='pick'||!rib.length) return; pickCard(rib[Math.max(0,Math.min(rib.length-1,Math.round(off)))]); }

  const onDown=e=>{ if(phase==='shuffle') return startHold(e); if(phase!=='pick') return; e.preventDefault(); ctx();
    try{ area.setPointerCapture(e.pointerId); }catch(_){}
    const now=performance.now(); offT=null; drag={id:e.pointerId,x0:e.clientX,y0:e.clientY,off0:off,t0:now,mode:null,card:cardAt(e.clientX,e.clientY),hist:[[now,e.clientX]]}; vel=0; kick(); };
  const onMove=e=>{ if(!drag||e.pointerId!==drag.id) return; const dx=e.clientX-drag.x0, dy=e.clientY-drag.y0, now=performance.now();
    if(!drag.mode&&Math.hypot(dx,dy)>8){ drag.mode=(dy<0&&-dy>Math.abs(dx)*1.1&&drag.card)?'pull':'scroll'; if(drag.mode==='pull'){ drag.card.classList.add('pull'); tick(.05); } }
    if(drag.mode==='scroll'){ const mx=rib.length-1; off=drag.off0-dx/G.sp; if(off<0) off*=.35; if(off>mx) off=mx+(off-mx)*.35; drag.hist.push([now,e.clientX]); if(drag.hist.length>6) drag.hist.shift(); }
    else if(drag.mode==='pull'){ drag.card._px=dx; drag.card._py=Math.min(-.01,dy); }
    kick(); };
  const onUp=e=>{ if(!drag||(e&&e.pointerId!==drag.id)) return; const d=drag; drag=null; const now=performance.now();
    if(d.mode==='scroll'){ const h=d.hist, a=h[0], b=h[h.length-1]; if(!RM&&h.length>1&&b[0]>a[0]&&now-b[0]<90) vel=Math.max(-.09,Math.min(.09,-((b[1]-a[1])/(b[0]-a[0]))/G.sp)); }
    else if(d.mode==='pull'){ d.card.classList.remove('pull'); if(-d.card._py>G.ch*.42) pickCard(d.card); }
    else if(!d.mode&&d.card&&now-d.t0<450) pickCard(d.card);
    kick(); };
  const onKey=e=>{ if(phase!=='pick') return; if(e.key==='ArrowLeft'){ e.preventDefault(); step(-1); } else if(e.key==='ArrowRight'){ e.preventDefault(); step(1); } else if(e.key==='Enter'||e.key===' '){ e.preventDefault(); ctx(); pickCenter(); } };
  const onResize=()=>{ if(phase==='pick'||phase==='spread'){ geom(true); kick(); } };
  area.addEventListener('pointerdown',onDown); area.addEventListener('pointermove',onMove); area.addEventListener('pointerup',onUp); area.addEventListener('pointercancel',onUp); area.addEventListener('keydown',onKey);
  window.addEventListener('pointerup',endHold); window.addEventListener('pointercancel',endHold); window.addEventListener('resize',onResize);
  function destroy(){ halt(); phase='idle'; area.removeEventListener('pointerdown',onDown); area.removeEventListener('pointermove',onMove); area.removeEventListener('pointerup',onUp); area.removeEventListener('pointercancel',onUp); area.removeEventListener('keydown',onKey);
    window.removeEventListener('pointerup',endHold); window.removeEventListener('pointercancel',endHold); window.removeEventListener('resize',onResize); cards.forEach(c=>clearTimeout(c._ft)); area.innerHTML=''; }
  return {stack,spread,riffles,reshuffle,unpick,step,pickCenter,destroy,reduced:RM,
    done(){ phase='done'; }, phase:()=>phase, left:()=>rib.length, relayout(){ geom(true); kick(); }}; }

window.TarotDeck={ROMAN,SUIT,RANK_KO,isMajor,isCourt,label,fbAttr,preload,FIXED_N,rnd,sfx,reduced,ribbon};
})();
