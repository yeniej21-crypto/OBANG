"""recipes/history.json + HANDOFF.md → recipes/영상_레시피_전체.md, recipes/서비스_영상_레시피.md
- 전체: 2026-09-01 이후 클링 영상 전부(대사 · 목소리 · 시작 그림 · 설정 · 전체 지시문)
- 서비스: HANDOFF에 기록된 작업 ID와 맞는 영상만, HANDOFF 설명 줄과 함께"""
import json, re, os, datetime
B = os.path.join(os.path.dirname(__file__), '..')
H = json.load(open(f'{B}/recipes/history.json'))
byid = {h['id']: h for h in H}
pre = {h['id'][:8]: h for h in H}
START = datetime.datetime(2026, 9, 1).timestamp()
ho = open(f'{B}/HANDOFF.md', encoding='utf-8').read().splitlines()
ctx = {}
for ln in ho:
    for m in re.findall(r'\b([0-9a-f]{8})\b', ln):
        if m in pre: ctx.setdefault(m, []).append(ln.strip()[:400])
def ts(h):
    t = h.get('created')
    try: return float(t)
    except Exception: return 0
def dia(p):
    q = re.findall(r'[“"]([^”"]*[가-힣][^”"]*)[”"]', p)
    return ' / '.join(q)
def voice(p):
    m = re.search(r'(?:Voice|VOICE|voice)\s*:\s*(.+?)(?=(?:Camera|CAMERA|Keep|No text|$))', p, re.S)
    return (m.group(1).strip() if m else '')
def setting(h):
    p = h['params']; keys = ['mode', 'duration', 'sound', 'aspect_ratio', 'cfg_scale', 'width', 'height']
    return ', '.join(f'{k}={p[k]}' for k in keys if k in p)
def start(h):
    s = [m for m in h['medias'] if m.get('role') in ('start_image', 'image', 'input_image', 'start')]
    return s[0] if s else (h['medias'][0] if h['medias'] else {})
def block(h, note=None):
    s = start(h); dt = datetime.datetime.utcfromtimestamp(ts(h)).strftime('%Y-%m-%d %H:%M UTC') if ts(h) else ''
    out = [f"### {h['id'][:8]} · {h['model']} · {dt}", '']
    if note:
        for n in note[:3]: out.append(f'> HANDOFF: {n}')
        out.append('')
    out += [f"- 작업 ID: `{h['id']}`", f"- 상태: {h['status']}", f"- 설정: {setting(h)}"]
    if s: out.append(f"- 시작 그림: `{s.get('id')}` {s.get('url') or ''}")
    if dia(h['prompt']): out.append(f"- 대사: {dia(h['prompt'])}")
    if voice(h['prompt']): out.append(f"- 목소리: {voice(h['prompt'])}")
    if h.get('url'): out.append(f"- 결과 원본: {h['url']}")
    out += ['', '```text', h['prompt'].strip(), '```', '']
    return '\n'.join(out)
vids = sorted([h for h in H if h['type'] == 'video' and ts(h) >= START], key=ts)
head = '# 영상 레시피 전체 (2026-09-01 이후, Higgsfield 기록에서 자동 생성)\n\n다시 만드는 법은 docs/08_생성 레시피.md 참고. 같은 시작 그림 · 같은 지시문 · 같은 설정이면 같은 목소리 결의 영상이 다시 나온다(완전히 같은 결과는 아님).\n\n'
open(f'{B}/recipes/영상_레시피_전체.md', 'w').write(head + '\n'.join(block(h, ctx.get(h['id'][:8])) for h in vids))
svc = [h for h in vids if h['id'][:8] in ctx]
open(f'{B}/recipes/서비스_영상_레시피.md', 'w').write('# 서비스·기록에 남은 영상 레시피 (HANDOFF에 적힌 작업만)\n\n' + '\n'.join(block(h, ctx[h['id'][:8]]) for h in svc))
imgs = sorted([h for h in H if h['type'] == 'image' and ts(h) >= START and h['id'][:8] in ctx], key=ts)
def iblock(h):
    refs = ', '.join(f"{m.get('role')}:{(m.get('id') or '')[:8]}" for m in h['medias'])
    p = h['params']; st = ', '.join(f'{k}={p[k]}' for k in ('aspect_ratio', 'quality', 'resolution', 'width', 'height') if k in p)
    return '\n'.join([f"### {h['id'][:8]} · {h['model']}", ''] + [f'> HANDOFF: {n}' for n in ctx[h['id'][:8]][:2]] + ['', f"- 작업 ID: `{h['id']}`", f'- 설정: {st}', f'- 참조: {refs or "없음"}', f"- 원본: {h.get('url') or ''}", '', '```text', h['prompt'].strip(), '```', ''])
open(f'{B}/recipes/서비스_그림_레시피.md', 'w').write('# 서비스·기록에 남은 그림 레시피 (HANDOFF에 적힌 작업만)\n\n' + '\n'.join(iblock(h) for h in imgs))
print('videos', len(vids), 'service videos', len(svc), 'service images', len(imgs))
