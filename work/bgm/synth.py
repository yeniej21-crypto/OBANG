import numpy as np, wave
SR=44100; L=48.0; N=int(SR*L); TAIL=int(SR*8)
rng=np.random.default_rng(7)
t=np.arange(N)/SR
out=np.zeros((N,2))
def hz(n): return 440*2**((n-69)/12)
def hzq(n): f=hz(n); return round(f*L)/L   # integer cycles per loop
def pan(sig,p): return np.stack([sig*np.cos((p+1)*np.pi/4), sig*np.sin((p+1)*np.pi/4)],1)
# 1) drone: D2 A2 D3, periodic LFOs that divide the loop (seamless)
for m,a,p in [(38,.22,-.2),(45,.12,.2),(50,.09,0)]:
    f=hzq(m); lfo=1+.25*np.sin(2*np.pi*t*(2/L)+m)
    s=(np.sin(2*np.pi*f*t)+.35*np.sin(2*np.pi*2*f*t+.3)+.12*np.sin(2*np.pi*3*f*t))*a*lfo
    s+= .5*a*np.sin(2*np.pi*(f+1/L*2)*t)  # slow beating
    out+=pan(s,p)
# 2) pad swells on pentatonic chord tones, periods = L/k
for i,(m,k) in enumerate([(62,3),(64,2),(69,4),(72,3),(74,2)]):
    f=hzq(m); env=np.clip(np.sin(2*np.pi*t*k/L+i*1.7),0,1)**2
    s=(np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*(f+3/L)*t))*env*.035
    out+=pan(s,(-1)**i*.5)
def addc(i,x):
    idx=(i+np.arange(len(x)))%N; np.add.at(out,idx,x)
# 3) singing bowl strikes
def bowl(t0,f0,g,p):
    n=int(SR*9); tt=np.arange(n)/SR; s=np.zeros(n)
    for r,a,d in [(1,1,7),(2.76,.5,4.5),(5.40,.25,2.8),(8.93,.12,1.6)]:
        s+=a*np.exp(-tt/d)*(np.sin(2*np.pi*f0*r*tt)+np.sin(2*np.pi*f0*r*1.0025*tt))*.5
    s*=np.minimum(tt/0.004,1)*g; addc(int(t0*SR),pan(s,p))
for t0,f0,p in [(0.5,hz(62),-.3),(16.5,hz(57),.35),(32.5,hz(62),-.1)]: bowl(t0,f0,.09,p)
# 4) gayageum-like plucks (Karplus-Strong) with 농현 bend
def pluck(t0,m,g,p,bend=0):
    f=hz(m); n=int(SR*4); P=int(SR/f); buf=rng.uniform(-1,1,P); y=np.zeros(n)
    for i in range(n):
        y[i]=buf[i%P]; buf[i%P]=.5*(buf[i%P]+buf[(i+1)%P])*.996
    if bend:
        tt=np.arange(n)/SR; idx=np.cumsum(1+bend*np.clip(tt-.35,0,None)*np.sin(2*np.pi*5*tt)*.6)
        idx=np.clip(idx,0,n-1); y=np.interp(idx,np.arange(n),y)
    y=np.convolve(y,np.ones(6)/6,'same')*g; addc(int(t0*SR),pan(y,p))
notes=[(3,62,0),(4.2,69,.02),(7.5,67,0),(11,64,.02),(19,62,0),(20.1,67,0),(23.5,69,.03),(27,72,0),(35,64,0),(36.2,62,.02),(40,57,0),(43.5,62,.02)]
for k,(t0,m,b) in enumerate(notes): pluck(t0,m,.10,(-1)**k*.45,b)
# 5) soft air/noise bed
nz=rng.normal(0,1,(N,2)); 
from numpy.fft import rfft,irfft
for c in range(2):
    F=rfft(nz[:,c]); fr=np.fft.rfftfreq(len(nz),1/SR); F*=np.exp(-((fr-500)/400)**2); nz[:,c]=irfft(F,len(nz))
out+=nz/np.abs(nz).max()*.015
# 6) reverb: synthetic IR convolution
irn=int(SR*3.2); tt=np.arange(irn)/SR
def conv(x,ir):
    h=np.zeros(len(x)); h[:len(ir)]=ir; return irfft(rfft(x)*rfft(h),len(x))
wet=np.zeros_like(out)
for c in range(2):
    ir=rng.normal(0,1,irn)*np.exp(-tt/0.9); ir[:int(.02*SR)]=0; wet[:,c]=conv(out[:,c],ir/np.sqrt((ir**2).sum()))
mix=out*.7+wet*.6
# 7) wrap tail into head for seamless loop
loop=mix.copy()
loop/=np.abs(loop).max(); loop*=.8
pcm=(loop*32767).astype('<i2')
w=wave.open('bgm.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
print('ok')
