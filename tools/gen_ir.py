# 노을 홀 잔향 IR(시드 고정 생성: 어디서 돌려도 같은 파일). 2.8초, 25ms 사전 지연, 어두운 홀, 스테레오 48kHz
# 사용: python3 gen_ir.py voicefx_ir_hall_v2.wav  (Higgsfield 샌드박스에서 voicefx 돌릴 때 이걸로 만든다)
import numpy as np, wave, sys
sr=48000; n=int(2.8*sr); pre=int(0.025*sr); rng=np.random.default_rng(20261002)
t=np.arange(n-pre)/sr; env=np.exp(-6.91*t/2.2)
out=np.zeros((n,2))
for c in range(2):
    x=rng.standard_normal(n-pre)*env
    y=np.zeros_like(x); a=0.0
    for i in range(len(x)):
        k=0.30+0.55*min(1.0,t[i]/1.5)
        a=a+(1-k)*(x[i]-a); y[i]=a
    out[pre:,c]=y
out/=np.max(np.abs(out))*1.05
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out*32767).astype('<i2').tobytes()); w.close()
