/* Test dvigateli — barcha darslar uchun bitta. Dars raqami <body data-lesson="N">, savollar dars-N/savollar.json */
(function () {
  const { t, tx, hasTr, CONFIG: C, store, I, esc, mmss, modal, toast } = App;
  const N = Number(document.body.dataset.lesson);
  const KEY = 'uiux:run:' + N;
  const OUTBOX = 'uiux:outbox';
  const root = document.getElementById('app');
  let data = null, byId = {}, run = null, tick = null, retryTimer = null, hiddenAt = null, view = 'entry', reviewFilter = 'all';

  // ---------- yordamchilar ----------
  const now = () => Date.now();
  const save = () => store.set(KEY, run);
  const total = () => data.questions.length;
  const nTheory = () => data.questions.filter(q => q.type === 'theory').length;
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function uid() { const a = new Uint8Array(6); (crypto || window.msCrypto).getRandomValues(a); return N + '-' + Date.now().toString(36) + '-' + [...a].map(x => x.toString(16).padStart(2, '0')).join(''); }
  const left = () => Math.max(0, (run.endsAt - now()) / 1000);
  const answeredCount = () => Object.keys(run.answers).length;
  const crumbs = (...items) => `<nav class="breadcrumb" aria-label="breadcrumb"><a href="../index.html">${esc(t('nav.tests'))}</a>${items.map(x => `<span aria-hidden="true">›</span>${x}`).join('')}</nav>`;
  const lessonLabel = () => esc(t('card.lesson', { n: N }));

  // ---------- kirish ----------
  function renderEntry() {
    view = 'entry'; stopTick();
    const st = store.get('uiux:student', {});
    root.innerHTML = `<div class="container section">${crumbs(`<span>${lessonLabel()}</span>`)}
      <div class="entry card pad">
        <span class="chip chip-brand">${esc(t('card.lesson', { n: N }))}</span>
        <h1 class="h1" style="margin-top:12px">${esc(tx(data.title))}</h1>
        <p class="muted" style="margin-top:8px">${esc(t('entry.lead'))}</p>
        <div class="facts" aria-hidden="true">
          <div class="fact"><b>${total()}</b><span>${esc(t('fact.q'))}</span></div>
          <div class="fact"><b>${C.minutes}</b><span>${esc(t('fact.m'))}</span></div>
          <div class="fact"><b>100%</b><span>${esc(t('fact.a'))}</span></div>
        </div>
        <form id="entry-form" novalidate>
          ${field('ism', 'entry.name', st.ism, 'given-name')}
          ${field('familiya', 'entry.surname', st.familiya, 'family-name')}
          ${field('sid', 'entry.id', st.sid, 'off', t('entry.idHint'))}
          <button class="btn btn-primary btn-block" style="margin-top:24px" type="submit" id="go" disabled>${esc(t('entry.continue'))}${I.right}</button>
        </form>
      </div></div>`;
    const form = document.getElementById('entry-form'), go = document.getElementById('go');
    const val = () => {
      const v = Object.fromEntries(['ism', 'familiya', 'sid'].map(k => [k, form.elements[k].value.trim()]));
      const ok = v.ism.length >= 2 && v.familiya.length >= 2 && /^[A-Za-z0-9]{3,20}$/.test(v.sid);
      go.disabled = !ok; return { ok, v };
    };
    form.addEventListener('input', val);
    form.addEventListener('focusout', e => {
      const f = e.target.closest('.field'); if (!f) return;
      const inp = f.querySelector('input'), hint = f.querySelector('.hint'), v = inp.value.trim();
      let err = '';
      if (!v) err = t('entry.required');
      else if (inp.name === 'sid' && !/^[A-Za-z0-9]{3,20}$/.test(v)) err = t('entry.idBad');
      else if (v.length < 2) err = t('entry.required');
      f.classList.toggle('invalid', !!err); inp.setAttribute('aria-invalid', String(!!err));
      hint.textContent = err || (inp.name === 'sid' ? t('entry.idHint') : '');
    });
    form.addEventListener('submit', e => {
      e.preventDefault(); const { ok, v } = val(); if (!ok) return;
      v.sid = v.sid.toUpperCase(); store.set('uiux:student', v); confirmStart(v);
    });
    val();
  }
  function field(name, label, value, ac, hint) {
    return `<div class="field"><label for="f-${name}">${esc(t(label))}</label>
      <input id="f-${name}" name="${name}" value="${esc(value || '')}" autocomplete="${ac}" ${name === 'sid' ? 'autocapitalize="characters" spellcheck="false" maxlength="20"' : 'maxlength="40"'} required aria-describedby="h-${name}">
      <span class="hint" id="h-${name}">${esc(hint || '')}</span></div>`;
  }
  function confirmStart(student) {
    const ul = document.createElement('ul'); ul.className = 'rules';
    const vars = { t: total(), th: nTheory(), pr: total() - nTheory(), m: C.minutes };
    [['grid', 'confirm.r1'], ['clock', 'confirm.r2'], ['cloud', 'confirm.r3'], ['exit', 'confirm.r4'], ['warn', 'confirm.r5']].forEach(([ic, k]) => {
      const li = document.createElement('li'); li.innerHTML = I[ic]; const s = document.createElement('span'); s.textContent = t(k, vars); li.appendChild(s); ul.appendChild(li);
    });
    modal({ icon: 'clock', title: t('confirm.title'), body: ul, actions: [
      { label: t('cancel'), kind: 'btn-secondary' },
      { label: t('start'), kind: 'btn-primary', icon: 'right', onClick: () => start(student) }
    ] });
  }

  // ---------- boshlash ----------
  function start(student) {
    const th = data.questions.filter(q => q.type === 'theory').map(q => q.id);
    const pr = data.questions.filter(q => q.type !== 'theory').map(q => q.id);
    const optOrder = {}; data.questions.forEach(q => { optOrder[q.id] = shuffle(q.options.map(o => o.key)); });
    const s = now();
    run = { id: uid(), lesson: N, student, lang: App.lang, order: shuffle(th).concat(shuffle(pr)), optOrder,
      answers: {}, cur: 0, startedAt: s, endsAt: s + C.minutes * 60000, exits: 0, warned5: false, warned1: false, status: 'running' };
    save(); renderTest();
  }

  // ---------- test ekrani ----------
  function renderTest() {
    view = 'test';
    const needTr = App.lang !== 'uz' && !hasTr(data.questions[0].q);
    root.innerHTML = `<div class="container section" style="padding-top:20px">
      ${crumbs(`<span>${lessonLabel()} · ${esc(tx(data.title))}</span>`)}
      ${needTr ? `<div class="notice" style="margin:0 0 16px">${I.info}<span>${esc(t('tr.note'))}</span></div>` : ''}
      <div class="test-layout">
        <div>
          <div class="mobile-top"><div><span class="lesson">${lessonLabel()} · ${esc(tx(data.title))}</span><span class="qnum" id="m-qnum"></span></div><span class="timer sm" id="m-timer" role="timer" aria-label="${esc(t('timer.left'))}">${I.clock}<span></span></span></div>
          <article class="card qcard" id="qcard" aria-live="polite"></article>
        </div>
        <aside class="side" aria-label="${esc(t('map.title'))}">
          <div class="card timer-card"><div class="caption" style="margin-bottom:8px">${esc(t('timer.left'))}</div>
            <div class="timer" id="d-timer" role="timer">${I.clock}<span></span></div>
            <div class="caption" style="margin-top:10px">${esc(t('timer.note', { m: C.minutes }))}</div></div>
          <div class="card pad"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h2 class="h3">${esc(t('map.title'))}</h2><span class="caption" id="d-count"></span></div>
            <div class="qmap" id="d-map"></div>${legend()}</div>
          <button class="btn btn-secondary btn-block" id="d-finish" type="button">${esc(t('q.finish'))}</button>
          <div class="card kbd-hint" style="padding:12px 16px"><kbd>←</kbd><kbd>→</kbd> ${esc(t('kbd.hint', { k: '1–4' }))}</div>
        </aside>
      </div></div>
      <div class="bottom-bar">
        <button class="btn btn-secondary" id="b-prev" type="button">${I.left}<span>${esc(t('q.prev'))}</span></button>
        <button class="btn btn-secondary" id="b-map" type="button" aria-label="${esc(t('map.open'))}">${I.grid}<span id="b-count"></span></button>
        <button class="btn btn-primary" id="b-next" type="button"><span></span>${I.right}</button>
      </div>`;
    document.getElementById('b-prev').addEventListener('click', () => go(run.cur - 1));
    document.getElementById('b-next').addEventListener('click', () => run.cur === total() - 1 ? finishFlow() : go(run.cur + 1));
    document.getElementById('b-map').addEventListener('click', openMap);
    document.getElementById('d-finish').addEventListener('click', finishFlow);
    renderQuestion(); startTick();
  }
  function legend() {
    return `<div class="legend"><span><i class="done"></i>${esc(t('map.done'))}</span><span><i></i>${esc(t('map.empty'))}</span><span><i class="cur"></i>${esc(t('map.cur'))}</span></div>`;
  }
  function renderQuestion(focusOpt) {
    const qid = run.order[run.cur], q = byId[qid], n = run.cur + 1, T = total();
    const chosen = run.answers[qid];
    const prog = run.order.map((id, i) => `<i class="${i === run.cur ? 'cur' : (run.answers[id] ? 'done' : '')}"></i>`).join('');
    const opts = run.optOrder[qid].map((key, i) => {
      const o = q.options.find(x => x.key === key);
      return `<button type="button" class="option" role="radio" aria-checked="${chosen === key}" data-key="${key}" tabindex="${(chosen ? chosen === key : i === 0) ? 0 : -1}">
        <span class="key" aria-hidden="true">${'ABCD'[i]}</span><span class="txt">${esc(tx(o.text))}</span><span class="saved">${I.check.replace('<svg', '<svg width="14" height="14"')}${esc(t('q.saved'))}</span></button>`;
    }).join('');
    document.getElementById('qcard').innerHTML = `
      <div class="qhead"><span class="qnum">${esc(t('q.num', { n, t: T }))}</span>
        <span class="chip ${q.type === 'theory' ? 'chip-brand' : 'chip-warning'}">${esc(t(q.type === 'theory' ? 'q.theory' : 'q.practice'))}</span></div>
      <div class="progress" aria-hidden="true">${prog}</div>
      <h1 class="qtext" id="qtext">${esc(tx(q.q))}</h1>
      <p class="qhelp">${esc(t('q.help'))}<span class="desktop-only"> · 1–4</span></p>
      <div class="options" role="radiogroup" aria-labelledby="qtext">${opts}</div>
      <div class="qnav desktop-nav">
        <button class="btn btn-secondary" type="button" id="q-prev" ${run.cur === 0 ? 'disabled' : ''}>${I.left}${esc(t('q.prev'))}</button>
        <span class="autosave">${I.cloud.replace('<svg', '<svg width="16" height="16"')}${esc(t('q.autosave'))}</span>
        <button class="btn btn-primary" type="button" id="q-next">${esc(run.cur === T - 1 ? t('q.finish') : t('q.next'))}${I.right}</button>
      </div>`;
    const card = document.getElementById('qcard');
    card.querySelectorAll('.option').forEach(b => {
      b.addEventListener('click', () => choose(b.dataset.key));
      b.addEventListener('keydown', e => {
        if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return; e.preventDefault();
        const all = [...card.querySelectorAll('.option')], i = all.indexOf(b), nx = all[(i + (e.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length];
        nx.focus();
      });
    });
    card.querySelector('#q-prev').addEventListener('click', () => go(run.cur - 1));
    card.querySelector('#q-next').addEventListener('click', () => run.cur === T - 1 ? finishFlow() : go(run.cur + 1));
    document.getElementById('m-qnum').textContent = t('q.num', { n, t: T });
    const bp = document.getElementById('b-prev'); bp.disabled = run.cur === 0;
    document.querySelector('#b-next span').textContent = run.cur === T - 1 ? t('q.finish') : t('q.next');
    document.getElementById('b-count').textContent = n + '/' + T;
    renderMap(document.getElementById('d-map'), false);
    document.getElementById('d-count').textContent = answeredCount() + ' / ' + T;
    if (focusOpt) { const f = card.querySelector(`.option[data-key="${focusOpt}"]`); if (f) f.focus(); }
  }
  function renderMap(box, inModal) {
    const T = total(), th = nTheory();
    let html = '';
    run.order.forEach((id, i) => {
      if (i === 0) html += `<div class="sep">${esc(t('map.theory', { th }))}</div>`;
      if (i === th) html += `<div class="sep">${esc(t('map.practice', { a: th + 1, t: T }))}</div>`;
      const st = i === run.cur ? 'cur' : (run.answers[id] ? 'done' : '');
      const lab = `${t('q.num', { n: i + 1, t: T })} · ${t(run.answers[id] ? 'map.done' : 'map.empty')}`;
      html += `<button type="button" class="${st}" data-i="${i}" aria-label="${esc(lab)}"${i === run.cur ? ' aria-current="step"' : ''}>${i + 1}</button>`;
    });
    box.innerHTML = html;
    box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { go(Number(b.dataset.i)); if (inModal && inModal.close) inModal.close(); }));
  }
  function openMap() {
    const wrap = document.createElement('div');
    const p = document.createElement('p'); p.className = 'small';
    p.textContent = t('map.answered', { a: answeredCount(), t: total() }) + unansweredLabel();
    const grid = document.createElement('div'); grid.className = 'qmap'; grid.style.marginTop = '16px';
    wrap.appendChild(p); wrap.appendChild(grid); wrap.insertAdjacentHTML('beforeend', legend());
    const m = modal({ title: t('map.title'), body: wrap, actions: [{ label: t('q.finish'), kind: 'btn-secondary', onClick: finishFlow }, { label: t('close'), kind: 'btn-primary' }] });
    renderMap(grid, m);
  }
  function unansweredList() { return run.order.map((id, i) => run.answers[id] ? null : i + 1).filter(Boolean); }
  function unansweredLabel() { const u = unansweredList(); return u.length ? ` · ${t('map.empty')}: ${u.join(', ')}` : ''; }
  function go(i) { if (i < 0 || i >= total()) return; run.cur = i; save(); renderQuestion(); window.scrollTo({ top: 0, behavior: 'smooth' }); const h = document.getElementById('qtext'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } }
  function choose(key) {
    if (!run || run.status !== 'running') return;
    run.answers[run.order[run.cur]] = key; save(); renderQuestion(key);
  }

  // ---------- taymer ----------
  function startTick() { stopTick(); tick = setInterval(onTick, 250); onTick(); }
  function stopTick() { if (tick) clearInterval(tick); tick = null; }
  function onTick() {
    if (!run || run.status !== 'running') return stopTick();
    const s = left(), str = mmss(s);
    const cls = s <= 60 ? 'crit' : (s <= 300 ? 'warn' : '');
    ['m-timer', 'd-timer'].forEach(id => { const el = document.getElementById(id); if (!el) return; el.querySelector('span').textContent = str; el.classList.toggle('warn', cls === 'warn'); el.classList.toggle('crit', cls === 'crit'); });
    if (s <= 300 && !run.warned5) { run.warned5 = true; save(); toast(t('toast.5'), 'clock'); }
    if (s <= 60 && !run.warned1) { run.warned1 = true; save(); toast(t('toast.1'), 'warn'); }
    if (s <= 0) { finalize('timeout'); toast(t('toast.timeup'), 'clock'); }
  }

  // ---------- yakunlash ----------
  function finishFlow() {
    if (!run || run.status !== 'running') return;
    const u = unansweredList();
    if (u.length) {
      modal({ icon: 'warn', iconKind: 'warn', title: t('un.title', { k: u.length }), body: t('un.text', { time: mmss(left()) }) + ' (' + u.join(', ') + ')', actions: [
        { label: t('un.finish'), kind: 'btn-secondary', onClick: () => finalize('finish') },
        { label: t('un.back'), kind: 'btn-primary', onClick: () => go(u[0] - 1) }
      ] });
    } else {
      modal({ icon: 'check', title: t('fin.title'), body: t('fin.text'), actions: [
        { label: t('cancel'), kind: 'btn-secondary' },
        { label: t('fin.ok'), kind: 'btn-primary', onClick: () => finalize('finish') }
      ] });
    }
  }
  function finalize(reason, beacon) {
    if (!run || run.status !== 'running') return;
    stopTick();
    const end = Math.min(now(), run.endsAt);
    const answers = data.questions.map(q => { const c = run.answers[q.id] || null; return { q: q.id, chosen: c, correct: c === q.answer }; });
    const score = answers.filter(a => a.correct).length;
    Object.assign(run, { status: 'done', endReason: reason, finishedAt: end, score, sent: false, dismissed: false });
    const payload = { lesson: N, ism: run.student.ism, familiya: run.student.familiya, sid: run.student.sid,
      answers, score, total: total(), durationSec: Math.round((end - run.startedAt) / 1000), endReason: reason,
      exits: run.exits, lang: run.lang, attemptId: run.id };
    save();
    const ob = store.get(OUTBOX, []).filter(p => p.attemptId !== run.id); ob.push(payload); store.set(OUTBOX, ob);
    const best = store.get('uiux:best:' + N, null); if (best == null || score > best) store.set('uiux:best:' + N, score);
    document.querySelectorAll('.modal').forEach(m => m.remove());
    if (beacon) {
      // sahifa yopilmoqda: so'rovni brauzer o'zi yetkazadi; javob kelmasa keyingi ochilishda qayta yuboriladi (server takrorni yozmaydi)
      try { navigator.sendBeacon(C.scriptUrl, new Blob([JSON.stringify(payload)], { type: 'text/plain;charset=utf-8' })); } catch (e) { }
      return;
    }
    renderResult(); flush();
  }

  // ---------- yuborish (navbat) ----------
  let flushing = false;
  async function flush() {
    if (flushing) return; flushing = true;
    let ob = store.get(OUTBOX, []);
    for (const p of ob.slice()) {
      try {
        const r = await fetch(C.scriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(p) });
        const j = await r.json();
        if (!j.ok) throw new Error(j.error || 'server');
        ob = store.get(OUTBOX, []).filter(x => x.attemptId !== p.attemptId); store.set(OUTBOX, ob);
        if (run && run.id === p.attemptId) { run.sent = true; run.sentAt = Date.now(); if (j.attempt) run.attempt = j.attempt; save(); }
      } catch (e) { if (run && run.id === p.attemptId) { run.sendFailed = true; save(); } }
    }
    flushing = false; updateStatus();
    if (store.get(OUTBOX, []).length && !retryTimer) retryTimer = setTimeout(() => { retryTimer = null; flush(); }, 15000);
  }
  window.addEventListener('online', flush);

  // ---------- natija ----------
  function counts() {
    let ok = 0, bad = 0, skip = 0;
    data.questions.forEach(q => { const c = run.answers[q.id]; if (!c) skip++; else if (c === q.answer) ok++; else bad++; });
    return { ok, bad, skip };
  }
  function renderResult() {
    view = 'result'; stopTick();
    const T = total(), c = counts(), pct = Math.round(c.ok / T * 100);
    const msg = t(pct >= 85 ? 'res.m85' : pct >= 70 ? 'res.m70' : pct >= 50 ? 'res.m50' : 'res.m0');
    const spent = mmss((run.finishedAt - run.startedAt) / 1000);
    root.innerHTML = `<div class="container section">${crumbs(`<a href="#" id="cr-lesson">${lessonLabel()}</a>`, `<span>${esc(t('res.crumb'))}</span>`)}
      <div class="result">
        <div class="score-card"><div class="who">${esc(run.student.ism + ' ' + run.student.familiya)} · ${esc(run.student.sid)}</div>
          <div class="score">${c.ok} / ${T}</div><div class="pct">${esc(t('res.pct', { p: pct, msg }))}</div>
          <div class="bar"><i style="width:${pct}%"></i></div></div>
        <div class="counts">
          <div class="card count ok"><b>${c.ok}</b><span>${esc(t('res.ok'))}</span></div>
          <div class="card count bad"><b>${c.bad}</b><span>${esc(t('res.bad'))}</span></div>
          <div class="card count skip"><b>${c.skip}</b><span>${esc(t('res.skip'))}</span></div>
        </div>
        <div class="chips-row">
          <span class="chip">${I.clock}${esc(t('res.spent', { t: spent }))}</span>
          <span class="chip ${run.exits ? 'chip-warning' : ''}">${I.exit}${esc(t('res.exits', { n: run.exits }))}</span>
          ${run.attempt ? `<span class="chip">${esc(t('res.attempt', { n: run.attempt }))}</span>` : ''}
          ${run.endReason === 'timeout' ? `<span class="chip chip-error">${esc(t('res.timeout'))}</span>` : ''}
          ${run.endReason === 'left' ? `<span class="chip chip-error">${esc(t('res.left'))}</span>` : ''}
        </div>
        <div id="send-status" role="status" aria-live="polite"></div>
        <button class="btn btn-primary btn-block" id="r-review" type="button">${esc(t('res.review'))}${I.right}</button>
        <button class="btn btn-secondary btn-block" id="r-again" type="button">${esc(t('res.again'))}</button>
        <a class="btn btn-text" href="../index.html" id="r-all">${esc(t('res.all'))}</a>
      </div></div>`;
    document.getElementById('r-review').addEventListener('click', () => { reviewFilter = 'all'; renderReview(); });
    document.getElementById('r-again').addEventListener('click', again);
    document.getElementById('cr-lesson').addEventListener('click', e => { e.preventDefault(); again(); });
    document.getElementById('r-all').addEventListener('click', () => { run.dismissed = true; save(); });
    updateStatus();
  }
  function again() { run.dismissed = true; save(); renderEntry(); window.scrollTo(0, 0); }
  function updateStatus() {
    const box = document.getElementById('send-status'); if (!box || !run) return;
    const pending = store.get(OUTBOX, []).some(p => p.attemptId === run.id);
    if (run.sent || !pending) {
      const tm = new Date(run.sentAt || run.finishedAt); const hh = String(tm.getHours()).padStart(2, '0') + ':' + String(tm.getMinutes()).padStart(2, '0');
      box.innerHTML = `<div class="status ok">${I.check}<span>${esc(t('send.ok', { time: hh }))}</span></div>`;
      const chips = document.querySelector('.chips-row');
      if (run.attempt && chips && !chips.querySelector('.att')) chips.insertAdjacentHTML('beforeend', `<span class="chip att">${esc(t('res.attempt', { n: run.attempt }))}</span>`);
    } else if (run.sendFailed && !flushing) {
      box.innerHTML = `<div class="status fail">${I.wifi}<span style="flex:1">${esc(t('send.fail'))}</span><button class="btn btn-secondary" type="button" id="resend" style="min-height:36px">${esc(t('send.retry'))}</button></div>`;
      document.getElementById('resend').addEventListener('click', () => { run.sendFailed = false; updateStatus(); flush(); });
    } else {
      box.innerHTML = `<div class="status wait"><span class="spinner"></span><span>${esc(t('send.wait'))}</span></div>`;
    }
  }

  // ---------- tahlil ----------
  function renderReview() {
    view = 'review';
    const c = counts(), T = total();
    const state = q => { const ch = run.answers[q.id]; return !ch ? 'skip' : ch === q.answer ? 'ok' : 'bad'; };
    const list = data.questions.filter(q => reviewFilter === 'all' || state(q) === reviewFilter);
    const fb = (k, label) => `<button type="button" class="filter" data-f="${k}" aria-pressed="${reviewFilter === k}">${esc(label)}</button>`;
    root.innerHTML = `<div class="container section">${crumbs(`<a href="#" id="cr-res">${esc(t('res.crumb'))}</a>`, `<span>${esc(t('rev.title'))}</span>`)}
      <h1 class="h1">${esc(t('rev.title'))} · ${lessonLabel()}</h1><p class="muted" style="margin-top:8px">${esc(t('rev.lead'))}</p>
      <div class="filters" role="group">${fb('all', t('rev.all', { n: T }))}${fb('bad', t('rev.bad', { n: c.bad }))}${fb('skip', t('rev.skip', { n: c.skip }))}${fb('ok', t('rev.ok', { n: c.ok }))}</div>
      <div class="review-list">${list.length ? list.map(q => reviewCard(q, state(q))).join('') : `<div class="card empty">${esc(t('rev.empty'))}</div>`}</div>
      <div style="margin-top:24px"><button class="btn btn-secondary" id="rv-back" type="button">${I.left}${esc(t('rev.back'))}</button></div></div>`;
    root.querySelectorAll('.filter').forEach(b => b.addEventListener('click', () => { reviewFilter = b.dataset.f; renderReview(); }));
    document.getElementById('rv-back').addEventListener('click', () => { renderResult(); window.scrollTo(0, 0); });
    document.getElementById('cr-res').addEventListener('click', e => { e.preventDefault(); renderResult(); });
  }
  function reviewCard(q, st) {
    const ch = run.answers[q.id];
    const stChip = st === 'ok' ? `<span class="chip chip-success">${I.check}${esc(t('res.ok'))}</span>` : st === 'bad' ? `<span class="chip chip-error">${I.x}${esc(t('res.bad'))}</span>` : `<span class="chip">${esc(t('res.skip'))}</span>`;
    // Variantlar asl tartibda (A–D): tahlildagi harflar shu tartibga mos
    const opts = q.options.map(o => {
      const isC = o.key === q.answer, isMine = o.key === ch;
      const cls = isC ? 'correct' : (isMine ? 'wrong' : '');
      const tag = isC ? `<span class="tag">${I.check.replace('<svg', '<svg width="14" height="14"')}${esc(isMine ? t('rev.yours') : t('rev.correct'))}</span>` : (isMine ? `<span class="tag">${I.x.replace('<svg', '<svg width="14" height="14"')}${esc(t('rev.yours'))}</span>` : '');
      return `<div class="ropt ${cls}"><span class="key">${o.key}</span><span class="txt">${esc(tx(o.text))}</span>${tag}</div>`;
    }).join('');
    return `<article class="card rcard"><div class="rhead"><span class="chip">${esc(t('rev.qn', { n: q.id }))}</span>
      <span class="chip ${q.type === 'theory' ? 'chip-brand' : 'chip-warning'}">${esc(t(q.type === 'theory' ? 'q.theory' : 'q.practice'))}</span>${stChip}
      ${!ch ? `<span class="caption">${esc(t('rev.none'))}</span>` : ''}</div>
      <h2 class="rq">${esc(tx(q.q))}</h2><div class="ropts">${opts}</div>
      <div class="explain"><div><b>${esc(t('rev.why'))}:</b> ${esc(tx(q.why))}</div><div><b>${esc(t('rev.others'))}:</b> ${esc(tx(q.others))}</div></div>
      <a class="doc-link" href="../docs.html#dars-${N}">${esc(t('rev.doc', { n: N }))}</a></article>`;
  }

  // ---------- hodisalar ----------
  document.addEventListener('keydown', e => {
    if (view !== 'test' || document.querySelector('.modal')) return;
    if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    const k = e.key.toUpperCase(), idx = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : 'ABCD'.indexOf(k);
    if (idx >= 0 && k.length === 1) { const key = run.optOrder[run.order[run.cur]][idx]; if (key) { e.preventDefault(); choose(key); } }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(run.cur + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(run.cur - 1); }
  });
  // Boshqa oyna/ilovaga o'tish: qaytganda hisoblanadi va ogohlantiriladi, test davom etadi
  document.addEventListener('visibilitychange', () => {
    if (!run || run.status !== 'running') return;
    if (document.visibilityState === 'hidden') { hiddenAt = now(); return; }
    if (hiddenAt) {
      hiddenAt = null; run.exits++; save();
      if (left() <= 0) return onTick();
      modal({ icon: 'exit', iconKind: 'warn', title: t('left.title'), body: t('left.text', { n: run.exits }), actions: [{ label: t('left.ok'), kind: 'btn-primary' }] });
    }
  });
  // Sahifa yopilsa — test yakunlanadi va natija yuboriladi
  window.addEventListener('pagehide', () => { if (run && run.status === 'running') finalize('left', true); });
  window.addEventListener('beforeunload', e => { if (run && run.status === 'running') { e.preventDefault(); e.returnValue = ''; } });
  document.addEventListener('langchange', () => {
    if (!data) return;
    if (view === 'entry') renderEntry(); else if (view === 'test') renderTest(); else if (view === 'result') renderResult(); else if (view === 'review') renderReview();
  });

  // ---------- yuklash ----------
  App.getJSON('savollar.json').then(d => {
    data = d; d.questions.forEach(q => { byId[q.id] = q; });
    document.title = t('card.lesson', { n: N }) + ' · ' + tx(d.title) + ' · Ibrakhimov Dev';
    run = store.get(KEY, null);
    if (run && run.status === 'running' && run.order && run.order.length === total()) {
      if (left() <= 0) { finalize('timeout'); } else renderTest();
    } else if (run && run.status === 'done' && !run.dismissed) { renderResult(); }
    else renderEntry();
    if (store.get(OUTBOX, []).length) flush();
  }).catch(() => { root.innerHTML = `<div class="container section"><div class="card empty">${esc(t('err.load'))}</div></div>`; });
})();
