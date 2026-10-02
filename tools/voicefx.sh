#!/bin/bash
# 캐릭터 목소리 후처리(화면 · 입 타이밍 그대로, 목소리만 바꿈). 값은 캐릭터 시트(docs/10)에 고정 기록.
# 사용: bash voicefx.sh <프리셋> <원본.mp4> <결과.mp4>
# 프리셋: noeul_B_rev | noeul_C_rev | noeul_B_duo | noeul_C_duo
set -e
P=$1; IN=$2; OUT=$3; D=$(cd "$(dirname "$0")" && pwd); IR=$D/voicefx_ir_hall.wav
case $P in
  noeul_B_rev) F=1.1892; R=1.1892; LAYER=0;;      # 높이 +6반음, 음색 +3반음, 홀 잔향
  noeul_C_rev) F=1.2240; R=1.2969; LAYER=0;;      # 높이 +8반음, 음색 +3.5반음, 홀 잔향
  noeul_B_duo) F=1.1892; R=1.1892; LAYER=0.35;;   # B + 원래 목소리 0.35 겹침(음양 이중음성) + 홀 잔향
  noeul_C_duo) F=1.2240; R=1.2969; LAYER=0.35;;
  *) echo "모르는 프리셋: $P"; exit 1;;
esac
ffmpeg -v error -y -i "$IN" -i "$IR" -filter_complex "\
[0:a]aresample=48000,aformat=channel_layouts=stereo,asplit=2[o1][o2];\
[o1]rubberband=pitch=$F:formant=shifted:pitchq=quality:window=long:transients=smooth,rubberband=pitch=$R:formant=preserved:pitchq=quality:window=long:transients=smooth,lowpass=f=9000[hi];\
[o2]lowpass=f=5000,volume=$LAYER[lo];\
[hi][lo]amix=inputs=2:weights='1 1':normalize=0[dry];\
[dry]asplit=2[d1][d2];[d2][1:a]afir=dry=0:wet=1[wet];\
[d1][wet]amix=inputs=2:weights='1 0.55':normalize=0,loudnorm=I=-18:TP=-1.5,aresample=48000[a]" \
-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 "$OUT"
echo "완료: $OUT ($P)"
