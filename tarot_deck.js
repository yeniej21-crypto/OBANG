/* 오방사주 타로 — 78장 덱 공통 도우미 (2026-10-03)
   tarot_data.js(메이저 22) → tarot_minor.js(마이너 56) → 이 파일 순서로 불러온다.
   - 카드 이름표: 메이저는 로마 숫자, 마이너는 한글 이름(잔 3, 칼 시동 등)
   - 수트 정보(이름·오행·주제), 궁정 카드 판별
   - 연애 배치 추가: contact(연락 올까, 1장) · month(이번 달 연애, 4장) */
(function(){
const ROMAN=['0','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
const SUIT={
  wa:{ko:'지팡이',el:'木',theme:'열정과 움직임',short:'지팡이'},
  cu:{ko:'잔',el:'水',theme:'감정과 관계',short:'잔'},
  sw:{ko:'칼',el:'金',theme:'생각과 결단',short:'칼'},
  pe:{ko:'엽전',el:'土',theme:'돈과 현실',short:'엽전'}};
const RANK_KO=['','에이스','2','3','4','5','6','7','8','9','10','시동','기사','여왕','왕'];
const isMajor=c=>!c.suit;
const isCourt=c=>!!c.suit&&c.rank>=11;
/* 카드 앞면 위쪽 이름표 */
const label=c=>isMajor(c)?ROMAN[c.n]:c.ko;
/* 그림이 늦게 오거나 못 올 때 보이는 바탕(한자 이름 + 카드 이름) */
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const fbAttr=c=>`data-s="${esc(c.han||'')}" data-l="${esc(c.ko)}"`;
const pre={}; function preload(c){ if(!c||pre[c.n]) return; pre[c.n]=1; try{ const im=new Image(); im.decoding='async'; im.src=c.img; }catch(e){} }

if(window.TAROT_SPREAD){
  if(!TAROT_SPREAD.contact) TAROT_SPREAD.contact={t:'연락 올까', k:'love', pos:['연락의 답']};
  if(!TAROT_SPREAD.month) TAROT_SPREAD.month={t:'이번 달 연애', k:'love', pos:['첫째 주','둘째 주','셋째 주','넷째 주']};
}
/* 주제마다 카드 수가 정해진 배치 */
const FIXED_N={today:1,contact:1,month:4};

window.TarotDeck={ROMAN,SUIT,RANK_KO,isMajor,isCourt,label,fbAttr,preload,FIXED_N};
})();
