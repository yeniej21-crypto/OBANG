import numpy as np, wave
from numpy.fft import rfft, irfft, rfftfreq
SR=44100; D=6.04; N=int(SR*D); rng=np.random.default_rng(11)
t=np.arange(N)/SR; out=np.zeros((N,2))
def pan(x,p): return np.stack([x*np.cos((p+1)*np.pi/4), x*np.sin((p+1)*np.pi/4)],1)
def bandnoise(n,lo,hi,seed):
    r=np.random.default_rng(seed); x=r.normal(0,1,n); F=rfft(x); f=rfftfreq(n,1/SR)
    F*=((f>lo)&(f<hi)); y=irfft(F,n); return y/np.abs(y).max()
def place(x,t0):
    i=int(t0*SR); n=min(len(x),N-i); out[i:i+n]+=x[:n]
# 1) wind: two band-noise layers, swelling to the silk passage, stereo drift
w1=bandnoise(N,150,900,1); w2=bandnoise(N,500,2600,2)
env=np.interp(t,[0,0.3,1.5,2.8,3.9,4.4,6.04],[0,.35,.55,.95,1,.45,.18])
gust=1+.25*np.sin(2*np.pi*.7*t)+.15*np.sin(2*np.pi*1.9*t+1)
wind=(w1*.8+w2*.35*np.interp(t,[0,2,3.6,4.2,6.04],[.2,.6,1,.3,.1]))*env*gust*.32
out+=np.stack([wind*(1+.3*np.sin(2*np.pi*.4*t)),wind*(1-.3*np.sin(2*np.pi*.4*t))],1)
# 2) shaman bells (mudang bangul): clusters of small brass bells, three shakes getting stronger
def bell(f,g,dec):
    n=int(SR*1.6); tt=np.arange(n)/SR; x=np.zeros(n)
    for r,a,d in [(1,1,dec),(2.32,.55,dec*.7),(4.25,.3,dec*.45),(6.63,.18,dec*.3)]:
        x+=a*np.exp(-tt/d)*np.sin(2*np.pi*f*r*tt+rng.uniform(0,6))
    return x*np.minimum(tt/0.0015,1)*g
def shake(t0,strength,count,p):
    for k in range(count):
        dt=rng.uniform(0,.22)+ (0.11 if rng.random()<.5 else 0)   # two-stroke shake
        f=rng.uniform(1900,3600); x=bell(f,strength*rng.uniform(.5,1),rng.uniform(.25,.6))
        place(pan(x,np.clip(p+rng.uniform(-.5,.5),-1,1)),t0+dt)
shake(0.55,.10,9,-.3); shake(1.75,.16,12,.3); shake(2.95,.22,16,0); shake(3.25,.16,10,-.2)
# 3) silk whoosh through the lens 3.3-4.1 (band-sweeping noise)
n=int(SR*1.0); tt=np.arange(n)/SR; x=np.random.default_rng(5).normal(0,1,n)
F=rfft(x); f=rfftfreq(n,1/SR); F*=np.exp(-((f-1400)/1100)**2); x=irfft(F,n)
x=x/np.abs(x).max()*np.sin(np.pi*np.clip(tt/1.0,0,1))**2*.55
place(np.stack([x*np.linspace(1,.2,n),x*np.linspace(.2,1,n)],1),3.2)
# 4) riser into the entrance 3.0-4.0 (rising filtered tone + noise)
n=int(SR*1.0); tt=np.arange(n)/SR; fr=80+220*(tt/1.0)**2
rs=np.sin(2*np.pi*np.cumsum(fr)/SR)*(tt/1.0)**2*.18
place(pan(rs,0),3.0)
# 5) impact at 4.0: sub boom + deep gong (jing) with long shimmering tail
n=N-int(4.0*SR); tt=np.arange(n)/SR
boom=np.sin(2*np.pi*np.cumsum(38+34*np.exp(-tt/.12))/SR)*np.exp(-tt/.55)*.95
gong=np.zeros(n)
for r,a,d in [(1,1,2.6),(1.47,.5,2.0),(2.09,.45,1.6),(2.76,.3,1.2),(3.43,.2,.9),(4.12,.15,.7)]:
    fb=98*r; gong+=a*np.exp(-tt/d)*(np.sin(2*np.pi*fb*tt)+np.sin(2*np.pi*fb*1.004*tt+.5))*.5
gong*=np.minimum(tt/0.01,1)*.5*(1+.15*np.sin(2*np.pi*3.2*tt))
thud=bandnoise(n,40,400,9)*np.exp(-tt/.06)*.5
place(pan(boom+thud,0),4.0); place(np.stack([gong,np.roll(gong,90)],1),4.0)
# 6) reverb (short hall) for glue
irn=int(SR*1.8); ti=np.arange(irn)/SR
def rev(x,seed):
    ir=np.random.default_rng(seed).normal(0,1,irn)*np.exp(-ti/.5); ir[:int(.015*SR)]=0; ir/=np.sqrt((ir**2).sum())
    m=len(x)+irn; m2=1<<(m-1).bit_length(); return irfft(rfft(x,m2)*rfft(ir,m2),m2)[:len(x)]
wet=np.stack([rev(out[:,0],21),rev(out[:,1],22)],1)
mix=out*.8+wet*.45
# fade tail so the crossfade into the next clip is clean
mix*=np.interp(t,[0,5.3,6.04],[1,1,.35])[:,None]
mix/=np.abs(mix).max(); mix*=.89
w=wave.open('intro_sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes()); w.close(); print('ok')
