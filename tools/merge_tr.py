"""tools/tr/dars-N.<lang>.txt tarjimalarini dars-N/savollar.json ga qo'shadi."""
import json, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
def parse(path):
    out = {}
    for block in re.split(r'^@', path.read_text(encoding='utf-8'), flags=re.M)[1:]:
        lines = block.strip('\n').split('\n')
        qid = int(lines[0].strip()); d = {}
        for ln in lines[1:]:
            m = re.match(r'^([QABCDWO]): (.+)$', ln)
            if not m: raise SystemExit(f'{path.name} @{qid}: bad line {ln!r}')
            d[m[1]] = m[2].strip()
        miss = set('QABCDWO') - set(d)
        if miss: raise SystemExit(f'{path.name} @{qid}: missing {miss}')
        out[qid] = d
    return out
def main(ns):
    for n in ns:
        f = ROOT / f'dars-{n}' / 'savollar.json'
        data = json.loads(f.read_text(encoding='utf-8'))
        for lang in ('ru', 'en', 'ja'):
            p = ROOT / 'tools' / 'tr' / f'dars-{n}.{lang}.txt'
            if not p.exists(): print(f'dars-{n}: {lang} yo\'q'); continue
            tr = parse(p)
            ids = {q['id'] for q in data['questions']}
            if set(tr) != ids: raise SystemExit(f'{p.name}: ids mismatch {sorted(ids ^ set(tr))}')
            for q in data['questions']:
                t = tr[q['id']]
                q['q'][lang] = t['Q']; q['why'][lang] = t['W']; q['others'][lang] = t['O']
                for o in q['options']: o['text'][lang] = t[o['key']]
            print(f'dars-{n}: {lang} ok')
        f.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
if __name__ == '__main__':
    main([int(a) for a in sys.argv[1:]] or range(1, 8))
