#!/bin/bash
# 작업 원본 전체 → GitHub source 브랜치 백업
# 사용: bash backup.sh "무엇을 했는지 한 줄"
# deploy_push.sh가 배포 끝에 자동으로 부른다. 배포 없이 작업만 했을 때도 수시로 직접 돌린다.
set -e
SP=$(cd "$(dirname "$0")" && pwd)            # 작업 폴더(proto/ 가 있는 곳)
S=${OB_SRC:-/home/claude/obang-src}           # source 브랜치 작업본
REPO=https://github.com/yeniej21-crypto/OBANG
if ! git -C "$S" rev-parse --git-dir >/dev/null 2>&1; then
  git clone -q --branch source "$REPO" "$S"
fi
cd "$S"
git pull -q --rebase origin source 2>/dev/null || true

# 1) 화면 원본: 통째로 바꿔 넣는다(지운 파일도 반영). 밑줄로 시작하는 임시 파일은 뺀다.
rm -rf proto && mkdir proto
( cd "$SP/proto" && tar cf - --exclude='./_*' . ) | ( cd proto && tar xf - )

# 2) 도구: 작업 폴더 맨 위의 스크립트 전부
mkdir -p tools
for f in "$SP"/*.py "$SP"/*.sh "$SP"/*.js "$SP"/*.cjs "$SP"/*.mjs; do [ -f "$f" ] && cp -a "$f" tools/; done

# 3) 화면 버전 백업(bk/) — 예전 화면으로 되돌릴 때 쓴다
[ -d "$SP/bk" ] && { rm -rf bk; cp -a "$SP/bk" bk; }

# 4) 생성 요청 · 가공 스크립트(하위 폴더의 py/json/txt/md/sh) → work/
mkdir -p work
( cd "$SP" && find . \( -path ./proto -o -path ./export -o -path ./node_modules -o -path './fonts*' -o -path ./bk -o -path ./artifact-files \) -prune -o \
    -mindepth 2 -maxdepth 3 -type f \( -name '*.py' -o -name '*.json' -o -name '*.txt' -o -name '*.md' -o -name '*.sh' \) -size -2M -print ) \
  | while read -r f; do mkdir -p "work/$(dirname "$f")"; cp -a "$SP/$f" "work/$f"; done

# 5) 인수인계서: 원본은 source 쪽 HANDOFF.md 하나(작업 폴더의 HANDOFF.md는 그 링크).
#    링크가 아닌 옛 사본이 있으면 덮어쓰지 않고 멈춘다(최신 기록이 옛 사본에 덮인 사고 방지).
if [ -f "$SP/HANDOFF.md" ] && [ ! -L "$SP/HANDOFF.md" ]; then
  echo "백업 중단: $SP/HANDOFF.md 가 링크가 아님 → 내용 합친 뒤 ln -sf $S/HANDOFF.md $SP/HANDOFF.md"; exit 1; fi
[ -f "$SP/DEPLOYS.log" ] && cp -a "$SP/DEPLOYS.log" DEPLOYS.log
[ -d "$SP/server" ] && { rm -rf server; cp -a "$SP/server" server; }

# 6) 생성 레시피: 이 대화에 저장된 Higgsfield 기록 파일이 있으면 합쳐서 다시 만든다
H=$(ls /root/.claude/projects/*/*/tool-results/mcp-Higgsfield-show_generations-*.txt 2>/dev/null || true)
[ -n "$H" ] && python3 tools/recipes_merge.py $H >/dev/null 2>&1 || true
[ -f tools/recipes_book.py ] && python3 tools/recipes_book.py >/dev/null 2>&1 || true

# 일회용 업로드 주소(서명 토큰 포함)는 지운다
grep -rIl 'X-Amz-' --exclude-dir=.git tools work recipes 2>/dev/null | while read -r f; do
  sed -i -E "s/\?(서명 주소 지움)"' )]*/?(서명 주소 지움)/g" "$f"; done
# 비밀 정보 검사: 키처럼 생긴 문자열이 있으면 멈춘다
if grep -rIlE 'sk-ant-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC )?PRIVATE KEY' --exclude-dir=.git . ; then
  echo "백업 중단: 키로 보이는 문자열이 있음(위 파일 확인)"; exit 1
fi

git add -A
STAMP=$(TZ=Asia/Seoul date +%Y%m%d-%H%M)
if git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "백업: ${1:-작업 원본} ($STAMP)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FmgSvuqEnPSFM3XEzPX8mV"; then
  git push -q origin HEAD:source || git push -q origin HEAD:source
  [ "$(git ls-remote origin refs/heads/source | cut -c1-40)" = "$(git rev-parse HEAD)" ] && echo "백업 완료: source $(git log --oneline | head -1)" || { echo "백업 올리기 실패: 다시 돌릴 것"; exit 1; }
else
  echo "백업: 바뀐 것 없음"
fi
