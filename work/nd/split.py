import sys
from PIL import Image
f=sys.argv[1]; pre=sys.argv[2]; im=Image.open(f); H=im.size[1]; step=1500
for i in range((H+step-1)//step): im.crop((0,i*step,im.size[0],min(H,(i+1)*step))).save(f'{pre}{i}.png')
print((H+step-1)//step)
