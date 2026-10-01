from PIL import Image
import numpy as np
from scipy import ndimage
names=['joy','cheer','sleepy','pout']
for el in ['wood','fire','earth','metal','water']:
    im=Image.open(f'_sz/img/card/stamp_{el}.jpg').convert('RGB'); a=np.asarray(im).astype(int)
    bg=np.median(a[:8,:,:].reshape(-1,3),axis=0)
    d=np.abs(a-bg).sum(2)>60
    d=ndimage.binary_closing(d,iterations=6)
    lab,n=ndimage.label(d)
    objs=ndimage.find_objects(lab)
    boxes=[]
    for i,s in enumerate(objs):
        h=s[0].stop-s[0].start; w=s[1].stop-s[1].start
        if h>150 and w>150: boxes.append((s[0].start,s[1].start,s[0].stop,s[1].stop))
    boxes.sort(key=lambda b:(b[0]//300,b[1]))
    print(el,len(boxes),boxes)
    # quadrant order from earlier split: TL,TR,BL,BR -> need mapping of existing names
    for b in boxes:
        y0,x0,y1,x1=b; cy=(y0+y1)/2; cx=(x0+x1)/2
        q=(0 if cy<500 else 2)+(0 if cx<500 else 1)
        side=max(y1-y0,x1-x0)+36
        X=int(cx-side/2); Y=int(cy-side/2)
        c=Image.new('RGB',(side,side),tuple(int(v) for v in bg)); c.paste(im.crop((max(X,0),max(Y,0),min(X+side,1000),min(Y+side,1000))),(max(-X,0),max(-Y,0)))
        # mask other blobs out: paste bg where label not this blob
        c.resize((360,360),Image.LANCZOS).save(f'_stk_{el}_q{q}.jpg',quality=90)
