import re,sys
FILES=sys.argv[1:]
KEEP_SEL=['.hopae','.ilju','.talis']  # 그림(사물 모양)은 그대로
pat=re.compile(r'(border(?:-(?:top|bottom)-(?:left|right))?-radius)\s*:\s*([^;}"\'`]+)')
def block(s,i):
    a=max(s.rfind('{',0,i),s.rfind('style="',0,i),s.rfind("cssText='",0,i),s.rfind('}',0,i)+1)
    b=min([x for x in [s.find('}',i),s.find('"',i)] if x>0] or [len(s)])
    sel_start=s.rfind('}',0,a); sel=s[sel_start+1:a]
    return s[a:b], sel
for f in FILES:
    s=open(f,encoding='utf-8').read(); out=[]; last=0; n0=n1=n2=0
    for m in pat.finditer(s):
        v=m.group(2).strip(); blk,sel=block(s,m.start())
        new=None
        if v in ('0','inherit') or v.startswith('50%') or v=='100%': n0+=1; continue
        if any(k in sel for k in KEEP_SEL): n0+=1; continue
        w=re.search(r'(?<![-\w])width:\s*([\d.]+)px',blk); h=re.search(r'(?<![-\w])height:\s*([\d.]+)px',blk)
        sq=(w and h and w.group(1)==h.group(1)) or re.search(r'aspect-ratio:\s*1(\s*/\s*1)?\s*[;}]',blk)
        num=re.match(r'([\d.]+)px$',v)
        if sq and num and float(num.group(1))>=float(w.group(1) if w else 0)/2-0.5 if (sq and num) else False:
            new='50%'; n1+=1
        elif sq and v in ('999px','9999px'): new='50%'; n1+=1
        else: new='0'; n2+=1
        out.append(s[last:m.start()]+m.group(1)+':'+new); last=m.end()
    out.append(s[last:]); s2=''.join(out)
    open(f,'w',encoding='utf-8').write(s2); print(f,'keep',n0,'circle',n1,'square',n2)
