# 배포용 사이트 폴더: proto를 그대로 평평하게(아티팩트와 같은 경로) + index.html = 서하 홈
import os, shutil, glob
SP=os.path.dirname(os.path.abspath(__file__)); P=SP+'/proto'; O=SP+'/export/site'
shutil.rmtree(O,ignore_errors=True); os.makedirs(O)
PRE='<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
SKIP={'seoha-salon.html','peach_src.html'}
for f in glob.glob(P+'/*.html'):
    n=os.path.basename(f)
    if n.startswith('_') or n in SKIP: continue
    s=open(f,encoding='utf-8').read()
    if not s.lstrip().lower().startswith('<!doctype'): s=PRE+s
    open(O+'/'+n,'w',encoding='utf-8').write(s)
open(O+'/index.html','w',encoding='utf-8').write(PRE+open(P+'/seoha-salon.html',encoding='utf-8').read())
for f in glob.glob(P+'/*.js')+glob.glob(P+'/*.css'): shutil.copy(f,O)
for d in ['img','v','a','fonts']:
    shutil.copytree(P+'/'+d,O+'/'+d,ignore=shutil.ignore_patterns('stk_*','*_case.jpg'))
# 가볍게 다시 인코딩한 영상이 있으면 그걸로(compress_v.py)
C=SP+'/export/vcache'
for f in glob.glob(C+'/v/**/*.mp4',recursive=True):
    rel=os.path.relpath(f,C)
    if os.path.exists(P+'/'+rel) and os.path.getmtime(f)>=os.path.getmtime(P+'/'+rel): shutil.copy(f,O+'/'+rel)
# 쓰지 않는 원본(도장 jpg)은 빼기
for f in glob.glob(O+'/img/stamp/*.jpg'): os.remove(f)
open(O+'/_headers','w').write('/*\n  X-Frame-Options: SAMEORIGIN\n/v/*\n  Cache-Control: public, max-age=604800\n/img/*\n  Cache-Control: public, max-age=604800\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n')
open(O+'/README.md','w',encoding='utf-8').write('# 오방사주 체험판\n\n정적 사이트(빌드 없음). 넷리파이: 빌드 명령 비움, 공개 폴더 `/`.\n시작 화면은 index.html(서하 체험판).\n')
print('ok')
