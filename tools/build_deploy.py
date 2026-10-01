# 넷리파이 배포 빌드: 본편(서하/이안, deploy_c 압축본 기반) + 추가 폴더 plus/(타로·사주가 그린 나·오프닝 원테이크·깊이 지도)
import os, re, shutil, glob, subprocess
SP=os.path.dirname(os.path.abspath(__file__)); P=SP+'/proto'; B=SP+'/export/deploy_p'
shutil.rmtree(B,ignore_errors=True); os.makedirs(B)
PRE='<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
def rd(p): return open(p,encoding='utf-8').read()
def wr(p,s):
    os.makedirs(os.path.dirname(p),exist_ok=True); open(p,'w',encoding='utf-8').write(s)
def rep(s,a,b,n=None):
    c=s.count(a); assert c>=1 and (n is None or c==n),(a[:70],c); return s.replace(a,b)

# ---- 공용 JS (배포판) ----
mi=rd(P+'/menuintro.js')
mi=rep(mi,"'tarot.html':{src:'v/tarot/intro.mp4',poster:'img/tarot/mujin.jpg'","'plus/tarot/index.html':{src:'plus/tarot/v/tarot/intro.mp4',poster:'plus/tarot/img/tarot/mujin.jpg'",1)
d3=rd(P+'/depth3d.js')
d3=rep(d3,"  const dsrc=src=>src.replace(/\\.(jpg|jpeg|png)(\\?.*)?$/i,'_d.jpg');",
"""  /* 배포판: 본편 img/의 깊이 지도는 plus/d/ 에 있다 (plus 폴더가 없으면 깊이 효과만 빠지고 그림은 그대로) */
  const dsrc=src=>{ try{ const a=new URL(src,location.href); if(!a.pathname.includes('/plus/')){ const m=a.pathname.match(/^(.*?)\\/img\\/(.+)\\.(jpg|jpeg|png)$/i); if(m) return a.origin+m[1]+'/plus/d/'+m[2]+'_d.jpg'; } }catch(e){} return src.replace(/\\.(jpg|jpeg|png)(\\?.*)?$/i,'_d.jpg'); };""",1)

# ---- 본편 ----
for demo,src in [('seoha-demo','seoha-salon.html'),('ian-demo','ian-salon.html')]:
    d=f'{B}/{demo}'; shutil.copytree(f'{SP}/export/deploy_c/{demo}',d)
    h=rd(f'{P}/{src}')
    h=rep(h,'tarot.html','plus/tarot/index.html'); h=rep(h,"url('img/tarot/","url('plus/tarot/img/tarot/")
    h=rep(h,'avatar.html','plus/avatar/index.html')
    h=rep(h,'img/avatar/','plus/avatar/img/avatar/')
    h=rep(h,'v/poster/','plus/poster/'); h=rep(h,'`img/free/${','`plus/free/${',1)
    h=rep(h,'`url("img/mini/${','`url("plus/mini/${',1); h=rep(h,"url('img/card/","url('plus/card/"); h=rep(h,"url('img/stamp/","url('plus/stamp/"); h=rep(h,"url('img/cat/","url('plus/cat/"); h=rep(h,"v.src='v/cat/","v.src='plus/cat/",1); h=rep(h,"url('img/mini/","url('plus/mini/")
    h=rep(h,'src="v/op_take.mp4"','src="plus/op/op_take.mp4"',1)
    h=rep(h,"background:url('img/op_take_end.jpg') center 55%/cover no-repeat;","background:url('plus/op/op_take_end.jpg') center 55%/cover no-repeat,url('img/intro0.jpg') center 40%/cover no-repeat;",1)
    h=rep(h,"{src:'img/op_take_end.jpg',","{src:'plus/op/op_take_end.jpg',",1)
    wr(f'{d}/index.html',PRE+h)
    wr(f'{d}/menuintro.js',mi); wr(f'{d}/depth3d.js',d3)
    for j in ['archive.js','reveal.js']: shutil.copy(f'{P}/{j}',f'{d}/{j}')
    for f in ['today','career','taegil','gunghap','dohwa','peach','sinnyeon','chat','lifetime','free','obgh','ppopgi','bujeok','dangbeon','myodang','book']:
        shutil.copy(f'{P}/{f}.html',f'{d}/{f}.html')
    pp=rd(f'{d}/ppopgi.html'); pp=pp.replace('img/mini/','plus/mini/'); wr(f'{d}/ppopgi.html',pp)
    bj=rd(f'{d}/bujeok.html'); bj=bj.replace('img/card/','plus/card/').replace('img/mini/','plus/mini/'); wr(f'{d}/bujeok.html',bj)
    db=rd(f'{d}/dangbeon.html'); db=db.replace('img/card/','plus/card/').replace('img/mini/','plus/mini/').replace('img/stamp/','plus/stamp/'); wr(f'{d}/dangbeon.html',db)
    my=rd(f'{d}/myodang.html'); my=my.replace('`img/cat/${k}.jpg`','`plus/cat/${k}.jpg`').replace('`v/cat/${k}.mp4`','`plus/cat/${k}.mp4`'); wr(f'{d}/myodang.html',my)
    bo=rd(f'{d}/book.html')
    for x,y in [("'v/op_take.mp4'","'plus/op/op_take.mp4'"),("'img/op_take_end.jpg'","'plus/op/op_take_end.jpg'"),("'img/cat/madam.jpg'","'plus/cat/madam.jpg'"),("'v/cat/madam.mp4'","'plus/cat/madam.mp4'"),("url('img/mini/","url('plus/mini/"),("'img/tarot/mujin.jpg'","'plus/tarot/img/tarot/mujin.jpg'"),('img/pop/','plus/pop/'),('v/pop/','plus/pop/v/'),("'img/op_take_end.jpg'","'plus/op/op_take_end.jpg'")]: bo=bo.replace(x,y)
    wr(f'{d}/book.html',bo)
    fr=rd(f'{d}/free.html'); fr=rep(fr,"go:'avatar.html'","go:'plus/avatar/index.html'",1); fr=rep(fr,"img:'img/avatar/","img:'plus/avatar/img/avatar/",1); wr(f'{d}/free.html',fr)

# ---- plus/ ----
X=f'{B}/plus'
# 타로
T=X+'/tarot'; shutil.copytree(P+'/img/tarot',T+'/img/tarot'); shutil.copytree(P+'/v/tarot',T+'/v/tarot')
for f in ['tarot_data.js','tarot_read.js']: shutil.copy(f'{P}/{f}',f'{T}/{f}')
t=rd(P+'/tarot.html')
for a,b in [('href="img/brand/','href="../../img/brand/'),("url('fonts/","url('../../fonts/"),('<script src="saju.js">','<script src="../../saju.js">'),('<script src="menuintro.js">','<script src="../../menuintro.js">'),('<script src="depth3d.js">','<script src="../../depth3d.js">'),('<script src="archive.js">','<script src="../../archive.js">'),("else location.href='./';","else location.href='../../';")]:
    t=rep(t,a,b)
wr(T+'/index.html',t)
# 사주가 그린 나
A=X+'/avatar'; os.makedirs(A+'/img',exist_ok=True); shutil.copytree(P+'/img/avatar',A+'/img/avatar'); shutil.copytree(P+'/v/avatar',A+'/v/avatar')
a=rd(P+'/avatar.html')
for x,y in [('href="img/brand/','href="../../img/brand/'),("url('fonts/","url('../../fonts/"),('<script src="saju.js">','<script src="../../saju.js">'),('<script src="depth3d.js">','<script src="../../depth3d.js">'),('<script src="archive.js">','<script src="../../archive.js">'),
            ("else location.href='./';","else location.href='../../';"),("url('img/intro0.jpg')","url('../../img/intro0.jpg')"),("const FALLBACK={f:'img/seoha.jpg',m:'img/ian.jpg'};","const FALLBACK={f:'../../img/seoha.jpg',m:'../../img/ian.jpg'};"),
            ("$('duoG').style.backgroundImage=`url('img/${K[lw]}.jpg')`;","$('duoG').style.backgroundImage=`url('../../img/${K[lw]}.jpg')`;")]:
    a=rep(a,x,y)
wr(A+'/index.html',a)
# 오프닝 원테이크
O=X+'/op'; os.makedirs(O)
for f in ['v/op_take.mp4','img/op_take_end.jpg','img/op_take_end_d.jpg']: shutil.copy(f'{P}/{f}',O+'/'+os.path.basename(f))
# 움직이는 포스터 · 무료 카드 소품 그림
shutil.copytree(P+'/v/poster',X+'/poster'); shutil.copytree(P+'/img/free',X+'/free')
shutil.copytree(P+'/img/mini',X+'/mini'); shutil.copytree(P+'/img/card',X+'/card',ignore=shutil.ignore_patterns('stk_*')); shutil.copytree(P+'/img/stamp',X+'/stamp',ignore=shutil.ignore_patterns('*.jpg')); shutil.copytree(P+'/img/cat',X+'/cat'); shutil.copytree(P+'/img/pop',X+'/pop'); os.makedirs(X+'/pop/v',exist_ok=True); [shutil.copy(f,X+'/pop/v/') for f in glob.glob(P+'/v/pop/*.mp4')] [shutil.copy(f,X+'/cat/') for f in glob.glob(P+'/v/cat/*.mp4')]
# 본편 그림 깊이 지도
for f in glob.glob(P+'/img/*_d.jpg')+glob.glob(P+'/img/taeo/*_d.jpg'):
    rel=os.path.relpath(f,P+'/img');
    if rel.startswith('op_take') or rel.startswith('shrine'): continue
    dst=X+'/d/'+rel; os.makedirs(os.path.dirname(dst),exist_ok=True); shutil.copy(f,dst)
print('built')
