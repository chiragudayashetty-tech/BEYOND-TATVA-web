/* Shared helpers for the Razorpay API routes (files starting with _ are not routes on Vercel). */
const crypto = require('crypto');

function creds() {
  const id = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) { const e = new Error('Razorpay keys are not configured on the server'); e.status = 500; throw e; }
  return { id, secret };
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  return {};
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

/* HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET), compared in constant time. */
function signatureValid(orderId, paymentId, signature, secret) {
  const expected = crypto.createHmac('sha256', secret).update(orderId + '|' + paymentId).digest('hex');
  const a = Buffer.from(expected), b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = { creds, readBody, send, signatureValid };
