import os
SP=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
B=open(SP+'/bk/lovemini.v-before-ys.html',encoding='utf-8').read().split('\n')
L=lambda a,b:'\n'.join(B[a-1:b])
blocks={'A':L(251,296),'B':L(314,316),'C':L(352,399),'D':L(402,404),'E':L(429,431),'F':L(486,523),'G':L(594,618)}
old='return {notes:[br,st,el],band,bandT:BAND[band],v,basis,sc}; }'
assert old in blocks['F']; blocks['F']=blocks['F'].replace(old,'return {notes:[br,st,el],band,bandT:BAND[band],v,basis,sc,ea,eb}; }')
t=open(SP+'/work/lovemini_tpl.html',encoding='utf-8').read()
for k,v in blocks.items():
  ph='/*@@%s@@*/'%k; assert t.count(ph)==1,k; t=t.replace(ph,v)
open(SP+'/proto/lovemini.html','w',encoding='utf-8').write(t); print('assembled',len(t))
