import sys, numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter
S=ort.InferenceSession('/tmp/da.onnx',providers=['CPUExecutionProvider'])
def depth(src,dst,w=None,blur=2.0):
    im=Image.open(src).convert('RGB'); W,H=im.size
    x=np.asarray(im.resize((518,518),Image.BICUBIC),dtype=np.float32)/255.
    x=(x-[0.485,0.456,0.406])/[0.229,0.224,0.225]; x=x.transpose(2,0,1)[None].astype(np.float32)
    d=S.run(None,{'l_x_':x})[0][0]
    lo,hi=np.percentile(d,1),np.percentile(d,99.5); d=np.clip((d-lo)/(hi-lo+1e-6),0,1)
    ow=w or min(W,360); oh=round(H*ow/W)
    o=Image.fromarray((d*255).astype(np.uint8)).resize((ow,oh),Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))
    o.save(dst,quality=88); return o
if __name__=='__main__':
    for a in sys.argv[1:]:
        s,d=a.split(':'); depth(s,d); print('ok',d)
