from PIL import Image; import numpy as np, glob, os
os.makedirs('cards/out',exist_ok=True)
res={}
for f in sorted(glob.glob('cards/raw/*.jpg')):
  n=os.path.basename(f)[:-4]; el=n.split('_')[0]
  C=Image.open(f).convert('RGB'); T=Image.open(f'proto/img/card/{el}.jpg').convert('L')
  best=None
  for sc in [0.97,0.985,1.0,1.015,1.03]:
    tw,th=round(648*sc),round(1046*sc); t=np.asarray(T.resize((tw//2,th//2))).astype(float)
    G=np.asarray(C.convert('L').resize((440,584))).astype(float)
    for y in range(10,50):
      for x in range(35,80):
        if y+t.shape[0]>G.shape[0] or x+t.shape[1]>G.shape[1]: continue
        d=np.abs(G[y:y+t.shape[0],x:x+t.shape[1]]-t).mean()
        if best is None or d<best[0]: best=(d,x*2,y*2,tw,th,sc)
  d,x,y,tw,th,sc=best
  # refine at full res +-2
  Gf=np.asarray(C.convert('L')).astype(float); tf=np.asarray(T.resize((tw,th))).astype(float); b2=None
  for yy in range(y-3,y+4):
    for xx in range(x-3,x+4):
      if yy<0 or xx<0 or yy+th>Gf.shape[0] or xx+tw>Gf.shape[1]: continue
      dd=np.abs(Gf[yy:yy+th:3,xx:xx+tw:3]-tf[::3,::3]).mean()
      if b2 is None or dd<b2[0]: b2=(dd,xx,yy)
  dd,x,y=b2
  C.crop((x,y,x+tw,y+th)).resize((648,1046),Image.LANCZOS).save(f'cards/out/{n}.jpg',quality=88)
  res[n]=(round(dd,1),x,y,sc); print(n,res[n])
