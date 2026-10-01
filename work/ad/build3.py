import sys, glob, json, subprocess
sys.argv=[sys.argv[0],'none']+sys.argv[1:]
src=open('build2.py').read().split("phone_bg()\nwhich=sys.argv[1]")[0]
exec(src)
which=sys.argv[2]
UP='/root/.claude/uploads/0e228c66-4315-5570-9f36-e479903d9e96'
def up(jid):
    g=glob.glob(f'{UP}/*{jid}*.mp4'); assert g, f'missing upload {jid}'; return g[0]
def sub_rich(out,lines,y=1265,size=62):
    im=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(im); f=font(BLACK,size); lh=size*1.28; y0=y-(len(lines)-1)*lh
    for i,parts in enumerate(lines): rich(d,y0+i*lh,parts,f,stroke=8)
    im.save(out)
def talk2(out,src,a,b,subpng,hl,punch=1.0,shake=False,mute=False):
    d=b-a; z=f"1+{punch-1}*max(0\\,1-t/0.18)" if punch!=1.0 else "1"
    sx=f"+14*sin(t*90)*max(0\\,1-t/0.22)" if shake else ""
    vf=(f"[0:v]scale={W}:{H},setsar=1,fps=30,scale=w='iw*({z})':h='ih*({z})':eval=frame,"
        f"crop={W}:{H}:x='(in_w-{W})/2{sx}':y='(in_h-{H})/2'[v0];[v0][1:v]overlay[b];[b][2:v]overlay,format=yuv420p[v]")
    au=f"[0:a]afade=t=in:d=0.03,afade=t=out:st={d-0.05}:d=0.05{',volume=0' if mute else ''}[a]"
    ins=['-ss',str(a),'-t',str(d),'-i',src,'-i',hl,'-i',subpng]
    if mute: ins+=['-f','lavfi','-t',str(d),'-i','anullsrc=r=44100:cl=stereo']; au=''; amap='3:a'
    else: amap='[a]'
    run('ffmpeg','-y','-loglevel','error',*ins,'-filter_complex',vf+(';'+au if au else ''),'-map','[v]','-map',amap,'-t',str(d),*ENC,out); return d
def screen_frames(name,idxfile,a,b,speed):
    dd=json.load(open(idxfile)); F=dd['frames']; t0=F[0][1]
    sel=[(f,t-t0) for f,t in F if a<=t-t0<=b]; lines=[]
    for i,(f,t) in enumerate(sel):
        nxt=sel[i+1][1] if i+1<len(sel) else b; lines.append(f"file '{f}'\nduration {max(0.001,(nxt-t)/speed):.4f}")
    lines.append(f"file '{sel[-1][0]}'"); open(f'{name}.txt','w').write('\n'.join(lines))
    run('ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i',f'{name}.txt','-vf','fps=30,scale=828:1600','-c:v','libx264','-pix_fmt','yuv420p','-crf','18',f'{name}.mp4')
def concat_beat(parts,out,sfx,bgm_vol):
    open('l.txt','w').write('\n'.join(f"file '{p}'" for p in parts)); run('ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','l.txt','-c','copy','cat.mp4')
    T=dur('cat.mp4'); ins=['-i','cat.mp4','-stream_loop','-1','-i','beat.mp3']+sum([['-i',f] for f,t,v in sfx],[])
    fc=f"[1:a]atrim=0:{T},asetpts=PTS-STARTPTS,volume='{bgm_vol}':eval=frame,afade=t=out:st={T-0.6}:d=0.6[m];[0:a]volume=1.2[vo]"
    labs=['[vo]','[m]']
    for i,(f,t,v) in enumerate(sfx): fc+=f";[{i+2}:a]adelay={int(t*1000)}|{int(t*1000)},volume={v}[s{i}]"; labs.append(f'[s{i}]')
    fc+=f";{''.join(labs)}amix=inputs={len(labs)}:duration=first:normalize=0,alimiter=limit=0.95,loudnorm=I=-16:TP=-1.5[a]"
    run('ffmpeg','-y','-loglevel','error',*ins,'-filter_complex',fc,'-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-ar','44100','-movflags','+faststart',out); return T
PK=(255,122,160); PE=(255,179,150)
blank=Image.new('RGBA',(W,H),(0,0,0,0)); blank.save('blank.png')
if which=='D':
    EYE=up('c16353da'); FLIP=up('b8539b0d'); NEAR=up('25bd5848')
    sub_rich('d1.png',[[('누나…',WH)]]); sub_rich('d2.png',[[('남자 보는 ',WH),('눈',PK),('이 왜 그래?',WH)]])
    sub_rich('d3.png',[[('3번…',PK)]]); sub_rich('d4.png',[[('이미 ',WH),('누나 옆에',PK)],[('있을 수도 있어.',WH)]])
    parts=[]; t=0; sfx=[('heart.wav',0.0,1.0),('heart.wav',0.85,0.8)]
    t+=talk2('D0.mp4',EYE,0.4,2.0,'blank.png','hlD.png',punch=1.0,mute=True); parts.append('D0.mp4'); tA=t
    sfx.append(('hit.wav',t,0.9))
    t+=talk2('D1a.mp4',FLIP,0.1,1.6,'d1.png','hlD.png',punch=1.12,shake=True); parts.append('D1a.mp4')
    sfx.append(('whoosh.wav',t-0.05,0.5)); t+=talk2('D1b.mp4',FLIP,3.35,4.8,'d2.png','hlD.png',punch=1.1); parts.append('D1b.mp4'); tB=t
    for k,dd in enumerate([0.9,0.9,1.35]):
        sfx.append(('hit.wav',t,0.9));
        if k==2: sfx.append(('boom.wav',t+0.05,0.7))
        t+=still(f'D2{k}.mp4','listbg.png',dd,['hlD.png',f'list{k}.png'],1.08,1.0); parts.append(f'D2{k}.mp4')
    tC=t; sfx.append(('whoosh.wav',t-0.05,0.5))
    t+=talk2('D3a.mp4',NEAR,0.75,1.55,'d3.png','hlD.png',punch=1.1,shake=True); parts.append('D3a.mp4')
    t+=talk2('D3b.mp4',NEAR,3.4,5.75,'d4.png','hlD.png',punch=1.06); parts.append('D3b.mp4'); tD=t
    sfx.append(('boom.wav',t,0.6)); t+=still('D4.mp4','endD.png',1.9,[],1.06,1.0); parts.append('D4.mp4')
    vol=f"if(lt(t,{tA}),0.0,if(lt(t,{tB}),0.28,if(lt(t,{tC}),0.95,if(lt(t,{tD}),0.26,0.9))))"
    T=concat_beat(parts,'도화사주_광고_D_만나면안되는남자.mp4',sfx,vol)
if which=='E':
    PH=up('415c2667'); FG=up('c4118c38')
    screen_frames('eCal','sc3/index.json',0.3,3.4,1.35); sub('eCal_cap.png','그 사람이 다시 흔들리는 달까지',y=1300,pill=True)
    sub_rich('e1.png',[[('그 연락…',WH)]]); sub_rich('e2.png',[[('누나 사주엔',WH)],[('이미 ',WH),('적혀 있었어.',PK)]])
    sub_rich('e3.png',[[('답장은…',WH)]]); sub_rich('e4.png',[[('내 말 ',PK),('듣고 해.',WH)]])
    parts=[]; t=0; sfx=[('notif.wav',0.35,0.75),('notif.wav',1.2,0.65)]
    d0=2.1
    run('ffmpeg','-y','-loglevel','error','-loop','1','-t',str(d0),'-i','lock.png','-i','hlE.png','-i','noti1.png','-i','noti2.png','-f','lavfi','-t',str(d0),'-i','anullsrc=r=44100:cl=stereo',
        '-filter_complex',"[0:v]fps=30[b];[b][1:v]overlay[c];[c][2:v]overlay=x=0:y='if(lt(t,0.35),-400,-120*max(0,1-(t-0.35)/0.18))':enable='gte(t,0.35)'[d];[d][3:v]overlay=x=0:y='-120*max(0,1-(t-1.2)/0.18)':enable='gte(t,1.2)',format=yuv420p[v]",
        '-map','[v]','-map','4:a','-t',str(d0),*ENC,'E0.mp4'); t+=d0; parts.append('E0.mp4'); tA=t
    sfx.append(('hit.wav',t,0.8)); t+=talk2('E1a.mp4',PH,0.35,1.75,'e1.png','hlE.png',punch=1.1,shake=True); parts.append('E1a.mp4')
    t+=talk2('E1b.mp4',PH,3.55,5.6,'e2.png','hlE.png',punch=1.08); parts.append('E1b.mp4'); tB=t
    sfx+= [('whoosh.wav',t-0.05,0.5),('ding.wav',t+0.4,0.45)]
    t+=screen('E2.mp4','eCal.mp4','hlE.png','eCal_cap.png'); parts.append('E2.mp4'); tC=t
    sfx.append(('hit.wav',t,0.8)); t+=talk2('E3a.mp4',FG,1.5,2.35,'e3.png','hlE.png',punch=1.1,shake=True); parts.append('E3a.mp4')
    t+=talk2('E3b.mp4',FG,3.6,4.6,'e4.png','hlE.png',punch=1.12); parts.append('E3b.mp4'); tD=t
    sfx.append(('boom.wav',t,0.6)); t+=still('E4.mp4','endE.png',1.9,[],1.06,1.0); parts.append('E4.mp4')
    vol=f"if(lt(t,{tA}),0.35,if(lt(t,{tB}),0.26,if(lt(t,{tC}),0.9,if(lt(t,{tD}),0.26,0.9))))"
    T=concat_beat(parts,'도화사주_광고_E_자니.mp4',sfx,vol)
