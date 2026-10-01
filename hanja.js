/* 한자 읽기 병기 — 화면에 나오는 간지 · 오행 한자에 한글 읽기를 자동으로 붙인다.
   본문 글씨: 壬寅 → 임인(壬寅) · 丁未年 → 정미년(丁未年) · 土 → 토(土)
   큰 글씨(만세력 칸처럼 한 글자를 크게 보여 주는 곳): 壬 옆에 작은 '임'
   이미 괄호로 병기돼 있으면 건드리지 않는다. 도장 · 장식 글씨는 data-hj="0" 또는 아래 SKIP 클래스로 제외. */
(function(){
const G='甲乙丙丁戊己庚辛壬癸', J='子丑寅卯辰巳午未申酉戌亥', E='木火土金水', T='年月日時';
const M={}; [...G].forEach((c,i)=>M[c]='갑을병정무기경신임계'[i]); [...J].forEach((c,i)=>M[c]='자축인묘진사오미신유술해'[i]); [...E].forEach((c,i)=>M[c]='목화토금수'[i]); [...T].forEach((c,i)=>M[c]='년월일시'[i]);
const RE=/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥木火土金水]+[年月日時]?/g, HAS=/[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥木火土金水]/;
const SKIP='script,style,textarea,input,select,option,svg,canvas,[data-hj="0"],.pk-sg i,.seal,.hj-k,.hj-n';
const read=s=>[...s].map(c=>M[c]||c).join('');
const st=document.createElement('style'); st.textContent='.hj-k{font-size:.42em;font-weight:700;opacity:.72;margin-left:.08em;vertical-align:.18em;letter-spacing:0;font-family:"Noto Sans KR",sans-serif}.hj-k.hj-s{font-size:.7em;vertical-align:.05em;opacity:.8}';
document.head.appendChild(st);
const PP={은:['은','는'],는:['은','는'],이:['이','가'],가:['이','가'],을:['을','를'],를:['을','를'],과:['과','와'],와:['과','와']};
/* 괄호 병기 뒤 조사를 괄호 앞 한글 받침에 맞춘다: 술(戌)와 → 술(戌)과 */
function fixP(t){ return t.replace(/([가-힣])\(([^()]*)\)(은|는|이|가|을|를|과|와)(?=[\s,.·)]|$)/g,(m,c,inner,j)=>{ const code=c.charCodeAt(0)-0xAC00, bat=code%28>0; return c+'('+inner+')'+PP[j][bat?0:1]; }); }
function fixText(n){ const t=n.nodeValue; if(!t||!HAS.test(t)) return; const p=n.parentElement; if(!p||p.closest(SKIP)) return; const nx=n.nextSibling; if(nx&&nx.nodeType===1&&nx.classList.contains('hj-k')) return;
  const fs=parseFloat(getComputedStyle(p).fontSize)||14, pure=/^\s*[甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥木火土金水年月日時·\s]+\s*$/.test(t);
  const big=fs>=19, narrow=pure&&[...t.replace(/[\s·]/g,'')].length<=2;
  if(pure&&(big||narrow)){ /* 큰 한자 칸 · 좁은 칸: 옆에 작은 한글 */
    const f=document.createDocumentFragment(); let last=0; t.replace(RE,(m,o)=>{ if(o>last) f.appendChild(document.createTextNode(t.slice(last,o)));
      [...m].forEach(c=>{ f.appendChild(document.createTextNode(c)); const k=document.createElement('span'); k.className='hj-k'+(big?'':' hj-s'); k.textContent=M[c]||''; f.appendChild(k); }); last=o+m.length; return m; });
    if(last<t.length) f.appendChild(document.createTextNode(t.slice(last))); p.replaceChild(f,n); return; }
  const v=t.replace(RE,(m,o,s)=>{ const a=s[o+m.length], b=s[o-1]; if(a==='('||b==='('||a==='（') return m; return read(m)+'('+m+')'; });
  const v2=v!==t?fixP(v):v; if(v2!==t) n.nodeValue=v2; }
function walk(root){ if(!root) return; if(root.nodeType===3){ fixText(root); return; } if(root.nodeType!==1||root.closest&&root.closest(SKIP)) return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT), L=[]; let n; while((n=w.nextNode())) L.push(n); L.forEach(fixText); }
let q=new Set(), tm=0;
function flush(){ tm=0; const L=[...q]; q.clear(); L.forEach(x=>{ if(x.isConnected) walk(x); }); }
function push(x){ q.add(x); if(!tm) tm=requestAnimationFrame(flush); }
function start(){ walk(document.body); new MutationObserver(ms=>ms.forEach(m=>{ if(m.type==='characterData') push(m.target); else m.addedNodes.forEach(push); })).observe(document.body,{childList:true,subtree:true,characterData:true}); }

/* 명리 용어 쉬운 뜻 — 초안 원고와 근거 줄에만 붙인다(AI 원고는 프롬프트에서 직접 풀어 씀) */
const TERM={육합:'서로 끌어당김',삼합:'한 팀으로 뭉침',천간합:'마음이 맞음',천간충:'생각이 부딪힘',원진:'괜히 서운하고 꺼려짐',
 도화:'사람을 끄는 매력',홍염:'은근한 끌림',역마:'이동 · 변화',화개:'혼자 파고드는 공부 · 예술 기운',천을귀인:'돕는 사람이 나타남',양인:'칼처럼 센 추진력',문창귀인:'글 · 시험 복',공망:'비어서 헛도는 자리',백호:'다침 조심',
 비견:'나와 같은 힘 · 동료',겁재:'경쟁 · 나눠 갖는 힘',식신:'먹고 즐기고 만드는 힘',상관:'말 · 재능 · 반항',편재:'크게 움직이는 돈',정재:'꾸준한 돈 · 살림',편관:'압박과 책임',정관:'직장 · 명예 · 규칙',편인:'독특한 생각 · 직감',정인:'배움 · 문서 · 보살핌',
 비겁:'나와 같은 힘',식상:'표현하고 만드는 힘',재성:'돈 · 결과',관성:'조직 · 책임 · 인연',인성:'배움 · 도움',
 일간:'타고난 나 자신',일지:'배우자 자리',월지:'일터 · 사회 자리',년지:'집안 · 어린 시절 자리',시지:'자녀 · 말년 자리',대운:'10년마다 바뀌는 큰 운',세운:'그해의 운',용신:'나를 돕는 기운',신약:'타고난 힘이 약한 편',신강:'타고난 힘이 센 편',
 장생:'새로 움트는 때',관대:'자리 잡는 때',건록:'스스로 서는 때',제왕:'가장 센 때'};
const ONE={충:'정면으로 부딪힘',형:'마찰 · 시비',파:'틀어짐',해:'은근한 방해','같은 글자':'같은 기운이 겹침'};
const TK=Object.keys(TERM).sort((a,b)=>b.length-a.length);
function gl(t){ if(typeof t!=='string') return t; const done=new Set();
  return t.replace(new RegExp(TK.join('|'),'g'),(m,o,s)=>{ if(done.has(m)) return m; const a=s[o+m.length]||'', b=s[o-1]||'';
    if(a==='('||'없데'.includes(a)&&a) return m; if(/[가-힣]/.test(b)&&!/[은는이가을를의와과도]/.test(b)) return m; done.add(m); return m+'('+TERM[m]+')'; }).replace(/x^/,''); }
function glAll(x){ if(typeof x==='string') return fixP(gl(x)); if(Array.isArray(x)) return x.map(glAll); if(x&&typeof x==='object'){ const o={}; for(const k in x) o[k]=glAll(x[k]); return o; } return x; }
function evItem(t){ t=String(t); if(t.includes('(')) return t; for(const w of Object.keys(ONE)) if(t===w||t.endsWith(' '+w)) return t+'('+ONE[w]+')'; const w=t.split(' ').pop(); return TERM[w]?t+'('+TERM[w]+')':t; }
window.HJ={read,fix:walk,gl,glAll,evItem,TERM};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
