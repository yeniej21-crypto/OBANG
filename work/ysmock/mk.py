from PIL import Image, ImageDraw, ImageFilter
import math, random
def grad(w,h,c1,c2):
    im=Image.new('RGB',(w,h)); d=ImageDraw.Draw(im)
    for y in range(h):
        t=y/h; d.line([(0,y),(w,y)],fill=tuple(int(c1[i]+(c2[i]-c1[i])*t) for i in range(3)))
    return im
def scene(name,c1,c2,fig=True,extra=None):
    im=grad(720,1280,c1,c2); d=ImageDraw.Draw(im)
    # sunlight wedge
    ov=Image.new('RGBA',im.size,(0,0,0,0)); od=ImageDraw.Draw(ov); od.polygon([(0,0),(420,0),(720,900),(300,1280),(0,1280)],fill=(255,236,190,60)); im.paste(ov,(0,0),ov)
    if fig:
        d.ellipse([290,330,430,470],fill=(236,200,160)); d.rectangle([260,470,460,980],fill=(122,150,118))
    if extra: extra(d)
    d.text((20,20),name,fill=(60,40,20))
    im.save(name+'.webp',quality=80); return im
scene('exterior',(238,214,170),(200,160,110),fig=True,extra=lambda d:(d.rectangle([140,200,580,1180],outline=(120,80,50),width=14)))
scene('hero',(250,222,170),(214,170,120),extra=lambda d:d.rectangle([330,560,470,650],fill=(250,244,230),outline=(150,40,30),width=4))
scene('counter',(240,220,190),(190,150,110),extra=lambda d:d.rectangle([0,880,720,1280],fill=(150,110,70)))
def drw(d):
    for r in range(4):
        for c in range(3):
            x=80+c*190; y=180+r*240; d.rectangle([x,y,x+170,y+210],fill=(196,158,110),outline=(110,80,50),width=6)
    d.rectangle([270,660,440,870],fill=(255,232,180))
scene('drawers',(230,210,180),(200,170,130),fig=False,extra=drw)
scene('envelope',(246,232,206),(220,196,160),fig=False,extra=lambda d:(d.rectangle([110,440,610,800],fill=(250,244,230),outline=(180,160,130),width=3),d.ellipse([310,570,410,670],fill=(180,40,30))))
scene('folded',(240,226,200),(214,190,150),fig=False,extra=lambda d:(d.rectangle([80,300,420,700],fill=(250,244,230)),d.rectangle([380,560,660,1000],fill=(252,248,238))))
scene('ending',(250,200,150),(220,150,110))
# paper
P=Image.new('RGB',(1080,1910),(246,238,222)); d=ImageDraw.Draw(P)
for i in range(2): d.rectangle([60+i*18,60+i*18,1020-i*18,1850-i*18],outline=(140,165,130),width=6)
for k in range(40):
    x=random.randint(60,1020); d.ellipse([x-12,50,x+12,74],fill=(140,165,130)); d.ellipse([x-12,1836,x+12,1860],fill=(140,165,130))
d.ellipse([515,110,565,160],fill=(120,150,110)); d.ellipse([820,1600,940,1720],fill=(220,150,160))
P.save('paper.webp',quality=82)
# stamps 1600x1500
cols=[(120,150,110),(220,140,160),(230,190,80),(240,170,190),(200,90,110),(110,140,200),(220,140,170),(90,110,190),(220,120,160),(220,120,60),(190,170,120),(150,160,180)]
St=Image.new('RGB',(1600,1500),(244,236,220)); d=ImageDraw.Draw(St)
for i in range(12):
    c=i%4; r=i//4; x=c*400; y=r*500
    d.rectangle([x+50,y+50,x+350,y+450],fill=(252,248,240))
    d.rectangle([x+80,y+80,x+320,y+420],fill=cols[i])
    d.text((x+90,y+90),str(i+1),fill=(255,255,255))
St.save('stamps.webp',quality=85)
Se=Image.new('RGB',(1800,360),(244,236,220)); d=ImageDraw.Draw(Se)
for i in range(5):
    x=i*360; d.ellipse([x+40,40,x+320,320],fill=(178,42,32)); d.ellipse([x+90,90,x+270,270],outline=(120,20,14),width=8); d.text((x+170,170),str(i),fill=(255,220,210))
Se.save('seals.webp',quality=85)
