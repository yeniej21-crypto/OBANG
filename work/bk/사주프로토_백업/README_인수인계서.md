# 녹트 서울 AI 사주 신사업 · 프로토타입 작업 인수인계서

최종 업데이트: 2026-09-29 22:20 (KST)
새 채팅을 시작하면 이 문서를 먼저 읽고 이어서 작업한다.

## 0. 작업 규칙 (은주 요청사항)
- 답변은 항상 **한국어**로만.
- 생성 전에 **계획·대사를 먼저 보여주고** 승인받는다.
- 영상은 **테스트 1컷 먼저** → 확인 후 나머지 일괄 생성.
- 크레딧은 아끼되 **퀄리티는 절대 낮추지 않는다**.
- 타이트사주(TIGHT)는 참고만 하고 캐릭터·화면을 그대로 베끼지 않는다.
- 캐릭터 이름은 촌스럽지 않게(트로트 가수 같은 이름 금지).
- 캐릭터: 느끼함·기름진 머리·한 올씩 날리는 머리카락 금지. 얼굴 중앙을 머리로 가리지 않기. 고개 숙이는 포즈 금지(얼굴 왜곡).

## 1. 배포물 (Claude 아티팩트 = 상시 접속 가능한 링크)
| 이름 | 링크 | 비고 |
|---|---|---|
| 서하 체험판 (메인, 최신) | https://claude.ai/artifact/R8ua6P6XsNx3Z7p96k52hY | v15. 홈 + 도화 사주 포함 |
| 이안 체험판 | https://claude.ai/artifact/2wXjYJiTFP5nsRFPRKmYsV | v8. 홈 글자 축소·도화 카드 **미반영** |
| 사업계획서 | https://claude.ai/artifact/32Hbkfq3KzVeegEMZETHtx | 아직 "입사 카드" 표현 남아 있음 → "수호신 카드"로 수정 필요 |
| 심화 보고서 | https://claude.ai/artifact/NctJGtD6me4RJRZGuoHWCF | |

넷리파이: `seoha-demo_netlify.zip`, `ian-demo_netlify.zip` (폴더째 Netlify Drop에 올림).

## 2. 체험판 구성 (서하 체험판 기준)
1. **온보딩(서하/이안)**: 인트로 → 대사 t1~t6 → 생년월일 → 고민 → 부족한 오행의 수호신 등장 → 수호신 카드 결과.
2. **그 사람 편(시온)**: 상대 생년월일·관계 → 웹툰형 리포트 → 29,000원 페이월.
3. **개운 멤버십 데모**: 알림 허용 → 다음 날 아침 8시 잠금화면 푸시 → 미션 영상 → 기운 게이지 → 월 9,900원.
4. **메인 홈**: TIGHT 레이아웃 참고, 검정 배경·포스터 카드. 2026-09-29 글자 크기 축소 완료.
   - 섹션: 오늘의 개운 / 도화 사주(NEW) / 그 사람 속마음 / 다음 연애 / 오방 멤버 / 2027 신년(할매 티저) / 도구 / 랭킹 / 후기.
5. **할매 티저**: "왔구나. …네 내년 열두 달, 이 할미가 다 봐 뒀다. 섣달에 보자."
6. **도화 사주 (A형 채팅형, 호스트 태오)** — `dohwa.html`
   - 시작화면 → 채팅(정지컷이 숨 쉬듯 움직임, 꽃잎) → 이름 → 누나/형 → 생년월일(양/음) → 12시진/모름
   - "…잠깐만" → 턱 괸 컷 확대 → 음성영상 v1→v2→v3 → 5단계 분석 로딩(실제 원국 8글자, 子午卯酉 강조)
   - 결과: 도화 유형 4종(봄꽃·햇살·달빛·밤) + 도화 지수 + 원국 + 키워드 + 태오 한마디 + 잠금 4항목 → v4 → 14,900원
   - 한계: 음력 변환 없음(양력으로 계산), 절기는 고정일 근사.

## 3. 캐릭터
| 이름 | 역할 | 비고 |
|---|---|---|
| 서하 (여) | 메인 호스트, 한남동 살롱 | |
| 이안 (남) | A/B용 남성 호스트, 서울 옥상 정자 | 나른·쿨·섹시, 저음. 험악/깡패 톤 금지 |
| 오방 수호신 | 하람(木 청룡) · 이안(火 주작) · 도준(土 황룡) · 시온(金 백호) · 재이(水 현무) | |
| 시온 | 그 사람 편 호스트 | 차분·건조한 저음 |
| 삼신 할매 | 2027 신년 종합 티저 | |
| **태오** | 도화 사주 호스트 | 흑발·꿀빛 앰버 눈·복숭아빛 원석 귀걸이·흰 셔츠·은색 목걸이·야경 펜트하우스. 연하 "누나" 톤 |

태오 Higgsfield ID: 기본 30e906e9-e6ec-48e4-8a4e-f2377c21d0e2 / 윙크 a77e7328-6663-4659-af52-5a628f45149f / 놀람 09c0b0c0-0d7b-40af-8786-4857cb55c0ff / 턱괴기 9604b2cc-9f3e-46f1-a6fa-f14c8e09042c
태오 영상: v1 678da4a2 / v2 98abebea / v3 2bf90f95 (3.6초에서 자름, 뒤 반복) / v4 ec8a41a2

## 4. 생성 레시피 (검증된 설정)
- 이미지: Higgsfield `gpt_image_2_5`, quality medium, 9:16(752×1344), 참조는 role `image_references`. 프롬프트에 항상 "ABSOLUTELY NO TEXT".
- 영상: `kling3_0`, mode pro, sound on, **start_image만** 사용(end_image=start_image 금지 → 포즈 고정됨). 약 2크레딧/초.
  - 항상 `declined_preset_id: 24bae836-2c4a-48e0-89b6-49fcc0b21612`.
  - 대사는 한국어를 그대로 입력(유니코드 이스케이프 금지 — "섭달" 오타 사고).
  - 목소리 흔들림 방지: VOICE 문구를 매 컷 **완전히 동일**하게. 그래도 틀리면 voice_change.
  - 생성 후 Higgsfield 샌드박스(faster-whisper)로 대사 전사 검증.
- 태오 VOICE 문구: "one young Korean man in his early 20s, native Seoul Korean, clear soft diction. Warm, soft, gentle mid-low voice at a quiet, intimate volume, as if speaking close to a microphone. Sweet and playful like a charming younger boyfriend teasing an older girl he likes, a smile audible in the voice, slightly breathy and tender. Smooth clean texture: no rasp, no gravel, not greasy, not oily, not theatrical, not loud, not childish, not high-pitched. Quiet room tone only, no background music."
- 이안 VOICE: 20대 중반, 낮고 벨벳 같은 약간 숨 섞인 목소리, 나른·쿨·무심, 거친 질감 금지, 저음 유지.
- 영상 후처리(ffmpeg): `scale=720:-2,fps=24`, libx264 main crf25 g48 faststart, loudnorm I=-19, 앞뒤 afade, silencedetect로 무음 트림.
- BGM: 음악 모델이 없어서 numpy로 합성(`bgm/synth.py` 서하용 가야금 앰비언트, `bgm/taeo.py` 태오용 로즈피아노 새벽 루프). Web Audio GainNode로 대사 중 자동 덕킹.
- 파일 전달 한계: 작업 환경에서 Higgsfield 결과(cloudfront)를 직접 못 받음 → 은주가 다운로드해서 채팅에 첨부.

## 5. 코드 구조 메모
- `proto/seoha-salon.html` 하나가 템플릿. `/*HOST*/…/*/HOST*/` 사이 HOST 객체만 바꿔 `build_ian.py`가 `ian-salon.html` 생성.
- 재생 엔진: blob 선로딩, 뒤 레이어 미리 디코드, 끝나기 0.14초 전 교차(280ms 페이드), iOS는 첫 탭에서 언락.
- 도화 → 홈 복귀: sessionStorage `toHome` 플래그로 홈 화면 바로 표시.
- 아티팩트 업데이트 시: 새 채팅에서는 먼저 아티팩트를 read 한 뒤 url 지정해서 publish.

## 6. 남은 할 일 / 아이디어
- [ ] 이안 체험판 아티팩트에 홈 글자 축소 + 도화 카드 반영
- [ ] 사업계획서 "입사 카드" → "수호신 카드" 용어 수정
- [ ] 도화 사주: 음력 변환, 절기 정밀 계산, 결과 공유 카드
- 제안만 된 아이디어: 광고용 숏폼, 인스타 스토리 공유 카드, 서하 채팅형 버전, 최애 영상 편지, 도화 궁합(홈에 COMING SOON 카드 있음)
