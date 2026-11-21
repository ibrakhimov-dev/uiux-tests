/* Bosh sahifa: darslar ro'yxati lessons.json'dan quriladi — yangi dars qo'shish uchun faqat shu faylga qator qo'shiladi */
(function () {
  const { t, tx, CONFIG: C, store, I, esc } = App;
  let lessons = [];

  function render() {
    document.getElementById('hero-title').innerHTML = esc(t('home.title', { m: C.minutes })).replace(String(C.minutes), `<span class="grad">${C.minutes}</span>`);
    document.getElementById('hero-lead').textContent = t('home.lead', { t: C.total, th: C.theory, pr: C.total - C.theory });
    document.getElementById('hero-chips').innerHTML =
      `<span class="chip chip-brand">${I.grid}${esc(t('chip.q', { t: C.total }))}</span>` +
      `<span class="chip chip-brand">${I.clock}${esc(t('chip.m', { m: C.minutes }))}</span>` +
      `<span class="chip">${I.book}${esc(t('chip.analysis'))}</span>`;
    const box = document.getElementById('lessons');
    box.innerHTML = lessons.slice().reverse().map(l => {
      const best = store.get('uiux:best:' + l.n, null);
      return `<a class="lesson-card" href="dars-${l.n}/">
        <div class="top"><span class="lesson-num" aria-hidden="true">${l.n}</span>${l.new ? `<span class="chip chip-new">${esc(t('card.new'))}</span>` : ''}</div>
        <div><div class="caption">${esc(t('card.lesson', { n: l.n }))}</div><div class="title">${esc(tx(l.title))}</div></div>
        <div class="meta">${esc(t('card.meta', { t: C.total, m: C.minutes }))}</div>
        <div class="foot"><span>${esc(best != null ? t('card.best', { s: best, t: C.total }) : t('card.none'))}</span><span class="go">${esc(t('card.start'))}${I.right.replace('<svg', '<svg width="16" height="16"')}</span></div>
      </a>`;
    }).join('');
  }

  App.getJSON('lessons.json').then(d => { lessons = d.lessons; render(); }).catch(() => {
    document.getElementById('lessons').innerHTML = `<div class="empty">${esc(t('err.load'))}</div>`;
  });
  document.addEventListener('langchange', () => { if (lessons.length) render(); });
})();
