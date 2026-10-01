"""대화 기록(jsonl)에서 Higgsfield 생성 요청 · 결과를 모아 recipes/gen_log.json 으로 저장한다.
사용: python3 tools/recipes_extract.py transcript1.jsonl [transcript2.jsonl ...]
기존 gen_log.json 과 합쳐서(job_id 기준) 덮어쓴다."""
import json, sys, re, os
OUT = os.path.join(os.path.dirname(__file__), '..', 'recipes', 'gen_log.json')
UUID = re.compile(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')
def text_of(c):
    if isinstance(c, str): return c
    if isinstance(c, list): return '\n'.join(text_of(x.get('text', '') if isinstance(x, dict) else x) for x in c)
    return str(c)
log = {}
if os.path.exists(OUT):
    for r in json.load(open(OUT)): log[r['job_id']] = r
for path in sys.argv[1:]:
    calls = {}
    for line in open(path, encoding='utf-8'):
        try: e = json.loads(line)
        except Exception: continue
        msg = e.get('message') or {}
        cont = msg.get('content')
        if not isinstance(cont, list): continue
        ts = e.get('timestamp', '')
        for b in cont:
            if not isinstance(b, dict): continue
            if b.get('type') == 'tool_use' and 'Higgsfield__generate_' in b.get('name', ''):
                calls[b['id']] = (b['name'].split('__')[-1], b.get('input', {}), ts)
            elif b.get('type') == 'tool_result' and b.get('tool_use_id') in calls:
                kind, inp, ts0 = calls[b['tool_use_id']]
                t = text_of(b.get('content'))
                try: res = json.loads(t)
                except Exception: res = None
                if kind.endswith('_batch') and isinstance(res, dict) and 'jobs' in res:
                    reqs = {r['index']: r['params'] for r in inp.get('requests', [])}
                    for j in res['jobs']:
                        if not j.get('job_id'): continue
                        log[j['job_id']] = dict(job_id=j['job_id'], tool=kind, time=ts0, **{'params': reqs.get(j.get('index'), {})})
                else:
                    ids = UUID.findall(t)
                    # 입력에 있던 uuid(참조 이미지)는 빼고 새로 생긴 것만
                    inids = set(UUID.findall(json.dumps(inp)))
                    new = [i for i in dict.fromkeys(ids) if i not in inids]
                    p = inp.get('params', inp)
                    for i in new[:max(1, int(p.get('count', 1) or 1))]:
                        log[i] = dict(job_id=i, tool=kind, time=ts0, params=p)
rows = sorted(log.values(), key=lambda r: r.get('time', ''))
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(rows, open(OUT, 'w'), ensure_ascii=False, indent=1)
print(len(rows), 'jobs →', os.path.abspath(OUT))
from collections import Counter
print(Counter((r['params'].get('model'), r['tool']) for r in rows).most_common())
