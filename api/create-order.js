/* POST /api/create-order → { order_id, amount, currency, key_id }
   The price comes from the server (COURSE_PRICE_PAISE), never from the browser. */
const { creds, readBody, send } = require('./_razorpay');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, { error: 'Method not allowed' }); }
  let c;
  try { c = creds(); } catch (e) { return send(res, 500, { error: e.message }); }

  const amount = parseInt(process.env.COURSE_PRICE_PAISE || '79900', 10);
  if (!Number.isInteger(amount) || amount < 100) return send(res, 500, { error: 'Course price must be at least 100 paise' });

  const body = readBody(req);
  const clean = v => String(v || '').replace(/[^\p{L}\p{N} .,+@-]/gu, '').slice(0, 80);
  const payload = {
    amount, currency: 'INR',
    receipt: 'bt_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    notes: { course: 'Beyond Tatva AI Course', name: clean(body.name), phone: clean(body.phone), source: clean(body.source) || 'website' }
  };

  try {
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(c.id + ':' + c.secret).toString('base64') },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    if (r.status === 401) return send(res, 401, { error: 'Razorpay authentication failed. Check the API keys.' });
    if (!r.ok) return send(res, 500, { error: (data.error && data.error.description) || 'Could not create the order' });
    return send(res, 200, { order_id: data.id, amount: data.amount, currency: data.currency, key_id: c.id });
  } catch (e) {
    return send(res, 500, { error: 'Could not reach Razorpay. Please try again.' });
  }
};
