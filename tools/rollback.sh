#!/bin/bash
# 배포본을 예전 배포 시점으로 되돌린다(기록은 지우지 않고, 예전 내용으로 새 커밋을 만든다).
# 사용: bash rollback.sh                → 되돌릴 수 있는 시점 목록
#       bash rollback.sh deploy-20261002-0030
set -e
R=/home/claude/obang
[ -d $R/.git ] || git clone https://github.com/yeniej21-crypto/OBANG $R
cd $R && git fetch -q --tags origin && git checkout -q main && git pull -q --rebase origin main
if [ -z "$1" ]; then git tag -l 'deploy-*' | sort | tail -30; echo "(위 이름 중 하나를 붙여 다시 실행)"; exit 0; fi
git rev-parse -q --verify "refs/tags/$1" >/dev/null || { echo "그런 표시 없음: $1"; exit 1; }
find . -mindepth 1 -maxdepth 1 ! -name .git ! -name .gitignore -exec rm -rf {} +
git checkout "$1" -- .
git add -A
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "되돌리기: $1 시점 배포본으로

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FmgSvuqEnPSFM3XEzPX8mV" && git push -q origin main && echo "되돌림 완료: $1 → 넷리파이가 1~2분 안에 다시 배포"
