# 오방사주 작업 원본 (source 브랜치)

이 브랜치는 **작업 원본**이다. 넷리파이는 `main`(빌드 결과)만 배포한다.

- `proto/` 화면·스크립트·이미지·영상 원본 (seoha-salon.html = 홈, 빌드 시 index.html)
- `tools/` 빌드·배포·영상 압축·검사 스크립트 (build_site.py → export/site, deploy_push.sh → main 푸시)
- `server/` 넷리파이 서버 함수(/api/premai, /api/chat). 키는 넷리파이 환경변수 ANTHROPIC_API_KEY에만.
- `HANDOFF.md` 작업 인수인계서(상세 기록)

새 작업 환경에서 이어 하기: 이 브랜치를 받아 `tools/`의 스크립트 경로(SP)를 새 위치로 맞춘 뒤 build_site.py → deploy_push.sh.
