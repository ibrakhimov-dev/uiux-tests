/**
 * UI/UX testlar — natijalarni qabul qiluvchi skript (v2)
 * Sayt: https://ibrakhimov-dev.github.io/uiux-tests/
 *
 * Har dars: 20 savol (1–15 nazariy, 16–20 amaliy), 27 daqiqa.
 * Har bir dars uchun alohida varaq (Dars-1, Dars-2 ...) avtomatik ochiladi.
 * Cheklov yo'q: kelgan har bir natija yangi qator bo'lib yoziladi.
 *
 * S1…S20 ustunlari — savolning ASL raqami bo'yicha (saytda savollar aralashtirilsa ham).
 * Qiymat: tanlangan variantning ASL harfi (savollar bankidagi A–D) + ✓ yoki ✗, javobsiz — "—".
 */

const TZ = 'Asia/Tashkent';
const SAVOL_SONI = 20;
const NAZARIY_SONI = 15;

const SARLAVHA = (function () {
  const s = ['Sana va vaqt', 'Ism', 'Familiya', 'ID', 'Ball', 'Foiz',
    'Nazariy (15)', 'Amaliy (5)', 'Sarflangan vaqt', 'Yakunlanish',
    'Chiqishlar soni', 'Til', 'Urinish №'];
  for (let i = 1; i <= SAVOL_SONI; i++) s.push('S' + i);
  s.push('Urinish kodi');
  return s;
})();
const ID_USTUNI = 4;
const BIRINCHI_SAVOL_USTUNI = 14; // S1

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // butun guruh bir vaqtda yuborsa ham navbat bilan yoziladi
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const nom = 'Dars-' + String(d.lesson).replace(/[^0-9A-Za-z-]/g, '');
    const sh = varaqniOl_(ss, nom);

    // Shu urinish kodi allaqachon yozilganmi? (sahifa yopilganda ikki marta yuborilsa)
    const qatorlar = Math.max(sh.getLastRow() - 1, 0);
    if (qatorlar > 0 && d.attemptId) {
      const kodlar = sh.getRange(2, SARLAVHA.length, qatorlar, 1).getValues().flat().map(String);
      if (kodlar.indexOf(String(d.attemptId)) !== -1) return javob_({ ok: true, duplicate: true });
    }

    // Urinish raqami: shu ID bilan nechanchi marta topshiryapti
    let urinish = 1;
    if (qatorlar > 0) {
      const idlar = sh.getRange(2, ID_USTUNI, qatorlar, 1).getValues().flat().map(String);
      urinish = idlar.filter(x => x === String(d.sid)).length + 1;
    }

    const javoblar = [];
    let ball = 0, nazariy = 0, amaliy = 0;
    for (let i = 0; i < SAVOL_SONI; i++) {
      const a = (d.answers || [])[i];
      if (!a || !a.chosen) { javoblar.push('—'); continue; }
      javoblar.push(String(a.chosen).slice(0, 1) + (a.correct ? ' ✓' : ' ✗'));
      if (a.correct) { ball++; if (i < NAZARIY_SONI) nazariy++; else amaliy++; }
    }

    const sabab = { finish: "O'zi yakunladi", timeout: 'Vaqt tugadi', left: 'Sahifa yopildi' }[d.endReason] || String(d.endReason || '');
    const sek = Math.max(0, Math.round(Number(d.durationSec) || 0));
    const vaqt = Math.floor(sek / 60) + ' daq ' + (sek % 60) + ' s';
    const til = { uz: "O'zbek", ru: 'Rus', en: 'Ingliz', ja: 'Yapon' }[d.lang] || String(d.lang || '');

    sh.appendRow([
      Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm:ss'),
      toza_(d.ism), toza_(d.familiya), toza_(d.sid),
      ball + '/' + SAVOL_SONI,
      Math.round(ball / SAVOL_SONI * 100) / 100,
      nazariy + '/' + NAZARIY_SONI,
      amaliy + '/' + (SAVOL_SONI - NAZARIY_SONI),
      vaqt, sabab,
      Math.max(0, Number(d.exits) || 0),
      til, urinish
    ].concat(javoblar).concat([toza_(d.attemptId)]));

    const r = sh.getLastRow();
    sh.getRange(r, 6).setNumberFormat('0%');
    sh.getRange(r, ID_USTUNI).setNumberFormat('@');
    if ((Number(d.exits) || 0) > 0) sh.getRange(r, 11).setBackground('#FDECEA');

    return javob_({ ok: true, attempt: urinish, score: ball });
  } catch (err) {
    return javob_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return javob_({ ok: true, message: 'UI/UX testlar skripti ishlayapti', version: 2, questions: SAVOL_SONI });
}

// Varaq bo'lmasa — yaratadi. Eski (15 savollik) varaq bo'lsa — nomini o'zgartirib, yangisini ochadi.
function varaqniOl_(ss, nom) {
  let sh = ss.getSheetByName(nom);
  if (sh) {
    const ustunlar = sh.getLastColumn();
    const bosh = ustunlar ? sh.getRange(1, 1, 1, ustunlar).getValues()[0] : [];
    if (bosh.length === SARLAVHA.length && bosh[BIRINCHI_SAVOL_USTUNI - 2] === 'Urinish №') return sh;
    sh.setName(nom + ' (eski)');
  }
  return yangiVaraq_(ss, nom);
}

function yangiVaraq_(ss, nom) {
  const sh = ss.insertSheet(nom);
  sh.getRange(1, 1, 1, SARLAVHA.length).setValues([SARLAVHA])
    .setFontWeight('bold').setBackground('#0E0B17').setFontColor('#FFFFFF');
  sh.getRange(1, BIRINCHI_SAVOL_USTUNI, 1, NAZARIY_SONI).setBackground('#3B2A6B');            // nazariy
  sh.getRange(1, BIRINCHI_SAVOL_USTUNI + NAZARIY_SONI, 1, SAVOL_SONI - NAZARIY_SONI).setBackground('#24407A'); // amaliy
  sh.setFrozenRows(1);
  sh.setFrozenColumns(4);
  sh.setColumnWidth(1, 150);
  sh.setColumnWidths(BIRINCHI_SAVOL_USTUNI, SAVOL_SONI, 52);
  sh.hideColumns(SARLAVHA.length);
  // Birinchi bo'sh "Sheet1" varag'ini olib tashlash
  const bosh = ss.getSheetByName('Sheet1') || ss.getSheetByName('Лист1') || ss.getSheetByName('Varaq1');
  if (bosh && ss.getSheets().length > 1 && bosh.getLastRow() === 0) ss.deleteSheet(bosh);
  return sh;
}

// Formulaga o'xshagan matnni (=, +, -, @ bilan boshlangan) oddiy matnga aylantiradi, uzunlikni cheklaydi
function toza_(v) {
  const s = String(v == null ? '' : v).trim().slice(0, 80);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function javob_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
