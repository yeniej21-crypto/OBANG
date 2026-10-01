import subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
P='../proto'; W,H=1080,1920
BLACK='/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; BOLD='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'; SERIF='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
WH=(255,255,255); PEACH=(255,179,150); PINK=(255,122,160)
def font(path,size):
    for i in range(10):
        try:
            f=ImageFont.truetype(path,size,index=i)
            if 'KR' in ' '.join(f.getname()): return f
        except Exception: break
    return ImageFont.truetype(path,size)
def run(*a): subprocess.run(list(a),check=True)
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
ENC=['-c:v','libx264','-pix_fmt','yuv420p','-crf','19','-r','30','-c:a','aac','-b:a','160k','-ar','44100','-ac','2']
def rich(draw,y,parts,fnt,stroke=7,shadow=False):
    total=sum(draw.textlength(t,font=fnt) for t,c in parts); x=(W-total)/2
    for t,c in parts:
        draw.text((x,y),t,font=fnt,fill=(0,0,0) if shadow else c,stroke_width=stroke,stroke_fill=(20,10,16),anchor='ls'); x+=draw.textlength(t,font=fnt)
def headline(out,L1,L2,size=76,y1=350,y2=448):
    im=Image.new('RGBA',(W,H),(0,0,0,0)); sh=Image.new('RGBA',(W,H),(0,0,0,0)); f=font(BLACK,size)
    ds=ImageDraw.Draw(sh); rich(ds,y1,L1,f,16,True); rich(ds,y2,L2,f,16,True)
    sh=sh.filter(ImageFilter.GaussianBlur(14)); sh.putalpha(sh.getchannel('A').point(lambda v:int(v*.55)))
    d=ImageDraw.Draw(im); rich(d,y1,L1,f); rich(d,y2,L2,f); Image.alpha_composite(sh,im).save(out)
def sub(out,text,y=1265,pill=False,size=58):
    im=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(im); f=font(BOLD,size); lines=text.split('\n'); lh=size*1.3
    y0=y-(len(lines)-1)*lh
    for i,l in enumerate(lines):
        yy=y0+i*lh; tw=d.textlength(l,font=f)
        if pill: d.rounded_rectangle(((W-tw)/2-34,yy-size-8,(W+tw)/2+34,yy+22),radius=44,fill=(20,12,18,205)); d.text((W/2,yy),l,font=f,fill=(255,230,222),anchor='ms')
        else: d.text((W/2,yy),l,font=f,fill=WH,stroke_width=6,stroke_fill=(0,0,0),anchor='ms')
    im.save(out)
def bigtext(out,lines,size=118,y=980):
    im=Image.new('RGBA',(W,H),(0,0,0,0)); sh=Image.new('RGBA',(W,H),(0,0,0,0)); f=font(BLACK,size)
    for i,parts in enumerate(lines):
        rich(ImageDraw.Draw(sh),y+i*size*1.18,parts,f,22,True);
    sh=sh.filter(ImageFilter.GaussianBlur(18)); sh.putalpha(sh.getchannel('A').point(lambda v:int(v*.7)))
    d=ImageDraw.Draw(im)
    for i,parts in enumerate(lines): rich(d,y+i*size*1.18,parts,f,9)
    Image.alpha_composite(sh,im).save(out)
def phone_bg():
    bg=Image.open(f'{P}/img/taeo/base.jpg').convert('RGB').resize((W,int(W*1344/752)))
    bg=bg.crop((0,(bg.height-H)//2,W,(bg.height-H)//2+H)).filter(ImageFilter.GaussianBlur(28))
    bg=Image.blend(bg,Image.new('RGB',(W,H),(40,16,30)),.55).convert('RGBA')
    glow=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(glow).ellipse((140,560,940,1760),fill=(255,143,166,90)); bg=Image.alpha_composite(bg,glow.filter(ImageFilter.GaussianBlur(120)))
    sh=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(sh).rounded_rectangle((218,596,862,1826),radius=64,fill=(0,0,0,170)); bg=Image.alpha_composite(bg,sh.filter(ImageFilter.GaussianBlur(26)))
    ImageDraw.Draw(bg).rounded_rectangle((220,570,860,1800),radius=60,fill=(14,10,14),outline=(255,200,190,90),width=3)
    bg.convert('RGB').save('phonebg.png')
    m=Image.new('L',(620,1198),0); ImageDraw.Draw(m).rounded_rectangle((0,0,619,1197),radius=48,fill=255); m.save('mask.png')
def endcard(out,img,kicker,title,cta,foot='오방 · AI 사주 캐릭터'):
    im=Image.open(img).convert('RGB').resize((W,int(W*1344/752))).crop((0,0,W,H)).convert('RGBA')
    gr=Image.new('RGBA',(W,H),(0,0,0,0)); g=ImageDraw.Draw(gr)
    for y in range(H): g.line([(0,y),(W,y)],fill=(12,10,14,0 if y<760 else int(min(1,(y-760)/560)*235)))
    im=Image.alpha_composite(im,gr); d=ImageDraw.Draw(im)
    d.text((W/2,1270),kicker,font=font(BOLD,40),fill=(255,217,204),anchor='ms')
    d.text((W/2,1440),title,font=font(SERIF,160),fill=WH,anchor='ms')
    d.rounded_rectangle((150,1520,930,1640),radius=60,fill=(255,160,176)); d.text((W/2,1600),cta,font=font(BLACK,50),fill=(42,13,20),anchor='ms')
    d.text((W/2,1720),foot,font=font(BOLD,34),fill=(180,165,160),anchor='ms'); im.convert('RGB').save(out)
# ---- clip builders (each returns path, duration) ----
def talk(out,src,a,b,subpng,hl,punch=1.0):
    d=b-a; zoom='' if punch==1.0 else f",scale={int(W*punch)}:{int(H*punch)},crop={W}:{H}"
    run('ffmpeg','-y','-loglevel','error','-ss',str(a),'-t',str(d),'-i',src,'-i',hl,'-i',subpng,
        '-filter_complex',f"[0:v]scale={W}:{H},setsar=1,fps=30{zoom}[v0];[v0][1:v]overlay[b];[b][2:v]overlay,format=yuv420p[v];[0:a]afade=t=in:d=0.03,afade=t=out:st={d-0.05}:d=0.05[a]",
        '-map','[v]','-map','[a]','-t',str(d),*ENC,out); return d
def screen(out,seg,hl,cap):
    d=dur(seg)
    fc=("[1:v]scale=620:1198,format=rgba[s];[2:v]format=gray,scale=620:1198[m];[s][m]alphamerge[sm];[0:v][sm]overlay=230:580[b];[b][3:v]overlay[c];[c][4:v]overlay,format=yuv420p[v]")
    run('ffmpeg','-y','-loglevel','error','-loop','1','-t',str(d),'-i','phonebg.png','-i',seg,'-i','mask.png','-i',hl,'-i',cap,'-f','lavfi','-t',str(d),'-i','anullsrc=r=44100:cl=stereo',
        '-filter_complex',fc,'-map','[v]','-map','5:a','-t',str(d),*ENC,out); return d
def still(out,img,d,overlays,zoom_from=1.0,zoom_to=1.0,dark=0.0,phone_seg=None):
    # image still (optionally inside phone frame) with a punch zoom and overlays
    n=int(d*30); z=f"'{zoom_from}+({zoom_to}-{zoom_from})*min(1,on/9)'"
    ins=['-loop','1','-t',str(d),'-i',img]+sum([['-i',o] for o in overlays],[])+['-f','lavfi','-t',str(d),'-i','anullsrc=r=44100:cl=stereo']
    fc=f"[0:v]scale={W*2}:{H*2},zoompan=z={z}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps=30"+(f",eq=brightness={-dark}" if dark else '')+"[b0]"; last='b0'
    for i in range(len(overlays)): fc+=f";[{last}][{i+1}:v]overlay[b{i+1}]"; last=f'b{i+1}'
    fc+=f";[{last}]format=yuv420p[v]"
    run('ffmpeg','-y','-loglevel','error',*ins,'-filter_complex',fc,'-map','[v]','-map',f'{len(overlays)+1}:a','-t',str(d),*ENC,out); return d
def concat_mix(parts,out,sfx,bgm_vol):
    open('l.txt','w').write('\n'.join(f"file '{p}'" for p in parts)); run('ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','l.txt','-c','copy','cat.mp4')
    T=dur('cat.mp4'); ins=['-i','cat.mp4','-stream_loop','-1','-i',f'{P}/a/taeo_bgm.mp3']+sum([['-i',f] for f,t,v in sfx],[])
    fc=f"[1:a]atrim=0.05:{T+0.05},asetpts=PTS-STARTPTS,volume='{bgm_vol}':eval=frame,afade=t=in:d=0.3,afade=t=out:st={T-0.8}:d=0.8[m];[0:a]volume=1.15[vo]"
    labs=['[vo]','[m]']
    for i,(f,t,v) in enumerate(sfx): fc+=f";[{i+2}:a]adelay={int(t*1000)}|{int(t*1000)},volume={v}[s{i}]"; labs.append(f'[s{i}]')
    fc+=f";{''.join(labs)}amix=inputs={len(labs)}:duration=first:normalize=0,alimiter=limit=0.95,loudnorm=I=-16:TP=-1.5[a]"
    run('ffmpeg','-y','-loglevel','error',*ins,'-filter_complex',fc,'-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-ar','44100','-movflags','+faststart',out); return T

phone_bg()
which=sys.argv[1]
if which=='B':
    headline('hlB.png',[('남자들이 ',WH),('먼저 연락하는',PEACH),(' 여자,',WH)],[('사주에 ',WH),('이 글자',PINK),('가 있어',WH)],size=68)
    bigtext('hookB.png',[[('너, ',WH),('도화',PINK)],[('있어?',WH)]],size=150,y=900)
    V1=f'{P}/v/taeo/v1.mp4'; V2=f'{P}/v/taeo/v2.mp4'
    sub('b1.png','누나 사주에…'); sub('b2.png','도화가 있어.'); sub('b3.png','그것도 꽤 진하게.')
    sub('b4.png','근데 이상하다.'); sub('b5.png','이 정도면 사람들이\n가만 안 뒀을 텐데…'); sub('b6.png','누나가 문 닫고 있었지?')
    TY=[('base','봄꽃 도화','첫눈에 스며드는 타입',['#첫인상_반칙','#웃을때_무장해제']),('wink','햇살 도화','있기만 해도 분위기가 바뀌는 타입',['#존재감','#자꾸_눈이_감']),('wow','달빛 도화','가까이 와야 보이는 타입',['#은근한_매력','#한번_빠지면_끝']),('chin','밤의 도화','대화로 빠지게 만드는 타입',['#목소리','#끝나지_않는_대화'])]
    for i,(img,n,dsc,tags) in enumerate(TY):
        im=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(im)
        d.rounded_rectangle((110,860,970,1300),radius=40,fill=(16,10,16,215),outline=(255,185,166,160),width=3)
        d.text((W/2,960),f'너는 어떤 도화?  {i+1}/4',font=font(BOLD,40),fill=(255,217,204),anchor='ms')
        d.text((W/2,1090),n,font=font(SERIF,118),fill=WH,anchor='ms')
        d.text((W/2,1170),dsc,font=font(BOLD,46),fill=(230,215,210),anchor='ms')
        d.text((W/2,1250),'   '.join(tags),font=font(BOLD,40),fill=PEACH,anchor='ms'); im.save(f'card{i}.png')
    endcard('endB.png',f'{P}/img/taeo/wink.jpg','桃花 · 생일만 넣으면 1분','내 도화 유형','내 도화 유형 확인하기  ▶')
    parts=[]; t=0; sfx=[]
    t+=still('B0.mp4',f'{P}/img/taeo/wink.jpg',1.3,['hookB.png'],1.22,1.0,0.12); parts.append('B0.mp4'); sfx.append(('boom.wav',0.0,0.9))
    for k,(a,b,s) in enumerate([(0,1.3,'b1.png'),(2.2,3.1,'b2.png'),(3.65,4.75,'b3.png')]):
        t+=talk(f'B1{k}.mp4',V1,a,b,s,'hlB.png',punch=[1.0,1.08,1.0][k]); parts.append(f'B1{k}.mp4')
    for i,(img,*_) in enumerate(TY):
        sfx.append(('whoosh.wav' if i==0 else 'tick.wav',t,0.7)); t+=still(f'B2{i}.mp4',f'{P}/img/taeo/{img}.jpg',1.1,['hlB.png',f'card{i}.png'],1.1,1.0,0.1); parts.append(f'B2{i}.mp4')
    t1=t
    for k,(a,b,s) in enumerate([(0.15,1.1,'b4.png'),(2.0,4.15,'b5.png'),(5.0,6.62,'b6.png')]):
        t+=talk(f'B3{k}.mp4',V2,a,b,s,'hlB.png',punch=[1.0,1.08,1.14][k]); parts.append(f'B3{k}.mp4')
    t2=t; sfx.append(('whoosh.wav',t2,0.6))
    t+=still('B4.mp4','endB.png',1.9,[],1.0,1.04); parts.append('B4.mp4')
    vol=f"if(lt(t,1.3),0.5,if(lt(t,{t1-4.4}),0.18,if(lt(t,{t1}),0.7,if(lt(t,{t2}),0.16,0.8))))"
    print('B total',concat_mix(parts,'도화사주_광고_B_도화유형퀴즈.mp4',sfx,vol))
if which=='C':
    headline('hlC.png',[('그 사람 ',WH),('생일',PEACH),('만 넣으면',WH)],[('나한테 ',WH),('끌리는지',PINK),(' 나와',WH)])
    bigtext('hookC.png',[[('궁합 ',WH),('88점',PINK)],[('나온 사이',WH)]],size=140,y=300)
    for k,t in {'gA':'그 사람 생일 넣고','gB':'둘 사주를 맞대 보면','gC':'끌림 · 오래 감 점수까지','gD':'왜 끌리는지 근거까지 나와'}.items(): sub(f'{k}_cap.png',t,y=(1150 if k=='gD' else 1300),pill=True)
    sub('c1.png','그리고…'); sub('c2.png','누나 좋아하는 사람,\n생각보다 가까이 있어.')
    endcard('endC.png',f'{P}/img/taeo/wink.jpg','桃花 · 그 사람 생일만 있으면','도화 궁합','그 사람이랑 궁합 보기  ▶')
    # hook: result frame inside phone with punch
    hk=Image.open('phonebg.png').convert('RGBA'); scr=Image.open('gHook.jpg').convert('RGB').resize((620,1198)); m=Image.open('mask.png'); hk.paste(scr,(230,580),m); hk.convert('RGB').save('hookC_bg.png')
    parts=[]; t=0; sfx=[]
    t+=still('C0.mp4','hookC_bg.png',1.5,['hookC.png'],1.35,1.0,0.0); parts.append('C0.mp4'); sfx+= [('boom.wav',0,0.9),('ding.wav',0.15,0.35)]
    for k in ['gA','gB','gC','gD']:
        if k=='gC': sfx.append(('ding.wav',t+0.3,0.4))
        else: sfx.append(('whoosh.wav',t,0.5))
        t+=screen(f'C_{k}.mp4',f'{k}.mp4','hlC.png',f'{k}_cap.png'); parts.append(f'C_{k}.mp4')
    t1=t
    L2=f'{P}/v/taeo/L2.mp4'
    t+=talk('C5.mp4',L2,2.85,3.6,'c1.png','hlC.png',1.0); parts.append('C5.mp4')
    t+=talk('C6.mp4',L2,4.45,7.95,'c2.png','hlC.png',1.1); parts.append('C6.mp4')
    t2=t; sfx.append(('whoosh.wav',t2,0.6))
    t+=still('C7.mp4','endC.png',1.9,[],1.0,1.04); parts.append('C7.mp4')
    vol=f"if(lt(t,1.5),0.5,if(lt(t,{t1}),0.75,if(lt(t,{t2}),0.16,0.8)))"
    print('C total',concat_mix(parts,'도화사주_광고_C_궁합공개.mp4',sfx,vol))
