import re, base64, io
from PIL import Image
B='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/'
s=open(B+'export/AI사주서비스_사업계획서.html').read()

def img(path,w=380,q=80,crop=None):
    im=Image.open(B+path).convert('RGB')
    if crop: im=im.crop(crop)
    if im.width>w: im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    b=io.BytesIO(); im.save(b,'JPEG',quality=q,optimize=True,progressive=True)
    return 'data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()

def rep(old,new,count=1):
    global s
    assert s.count(old)>=1, ('NOT FOUND',old[:80])
    s=s.replace(old,new,count)

LOGO='<svg class="logo" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="#A8802F" stroke-linecap="round" stroke-linejoin="round"><circle cx="50" cy="50" r="44" stroke-width="2.6"/><path d="M28 29 H72" stroke-width="5.6"/><path d="M47 29 L41 71" stroke-width="5.6"/><path d="M33 49 H64 L61 71" stroke-width="5.6"/><path d="M22 71 H78" stroke-width="5.6"/></g></svg>'

# ---------- CSS 추가 ----------
rep('</style>','''.doc-title .en{display:flex;align-items:center;gap:.28em}
.doc-title .en .logo{width:.82em;height:.82em;flex:0 0 auto}
.brandbox{display:grid;grid-template-columns:150px 1fr;gap:28px;align-items:center;border:3px solid var(--ink);padding:26px 28px;margin:20px 0;background:var(--highlight)}
.brandbox .logo{width:120px;height:120px}
.brandbox .nm{font-family:var(--serif);font-size:40px;font-weight:700;letter-spacing:.06em;line-height:1}
.brandbox .nm small{display:block;font-family:var(--font);font-size:22px;font-weight:900;letter-spacing:0;margin-top:8px}
.brandbox p{font-size:15.5px;color:var(--ink-soft);margin-top:12px;line-height:1.55}
@media (max-width:600px){.brandbox{grid-template-columns:1fr;gap:12px;padding:18px}.brandbox .logo{width:84px;height:84px}.brandbox .nm{font-size:30px}}
.shots{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:20px 0}
@media (max-width:900px){.shots{grid-template-columns:repeat(2,1fr)}}
.shot{border:3px solid var(--ink);background:#000;display:flex;flex-direction:column;min-width:0}
.shot .ph{aspect-ratio:9/16;overflow:hidden}
.shot .ph img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.shot .cap{background:#fff;border-top:3px solid var(--ink);padding:10px 12px;font-size:14px;font-weight:900;line-height:1.3}
.shot .cap small{display:block;font-size:12px;font-weight:600;color:var(--g500);margin-top:3px}
.shot .num{position:relative}
.hostgrid{display:grid;grid-template-columns:1fr 1fr;gap:0;border:3px solid var(--ink);margin:20px 0}
.hostgrid>div{display:grid;grid-template-columns:140px 1fr;gap:18px;padding:20px;border-right:1px solid var(--line)}
.hostgrid>div:last-child{border-right:0}
.hostgrid img{width:140px;aspect-ratio:3/4;object-fit:cover;object-position:center 20%;border:2px solid var(--ink);display:block}
@media (max-width:760px){.hostgrid{grid-template-columns:1fr}.hostgrid>div{border-right:0;border-bottom:1px solid var(--line);grid-template-columns:100px 1fr;gap:12px;padding:14px}.hostgrid>div:last-child{border-bottom:0}.hostgrid img{width:100px}}
.tl.t5{grid-template-columns:repeat(5,1fr)}
@media (max-width:900px){.tl.t5{grid-template-columns:1fr 1fr}}
@media (max-width:440px){.tl.t5{grid-template-columns:1fr}}
.gl{display:grid;grid-template-columns:260px 1fr;gap:28px;align-items:start}
@media (max-width:820px){.gl{grid-template-columns:1fr}}
.gl .pair{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.gl .pair img{width:100%;aspect-ratio:9/16;object-fit:cover;object-position:top;border:3px solid var(--ink);display:block;background:#000}
@media (max-width:820px){.gl .pair{max-width:420px}}
</style>''')

# ---------- 제목·머리 ----------
rep('<title>AI 사주 서비스 사업계획서</title>','<title>오방사주 사업계획서</title>')
rep('<a class="brand" href="#top">Saju × IP</a>','<a class="brand" href="#top">OBANG SAJU</a>')
rep('<div class="doc-meta"><span>신규사업 계획서</span><span class="conf">2026.09</span></div>','<div class="doc-meta"><span>신규사업 계획서 · 최종</span><span class="conf">2026.09</span></div>')
rep('<span class="en">Saju × Character IP</span>',f'<span class="en">{LOGO}OBANG SAJU</span>')
rep('캐릭터 IP와 앱 구독 구조로 만드는 <span class="brand">2030 여성 대상 AI 사주 서비스</span>','캐릭터 IP와 앱 구독으로 만드는 AI 사주 서비스 <span class="brand">오방사주</span>')
rep('신규 사업 추진안. 2027년 1분기 서비스 오픈을 목표로 한다.','신규 사업 추진안. 2027년 1분기 국내 오픈 후, 같은 캐릭터와 엔진으로 영어권에 "K-사주"를 내보낸다.')
rep('<div class="kv-row"><div class="kv-key">제작 방식</div><div class="kv-val">기획·마케팅·AI 비주얼 내부 제작 / 디자인·개발 외주 (AI 기반 개발)</div></div>',
    '<div class="kv-row"><div class="kv-key">제작 방식</div><div class="kv-val">기획·마케팅·AI 비주얼 내부 제작 / 디자인·개발 외주 (AI 기반 개발)</div></div>\n      <div class="kv-row"><div class="kv-key">해외 진출</div><div class="kv-val"><em>2027년 하반기 영어판 오픈</em> (도화 사주 영어판부터)</div></div>\n      <div class="kv-row"><div class="kv-key">현재 단계</div><div class="kv-val">주요 메뉴 체험판(프로토타입) 제작 완료 · 영어판 포함</div></div>')

# ---------- 01 개요 ----------
rep('<p class="lead">사주 데이터를 기반으로','<p class="lead"><strong>오방사주</strong>는 사주 데이터를 기반으로')
rep('<b>진단 · 무료</b>입사 카드에서','<b>진단 · 무료</b>수호신 카드에서')
old11=s[s.index('<div class="sub-title"><span class="sn">1.1</span>사업 목표</div>'):]
old11=old11[:old11.index('</div>\n  </div>')+len('</div>\n  </div>')]
new11='''<div class="sub-title"><span class="sn">1.1</span>사업 목표</div>
    <div class="cols c4">
      <div><div class="col-label">2027 1Q</div><div class="col-title">국내 서비스 오픈</div><div class="col-content">웹 선오픈 후 앱 출시. 고객획득비용·결제전환율 실측</div></div>
      <div><div class="col-label">1년 차</div><div class="col-title">연 매출 15억 원</div><div class="col-content">단건 상담 중심으로 광고비 대비 매출 2배 이상 구조 확인, 오픈 후 광고 단계 증액</div></div>
      <div><div class="col-label">2027 하반기</div><div class="col-title">영어판 오픈</div><div class="col-content">도화 사주 영어판으로 영어권 "K-사주" 시장 진입. 국내와 같은 캐릭터·엔진 사용</div></div>
      <div class="hl"><div class="col-label">3년 차</div><div class="col-title">연 매출 100억 원</div><div class="col-content">구독·팬덤 비중 확대, 해외 매출 비중 15%, 캐릭터 IP 확장 수익 개시</div></div>
    </div>
  </div>'''
rep(old11,new11)
old13=s[s.index('<div class="sub-title"><span class="sn">1.3</span>서비스 명칭·포지셔닝 (검토 중)</div>'):]
old13=old13[:old13.index('</section>')]
new13=f'''<div class="sub-title"><span class="sn">1.3</span>서비스 명칭 · 브랜드 (확정)</div>
    <div class="brandbox">{LOGO}<div><div class="nm">OBANG SAJU<small>오방사주</small></div><p>오방(五方)은 동·서·남·북·중앙의 다섯 방위이자 목·화·토·금·수 다섯 기운. 사주의 오행과 그 기운을 지키는 다섯 수호신을 한 이름에 담았다. 로고는 원 안에 다시 그린 "五" 모노그램, 단색 골드. 해외에서도 같은 이름 <strong>OBANG SAJU</strong>를 쓴다.</p></div></div>
    <div class="cols c2">
      <div><div class="col-label">포지셔닝</div><div class="col-content"><strong>캐릭터가 풀어주는 사주 + 근거를 보여주는 정통 풀이.</strong> 연애·궁합은 캐릭터 상품으로 가볍고 몰입감 있게, 신년운세·택일은 정통 톤으로 신뢰를 준다</div></div>
      <div><div class="col-label">한 줄 메시지</div><div class="col-content"><strong>"네 사주, 한 칸이 비어 있어. 그 빈자리, 신이 채워줄게."</strong> 오프닝부터 광고까지 같은 메시지로 간다</div></div>
    </div>
  </div>
'''
rep(old13,new13)

# ---------- 03 ----------
rep('당사 (서하 + 오방신수)</text>','오방사주</text>')

# ---------- 04 ----------
rep('<p class="section-sum">세계관 · 대표 캐릭터 윤서하 · 오방신수 5인 · 할매 · 프로토타입 비주얼</p>','<p class="section-sum">세계관 · 대표 캐릭터 윤서하 · 오방신수 5인 · 삼신 할매 · 메뉴를 맡는 캐릭터 · 비주얼</p>')
rep('<div class="sub-title"><span class="sn">4.3</span>할매 — 오방신 위의 존재 (서하의 스승이자 회사의 회장)</div>','<div class="sub-title"><span class="sn">4.3</span>삼신 할매 — 오방신 위의 존재 (확정)</div>')
rep('시즌 상품(신년·대운)과 세계관의 신비 요소를 담당하며, 세계관 적합도는 <strong>삼신 리부트</strong>가 가장 높다. 집시·구미호는 해외판·스핀오프 캐릭터로 활용.',
    '세 후보 중 세계관 적합도가 가장 높은 <strong>삼신 리부트로 확정</strong>했다. 신년운세 등 정통 풀이를 진행하며, 집시·구미호는 해외판·스핀오프 캐릭터 후보로 보관한다.')
rep('<div class="col-label">후보 B · 세계관 적합</div>','<div class="col-label">확정 · 삼신 할매</div>')
rep('<div class="col-label">후보 A</div>','<div class="col-label">보관 · 해외판 후보</div>')
rep('<div class="col-label">후보 C</div>','<div class="col-label">보관 · 스핀오프 후보</div>')
i44=s.index('<div class="sub-title"><span class="sn">4.4</span>프로토타입 비주얼 (1차 시안)</div>')
i44=s.rfind('<div class="sub">',0,i44)
hosts=f'''<div class="sub">
    <div class="sub-title"><span class="sn">4.4</span>메뉴를 맡는 캐릭터</div>
    <p class="para">메뉴마다 가장 어울리는 캐릭터가 진행한다. 들어오면 그 캐릭터가 짧은 영상으로 직접 말을 걸고, 풀이도 그 캐릭터의 말투로 전달한다.</p>
    <div class="hostgrid">
      <div><img src="{img('proto/img/taeo/base.jpg',300)}" alt="태오"><div><div class="col-label" style="font-size:13px;letter-spacing:.08em;color:var(--pink);font-weight:900">桃花 · 도화</div><div class="col-title" style="font-size:20px;font-weight:900;margin:4px 0 8px">태오</div><div class="col-content" style="font-size:15px;line-height:1.5;color:var(--ink-soft)">"누나"라고 부르는 연하남. 도화 사주·도화 궁합을 진행하고, 결제 후 음성 편지를 보낸다. 영어판의 얼굴</div></div></div>
      <div><img src="{img('proto/img/taegil.jpg',300)}" alt="월하"><div><div class="col-label" style="font-size:13px;letter-spacing:.08em;color:var(--accent);font-weight:900">擇日 · 택일</div><div class="col-title" style="font-size:20px;font-weight:900;margin:4px 0 8px">월하</div><div class="col-content" style="font-size:15px;line-height:1.5;color:var(--ink-soft)">나침반을 든 택일 명인. 이사·계약·고백·면접 등 목적에 맞는 날을 골라준다. 정통 섹션 담당</div></div></div>
    </div>
    <div class="gt" style="--cols:1fr 1fr 1.4fr">
      <div class="gt-row head"><div class="c">메뉴</div><div class="c">진행 캐릭터</div><div class="c">톤</div></div>
      <div class="gt-row"><div class="c label">오늘의 운세 · 상담</div><div class="c" data-l="진행">윤서하</div><div class="c" data-l="톤">직설적인 인생 선배</div></div>
      <div class="gt-row"><div class="c label">도화 사주 · 도화 궁합</div><div class="c" data-l="진행">태오</div><div class="c" data-l="톤">설레는 연애 코드</div></div>
      <div class="gt-row"><div class="c label">커리어 사주</div><div class="c" data-l="진행">도준 (黃龍 · 土)</div><div class="c" data-l="톤">듬직한 리더</div></div>
      <div class="gt-row"><div class="c label">2027 신년운세 · 택일</div><div class="c" data-l="진행">삼신 할매 · 월하</div><div class="c" data-l="톤">정통, 근거 중심</div></div>
      <div class="gt-row hl"><div class="c label">자유 상담</div><div class="c" data-l="진행">8명 중 선택</div><div class="c" data-l="톤">내 수호신을 추천</div></div>
    </div>
  </div>

  '''
s=s[:i44]+hosts+s[i44:]
rep('<div class="sub-title"><span class="sn">4.4</span>프로토타입 비주얼 (1차 시안)</div>','<div class="sub-title"><span class="sn">4.5</span>캐릭터 비주얼 (1차 시안)</div>')

# ---------- 05 컨셉 옵션 → 콘텐츠 형식 ----------
rep('<h2 class="section-title">검토 중인 컨셉 옵션</h2>','<h2 class="section-title">콘텐츠 형식</h2>')
rep('<p class="section-sum">세계관은 고정하고, 주력 형식은 소재 테스트로 확정한다</p>','<p class="section-sum">기본형과 1차 형식은 체험판으로 구현을 마쳤고, 나머지는 오픈 후 시즌 상품으로 확장한다</p>')
rep('<span class="tag ac">기본 채택</span>','<span class="tag ac">채택 · 구현 완료</span>')
rep('<span class="tag pk">1차 테스트</span><span class="meter">난이도 <i class="on"></i><i class="on"></i><i></i></span><span>바이럴 · IP 확장 연결</span>','<span class="tag pk">구현 완료</span><span>도화 사주 결제 후 태오의 음성 편지로 구현</span>')
rep('<span class="tag pk">1차 테스트</span><span class="meter">난이도 <i class="on"></i><i></i><i></i></span><span>주력 수요 직결</span>','<span class="tag pk">구현 완료</span><span>상대 생년월일로 속마음 리포트 · 29,000원</span>')
rep('<span class="tag lt">옵션 유지</span><span class="meter">난이도 <i class="on"></i><i class="on"></i><i class="on"></i></span><span>시즌제 재유입</span>','<span class="tag lt">오픈 후 시즌</span><span>시즌제 재유입</span>')
rep('<span class="tag lt">옵션 유지</span><span class="meter">난이도 <i class="on"></i><i class="on"></i><i class="on"></i></span><span>개인화 포스터 바이럴</span>','<span class="tag lt">오픈 후 시즌</span><span>개인화 포스터 바이럴</span>')
rep('<div class="hl"><div class="col-label">테스트 설계</div><div class="col-content">A를 기본으로 <strong>B·E를 우선 검증</strong>, C·D는 키비주얼과 훅만으로 반응을 본다. 옵션별 광고 소재를 소규모 집행하고 사전예약 랜딩의 입력률·사전결제율·타깃 인터뷰로 주력 형식 2종을 확정</div></div>',
    '<div class="hl"><div class="col-label">다음 단계</div><div class="col-content">체험판과 숏폼 광고로 <strong>오픈 전 소재 테스트</strong>를 진행해 주력 훅을 확정한다. C·D는 오픈 후 시즌 상품으로 순차 출시</div></div>')

# ---------- 06 서비스 구성 ----------
a=s.index('<div class="gt" style="--cols:130px 1.2fr 130px 1.6fr">'); b=s.index('<div class="note"><span class="note-label">추후 확장 수익 모델</span>')
s=s[:a]+'''<div class="gt" style="--cols:130px 1.2fr 150px 1.6fr">
    <div class="gt-row head"><div class="c">구분</div><div class="c">상품</div><div class="c">가격</div><div class="c">내용</div></div>
    <div class="gt-row"><div class="c" data-l="구분"><span class="tag lt">무료</span></div><div class="c label">수호신 카드 · 오늘의 운세</div><div class="c r" data-l="가격">0원</div><div class="c" data-l="내용">내 사주에 비어 있는 기운과 수호신 배정(공유 카드). 매일 일진으로 보는 오늘의 운세와 수호신의 개운 한 줄</div></div>
    <div class="gt-row hl"><div class="c" data-l="구분"><span class="tag ac">단건 상담</span></div><div class="c label">그 사람 속마음 · 재회 · 다음 연애</div><div class="c r" data-l="가격">29,000원</div><div class="c" data-l="내용">서하와 수호신이 진행하는 웹툰형 상담 리포트. 결론·시기·12개월 흐름 + <strong>개운 처방</strong>. <strong>주력 수익</strong></div></div>
    <div class="gt-row"><div class="c" data-l="구분"><span class="tag pk">캐릭터 상품</span></div><div class="c label">도화 사주 · 도화 궁합 · 커리어 사주</div><div class="c r" data-l="가격">14,900~19,900원</div><div class="c" data-l="내용">태오의 도화 지수·인연 달력·음성 편지, 친구 초대형 궁합, 도준의 일 유형·이직 타이밍. <strong>팬덤·바이럴 담당</strong></div></div>
    <div class="gt-row"><div class="c" data-l="구분"><span class="tag">정통 풀이</span></div><div class="c label">2027 신년운세 · 택일</div><div class="c r" data-l="가격">9,900~19,900원</div><div class="c" data-l="내용">삼신 할매의 12개월 풀이(문장마다 근거 표시), 월하의 목적별 길일. <strong>신뢰·시즌 수요</strong></div></div>
    <div class="gt-row"><div class="c" data-l="구분"><span class="tag">구독</span></div><div class="c label">개운 멤버십 · 캐릭터 대화</div><div class="c r" data-l="가격">월 9,900원</div><div class="c" data-l="내용"><strong>매일 개운 미션</strong>과 기운 게이지, 중요한 날 예고 알림, 캐릭터에게 직접 묻는 대화. <strong>반복 수익</strong></div></div>
    <div class="gt-row"><div class="c" data-l="구분"><span class="tag ac">해외</span></div><div class="c label">영어판 · Peach Blossom Saju</div><div class="c r" data-l="가격">$9.99</div><div class="c" data-l="내용">도화 사주 영어판. 태오의 한국어 음성 + 영어 자막, 출생 도시 기준 시간 보정</div></div>
  </div>
  '''+s[b:]
rep('개운 아이템·굿즈(오방색 부적 키링·팔찌, 포토카드 등 실물 IP 상품), 리얼리티·드라마 시즌 상품, 전문가 상담 연결, 해외판.','개운 아이템·굿즈(오방색 부적 키링·팔찌, 포토카드 등 실물 IP 상품), 리얼리티·드라마 시즌 상품, 전문가 상담 연결, 해외 다국어판.')
rep('<div><b>입사</b>생년월일시 · 고민 · 상황 한 줄</div>','<div><b>입장</b>오프닝 · 생년월일시 · 고민</div>')
rep('<div><b>무료 카드</b>사주 요약 + 최애 배정 (공유)</div>','<div><b>수호신 카드</b>사주 요약 + 수호신 배정 (공유)</div>')

# ---------- 07 프로토타입 (신규) ----------
shots=[('opv3/t3.png','오프닝 · 오방의 문','다섯 수호신이 차례로 깨어남'),('r0.png','홈','오늘의 운세 · 메뉴 카탈로그'),('opv3/mi1.png','메뉴 인트로','캐릭터가 음성으로 말을 검'),('t_out0.png','오늘의 운세','일진 × 내 사주, 근거 표시'),
       ('c_out0.png','커리어 사주','일 유형 · 능력치 · 이직 시기'),('dtest/s2.png','도화 사주','태오와 채팅하듯 입력'),('ch0.png','자유 상담','8명 중 골라서 대화'),('p0.png','영어판','Peach Blossom Saju')]
sh=''.join(f'<div class="shot"><div class="ph"><img src="{img(p,360,78)}" alt="{t}"></div><div class="cap">{t}<small>{c}</small></div></div>' for p,t,c in shots)
proto_sec=f'''<!-- PROTO -->
<section class="section" id="sP">
  <div class="section-head"><span class="section-num">00</span><h2 class="section-title">체험판 구현 현황</h2></div>
  <p class="section-sum">기획서의 서비스를 실제로 동작하는 체험판으로 먼저 만들었다</p>
  <p class="lead">생년월일 입력부터 만세력 계산, 캐릭터 음성 영상, 결제 직전 화면까지 이어지는 <strong>체험판(프로토타입)</strong>을 완성했다. 휴대폰으로 서비스의 완성 형태를 그대로 시연할 수 있다.</p>
  <div class="shots">{sh}</div>
  <div class="gt" style="--cols:200px 1.6fr">
    <div class="gt-row head"><div class="c">영역</div><div class="c">구현 내용</div></div>
    <div class="gt-row hl"><div class="c label">오프닝 · 온보딩</div><div class="c" data-l="내용">"오방의 문" 오프닝(다섯 수호신 영상·배경음), 캐릭터가 음성으로 진행하는 생년월일 입력, 비어 있는 기운의 수호신 배정</div></div>
    <div class="gt-row"><div class="c label">캐릭터 메뉴</div><div class="c" data-l="내용">오늘의 운세 · 도화 사주 · 도화 궁합(친구 초대) · 커리어 사주 · 그 사람 속마음. 메뉴마다 캐릭터 인트로 영상</div></div>
    <div class="gt-row"><div class="c label">정통 메뉴</div><div class="c" data-l="내용">2027 신년운세(원국·대운·12개월 흐름, 문장마다 근거 표시) · 택일</div></div>
    <div class="gt-row"><div class="c label">AI 대화</div><div class="c" data-l="내용">캐릭터 8명 중 골라 대화. 내 사주 계산값을 근거로 답하고, 근거를 함께 보여준다</div></div>
    <div class="gt-row"><div class="c label">리텐션 · 결제</div><div class="c" data-l="내용">아침 푸시 → 개운 미션 → 기운 게이지 흐름, 상품별 결제 화면, 결과 공유 카드</div></div>
    <div class="gt-row"><div class="c label">해외판 · 광고</div><div class="c" data-l="내용">영어판 도화 사주(출생 도시 기준 시간 보정), 숏폼 광고 소재 5종</div></div>
  </div>
  <div class="note"><span class="note-label">사주 계산</span>체험판은 절기 시각과 음력 변환까지 반영한 <strong>자체 만세력</strong>으로 실제 결과를 낸다. 정식 오픈 전 상용 사주 데이터와 교차 검증하고 명리 전문가 감수를 거친다.</div>
</section>

'''
i=s.index('<!-- 07 -->'); s=s[:i]+proto_sec+s[i:]

# ---------- 07 AI 범위 ----------
rep('<div class="gt-row"><div class="c code" style="font-size:20px;padding-top:22px">2단계<br><small style="font-family:var(--font);font-size:11px;color:var(--g500)">앱 출시 후</small></div><div class="c label">캐릭터 영상</div><div class="c" data-l="내용">서하·멤버의 말하는 영상(립싱크), 광고용 숏폼. 개인화 영상은 템플릿 영상 + 음성만 교체</div>',
    '<div class="gt-row hl"><div class="c code" style="font-size:20px;padding-top:22px">1단계<br><small style="font-family:var(--font);font-size:11px;color:var(--g500)">체험판 구현</small></div><div class="c label">캐릭터 영상</div><div class="c" data-l="내용">서하·멤버의 말하는 영상(립싱크), 오프닝·메뉴 인트로, 광고용 숏폼. 개인화 영상은 템플릿 영상 + 음성만 교체</div>')
rep('<div class="gt-row"><div class="c code" style="font-size:20px;padding-top:22px">2단계</div><div class="c label">캐릭터 챗</div><div class="c" data-l="내용">서하와의 대화(구독). 사주 데이터와 캐릭터 설정을 컨텍스트로 유지</div>',
    '<div class="gt-row hl"><div class="c code" style="font-size:20px;padding-top:22px">1단계<br><small style="font-family:var(--font);font-size:11px;color:var(--g500)">체험판 구현</small></div><div class="c label">캐릭터 대화</div><div class="c" data-l="내용">캐릭터를 골라 대화(구독). 내 사주 계산값과 캐릭터 설정을 근거로 답변</div>')
rep('<div class="c code" style="font-size:20px;padding-top:22px">1단계<br><small style="font-family:var(--font);font-size:11px;color:var(--g500)">런칭 필수</small></div>','<div class="c code" style="font-size:20px;padding-top:22px">1단계<br><small style="font-family:var(--font);font-size:11px;color:var(--g500)">런칭 포함</small></div>')
rep('<p class="section-sum">런칭에 필요한 것만 먼저 만들고, 나머지는 순차 도입한다</p>','<p class="section-sum">영상·대화까지 체험판으로 검증을 마쳤다. 음원·아바타는 오픈 후 순차 도입한다</p>')

# ---------- 08 마케팅 ----------
rep('<div class="sub">\n    <div class="sub-title"><span class="sn">8.1</span>연간 운영 리듬</div>','''<div class="note"><span class="note-label">광고 소재 제작 완료</span>캐릭터 숏폼 광고 <strong>5종</strong>을 이미 만들었다. 도화 유형 퀴즈, 궁합 공개, "만나면 안 되는 남자", 새벽 2시 "자니?" 연락 등 연애 불안을 건드리는 훅으로, 오픈 전 소재 테스트에 바로 쓴다.</div>
  <div class="sub">
    <div class="sub-title"><span class="sn">8.1</span>연간 운영 리듬</div>''')

# ---------- 해외 진출 (신규) ----------
gl=f'''<!-- GLOBAL -->
<section class="section" id="sG">
  <div class="section-head"><span class="section-num">00</span><h2 class="section-title">해외 진출 — 영어권 K-사주</h2></div>
  <p class="section-sum">국내와 같은 캐릭터·계산 엔진·영상을 쓰고 언어만 바꿔 영어권에 낸다</p>
  <p class="lead">K-팝·K-드라마로 한국 문화를 소비하는 영어권 2030에게, 별자리보다 개인적인 <strong>"K-사주"</strong>를 판다. 첫 상품은 전 세계 공통 수요인 연애 — <strong>도화 사주 영어판 "Peach Blossom Saju"</strong>.</p>
  <div class="stats four">
    <div><div class="v">90<small>억 달러</small></div><div class="l">글로벌 점성술 앱 시장 (2030)</div><div class="s">2024년 30억 달러 · 연 20% 성장 전망</div></div>
    <div><div class="v">2.25<small>억 명</small></div><div class="l">전 세계 한류 팬</div><div class="s">미주 1년 새 약 80% 증가 · 2023년 말</div></div>
    <div><div class="v">37.8<small>%</small></div><div class="l">한류 관광 수출 증가율</div><div class="s">"케이팝 데몬 헌터스" 영향 · 2025년</div></div>
    <div><div class="v">$9.99</div><div class="l">첫 상품가</div><div class="s">도화 사주 영어판 · 결제 후 영어 편지</div></div>
  </div>

  <div class="sub">
    <div class="sub-title"><span class="sn">0.1</span>왜 K-사주인가</div>
    <div class="cols c3">
      <div><div class="col-label">더 개인적인 운세</div><div class="col-title">12별자리가 아니라 8글자</div><div class="col-content">서양 점성술 앱 사용자는 이미 "나를 설명해 주는 운세"에 돈을 낸다. 사주는 태어난 연·월·일·시 8글자로 풀어 별자리보다 훨씬 개인적이다</div></div>
      <div><div class="col-label">K-컬처가 만든 관심</div><div class="col-title">무당·신점이 콘텐츠가 됐다</div><div class="col-content">"케이팝 데몬 헌터스"와 K-드라마로 한국 무속·신점이 익숙해졌고, 명동·홍대에서 사주·신점을 체험하는 외국인 관광객이 눈에 띄게 늘었다</div></div>
      <div class="hl"><div class="col-label">비어 있는 자리</div><div class="col-title">캐릭터 IP를 가진 영어 사주가 없다</div><div class="col-content">영어 사주 앱은 소규모 개인 앱 위주다. 캐릭터·영상·브랜드를 갖춘 사업자는 아직 보이지 않는다</div></div>
    </div>
  </div>

  <div class="sub">
    <div class="sub-title"><span class="sn">0.2</span>현지화 방식 — 영어판 체험판 구현 완료</div>
    <div class="gl">
      <div class="pair"><img src="{img('p0.png',300,78)}" alt="영어판 시작 화면"><img src="{img('p5_0.png',300,78)}" alt="영어판 결과 화면"></div>
      <div class="kv" style="margin:0">
        <div class="kv-row"><div class="kv-key">캐릭터</div><div class="kv-val">태오의 <em>한국어 음성 + 영어 자막</em>. K-드라마를 보는 방식 그대로. "noona" 호칭을 고를 수 있다</div></div>
        <div class="kv-row"><div class="kv-key">정확도</div><div class="kv-val">출생 도시 65곳 기준으로 시간을 보정해 <em>해외 출생자도 정확한 사주</em>를 낸다</div></div>
        <div class="kv-row"><div class="kv-key">표현</div><div class="kv-val">"What is Saju" 안내, Peach Blossom Index 등 영어 용어, 영어 편지·공유 카드</div></div>
        <div class="kv-row"><div class="kv-key">결제</div><div class="kv-val">달러 가격, 해외 간편결제·카드</div></div>
        <div class="kv-row"><div class="kv-key">제작비</div><div class="kv-val">캐릭터·영상·계산 엔진을 국내와 공유. <strong>추가 비용은 번역·현지 광고 중심</strong></div></div>
      </div>
    </div>
  </div>

  <div class="sub">
    <div class="sub-title"><span class="sn">0.3</span>진출 순서</div>
    <div class="flow f4">
      <div class="hl"><b>영어판 웹 오픈</b>2027 하반기. 도화 사주 영어판, 미국 등 영어권 SNS 광고 테스트</div>
      <div><b>상품 확대</b>궁합 · 연간 운세 · 캐릭터 대화 영어판</div>
      <div><b>앱 · 구독</b>글로벌 앱스토어 출시, 개운 멤버십 영어판</div>
      <div><b>다국어</b>반응을 보고 일본어 등 순차 확대</div>
    </div>
    <div class="note warm"><span class="note-label">해외 매출 목표</span>2년 차 3억 원, <strong>3년 차 15억 원(전체 매출의 15%)</strong>. 국내 광고 구조를 그대로 옮기되, 영어권 광고 단가와 전환율을 오픈 직후 실측해 증액 여부를 정한다.</div>
  </div>
</section>

'''
i=s.index('<!-- 09 -->'); s=s[:i]+gl+s[i:]

# ---------- 손익 ----------
rep('<div class="gt-row hl"><div class="c label">연 매출</div><div class="c r" data-l="1년 차"><strong>15.0</strong></div><div class="c r" data-l="2년 차"><strong>45.0</strong></div><div class="c r" data-l="3년 차"><strong>100.0</strong></div></div>',
    '<div class="gt-row hl"><div class="c label">연 매출</div><div class="c r" data-l="1년 차"><strong>15.0</strong></div><div class="c r" data-l="2년 차"><strong>45.0</strong></div><div class="c r" data-l="3년 차"><strong>100.0</strong></div></div>\n      <div class="gt-row"><div class="c label">그중 해외 <small>영어판</small></div><div class="c r" data-l="1년 차">테스트</div><div class="c r" data-l="2년 차">3.0</div><div class="c r" data-l="3년 차">15.0</div></div>')
rep('매출 = 단건 상담(광고 유입) + 구독·재구매(팬덤) + 시즌 상품.','매출 = 단건 상담(광고 유입) + 구독·재구매(팬덤) + 시즌 상품 + 해외판.')
rep('2년 차부터 구독·재구매 비중을 키워 광고비 대비 매출을 3.0배까지 끌어올린다.','2년 차부터 구독·재구매 비중을 키워 광고비 대비 매출을 3.0배까지 끌어올리고, 3년 차 매출 중 15억 원(15%)은 영어판 해외 매출로 채운다.')

# ---------- 일정 ----------
rep('<div class="tl">\n    <div><div class="m">2026.10~11</div><div class="ph">기획 확정</div><ul><li>컨셉·캐릭터·상품 구성 확정</li><li>소재 테스트로 주력 형식 결정</li>',
    '<div class="tl t5">\n    <div><div class="m">2026.10~11</div><div class="ph">기획 확정</div><ul><li>체험판·브랜드 완성 (완료)</li><li>체험판·숏폼으로 소재 테스트, 주력 훅 결정</li>')
rep('<li>굿즈·IP 확장 수익 검토</li></ul></div>\n  </div>','<li>굿즈·IP 확장 수익 검토</li></ul></div>\n    <div><div class="m">2027 하반기</div><div class="ph">해외 진출</div><ul><li>영어판 웹 오픈 (도화 사주)</li><li>영어권 SNS 광고 테스트</li><li>궁합·연간 운세 영어판 순차 추가</li></ul></div>\n  </div>')
rep('<div class="gt-row"><div class="c label">소재 테스트 광고비</div>','<div class="gt-row"><div class="c label">해외판 현지화</div><div class="c" data-l="내용">영어 번역·검수, 해외 결제, 영어권 광고 테스트</div><div class="c r" data-l="규모">500~1,000만 원</div></div>\n      <div class="gt-row"><div class="c label">소재 테스트 광고비</div>')
rep('<span>AI 사주 서비스 신규사업 계획서</span>','<span>OBANG SAJU · 오방사주 신규사업 계획서</span>')

# ---------- 섹션 재번호 ----------
parts=re.split(r'(<section class="section" id="[^"]+">)',s)
out=parts[0]; secs=[]; n=0
for k in range(1,len(parts),2):
    n+=1; head=parts[k]; body=parts[k+1]
    sid=re.search(r'id="([^"]+)"',head).group(1)
    title=re.search(r'<h2 class="section-title">(.*?)</h2>',body).group(1)
    body=re.sub(r'<span class="section-num">\d+</span>',f'<span class="section-num">{n:02d}</span>',body,1)
    body=re.sub(r'<span class="sn">\d+\.(\d+)</span>',lambda m:f'<span class="sn">{n}.{m.group(1)}</span>',body)
    secs.append((n,sid,title)); out+=head+body
s=out
short={'사업 개요':'개요','시장 분석':'시장','경쟁사 분석':'경쟁사','세계관과 캐릭터':'세계관','콘텐츠 형식':'형식','서비스 구성':'상품','체험판 구현 현황':'체험판','AI로 구현하는 범위':'AI','마케팅 전략':'마케팅','해외 진출 — 영어권 K-사주':'해외','제작 및 운영':'제작','수익 모델 및 손익 추정':'손익','추진 일정 및 소요 자원':'일정'}
nav=''.join(f'<a href="#{sid}">{n:02d} {short.get(t,t)}</a>' for n,sid,t in secs)
s=re.sub(r'(<a class="brand" href="#top">OBANG SAJU</a>)\s*\n\s*<a href="#s1">.*?</a>\s*\n',lambda m:m.group(1)+'\n    '+nav+'\n',s,1,flags=re.S)
toc=''.join(f'\n    <li><a href="#{sid}"><span class="num">{n:02d}</span>{t}</a></li>' for n,sid,t in secs)
s=re.sub(r'<ul class="toc-list">.*?\n  </ul>','<ul class="toc-list">'+toc+'\n  </ul>',s,1,flags=re.S)
s=re.sub(r'<!-- \d\d -->\n','',s)
s=s.replace('<!-- PROTO -->\n','').replace('<!-- GLOBAL -->\n','')
open(B+'export/오방사주_사업계획서.html','w').write(s)
print('sections',secs); print(len(s))
