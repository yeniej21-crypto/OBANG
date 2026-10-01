#!/bin/bash
# 새 작업 환경(새 대화 · 새 컴퓨터)에서 한 번에 작업 상태를 되살린다.
# 사용: curl 또는 git으로 source 브랜치의 tools/restore.sh 를 받아서
#       bash restore.sh [작업폴더]      (기본: ~/obang-work)
set -e
W=${1:-$HOME/obang-work}
REPO=https://github.com/yeniej21-crypto/OBANG
S=/home/claude/obang-src; R=/home/claude/obang
mkdir -p /home/claude
[ -d $S/.git ] || [ -f $S/.git ] || git clone -q --branch source "$REPO" $S
[ -d $R/.git ] || git clone -q "$REPO" $R
git -C $S fetch -q origin || true
mkdir -p "$W"
cp -a $S/proto "$W/"                       # 화면 원본
cp -a $S/tools/. "$W/"                     # 스크립트(check_js · build_site · deploy_push · backup ...)
[ -d $S/bk ] && cp -a $S/bk "$W/"           # 화면 버전 백업
[ -d $S/work ] && cp -a $S/work/. "$W/"     # 생성 요청 · 가공 스크립트
ln -sf $S/HANDOFF.md "$W/HANDOFF.md"          # 인수인계서는 원본 하나만(링크)
echo "복구 완료: $W"
echo "- 다음: $W/HANDOFF.md 와 $S/docs/00_시작 안내.md 를 읽는다"
echo "- 배포: bash $W/deploy_push.sh \"내용\"   (배포 뒤 자동 백업)"
echo "- 백업만: bash $W/backup.sh \"내용\""
echo "- 생성 레시피: $S/recipes/ (서비스_영상_레시피.md · 영상_레시피_전체.md · history.json)"
