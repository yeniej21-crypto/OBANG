/* 2027 신년 기획전 라인업 — 홈 '신년 기획전' 줄과 newyear.html 랜딩이 같이 쓰는 한 곳.
   새 신년 메뉴를 열면 여기 한 줄만 고치면 된다(status 'soon' → 'open', url 넣기).
   cat: hero(대표) · jt(정통) · f990(분야별 990원) · free(무료) · more(함께 보면 좋은)
   home: 홈 기획전 줄에 보일 순서(없으면 안 보임). 홈에는 다섯 장 + '모두 보기'. */
window.NY27={
  title:'2027 정미년 신년 기획전',
  items:[
   {id:'halmae',cat:'hero',home:1,name:'삼신 할매의 정통 신년운세',short:'신년 운세',who:'삼신 할매',img:'img/halmae.jpg',vid:'v/poster/halmae.mp4',url:'sinnyeon.html',status:'open',price:'19,900원',
    line:'열두 달 총운 · 분야별 운 · 조심할 날까지, 가장 길고 꼼꼼한 풀이',what:'한 해 전체의 총운',for:'신년운세를 처음 제대로 보는 사람, 부모님 선물',get:'열두 달 상세 풀이 · 할매의 편지'},
   {id:'soheon',cat:'jt',home:2,name:'소헌 선생의 2027 명리 감정서',short:'명리 감정서',who:'명리관 소헌 선생',img:'img/soheon.jpg',vid:'v/poster/soheon.mp4',url:'myeongri.html',status:'open',price:'19,900원',
    line:'대운 · 세운 · 월운을 근거로 하나씩 짚어 쓰는 문서형 감정서',what:'풀이마다 근거를 짚는 감정',for:'왜 그렇게 나왔는지까지 알고 싶은 사람',get:'관인 찍힌 감정서 저장 · 세 번 묻기'},
   {id:'hyeonam',cat:'jt',home:4,name:'현암의 대운 속 2027',short:'대운 속 2027',who:'명리 대가 현암',img:'img/jeongtong.jpg',url:'',status:'soon',open:'11월 오픈',price:'9,900원',
    line:'10년 대운 안에서 올해가 어디쯤인지, 2026~2028 세 해의 흐름',what:'올해를 품은 10년의 큰 흐름',for:'올해 하나보다 앞으로 몇 년이 궁금한 사람',get:'세 해 흐름도 · 다음 대운까지 남은 해'},
   {id:'tojeong',cat:'jt',home:5,name:'2027 토정비결',short:'토정비결',who:'토정의 괘',img:'img/tojeong.jpg',url:'',status:'soon',open:'11월 오픈',price:'9,900원',
    line:'생년월일로 상 · 중 · 하괘를 세우는 옛 방식 그대로, 달마다 괘사와 풀이',what:'144괘 고전 풀이',for:'옛 방식의 신년 점을 좋아하는 사람',get:'내 괘 번호와 원문 · 달마다 괘사'},
   {id:'wolha',cat:'jt',name:'월하의 2027 길흉 달력',short:'길흉 달력',who:'택일 명인 월하',img:'img/taegil.jpg',vid:'v/poster/taegil.mp4',url:'',status:'soon',open:'11월 오픈',price:'4,900원',
    line:'열두 달 좋은 날과 피할 날을 내 폰 달력에 한 번에',what:'날짜',for:'이사 · 계약 · 고백 날을 미리 받아 두고 싶은 사람',get:'좋은 날 · 피할 날 달력 저장'},
   {id:'seoha_f',cat:'free',home:3,name:'서하의 2027 맛보기',short:'2027 맛보기',who:'서하',img:'img/seoha.jpg',url:'',status:'soon',open:'11월 오픈',price:'무료',
    line:'올해의 한 단어 · 총운 점수 · 가장 좋은 달과 조심할 달 하나씩',get:'공유하는 한 단어 카드'},
   {id:'seoha',cat:'f990',name:'서하의 올해 버릴 것 · 잡을 것',short:'버릴 것 · 잡을 것',who:'서하',img:'img/seoha.jpg',url:'',status:'soon',open:'11월 오픈',price:'990원',line:'직설 코칭 한 장'},
   {id:'taeo',cat:'f990',name:'태오의 2027 연애 달력',short:'연애 달력',who:'태오',img:'img/taeo/base.jpg',url:'',status:'soon',open:'11월 오픈',price:'990원',line:'인연이 오는 달 · 고백 타이밍'},
   {id:'dojun',cat:'f990',name:'도준의 2027 돈 · 일',short:'돈 · 일',who:'도준',img:'img/earth.jpg',url:'',status:'soon',open:'11월 오픈',price:'990원',line:'재물 흐름 · 이직 타이밍'},
   {id:'mujin',cat:'f990',name:'무진의 열두 달 타로',short:'열두 달 타로',who:'무진',img:'img/tarot/mujin.jpg',url:'',status:'soon',open:'11월 오픈',price:'990원',line:'달마다 카드 한 장'},
   {id:'ppopgi',cat:'free',name:'오방 뽑기 · 새해 첫 괘',short:'새해 첫 괘',who:'미니 수호신',img:'img/mini/tong.jpg',url:'ppopgi.html',status:'open',price:'무료',line:'통을 흔들어 올해 첫 괘를 뽑아 보기'},
   {id:'bujeok',cat:'free',name:'새해 부적 카드',short:'부적 카드',who:'오방신',img:'img/card/wood.jpg',url:'bujeok.html',status:'open',price:'하루 한 장 무료',line:'모자란 기운의 신이 그려진 부적 한 장'},
   {id:'taegil',cat:'more',name:'택일',short:'택일',who:'월하',img:'img/taegil.jpg',url:'taegil.html',status:'open',price:'',line:'이사 · 계약 · 고백, 그날이 길한지'},
   {id:'life',cat:'more',name:'평생 사주',short:'평생 사주',who:'현암',img:'img/jeongtong.jpg',url:'lifetime.html',status:'open',price:'',line:'대운 10년 흐름과 타고난 그릇'}]};
