# 사업계획서 v2 (2026-10-01): 가격 계단 · 공유 할인 · 성공 사례 · 운영 방향 · 부가 수익 · 전체 캐릭터 시트 · 매출 18/60/150억
import re, base64, io, os
from PIL import Image
B='/tmp/claude-0/-home-claude/0e228c66-4315-5570-9f36-e479903d9e96/scratchpad/'
s=open(B+'export/오방사주_사업계획서.html',encoding='utf-8').read()
def img(path,w=240,q=78,crop=None):
    im=Image.open(B+path).convert('RGB')
    if crop: im=im.crop(crop)
    if im.width>w: im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    b=io.BytesIO(); im.save(b,'JPEG',quality=q,optimize=True,progressive=True)
    return 'data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()
def rep(old,new,count=1):
    global s
    assert s.count(old)>=1, ('NOT FOUND',old[:90]); s=s.replace(old,new,count)

# ---------- CSS ----------
rep('</style>','''.cast{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin:14px 0 22px}
@media (max-width:900px){.cast{grid-template-columns:repeat(3,1fr)}}
@media (max-width:560px){.cast{grid-template-columns:repeat(2,1fr)}}
.cast .cc{border:2px solid var(--ink);background:#fff;min-width:0}
.cast .cc img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;object-position:center 22%;border-bottom:2px solid var(--ink)}
.cast .cc.sq img{aspect-ratio:1;object-position:center 18%}
.cast .cc div{padding:9px 10px 11px}
.cast .cc b{display:block;font-size:15.5px;font-weight:900;line-height:1.25}
.cast .cc small{display:block;font-size:12.5px;font-weight:700;color:var(--c,var(--accent));margin-top:2px}
.cast .cc span{display:block;font-size:12.5px;color:var(--ink-soft);line-height:1.45;margin-top:5px}
.castLab{display:flex;align-items:baseline;gap:10px;margin-top:22px;font-size:16px;font-weight:900}
.castLab small{font-size:13px;font-weight:600;color:var(--g500)}
.ladder{display:grid;grid-template-columns:repeat(6,1fr);gap:0;border:3px solid var(--ink);margin:20px 0}
@media (max-width:900px){.ladder{grid-template-columns:repeat(3,1fr)}}
@media (max-width:560px){.ladder{grid-template-columns:1fr 1fr}}
.ladder>div{padding:16px 14px;border-right:1px solid var(--line);position:relative;min-width:0}
.ladder>div:last-child{border-right:0}
.ladder .st{font-size:12.5px;font-weight:900;color:var(--g500);letter-spacing:.04em}
.ladder .pr{font-size:24px;font-weight:900;margin:4px 0 8px;line-height:1.1}
.ladder .pr small{font-size:13px;font-weight:800}
.ladder p{font-size:13.5px;color:var(--ink-soft);line-height:1.5;margin:0}
.ladder .rl{margin-top:10px;font-size:12.5px;font-weight:800;color:var(--accent);border-top:1px solid var(--line);padding-top:8px}
.ladder>div.hl{background:var(--accent-soft)}
.ladder>div.pk{background:var(--pink-soft)}
.cases{display:grid;grid-template-columns:1fr 1fr;gap:0;border:3px solid var(--ink);margin:20px 0}
.cases>div{padding:22px;border-right:1px solid var(--line)}.cases>div:last-child{border-right:0}
@media (max-width:700px){.cases{grid-template-columns:1fr}.cases>div{border-right:0;border-bottom:1px solid var(--line)}}
.cases .nm{font-size:20px;font-weight:900}.cases .nm small{font-size:13px;color:var(--g500);font-weight:700;margin-left:6px}
.cases .num{display:flex;flex-wrap:wrap;gap:16px;margin:12px 0}
.cases .num div{min-width:90px}.cases .num b{display:block;font-size:24px;font-weight:900;color:var(--accent)}.cases .num span{font-size:12.5px;color:var(--g500);font-weight:700}
.cases p{font-size:14.5px;color:var(--ink-soft);line-height:1.55;margin:0}
</style>''')

# ---------- 01 사업 개요 ----------
rep('<div><div class="v">29,000<small>원</small></div><div class="l">주력 단건 상품가</div><div class="s">경쟁 서비스가 검증한 가격대</div></div>',
    '<div><div class="v">100~29,000<small>원</small></div><div class="l">6단계 가격 계단</div><div class="s">무료 → 백원 → 990원 → 기본 → 프리미엄 → 구독</div></div>')
rep('<div><div class="col-label">1년 차</div><div class="col-title">연 매출 15억 원</div><div class="col-content">단건 상담 중심으로 광고비 대비 매출 2배 이상 구조 확인, 오픈 후 광고 단계 증액</div></div>',
    '<div><div class="col-label">1년 차</div><div class="col-title">연 매출 18억 원</div><div class="col-content">백원·990원 라인으로 첫 결제 문턱을 없애고, 공유 할인으로 무료 유입을 키우며 광고 단계 증액</div></div>')
rep('<div class="hl"><div class="col-label">3년 차</div><div class="col-title">연 매출 100억 원</div><div class="col-content">구독·팬덤 비중 확대, 해외 매출 비중 15%, 캐릭터 IP 확장 수익 개시</div></div>',
    '<div class="hl"><div class="col-label">3년 차</div><div class="col-title">연 매출 150억 원</div><div class="col-content">990원 볼륨 × 프리미엄 × 구독의 3단 구조, 세계관·캐릭터 확장으로 굿즈·콜라보 수익 개시</div></div>')

# ---------- 03 경쟁사 분석: 성공 사례 ----------
rep('''  <div class="sub">
    <div class="sub-title"><span class="sn">3.3</span>시사점</div>''','''  <div class="sub">
    <div class="sub-title"><span class="sn">3.3</span>성공 사례 — 990원 사주와 웹툰 사주</div>
    <div class="cases">
      <div><div class="nm">사주아이<small>990원 · 1인 창업 · 바이브코딩</small></div>
        <div class="num"><div><b>150만</b><span>누적 회원</span></div><div><b>500만 건</b><span>누적 거래</span></div><div><b>50억 원대</b><span>누적 매출</span></div><div><b>0원</b><span>마케팅비</span></div></div>
        <p>2023년 하반기 3개월 만에 바이브코딩으로 출시. 만세력 로직만 직접 정하고 나머지는 AI로 구현했다. 성장 동력은 광고가 아니라 <strong>SNS 공유 · 친구 링크 · 지인 궁합</strong>. 990원이라는 가격이 "한번 봐 볼까"의 문턱을 없앴다.</p></div>
      <div><div class="nm">타이트사주<small>사주 × 웹툰 · 직원 10명</small></div>
        <div class="num"><div><b>월 10억 원</b><span>최근 월 매출</span></div><div><b>100배</b><span>2024년 초 대비</span></div></div>
        <p>사주 풀이를 웹툰 형식으로 재구성해 2024년 초 월 1천만 원대에서 월 10억 원 수준까지 성장. 업계 경쟁이 단순 풀이에서 <strong>캐릭터 · 콘텐츠 차별화</strong>로 옮겨 가는 중이다.</p></div>
    </div>
    <div class="note"><span class="note-label">오방사주에 가져오는 것</span>사주아이의 <strong>낮은 첫 결제 문턱과 공유 구조</strong>, 타이트사주의 <strong>캐릭터 · 웹툰형 고단가 상품</strong>을 한 서비스 안에 계단으로 쌓는다. 여기에 두 곳 모두 없는 <strong>세계관 · 매일 루틴 · 구독</strong>을 더한다. 오방사주도 체험판 전체를 AI 기반으로 직접 구현했다. <span style="color:var(--g500)">출처: 패스트캠퍼스 사주아이 인터뷰, 서울경제(2025)</span></div>
  </div>

  <div class="sub">
    <div class="sub-title"><span class="sn">3.4</span>시사점</div>''')

# ---------- 04 세계관과 캐릭터: 전체 캐릭터 시트 ----------
def cc(path,name,sub,desc,col='var(--accent)',sq=False,w=240):
    return f'<div class="cc{" sq" if sq else ""}" style="--c:{col}"><img src="{img(path,w)}" alt="{name}"><div><b>{name}</b><small>{sub}</small><span>{desc}</span></div></div>'
P='proto/'
hosts=[cc(P+'img/seoha.jpg','윤서하','대표 · 살롱의 주인','신의 말을 옮기는 사람. 모든 상담 진행','#0F0E11'),
       cc(P+'img/ian.jpg','이안 (호스트판)','남성 호스트 · 옥상 정자','나른하고 쿨한 저음. 서하판과 A/B 운영','#E0362A'),
       cc(P+'img/tarot/mujin.jpg','무진','타로 · 한밤의 카드방','여유와 장난기, 타로 22장','#6B4FD8'),
       cc(P+'img/taeo/base.jpg','태오','도화 사주 · 궁합','"누나"라 부르는 연하남, 영어판의 얼굴','#E0286B'),
       cc(P+'img/halmae.jpg','삼신 할매','신년운세 · 정통','운명을 점지하는 존재, 근거 중심 풀이','#A8802F'),
       cc(P+'img/taegil.jpg','월하','택일 명인','목적별 길일을 고르는 정통 담당','#4A33E6')]
gods=[cc(P+f'img/{k}.jpg',n,f'{e} · {h}',d,c) for k,n,e,h,d,c in [
       ('wood','하람','木','靑龍 · 동쪽','새 시작 · 다음 인연','#1F9D61'),('fire','이안','火','朱雀 · 남쪽','고백 · 재회 · 결단','#E0362A'),
       ('earth','도준','土','黃龍 · 중앙','결혼 · 궁합 · 일','#C98A12'),('metal','시온','金','白虎 · 서쪽','손절 · 이직 · 재물','#6B7280'),
       ('water','재이','水','玄武 · 북쪽','속마음 · 꿈 · 지혜','#2B5CC4')]]
minis=[cc(P+f'img/mini/{k}.jpg',f'미니 {n}',f'{e} · 낮의 모습',d,c,sq=True,w=200) for k,n,e,d,c in [
       ('wood','하람','木','오방 뽑기 · 부적 카드 · 당번 도장','#1F9D61'),('fire','이안','火','하루씩 돌아가며 당번','#E0362A'),
       ('earth','도준','土','표정 도장 스티커 4종','#C98A12'),('metal','시온','金','부적 속에 사는 수호신','#6B7280'),('water','재이','水','점괘통의 괘를 읽어 줌','#2B5CC4')]]
cats=[cc(P+f'img/cat/{k}.jpg',n,sub,d,c,w=220) for k,n,sub,d,c in [
       ('madam','마담 도화','흰 앙고라 · 묘당 간판','이달의 연애운 (990원)','#E0679A'),('water','먹물','검은 고양이 · 새침','꿈해몽','#2B5CC4'),
       ('fire','홍시','치즈냥 · 능청','그 사람 속마음 (엽전점)','#E0362A'),('earth','인절미','크림 엑조틱 · 뚱','이달의 금전운','#C98A12'),
       ('metal','서리','러시안 블루 · 도도','할까 말까','#6B7280'),('wood','솔이','스코티시폴드 · 순둥','포춘쿠키 (하루 한 번)','#1F9D61')]]
sheet=f'''
  <div class="sub">
    <div class="sub-title"><span class="sn">4.6</span>전체 캐릭터 시트 — 한 세계, 두 개의 톤</div>
    <p class="para">본편은 <strong>누아르 톤</strong>(2.5D 반실사 웹툰), 가볍게 즐기는 메뉴는 <strong>귀여운 톤</strong>(미니 · 고양이)으로 나눈다. 두 톤은 세계관으로 묶인다. 미니는 <strong>"낮이 되면 손바닥만 해지는 신들의 모습"</strong>, 고양이는 <strong>"신들의 심부름을 하다 신당 뒷골목에 눌러앉은 존재"</strong>. 그래서 캐릭터를 늘려도 따로 놀지 않고, 늘어날수록 세계가 넓어진다. 모든 캐릭터는 영상으로 움직이고 자기 목소리로 말한다.</p>
    <div class="castLab">진행 캐릭터<small>상담 · 메뉴를 맡는 사람들</small></div><div class="cast">{''.join(hosts)}</div>
    <div class="castLab">오방신수 5인<small>나의 수호신 · 세계관의 중심</small></div><div class="cast" style="grid-template-columns:repeat(5,1fr)">{''.join(gods)}</div>
    <div class="castLab">미니 수호신 5<small>귀여운 라인 · 무료 · 990원 메뉴의 진행자</small></div><div class="cast" style="grid-template-columns:repeat(5,1fr)">{''.join(minis)}</div>
    <div class="castLab">묘당 고양이 6<small>한밤의 고양이 점집 · 가벼운 점 전문</small></div><div class="cast">{''.join(cats)}</div>
    <div class="note warm"><span class="note-label">세계관 책</span>캐릭터와 세계관을 소개하는 <strong>넘겨 읽는 팝업북</strong> 《팔자에 신이 들었다》 제1권(무료)을 체험판에 구현했다. 인물이 종이에서 일어서고 영상으로 깨어난다. 권 단위로 연재하며(2권 「오행 하우스」 예고) 새 캐릭터와 메뉴를 이야기로 먼저 소개한다.</div>
  </div>
</section>
'''
a=s.index('<section class="section" id="s4"'); b=s.index('<section class="section" id="s5"')
seg=s[a:b]; k=seg.rfind('</section>'); seg=seg[:k]+sheet.lstrip('\n')[:-len('</section>\n')]+'</section>'+seg[k+len('</section>'):]
s=s[:a]+seg+s[b:]
rep('<p class="section-sum">세계관 · 대표 캐릭터 윤서하 · 오방신수 5인 · 삼신 할매 · 메뉴를 맡는 캐릭터 · 비주얼</p>','<p class="section-sum">세계관 · 대표 캐릭터 윤서하 · 오방신수 5인 · 삼신 할매 · 메뉴를 맡는 캐릭터 · 비주얼 · 전체 캐릭터 시트(미니 · 고양이 포함)</p>')

# ---------- 06 서비스 구성: 가격 계단 + 공유 할인 ----------
a=s.index('<div class="gt" style="--cols:130px 1.2fr 150px 1.6fr">'); b=s.index('<div class="sub">',a)
ladder='''<div class="ladder">
    <div><div class="st">무료</div><div class="pr">0<small>원</small></div><p>오늘의 운세 · 수호신 카드 · 무료 테스트 6종 · 오방 뽑기 · 당번 도장 · 세계관 책 1권</p><div class="rl">매일 방문 · 공유</div></div>
    <div><div class="st">백원 사주</div><div class="pr">100<small>원</small></div><p>다시 뽑기 · 꿈해몽 상세 · 한 번 더 묻기</p><div class="rl">첫 결제 문턱 제거 (결제수단 등록)</div></div>
    <div class="hl"><div class="st">990 라인</div><div class="pr">990<small>원</small></div><p>묘당 이달의 연애운 · 부적 카드 · 미니 궁합 · 오늘 상세 운세</p><div class="rl">주력 볼륨 · 사주아이 가격대</div></div>
    <div><div class="st">기본</div><div class="pr">4,900<small>원</small></div><p>도화 사주 라이트 · 커리어 기본 · 금전운 상세</p><div class="rl">990 → 프리미엄 사이 계단</div></div>
    <div class="pk"><div class="st">프리미엄</div><div class="pr">9,900~<br>29,000<small>원</small></div><p>그 사람 속마음 · 재회(29,000) · 도화 사주 · 궁합(14,900~19,900) · 신년운세 · 택일(9,900~19,900)</p><div class="rl">객단가 · 주력 이익</div></div>
    <div><div class="st">구독</div><div class="pr">월 4,900<br>/ 9,900<small>원</small></div><p>라이트: 매일 상세 운세 · 당번 보상 2배 / 개운 멤버십: 미션 · 캐릭터 대화 · 중요한 날 알림</p><div class="rl">반복 수익</div></div>
  </div>
  <p class="para" style="font-size:14px;color:var(--g500)">해외(영어판)는 $2.99~9.99. 결제는 웹에서 먼저 처리해 앱스토어 수수료를 피하고, 백원 결제로 결제수단을 등록해 두면 990원 · 프리미엄으로 넘어가는 단계가 한 번의 탭이 된다.</p>
  <div class="note"><span class="note-label">부가 수익</span><strong>실물 굿즈</strong>(부적 카드 실물 홀로 카드팩, 표정 도장 스티커팩, 아크릴 스탠드, 미니 피규어, 키링) · <strong>디지털 굿즈</strong>(배경화면, 캐릭터 음성 알람) · <strong>콜라보 · 팝업</strong>(카페 · 편의점, 오프라인 '묘당' 팝업) · <strong>IP 라이선스</strong>(웹툰 · 숏드라마). 캐릭터 팬덤이 쌓인 2년 차부터 순차 도입한다.</div>

  '''
s=s[:a]+ladder+s[b:]
rep('<p class="section-sum">무료로 들어와 단건 상담으로 결제하고, 구독으로 남는 구조</p>','<p class="section-sum">무료로 들어와 백원으로 첫 결제, 990원으로 습관, 프리미엄과 구독으로 남는 6단계 가격 계단</p>')
rep('''      <div><b>미리보기</b>상담 첫 3컷</div>
      <div class="hl"><b>결제</b>29,000원 · 웹 결제</div>''','''      <div><b>첫 결제</b>백원 · 990원</div>
      <div class="hl"><b>프리미엄</b>9,900~29,000원 · 웹 결제</div>''')
rep('<li><strong>자연 유입</strong>: 무료 구간의 "운명의 최애 배정"이 공유 카드가 되어 자연 유입을 만든다 (MBTI 결과 공유와 같은 문법)</li>',
    '<li><strong>자연 유입</strong>: 무료 구간의 수호신 카드 · 테스트 결과 · 부적 카드가 공유 카드가 되어 자연 유입을 만든다 (MBTI 결과 공유와 같은 문법)</li>')
share='''
  <div class="sub">
    <div class="sub-title"><span class="sn">6.3</span>공유하면 더 싸진다 — 공유 할인 설계</div>
    <p class="para">사주아이의 성장 동력이 광고가 아니라 공유였던 것처럼, <strong>공유가 곧 할인</strong>이 되게 설계해 고객획득비용을 낮춘다.</p>
    <div class="gt" style="--cols:200px 1.5fr 1fr">
      <div class="gt-row head"><div class="c">장치</div><div class="c">방식</div><div class="c">효과</div></div>
      <div class="gt-row hl"><div class="c label">공유 할인</div><div class="c" data-l="방식">결과 카드를 공유하면 다음 결제 50% 쿠폰. 990원 메뉴는 공유하면 한 번 더 무료</div><div class="c" data-l="효과">모든 결과가 광고 소재가 됨</div></div>
      <div class="gt-row"><div class="c label">친구 초대 궁합</div><div class="c" data-l="방식">친구가 링크로 들어오면 두 사람 모두 궁합 무료</div><div class="c" data-l="효과">2인용이라 자연 확산</div></div>
      <div class="gt-row"><div class="c label">엽전 적립</div><div class="c" data-l="방식">내 링크로 들어온 친구가 결제하면 결제액의 10%를 '엽전'(앱 포인트)으로 적립, 엽전으로 990원 메뉴 결제</div><div class="c" data-l="효과">공유할수록 무료로 즐김</div></div>
      <div class="gt-row"><div class="c label">3인 공동구매</div><div class="c" data-l="방식">단톡방에서 3명이 모이면 프리미엄 리포트 40% 할인</div><div class="c" data-l="효과">단체 유입 · 객단가 유지</div></div>
      <div class="gt-row"><div class="c label">공유용 결과 형식</div><div class="c" data-l="방식">모든 결과를 스토리용 세로 카드(1080×1920)로. 이름 · 생일 없이도 공유 가능</div><div class="c" data-l="효과">공유 부담 없음</div></div>
    </div>
    <div class="note"><span class="note-label">목표</span>신규 가입 중 <strong>공유 · 초대 유입 40%</strong>, 고객획득비용 <strong>1.5만 원 → 9천 원</strong>. 오픈 후 실측으로 쿠폰 비율을 조정한다.</div>
  </div>
'''
a=s.index('<section class="section" id="s6"'); b=s.index('<section class="section" id="sP"'); seg=s[a:b]; k=seg.rfind('</section>')
s=s[:a]+seg[:k]+share.lstrip('\n')+seg[k:]+s[b:]

# ---------- 07 체험판 ----------
rep('<div class="gt-row"><div class="c label">해외판 · 광고</div><div class="c" data-l="내용">영어판 도화 사주(출생 도시 기준 시간 보정), 숏폼 광고 소재 5종</div></div>',
    '''<div class="gt-row"><div class="c label">해외판 · 광고</div><div class="c" data-l="내용">영어판 도화 사주(출생 도시 기준 시간 보정), 숏폼 광고 소재 5종</div></div>
    <div class="gt-row hl"><div class="c label">귀여운 라인</div><div class="c" data-l="내용">오방 뽑기(점괘통) · 부적 카드(오행 5종, 희귀도 3단계) · 오늘의 당번(표정 도장 스티커 20종 도감) · 묘당(고양이 6마리가 영상으로 말하는 가벼운 점 6종)</div></div>
    <div class="gt-row hl"><div class="c label">세계관 책</div><div class="c" data-l="내용">넘겨 읽는 팝업북 《팔자에 신이 들었다》 제1권. 인물이 종이에서 일어서고, 누르면 영상과 목소리로 깨어난다</div></div>
    <div class="gt-row"><div class="c label">공개 주소</div><div class="c" data-l="내용">obangsaju.netlify.app — 누구나 휴대폰으로 바로 체험 (GitHub 연동으로 수정 즉시 반영)</div></div>''')

# ---------- 10 해외 ----------
rep('<span class="note-label">해외 매출 목표</span>2년 차 3억 원, <strong>3년 차 15억 원(전체 매출의 15%)</strong>.','<span class="note-label">해외 매출 목표</span>2년 차 2.5억 원, <strong>3년 차 9억 원(전체 매출의 6%)</strong>. 국내 성장을 우선하고 해외는 검증형으로 운영한다.')

# ---------- 11 제작 및 운영: 운영 방향 ----------
ops='''
  <div class="sub">
    <div class="sub-title"><span class="sn">11.1</span>운영 방향 — 세계관으로 넓히고, 빠르게 바꾼다</div>
    <div class="cols c3">
      <div class="hl"><div class="col-label">세계관 구축을 통한 확장</div><div class="col-title">새 메뉴는 세계관의 새 장(章)</div><div class="col-content">신 · 미니 · 고양이를 한 세계로 묶고, 세계관 책을 권 단위로 연재한다. 새 캐릭터 · 메뉴를 이야기로 먼저 소개해 출시 자체가 콘텐츠가 된다</div></div>
      <div><div class="col-label">빠른 업데이트</div><div class="col-title">2주마다 신규 메뉴 1개</div><div class="col-content">AI 제작 방식으로 기획 → 그림 → 말하는 영상 → 화면까지 1~2주. 절기 · 연말 · 신년 시즌 이벤트를 달력으로 운영</div></div>
      <div><div class="col-label">캐릭터 추가</div><div class="col-title">분기마다 새 얼굴</div><div class="col-content">누아르 본편(수호신 · 호스트)과 귀여운 라인(미니 · 고양이)을 번갈아 추가. 캐릭터가 늘수록 굿즈 · 콜라보 라인업도 늘어난다</div></div>
    </div>
  </div>
'''
a=s.index('<section class="section" id="s9"'); b=s.index('<section class="section" id="s10"'); seg=s[a:b]; k=seg.rfind('</section>')
s=s[:a]+seg[:k]+ops.lstrip('\n')+seg[k:]+s[b:]
rep('<div><div class="col-label">신규 상품</div><div class="col-title">1~2주 내 출시</div><div class="col-content">시나리오 템플릿 + 결론 규칙 + 포스터 세트 추가로 상품을 늘린다</div></div>',
    '<div><div class="col-label">신규 상품</div><div class="col-title">1~2주 내 출시</div><div class="col-content">시나리오 템플릿 + 결론 규칙 + 캐릭터 영상 세트로 상품을 늘린다. 체험판에서 메뉴 하나를 하루~이틀에 구현해 검증</div></div>')

# ---------- 12 수익 모델 ----------
a=s.index('<section class="section" id="s10"'); b=s.index('<section class="section" id="s11"')
rev='''<section class="section" id="s10">
  <div class="section-head"><span class="section-num">12</span><h2 class="section-title">수익 모델 및 손익 추정</h2></div>
  <p class="section-sum">990원 볼륨 · 프리미엄 단건 · 구독의 3단 구조. 공유 할인으로 광고비 효율을 높이며 3년 차 연 매출 150억 원</p>
  <div class="cols c3">
    <div><div class="col-label">수익 구조</div><div class="col-content">매출 = 백원 · 990원 라인(볼륨) + 프리미엄 단건(객단가) + 구독(반복) + 해외 + 굿즈 · IP. 원가는 API · AI 생성비 · 결제 수수료 · 굿즈 제작비로, <strong>매출총이익률 약 90%</strong></div></div>
    <div><div class="col-label">핵심 지표</div><div class="col-content">광고비 1원당 매출 2.4원에서 시작해, 공유 할인 · 친구 초대로 무료 유입이 쌓이면서 <strong>3.4원까지 상승</strong>. 990원 고객의 프리미엄 · 구독 전환이 이익을 만든다</div></div>
    <div><div class="col-label">가정</div><div class="col-content">고객획득비용 1.2만 → 9천 원, 990원 라인 평균 결제 1,100원, 프리미엄 평균 1.8만 원, 구독자 평균 월 8천 원, 990원 고객의 프리미엄 전환 8%. 초기 외주 개발비는 별도</div></div>
  </div>
  <div class="stats">
    <div><div class="v">18<small>억 원</small></div><div class="l">1년 차 연 매출 (2027)</div><div class="s">영업이익 약 4.7억 원 · 월 평균 광고비 약 6,300만 원</div></div>
    <div><div class="v">60<small>억 원</small></div><div class="l">2년 차 연 매출 (2028)</div><div class="s">영업이익 약 23.6억 원 · 월 평균 광고비 약 1.7억 원</div></div>
    <div><div class="v">150<small>억 원</small></div><div class="l">3년 차 연 매출 (2029)</div><div class="s">영업이익 약 70.9억 원 · 월 평균 광고비 약 3.7억 원</div></div>
  </div>
  <div class="two" style="margin-top:20px">
    <div class="chart">
      <svg viewBox="0 0 640 300" role="img" aria-label="연차별 매출·광고비·영업이익">
        <g font-family="Noto Sans KR, sans-serif" font-size="12" font-weight="700" fill="#6E6D74">
          <line x1="60" y1="250" x2="620" y2="250" stroke="#0F0E11" stroke-width="1.5"/>
          <line x1="60" y1="180" x2="620" y2="180" stroke="#D9D7D0" stroke-dasharray="3 4"/><text x="54" y="184" text-anchor="end">50억</text>
          <line x1="60" y1="110" x2="620" y2="110" stroke="#D9D7D0" stroke-dasharray="3 4"/><text x="54" y="114" text-anchor="end">100억</text>
          <line x1="60" y1="40" x2="620" y2="40" stroke="#D9D7D0" stroke-dasharray="3 4"/><text x="54" y="44" text-anchor="end">150억</text>
          <text x="54" y="254" text-anchor="end">0</text>
        </g>
        <g font-family="Noto Sans KR, sans-serif" font-size="12" font-weight="800">
          <rect x="90" y="224.8" width="44" height="25.2" fill="#0F0E11"/><text x="112" y="218.8" fill="#0F0E11" text-anchor="middle">18억</text>
          <rect x="140" y="239.5" width="44" height="10.5" fill="#C9C7C0"/><text x="162" y="270" fill="#6E6D74" text-anchor="middle">7.5억</text>
          <rect x="190" y="243.4" width="44" height="6.6" fill="#4A33E6"/><text x="212" y="284" fill="#4A33E6" text-anchor="middle">4.7억</text>
          <rect x="270" y="166" width="44" height="84" fill="#0F0E11"/><text x="292" y="160" fill="#0F0E11" text-anchor="middle">60억</text>
          <rect x="320" y="221" width="44" height="29" fill="#C9C7C0"/><text x="342" y="270" fill="#6E6D74" text-anchor="middle">20.7억</text>
          <rect x="370" y="217" width="44" height="33" fill="#4A33E6"/><text x="392" y="284" fill="#4A33E6" text-anchor="middle">23.6억</text>
          <rect x="450" y="40" width="44" height="210" fill="#0F0E11"/><text x="472" y="34" fill="#0F0E11" text-anchor="middle">150억</text>
          <rect x="500" y="188.3" width="44" height="61.7" fill="#C9C7C0"/><text x="522" y="270" fill="#6E6D74" text-anchor="middle">44.1억</text>
          <rect x="550" y="150.7" width="44" height="99.3" fill="#4A33E6"/><text x="572" y="284" fill="#4A33E6" text-anchor="middle">70.9억</text>
        </g>
        <g font-family="Noto Sans KR, sans-serif" font-size="13" font-weight="800" fill="#0F0E11" text-anchor="middle">
          <text x="162" y="298">1년 차 (2027)</text><text x="342" y="298">2년 차 (2028)</text><text x="522" y="298">3년 차 (2029)</text>
        </g>
      </svg>
      <div class="legend"><span><i style="background:#0F0E11"></i>연 매출</span><span><i style="background:#C9C7C0"></i>연 광고비</span><span><i style="background:#4A33E6"></i>연 영업이익</span></div>
    </div>
    <div class="gt" style="--cols:1.4fr 1fr 1fr 1fr;margin:0">
      <div class="gt-row head"><div class="c">연간 (억 원)</div><div class="c" style="text-align:right">1년 차</div><div class="c" style="text-align:right">2년 차</div><div class="c" style="text-align:right">3년 차</div></div>
      <div class="gt-row"><div class="c label">월 평균 광고비</div><div class="c r" data-l="1년 차">0.63</div><div class="c r" data-l="2년 차">1.73</div><div class="c r" data-l="3년 차">3.68</div></div>
      <div class="gt-row"><div class="c label">연 광고비</div><div class="c r" data-l="1년 차">7.5</div><div class="c r" data-l="2년 차">20.7</div><div class="c r" data-l="3년 차">44.1</div></div>
      <div class="gt-row"><div class="c label">광고비 대비 매출</div><div class="c r" data-l="1년 차">2.4배</div><div class="c r" data-l="2년 차">2.9배</div><div class="c r" data-l="3년 차">3.4배</div></div>
      <div class="gt-row hl"><div class="c label">연 매출</div><div class="c r" data-l="1년 차"><strong>18.0</strong></div><div class="c r" data-l="2년 차"><strong>60.0</strong></div><div class="c r" data-l="3년 차"><strong>150.0</strong></div></div>
      <div class="gt-row"><div class="c label">매출원가 <small>API·AI·결제수수료·굿즈</small></div><div class="c r" data-l="1년 차">1.8</div><div class="c r" data-l="2년 차">6.0</div><div class="c r" data-l="3년 차">14.5</div></div>
      <div class="gt-row"><div class="c label">운영비 <small>툴·유지보수·소재·CS</small></div><div class="c r" data-l="1년 차">1.8</div><div class="c r" data-l="2년 차">4.2</div><div class="c r" data-l="3년 차">8.5</div></div>
      <div class="gt-row"><div class="c label">인건비 <small>팀 확장 반영</small></div><div class="c r" data-l="1년 차">2.2</div><div class="c r" data-l="2년 차">5.5</div><div class="c r" data-l="3년 차">12.0</div></div>
      <div class="gt-row hl"><div class="c label">연 영업이익</div><div class="c r" data-l="1년 차"><strong>4.7</strong></div><div class="c r" data-l="2년 차"><strong>23.6</strong></div><div class="c r" data-l="3년 차"><strong>70.9</strong></div></div>
      <div class="gt-row"><div class="c label">월 평균 매출</div><div class="c r" data-l="1년 차">1.5</div><div class="c r" data-l="2년 차">5.0</div><div class="c r" data-l="3년 차">12.5</div></div>
    </div>
  </div>
  <div class="sub">
    <div class="sub-title"><span class="sn">12.1</span>매출 구성</div>
    <div class="gt" style="--cols:1.6fr 1fr 1fr 1fr 1.6fr">
      <div class="gt-row head"><div class="c">매출원 (억 원)</div><div class="c" style="text-align:right">1년 차</div><div class="c" style="text-align:right">2년 차</div><div class="c" style="text-align:right">3년 차</div><div class="c">3년 차 근거</div></div>
      <div class="gt-row hl"><div class="c label">백원 · 990원 라인</div><div class="c r" data-l="1년 차">7.5</div><div class="c r" data-l="2년 차">23.0</div><div class="c r" data-l="3년 차"><strong>54.0</strong></div><div class="c" data-l="근거">연 490만 건 × 평균 1,100원 (사주아이 누적 500만 건)</div></div>
      <div class="gt-row"><div class="c label">프리미엄 단건 · 기본</div><div class="c r" data-l="1년 차">6.5</div><div class="c r" data-l="2년 차">19.0</div><div class="c r" data-l="3년 차"><strong>44.0</strong></div><div class="c" data-l="근거">연 24만 건 × 평균 1.8만 원</div></div>
      <div class="gt-row"><div class="c label">구독</div><div class="c r" data-l="1년 차">3.0</div><div class="c r" data-l="2년 차">12.0</div><div class="c r" data-l="3년 차"><strong>32.0</strong></div><div class="c" data-l="근거">평균 유료 구독자 3.3만 명 × 월 8천 원</div></div>
      <div class="gt-row"><div class="c label">해외 <small>영어판</small></div><div class="c r" data-l="1년 차">0.3</div><div class="c r" data-l="2년 차">2.5</div><div class="c r" data-l="3년 차"><strong>9.0</strong></div><div class="c" data-l="근거">검증형 운영, 전체의 6%</div></div>
      <div class="gt-row"><div class="c label">굿즈 · IP · 콜라보</div><div class="c r" data-l="1년 차">0.7</div><div class="c r" data-l="2년 차">3.5</div><div class="c r" data-l="3년 차"><strong>11.0</strong></div><div class="c" data-l="근거">부적 카드팩 · 스티커 · 피규어, 콜라보 · 팝업</div></div>
      <div class="gt-row hl"><div class="c label">합계</div><div class="c r" data-l="1년 차"><strong>18.0</strong></div><div class="c r" data-l="2년 차"><strong>60.0</strong></div><div class="c r" data-l="3년 차"><strong>150.0</strong></div><div class="c" data-l="근거">월 평균 12.5억 원</div></div>
    </div>
  </div>
  <div class="note warm"><span class="note-label">목표 근거</span>사주아이는 <strong>1인 · 마케팅비 0원으로 누적 매출 50억 원대</strong>, 타이트사주는 <strong>3년 차 월 매출 10억 원(연환산 120억 원)</strong>에 도달했다. 당사는 사주아이의 저가 · 공유 구조와 타이트사주의 캐릭터 · 고단가 구조를 한 서비스에 계단으로 쌓고, 두 곳에 없는 세계관 · 구독을 더하므로 <strong>3년 차 연 매출 150억 원</strong>을 목표로 한다. 1년 차는 백원 · 990원으로 결제 고객 풀을 넓히고, 2년 차부터 프리미엄 · 구독 전환과 굿즈를 키워 광고비 대비 매출을 3.4배까지 끌어올린다. 오픈 후 실측치로 갱신한다.</div>
</section>

'''
s=s[:a]+rev+s[b:]
rep('<li>굿즈·IP 확장 수익 검토</li>','<li>세계관 책 2권 · 캐릭터 추가 · 굿즈(부적 카드팩 · 스티커) 출시</li>')
rep('<span>2026.09</span>','<span>2026.10</span>')
open(B+'export/오방사주_사업계획서_v2.html','w',encoding='utf-8').write(s)
print('ok',len(s))
