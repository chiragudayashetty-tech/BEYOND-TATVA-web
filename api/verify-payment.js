/* POST /api/verify-payment { razorpay_order_id, razorpay_payment_id, razorpay_signature }
   200 { verified: true } only when the signature matches; otherwise 400. */
const { creds, readBody, send, signatureValid } = require('./_razorpay');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, { error: 'Method not allowed' }); }
  let c;
  try { c = creds(); } catch (e) { return send(res, 500, { error: e.message }); }

  const { razorpay_order_id: o, razorpay_payment_id: p, razorpay_signature: s } = readBody(req);
  if (!o || !p || !s) return send(res, 400, { verified: false, error: 'Missing payment details' });
  if (!signatureValid(o, p, s, c.secret)) return send(res, 400, { verified: false, error: 'Payment signature mismatch' });
  return send(res, 200, { verified: true, order_id: o, payment_id: p });
};
