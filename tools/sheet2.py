import sys
from PIL import Image
out=sys.argv[1]; fs=sys.argv[2:]; W=400
ims=[Image.open(f).convert('RGB') for f in fs]
ims=[i.resize((W,int(i.height*W/i.width))) for i in ims]
H=max(i.height for i in ims)
s=Image.new('RGB',(W*len(ims)+8*(len(ims)-1),H),'white')
x=0
for i in ims: s.paste(i,(x,0)); x+=W+8
s.save(out)
