#!/bin/bash
# 체험판 → GitHub(yeniej21-crypto/OBANG) main → 넷리파이 자동 배포
# 끝나면 작업 원본을 source 브랜치에 자동 백업(backup.sh)한다.
# 사용: bash deploy_push.sh "바뀐 내용 한 줄"
# 되돌리기: 배포마다 deploy-YYYYMMDD-HHMM 태그가 붙는다 → bash rollback.sh deploy-...
set -e
SP=$(cd "$(dirname "$0")" && pwd)
python3 "$SP/check_js.py" || { echo "배포 중단: 스크립트 오류"; exit 1; }
python3 "$SP/build_site.py"
R=/home/claude/obang
[ -d $R/.git ] || git clone https://github.com/yeniej21-crypto/OBANG $R
cd $R && git checkout -q main && git pull -q --rebase origin main || true
find . -mindepth 1 -maxdepth 1 ! -name .git ! -name .gitignore -exec rm -rf {} +
cp -a "$SP/export/site/." ./
[ -d "$SP/server" ] && cp -a "$SP/server/." ./
git add -A
STAMP=$(TZ=Asia/Seoul date +%Y%m%d-%H%M)
if git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "${1:-체험판 업데이트}

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FmgSvuqEnPSFM3XEzPX8mV"; then
  git push -q origin main && git log --oneline | head -1
  git tag -f "deploy-$STAMP" >/dev/null && git push -q -f origin "deploy-$STAMP" && echo "되돌리기 표시: deploy-$STAMP"
else
  echo "배포본: 바뀐 것 없음"
fi
bash "$SP/backup.sh" "${1:-체험판 업데이트}"
