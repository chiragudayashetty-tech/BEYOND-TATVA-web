/* ═══════════════════════════════════════════════════════════════
   BEYOND TATVA · site engine
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const C = window.BT_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const icon = (id, cls = 'i') => '<svg class="' + cls + '"><use href="#i-' + id + '"/></svg>';

  /* ── Persistent state ── */
  const KEY = 'bt_v3';
  let S = { lang: null, xp: 0, badges: [], seen: [], done: false, ans: {}, rec: [], sound: false };
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  let LANG = 'en';
  const T = () => BT.UI[LANG];
  const L = o => (o && (o[LANG] != null ? o[LANG] : o.en));

  /* ── Analytics ── */
  function track(name, params) { if (window.gtag) gtag('event', name, params || {}); }
  if (C.ga4) {
    const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.ga4; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag('js', new Date()); gtag('config', C.ga4);
  }

  /* ── Config wiring ── */
  const waDigits = (C.whatsapp || '').replace(/\D/g, '');
  const hasWa = waDigits.length >= 11;
  if (C.checkoutUrl) $$('[data-enroll]').forEach(a => { a.href = C.checkoutUrl; a.rel = 'noopener'; a.addEventListener('click', () => track('begin_checkout', { value: 799, currency: 'INR', lang: LANG })); });
  function setWa() {
    if (!hasWa) { $$('[data-wa], [data-wa-row]').forEach(el => el.hidden = true); return; }
    const href = 'https://wa.me/' + waDigits + '?text=' + encodeURIComponent(T().wa);
    $$('[data-wa]').forEach(a => { a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.hidden = false; });
  }
  if (C.email) { const e = $('#emailLink'); e.href = 'mailto:' + C.email; e.textContent = C.email; } else $$('[data-email-row]').forEach(el => el.hidden = true);
  $('#yr').textContent = new Date().getFullYear();
  function renderOffer() {
    if (Number.isInteger(C.seatsTaken) && C.seatsTotal > 0) {
      const left = Math.max(0, C.seatsTotal - C.seatsTaken);
      $('#seats').hidden = false;
      $('#seatsLeft').textContent = left > 0 ? T().seatsLeft(left, C.seatsTotal) : T().full;
      requestAnimationFrame(() => requestAnimationFrame(() => { $('#seatsBar').style.width = Math.min(100, C.seatsTaken / C.seatsTotal * 100) + '%'; }));
    }
    if (C.priceDeadline) {
      const end = new Date(C.priceDeadline);
      if (!isNaN(end) && end > new Date()) { const d = $('#deadline'); d.textContent = T().deadline(end.toLocaleDateString(LANG === 'kn' ? 'kn-IN' : 'en-IN', { day: 'numeric', month: 'long' })); d.hidden = false; }
    }
  }
  function share() {
    const url = location.origin + '/';
    const text = T().share + url;
    if (navigator.share) navigator.share({ title: 'Beyond Tatva', text: T().share, url }).catch(() => {});
    else window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
    track('share');
  }
  $('#shareBtn').addEventListener('click', share);

  /* ── Sound (off by default) + haptics ── */
  let AC = null;
  function tone(freq, start, dur, type = 'sine', vol = .1) {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, AC.currentTime + start);
    g.gain.linearRampToValueAtTime(vol, AC.currentTime + start + .01);
    g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + start + dur);
    o.connect(g).connect(AC.destination); o.start(AC.currentTime + start); o.stop(AC.currentTime + start + dur + .05);
  }
  function sfx(kind) {
    if (!S.sound) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === 'suspended') AC.resume();
      if (kind === 'tap') tone(660, 0, .08, 'sine', .06);
      if (kind === 'coin') { tone(988, 0, .09, 'triangle', .08); tone(1319, .07, .14, 'triangle', .08); }
      if (kind === 'badge') [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * .07, .25, 'sine', .07));
      if (kind === 'unlock') [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, i * .08, .45, 'triangle', .07));
    } catch (e) {}
  }
  const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };
  const soundBtn = $('#soundBtn');
  function syncSound() { soundBtn.setAttribute('aria-pressed', String(!!S.sound)); $('use', soundBtn).setAttribute('href', S.sound ? '#i-sound' : '#i-mute'); }
  soundBtn.addEventListener('click', () => { S.sound = !S.sound; save(); syncSound(); sfx('badge'); });
  syncSound();

  /* ── Confetti ── */
  const cv = $('#confetti'), cx = cv.getContext('2d');
  let parts = [], raf = 0;
  const COLORS = ['#3B5BFF', '#C6F432', '#FF4FA3', '#FFC93C', '#1FBF9F', '#8B6CFF', '#FF8A3D'];
  function sizeCv() { const d = Math.min(2, devicePixelRatio || 1); cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d, 0, 0, d, 0, 0); }
  sizeCv(); addEventListener('resize', sizeCv);
  function burst(x, y, n = 80, spread = 1) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = (2 + Math.random() * 7) * spread;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, r: Math.random() * 6.28, vr: (Math.random() - .5) * .3, s: 5 + Math.random() * 6, c: COLORS[i % COLORS.length], round: Math.random() < .3, life: 1 });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 40);
    for (const p of parts) {
      p.vy += .22; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= .006;
      cx.save(); cx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6)); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c;
      if (p.round) { cx.beginPath(); cx.arc(0, 0, p.s / 2, 0, 6.28); cx.fill(); } else cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      cx.restore();
    }
    raf = parts.length ? requestAnimationFrame(tick) : 0;
  }
  const centerOf = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  /* ── XP, coins, badges, toasts ── */
  const xpBtn = $('#xpBtn'), xpNum = $('#xpNum');
  let shownXP = S.xp; xpNum.textContent = shownXP;
  function countTo(target) {
    const from = shownXP, t0 = performance.now(), dur = 600;
    const step = now => { const k = Math.min(1, (now - t0) / dur); shownXP = Math.round(from + (target - from) * k); xpNum.textContent = shownXP; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
    xpBtn.classList.remove('bump'); void xpBtn.offsetWidth; xpBtn.classList.add('bump');
  }
  function addXP(n, fromEl) {
    S.xp += n; save();
    const [x, y] = fromEl ? centerOf(fromEl) : [innerWidth / 2, innerHeight / 2];
    if (reduced || !fromEl) { countTo(S.xp); return; }
    const plus = document.createElement('div'); plus.className = 'plus'; plus.textContent = '+' + n + ' XP';
    plus.style.left = x + 'px'; plus.style.top = y + 'px'; document.body.appendChild(plus);
    plus.animate([{ transform: 'translate(-50%, 0)', opacity: 1 }, { transform: 'translate(-50%, -46px)', opacity: 0 }], { duration: 900, easing: 'ease-out' }).onfinish = () => plus.remove();
    const [tx, ty] = centerOf(xpBtn);
    const coin = document.createElement('div'); coin.className = 'coin'; coin.textContent = '✦';
    coin.style.left = x + 'px'; coin.style.top = y + 'px'; document.body.appendChild(coin);
    const dx = tx - x, dy = ty - y;
    coin.animate([
      { transform: 'translate(0,0) scale(.4)', opacity: 0 },
      { transform: 'translate(' + dx * .35 + 'px,' + (dy * .35 - 90) + 'px) scale(1.25)', opacity: 1, offset: .35 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.5)', opacity: .6 }
    ], { duration: 850, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => { coin.remove(); countTo(S.xp); sfx('coin'); };
  }
  function toast(em, title, sub) {
    const t = document.createElement('div'); t.className = 'toast';
    t.innerHTML = '<span class="bd">' + em + '</span><div><b>' + title + '</b><small>' + sub + '</small></div>';
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3400);
  }
  function award(id, fromEl, big) {
    if (S.badges.includes(id)) return;
    const b = BT.BADGES.find(x => x.id === id); if (!b) return;
    S.badges.push(id); save();
    toast(b.em, T().badge + ' · ' + esc(L(b)[0]), '+' + b.xp + ' XP');
    addXP(b.xp, fromEl);
    sfx('badge'); buzz(25);
    if (big || b.xp >= 40) burst(...(fromEl ? centerOf(fromEl) : [innerWidth / 2, innerHeight / 3]), 90);
    track('badge', { id });
  }
  const drawer = $('#drawer');
  function renderBadges() {
    $('#badges').innerHTML = BT.BADGES.map(b => '<div class="badge' + (S.badges.includes(b.id) ? ' got' : '') + '"><div class="bd">' + b.em + '</div><b>' + esc(L(b)[0]) + '</b><small>' + esc(L(b)[1]) + '</small><small>+' + b.xp + ' XP</small></div>').join('');
  }
  xpBtn.addEventListener('click', () => { renderBadges(); drawer.classList.add('open'); $('#drawerClose').focus(); });
  const closeDrawer = () => { drawer.classList.remove('open'); xpBtn.focus(); };
  $('#drawerClose').addEventListener('click', closeDrawer);
  drawer.addEventListener('click', e => { if (e.target === drawer) closeDrawer(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });

  /* ── Language ── */
  const EN = {}, EN_TITLE = document.title;
  $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (!(k in EN)) EN[k] = el.innerHTML; });
  function splitWords(el) {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(tok => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
            const w = document.createElement('span'); w.className = 'w';
            const inner = document.createElement('span'); inner.textContent = tok; inner.style.setProperty('--i', i++);
            w.appendChild(inner); frag.appendChild(w);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1) walk(ch);
      });
    };
    walk(el);
  }
  function applyLang(lang, persist) {
    LANG = lang === 'kn' ? 'kn' : 'en';
    document.documentElement.lang = LANG;
    $$('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n, v = (LANG === 'kn' && BT.KN[k] != null) ? BT.KN[k] : EN[k];
      if (v == null) return;
      el.innerHTML = v;
      if (el.classList.contains('split')) splitWords(el);
    });
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
    document.title = LANG === 'kn' ? BT.KN.__title : EN_TITLE;
    $('#sealText').textContent = T().seal;
    $('#sealText').setAttribute('textLength', '486');
    setWa(); renderOffer(); renderGift(); wheel.render(); renderPrompts(); demo.onLang(); chat.refresh();
    if (drawer.classList.contains('open')) renderBadges();
    if (persist) { S.lang = LANG; save(); }
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => { applyLang(b.dataset.lang, true); sfx('tap'); track('language', { lang: LANG }); }));

  /* ── Reveals ── */
  let io = null;
  function startReveals() {
    if (!('IntersectionObserver' in window)) { $$('.reveal, .split, .wheel').forEach(el => el.classList.add('in')); return; }
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal, .split, .wheel').forEach(el => io.observe(el));
  }

  /* ── Gift pill personalisation ── */
  function renderGift() {
    if (!S.done) return;
    const pill = $('.gift-pill');
    pill.innerHTML = '<span class="gi"><svg class="i"><use href="#i-gift"/></svg></span><span>' + T().unlocked0(S.ans.name ? esc(S.ans.name) : '') + '</span>';
    pill.style.cursor = 'pointer'; pill.setAttribute('role', 'link'); pill.tabIndex = 0;
    pill.onclick = () => { location.href = '/module-0.html'; };
    pill.onkeydown = e => { if (e.key === 'Enter') location.href = '/module-0.html'; };
  }

  /* ══════════════ Pancha Tatva wheel ══════════════ */
  const fx = {
    fire: c => '<div class="fx fx-fire">' + Array.from({ length: 16 }, () => '<i style="--x:' + (8 + Math.random() * 84) + '%;--s:' + (4 + Math.random() * 6) + 'px;--t:' + (2.4 + Math.random() * 2) + 's;--dl:' + (-Math.random() * 4) + 's;--dx:' + (Math.random() * 80 - 40) + 'px"></i>').join('') + '</div>',
    water: () => '<div class="fx fx-water">' + [0, -.9, -1.8, -2.7].map(d => '<i style="--dl:' + d + 's"></i>').join('') + '</div>',
    air: () => '<div class="fx fx-air"><svg viewBox="0 0 400 170" preserveAspectRatio="none"><path d="M-20 60 C 60 20, 120 100, 200 60 S 340 20, 420 60"/><path d="M-20 95 C 70 60, 140 130, 220 95 S 350 60, 420 95"/><path d="M-20 130 C 80 100, 150 160, 230 130 S 360 100, 420 130"/></svg></div>',
    earth: () => '<div class="fx fx-earth"><svg viewBox="0 0 400 170" preserveAspectRatio="none"><path d="M0 120 Q 100 40 200 110 T 400 90 V170 H0Z"/><path d="M0 140 Q 120 80 230 130 T 400 120 V170 H0Z"/><path d="M0 160 Q 140 120 260 150 T 400 150 V170 H0Z"/></svg></div>',
    space: () => '<div class="fx fx-space">' + Array.from({ length: 34 }, () => '<i style="--x:' + Math.random() * 100 + '%;--y:' + Math.random() * 100 + '%;--s:' + (1 + Math.random() * 2.4) + 'px;--t:' + (1.5 + Math.random() * 3) + 's;--dl:' + (-Math.random() * 3) + 's"></i>').join('') + '<i class="orb"></i></div>',
    bindu: () => '<div class="fx fx-bindu"><i></i>' + [0, -1, -2].map(d => '<i style="--dl:' + d + 's"></i>').join('') + '</div>'
  };
  const wheel = (() => {
    const el = $('#wheel'), panel = $('#tPanel');
    let active = 'bindu', userTouched = false, cycle = null;
    const byId = id => BT.TATVA.find(t => t.id === id);
    function nodes() {
      $$('.node', el).forEach(n => n.remove());
      BT.TATVA.forEach(t => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'node' + (t.id === 'bindu' ? ' center' : '') + (S.seen.includes(t.id) ? ' seen' : '');
        b.dataset.t = t.id; b.style.setProperty('--x', t.x + '%'); b.style.setProperty('--y', t.y + '%'); b.style.setProperty('--c', t.c);
        b.setAttribute('aria-pressed', String(t.id === active));
        b.setAttribute('aria-label', (t.id === 'bindu' ? 'Module 0' : 'Module ' + t.n) + ': ' + L(t.title));
        const rec = S.rec.includes(t.id);
        b.innerHTML = (t.id === 'bindu' ? '<span class="free">' + T().free + '</span>' : '') + icon(t.icon) + '<b lang="kn">' + t.kn + '</b><small>' + (LANG === 'kn' ? T().module + ' ' + t.n : t.el) + '</small><span class="seen">✓</span>' +
          (rec ? '<span class="rec">' + esc(S.ans.name && S.ans.who === 'parent' ? T().rec.replace('{name}', S.ans.name) : T().recAny) + '</span>' : '');
        b.addEventListener('click', () => { userTouched = true; stopCycle(); select(t.id, true); sfx('tap'); });
        el.appendChild(b);
      });
    }
    function renderPanel() {
      const t = byId(active);
      panel.style.setProperty('--c', t.c);
      const cta = t.id === 'bindu'
        ? (S.done ? '<a class="btn btn-gold btn-block" href="/module-0.html">' + T().open0 + '</a>' : '<a class="btn btn-gold btn-block" href="#chat">' + T().unlock0 + '</a>')
        : '';
      panel.innerHTML = '<div class="panel-art">' + fx[t.fx](t.c) + '<span class="mnum">' + T().module + ' ' + t.n + ' · ' + (LANG === 'kn' ? t.kn : t.el) + '</span><span class="kn-big" lang="kn">' + t.kn + '</span></div>' +
        '<div class="panel-body"><h3>' + esc(L(t.title)) + '</h3><p class="tagline">' + esc(L(t.tag)) + '</p>' +
        '<div class="chips">' + t.chips.map((c, i) => '<span class="chip" style="--i:' + i + '">' + icon(c[0]) + esc(LANG === 'kn' ? c[2] : c[1]) + '</span>').join('') + '</div>' +
        '<div class="makes">' + icon('award') + '<span><b>' + T().makes + ':</b> ' + esc(L(t.makes)) + '</span></div>' + cta + '</div>';
    }
    function select(id, byUser) {
      active = id;
      $$('.node', el).forEach(n => n.setAttribute('aria-pressed', String(n.dataset.t === id)));
      renderPanel();
      if (byUser && !S.seen.includes(id)) {
        S.seen.push(id); save();
        const n = $('.node[data-t="' + id + '"]', el); n && n.classList.add('seen');
        $('#tCount').textContent = S.seen.length;
        if (S.seen.length >= BT.TATVA.length) award('explorer', n, true);
      }
      if (byUser) track('tatva', { id });
    }
    function stopCycle() { clearInterval(cycle); cycle = null; }
    function startCycle() {
      if (reduced || userTouched || cycle) return;
      const order = ['earth', 'fire', 'water', 'air', 'space', 'bindu']; let i = 0;
      cycle = setInterval(() => { if (userTouched) return stopCycle(); select(order[i++ % order.length], false); }, 3200);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { e.isIntersecting ? startCycle() : stopCycle(); }, { threshold: .4 }).observe(el);
    $('#tCount').textContent = S.seen.length;
    return { render() { nodes(); renderPanel(); } };
  })();

  /* ══════════════ Prompts ══════════════ */
  function renderPrompts() {
    $('#promptList').innerHTML = BT.PROMPTS.map((p, i) => {
      const t = BT.TATVA.find(x => x.id === p.t), txt = LANG === 'kn' ? p.kn : p.en;
      return '<article class="card pc reveal in" style="--c:' + t.c + '"><div class="pc-top"><span class="pc-ic">' + icon(t.icon) + '</span><div><b lang="kn">' + t.kn + '</b><small>' + T().module + ' ' + t.n + '</small></div></div>' +
        '<p class="pc-text">' + esc(txt).replace(/\[([^\]]+)\]/g, '<mark>$1</mark>') + '</p><button class="copy" type="button" data-i="' + i + '">' + icon('copy') + '<span>' + T().copy + '</span></button></article>';
    }).join('');
    $$('#promptList .copy').forEach(b => b.addEventListener('click', async () => {
      const p = BT.PROMPTS[+b.dataset.i], txt = (LANG === 'kn' ? p.kn : p.en).replace(/\[([^\]]+)\]/g, '[$1]');
      try { await navigator.clipboard.writeText(txt); } catch (e) { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (_) {} ta.remove(); }
      b.classList.add('done'); $('span', b).textContent = T().copied; sfx('coin'); buzz(15);
      setTimeout(() => { b.classList.remove('done'); $('span', b).textContent = T().copy; }, 2200);
      award('prompt', b); track('copy_prompt', { t: p.t });
    }));
  }

  /* ══════════════ Live demo ══════════════ */
  const demo = (() => {
    let subj = 'science', tab = 'notes', state = 'idle', run = 0;
    const panel = $('#dPanel'), gen = $('#dGen'), promptEl = $('#dPrompt'), caret = $('#dCaret');
    const data = () => BT.DEMO[subj][LANG];
    const graphemes = s => (window.Intl && Intl.Segmenter) ? [...new Intl.Segmenter(LANG, { granularity: 'grapheme' }).segment(s)].map(x => x.segment) : Array.from(s);
    function setTabs() { $$('.tabs button').forEach(b => { b.setAttribute('aria-selected', String(b.dataset.tab === tab)); b.disabled = state !== 'done'; }); }
    function renderStatic() {
      $('#dChapter').textContent = data().chapter;
      $$('.subj').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.subj === subj)));
      gen.textContent = state === 'busy' ? T().thinking : state === 'done' ? T().regen : T().gen;
      gen.disabled = state === 'busy';
      if (state !== 'busy') promptEl.textContent = data().prompt;
      setTabs();
    }
    function renderPanel() {
      const d = data();
      if (state === 'idle') { panel.innerHTML = '<div class="empty"><div>' + icon('note') + '<br/>' + esc(T().empty) + '</div></div>'; return; }
      if (state === 'busy') { panel.innerHTML = '<div class="sk"></div><div class="sk"></div><div class="sk"></div><div class="sk"></div>'; return; }
      if (tab === 'notes') panel.innerHTML = '<ol class="nlist">' + d.notes.map((n, i) => '<li style="--dl:' + i * .12 + 's"><b>' + (i + 1) + '</b><span>' + esc(n) + '</span></li>').join('') + '</ol>';
      else if (tab === 'cards') {
        panel.innerHTML = '<div class="fcards">' + d.cards.map((c, i) => '<button type="button" class="fc" aria-pressed="false" style="--dl:' + i * .1 + 's"><span class="inner"><span class="face front"><small>Q</small>' + esc(c[0]) + '</span><span class="face back"><small>A</small>' + esc(c[1]) + '</span></span></button>').join('') + '</div><p class="hint">' + esc(T().flip) + '</p>';
        $$('.fc', panel).forEach(c => c.addEventListener('click', () => { c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true')); sfx('tap'); }));
      } else {
        const q = d.quiz;
        panel.innerHTML = '<p class="qq">' + esc(q.q) + '</p><div class="qopts">' + q.opts.map((o, i) => '<button type="button" class="qopt" data-i="' + i + '" style="--dl:' + i * .07 + 's">' + esc(o) + '</button>').join('') + '</div><p class="qfb" hidden></p>';
        $$('.qopt', panel).forEach(b => b.addEventListener('click', () => {
          const ok = +b.dataset.i === q.a;
          $$('.qopt', panel).forEach(x => { x.disabled = true; if (+x.dataset.i === q.a) x.classList.add('right'); });
          if (!ok) b.classList.add('wrong'); else { award('quiz', b); burst(...centerOf(b), 40); }
          const fb = $('.qfb', panel); fb.innerHTML = '<b class="' + (ok ? 'ok' : 'no') + '">' + esc(ok ? T().right : T().wrong) + '</b> ' + esc(q.why); fb.hidden = false;
          sfx(ok ? 'coin' : 'tap'); buzz(ok ? 20 : [10, 40, 10]);
        }));
      }
    }
    async function generate(byUser) {
      const my = ++run; state = 'busy'; tab = 'notes';
      renderStatic(); promptEl.textContent = ''; caret.hidden = false; renderPanel();
      const ch = graphemes(data().prompt);
      if (!reduced) { const st = Math.max(1, Math.round(ch.length / 60)); for (let i = 0; i < ch.length; i += st) { if (my !== run) return; promptEl.textContent = ch.slice(0, i + st).join(''); await wait(16); } await wait(650); }
      if (my !== run) return;
      caret.hidden = true; state = 'done'; renderStatic(); renderPanel();
      if (byUser) award('demo', gen);
    }
    gen.addEventListener('click', () => { generate(true); track('demo_generate', { subj }); });
    $$('.subj').forEach(b => b.addEventListener('click', () => { subj = b.dataset.subj; generate(true); sfx('tap'); }));
    $$('.tabs button').forEach(b => b.addEventListener('click', () => { if (state !== 'done') return; tab = b.dataset.tab; setTabs(); renderPanel(); sfx('tap'); }));
    if ('IntersectionObserver' in window) { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { if (state === 'idle') generate(false); o.disconnect(); } }, { threshold: .4 }); o.observe($('#nb')); }
    return { onLang() { if (state === 'busy') { run++; caret.hidden = true; state = 'done'; } renderStatic(); renderPanel(); } };
  })();

  /* ══════════════ Bindu chat ══════════════ */
  const chat = (() => {
    const body = $('#chatBody'), foot = $('#chatFoot'), bot = $('#bot'), cons = $('#const');
    const steps = BT.CHAT.steps, TOTAL = steps.length + 1;
    let ans = {}, cur = -1, started = false, busy = false;
    // constellation
    const pts = Array.from({ length: TOTAL }, (_, i) => [6 + i * (116 / (TOTAL - 1)), i % 2 ? 9 : 21]);
    cons.innerHTML = pts.slice(1).map((p, i) => '<line x1="' + pts[i][0] + '" y1="' + pts[i][1] + '" x2="' + p[0] + '" y2="' + p[1] + '"/>').join('') + pts.map(p => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6"/>').join('');
    function light(n) { $$('circle', cons).forEach((c, i) => c.classList.toggle('lit', i < n)); $$('line', cons).forEach((l, i) => l.classList.toggle('lit', i < n - 1)); }
    const scroll = () => { body.scrollTop = body.scrollHeight; };
    const fill = (s, extra) => s.replace(/\{n\}/g, '<b>' + esc(ans.name || T().yourChild) + '</b>').replace(/<b><b>/g, '<b>').replace(/<\/b><\/b>/g, '</b>').replace(/\{m\}/g, extra || '');
    async function say(html, extraDelay = 0) {
      const ty = document.createElement('div'); ty.className = 'typing'; ty.innerHTML = '<i></i><i></i><i></i>';
      body.appendChild(ty); scroll(); bot.classList.add('think');
      await wait(reduced ? 80 : Math.min(1200, 450 + html.length * 9) + extraDelay);
      ty.remove(); bot.classList.remove('think');
      const m = document.createElement('div'); m.className = 'msg bot-m'; m.innerHTML = html; body.appendChild(m); scroll();
      return m;
    }
    function me(text) { const m = document.createElement('div'); m.className = 'msg me'; m.textContent = text; body.appendChild(m); scroll(); return m; }
    function happy() { bot.classList.add('happy'); setTimeout(() => bot.classList.remove('happy'), 900); }
    function reward(el, i) { light(i); addXP(10, el); sfx('coin'); buzz(12); happy(); }
    function optsHTML(opts, multi) {
      return '<div class="opts" role="group">' + opts.map((o, i) => '<button class="opt" type="button" data-v="' + o.v + '" style="--i:' + i + '"' + (multi ? ' aria-pressed="false"' : '') + '><span class="em">' + o.em + '</span>' + esc(o.label || L(o)) + '</button>').join('') + '</div>';
    }
    function moduleName(tid) { const t = BT.TATVA.find(x => x.id === tid); return T().module + ' ' + t.n + ' · ' + L(t.title); }

    async function start() {
      if (started) return; started = true;
      if (S.done && S.ans && S.ans.who) { ans = S.ans; light(TOTAL); await say(L(BT.CHAT.end).back(ans.name ? esc(ans.name) : '')); showPlan(false); return; }
      light(0);
      await say(BT.CHAT.hello);
      await say(BT.CHAT.askLang);
      cur = -1; renderFoot();
    }
    function renderFoot() {
      if (cur === -1) {
        foot.innerHTML = optsHTML(BT.CHAT.langOpts);
        $$('.opt', foot).forEach(b => b.addEventListener('click', () => pickLang(b)));
        return;
      }
      const st = steps[cur]; if (!st) { foot.innerHTML = ''; return; }
      if (st.type === 'one') {
        foot.innerHTML = optsHTML(st.opts);
        $$('.opt', foot).forEach(b => b.addEventListener('click', () => answer(st, b.dataset.v, b)));
      } else if (st.type === 'many') {
        foot.innerHTML = optsHTML(st.opts, true) + '<div class="foot-row"><button class="btn btn-gold btn-sm btn-block" type="button" id="doneBtn" disabled>' + L(st.done) + '</button></div>';
        const picked = new Set(), done = $('#doneBtn', foot);
        $$('.opt', foot).forEach(b => b.addEventListener('click', () => {
          const v = b.dataset.v;
          if (picked.has(v)) picked.delete(v); else { if (picked.size >= st.max) return; picked.add(v); }
          b.setAttribute('aria-pressed', String(picked.has(v)));
          $$('.opt', foot).forEach(x => { x.disabled = !picked.has(x.dataset.v) && picked.size >= st.max; });
          done.disabled = !picked.size; sfx('tap');
        }));
        done.addEventListener('click', () => answer(st, [...picked], done));
      } else if (st.type === 'text') {
        foot.innerHTML = '<form class="foot-row" style="margin:0" id="tForm"><input class="field" id="tIn" maxlength="' + st.max + '" autocomplete="given-name" placeholder="' + esc(L(st.ph)) + '" aria-label="' + esc(L(st.ph)) + '" /><button class="send" type="submit" aria-label="Send">' + icon('send') + '</button></form>';
        const f = $('#tForm', foot), inp = $('#tIn', foot);
        if (fine) inp.focus({ preventScroll: true });
        f.addEventListener('submit', e => { e.preventDefault(); const v = inp.value.trim().replace(/\s+/g, ' '); if (!v) { inp.focus(); return; } answer(st, v, $('.send', f)); });
      } else if (st.type === 'contact') renderContact(st);
    }
    function renderContact() {
      const c = L(BT.CHAT.contact), who = ans.who || 'parent';
      foot.innerHTML = '<form id="cForm" novalidate>' +
        '<div class="foot-row" style="margin-top:0"><input class="field" id="cName" maxlength="40" autocomplete="' + (who === 'teacher' ? 'organization' : 'name') + '" placeholder="' + esc(c.name[who]) + '" aria-label="' + esc(c.name[who]) + '" /></div>' +
        '<div class="foot-row"><input class="field" id="cPhone" type="tel" inputmode="numeric" autocomplete="tel" maxlength="16" placeholder="' + esc(c.phone) + '" aria-label="' + esc(c.phone) + '" /><button class="send" type="submit" aria-label="Send">' + icon('gift') + '</button></div>' +
        '<label class="consent"><input type="checkbox" id="cOk" /><span>' + esc(c.consent[who]) + '</span></label>' +
        '<p class="chat-err" id="cErr" hidden></p><button class="btn btn-gold btn-block" type="submit" style="margin-top:10px">' + esc(c.btn) + '</button><p class="chat-note">🔒 ' + esc(c.note) + '</p></form>';
      $('#cForm', foot).addEventListener('submit', e => {
        e.preventDefault();
        const name = $('#cName', foot).value.trim(), raw = $('#cPhone', foot).value.replace(/\D/g, ''), ok = $('#cOk', foot).checked, err = $('#cErr', foot);
        const phone = raw.length === 12 && raw.startsWith('91') ? raw.slice(2) : raw;
        const fail = m => { err.textContent = m; err.hidden = false; buzz([10, 40, 10]); };
        if (!name) return fail(c.eName);
        if (!/^[6-9]\d{9}$/.test(phone)) return fail(c.ePhone);
        if (!ok) return fail(c.eConsent);
        finish(name, phone);
      });
    }
    async function pickLang(b) {
      if (busy) return; busy = true;
      const v = b.dataset.v; foot.innerHTML = '';
      me(BT.CHAT.langOpts.find(o => o.v === v).label);
      applyLang(v, true);
      reward(body.lastChild, 1); award('hello', bot);
      await say(BT.CHAT.langReact[LANG]);
      busy = false; next(0);
      track('chat_lang', { lang: v });
    }
    async function next(i) {
      cur = i; const st = steps[i]; if (!st) return;
      foot.innerHTML = '';
      await say(fill(L(st.q)(ans)));
      renderFoot();
    }
    async function answer(st, v, el) {
      if (busy) return; busy = true;
      let label;
      if (st.type === 'many') label = v.map(x => { const o = st.opts.find(o => o.v === x); return o.em + ' ' + L(o); }).join(', ');
      else if (st.type === 'text') label = v;
      else { const o = st.opts.find(o => o.v === v); label = o.em + ' ' + L(o); }
      ans[st.id] = v; foot.innerHTML = '';
      const m = me(label);
      reward(m, cur + 2);
      let modTxt = '';
      if (st.id === 'hard') { const t = st.opts.find(o => o.v === v[0]).t; modTxt = moduleName(t); }
      if (st.id === 'love') { const t = st.opts.find(o => o.v === v).t; modTxt = moduleName(t); }
      const re = st.re && L(st.re)(ans);
      if (re) await say(fill(re, esc(modTxt)));
      track('chat_step', { step: st.id });
      busy = false;
      next(cur + 1);
    }
    function recommend() {
      const out = [];
      (ans.hard || []).forEach(v => { const o = steps.find(s => s.id === 'hard').opts.find(o => o.v === v); o && out.push(o.t); });
      const lo = steps.find(s => s.id === 'love').opts.find(o => o.v === ans.love); lo && out.push(lo.t);
      ['earth', 'fire', 'water', 'air', 'space'].forEach(t => out.push(t));
      return [...new Set(out)].slice(0, 2);
    }
    async function finish(cname, phone) {
      if (busy) return; busy = true;
      ans.contactName = cname; ans.phone = phone;
      foot.innerHTML = '';
      const m = me('✓ ' + cname + ' · ' + phone.slice(0, 2) + '••••••' + phone.slice(-2));
      reward(m, TOTAL);
      S.rec = recommend();
      sendLead();
      const E = L(BT.CHAT.end);
      await say(esc(E.unlocking));
      await say(esc(E.scratch));
      scratchCard(async card => {
        S.done = true; S.ans = ans; save();
        sfx('unlock'); buzz([30, 60, 30]);
        burst(...centerOf(card), 160, 1.3);
        award('bindu', card, true);
        wheel.render(); renderGift();
        await say(esc(E.yay));
        showPlan(true);
        track('module0_unlocked', { role: ans.who, cls: ans.cls });
      });
      busy = false;
    }
    function showPlan(fresh) {
      const E = L(BT.CHAT.end), who = ans.who || 'parent';
      const timeOpt = steps.find(s => s.id === 'time').opts.find(o => o.v === ans.time);
      const rec = S.rec.length ? S.rec : ['earth', 'fire'];
      const mod = id => BT.TATVA.find(t => t.id === id);
      const title = E.plan[who].replace('{n}', esc(ans.name || ''));
      const p = document.createElement('div'); p.className = 'plan';
      p.innerHTML = '<h4>' + title + '</h4><ol>' +
        '<li><i style="--c:var(--bindu)">0</i><span>' + esc(E.today) + ' <small>(' + esc(E.todaySub) + ')</small></span></li>' +
        rec.map((id, k) => { const t = mod(id); return '<li><i style="--c:' + t.c + '">' + t.n + '</i><span>' + esc(k ? E.then : E.next) + ' · ' + esc(L(t.title)) + ' <small lang="kn">' + t.kn + '</small></span></li>'; }).join('') +
        (timeOpt ? '<li><i style="--c:var(--paper-2)">⏰</i><span>' + esc(E.best) + ': ' + esc(timeOpt.em + ' ' + L(timeOpt)) + '</span></li>' : '') +
        '</ol><div class="btns"><a class="btn btn-gold btn-block" href="/module-0.html">' + esc(E.open) + '</a>' +
        (hasWa ? '<a class="btn btn-ghost btn-block" id="planWa" target="_blank" rel="noopener" href="#">' + icon('wa', 'i wa') + ' WhatsApp</a>' : '') +
        '<button class="btn btn-ghost btn-block" type="button" id="planShare">' + icon('share') + esc(E.share) + '</button></div>';
      body.appendChild(p); scroll();
      $('#planShare', p).addEventListener('click', share);
      const w = $('#planWa', p); if (w) w.href = 'https://wa.me/' + waDigits + '?text=' + encodeURIComponent(summary());
      foot.innerHTML = '<button class="restart" type="button" id="restart">' + esc(E.restart) + '</button>';
      $('#restart', foot).addEventListener('click', () => { S.done = false; S.ans = {}; S.rec = []; save(); ans = {}; started = false; body.innerHTML = ''; foot.innerHTML = ''; wheel.render(); location.hash = ''; renderGiftReset(); start(); });
    }
    function englishLabel(id, v) {
      const st = steps.find(s => s.id === id); if (!st || !st.opts) return v;
      const one = x => { const o = st.opts.find(o => o.v === x); return o ? o.en : x; };
      return Array.isArray(v) ? v.map(one).join(', ') : one(v);
    }
    function summary() {
      return ['Module 0 unlock (' + (LANG === 'kn' ? 'Kannada' : 'English') + ')', 'Who: ' + englishLabel('who', ans.who), 'Name: ' + ans.name, 'Class: ' + englishLabel('cls', ans.cls), 'Board: ' + englishLabel('board', ans.board),
        'Hardest: ' + englishLabel('hard', ans.hard), 'AI use: ' + englishLabel('ai', ans.ai), 'Enjoys: ' + englishLabel('love', ans.love), 'Best time: ' + englishLabel('time', ans.time),
        'Contact: ' + ans.contactName + ' · ' + ans.phone].join('\n');
    }
    async function sendLead() {
      if (!C.formEndpoint) { console.warn('[Beyond Tatva] BT_CONFIG.formEndpoint is empty, so this lead was not sent anywhere.'); return; }
      try {
        const res = await fetch(C.formEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: 'Module 0 unlock: ' + ans.name + ' (' + englishLabel('cls', ans.cls) + ')', source: 'bindu-chat', language: LANG === 'kn' ? 'Kannada' : 'English',
            role: englishLabel('who', ans.who), name: ans.name, class: englishLabel('cls', ans.cls), board: englishLabel('board', ans.board), hardest: englishLabel('hard', ans.hard),
            ai_use: englishLabel('ai', ans.ai), enjoys: englishLabel('love', ans.love), best_time: englishLabel('time', ans.time),
            contact_name: ans.contactName, whatsapp: '+91' + ans.phone, consent: 'yes', recommended: S.rec.map(id => { const t = BT.TATVA.find(x => x.id === id); return 'Module ' + t.n + ' ' + t.title.en; }).join(', ')
          })
        });
        if (!res.ok) throw new Error(res.status);
      } catch (e) {
        if (hasWa) { const m = document.createElement('div'); m.className = 'msg bot-m'; m.textContent = L(BT.CHAT.end).sendFail; body.appendChild(m); scroll(); }
      }
    }
    /* Scratch card */
    function scratchCard(onDone) {
      const E = L(BT.CHAT.end);
      const wrap = document.createElement('div'); wrap.className = 'scratch';
      wrap.innerHTML = '<div class="scratch-prize"><div class="bot"><i class="eye l"></i><i class="eye r"></i></div><small>' + esc(E.prizeTop) + '</small><b>' + (LANG === 'kn' ? 'ಮಾಡ್ಯೂಲ್ 0 · ಬಿಂದು' : 'Module 0 · Bindu') + '</b><span style="color:var(--paper-2);font-size:13px">' + esc(E.prizeSub) + '</span></div><canvas></canvas>';
      body.appendChild(wrap);
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'restart'; btn.textContent = E.revealBtn; body.appendChild(btn);
      scroll();
      const c = $('canvas', wrap), g = c.getContext('2d'), d = Math.min(2, devicePixelRatio || 1);
      const W = wrap.clientWidth, H = wrap.clientHeight; c.width = W * d; c.height = H * d; g.scale(d, d);
      const grd = g.createLinearGradient(0, 0, W, H); grd.addColorStop(0, '#D9FA6B'); grd.addColorStop(.45, '#C6F432'); grd.addColorStop(.7, '#F2FFB8'); grd.addColorStop(1, '#FFC93C');
      g.fillStyle = grd; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 260; i++) { g.fillStyle = 'rgba(255,255,255,' + Math.random() * .35 + ')'; g.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5); }
      g.fillStyle = 'rgba(21,19,15,.8)'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = '800 ' + Math.round(W / 14) + 'px Manrope, "Noto Sans Kannada", sans-serif'; g.fillText('✨ ' + E.foil + ' ✨', W / 2, H / 2);
      g.font = '600 ' + Math.round(W / 26) + 'px Manrope, sans-serif'; g.fillText('🎁', W / 2, H / 2 + W / 10);
      let down = false, last = null, moves = 0, finished = false;
      const pos = e => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      function scratchAt(p) {
        g.globalCompositeOperation = 'destination-out'; g.lineWidth = 46; g.lineCap = 'round';
        g.beginPath(); g.moveTo(...(last || p)); g.lineTo(...p); g.stroke(); last = p;
        if (++moves % 6 === 0) check();
      }
      function check() {
        const img = g.getImageData(0, 0, c.width, c.height).data; let clear = 0, tot = 0;
        for (let i = 3; i < img.length; i += 4 * 24) { tot++; if (img[i] < 40) clear++; }
        if (clear / tot > .45) done();
      }
      function done() { if (finished) return; finished = true; wrap.classList.add('done'); btn.remove(); onDone(wrap); }
      c.addEventListener('pointerdown', e => { down = true; last = null; c.setPointerCapture(e.pointerId); scratchAt(pos(e)); });
      c.addEventListener('pointermove', e => { if (down) scratchAt(pos(e)); });
      c.addEventListener('pointerup', () => { down = false; last = null; check(); });
      btn.addEventListener('click', done);
      if (reduced) done();
    }
    function refresh() { if (started && !busy && !S.done && cur >= -1 && foot.innerHTML) renderFoot(); }
    if ('IntersectionObserver' in window) { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting && document.documentElement.classList.contains('ready')) { start(); o.disconnect(); } }, { threshold: .3 }); o.observe($('#chat')); chatObs = o; }
    return { start, refresh };
  })();
  var chatObs;
  function renderGiftReset() { const pill = $('.gift-pill'); pill.onclick = null; pill.onkeydown = null; pill.removeAttribute('role'); pill.style.cursor = ''; pill.innerHTML = '<span class="gi"><svg class="i"><use href="#i-gift"/></svg></span><span data-i18n="h_gift">' + (LANG === 'kn' ? BT.KN.h_gift : EN.h_gift) + '</span>'; }
  $('#startChat').addEventListener('click', () => setTimeout(() => chat.start(), 500));

  /* ══════════════ Before / after ══════════════ */
  (() => {
    const ba = $('#ba'), r = $('.ba-range', ba);
    r.addEventListener('input', () => { ba.style.setProperty('--p', r.value + '%'); ba.classList.add('touched'); if (r.value < 45) award('slider', $('.ba-handle span', ba)); });
  })();

  /* ══════════════ Myths ══════════════ */
  (() => {
    const flipped = new Set();
    $$('.myth').forEach((m, i) => m.addEventListener('click', () => {
      const on = m.getAttribute('aria-pressed') !== 'true'; m.setAttribute('aria-pressed', String(on)); sfx('tap');
      if (on) { flipped.add(i); if (flipped.size === 4) award('myth', m, true); }
    }));
  })();

  /* ══════════════ Price reveal (slot reel) ══════════════ */
  (() => {
    const price = $('#price'), btn = $('#revealPrice'); let shown = false;
    function reveal(byUser) {
      if (shown) return; shown = true;
      const target = ['7', '9', '9'];
      $$('.dg', price).forEach((dg, i) => {
        const seq = ['?'].concat(Array.from({ length: 10 + i * 4 }, () => String(Math.floor(Math.random() * 10))), [target[i]]);
        dg.innerHTML = '<span class="col">' + seq.map(n => '<b>' + n + '</b>').join('') + '</span>';
        const col = $('.col', dg); col.style.transitionDuration = (reduced ? 0 : 1.1 + i * .35) + 's';
        requestAnimationFrame(() => requestAnimationFrame(() => { col.style.transform = 'translateY(-' + (seq.length - 1) + 'em)'; }));
      });
      price.classList.add('revealed'); btn.hidden = true;
      setTimeout(() => { burst(...centerOf(price), 70); sfx('unlock'); buzz(30); if (byUser) award('price', price); }, reduced ? 0 : 1800);
      track('price_reveal', { byUser });
    }
    btn.addEventListener('click', () => reveal(true));
    if ('IntersectionObserver' in window) {
      let tmr = null;
      new IntersectionObserver(([e]) => { if (e.isIntersecting) tmr = setTimeout(() => reveal(false), 2600); else clearTimeout(tmr); }, { threshold: .6 }).observe($('#ticket'));
    }
  })();

  /* ══════════════ Kinetic Kannada rows ══════════════ */
  [['#k1', 0], ['#k2', 1]].forEach(([sel, i]) => {
    const html = BT.KINETIC[i].map(w => '<span><b lang="kn">' + w[0] + '</b><small>' + w[1] + '</small></span>').join('');
    $(sel).innerHTML = html + html;
  });

  /* ══════════════ Kolam (drawn on scroll) ══════════════ */
  (() => {
    const svg = $('#kolam'); let html = '';
    for (let x = -60; x <= 60; x += 30) for (let y = -60; y <= 60; y += 30) html += '<circle class="d" cx="' + x + '" cy="' + y + '" r="2.2"/>';
    for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4, p = (r, d) => (Math.cos(a + d) * r).toFixed(1) + ' ' + (Math.sin(a + d) * r).toFixed(1);
      html += '<path d="M0 0 Q ' + p(70, -.42) + ' ' + p(98, 0) + ' Q ' + p(70, .42) + ' 0 0"/>';
    }
    html += '<circle class="r" cx="0" cy="0" r="30"/><circle class="r" cx="0" cy="0" r="62"/>';
    let wave = ''; for (let i = 0; i <= 160; i++) { const a = i / 160 * Math.PI * 2, r = 92 + Math.sin(a * 16) * 6; wave += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ' ' + (Math.sin(a) * r).toFixed(1) + ' '; }
    html += '<path d="' + wave + 'Z"/>';
    svg.innerHTML = html;
    const strokes = $$('path, circle.r', svg).map(el => { const len = el.getTotalLength ? el.getTotalLength() : 600; el.style.strokeDasharray = len; el.style.strokeDashoffset = len; return [el, len]; });
    const fin = $('#finale');
    function draw() {
      const r = fin.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * .9)));
      strokes.forEach(([el, len], i) => { const k = Math.min(1, Math.max(0, p * 1.4 - i * .03)); el.style.strokeDashoffset = len * (1 - k); });
      if (p > .85) award('end', $('h2', fin));
    }
    addEventListener('scroll', () => requestAnimationFrame(draw), { passive: true }); draw();
  })();

  /* ══════════════ Forms (school workshop) ══════════════ */
  $$('form[data-lead]').forEach(form => {
    const btn = $('button[type=submit]', form), msg = $('.form-msg', form);
    const show = (ok, t) => { msg.className = 'form-msg full ' + (ok ? 'ok' : 'err'); msg.textContent = t; msg.hidden = false; };
    const fields = () => [...new FormData(form)].filter(([k, v]) => k !== '_gotcha' && String(v).trim());
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity() || $('[name=_gotcha]', form).value) return;
      const text = ['School workshop request'].concat(fields().map(([k, v]) => k + ': ' + v)).join('\n');
      if (!C.formEndpoint) {
        if (hasWa) { window.open('https://wa.me/' + waDigits + '?text=' + encodeURIComponent(text), '_blank', 'noopener'); show(true, T().okWa); }
        else if (C.email) { location.href = 'mailto:' + C.email + '?subject=' + encodeURIComponent('School workshop request') + '&body=' + encodeURIComponent(text); show(true, T().okMail); }
        else show(false, T().notSet);
        return;
      }
      const label = btn.innerHTML; btn.disabled = true; btn.textContent = T().sending;
      try {
        const res = await fetch(C.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.assign({ _subject: 'School workshop request', source: 'schools-form', language: LANG }, Object.fromEntries(fields()))) });
        if (!res.ok) throw new Error(res.status);
        form.reset(); show(true, T().okSchool); burst(...centerOf(btn), 60); track('generate_lead', { form: 'school' });
      } catch (err) { show(false, T().err + (hasWa ? T().errWa : C.email ? T().errMail(C.email) : '.')); }
      btn.disabled = false; btn.innerHTML = label;
    });
  });

  /* ══════════════ Cursor glow, magnetic buttons, tilt, spotlight ══════════════ */
  if (fine && !reduced) {
    const cur = $('#cursor'); let tx = -100, ty = -100, x = -100, y = -100;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); }, { passive: true });
    document.addEventListener('pointerover', e => cur.classList.toggle('hover', !!e.target.closest('a, button, .pin, input, select, textarea, label, .gift-pill')));
    (function loop() { x += (tx - x) * .2; y += (ty - y) * .2; cur.style.transform = 'translate(' + x + 'px,' + y + 'px)'; requestAnimationFrame(loop); })();
    $$('.mag').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .22 + 'px,' + (e.clientY - r.top - r.height / 2) * .3 + 'px)'; });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
    $$('.pin').forEach(p => {
      p.addEventListener('pointermove', e => { const r = p.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5; p.style.transform = 'perspective(800px) rotateY(' + dx * 10 + 'deg) rotateX(' + -dy * 10 + 'deg) scale(1.02)'; });
      p.addEventListener('pointerleave', () => { p.style.transform = ''; });
    });
  }
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.card'); if (!c) return;
    const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ══════════════ Scroll: progress, nav, buy bar ══════════════ */
  const prog = $('#progress'), nav = $('#nav'), bar = $('#buybar');
  addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    nav.classList.toggle('solid', scrollY > 10);
  }, { passive: true });
  if ('IntersectionObserver' in window) {
    let past = false, onTicket = false;
    const sync = () => { const s = past && !onTicket; bar.classList.toggle('show', s); bar.setAttribute('aria-hidden', String(!s)); $$('a', bar).forEach(a => a.tabIndex = s ? 0 : -1); };
    new IntersectionObserver(([e]) => { past = !e.isIntersecting; sync(); }).observe($('#top'));
    new IntersectionObserver(([e]) => { onTicket = e.isIntersecting; sync(); }, { threshold: .15 }).observe($('#ticket'));
  }

  /* ══════════════ Easter egg: tap the logo 5 times ══════════════ */
  (() => {
    let n = 0, t = 0;
    $('#brand').addEventListener('click', e => {
      const now = Date.now(); n = now - t < 900 ? n + 1 : 1; t = now;
      if (n >= 5) { e.preventDefault(); n = 0; burst(innerWidth / 2, innerHeight / 3, 220, 1.6); toast('🔮', T().secret, ''); award('secret', $('#brand img'), true); }
    });
  })();

  /* ══════════════ Boot: language, intro, reveals ══════════════ */
  const urlLang = new URLSearchParams(location.search).get('lang');
  applyLang(urlLang || S.lang || 'en', !!urlLang);
  function ready() {
    document.documentElement.classList.add('ready');
    startReveals();
    const r = $('#chat').getBoundingClientRect();
    if (r.top < innerHeight * .9 && r.bottom > 0) chat.start();
  }
  const intro = $('#intro');
  if (document.documentElement.classList.contains('intro-on')) {
    let ended = false;
    const end = () => {
      if (ended) return; ended = true;
      intro.classList.add('open');
      try { sessionStorage.setItem('bt_intro', '1'); } catch (e) {}
      setTimeout(() => { document.documentElement.classList.remove('intro-on'); intro.remove(); }, 1050);
      setTimeout(ready, 350);
    };
    $('#introSkip').addEventListener('click', end);
    setTimeout(end, 3600);
  } else { intro.remove(); ready(); }
})();
