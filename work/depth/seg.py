import sys, numpy as np, onnxruntime as ort
from PIL import Image, ImageFilter
S=ort.InferenceSession('/tmp/isnet-anime.onnx',providers=['CPUExecutionProvider'])
def seg(src,out,w=256):
    im=Image.open(src).convert('RGB'); W,H=im.size
    x=np.asarray(im.resize((1024,1024),Image.BILINEAR),dtype=np.float32)/255.
    x=(x-.5)/1.0; x=x.transpose(2,0,1)[None].astype(np.float32)
    m=S.run(None,{'img':x})[0][0,0]; m=(m-m.min())/(m.max()-m.min()+1e-6)
    oh=round(H*w/W); a=Image.fromarray((m*255).astype(np.uint8)).resize((w,oh),Image.BILINEAR).filter(ImageFilter.GaussianBlur(.8))
    rgba=Image.new('RGBA',a.size,(255,255,255,0)); rgba.putalpha(a); rgba.save(out,optimize=True)
if __name__=='__main__':
    for a in sys.argv[1:]:
        s,o=a.split(':'); seg(s,o); print('ok',o)
