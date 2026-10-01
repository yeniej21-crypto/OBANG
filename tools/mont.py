import sys,glob
from PIL import Image
out=sys.argv[1]; fs=sys.argv[2:]
ims=[Image.open(f) for f in fs]; w=ims[0].width; h=ims[0].height
o=Image.new('RGB',(w*len(ims),h),'white')
for i,im in enumerate(ims): o.paste(im,(i*w,0))
o.save(out)
