/* 종이 넘기는 소리(합성) */
let AC=null; function rustle(){ try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); const d=.45, n=AC.createBuffer(1,AC.sampleRate*d,AC.sampleRate), a=n.getChannelData(0); for(let i=0;i<a.length;i++){ const t=i/a.length; a[i]=(Math.random()*2-1)*Math.pow(1-t,2.2)*(t<.08?t/.08:1)*(.6+.4*Math.sin(t*38)); }
  const s=AC.createBufferSource(); s.buffer=n; const f=AC.createBiquadFilter(); f.type='bandpass'; f.frequency.value=2600; f.Q.value=.7; const g=AC.createGain(); g.gain.value=.16; s.connect(f); f.connect(g); g.connect(AC.destination); s.start(); }catch(e){} }

/* 현재 장: 영상 재생 · 그림 깊이 효과 켜기 */
let cur=0;
function activate(){ leaves.forEach((l,i)=>{ const on=i===cur; l.classList.toggle('cur',on);
    l.querySelectorAll('video').forEach(v=>{ if(on){ if(!v.getAttribute('src')) v.src=v.dataset.src; v.onplaying=()=>v.classList.add('on'); v.play().catch(()=>{}); } else { try{ v.pause(); }catch(e){} } });
    const pl=l.querySelector('.plate[data-dep],.cv[data-dep]'); if(pl&&window.Depth3D){ if(on&&!pl._d3&&!pl.querySelector('video.on')){ const u=pl.dataset.img, d=u.replace(/\.jpg$/,'_d.jpg'); const im=new Image(); im.onload=()=>{ if(i===cur&&!pl._d3) Depth3D.mount(pl,{src:u,pos:pl.dataset.pos.split(' ').map(Number),str:.9}); }; im.src=d; } else if(!on&&pl._d3){ Depth3D.unmount(pl); } } });
  $('prev').disabled=cur===0; $('next').disabled=cur===N-1; $('pgN').textContent=`${cur+1} / ${N}`; $('prog').style.width=(cur/(N-1)*100)+'%';
  const p=PAGES[cur]; $('runT').textContent=p.t==='cover'?'오방사주 세계관 · 제1권':(p.toc||`${p.ch} · ${p.hd}`);
  $('tocL').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('on',i===cur));
  try{ sessionStorage.setItem('obBookPg',cur); }catch(e){} }
function go(n,sound=true){ n=Math.max(0,Math.min(N-1,n)); if(n===cur) return; const fwd=n>cur;
  leaves.forEach((l,i)=>{ const t=i<n; if(l.classList.contains('turned')!==t){ l.classList.add('moving'); setTimeout(()=>l.classList.remove('moving'),900); } l.classList.toggle('turned',t); });
  cur=n; if(sound) rustle(); try{ navigator.vibrate&&navigator.vibrate(8); }catch(e){} activate(); }
$('next').onclick=()=>go(cur+1); $('prev').onclick=()=>go(cur-1);
document.addEventListener('keydown',e=>{ if(e.key==='ArrowRight') go(cur+1); if(e.key==='ArrowLeft') go(cur-1); });

/* 손가락으로 끌어 넘기기 · 가장자리 탭 */
let drag=null;
$('book').addEventListener('pointerdown',e=>{ if(e.target.closest('button')) return; const r=$('book').getBoundingClientRect(); drag={x:e.clientX,y:e.clientY,w:r.width,left:e.clientX-r.left<r.width*.35,moved:false,leaf:null,dir:0}; });
window.addEventListener('pointermove',e=>{ if(!drag) return; const dx=e.clientX-drag.x; if(!drag.moved&&Math.abs(dx)<8) return;
  if(!drag.moved){ drag.moved=true; drag.dir=dx<0?1:-1; drag.leaf=drag.dir>0?leaves[cur]:leaves[cur-1]; if(!drag.leaf||(drag.dir>0&&cur===N-1)){ drag.leaf=null; return; } drag.leaf.classList.add('drag','moving'); }
  if(!drag.leaf) return; const k=Math.max(0,Math.min(1,drag.dir>0?-dx/drag.w:1-dx/drag.w)); drag.k=k; drag.leaf.style.transform=`rotateY(${-178*k}deg)`; });
window.addEventListener('pointerup',e=>{ if(!drag) return; const d=drag; drag=null;
  if(d.leaf){ d.leaf.classList.remove('drag'); d.leaf.style.transform=''; setTimeout(()=>d.leaf.classList.remove('moving'),900);
    if(d.dir>0) { if(d.k>.28) go(cur+1); } else { if(d.k<.72) go(cur-1); } return; }
  if(!d.moved){ if(e.target.closest('button')) return; if(d.left) go(cur-1); else go(cur+1); } });

/* 버튼 */
$('book').addEventListener('click',e=>{ const b=e.target.closest('[data-go]'); if(!b) return; if(b.dataset.go==='restart'){ go(0); return; } try{ sessionStorage.setItem('toHome','1'); }catch(_){} location.href='./'; });
$('tocB').onclick=()=>$('toc').classList.toggle('on');
$('toc').onclick=e=>{ const b=e.target.closest('[data-i]'); if(b) go(+b.dataset.i); $('toc').classList.remove('on'); };
$('back').onclick=()=>{ try{ sessionStorage.setItem('toHome','1'); }catch(e){} if(history.length>1) history.back(); else location.href='./'; };
/* 읽던 곳부터 */
(()=>{ let s=0; try{ s=+(sessionStorage.getItem('obBookPg')||0); }catch(e){} if(s>0&&s<N){ cur=0; go(s,false); } else activate(); })();
</script>
<script src="depth3d.js"></script>
<script>if(window.Depth3D&&Depth3D.enableGyro) try{ Depth3D.enableGyro(); }catch(e){}</script>
</body>
</html>
