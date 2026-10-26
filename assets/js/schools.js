/* Beyond Tatva · school programme page */
(function () {
  'use strict';
  var C = window.BT_CONFIG || {};
  var WA = (C.whatsapp || '916361844418').replace(/\D/g, '');
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add('in'); });

  // Booking form → form endpoint, else WhatsApp hand-off
  var form = document.getElementById('bookForm'), msg = document.getElementById('bookMsg');
  function show(ok, text) { msg.hidden = false; msg.className = 'full form-msg ' + (ok ? 'ok' : 'err'); msg.textContent = text; }
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var d = Object.fromEntries(new FormData(form));
    if (d._gotcha) return;
    var phone = String(d.phone || '').replace(/\D/g, '');
    if (phone.length === 12 && phone.indexOf('91') === 0) phone = phone.slice(2);
    if (!d.school.trim() || !d.principal.trim() || !d.town.trim()) return show(false, 'Please fill in the school name, principal name and town.');
    if (!/^[6-9]\d{9}$/.test(phone)) return show(false, 'Please enter a valid 10-digit mobile number.');
    var btn = form.querySelector('button[type=submit]'); btn.disabled = true;
    var lines = ['School workshop request', 'School: ' + d.school, 'Principal: ' + d.principal, 'Phone: ' + phone, 'Town: ' + d.town, 'Preferred date: ' + (d.date || 'flexible')];
    if (window.gtag) gtag('event', 'school_workshop_request', { town: d.town });
    if (C.formEndpoint) {
      try {
        var res = await fetch(C.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ _subject: 'School workshop request: ' + d.school, _template: 'table', _captcha: 'false', source: 'schools-page', school: d.school, principal: d.principal, phone: phone, town: d.town, date: d.date || '' }) });
        if (!res.ok) throw new Error(res.status);
        var j = await res.json().catch(function () { return {}; });
        if (String(j.success) === 'false') throw new Error(j.message || 'not sent');
        form.reset(); btn.disabled = false;
        return show(true, 'Thank you! We have your request and will call you within 24 hours.');
      } catch (err) { /* fall through to WhatsApp */ }
    }
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    btn.disabled = false;
    show(true, 'WhatsApp is opening with your details filled in. Just press send and we will reply within 24 hours.');
  });
})();
