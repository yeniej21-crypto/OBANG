import sys, numpy as np
from PIL import Image, ImageFilter
def mask(depth_path,out):
    d=np.asarray(Image.open(depth_path).convert('L'),dtype=np.float32)/255.
    # Otsu
    h,_=np.histogram(d,bins=64,range=(0,1)); p=h/h.sum(); w=np.cumsum(p); mu=np.cumsum(p*np.arange(64)); mt=mu[-1]
    sb=(mt*w-mu)**2/(w*(1-w)+1e-9); t=(np.argmax(sb)+.5)/64
    a=np.clip((d-(t-.06))/.12,0,1)
    im=Image.fromarray((a*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    rgba=Image.new('RGBA',im.size,(255,255,255,0)); rgba.putalpha(im); rgba.save(out,optimize=True); return t
for a in sys.argv[1:]:
    s,o=a.split(':'); print(o, round(mask(s,o),3))
