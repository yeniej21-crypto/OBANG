import subprocess, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
P='../proto'; W,H=1080,1920
BLACK='/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'; BOLD='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
SERIF='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
def font(path,size):
    # KR face index
    for i in range(10):
        try:
            f=ImageFont.truetype(path,size,index=i)
            if 'KR' in ' '.join(f.getname()): return f
        except Exception: break
    return ImageFont.truetype(path,size)
def run(*a): subprocess.run(list(a),check=True)
def rich_line(draw,y,parts,fnt,stroke=7):
    total=sum(draw.textlength(t,font=fnt) for t,c in parts); x=(W-total)/2
    for t,c in parts:
        draw.text((x,y),t,font=fnt,fill=c,stroke_width=stroke,stroke_fill=(20,10,16),anchor='ls'); x+=draw.textlength(t,font=fnt)
def headline():
    im=Image.new('RGBA',(W,H),(0,0,0,0)); sh=Image.new('RGBA',(W,H),(0,0,0,0))
    f=font(BLACK,76); d=ImageDraw.Draw(im); ds=ImageDraw.Draw(sh)
    L1=[('누나가 자꾸 ',(255,255,255)),('끌리는',(255,179,150)),(' 이유,',(255,255,255))]
    L2=[('사주에 ',(255,255,255)),('도화',(255,122,160)),('가 숨어 있어서야',(255,255,255))]
    for dd in (ds,): rich_line(dd,350,[(t,(0,0,0)) for t,c in L1],f,stroke=16); rich_line(dd,448,[(t,(0,0,0)) for t,c in L2],f,stroke=16)
    sh=sh.filter(ImageFilter.GaussianBlur(14)); sh.putalpha(sh.getchannel('A').point(lambda v:int(v*.55)))
    rich_line(d,350,L1,f); rich_line(d,448,L2,f)
    out=Image.alpha_composite(sh,im); out.save('hl.png')
def sub(name,text,y=1265,pill=False):
    im=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(im); f=font(BOLD,58)
    tw=d.textlength(text,font=f)
    if pill:
        d.rounded_rectangle(((W-tw)/2-34,y-66,(W+tw)/2+34,y+22),radius=44,fill=(20,12,18,200))
        d.text((W/2,y),text,font=f,fill=(255,230,222),anchor='ms')
    else:
        d.text((W/2,y),text,font=f,fill=(255,255,255),stroke_width=6,stroke_fill=(0,0,0),anchor='ms')
    im.save(name)
def phone_bg():
    bg=Image.open(f'{P}/img/taeo/base.jpg').convert('RGB').resize((W,int(W*1344/752)))
    bg=bg.crop((0,(bg.height-H)//2,W,(bg.height-H)//2+H)).filter(ImageFilter.GaussianBlur(28))
    tint=Image.new('RGB',(W,H),(40,16,30)); bg=Image.blend(bg,tint,.55).convert('RGBA')
    glow=Image.new('RGBA',(W,H),(0,0,0,0)); g=ImageDraw.Draw(glow); g.ellipse((140,560,940,1760),fill=(255,143,166,90)); glow=glow.filter(ImageFilter.GaussianBlur(120))
    bg=Image.alpha_composite(bg,glow)
    sh=Image.new('RGBA',(W,H),(0,0,0,0)); s=ImageDraw.Draw(sh); s.rounded_rectangle((218,596,862,1826),radius=64,fill=(0,0,0,170)); sh=sh.filter(ImageFilter.GaussianBlur(26))
    bg=Image.alpha_composite(bg,sh); d=ImageDraw.Draw(bg); d.rounded_rectangle((220,570,860,1800),radius=60,fill=(14,10,14),outline=(255,200,190,90),width=3)
    bg.convert('RGB').save('phonebg.png')
    m=Image.new('L',(620,1198),0); ImageDraw.Draw(m).rounded_rectangle((0,0,619,1197),radius=48,fill=255); m.save('mask.png')
def endcard():
    im=Image.open(f'{P}/img/taeo/wink.jpg').convert('RGB').resize((W,int(W*1344/752))); im=im.crop((0,0,W,H)).convert('RGBA')
    gr=Image.new('RGBA',(W,H),(0,0,0,0)); g=ImageDraw.Draw(gr)
    for y in range(H):
        a=0 if y<760 else int(min(1,(y-760)/560)*235); g.line([(0,y),(W,y)],fill=(12,10,14,a))
    im=Image.alpha_composite(im,gr); d=ImageDraw.Draw(im)
    d.text((W/2,1270),'桃花 · 내 사주 속 도화, 얼마나 진할까',font=font(BOLD,40),fill=(255,217,204),anchor='ms')
    d.text((W/2,1440),'도화 사주',font=font(SERIF,168),fill=(255,255,255),anchor='ms')
    btn=(170,1520,910,1640); d.rounded_rectangle(btn,radius=60,fill=(255,160,176))
    d.text((W/2,1600),'지금 내 도화 확인하기  ▶',font=font(BLACK,52),fill=(42,13,20),anchor='ms')
    d.text((W/2,1720),'오방 · AI 사주 캐릭터',font=font(BOLD,34),fill=(180,165,160),anchor='ms')
    im.convert('RGB').save('end.png')
headline(); phone_bg(); endcard()
V1=[(0,2.2,'누나 사주에…'),(2.2,3.65,'도화가 있어.'),(3.65,4.75,'그것도 꽤 진하게.')]
V4=[(0,2.4,'나머지는…'),(2.4,4.05,'누나만 보라고'),(4.05,5.0,'따로 써놨어.')]
SC={'segA':'이름이랑 생일만 넣으면','segB':'내 사주 여덟 글자에서 도화를 찾고','segC':'도화 유형 · 도화 지수까지'}
for i,(a,b,t) in enumerate(V1): sub(f's1_{i}.png',t)
for i,(a,b,t) in enumerate(V4): sub(f's5_{i}.png',t)
for k,t in SC.items(): sub(f'{k}_cap.png',t,y=(1150 if k=='segC' else 1300),pill=True)
ENC=['-c:v','libx264','-pix_fmt','yuv420p','-crf','19','-r','30','-c:a','aac','-b:a','160k','-ar','44100','-ac','2']
def talk(src,dur,cues,prefix,out):
    ins=['-i',src,'-i','hl.png']+sum([['-i',f'{prefix}_{i}.png'] for i in range(len(cues))],[])
    fc=f"[0:v]scale={W}:{H},setsar=1,fps=30[v0];[v0][1:v]overlay=0:0[b0]"; last='b0'
    for i,(a,b,t) in enumerate(cues): fc+=f";[{last}][{i+2}:v]overlay=0:0:enable='between(t,{a},{b-0.02})'[b{i+1}]"; last=f'b{i+1}'
    run('ffmpeg','-y','-loglevel','error',*ins,'-filter_complex',fc,'-map',f'[{last}]','-map','0:a','-t',str(dur),*ENC,out)
def screen(seg,out):
    dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'{seg}.mp4']).decode())
    fc=("[1:v]scale=620:1198,format=rgba[s];[2:v]format=gray,scale=620:1198[m];[s][m]alphamerge[sm];"
        "[0:v][sm]overlay=230:580[b];[b][3:v]overlay=0:0[c];[c][4:v]overlay=0:0,format=yuv420p[v]")
    run('ffmpeg','-y','-loglevel','error','-loop','1','-t',str(dur),'-i','phonebg.png','-i',f'{seg}.mp4','-i','mask.png','-i','hl.png','-i',f'{seg}_cap.png',
        '-f','lavfi','-t',str(dur),'-i','anullsrc=r=44100:cl=stereo','-filter_complex',fc,'-map','[v]','-map','5:a','-t',str(dur),*ENC,out)
    return dur
talk(f'{P}/v/taeo/v1.mp4',4.75,V1,'s1','p1.mp4')
dA=screen('segA','p2.mp4'); dB=screen('segB','p3.mp4'); dC=screen('segC','p4.mp4')
talk(f'{P}/v/taeo/v4.mp4',5.0,V4,'s5','p5.mp4')
run('ffmpeg','-y','-loglevel','error','-loop','1','-t','1.9','-i','end.png','-f','lavfi','-t','1.9','-i','anullsrc=r=44100:cl=stereo',
    '-filter_complex',"[0:v]scale=1188:2112,zoompan=z='1+0.0006*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=57:s=1080x1920:fps=30,fade=t=in:st=0:d=0.25[v]",'-map','[v]','-map','1:a','-t','1.9',*ENC,'p6.mp4')
open('list.txt','w').write('\n'.join(f"file 'p{i}.mp4'" for i in range(1,7)))
run('ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i','list.txt','-c','copy','cat.mp4')
T=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','cat.mp4']).decode())
t1=4.75; t2=t1+dA+dB+dC; t3=t2+5.0
vol=f"if(lt(t,{t1}),0.22,if(lt(t,{t2}),0.75,if(lt(t,{t3}),0.2,0.8)))"
run('ffmpeg','-y','-loglevel','error','-i','cat.mp4','-stream_loop','-1','-i',f'{P}/a/taeo_bgm.mp3',
    '-filter_complex',f"[1:a]atrim=0.05:{T+0.05},asetpts=PTS-STARTPTS,volume='{vol}':eval=frame,afade=t=in:d=0.4,afade=t=out:st={T-0.8}:d=0.8[m];[0:a]volume=1.15[vo];[vo][m]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[a]",
    '-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart','dohwa_ad.mp4')
print('total',T, t1,t2,t3)
