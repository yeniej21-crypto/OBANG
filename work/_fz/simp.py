import sys, math, array
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates
def dp(pts, tol):
    n=len(pts)
    if n<3: return list(range(n))
    keep=[False]*n; keep[0]=keep[-1]=True; st=[(0,n-1)]
    while st:
        a,b=st.pop(); ax,ay=pts[a]; bx,by=pts[b]; dx,dy=bx-ax,by-ay; L=math.hypot(dx,dy); md=-1; mi=-1
        for i in range(a+1,b):
            px,py=pts[i]
            d=abs(dy*(px-ax)-dx*(py-ay))/L if L else math.hypot(px-ax,py-ay)
            if d>md: md,mi=d,i
        if md>tol: keep[mi]=True; st+=[(a,mi),(mi,b)]
    return [i for i in range(n) if keep[i]]
def simplify(font, tol):
    g=font['glyf']; before=after=0
    for name in font.getGlyphOrder():
        gl=g[name]
        if gl.isComposite() or gl.numberOfContours<=0: continue
        co=list(gl.coordinates); fl=list(gl.flags); ends=gl.endPtsOfContours
        nc=[];nf=[];ne=[]; s=0
        for e in ends:
            c=co[s:e+1]; f=fl[s:e+1]; s=e+1; before+=len(c)
            if len(c)<=4: idx=list(range(len(c)))
            else:
                # split closed contour at point 0 and farthest point
                x0,y0=c[0]; far=max(range(len(c)),key=lambda i:(c[i][0]-x0)**2+(c[i][1]-y0)**2)
                p1=c[0:far+1]; p2=c[far:]+[c[0]]
                i1=dp(p1,tol); i2=[far+i for i in dp(p2,tol)][1:-1]
                idx=i1+i2
                if len(idx)<3: idx=list(range(len(c)))
            for i in idx: nc.append(c[i]); nf.append(f[i]&1)
            ne.append(len(nc)-1); after+=len(idx)
        gl.coordinates=GlyphCoordinates(nc); gl.flags=array.array('B',nf); gl.endPtsOfContours=ne
        gl.recalcBounds(g)
    return before,after
if __name__=='__main__':
    src,dst,tol,upm=sys.argv[1],sys.argv[2],float(sys.argv[3]),int(sys.argv[4])
    f=TTFont(src); print(simplify(f,tol))
    if upm and upm!=f['head'].unitsPerEm:
        from fontTools.ttLib.scaleUpem import scale_upem; scale_upem(f,upm)
    f.flavor='woff2' if dst.endswith('woff2') else None; f.save(dst)
