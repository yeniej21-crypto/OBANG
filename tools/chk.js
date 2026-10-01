
(()=>{
const $=id=>document.getElementById(id);
const V={intro:'v/intro.mp4',t1:'v/t1.mp4',t1a:'v/t1a.mp4',t1b:'v/t1b.mp4',t2:'v/t2.mp4',t3:'v/t3.mp4',t4:'v/t4.mp4',t5:'v/t5.mp4',t6:'v/t6.mp4',idle:'v/idle.mp4',
  rv_wood:'v/rv_wood.mp4',rv_fire:'v/rv_fire.mp4',rv_earth:'v/rv_earth.mp4',rv_metal:'v/rv_metal.mp4',rv_water:'v/rv_water.mp4'};
const LINES={
  t1:['왔네.','문 닫고, 이리 와 앉아.'],
  t1a:['사주 보는 데야.','긴장 풀어. 안 잡아먹어.'],
  t1b:['말 잘 듣네.','그런 애가 운도 잘 풀려.'],
  t2:['생년월일이랑 태어난 시간.','모르면 모른다고 해.'],
  t3:['흠…','너 요즘 혼자 참는 거 많지.','얼굴에 다 써 있어.'],
  t4:['그래서.','누구 때문에 왔어?'],
  t5:['네 사주에 빠진 기운이 하나 있네.','그걸 채워줄 애를 붙여줄게.'],
  t6:['내일 아침 일곱 시,','걔가 첫 개운 미션 보낼 거야.','알림 켜 둬.']};
const FALLBACK_DUR={intro:6,t1:5,t1a:5,t1b:5,t2:5,t3:6,t4:4,t5:7,t6:7,idle:5,rv:5};
const POSTER={seoha:'img/seoha.jpg'};
const GODS={
  wood:{h:'靑龍',n:'하람',el:'木',dir:'동쪽',c:'var(--wood)',label:'목(木)',desc:'동쪽을 지키는 청룡 · 새 시작과 다음 인연',mission:'초록색 하나 걸치고, 동쪽으로 10분만 걸어.'},
  fire:{h:'朱雀',n:'이안',el:'火',dir:'남쪽',c:'var(--fire)',label:'화(火)',desc:'남쪽을 지키는 주작 · 고백과 결단',mission:'오늘은 네가 먼저 연락해. 망설이면 불 꺼진다.'},
  earth:{h:'黃龍',n:'도준',el:'土',dir:'중앙',c:'var(--earth)',label:'토(土)',desc:'중앙을 지키는 황룡 · 안정과 관계',mission:'책상 위 하나만 정리해. 네 자리가 단단해야 운이 앉아.'},
  metal:{h:'白虎',n:'시온',el:'金',dir:'서쪽',c:'var(--metal)',label:'금(金)',desc:'서쪽을 지키는 백호 · 정리와 결단',mission:'오늘 안 맞는 약속 하나, 끊어.'},
  water:{h:'玄武',n:'재이',el:'水',dir:'북쪽',c:'var(--water)',label:'수(水)',desc:'북쪽을 지키는 현무 · 속마음과 지혜',mission:'자기 전에 물 한 잔, 오늘 하루 세 줄만 적어.'}};
const ORDER=['wood','fire','earth','metal','water'];

/* ---------- saju (simplified solar calc) ---------- */
const STEM='甲乙丙丁戊己庚辛壬癸', BR='子丑寅卯辰巳午未申酉戌亥';
const STEM_EL=[0,0,1,1,2,2,3,3,4,4], BR_EL=[4,2,0,0,2,1,1,2,3,3,2,4];
const EL_KEYS=ORDER, EL_COL=['var(--wood)','var(--fire)','var(--earth)','var(--metal)','var(--water)'];
function jdn(y,m,d){const a=Math.floor((14-m)/12),yy=y+4800-a,mm=m+12*a-3;return d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045}
const TERMS=[[2,4],[3,6],[4,5],[5,6],[6,6],[7,7],[8,8],[9,8],[10,8],[11,7],[12,7],[1,6]];
function calc(y,m,d,hBr){
  let sy=y; if(m<2||(m===2&&d<4)) sy=y-1;
  const ys=((sy-4)%10+10)%10, yb=((sy-4)%12+12)%12;
  const n=m*100+d; let mi;
  if(n>=1207||n<106) mi=10; else if(n<204) mi=11;
  else { mi=0; for(let i=0;i<10;i++){ const [tm,td]=TERMS[i]; if(n>=tm*100+td) mi=i; } }
  const ms=((ys%5)*2+2+mi)%10, mb=(2+mi)%12;
  const di=((jdn(y,m,d)-2415021+10)%60+60)%60, ds=di%10, db=di%12;
  const P=[{l:'년주',s:ys,b:yb},{l:'월주',s:ms,b:mb},{l:'일주',s:ds,b:db}];
  if(hBr!==null){const hs=((ds%5)*2+hBr)%10;P.push({l:'시주',s:hs,b:hBr});} else P.push({l:'시주',s:null,b:null});
  const cnt=[0,0,0,0,0]; P.forEach(p=>{if(p.s!==null){cnt[STEM_EL[p.s]]++;cnt[BR_EL[p.b]]++;}});
  let low=0; for(let i=1;i<5;i++){ if(cnt[i]<cnt[low]) low=i; else if(cnt[i]===cnt[low] && ((di+i)%2===0)) low=i; }
  return {P,cnt,low:EL_KEYS[low]};
}

/* ---------- media engine ---------- */
const vA=$('vA'), vB=$('vB'), poster=$('poster');
let front=vA, back=vB, muted=false, cancelTok=0;
function setPoster(src){ if(src){poster.style.backgroundImage=`url("${src}")`;poster.classList.add('on');} else poster.classList.remove('on'); }
function subs(key){
  const box=$('subLines'); box.innerHTML=''; const lines=LINES[key]||[];
  $('who').classList.toggle('on',lines.length>0);
  return lines.map(t=>{const p=document.createElement('p');p.textContent=t;box.appendChild(p);return p;});
}
function clearSubs(){ $('subLines').innerHTML=''; $('who').classList.remove('on'); }
function schedule(els,dur,tok){
  if(!els.length) return;
  const total=els.reduce((a,e)=>a+e.textContent.length,0), span=Math.max(dur-0.8,1.2);
  let t=0.25; els.forEach((e,i)=>{ const at=t; setTimeout(()=>{ if(tok!==cancelTok) return; if(i>0) els[i-1].style.display='none'; e.classList.add('on'); },at*1000); t+=span*(e.textContent.length/total); });
}
function play(key,{loop=false,posterKey='seoha',showSubs=true}={}){
  return new Promise(resolve=>{
    const tok=++cancelTok; const v=back; let done=false;
    const finish=()=>{ if(done) return; done=true; resolve(); };
    const els=showSubs?subs(key):(clearSubs(),[]);
    v.loop=loop; v.muted=muted; v.src=V[key]; v.currentTime=0;
    const fallback=()=>{ // no video file: show still + timed subs
      if(tok!==cancelTok) return;
      setPoster(POSTER[posterKey]||null); front.classList.remove('on'); back.classList.remove('on');
      const d=FALLBACK_DUR[key.startsWith('rv_')?'rv':key]||5; schedule(els,d,tok);
      if(!loop) setTimeout(()=>{ if(tok===cancelTok) finish(); },d*1000); else finish();
    };
    v.onerror=fallback;
    v.onloadeddata=()=>{
      if(tok!==cancelTok) return;
      v.play().then(()=>{
        v.classList.add('on'); front.classList.remove('on'); setPoster(null);
        const f=front; front=v; back=f; setTimeout(()=>{ if(back!==front){back.pause();} },650);
        schedule(els,v.duration||5,tok);
        if(loop) finish(); else v.onended=()=>{ if(tok===cancelTok) finish(); };
      }).catch(fallback);
    };
    v.load();
  });
}
function idle(){ clearSubs(); return play('idle',{loop:true,showSubs:false}); }
function panel(id){ ['pChoice','pBirth','pWorry'].forEach(p=>$(p).classList.toggle('on',p===id)); }
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),1800);}

/* ---------- form setup ---------- */
(function(){
  const by=$('by'),bm=$('bm'),bd=$('bd'),bh=$('bh');
  for(let y=2008;y>=1960;y--) by.add(new Option(y+'년',y,false,y===1996));
  for(let m=1;m<=12;m++) bm.add(new Option(m+'월',m,false,m===5));
  const fillD=()=>{const n=new Date(+by.value,+bm.value,0).getDate(),cur=+bd.value||14;bd.innerHTML='';for(let d=1;d<=n;d++) bd.add(new Option(d+'일',d,false,d===Math.min(cur,n)));};
  fillD(); by.onchange=fillD; bm.onchange=fillD;
  const HN=['자시 (23~01시)','축시 (01~03시)','인시 (03~05시)','묘시 (05~07시)','진시 (07~09시)','사시 (09~11시)','오시 (11~13시)','미시 (13~15시)','신시 (15~17시)','유시 (17~19시)','술시 (19~21시)','해시 (21~23시)'];
  bh.add(new Option('시간 모름','x'));
  HN.forEach((h,i)=>bh.add(new Option(h,i)));
  $('solar').onclick=()=>{$('solar').setAttribute('aria-pressed','true');$('lunar').setAttribute('aria-pressed','false');};
  $('lunar').onclick=()=>{$('lunar').setAttribute('aria-pressed','true');$('solar').setAttribute('aria-pressed','false');};
  $('chips').querySelectorAll('.chip').forEach(c=>c.onclick=()=>{$('chips').querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed','false'));c.setAttribute('aria-pressed','true');});
})();

/* ---------- flow ---------- */
let S=null;
function unlock(){ return Promise.all([vA,vB].map(v=>{ try{ if(!v.getAttribute('src')) v.src=V.idle; v.muted=false; const p=v.play(); return (p&&p.then?p:Promise.resolve()).then(()=>v.pause()).catch(()=>{}); }catch(e){ return Promise.resolve(); } })); }
async function startStory(){
  $('start').classList.add('off'); await play('intro',{posterKey:null,showSubs:false}); await sceneOne();
}
async function sceneOne(){ await play('t1'); await idle(); panel('pChoice'); }
async function afterChoice(k){ panel(null); await play(k); await askBirth(); }
async function askBirth(){ await play('t2'); await idle(); panel('pBirth'); }
async function afterBirth(){
  panel(null);
  const y=+$('by').value,m=+$('bm').value,d=+$('bd').value,h=$('bh').value; S=calc(y,m,d,h==='x'?null:+h);
  await play('t3'); await play('t4'); await idle(); panel('pWorry');
}
async function afterWorry(){
  panel(null); await play('t5');
  const g=GODS[S.low]; clearSubs();
  const f=$('flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
  POSTER['rv_'+S.low]='img/'+S.low+'.jpg';
  $('ncHanja').textContent=g.h; $('ncHanja').style.setProperty('--c',g.c); $('namecard').style.setProperty('--c',g.c);
  $('ncName').textContent=g.n; $('ncDesc').textContent=`네 사주에 모자란 기운 ${g.label} · ${g.desc}`;
  setTimeout(()=>$('namecard').classList.add('on'),900);
  await play('rv_'+S.low,{posterKey:'rv_'+S.low,showSubs:false});
  await new Promise(r=>setTimeout(r,900));
  $('namecard').classList.remove('on');
  await play('t6'); showResult();
}
function showResult(){
  const g=GODS[S.low];
  $('rHero').style.backgroundImage=`url("img/${S.low}.jpg")`;
  $('rGod').textContent=`${g.h} · ${g.el} · ${g.dir}`; $('rName').textContent=`나의 수호신, ${g.n}`;
  $('rPillars').innerHTML=S.P.map(p=>`<div><div class="l">${p.l}</div><div class="c">${p.s===null?'<span style="color:var(--ink-3)">?</span>':`<span style="color:${EL_COL[STEM_EL[p.s]]}">${STEM[p.s]}</span><br><span style="color:${EL_COL[BR_EL[p.b]]}">${BR[p.b]}</span>`}</div></div>`).join('');
  const max=Math.max(...S.cnt,1), names=['목(木)','화(火)','토(土)','금(金)','수(水)'];
  $('rBars').innerHTML=S.cnt.map((c,i)=>`<div class="bar ${EL_KEYS[i]===S.low?'low':''}" style="--c:${EL_COL[i]}"><span class="lbl">${names[i]}</span><div class="t"><i data-w="${Math.max(c/max*100,4)}"></i></div><span class="v">${c}</span></div>`).join('');
  $('rMission').textContent=g.mission;
  $('result').classList.add('on');
  setTimeout(()=>$('rBars').querySelectorAll('i').forEach(i=>i.style.width=i.dataset.w+'%'),60);
}
$('enter').onclick=async()=>{ await unlock(); startStory(); };
$('skipStory').onclick=async()=>{ await unlock(); $('start').classList.add('off'); askBirth(); };
$('c1a').onclick=()=>afterChoice('t1a');
$('c1b').onclick=()=>afterChoice('t1b');
$('birthGo').onclick=afterBirth;
$('worryGo').onclick=afterWorry;
$('worrySkip').onclick=afterWorry;
$('ctaPay').onclick=()=>toast('체험판: 결제 화면으로 이동합니다');
$('ctaPush').onclick=()=>toast('체험판: 내일 07:00 알림 예약됨');
$('ctaShare').onclick=()=>toast('체험판: 공유 카드 생성');
$('muteBtn').onclick=()=>{ muted=!muted; [vA,vB].forEach(v=>v.muted=muted); $('waves').style.display=muted?'none':''; $('muteBtn').setAttribute('aria-label',muted?'소리 켜기':'소리 끄기'); };
$('restartBtn').onclick=()=>{ location.reload(); };
// initial poster: entrance first frame if available
vA.src=V.intro; vA.muted=true; vA.preload='auto';
vA.onloadeddata=()=>{ vA.currentTime=0.05; vA.classList.add('on'); };
vA.onerror=()=>setPoster(POSTER.seoha);
})();
