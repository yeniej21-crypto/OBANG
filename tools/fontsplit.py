# 붓글씨(OBrush) 나눠 싣기 (10/4 10:50)
# 1) 원본 fonts/obrush.woff2 의 점을 2단위(1024 기준) 안에서 줄이고 512 단위로 바꿈(눈으로 차이 없음, 용량 약 40% 줄어듦)
# 2) 글자를 다섯 묶음으로: a 홈 첫 화면 · b 다른 메뉴 첫 화면 · s 숫자 · 기호 · c1 c2 나머지 한글
#    브라우저는 화면에 실제로 쓰인 글자가 든 묶음만 받는다(unicode-range).
# 3) 모든 페이지의 @font-face 를 /*OBF*/ ... /*OBF*/ 블록으로 바꾸고, 그 페이지 첫 화면에 필요한 묶음을 preload
# 다시 돌릴 때: _fc.js 로 _fc.json(페이지별 붓글씨 글자) 새로 뽑은 뒤 python3 fontsplit.py
import json, os, re, subprocess, sys, glob
SP=os.path.dirname(os.path.abspath(__file__)); P=SP+'/proto'; W=SP+'/_fz'; os.makedirs(W,exist_ok=True)
VER='1'  # 글꼴 내용이 바뀌면 숫자를 올린다(fonts 폴더는 1년 고정 캐시)
sys.path.insert(0,W)
from fontTools.ttLib import TTFont
sys.path.insert(0,SP); from fontsimp import simplify
from fontTools.ttLib.scaleUpem import scale_upem

f=TTFont(P+'/fonts/obrush.woff2'); simplify(f,2); scale_upem(f,512); f.flavor=None; f.save(W+'/master.ttf')
cm=sorted(f.getBestCmap())
d=json.load(open(SP+'/_fc.json'))
H=set(); O=set(); per={}
for k,v in d.items():
    if v.startswith('ERR'): continue
    pg=k.split('|')[0]; per.setdefault(pg,set()).update(ord(c) for c in v)
    (H if 'salon' in pg else O).update(ord(c) for c in v)
cs=set(cm); hg=lambda c:0xac00<=c<=0xd7a3
A=H&cs; B=(O&cs)-A; S=sorted(c for c in cs-A-B if not hg(c)); C=sorted(cs-A-B-set(S))
G={'a':A,'b':B,'s':set(S),'c1':set(C[:len(C)//2]),'c2':set(C[len(C)//2:])}
own={c:n for n,s in G.items() for c in s}
for n,s in G.items():
    open(W+f'/u_{n}.txt','w').write(','.join('U+%04X'%c for c in sorted(s)))
    subprocess.run(['pyftsubset',W+'/master.ttf',f'--unicodes-file={W}/u_{n}.txt','--flavor=woff2',f'--output-file={P}/fonts/obrush_{n}{VER}.woff2','--layout-features=kern'],check=True)
runs={n:[] for n in G}; prev=None
for c in cm:
    n=own[c]
    if prev and prev[0]==n: prev[2]=c
    else: prev=[n,c,c]; runs[n].append(prev)
fmt=lambda r:'U+%X'%r[1] if r[1]==r[2] else 'U+%X-%X'%(r[1],r[2])
def block(pre=''):
    return '/*OBF*/'+''.join("@font-face{font-family:'OBrush';src:url('%sfonts/obrush_%s%s.woff2') format('woff2');font-weight:400;font-display:block;unicode-range:%s}"%(pre,n,VER,','.join(fmt(x) for x in runs[n])) for n in ['c2','c1','s','b','a'])+'/*OBF*/'
BLK=block()
OLD=re.compile(r"/\*OBF\*/.*?/\*OBF\*/|@font-face\{font-family:'OBrush';src:url\('fonts/obrush\.woff2'\) format\('woff2'\);(?:font-weight:400;)?font-display:swap\}",re.S)
def need(pg):
    s=per.get(pg,set()); return [n for n in ['a','b','s','c1','c2'] if s&G[n]]
def pre_links(ns): return ''.join('<link rel="preload" href="fonts/obrush_%s%s.woff2" as="font" type="font/woff2" crossorigin>'%(n,VER) for n in ns)
LEG=re.compile(r"@font-face\{font-family:'OBrush';src:url\('fonts/obrush\.woff2'\) format\('woff2'\);(?:font-weight:400;)?font-display:swap\}")
PL=re.compile(r'<link rel="preload" href="fonts/obrush_[a-z0-9]+\.woff2" as="font" type="font/woff2" crossorigin>')
done=[]
for fp in sorted(glob.glob(P+'/*.html')):
    n=os.path.basename(fp)
    if n.startswith('_'): continue
    s=open(fp,encoding='utf-8').read(); o=s
    s=PL.sub('',s)
    vill='villain.css' in s and not OLD.search(s)
    if not OLD.search(s) and not vill: continue
    if OLD.search(s):
        s=OLD.sub(lambda m:BLK,s,count=1); a=s.find('/*OBF*/'); b=s.find('/*OBF*/',a+7)+7
        s=s[:b]+LEG.sub('',s[b:])
    ns=need(n) or (['a'] if 'salon' in n or n=='home_v2.html' else [])
    if n=='home_v2.html': ns=need('seoha-salon.html')
    if ns:
        L=pre_links(ns)
        if vill: s=re.sub(r'(<link[^>]*villain\.css[^>]*>)',lambda m:L+m.group(1),s,count=1)
        else:
            i=s.find('/*OBF*/'); j=s.rfind('<style',0,i)
            s=s[:j]+L+s[j:] if j>=0 else L+s
    if s!=o: open(fp,'w',encoding='utf-8').write(s); done.append((n,ns))
v=open(P+'/villain.css',encoding='utf-8').read(); v2=OLD.sub(lambda m:BLK,v,count=1)
if v2!=v: open(P+'/villain.css','w',encoding='utf-8').write(v2); done.append(('villain.css',[]))
for x in done: print(*x)
print(len(done),'files'); print({n:os.path.getsize(f'{P}/fonts/obrush_{n}{VER}.woff2') for n in G})
