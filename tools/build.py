"""lessons.json asosida har bir dars uchun dars-N/index.html sahifasini yaratadi.
Yangi dars qo'shish: 1) lessons.json'ga qator qo'shing, 2) dars-N/savollar.json qo'ying, 3) python3 tools/build.py"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TPL = '''<!doctype html>
<html lang="uz" data-base="../">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{n}-dars testi · Ibrakhimov Dev</title>
<meta name="description" content="{title} — 20 savollik test (15 nazariy + 5 amaliy), 27 daqiqa.">
<meta name="theme-color" content="#0E0B17">
<link rel="icon" href="../assets/img/mark.svg" type="image/svg+xml">
<link rel="icon" href="../assets/img/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="../assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="../assets/css/style.css">
<script>try{{var th=JSON.parse(localStorage.getItem('uiux:theme'));if(th)document.documentElement.setAttribute('data-theme',th)}}catch(e){{}}</script>
</head>
<body data-page="tests" data-lesson="{n}">
<header id="site-header"></header>
<main id="main"><div id="app"><div class="container section"><div class="card empty">…</div></div></div></main>
<footer id="site-footer"></footer>
<script src="../assets/js/i18n.js"></script>
<script src="../assets/js/common.js"></script>
<script src="../assets/js/test.js"></script>
</body>
</html>
'''
lessons = json.load(open(os.path.join(ROOT, 'lessons.json'), encoding='utf-8'))['lessons']
for l in lessons:
    d = os.path.join(ROOT, f"dars-{l['n']}")
    os.makedirs(d, exist_ok=True)
    assert os.path.exists(os.path.join(d, 'savollar.json')), f"dars-{l['n']}/savollar.json yo'q"
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(TPL.format(n=l['n'], title=l['title']['uz']))
print('ok:', [l['n'] for l in lessons])
