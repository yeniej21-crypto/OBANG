import numpy as np, wave
from numpy.fft import rfft,irfft
SR=44100; BPM=70; BEAT=60/BPM; BAR=4*BEAT; NB=16; L=BAR*NB; N=int(round(SR*L))
rng=np.random.default_rng(11); out=np.zeros((N,2))
def hz(n): return 440*2**((n-69)/12)
def pan(s,p): return np.stack([s*np.cos((p+1)*np.pi/4), s*np.sin((p+1)*np.pi/4)],1)
def addc(t0,x):
    i=int(t0*SR); idx=(i+np.arange(len(x)))%N; np.add.at(out,idx,x)
def rhodes(t0,m,g,p,dur=3.2):
    f=hz(m); n=int(SR*dur); t=np.arange(n)/SR
    body=(np.sin(2*np.pi*f*t)+.28*np.sin(2*np.pi*2*f*t)*np.exp(-t/.6)+.08*np.sin(2*np.pi*3*f*t)*np.exp(-t/.3))
    tine=.18*np.sin(2*np.pi*f*7.02*t)*np.exp(-t/.08)
    env=np.minimum(t/.006,1)*np.exp(-t/1.6)*np.clip((dur-t)/.3,0,1)
    trem=1+.12*np.sin(2*np.pi*4.2*t)
    addc(t0,pan((body+tine)*env*trem*g,p))
def celesta(t0,m,g,p):
    f=hz(m); n=int(SR*2.5); t=np.arange(n)/SR
    s=(np.sin(2*np.pi*f*t)+.25*np.sin(2*np.pi*4*f*t)*np.exp(-t/.15)+.1*np.sin(2*np.pi*2*f*t))*np.minimum(t/.003,1)*np.exp(-t/.7)
    addc(t0,pan(s*g,p))
def bass(t0,m,g,dur):
    f=hz(m); n=int(SR*dur); t=np.arange(n)/SR
    s=(np.sin(2*np.pi*f*t)+.2*np.sin(2*np.pi*2*f*t))*np.minimum(t/.02,1)*np.exp(-t/2.2)*np.clip((dur-t)/.2,0,1)
    addc(t0,pan(s*g,0))
# Fmaj7 Em7 Dm9 Cmaj9  (x4)
CH=[(41,[57,60,64,65]),(40,[55,59,62,64]),(38,[57,60,64,65,62]),(36,[55,59,62,64])]
CH=[(41,[53,57,60,64]),(40,[52,55,59,62]),(38,[53,57,60,64]),(36,[52,55,59,62])]
for b in range(NB):
    root,ch=CH[b%4]; t0=b*BAR
    bass(t0,root,.16,BAR*.95)
    for k,m in enumerate(ch): rhodes(t0+k*.018,m,.055,(-.35,.35,-.15,.15)[k])
    for k,m in enumerate(ch[1:]): rhodes(t0+2.5*BEAT+k*.015,m,.032,(.3,-.3,0)[k],dur=2.2)
# sparse celesta melody (bars 4-15), pentatonic-ish
mel=[(4,0,76),(4,1.5,74),(4,3,72),(5,0,71),(5,2,72),(6,0,69),(6,1.5,72),(6,3,74),(7,0,72),
     (8,0,76),(8,1,77),(8,2,76),(8,3.5,74),(9,0,71),(9,2,74),(10,0,72),(10,2,69),(11,0,67),(11,1.5,71),(11,3,72),
     (12,0,76),(12,2,79),(13,0,77),(13,2,76),(14,0,74),(14,1.5,72),(15,0,71),(15,2,72)]
for b,bt,m in mel: celesta(b*BAR+bt*BEAT,m,.05,.25 if m%2 else -.25)
# soft shaker on off-beats
for b in range(NB):
    for q in range(8):
        if q%2==1:
            n=int(SR*.09); t=np.arange(n)/SR; s=rng.normal(0,1,n)*np.exp(-t/.025)
            s=np.diff(np.concatenate([[0],s]))  # brighten
            addc(b*BAR+q*BEAT/2+rng.normal(0,.006),pan(s*.006*(1.2 if q in(3,7) else .8),.3))
# vinyl crackle + room hiss
cr=np.zeros(N); pos=rng.integers(0,N,int(L*9)); cr[pos]=rng.normal(0,1,len(pos))*.05
cr=np.convolve(cr,np.exp(-np.arange(40)/6),'same')
hs=rng.normal(0,1,N); F=rfft(hs); fr=np.fft.rfftfreq(N,1/SR); F*=np.exp(-((fr-2500)/1800)**2); hs=irfft(F,N); hs=hs/np.abs(hs).max()*.008
out+=pan(cr+hs,0)
# circular reverb
irn=int(SR*2.6); tt=np.arange(irn)/SR
def conv(x,ir):
    h=np.zeros(len(x)); h[:len(ir)]=ir; return irfft(rfft(x)*rfft(h),len(x))
wet=np.zeros_like(out)
for c in range(2):
    ir=rng.normal(0,1,irn)*np.exp(-tt/.7); ir[:int(.025*SR)]=0
    F=rfft(ir); fr=np.fft.rfftfreq(irn,1/SR); F*=1/(1+(fr/4500)**2); ir=irfft(F,irn)
    wet[:,c]=conv(out[:,c],ir/np.sqrt((ir**2).sum()))
mix=out*.75+wet*.45
# gentle lowpass warmth
for c in range(2):
    F=rfft(mix[:,c]); fr=np.fft.rfftfreq(N,1/SR); F*=1/np.sqrt(1+(fr/7000)**4); mix[:,c]=irfft(F,N)
mix/=np.abs(mix).max(); mix*=.85
w=wave.open('taeo.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes()); w.close()
print(L)
