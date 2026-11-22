"""tools/src/dars-N.uz.txt (o'zbekcha manba) -> dars-N/savollar.json, keyin ru/en/ja tarjimalari qo'shiladi.
Format: @id / Q: / A:-D: / K: to'g'ri javob harfi / W: nega to'g'ri / O: qolganlari. 1-15 nazariy, 16-20 amaliy.
Ishlatish: python3 tools/src2json.py 8"""
import json, re, sys, pathlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parent.parent
THEORY = 15
def main(n):
    src = (ROOT / 'tools' / 'src' / f'dars-{n}.uz.txt').read_text(encoding='utf-8')
    qs = []
    for block in re.split(r'^@', src, flags=re.M)[1:]:
        lines = block.strip('\n').split('\n'); qid = int(lines[0]); d = {}
        for ln in lines[1:]:
            m = re.match(r'^([QABCDKWO]): (.+)$', ln)
            if not m: raise SystemExit(f'@{qid}: bad line {ln!r}')
            d[m[1]] = m[2].strip()
        assert set('QABCDKWO') <= set(d), (qid, set('QABCDKWO') - set(d))
        qs.append({'id': qid, 'type': 'theory' if qid <= THEORY else 'practice', 'q': {'uz': d['Q']},
                   'options': [{'key': k, 'text': {'uz': d[k]}} for k in 'ABCD'],
                   'answer': d['K'], 'why': {'uz': d['W']}, 'others': {'uz': d['O']}})
    lessons = json.loads((ROOT / 'lessons.json').read_text(encoding='utf-8'))['lessons']
    title = next(l['title'] for l in lessons if l['n'] == n)
    out = ROOT / f'dars-{n}' / 'savollar.json'; out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps({'lesson': n, 'title': title, 'minutes': 27, 'questions': qs}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'dars-{n}: {len(qs)} savol')
    subprocess.run([sys.executable, str(ROOT / 'tools' / 'merge_tr.py'), str(n)], check=True)
if __name__ == '__main__':
    main(int(sys.argv[1]))
