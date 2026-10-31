/* Beyond Tatva · homepage
   Loki chat (opens first), one language at a time, XP circle with a 5% reward,
   real urgency from config.js, and GA4. Checkout lives in pay.js. */
(function () {
  'use strict';
  var C = window.BT_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var REWARD_CODE = 'LOKI5', XP_FULL = 300;

  /* ── Storage ── */
  function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var S = load('bt_v3', {}); S.ans = S.ans || {};
  var X = load('bt_xp', { xp: 0, claimed: false, got: {} });
  function save() { store('bt_v3', S); store('bt_xp', X); }

  /* ── Analytics ── */
  function track(n, p) { if (window.gtag) gtag('event', n, p || {}); }
  if (C.ga4) {
    var g = document.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.ga4; document.head.appendChild(g);
    window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag('js', new Date()); gtag('config', C.ga4);
  }

  /* ── Language: English OR Kannada, never mixed ── */
  var KN = {
    enroll: 'ದಾಖಲಾಗಿ', enrollNow: 'ಈಗಲೇ ದಾಖಲಾಗಿ',
    h1: 'ನಿಮ್ಮ ಮಗು <em>ಓದಲು</em> AI ಬಳಸಲಿ, ನಕಲು ಮಾಡಲು ಅಲ್ಲ.',
    sub: '8–10ನೇ ತರಗತಿಗೆ. ಬೋರ್ಡ್ ಪರೀಕ್ಷೆಯ ಓದಿನ ಕೌಶಲ, ಸೃಜನಶೀಲ ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು ಮತ್ತು ಪ್ರಾಮಾಣಿಕ AI ಅಭ್ಯಾಸ. 7 ದಿನದಲ್ಲಿ ಪೂರ್ಣ ಹಣ ವಾಪಸ್.',
    t1: 'ಪಾವತಿಗೆ ಮೊದಲು ಉಚಿತ ಮಾಡ್ಯೂಲ್ 0', t2: 'ಫೋನ್ ಸಾಕು', t3: 'ಉಡುಪಿಯಲ್ಲಿ ರೂಪುಗೊಂಡಿದೆ',
    botSub: '4 ಸಣ್ಣ ಉತ್ತರ ನೀಡಿ · ಮಾಡ್ಯೂಲ್ 0 ಉಚಿತ',
    kicker: 'ಸ್ಥಾಪಕ ಬ್ಯಾಚ್ 1', offerH: 'ಬಿಯಾಂಡ್ ತತ್ವ AI ಕೋರ್ಸ್', seats: 'ಉಳಿದಿರುವ ಸ್ಥಾಪಕ ಸೀಟುಗಳು',
    i1: 'ಎಲ್ಲಾ 6 ಮಾಡ್ಯೂಲ್, ಜೀವನಪರ್ಯಂತ ಪ್ರವೇಶ', i2: 'ಬೋರ್ಡ್ ಪರೀಕ್ಷೆ ಕಿಟ್: ನೋಟ್ಸ್, ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್, ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು', i3: 'ಓದು, ಪ್ರಾಜೆಕ್ಟ್ ಮತ್ತು ಜೀವನಕ್ಕೆ 250+ ಸಿದ್ಧ ಪ್ರಾಂಪ್ಟ್‌ಗಳು', i4: 'ಎಲ್ಲಾ ಮಾಡ್ಯೂಲ್ ಮುಗಿಸಿದ ನಂತರ ಪ್ರಮಾಣಪತ್ರ', i5: 'ಪೋಷಕರಿಗೆ WhatsApp ಸಹಾಯ',
    coupon: 'ಕೂಪನ್', couponPh: 'ಕೋಡ್ ಇದೆಯೇ?',
    fine: '7 ದಿನದಲ್ಲಿ ಪೂರ್ಣ ಹಣ ವಾಪಸ್, ಪ್ರಶ್ನೆ ಇಲ್ಲ · Razorpay ಮೂಲಕ ಸುರಕ್ಷಿತ ಪಾವತಿ (UPI, ಕಾರ್ಡ್, ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್)',
    courseH: 'ನಿಮ್ಮ ಮಗು ಏನು ಕಲಿಯುತ್ತದೆ',
    m0: 'AI 101 (ಉಚಿತ)', m0d: 'AI ಎಂದರೇನು, ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ, ಪ್ರಾಮಾಣಿಕ ಬಳಕೆಯ 3 ನಿಯಮಗಳು.',
    m1: 'ಓದಿನ ಸಂಗಾತಿ', m1d: 'ಯಾವುದೇ ಪಾಠದಿಂದ ನೋಟ್ಸ್, ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್ ಮತ್ತು ಬೋರ್ಡ್ ಮಾದರಿ ಪ್ರಶ್ನೆಗಳು.',
    m2: 'AI ಜೊತೆ ಸೃಷ್ಟಿ', m2d: 'ಶಾಲಾ ಪ್ರಾಜೆಕ್ಟ್‌ಗೆ ಪೋಸ್ಟರ್, ಚಿತ್ರ, ವಿಡಿಯೋ ಮತ್ತು ಸಂಗೀತ.',
    m3: 'ಜೀವನ ಕೌಶಲ', m3d: 'ಸತ್ಯ ಪರಿಶೀಲನೆ, ನಕಲಿ ಗುರುತಿಸುವಿಕೆ, ಸ್ಕ್ರೀನ್ ಸಮಯ ನಿಯಂತ್ರಣ.',
    m4: 'AI ಜೊತೆ ನಿರ್ಮಾಣ', m4d: 'ಕೋಡಿಂಗ್ ಇಲ್ಲದೆ ವೆಬ್‌ಸೈಟ್, ಆಟ ಮತ್ತು ಟೂಲ್‌ಗಳು.',
    m5: 'AI ಜೊತೆ ವ್ಯಾಪಾರ', m5d: 'ಐಡಿಯಾದಿಂದ ಆರಂಭದವರೆಗೆ: ಮಾರ್ಕೆಟಿಂಗ್, ಕಂಟೆಂಟ್, ಮೂಲ ಹಣಕಾಸು.',
    faqH: 'ಪೋಷಕರ ಪ್ರಶ್ನೆಗಳು',
    q1: 'ಮಾಡ್ಯೂಲ್ 0 ಎಂದರೇನು, ಅದು ನಿಜವಾಗಿಯೂ ಉಚಿತವೇ?', a1: 'ಹೌದು. ಮಾಡ್ಯೂಲ್ 0 (ಲೋಕಿ) 15 ನಿಮಿಷದ ಆರಂಭಿಕ ಪಾಠ: AI ಎಂದರೇನು, ಪ್ರಾಮಾಣಿಕ ಬಳಕೆಯ 3 ನಿಯಮಗಳು ಮತ್ತು ಮೊದಲ ಓದಿನ ಪ್ರಾಂಪ್ಟ್. ಮೇಲಿನ ಚಾಟ್ ಮೂಲಕ ಉಚಿತವಾಗಿ ತೆರೆಯಿರಿ.',
    q2: 'ಇದು ಬೋರ್ಡ್ ಪರೀಕ್ಷೆಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆಯೇ?', a2: 'ಮಾಡ್ಯೂಲ್ 1ರ ಮುಖ್ಯ ಗುರಿ ಅದೇ. ತಮ್ಮದೇ ಪಠ್ಯಪುಸ್ತಕದ ಪಾಠಗಳಿಂದ ನೋಟ್ಸ್, ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್ ಮತ್ತು ಪರೀಕ್ಷಾ ಮಾದರಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಮಾಡಲು ಕಲಿಯುತ್ತಾರೆ.',
    q3: 'ಓದಿಗೆ AI ಬಳಸುವುದು ನಕಲು ಅಲ್ಲವೇ?', a3: 'ನಕಲು ಮಾಡುವುದು ತಪ್ಪು. ಅರ್ಥ ಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ಅಭ್ಯಾಸಕ್ಕೆ AI ಬಳಸುವುದು ತಪ್ಪಲ್ಲ. ಪರೀಕ್ಷೆ, ಅಂಕದ ಹೋಂವರ್ಕ್‌ನಲ್ಲಿ AI ಬಳಸಬಾರದು ಎಂದೂ ಕಲಿಸುತ್ತೇವೆ.',
    q4: 'ಇದು ಕನ್ನಡದಲ್ಲಿ ಇದೆಯೇ?', a4: 'ಈ ವೆಬ್‌ಸೈಟ್ ಸಂಪೂರ್ಣ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿದೆ. ಯಾವ ಭಾಷೆಯಲ್ಲಾದರೂ ನಮಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ. ಪಾಠಗಳಿಗೆ ಕನ್ನಡ ಸಹಾಯದ ಬಗ್ಗೆ WhatsApp ನಲ್ಲಿ ಕೇಳಿ.',
    q5: 'ಎಷ್ಟು ಸಮಯ ಬೇಕು?', a5: 'ನಿಮ್ಮ ವೇಗದಲ್ಲಿ, ಜೀವನಪರ್ಯಂತ ಪ್ರವೇಶ. ಹೆಚ್ಚಿನವರು ಶಾಲೆಯ ಜೊತೆಗೆ 1–2 ವಾರದಲ್ಲಿ ಮುಗಿಸುತ್ತಾರೆ.',
    q6: 'ಇಷ್ಟವಾಗದಿದ್ದರೆ?', a6: '7 ದಿನದೊಳಗೆ ತಿಳಿಸಿ, ಪೂರ್ಣ ₹799 ವಾಪಸ್. ಯಾವುದೇ ಪ್ರಶ್ನೆ ಇಲ್ಲ.',
    q7: 'ನನ್ನ ನಂಬರ್ ಅನ್ನು ಏನು ಮಾಡುತ್ತೀರಿ?', a7: 'ಮಾಡ್ಯೂಲ್ 0, ಮಗುವಿನ ಯೋಜನೆ ಮತ್ತು ಕೋರ್ಸ್ ಮಾಹಿತಿಯನ್ನು WhatsApp ನಲ್ಲಿ ಕಳುಹಿಸಲು ಮಾತ್ರ. ಯಾರಿಗೂ ಕೊಡುವುದಿಲ್ಲ. ಯಾವಾಗ ಬೇಕಾದರೂ STOP ಎಂದು ಉತ್ತರಿಸಿ.',
    school: 'ನೀವು ಶಾಲೆಯೇ? ಉಚಿತ AI ಕಾರ್ಯಾಗಾರ ಬುಕ್ ಮಾಡಿ', ft: '8–10ನೇ ತರಗತಿಗೆ AI ಕೌಶಲ · ಉಡುಪಿ, ಕರ್ನಾಟಕ',
    dockNote: '7 ದಿನದಲ್ಲಿ ಪೂರ್ಣ ಹಣ ವಾಪಸ್',
    wH: 'ನಮಸ್ಕಾರ, ನಾನು <em>ಲೋಕಿ</em> 👋', wP: 'ನಿಮ್ಮ ಮಗುವಿನ AI ಓದಿನ ಮಾರ್ಗದರ್ಶಿ. 4 ಸಣ್ಣ ಉತ್ತರ ನೀಡಿ, ಮಾಡ್ಯೂಲ್ 0 ಉಚಿತ.', wSkip: 'ಕೋರ್ಸ್ ನೋಡುತ್ತೇನೆ →'
  };
  var EN = {};
  $$('[data-t]').forEach(function (el) { EN[el.dataset.t] = el.innerHTML; });
  $$('[data-tp]').forEach(function (el) { EN[el.dataset.tp] = el.placeholder; });
  var LANG = document.documentElement.lang === 'kn' ? 'kn' : 'en';
  function T(en, kn) { return LANG === 'kn' ? kn : en; }
  function applyLang(l) {
    LANG = l; document.documentElement.lang = l;
    try { localStorage.setItem('bt_lang', l); } catch (e) {}
    $$('[data-t]').forEach(function (el) { var k = el.dataset.t; el.innerHTML = l === 'kn' && KN[k] ? KN[k] : EN[k]; });
    $$('[data-tp]').forEach(function (el) { var k = el.dataset.tp; el.placeholder = l === 'kn' && KN[k] ? KN[k] : EN[k]; });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === l)); });
    renderPrices(); renderUrgency(); renderXp();
  }
  $$('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.lang === LANG) return;
      applyLang(b.dataset.lang); track('language', { lang: LANG });
      if (!S.done) chat.restart(); else chat.showDone();
    });
  });

  /* ── Prices & real urgency ── */
  var price = C.price || 799, list = C.listPrice || 2499;
  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
  function renderPrices() {
    $$('[data-price]').forEach(function (el) { el.textContent = inr(price); });
    $$('[data-list]').forEach(function (el) { el.textContent = inr(list); });
    var save = $('#save'); if (save) save.textContent = T('Save ', 'ಉಳಿತಾಯ ') + Math.round((list - price) / list * 100) + '%';
    var left = seatsLeft();
    if (left != null && $('#seats')) {
      $('#seats').hidden = false; $('#seatsLeft').textContent = left + ' / ' + C.seatsTotal;
      $('#seatsBar').style.width = Math.max(4, (C.seatsTotal - left) / C.seatsTotal * 100) + '%';
    }
  }
  function seatsLeft() { return (C.seatsTotal && C.seatsTaken != null) ? Math.max(0, C.seatsTotal - C.seatsTaken) : null; }
  function untilText(iso) {
    var ms = new Date(iso) - new Date(); if (!(ms > 0)) return '';
    var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
    return d > 0 ? T(d + 'd ' + h + 'h', d + ' ದಿನ ' + h + ' ಗಂ') : T(h + 'h ' + m + 'm', h + ' ಗಂ ' + m + ' ನಿ');
  }
  function renderUrgency() {
    var parts = [], left = seatsLeft();
    if (left != null) parts.push('<b>' + T('Only ' + left + ' founding seats left', 'ಕೇವಲ ' + left + ' ಸ್ಥಾಪಕ ಸೀಟುಗಳು ಉಳಿದಿವೆ') + '</b>');
    var dl = C.priceDeadline && untilText(C.priceDeadline);
    if (dl) parts.push(T('Founding price ends in ', 'ಸ್ಥಾಪಕ ಬೆಲೆ ಮುಗಿಯಲು ') + '<b>' + dl + '</b>');
    if (C.batchStart && new Date(C.batchStart) > new Date()) parts.push(T('Batch 1 starts ', 'ಬ್ಯಾಚ್ 1 ಆರಂಭ ') + '<b>' + new Date(C.batchStart).toLocaleDateString(LANG === 'kn' ? 'kn-IN' : 'en-IN', { day: 'numeric', month: 'short' }) + '</b>');
    if (!parts.length) parts.push('<b>' + T('Founding price ' + inr(price), 'ಸ್ಥಾಪಕ ಬೆಲೆ ' + inr(price)) + '</b> · ' + T(inr(list) + ' after Batch 1', 'ಬ್ಯಾಚ್ 1 ನಂತರ ' + inr(list)));
    $('#uText').innerHTML = parts.slice(0, 2).join(' · ');
  }
  if (C.priceDeadline) setInterval(renderUrgency, 30000);

  /* ── XP circle: subtle, one tap claims everything ── */
  var xpBtn = $('#xp'), xpPop = $('#xpPop');
  function addXp(id, n) {
    if (X.claimed || X.got[id]) return; X.got[id] = 1; X.xp = Math.min(XP_FULL, X.xp + n); save(); renderXp();
    if (!xpBtn.hidden) { xpBtn.classList.remove('bump', 'nudge'); void xpBtn.offsetWidth; xpBtn.classList.add('bump', 'nudge'); }
  }
  function renderXp() {
    $('#xpN').textContent = X.claimed ? '5%' : X.xp;
    xpBtn.setAttribute('aria-label', X.claimed ? T('Your 5% coupon', 'ನಿಮ್ಮ 5% ಕೂಪನ್') : X.xp + ' XP');
    $('.xp small').textContent = X.claimed ? T('OFF', 'ರಿಯಾಯಿತಿ') : 'XP';
    if (!xpPop.hidden) renderPop();
  }
  function renderPop() {
    var b = $('#xpBody');
    if (!X.claimed) {
      b.innerHTML = '<h3 id="xpH">' + T('You have ' + X.xp + ' XP', 'ನಿಮ್ಮ ಬಳಿ ' + X.xp + ' XP ಇದೆ') + '</h3><p>' + T('Claim all ' + XP_FULL + ' XP now and unlock an extra 5% off the course.', 'ಎಲ್ಲಾ ' + XP_FULL + ' XP ಈಗ ಪಡೆಯಿರಿ, ಕೋರ್ಸ್ ಮೇಲೆ ಹೆಚ್ಚುವರಿ 5% ರಿಯಾಯಿತಿ ಪಡೆಯಿರಿ.') + '</p><button class="btn" type="button" id="xpClaim">' + T('Claim all XP', 'ಎಲ್ಲಾ XP ಪಡೆಯಿರಿ') + '</button>';
      $('#xpClaim').addEventListener('click', claim);
    } else {
      b.innerHTML = '<h3 id="xpH">' + T('🎉 ' + XP_FULL + ' XP claimed', '🎉 ' + XP_FULL + ' XP ಪಡೆದಿರಿ') + '</h3><p>' + T('Your reward: an extra 5% off.', 'ನಿಮ್ಮ ಬಹುಮಾನ: ಹೆಚ್ಚುವರಿ 5% ರಿಯಾಯಿತಿ.') + '</p><div class="code"><span>' + REWARD_CODE + '</span><span aria-hidden="true">🎁</span></div><button class="btn" type="button" id="xpApply">' + T('Apply & enroll', 'ಅನ್ವಯಿಸಿ ದಾಖಲಾಗಿ') + '</button>';
      $('#xpApply').addEventListener('click', function () { applyCoupon(); closePop(); $('#offer').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); track('xp_coupon_apply'); });
    }
  }
  function claim() {
    var from = X.xp; X.xp = XP_FULL; X.claimed = true; save(); track('xp_claim_all', { from: from });
    var n = $('#xpN'), t0 = performance.now();
    (function step(t) { var k = Math.min(1, (t - t0) / 700); n.textContent = Math.round(from + (XP_FULL - from) * k); if (k < 1 && !reduced) requestAnimationFrame(step); else renderXp(); })(t0);
    renderPop(); applyCoupon();
  }
  function applyCoupon() { var c = $('#coupon'); if (c) { c.value = REWARD_CODE; c.classList.add('applied'); } }
  function openPop() { renderPop(); xpPop.hidden = false; xpBtn.setAttribute('aria-expanded', 'true'); track('xp_open'); }
  function closePop() { xpPop.hidden = true; xpBtn.setAttribute('aria-expanded', 'false'); }
  xpBtn.addEventListener('click', function () { xpPop.hidden ? openPop() : closePop(); });
  $('#xpClose').addEventListener('click', closePop);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePop(); });
  if (X.claimed) applyCoupon();
  setTimeout(function () { xpBtn.hidden = false; addXp('welcome', 10); renderXp(); }, 4000);
  // Light XP for real engagement
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { addXp('see-' + e.target.id, 15); io.unobserve(e.target); } }); }, { threshold: .4 });
    ['offer', 'course', 'faq'].forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
  $$('.faq details').forEach(function (d, i) { d.addEventListener('toggle', function () { if (d.open) addXp('faq' + i, 5); }); });

  /* ── Loki chat: opens first ── */
  var chat = (function () {
    var body = $('#chatBody'), foot = $('#chatFoot'), dots = $$('#steps i'), busy = false, run = 0;
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function scroll() { body.scrollTop = body.scrollHeight; }
    function wait(ms) { return new Promise(function (r) { setTimeout(r, reduced ? 0 : ms); }); }
    function say(html, my) {
      var typing = document.createElement('div'); typing.className = 'typing'; typing.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(typing); scroll();
      return wait(Math.min(900, 300 + html.length * 6)).then(function () { typing.remove(); if (my !== run) return; var m = document.createElement('div'); m.className = 'msg b'; m.innerHTML = html; body.appendChild(m); scroll(); });
    }
    function me(text) { var m = document.createElement('div'); m.className = 'msg u'; m.textContent = text; body.appendChild(m); scroll(); }
    function step(i) { dots.forEach(function (d, k) { d.classList.toggle('on', k < i); }); }
    function choices(opts, cls, onPick) {
      foot.innerHTML = '<div class="opts ' + (cls || '') + '">' + opts.map(function (o, i) { return '<button class="opt' + (o.wide ? ' wide' : '') + '" type="button" data-i="' + i + '">' + o.label + '</button>'; }).join('') + '</div>';
      $$('.opt', foot).forEach(function (b) { b.addEventListener('click', function () { if (busy) return; busy = true; var o = opts[+b.dataset.i]; foot.innerHTML = ''; me(b.textContent); busy = false; onPick(o); }); });
    }
    var Q = {
      who: function () { return [{ v: 'parent', label: T('👨‍👩‍👧 I\'m a parent', '👨‍👩‍👧 ನಾನು ಪೋಷಕ') }, { v: 'student', label: T('🎒 I\'m a student', '🎒 ನಾನು ವಿದ್ಯಾರ್ಥಿ') }, { v: 'school', label: T('🏫 I represent a school', '🏫 ನಾನು ಶಾಲೆಯ ಪರವಾಗಿ'), wide: true }]; },
      cls: function () { return ['8', '9', '10'].map(function (c) { return { v: c, label: T('Class ' + c, c + 'ನೇ ತರಗತಿ') }; }); },
      board: function () { return [{ v: 'state', label: T('State board', 'ರಾಜ್ಯ ಪಠ್ಯಕ್ರಮ') }, { v: 'cbse', label: 'CBSE' }, { v: 'icse', label: 'ICSE' }]; },
      goal: function () { return [{ v: 'marks', label: T('📈 Better marks', '📈 ಉತ್ತಮ ಅಂಕ') }, { v: 'create', label: T('🎨 Creative projects', '🎨 ಸೃಜನಶೀಲ ಪ್ರಾಜೆಕ್ಟ್') }, { v: 'safe', label: T('🛡️ Safe, honest AI use', '🛡️ ಸುರಕ್ಷಿತ, ಪ್ರಾಮಾಣಿಕ ಬಳಕೆ') }, { v: 'future', label: T('🚀 Future skills', '🚀 ಭವಿಷ್ಯದ ಕೌಶಲ') }]; }
    };
    function rec(g) { return ({ marks: ['1', T('Study Buddy', 'ಓದಿನ ಸಂಗಾತಿ')], create: ['2', T('Create with AI', 'AI ಜೊತೆ ಸೃಷ್ಟಿ')], safe: ['3', T('Life Hacks', 'ಜೀವನ ಕೌಶಲ')], future: ['4', T('Build with AI', 'AI ಜೊತೆ ನಿರ್ಮಾಣ')] })[g] || ['1', T('Study Buddy', 'ಓದಿನ ಸಂಗಾತಿ')]; }

    function start() {
      var my = ++run; body.innerHTML = ''; foot.innerHTML = ''; step(0);
      if (S.done && S.ans.phone) return showDone();
      say(T('Hi! I\'m <b>Loki</b> 👋 Four quick taps and I\'ll unlock <b>Module 0 free</b>.', 'ನಮಸ್ಕಾರ! ನಾನು <b>ಲೋಕಿ</b> 👋 ನಾಲ್ಕು ಸಣ್ಣ ಉತ್ತರ ನೀಡಿ, <b>ಮಾಡ್ಯೂಲ್ 0 ಉಚಿತ</b>ವಾಗಿ ತೆರೆಯುತ್ತೇನೆ.'), my)
        .then(function () { return say(T('Who are you?', 'ನೀವು ಯಾರು?'), my); })
        .then(function () { if (my === run) choices(Q.who(), '', pickWho); });
      track('chat_start');
    }
    function pickWho(o) {
      var my = run; S.ans = { who: o.v }; save(); step(1); addXp('c-who', 20); track('chat_who', { who: o.v });
      if (o.v === 'school') {
        say(T('Our free school workshop has its own page. Taking you there…', 'ಶಾಲೆಗಳಿಗೆ ಉಚಿತ ಕಾರ್ಯಾಗಾರದ ಪ್ರತ್ಯೇಕ ಪುಟವಿದೆ. ಅಲ್ಲಿಗೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ…'), my).then(function () { foot.innerHTML = '<a class="btn" href="/schools">' + T('Open the school programme →', 'ಶಾಲಾ ಕಾರ್ಯಕ್ರಮ ತೆರೆಯಿರಿ →') + '</a>'; setTimeout(function () { location.href = '/schools'; }, 1500); });
        return;
      }
      say(o.v === 'parent' ? T('Which class is your child in?', 'ನಿಮ್ಮ ಮಗು ಯಾವ ತರಗತಿಯಲ್ಲಿದೆ?') : T('Which class are you in?', 'ನೀವು ಯಾವ ತರಗತಿಯಲ್ಲಿದ್ದೀರಿ?'), my).then(function () { if (my === run) choices(Q.cls(), 'three', pickCls); });
    }
    function pickCls(o) {
      var my = run; S.ans.cls = o.v; save(); step(2); addXp('c-cls', 20);
      say(T('Which board?', 'ಯಾವ ಪಠ್ಯಕ್ರಮ?'), my).then(function () { if (my === run) choices(Q.board(), 'three', pickBoard); });
    }
    function pickBoard(o) {
      var my = run; S.ans.board = o.v; save(); step(3); addXp('c-board', 20);
      say(T('What matters most right now?', 'ಈಗ ಯಾವುದು ಹೆಚ್ಚು ಮುಖ್ಯ?'), my).then(function () { if (my === run) choices(Q.goal(), '', pickGoal); });
    }
    function pickGoal(o) {
      var my = run; S.ans.goal = o.v; save(); step(4); addXp('c-goal', 20);
      var r = rec(o.v);
      say(T('Good choice. <b>Module ' + r[0] + ': ' + r[1] + '</b> is made for that.', 'ಒಳ್ಳೆಯ ಆಯ್ಕೆ. <b>ಮಾಡ್ಯೂಲ್ ' + r[0] + ': ' + r[1] + '</b> ಅದಕ್ಕಾಗಿಯೇ ಇದೆ.'), my)
        .then(function () { return say(S.ans.who === 'student' ? T('Last step: ask a parent to add their name and WhatsApp number 🎁', 'ಕೊನೆಯ ಹಂತ: ಪೋಷಕರ ಹೆಸರು ಮತ್ತು WhatsApp ನಂಬರ್ ಅವರೇ ಹಾಕಲಿ 🎁') : T('Last step: where should I send Module 0? 🎁', 'ಕೊನೆಯ ಹಂತ: ಮಾಡ್ಯೂಲ್ 0 ಎಲ್ಲಿಗೆ ಕಳುಹಿಸಲಿ? 🎁'), my); })
        .then(function () { if (my === run) contact(); });
    }
    function contact() {
      foot.innerHTML = '<form class="cf" id="cf" novalidate>' +
        '<input class="field" id="cName" maxlength="40" autocomplete="name" placeholder="' + T('Parent\'s name', 'ಪೋಷಕರ ಹೆಸರು') + '" aria-label="' + T('Parent\'s name', 'ಪೋಷಕರ ಹೆಸರು') + '">' +
        '<input class="field" id="cPhone" type="tel" inputmode="numeric" autocomplete="tel" maxlength="16" placeholder="' + T('WhatsApp number (10 digits)', 'WhatsApp ನಂಬರ್ (10 ಅಂಕಿ)') + '" aria-label="WhatsApp">' +
        '<label class="ok"><input type="checkbox" id="cOk"><span>' + T('I\'m the parent/guardian and agree to receive Module 0 and course updates on WhatsApp. <a href="/privacy" target="_blank">Privacy</a>', 'ನಾನು ಪೋಷಕ/ರಕ್ಷಕ. ಮಾಡ್ಯೂಲ್ 0 ಮತ್ತು ಕೋರ್ಸ್ ಮಾಹಿತಿಯನ್ನು WhatsApp ನಲ್ಲಿ ಪಡೆಯಲು ಒಪ್ಪುತ್ತೇನೆ. <a href="/privacy" target="_blank">ಗೌಪ್ಯತೆ</a>') + '</span></label>' +
        '<p class="err" id="cErr" hidden></p><button class="btn" type="submit">' + T('Unlock Module 0 free 🎁', 'ಮಾಡ್ಯೂಲ್ 0 ಉಚಿತವಾಗಿ ತೆರೆಯಿರಿ 🎁') + '</button></form>';
      $('#cf').addEventListener('submit', function (e) {
        e.preventDefault();
        var name = $('#cName').value.trim(), raw = $('#cPhone').value.replace(/\D/g, ''), phone = raw.length === 12 && raw.indexOf('91') === 0 ? raw.slice(2) : raw, err = $('#cErr');
        function fail(m) { err.textContent = m; err.hidden = false; }
        if (!name) return fail(T('Please enter a name.', 'ದಯವಿಟ್ಟು ಹೆಸರು ನಮೂದಿಸಿ.'));
        if (!/^[6-9]\d{9}$/.test(phone)) return fail(T('Please enter a valid 10-digit mobile number.', 'ಸರಿಯಾದ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ನಂಬರ್ ನಮೂದಿಸಿ.'));
        if (!$('#cOk').checked) return fail(T('Please tick the consent box to continue.', 'ಮುಂದುವರಿಯಲು ಒಪ್ಪಿಗೆ ಬಾಕ್ಸ್ ಟಿಕ್ ಮಾಡಿ.'));
        S.ans.contactName = name; S.ans.phone = phone; S.done = true; S.lang = LANG; save(); step(5); addXp('c-done', 60);
        me(name + ' · ' + phone.replace(/(\d{5})(\d{5})/, '$1 $2'));
        foot.innerHTML = '';
        sendLead(); track('generate_lead', { form: 'chat', who: S.ans.who, cls: S.ans.cls });
        showDone(true);
      });
      if (matchMedia('(pointer: fine)').matches) $('#cName').focus({ preventScroll: true });
    }
    function sendLead() {
      if (!window.BTLead) return;
      var a = S.ans;
      window.BTLead({
        company: (a.who === 'student' ? 'Student' : 'Parent') + ' · Class ' + a.cls + ' · ' + String(a.board).toUpperCase(),
        lastName: a.contactName, mobile: '+91' + a.phone, source: 'Chat',
        description: ['Website chat (' + (LANG === 'kn' ? 'Kannada' : 'English') + ')', 'Who: ' + a.who, 'Class: ' + a.cls, 'Board: ' + a.board, 'Goal: ' + a.goal, 'Consent: WhatsApp updates, yes'].join('\n')
      }).catch(function () {});
    }
    function showDone(fresh) {
      var my = ++run; if (!fresh) { body.innerHTML = ''; } step(5);
      var r = rec(S.ans.goal);
      say(T('🎁 <b>Module 0 is unlocked!</b> Your child can start now. I recommend <b>Module ' + r[0] + ': ' + r[1] + '</b> next.', '🎁 <b>ಮಾಡ್ಯೂಲ್ 0 ತೆರೆದಿದೆ!</b> ನಿಮ್ಮ ಮಗು ಈಗಲೇ ಆರಂಭಿಸಬಹುದು. ಮುಂದೆ <b>ಮಾಡ್ಯೂಲ್ ' + r[0] + ': ' + r[1] + '</b> ಸೂಕ್ತ.'), my)
        .then(function () { return say(T('Enroll now to get all 6 modules at the founding price of <b>' + inr(price) + '</b> (' + inr(list) + ' after Batch 1). 7-day full refund.', 'ಸ್ಥಾಪಕ ಬೆಲೆ <b>' + inr(price) + '</b>ಗೆ ಎಲ್ಲಾ 6 ಮಾಡ್ಯೂಲ್ ಪಡೆಯಲು ಈಗಲೇ ದಾಖಲಾಗಿ (ಬ್ಯಾಚ್ 1 ನಂತರ ' + inr(list) + '). 7 ದಿನದಲ್ಲಿ ಪೂರ್ಣ ಹಣ ವಾಪಸ್.'), my); })
        .then(function () {
          if (my !== run) return;
          foot.innerHTML = '<div class="done-acts"><a class="btn shine enroll" data-enroll href="#offer">' + T('Enroll now · ', 'ಈಗಲೇ ದಾಖಲಾಗಿ · ') + inr(price) + '</a><a class="btn ghost" href="/module-0">' + T('Start Module 0 free →', 'ಮಾಡ್ಯೂಲ್ 0 ಉಚಿತವಾಗಿ ಆರಂಭಿಸಿ →') + '</a></div><button class="restart" type="button" id="restart">' + T('Start over', 'ಮತ್ತೆ ಆರಂಭಿಸಿ') + '</button>';
          $('#restart').addEventListener('click', function () { S.done = false; S.ans = {}; save(); start(); });
        });
    }
    return { start: start, restart: start, showDone: function () { showDone(false); } };
  })();

  /* ── Welcome popup: the chat opens inside it on first visit ── */
  var welcome = $('#welcome'), chatEl = $('#chat'), home = chatEl.parentNode, homeNext = chatEl.nextSibling;
  function openWelcome() {
    $('#wSlot').appendChild(chatEl); welcome.hidden = false; document.documentElement.classList.add('w-open');
    setTimeout(function () { welcome.classList.add('in'); }, 10); track('welcome_open');
  }
  function closeWelcome(why) {
    if (welcome.hidden) return;
    welcome.classList.remove('in'); document.documentElement.classList.remove('w-open');
    setTimeout(function () { welcome.hidden = true; home.insertBefore(chatEl, homeNext); }, reduced ? 0 : 250);
    try { sessionStorage.setItem('bt_welcome', '1'); } catch (e) {}
    track('welcome_close', { why: why });
  }
  window.BTCloseWelcome = closeWelcome;
  $('#wClose').addEventListener('click', function () { closeWelcome('x'); });
  $('#wSkip').addEventListener('click', function () { closeWelcome('skip'); $('#offer').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); });
  welcome.addEventListener('click', function (e) { if (e.target === welcome) closeWelcome('backdrop'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeWelcome('esc'); });
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('#welcome [data-enroll], #welcome a[href^="/module-0"]')) closeWelcome('cta'); }, true);

  /* ── Boot ── */
  $('#yr').textContent = new Date().getFullYear();
  applyLang(LANG);
  var seen = false; try { seen = !!sessionStorage.getItem('bt_welcome'); } catch (e) {}
  if (!S.done && !seen) openWelcome();
  chat.start();
})();
