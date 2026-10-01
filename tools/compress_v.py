# 배포용 영상 가볍게: export/vcache/<같은 경로>에 crf29로 다시 인코딩(원본 proto는 그대로). 이미 최신이면 건너뜀.
import os, sys, glob, subprocess
SP=os.path.dirname(os.path.abspath(__file__)); P=SP+'/proto'; C=SP+'/export/vcache'
pats=sys.argv[1:] or ['v/**/*.mp4']
fs=sorted({f for pat in pats for f in glob.glob(P+'/'+pat,recursive=True)})
for f in fs:
    rel=os.path.relpath(f,P)
    if rel.startswith('v/pop/') or os.path.getsize(f)<300_000: continue
    o=C+'/'+rel
    if os.path.exists(o) and os.path.getmtime(o)>=os.path.getmtime(f): continue
    os.makedirs(os.path.dirname(o),exist_ok=True)
    r=subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f,'-c:v','libx264','-preset','slow','-crf','29','-profile:v','main','-pix_fmt','yuv420p','-g','48','-movflags','+faststart','-c:a','aac','-b:a','80k',o+'.tmp.mp4'])
    if r.returncode==0 and os.path.getsize(o+'.tmp.mp4')<os.path.getsize(f): os.replace(o+'.tmp.mp4',o)
    else:
        if os.path.exists(o+'.tmp.mp4'): os.remove(o+'.tmp.mp4')
        import shutil; shutil.copy(f,o)
    print(rel,os.path.getsize(f)//1024,'->',os.path.getsize(o)//1024,'KB',flush=True)
