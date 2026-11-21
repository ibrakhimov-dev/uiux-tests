# UI/UX testlar · Ibrakhimov Dev

UI/UX dizayn kursi (Japan Digital University) uchun dars testlari. Har dars: **20 savol (15 nazariy + 5 amaliy), 27 daqiqa**, har savolga tahlil. Natijalar Google Sheets'ga yoziladi.

Sayt: https://ibrakhimov-dev.github.io/uiux-tests/

## Tuzilma

```
index.html            bosh sahifa (darslar ro'yxati lessons.json'dan)
docs.html             Documentation: dizayn qarorlari qaysi darsdan chiqqani
lessons.json          darslar ro'yxati (4 tilda nomlar)
dars-N/index.html     dars testi sahifasi (tools/build.py yaratadi)
dars-N/savollar.json  savollar: { uz, ru, en, ja }
assets/css/style.css  Figma tokenlari (qorong'u / yorug' rejim)
assets/js/i18n.js     interfeys matnlari: uz, ru, en, ja
assets/js/common.js   sozlamalar (Apps Script manzili), til, rejim, header, modal
assets/js/test.js     test dvigateli: taymer, chiqishlar, yakunlash, natija, tahlil
apps-script/Code.gs   Google Sheets qabul qiluvchi skript
tools/bank2json.py    savollar banki (markdown) -> dars-N/savollar.json (oxirida tarjimalarni ham qo'shadi)
tools/tr/             savollarning ru/en/ja tarjimalari: dars-N.<til>.txt
tools/merge_tr.py     tools/tr tarjimalarini dars-N/savollar.json ga qo'shadi
tools/build.py        lessons.json -> dars-N/index.html
```

## Yangi dars qo'shish

1. `lessons.json` ga qator qo'shing: `{"n": 8, "title": {"uz": "...", "ru": "...", "en": "...", "ja": "..."}, "new": true}` (oldingi darsdan `new` ni olib tashlang).
2. `dars-8/savollar.json` faylini qo'ying.
3. `python3 tools/build.py` — `dars-8/index.html` yaratiladi.

## Qoidalar

- Savollar ham, variantlar ham har talaba uchun aralashtiriladi (nazariy 1–15, amaliy 16–20 o'z blokida).
- 27 daqiqa; vaqt tugasa yoki sahifa yopilsa — test avtomatik yakunlanadi va yuboriladi.
- Boshqa oyna/ilovaga o'tish sanaladi, ogohlantiriladi va jadvalga yoziladi; test davom etadi.
- Urinishlar cheklanmagan. Javoblar qurilmada saqlanadi, internet uzilsa natija navbatda turib, qayta yuboriladi (server bir urinishni ikki marta yozmaydi).
- Jadvalda S1–S20 — savolning asl raqami bo'yicha, qiymati — asl harf (A–D) + ✓/✗.

## Tarjimalar

Savollar 4 tilda: uz, ru, en, ja. Sayt tilini almashtirganda savollar, variantlar va izohlar ham almashadi (test davomida ham).
Tarjima fayli formati (`tools/tr/dars-N.en.txt`):

```
@1
Q: savol
A: variant A
B: variant B
C: variant C
D: variant D
W: nega to'g'ri
O: qolganlari nega noto'g'ri
```

Savol o'zgarsa, tarjima faylini ham tuzating va `python3 tools/merge_tr.py N` ni ishga tushiring.
Biror tilda tarjima bo'lmasa, sayt o'zbekchasini ko'rsatadi.
