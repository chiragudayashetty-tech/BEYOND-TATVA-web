/* Local checks for the payment API: node api/_test.js  (reads keys from .env) */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
try { fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8').split('\n').forEach(l => { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim(); }); } catch (e) {}
const createOrder = require('./create-order'), verify = require('./verify-payment');
function call(h, method, body) {
  return new Promise(done => { const res = { headers: {}, statusCode: 200, setHeader(k, v) { this.headers[k] = v; }, end(s) { done({ status: this.statusCode, body: JSON.parse(s) }); } }; h({ method, body }, res); });
}
let fails = 0; const ok = (name, cond, got) => { console.log((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : ' → ' + JSON.stringify(got))); if (!cond) fails++; };
(async () => {
  const realFetch = global.fetch;
  // create-order: success (mocked Razorpay)
  let sent;
  global.fetch = async (url, opt) => { sent = { url, opt }; return { ok: true, status: 200, json: async () => ({ id: 'order_TEST123', amount: JSON.parse(opt.body).amount, currency: 'INR' }) }; };
  let r = await call(createOrder, 'POST', { name: 'Priya', phone: '9845012345', amount: 1 });
  ok('create-order returns order', r.status === 200 && r.body.order_id === 'order_TEST123' && r.body.key_id === process.env.RAZORPAY_KEY_ID, r);
  ok('amount set by server, ignores client amount', JSON.parse(sent.opt.body).amount === parseInt(process.env.COURSE_PRICE_PAISE || '79900', 10), JSON.parse(sent.opt.body));
  ok('calls Razorpay orders API with basic auth', sent.url === 'https://api.razorpay.com/v1/orders' && /^Basic /.test(sent.opt.headers.Authorization), sent.url);
  ok('secret not in response', !JSON.stringify(r.body).includes(process.env.RAZORPAY_KEY_SECRET), r.body);
  global.fetch = async () => ({ ok: false, status: 401, json: async () => ({ error: { description: 'Authentication failed' } }) });
  r = await call(createOrder, 'POST', {}); ok('auth failure → 401', r.status === 401, r);
  global.fetch = async () => ({ ok: false, status: 400, json: async () => ({ error: { description: 'bad' } }) });
  r = await call(createOrder, 'POST', {}); ok('Razorpay error → 500', r.status === 500, r);
  global.fetch = async () => { throw new Error('net'); };
  r = await call(createOrder, 'POST', {}); ok('network error → 500', r.status === 500, r);
  const p0 = process.env.COURSE_PRICE_PAISE; process.env.COURSE_PRICE_PAISE = '50';
  r = await call(createOrder, 'POST', {}); ok('price < 100 paise rejected', r.status === 500, r); process.env.COURSE_PRICE_PAISE = p0 || '79900';
  r = await call(createOrder, 'GET', {}); ok('GET → 405', r.status === 405, r);
  global.fetch = realFetch;
  // verify-payment
  const sig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update('order_A|pay_B').digest('hex');
  r = await call(verify, 'POST', { razorpay_order_id: 'order_A', razorpay_payment_id: 'pay_B', razorpay_signature: sig }); ok('valid signature → 200 verified', r.status === 200 && r.body.verified === true, r);
  r = await call(verify, 'POST', { razorpay_order_id: 'order_A', razorpay_payment_id: 'pay_B', razorpay_signature: sig.replace(/.$/, c => c === '0' ? '1' : '0') }); ok('tampered signature → 400', r.status === 400 && r.body.verified === false, r);
  r = await call(verify, 'POST', { razorpay_order_id: 'order_A', razorpay_payment_id: 'pay_X', razorpay_signature: sig }); ok('signature for other payment → 400', r.status === 400, r);
  r = await call(verify, 'POST', { razorpay_order_id: 'order_A' }); ok('missing fields → 400', r.status === 400, r);
  r = await call(verify, 'POST', '{"razorpay_order_id":"order_A","razorpay_payment_id":"pay_B","razorpay_signature":"' + sig + '"}'); ok('string JSON body accepted', r.status === 200, r);
  console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
})();
