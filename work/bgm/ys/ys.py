import numpy as np, wave
from numpy.fft import rfft,irfft
SR=44100; BPM=78; BEAT=60/BPM; BAR=3*BEAT; NB=24; L=BAR*NB; N=int(round(SR*L))
rng=np.random.default_rng(5); out=np.zeros((N,2))
def hz(n): return 440*2**((n-69)/12)
def pan(s,p): return np.stack([s*np.cos((p+1)*np.pi/4), s*np.sin((p+1)*np.pi/4)],1)
def addc(t0,x):
    i=int(t0*SR); idx=(i+np.arange(len(x)))%N; np.add.at(out,idx,x)
def pluck(t0,m,g,p,dur=2.6,bright=.5):
    f=hz(m); n=int(SR*dur); per=int(SR/f)
    buf=rng.uniform(-1,1,per); 
    # pre-filter for softness
    for _ in range(2): buf=.5*(buf+np.roll(buf,1))
    y=np.zeros(n); y[:per]=buf
    d=.996-(0.004*(m-50)/30)
    for i in range(per,n): y[i]=d*(.5*(y[i-per]+y[i-per-1])) if i-per-1>=0 else y[i-per]
    t=np.arange(n)/SR; y*=np.clip((dur-t)/.3,0,1)
    body=y+.15*np.sin(2*np.pi*f*t)*np.exp(-t/1.2)
    addc(t0,pan(body*g,p))
def mbox(t0,m,g,p):
    f=hz(m); n=int(SR*3); t=np.arange(n)/SR
    s=(np.sin(2*np.pi*f*t)+.35*np.sin(2*np.pi*f*3.01*t)*np.exp(-t/.25)+.12*np.sin(2*np.pi*f*5.43*t)*np.exp(-t/.12))*np.minimum(t/.002,1)*np.exp(-t/1.1)
    addc(t0,pan(s*g,p))
def pad(t0,ms,g,dur):
    n=int(SR*dur); t=np.arange(n)/SR; s=np.zeros(n)
    for m in ms:
        f=hz(m)
        for dt in (-.004,0,.004): s+=np.sin(2*np.pi*f*(1+dt)*t+rng.uniform(0,6))
    env=np.minimum(t/1.2,1)*np.clip((dur-t)/1.2,0,1)
    addc(t0,pan(s*env*g/len(ms),0))
# D  Bm  G  A | D  F#m  G  A  (3/4 waltz), 24 bars
P=[(50,[62,66,69]),(47,[59,62,66]),(43,[59,62,67]),(45,[61,64,69]),(50,[62,66,69]),(42,[61,66,69]),(43,[59,62,67]),(45,[61,64,69])]
for b in range(NB):
    root,ch=P[b%8]; t0=b*BAR
    pluck(t0,root-12+12,.20,-.1,dur=BAR*1.4)
    pluck(t0+BEAT,ch[0],.11,-.3); pluck(t0+BEAT+.02,ch[1],.10,.1); pluck(t0+BEAT+.04,ch[2],.09,.3)
    pluck(t0+2*BEAT,ch[0],.09,-.3); pluck(t0+2*BEAT+.02,ch[1],.085,.1); pluck(t0+2*BEAT+.04,ch[2],.08,.3)
    if b%2==0: pad(t0,[m-12 for m in ch]+ch,.035,BAR*2.2)
# music box melody bars 8-23
mel=[(8,0,78),(8,1,76),(8,2,74),(9,0,73),(9,2,74),(10,0,71),(10,1,74),(10,2,79),(11,0,76),
     (12,0,78),(12,1,81),(12,2,78),(13,0,76),(13,2,73),(14,0,74),(14,1,71),(14,2,74),(15,0,76),
     (16,0,81),(16,2,78),(17,0,78),(17,1,76),(17,2,73),(18,0,74),(18,2,79),(19,0,76),(19,1,73),
     (20,0,78),(20,1,76),(20,2,74),(21,0,73),(21,2,76),(22,0,74),(22,1,71),(22,2,69),(23,0,74)]
for b,bt,m in mel: mbox(b*BAR+bt*BEAT,m,.075,.25 if m%2 else -.2)
# birds-free room air
hs=rng.normal(0,1,N); F=rfft(hs); fr=np.fft.rfftfreq(N,1/SR); F*=np.exp(-((fr-3000)/2000)**2); hs=irfft(F,N); hs=hs/np.abs(hs).max()*.005
out+=pan(hs,0)
irn=int(SR*2.2); tt=np.arange(irn)/SR
def conv(x,ir):
    h=np.zeros(len(x)); h[:len(ir)]=ir; return irfft(rfft(x)*rfft(h),len(x))
wet=np.zeros_like(out)
for c in range(2):
    ir=rng.normal(0,1,irn)*np.exp(-tt/.55); ir[:int(.02*SR)]=0
    F=rfft(ir); fr=np.fft.rfftfreq(irn,1/SR); F*=1/(1+(fr/5000)**2); ir=irfft(F,irn)
    wet[:,c]=conv(out[:,c],ir/np.sqrt((ir**2).sum()))
mix=out*.8+wet*.35
for c in range(2):
    F=rfft(mix[:,c]); fr=np.fft.rfftfreq(N,1/SR); F*=1/np.sqrt(1+(fr/8000)**4); F*=np.where(fr<60,(fr/60)**2,1); mix[:,c]=irfft(F,N)
mix/=np.abs(mix).max(); mix*=.8
w=wave.open('ys.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes()); w.close()
print(round(L,1))
