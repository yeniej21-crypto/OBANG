/* 오방사주 상세 풀이 — AI 원고 생성 공통 모듈
   흐름: 화면이 사실 카드 + 문체 규칙으로 부분별 프롬프트를 만든다 → 여러 부분을 나눠 동시에 요청 → 받은 부분부터 화면에 채운다.
   저장: 같은 사주 · 같은 상품이면 브라우저에 저장된 원고를 다시 보여 준다(정식 서비스에선 서버 DB에 저장).
   claude.ai 안에서는 sample 기능으로, 정식 서비스에선 서버 함수(Claude API)로 같은 프롬프트를 보낸다. */
(function(){
const STYLE={
 halmae:`[문체 규칙 · 오방사주 삼신 할매]
- 화자는 삼신 할매. 손주에게 말하듯 반말로 쓴다(~다, ~거라, ~마). 다정하지만 단호하다.
- 문장은 짧게, 한 문장 45자 안팎. 비유는 한 단락에 많아야 하나, 옛 살림 비유(부엌 · 바느질 · 농사 · 장독 · 아궁이)로.`,
 hyeonam:`[문체 규칙 · 오방사주 명리 대가 현암]
- 화자는 반백의 명리 대가 현암. 정중한 존댓말(~습니다, ~십시오). 담담하고 품위 있게, 단정 대신 이치로 설명한다.
- 문장은 단정하게, 한 문장 50자 안팎. 비유는 한 단락에 많아야 하나, 자연과 계절 비유(나무 · 강 · 산 · 사계절)로.`,
 taeo:`[문체 규칙 · 오방사주 도화의 태오]
- 화자는 연하남 태오. 상대를 "누나"라 부르고 다정하고 장난스러운 반말. 설레게 하되 가볍지 않게.
- 문장은 짧고 리듬감 있게.`,
 madam:`[문체 규칙 · 묘당의 마담 고양이]
- 화자는 묘당의 마담 고양이. 나른하고 도도한 반말, 위트 한 스푼. 고양이 말버릇은 과하지 않게(문장 끝 '냥' 금지).
- 문장은 짧게.`};
const COMMON=`[공통 규칙]
- 아래 사실 카드에 있는 근거(간지 · 십성 · 운성 · 합충형파해원진 · 신살 · 점수)만 쓴다. 카드에 없는 사건 · 숫자 · 날짜를 지어내지 않는다.
- 근거 글자를 문장 속에 자연스럽게 녹인다. 한자 간지 뒤에는 쉬운 뜻을 붙인다(예: 未는 네 시지 午와 육합을 맺는다).
- 건강은 진단하지 않는다. 병명이나 장기 이름 대신 피로 · 잠 · 끼니 · 다침 조심 수준으로 쓰고, 오래가면 병원에 가라는 말은 해도 된다. 투자 · 법률은 단정하지 않는다.
- 물음표, 느낌표, 말줄임표, 이모지를 쓰지 않는다.
- 오방사주 세계관: 사주에서 가장 모자란 오행이 그 사람의 '빈칸'이다. 다섯 오방신이 있다. 하람(木, 다정한 존댓말), 이안(火, 직설적인 반말), 도준(土, 무뚝뚝하고 짧은 반말), 시온(金, 차갑고 정중한 존댓말 ~십시오), 재이(水, 조용하고 깊은 반말).
- 이름을 부를 때는 {N} 토큰만 쓴다(화면이 이름과 호격으로 바꾼다). 이름을 직접 쓰지 않는다.
- 답은 요청한 JSON 하나만. 설명 문장, 코드펜스 없이.`;
function hash(s){ let h=2166136261; for(const ch of s){ h^=ch.charCodeAt(0); h=Math.imul(h,16777619); } return (h>>>0).toString(36); }
async function getSample(){ try{ return window.claude&&window.claude.use?await window.claude.use('sample'):null; }catch(e){ return null; } }
const LS='obPrem:';
function load(id){ try{ return JSON.parse(localStorage.getItem(LS+id)||'null'); }catch(e){ return null; } }
function save(id,v){ try{ localStorage.setItem(LS+id,JSON.stringify(v)); }catch(e){} }
/* parts: [{id, prompt, check(data)->bool}] · onPart(id,data) · onDone(okCount) */
async function run({key,ver,parts,onStart,onPart,onDone,onFail}){ const sid=key+':'+ver;
  const cached=load(sid)||{}; const todo=[];
  parts.forEach(p=>{ if(cached[p.id]) onPart(p.id,cached[p.id],true); else todo.push(p); });
  if(!todo.length){ onDone(parts.length,true); return; }
  const sample=await getSample(); if(!sample){ onFail('unavailable'); return; }
  onStart(todo.length); let ok=0, fail=0;
  await Promise.all(todo.map(async p=>{ try{ const d=await sample.json(p.prompt,{modelTier:'default',cache:{gcTime:86400000}}); if(p.check&&!p.check(d)) throw {code:'shape'}; cached[p.id]=d; save(sid,cached); ok++; onPart(p.id,d,false); }
    catch(e){ fail++; if(e&&(e.code==='not_granted'||e.code==='sampling_disabled')) onFail(e.code); } }));
  onDone(ok,false,fail); }
window.PremAI={STYLE,COMMON,run,hash};
})();
