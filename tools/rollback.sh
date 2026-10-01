#!/bin/bash
# 배포본을 예전 배포 시점으로 되돌린다(기록은 지우지 않고, 예전 내용으로 새 커밋을 만든다).
# 사용: bash rollback.sh                → 되돌릴 수 있는 시점 목록
#       bash rollback.sh 84cd69e        (배포 커밋 번호)
set -e
R=/home/claude/obang
[ -d $R/.git ] || git clone https://github.com/yeniej21-crypto/OBANG $R
cd $R && git checkout -q main && git pull -q --rebase origin main
if [ -z "$1" ]; then git log --date=format-local:'%m-%d %H:%M' --format='%h  %ad  %s' -30 main; echo "(왼쪽 번호 하나를 붙여 다시 실행)"; exit 0; fi
git cat-file -e "$1^{commit}" 2>/dev/null || { echo "그런 배포 없음: $1"; exit 1; }
find . -mindepth 1 -maxdepth 1 ! -name .git ! -name .gitignore -exec rm -rf {} +
git checkout "$1" -- .
git add -A
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "되돌리기: $1 시점 배포본으로

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FmgSvuqEnPSFM3XEzPX8mV" && git push -q origin main && echo "되돌림 완료: $1 → 넷리파이가 1~2분 안에 다시 배포"
