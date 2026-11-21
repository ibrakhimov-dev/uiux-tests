"""Savollar banki (markdown) -> dars-N/savollar.json. Foydalanish: python3 bank2json.py bank.md <repo_dir>"""
import re, json, sys, os
src, out = sys.argv[1], sys.argv[2]
md = open(src, encoding='utf-8').read().replace('\\[', '[').replace('\\]', ']')
lessons = re.split(r'^## (\d+)-dars: (.+)$', md, flags=re.M)
meta = []
LT = {l['n']: l['title'] for l in json.load(open(os.path.join(out, 'lessons.json'), encoding='utf-8'))['lessons']} if os.path.exists(os.path.join(out, 'lessons.json')) else {}
for i in range(1, len(lessons), 3):
    num, title, body = int(lessons[i]), lessons[i+1].strip(), lessons[i+2]
    topics = re.search(r'^Tekshiriladi: (.+)$', body, re.M)
    qs = []
    for m in re.finditer(r'\*\*(\d+)\. ([^\n]+?)\*\*\n\n((?:- [A-D]\) [^\n]+\n)+)\nJavob: \*\*([A-D])\*\*\. (.+?) Qolganlari: (.+?)(?=\n\n|\Z)', body, re.S):
        qid = int(m.group(1))
        opts = [{'key': o[0], 'text': {'uz': o[1].strip()}} for o in re.findall(r'- ([A-D])\) (.+)', m.group(3))]
        assert len(opts) == 4, (num, qid)
        qs.append({'id': qid, 'type': 'theory' if qid <= 15 else 'practice',
                   'q': {'uz': m.group(2).strip()}, 'options': opts, 'answer': m.group(4),
                   'why': {'uz': m.group(5).strip()}, 'others': {'uz': m.group(6).strip()}})
    assert [q['id'] for q in qs] == list(range(1, 21)), (num, [q['id'] for q in qs])
    d = os.path.join(out, f'dars-{num}'); os.makedirs(d, exist_ok=True)
    json.dump({'lesson': num, 'title': LT.get(num, {'uz': title}), 'minutes': 27, 'questions': qs},
              open(os.path.join(d, 'savollar.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    meta.append((num, title, len(qs)))
print(meta)
# ru/en/ja tarjimalarini qayta qo'shish (tools/tr/*.txt)
import subprocess
subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'merge_tr.py')] + [str(m[0]) for m in meta], check=True)
