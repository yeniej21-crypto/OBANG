"""show_generations 결과 파일(JSON: items, next_cursor)을 모아 recipes/history.json 으로 합친다.
사용: python3 tools/recipes_merge.py 파일1 파일2 ...  (기존 history.json 과 id 기준으로 합침)"""
import json, sys, os
OUT = os.path.join(os.path.dirname(__file__), '..', 'recipes', 'history.json')
H = {}
if os.path.exists(OUT):
    for r in json.load(open(OUT)): H[r['id']] = r
cur = None
for p in sys.argv[1:]:
    try: d = json.load(open(p))
    except Exception: continue
    for it in d.get('items', []):
        pr = it.get('params', {}) or {}
        meds = [dict(role=m.get('role'), id=(m.get('data') or {}).get('id'), url=(m.get('data') or {}).get('url')) for m in pr.get('medias', []) or []]
        res = it.get('results') or {}
        H[it['id']] = dict(id=it['id'], type=it.get('type'), status=it.get('status'), model=it.get('model'),
            created=it.get('created_at') or it.get('createdAt') or '', prompt=pr.get('prompt', ''),
            params={k: v for k, v in pr.items() if k not in ('prompt', 'medias')}, medias=meds,
            url=res.get('rawUrl') or res.get('url') or res.get('min', {}).get('url') if isinstance(res, dict) else None)
    cur = d.get('next_cursor')
rows = sorted(H.values(), key=lambda r: r['url'] or '')
json.dump(rows, open(OUT, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(rows), 'items; last cursor', cur)
print(Counter((r['type'], r['model']) for r in rows).most_common())
