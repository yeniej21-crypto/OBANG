import sys
from PIL import Image
pre=sys.argv[1]; n=int(sys.argv[2]); out=sys.argv[3]
ims=[Image.open(f'{pre}{i}.png') for i in range(n)]
w=sum(i.width for i in ims)//2; h=ims[0].height//2
o=Image.new('RGB',(w,h)); x=0
for i in ims: o.paste(i.resize((i.width//2,i.height//2)),(x,0)); x+=i.width//2
o.save(out)
