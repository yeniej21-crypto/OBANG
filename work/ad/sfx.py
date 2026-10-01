import numpy as np, wave
SR=44100
def save(n,x):
    x=x/np.max(np.abs(x))*0.9; x=np.stack([x,x],1)
    w=wave.open(n,'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype('<i2').tobytes()); w.close()
rng=np.random.default_rng(3)
# boom: pitch-dropping sine + sub + noise burst
t=np.arange(int(SR*1.2))/SR; f=110*np.exp(-t*3)+38
ph=2*np.pi*np.cumsum(f)/SR; boom=np.sin(ph)*np.exp(-t*2.6)+0.5*np.sin(ph*0.5)*np.exp(-t*2)
n=rng.normal(0,1,len(t))*np.exp(-t*18)*0.6; n=np.convolve(n,np.ones(30)/30,'same')
save('boom.wav',np.tanh((boom+n)*1.6))
# whoosh: bandpassed noise sweep
t=np.arange(int(SR*0.45))/SR; n=rng.normal(0,1,len(t)); env=np.sin(np.pi*t/t[-1])**2
F=np.fft.rfft(n); fr=np.fft.rfftfreq(len(n),1/SR); F*=np.exp(-((fr-1800)/1400)**2); n=np.fft.irfft(F,len(n))
save('whoosh.wav',n*env)
# tick/pop for cards: short bell
t=np.arange(int(SR*0.35))/SR; pop=(np.sin(2*np.pi*1320*t)+0.4*np.sin(2*np.pi*2640*t))*np.exp(-t*16)
save('tick.wav',pop)
# shimmer/ding for score reveal
t=np.arange(int(SR*1.4))/SR; ding=sum(np.sin(2*np.pi*f*t)*np.exp(-t*d)*a for f,d,a in [(1568,3,1),(2093,4,.6),(2637,5,.4),(3136,6,.3)])
save('ding.wav',ding)
