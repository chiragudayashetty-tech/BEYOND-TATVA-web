/* Beyond Tatva · Razorpay Standard Checkout.
   Any [data-enroll] click → /api/create-order → Razorpay modal → /api/verify-payment.
   If the API is unavailable, a message offers retry or WhatsApp. */
(function () {
  'use strict';
  var busy = false;
  function kn() { return document.documentElement.lang === 'kn'; }
  function t(en, k) { return kn() ? k : en; }
  function track(n, p) { if (window.gtag) gtag('event', n, p || {}); }
  function state() { try { return JSON.parse(localStorage.getItem('bt_v3')) || {}; } catch (e) { return {}; } }

  function loadScript() {
    if (window.Razorpay) return Promise.resolve();
    return new Promise(function (ok, fail) {
      var s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = ok; s.onerror = function () { fail(new Error('script')); }; document.head.appendChild(s);
    });
  }
  function post(url, data) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) { var e = new Error(j.error || 'HTTP ' + r.status); e.status = r.status; throw e; } return j; }); });
  }

  /* Small result dialog */
  function dialog(kind, title, text, actions) {
    var old = document.getElementById('payDlg'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'payDlg'; d.className = 'pay-dlg ' + kind; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
    d.innerHTML = '<div class="pay-in"><div class="pay-ic">' + (kind === 'ok' ? '🎉' : kind === 'wait' ? '⏳' : '⚠️') + '</div><h3></h3><p></p><div class="pay-act"></div></div>';
    d.querySelector('h3').textContent = title; d.querySelector('p').textContent = text;
    (actions || []).forEach(function (a) {
      var b = document.createElement(a.href ? 'a' : 'button'); b.className = 'btn ' + (a.primary ? 'btn-gold' : 'btn-ghost') + ' btn-block'; b.textContent = a.label;
      if (a.href) b.href = a.href; else { b.type = 'button'; b.addEventListener('click', function () { d.remove(); if (a.fn) a.fn(); }); }
      d.querySelector('.pay-act').appendChild(b);
    });
    d.addEventListener('click', function (e) { if (e.target === d && kind !== 'wait') d.remove(); });
    document.body.appendChild(d); return d;
  }
  function wa() { var n = ((window.BT_CONFIG || {}).whatsapp || '').replace(/\D/g, ''); return n ? 'https://wa.me/' + n : ''; }

  function start(link) {
    if (busy) return; busy = true;
    var s = state(), a = s.ans || {};
    var waiting = dialog('wait', t('Opening secure checkout…', 'ಸುರಕ್ಷಿತ ಪಾವತಿ ತೆರೆಯುತ್ತಿದೆ…'), t('Powered by Razorpay. UPI, cards and net banking.', 'Razorpay ಮೂಲಕ. UPI, ಕಾರ್ಡ್, ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್.'));
    track('begin_checkout', { value: 799, currency: 'INR' });
    Promise.all([post('/api/create-order', { name: a.contactName || '', phone: a.phone || '', source: 'website' }), loadScript()])
      .then(function (r) {
        var o = r[0]; waiting.remove();
        var rz = new window.Razorpay({
          key: o.key_id, order_id: o.order_id, amount: o.amount, currency: o.currency,
          name: 'Beyond Tatva', description: t('AI Course · Founding batch', 'AI ಕೋರ್ಸ್ · ಸ್ಥಾಪಕ ಬ್ಯಾಚ್'), image: location.origin + '/assets/img/logo.webp',
          prefill: { name: a.contactName || '', contact: a.phone ? '+91' + a.phone : '' },
          notes: { child: a.name || '', class: a.cls || '' },
          theme: { color: getComputedStyle(document.documentElement).getPropertyValue('--blue').trim() || '#3B5BFF' },
          modal: { ondismiss: function () { busy = false; dialog('err', t('Payment cancelled', 'ಪಾವತಿ ರದ್ದಾಗಿದೆ'), t('No money was taken. You can try again any time.', 'ಯಾವುದೇ ಹಣ ಕಡಿತವಾಗಿಲ್ಲ. ಯಾವಾಗ ಬೇಕಾದರೂ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'), [{ label: t('Try again', 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ'), primary: true, fn: function () { start(link); } }, { label: t('Close', 'ಮುಚ್ಚಿ') }]); track('checkout_dismissed'); } },
          handler: function (resp) {
            var v = dialog('wait', t('Confirming your payment…', 'ಪಾವತಿ ದೃಢೀಕರಿಸುತ್ತಿದೆ…'), t('Please don\'t close this page.', 'ದಯವಿಟ್ಟು ಈ ಪುಟ ಮುಚ್ಚಬೇಡಿ.'));
            post('/api/verify-payment', { razorpay_order_id: resp.razorpay_order_id, razorpay_payment_id: resp.razorpay_payment_id, razorpay_signature: resp.razorpay_signature })
              .then(function () {
                v.remove(); busy = false;
                try { var st = state(); st.paid = { id: resp.razorpay_payment_id, at: Date.now() }; localStorage.setItem('bt_v3', JSON.stringify(st)); } catch (e) {}
                track('purchase', { transaction_id: resp.razorpay_payment_id, value: o.amount / 100, currency: o.currency });
                var acts = [{ label: t('Start Module 0 now', 'ಮಾಡ್ಯೂಲ್ 0 ಈಗ ಆರಂಭಿಸಿ'), href: '/module-0', primary: true }];
                if (wa()) acts.push({ label: t('Message us on WhatsApp', 'WhatsApp ನಲ್ಲಿ ಸಂದೇಶ ಕಳುಹಿಸಿ'), href: wa() + '?text=' + encodeURIComponent('Hi! I just enrolled. Payment ID: ' + resp.razorpay_payment_id) });
                dialog('ok', t('You\'re enrolled! 🎉', 'ನೀವು ದಾಖಲಾಗಿದ್ದೀರಿ! 🎉'), t('Payment ID: ', 'ಪಾವತಿ ID: ') + resp.razorpay_payment_id + '. ' + t('We\'ll WhatsApp you the batch details within 24 hours.', '24 ಗಂಟೆಗಳಲ್ಲಿ ಬ್ಯಾಚ್ ವಿವರಗಳನ್ನು WhatsApp ಮಾಡುತ್ತೇವೆ.'), acts);
              })
              .catch(function () {
                v.remove(); busy = false;
                dialog('err', t('We couldn\'t confirm the payment', 'ಪಾವತಿ ದೃಢೀಕರಿಸಲು ಆಗಲಿಲ್ಲ'), t('If money was deducted, don\'t worry: send us your payment ID ', 'ಹಣ ಕಡಿತವಾಗಿದ್ದರೆ ಚಿಂತಿಸಬೇಡಿ: ಈ ಪಾವತಿ ID ಕಳುಹಿಸಿ ') + resp.razorpay_payment_id + t(' and we\'ll sort it out.', '. ನಾವು ಸರಿಪಡಿಸುತ್ತೇವೆ.'), wa() ? [{ label: 'WhatsApp', href: wa() + '?text=' + encodeURIComponent('Payment check needed. Payment ID: ' + resp.razorpay_payment_id), primary: true }] : [{ label: t('Close', 'ಮುಚ್ಚಿ') }]);
              });
          }
        });
        rz.on('payment.failed', function (r2) {
          var msg = (r2 && r2.error && r2.error.description) || '';
          track('payment_failed', { reason: (r2 && r2.error && r2.error.reason) || '' });
          // Razorpay keeps its modal open so the user can retry; show the reason beneath it.
          var d = dialog('err', t('Payment failed', 'ಪಾವತಿ ವಿಫಲವಾಗಿದೆ'), (msg ? msg + ' ' : '') + t('No money was taken. Try another method in the payment window.', 'ಹಣ ಕಡಿತವಾಗಿಲ್ಲ. ಪಾವತಿ ಕಿಟಕಿಯಲ್ಲಿ ಬೇರೆ ವಿಧಾನ ಪ್ರಯತ್ನಿಸಿ.'), [{ label: 'OK' }]);
          d.style.zIndex = 9; setTimeout(function () { d.remove(); }, 6000);
        });
        rz.open();
      })
      .catch(function (err) {
        waiting.remove(); busy = false;
        if (window.console) console.warn('[Beyond Tatva] checkout error:', err && err.message);
        var acts = [{ label: t('Try again', 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ'), primary: true, fn: function () { start(link); } }];
        if (wa()) acts.push({ label: t('Enrol on WhatsApp instead', 'WhatsApp ಮೂಲಕ ದಾಖಲಾಗಿ'), href: wa() + '?text=' + encodeURIComponent('Hi! I want to enrol in the Beyond Tatva AI course (₹799).') });
        var dd = dialog('err', t('Checkout didn\'t open', 'ಪಾವತಿ ತೆರೆಯಲಿಲ್ಲ'), t('Please try again in a minute, or message us on WhatsApp and we\'ll send you a secure payment link.', 'ಒಂದು ನಿಮಿಷದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ, ಅಥವಾ WhatsApp ಮಾಡಿ, ನಾವು ಸುರಕ್ಷಿತ ಪಾವತಿ ಲಿಂಕ್ ಕಳುಹಿಸುತ್ತೇವೆ.'), acts);
        var det = document.createElement('small'); det.className = 'pay-det'; det.textContent = 'Details: ' + ((err && (err.status ? err.status + ' · ' : '') + err.message) || 'unknown'); dd.querySelector('.pay-in').appendChild(det);
      });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-enroll]');
    if (!a || e.metaKey || e.ctrlKey) return;
    e.preventDefault(); e.stopImmediatePropagation();
    start(a);
  }, true);
})();
