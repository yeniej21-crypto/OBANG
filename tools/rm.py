import json
X=[24,206,388,570]
bands=[
 ("p1","오픈 준비","10/3 – 11/26",["세계관 바이블 1판","가격 · 묶음 확정","결과 전달 · 보관함","메뉴 지표 다섯 칸","오프닝 두 갈래"],"11/26 오픈","막차 12/3"),
 ("p2","연말연초 성수기","11/26 – 2/6",["신년 운세 캐릭터별","선물하기","맞춤 달력 · 부적","평생 사주 책","「오방 야담」 연재","회원제(1월)"],"2/6 음력 설","영어 무료 3종 시작"),
 ("p3","해외 정식","2/6 – 4월",["영어 유료 메뉴","해외 결제 · 이메일","영어 숏폼 매일","이모티콘 제안"],"4월 영어 정식","유료 결제 열림"),
 ("p4","확장","5월 – 10월",["연재 IP 플랫폼","오프라인 팝업","협업 · B2B","일본 진출 검토"],"10월 1년 점검","다음 해 전략"),
]
parts=[]
for i,(k,name,date,lines,g1,g2) in enumerate(bands):
    x=X[i]; cx=x+83; main=(i==0)
    s=f"<g data-claude-anchor='{k}'>{{band({x},{str(main).lower()})}}"
    s+=f"<text data-claude-text-id='{k}-name' x='{cx}' y='84' textAnchor='middle' fontSize='14' fontWeight='600' fill={{ink}}>{name}</text>"
    s+=f"<text data-claude-text-id='{k}-date' x='{cx}' y='104' textAnchor='middle' fontSize='11.5' fill={{quiet}}>{date}</text>"
    for j,l in enumerate(lines):
        s+=f"<text data-claude-text-id='{k}-l{j+1}' x='{x+14}' y='{142+j*22}' fontSize='12.5' fill={{ink}}>{l}</text>"
    s+=f"{{gate({x})}}<text data-claude-text-id='{k}-gate' x='{x+34}' y='{318}' fontSize='13' fontWeight='600' fill={{ink}}>{g1}</text>"
    s+=f"<text data-claude-text-id='{k}-crit' x='{x+34}' y='{338}' fontSize='11.5' fill={{quiet}}>{g2}</text></g>"
    parts.append(s)
arrows="<g data-claude-anchor='flow' fill='none' stroke={edge} strokeWidth='1.25'>"+"".join(f"<path d='M{X[i]+166+2} 94H{X[i+1]-2}' markerEnd='url(#rm-arrow)'/>" for i in range(3))+"</g>"
code=("export default () => { const edge = 'var(--cds-chart-axis)', rule = 'var(--cds-chart-grid)', accent = 'var(--cds-chart-categorical-1)', ink = 'var(--cds-text-primary)', quiet = 'var(--cds-text-secondary)'; "
 "const band = (x, main) => <g><rect x={x} y='56' width='166' height='300' rx='8' fill={main ? accent : 'none'} fillOpacity={main ? 0.1 : 1} stroke={main ? accent : edge} strokeWidth={main ? 2 : 1.25}/><line x1={x + 12} y1='118' x2={x + 154} y2='118' stroke={rule}/><line x1={x + 12} y1='292' x2={x + 154} y2='292' stroke={rule}/></g>; "
 "const gate = x => <path d={`M${x + 20} 306l8 8l-8 8l-8 -8z`} fill={accent}/>; "
 "return <svg viewBox='0 0 760 380' role='img' aria-label='오픈에서 해외 정식까지 여섯 달, 그 뒤 반년은 확장' fontSize='13'><defs><marker id='rm-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M0 0L10 5L0 10z' fill={edge}/></marker></defs>"
 "<text data-claude-text-id='title' x='24' y='34' fontSize='15' fontWeight='600' fill={ink}>오픈에서 해외 정식까지 여섯 달, 그 뒤 반년은 확장</text>"
 + arrows + "".join(parts) + "</svg>; };")
assert '"' not in code
json.dump(code,open('/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/rm_code.json','w'),ensure_ascii=False)
print(code)
