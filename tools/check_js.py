# 배포 전 검사: 모든 페이지 인라인 스크립트와 공통 js의 문법 오류를 찾는다. 하나라도 있으면 배포 중단.
import re,subprocess,glob,os,sys,tempfile
P=os.path.join(os.path.dirname(os.path.abspath(__file__)),'proto'); bad=[]
tmp=os.path.join(tempfile.gettempdir(),'_obchk.js')
def chk(code,label):
    open(tmp,'w').write(code)
    r=subprocess.run(['node','-e',"new Function(require('fs').readFileSync(process.argv[1],'utf8'))",tmp],capture_output=True,text=True)
    if r.returncode: bad.append(label+' : '+r.stderr.strip().split('\n')[-1][:160])
for f in sorted(glob.glob(P+'/*.html')):
    n=os.path.basename(f)
    if n.startswith('_'): continue
    for i,m in enumerate(re.finditer(r'<script>(.*?)</script>',open(f).read(),re.S)): chk(m.group(1),f'{n} #{i}')
for f in sorted(glob.glob(P+'/*.js')): chk(open(f).read(),os.path.basename(f))
if bad: print('스크립트 오류:'); print('\n'.join(bad)); sys.exit(1)
print('스크립트 검사 통과')
