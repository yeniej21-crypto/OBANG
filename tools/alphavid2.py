import sys, subprocess, numpy as np, os, time
from PIL import Image, ImageFilter
from rembg import remove, new_session
s=new_session('isnet-general-use')
W=480
def frames(src):
    p=subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',src],capture_output=True,text=True).stdout.strip().split(',')
    w,h=int(p[0]),int(p[1]); H=int(round(h*W/w/2))*2
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',src,'-vf',f'scale={W}:{H}','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    n=len(raw)//(W*H*3); return [np.frombuffer(raw[i*W*H*3:(i+1)*W*H*3],np.uint8).reshape(H,W,3) for i in range(n)],H
for job in sys.argv[1:]:
    src,out=job.split(':'); t0=time.time()
    fr,H=frames(src); n=len(fr); M=[None]*n
    for i in range(0,n,2):
        m=remove(Image.fromarray(fr[i]),session=s,only_mask=True).filter(ImageFilter.GaussianBlur(.7)); M[i]=np.asarray(m,np.float32)
    if M[n-1] is None: M[n-1]=M[n-2]
    for i in range(1,n-1,2):
        if M[i] is None: M[i]=(M[i-1]+M[i+1])/2
    # 시간 방향으로 살짝 부드럽게(깜빡임 줄이기)
    S=[(M[max(0,i-1)]*.25+M[i]*.5+M[min(n-1,i+1)]*.25) for i in range(n)]
    ff=subprocess.Popen(['ffmpeg','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H*2}','-r','24','-i','-','-i',src,'-map','0:v','-map','1:a?','-c:v','libx264','-profile:v','main','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-shortest','-movflags','+faststart',out],stdin=subprocess.PIPE)
    for i in range(n):
        a=np.clip(S[i],0,255).astype(np.uint8); st=np.vstack([fr[i],np.repeat(a[:,:,None],3,2)]); ff.stdin.write(st.tobytes())
    ff.stdin.close(); ff.wait(); print(out,n,'frames',round(time.time()-t0),'s',flush=True)
