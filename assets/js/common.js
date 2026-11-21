/* Umumiy qism: sozlamalar, til, rejim, header/footer, toast, modal, ikonkalar */
(function () {
  const CONFIG = {
    // Google Apps Script Web App manzili (natijalar Google Sheets'ga yoziladi)
    scriptUrl: 'https://script.google.com/macros/s/AKfycbwdtZWtIhr8QmKJbSoqHFSMzYLVO-e6Ao9aIDjgw0oJHPRnDzhjdh3XIvnB9ZczD7sxJw/exec',
    total: 20, theory: 15, minutes: 27,
    langs: [['uz', 'UZ', 'Oʻzbekcha'], ['ru', 'RU', 'Русский'], ['en', 'EN', 'English'], ['ja', 'JA', '日本語']]
  };
  const BASE = document.documentElement.dataset.base || '';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* xotira yopiq bo'lsa ham sayt ishlaydi */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { } }
  };

  // ---- Til ----
  const LANGS = CONFIG.langs.map(l => l[0]);
  let lang = store.get('uiux:lang', null);
  if (!LANGS.includes(lang)) lang = 'uz'; // standart til — o'zbekcha
  function t(key, vars) {
    const dict = window.I18N[lang] || window.I18N.uz;
    let s = dict[key] != null ? dict[key] : (window.I18N.uz[key] != null ? window.I18N.uz[key] : key);
    if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }
  // Savollar banki matni: { uz, ru, en, ja } — tarjima bo'lmasa o'zbekchasi
  function tx(obj) { return obj ? (obj[lang] || obj.uz || '') : ''; }
  function hasTr(obj) { return !!(obj && obj[lang]); }
  function setLang(l) { if (!LANGS.includes(l)) return; lang = l; store.set('uiux:lang', l); applyStatic(); document.dispatchEvent(new CustomEvent('langchange')); }

  // ---- Rejim: standart — qorong'u ----
  function theme() { return document.documentElement.getAttribute('data-theme') || 'dark'; }
  function setTheme(th) { document.documentElement.setAttribute('data-theme', th); store.set('uiux:theme', th); updateThemeBtn(); }
  document.documentElement.setAttribute('data-theme', store.get('uiux:theme', 'dark'));

  // ---- Ikonkalar ----
  const I = {
    sun: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="3.6" stroke="currentColor" stroke-width="1.8"/><path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    moon: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16.5 12.3A7 7 0 0 1 7.7 3.5a7 7 0 1 0 8.8 8.8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    menu: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    close: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    globe: '<svg class="globe" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M2 9h14M9 2c2 2 2.8 4.4 2.8 7S11 14 9 16M9 2C7 4 6.2 6.4 6.2 9S7 14 9 16" stroke="currentColor" stroke-width="1.6"/></svg>',
    down: '<svg class="chev" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 5.5L7 9l3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clock: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M9 5.2V9l2.6 1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3.8 9.4l3.4 3.4 7-7.6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    right: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3.5 9h11M10 4.5L14.5 9 10 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    left: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M14.5 9h-11M8 4.5L3.5 9 8 13.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    grid: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="2.5" y="2.5" width="5" height="5" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="10.5" y="2.5" width="5" height="5" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="2.5" y="10.5" width="5" height="5" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="10.5" y="10.5" width="5" height="5" rx="1.4" stroke="currentColor" stroke-width="1.6"/></svg>',
    warn: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2.8l8 14H2l8-14z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 8.2v3.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="14.4" r="1.1" fill="currentColor"/></svg>',
    exit: '<svg viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M9 4H5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 5 18h4M14.5 15l4-4-4-4M18.5 11H8.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    book: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 3.5h4.5A2.5 2.5 0 0 1 10 6v9a2 2 0 0 0-2-2H3V3.5zM15 3.5h-4.5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15 3.5V13h-5" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    cloud: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M5 14h8a3 3 0 0 0 .4-6 4.5 4.5 0 0 0-8.7 1A2.5 2.5 0 0 0 5 14z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 11l1.5 1.5L11 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    wifi: '<svg viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M3 8.5a12 12 0 0 1 16 0M6 11.8a7.5 7.5 0 0 1 10 0M9 15a3 3 0 0 1 4 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 3l16 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    info: '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.6"/><path d="M9 8v4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="5.6" r="1" fill="currentColor"/></svg>'
  };

  // ---- Header / footer ----
  const page = document.body.dataset.page || '';
  function headerHTML() {
    const opts = CONFIG.langs.map(([c, s, n]) => `<option value="${c}"${c === lang ? ' selected' : ''} lang="${c}" title="${n}">${s}</option>`).join('');
    return `
<a class="skip-link" href="#main" data-t="skip"></a>
<div class="container">
  <a class="brand" href="${BASE}index.html" aria-label="Ibrakhimov Dev"><img src="${BASE}assets/img/mark.svg" alt="" width="28" height="28"><span><b>Ibrakhimov</b> Dev</span></a>
  <nav class="nav" aria-label="Asosiy">
    <a href="${BASE}index.html" data-t="nav.tests"${page === 'tests' ? ' aria-current="page"' : ''}></a>
    <a href="${BASE}docs.html" data-t="nav.docs"${page === 'docs' ? ' aria-current="page"' : ''}></a>
  </nav>
  <label class="lang-select"><span class="sr-only" data-t="lang"></span>${I.globe}<select id="lang-select">${opts}</select>${I.down}</label>
  <button class="icon-btn" id="theme-btn" type="button"></button>
  <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu">${I.menu}<span class="sr-only" data-t="menu"></span></button>
</div>
<div class="mobile-menu" id="mobile-menu" hidden>
  <a href="${BASE}index.html" data-t="nav.tests"${page === 'tests' ? ' aria-current="page"' : ''}></a>
  <a href="${BASE}docs.html" data-t="nav.docs"${page === 'docs' ? ' aria-current="page"' : ''}></a>
</div>`;
  }
  function updateThemeBtn() {
    const b = document.getElementById('theme-btn'); if (!b) return;
    const dark = theme() === 'dark';
    b.innerHTML = (dark ? I.sun : I.moon) + `<span class="sr-only">${t(dark ? 'theme.toLight' : 'theme.toDark')}</span>`;
    b.title = t(dark ? 'theme.toLight' : 'theme.toDark');
  }
  function applyStatic(root) {
    document.documentElement.lang = lang;
    (root || document).querySelectorAll('[data-t]').forEach(el => { el.textContent = t(el.dataset.t, el.dataset.tv ? JSON.parse(el.dataset.tv) : null); });
    updateThemeBtn();
    const sel = document.getElementById('lang-select'); if (sel) sel.value = lang;
  }
  function mountChrome() {
    const h = document.getElementById('site-header');
    if (h) {
      h.className = 'site-header'; h.innerHTML = headerHTML();
      document.getElementById('lang-select').addEventListener('change', e => setLang(e.target.value));
      document.getElementById('theme-btn').addEventListener('click', () => setTheme(theme() === 'dark' ? 'light' : 'dark'));
      const mb = document.getElementById('menu-btn'), mm = document.getElementById('mobile-menu');
      mb.addEventListener('click', () => { const open = mm.hidden; mm.hidden = !open; mb.setAttribute('aria-expanded', String(open)); mb.innerHTML = (open ? I.close : I.menu) + `<span class="sr-only">${t('menu')}</span>`; });
    }
    const f = document.getElementById('site-footer');
    if (f) { f.className = 'site-footer'; f.innerHTML = `<div class="container"><span data-t="footer.made"></span><span>© ${new Date().getFullYear()} <span data-t="footer.author"></span></span></div>`; }
    applyStatic();
  }

  // ---- Toast ----
  function toast(msg, icon) {
    let w = document.querySelector('.toast-wrap');
    if (!w) { w = document.createElement('div'); w.className = 'toast-wrap'; w.setAttribute('role', 'status'); w.setAttribute('aria-live', 'polite'); document.body.appendChild(w); }
    const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = (icon ? I[icon] : '') + `<span></span>`; el.querySelector('span').textContent = msg;
    w.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 260); }, 4000); // barcha xabarlar 4 soniyada yo'qoladi
  }

  // ---- Modal (fokus ichida qoladi, Esc yopadi) ----
  function modal({ icon, iconKind = 'brand', title, body, actions, dismissible = true, onClose }) {
    const prev = document.activeElement;
    const wrap = document.createElement('div'); wrap.className = 'modal';
    wrap.innerHTML = `<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="m-title"><div class="grabber"></div>
      ${icon ? `<div class="modal-icon ${iconKind}">${I[icon]}</div>` : ''}<h2 class="h2" id="m-title"></h2><div class="m-body"></div><div class="actions"></div></div>`;
    wrap.querySelector('#m-title').textContent = title;
    const b = wrap.querySelector('.m-body'); if (typeof body === 'string') { const p = document.createElement('p'); p.textContent = body; b.appendChild(p); } else if (body) b.appendChild(body);
    const close = (v) => { wrap.remove(); document.removeEventListener('keydown', onKey, true); if (prev && prev.focus) prev.focus(); if (onClose) onClose(v); };
    (actions || []).forEach(a => {
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn ' + (a.kind || 'btn-secondary');
      btn.innerHTML = a.icon ? I[a.icon] : ''; btn.appendChild(document.createTextNode(a.label));
      btn.addEventListener('click', () => { close(a.value); if (a.onClick) a.onClick(); });
      wrap.querySelector('.actions').appendChild(btn);
    });
    function onKey(e) {
      if (e.key === 'Escape' && dismissible) { e.preventDefault(); close(null); }
      if (e.key === 'Tab') {
        const f = [...wrap.querySelectorAll('button, [href], input, select')].filter(x => !x.disabled);
        if (!f.length) return; const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    if (dismissible) wrap.addEventListener('click', e => { if (e.target === wrap) close(null); });
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(wrap);
    const primary = wrap.querySelector('.actions .btn-primary') || wrap.querySelector('.actions .btn');
    if (primary) primary.focus();
    return { close, el: wrap };
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); }
  async function getJSON(url) { const r = await fetch(url, { cache: 'no-cache' }); if (!r.ok) throw new Error(r.status); return r.json(); }

  window.App = { CONFIG, BASE, store, t, tx, hasTr, get lang() { return lang; }, setLang, I, toast, modal, esc, mmss, getJSON, applyStatic };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountChrome); else mountChrome();
})();
