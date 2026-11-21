import json,sys
n=sys.argv[1]
d=json.load(open(f'dars-{n}/savollar.json'))
for q in d['questions']:
    print(f"@{q['id']}")
    print("Q:",q['q']['uz'])
    for o in q['options']: print(f"{o['key']}:",o['text']['uz'])
    print("W:",q['why']['uz']); print("O:",q['others']['uz'])
