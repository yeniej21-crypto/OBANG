#!/bin/bash
# 체험판 → GitHub(yeniej21-crypto/OBANG) → 넷리파이 자동 배포
# 사용: bash deploy_push.sh "바뀐 내용 한 줄"
set -e
SP=$(cd "$(dirname "$0")" && pwd)
python3 "$SP/build_site.py"
R=/home/claude/obang
[ -d $R/.git ] || git clone --depth 1 https://github.com/yeniej21-crypto/OBANG $R
cd $R && git pull -q --rebase origin main || true
find . -mindepth 1 -maxdepth 1 ! -name .git ! -name .gitignore -exec rm -rf {} +
cp -a "$SP/export/site/." ./
[ -d "$SP/server" ] && cp -a "$SP/server/." ./
git add -A
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "${1:-체험판 업데이트}

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FmgSvuqEnPSFM3XEzPX8mV" || { echo "바뀐 것 없음"; exit 0; }
git push -q origin main && git log --oneline | head -1
