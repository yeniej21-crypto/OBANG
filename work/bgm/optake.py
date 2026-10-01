import numpy as np, wave
from numpy.fft import rfft, irfft
SR=44100; L=9.2; N=int(SR*L); t=np.arange(N)/SR; rng=np.random.default_rng(11)
out=np.zeros((N,2))
def hz(n): return 440*2**((n-69)/12)
def pan(s,p): return np.stack([s*np.cos((p+1)*np.pi/4), s*np.sin((p+1)*np.pi/4)],1)
def addc(i,x):
    i=int(i); n=min(len(x),N-i)
    if n>0: out[i:i+n]+=x[:n]
def env(a,b,c,d):  # 0 until a, rise to 1 at b, hold to c, fall to 0 at d
    return np.clip(np.minimum((t-a)/(b-a+1e-9),(d-t)/(d-c+1e-9)),0,1)
# 1) 저음 드론 + 서브 (D)
sw=env(0,2.2,7.3,8.8)**1.5
for f,a,p in [(hz(26),.30,0),(hz(38),.16,-.25),(hz(45),.09,.25)]:
    lfo=1+.2*np.sin(2*np.pi*.23*t+f)
    s=(np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*2*f*t+.4)+.5*np.sin(2*np.pi*(f+.6)*t))*a*lfo*sw
    out+=pan(s,p)
# 2) 합창 같은 패드 (Dm add9: D3 A3 E4 F4) — 배음에 '아' 모음 포먼트
def formant(fr): return np.exp(-((fr-750)/260)**2)+.6*np.exp(-((fr-1150)/300)**2)+.25*np.exp(-((fr-2600)/500)**2)+.08
pad=np.zeros((N,2)); pe=env(.8,5.2,7.2,8.9)**1.3
for k,(m,p) in enumerate([(50,-.4),(57,.35),(64,-.15),(65,.45)]):
    f0=hz(m)
    for dv in (-4,0,4):  # 코러스
        f=f0*2**(dv/1200); vib=1+.004*np.sin(2*np.pi*(4.6+.3*k)*t+dv)
        ph=2*np.pi*np.cumsum(f*vib)/SR; s=np.zeros(N)
        for h in range(1,14):
            if f*h>5000: break
            s+=formant(f*h)*np.sin(h*ph)/h**.6
        pad+=pan(s*pe*.012,p)
out+=pad
# 3) 싱잉볼 (탭 순간, 문 열릴 때)
def bowl(t0,f0,g,p,dec=6):
    n=int(SR*8); tt=np.arange(n)/SR; s=np.zeros(n)
    for r,a,d in [(1,1,dec),(2.76,.5,dec*.6),(5.40,.25,dec*.4),(8.93,.12,dec*.25)]:
        s+=a*np.exp(-tt/d)*(np.sin(2*np.pi*f0*r*tt)+np.sin(2*np.pi*f0*r*1.003*tt))*.5
    s*=np.minimum(tt/0.003,1)*g; addc(t0*SR,pan(s,p))
bowl(0.05,hz(50),.16,-.1,7); bowl(2.1,hz(57),.12,.3,6); bowl(4.6,hz(62),.08,-.35,5)
# 4) 풍경(바람 종) — 높은 금속음이 드문드문
chime=[1175,1319,1568,1760,2093,2349]
for tc in np.sort(rng.uniform(1.0,7.2,11)):
    f=rng.choice(chime); n=int(SR*2.5); tt=np.arange(n)/SR; s=np.zeros(n)
    for r,a,d in [(1,1,1.4),(2.76,.35,.6),(5.4,.15,.3)]: s+=a*np.exp(-tt/d)*np.sin(2*np.pi*f*r*tt)
    s*=np.minimum(tt/0.002,1)*rng.uniform(.018,.035); addc(tc*SR,pan(s,rng.uniform(-.8,.8)))
# 5) 공기·바람 (대역 잡음, 천천히 밝아짐)
nz=rng.normal(0,1,(N,2)); fr=np.fft.rfftfreq(N,1/SR)
for c in range(2):
    F=rfft(nz[:,c]); F*=np.exp(-((fr-900)/700)**2)+.3*np.exp(-((fr-3500)/1500)**2); nz[:,c]=irfft(F,N)
nz/=np.abs(nz).max(); out+=nz*.05*env(0,1.5,7,8.8)[:,None]
# 6) 끝에서 빨려 들어가는 역방향 스웰 (6.0~7.6s)
n=int(SR*1.7); tt=np.arange(n)/SR; sw2=np.zeros((n,2))
r=rng.normal(0,1,(n,2)); Fq=np.fft.rfftfreq(n,1/SR)
for c in range(2):
    F=rfft(r[:,c]); F*=np.exp(-((Fq-2500)/1800)**2); sw2[:,c]=irfft(F,n)
sw2/=np.abs(sw2).max(); e=(tt/tt[-1])**3; sw2*=e[:,None]*.22
tone=np.sin(2*np.pi*np.cumsum(hz(62)*(1+tt*.08))/SR)*e*.06; sw2+=pan(tone,0)
addc(5.9*SR,sw2)
# 7) 잔향 (합성 IR 스테레오)
irn=int(SR*3.6); ti=np.arange(irn)/SR
def conv(x,ir):
    m=len(x)+len(ir); return irfft(rfft(x,m)*rfft(ir,m),m)[:len(x)]
wet=np.zeros_like(out)
for c in range(2):
    ir=rng.normal(0,1,irn)*np.exp(-ti/1.0); ir[:int(SR*.02)]*=np.linspace(0,1,int(SR*.02)); ir/=np.sqrt((ir**2).sum())
    wet[:,c]=conv(out[:,c],ir)
mix=out*.75+wet*.55
mix*=np.clip((L-t)/0.6,0,1)[:,None]  # 끝 페이드
mix/=np.abs(mix).max()/0.85
with wave.open('bgm/op_take_amb.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype('<i2').tobytes())
print('ok')
