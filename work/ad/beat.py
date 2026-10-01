import numpy as np, wave
SR=44100; BPM=140; B=60/BPM; BAR=4*B; NB=8; L=BAR*NB; N=int(SR*L)
rng=np.random.default_rng(5); out=np.zeros((N,2))
def pan(s,p=0): return np.stack([s*np.cos((p+1)*np.pi/4),s*np.sin((p+1)*np.pi/4)],1)
def add(t0,x,p=0):
    i=int(t0*SR); x=pan(x,p) if x.ndim==1 else x; e=min(N,i+len(x)); out[i:e]+=x[:e-i]
def kick808(f0=55,d=1.1):
    t=np.arange(int(SR*d))/SR; f=f0+120*np.exp(-t*30); ph=2*np.pi*np.cumsum(f)/SR
    return np.tanh(np.sin(ph)*np.exp(-t*2.2)*2.2)*0.9
def clap():
    t=np.arange(int(SR*.25))/SR; n=rng.normal(0,1,len(t)); env=np.exp(-t*22)+0.6*np.exp(-((t-0.012)*120)**2)
    F=np.fft.rfft(n); fr=np.fft.rfftfreq(len(n),1/SR); F*=np.exp(-((fr-1600)/900)**2); return np.fft.irfft(F,len(n))*env*3
def hat(o=False):
    t=np.arange(int(SR*(.18 if o else .05)))/SR; n=rng.normal(0,1,len(t)); n=np.diff(np.concatenate([[0],n]))
    return n*np.exp(-t*(18 if o else 70))*0.25
def pad(m,d):
    f=440*2**((m-69)/12); t=np.arange(int(SR*d))/SR
    s=sum(np.sin(2*np.pi*f*k*t+rng.uniform(0,6))/k for k in (1,2,3))*np.minimum(t/.6,1)*np.minimum((d-t)/.4,1); return s*0.05
def bell(m):
    f=440*2**((m-69)/12); t=np.arange(int(SR*1.2))/SR
    return (np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*f*3.01*t)*np.exp(-t*6))*np.exp(-t*3.5)*0.09
CH=[[57,60,64],[53,57,60],[55,59,62],[52,55,59]]  # Am F G Em
for b in range(NB):
    t0=b*BAR; ch=CH[b%4]
    for m in ch: add(t0,pad(m,BAR),rng.uniform(-.4,.4))
    add(t0,kick808(55 if b%4!=1 else 44)); add(t0+2.5*B,kick808(55,.5)*0.8)
    if b%2==1: add(t0+3.5*B,kick808(49,.4)*0.7)
    add(t0+2*B,clap())
    for k in range(8):
        add(t0+k*B/2,hat(k==7),0.3)
    if b%2==1:
        for k in range(6): add(t0+3*B+k*B/6,hat()*0.7,0.3)
    mel=[69,72,76,74] if b%2==0 else [72,71,69,64]
    for k,m in enumerate(mel): add(t0+k*B,bell(m),-.3)
out/=np.abs(out).max(); out*=0.9
w=wave.open('beat.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype('<i2').tobytes()); w.close()
# heartbeat
t=np.arange(int(SR*1.0))/SR
def thump(d): tt=np.arange(int(SR*.25))/SR; return np.sin(2*np.pi*(45+40*np.exp(-tt*40))*tt)*np.exp(-tt*14)
hb=np.zeros(int(SR*1.0)); a=thump(0); hb[:len(a)]+=a; hb[int(.28*SR):int(.28*SR)+len(a)]+=a*.7
def save(n,x):
    x=x/np.abs(x).max()*.9; x=np.stack([x,x],1); w=wave.open(n,'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype('<i2').tobytes()); w.close()
save('heart.wav',np.tanh(hb*2))
# phone buzz: 2 pulses of 170Hz rough
t=np.arange(int(SR*1.0))/SR; bz=np.sign(np.sin(2*np.pi*170*t))*0.5+np.sin(2*np.pi*340*t)*0.3
env=((t%0.5)<0.32).astype(float)*(t<0.95); save('buzz.wav',bz*env*np.exp(-0*t))
# impact hit
t=np.arange(int(SR*.6))/SR; hit=np.sin(2*np.pi*(60+200*np.exp(-t*25))*t)*np.exp(-t*7)+rng.normal(0,1,len(t))*np.exp(-t*30)*0.4
save('hit.wav',np.tanh(hit*1.5))
