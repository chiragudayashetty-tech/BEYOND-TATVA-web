/* GET /api/health → shows whether payments are configured (never reveals the secret). */
const { send } = require('./_razorpay');
const crypto = require('crypto');
module.exports = function handler(req, res) {
  const id = process.env.RAZORPAY_KEY_ID || '', secret = process.env.RAZORPAY_KEY_SECRET || '';
  send(res, 200, {
    api: 'ok',
    key_id_set: !!id, key_id_looks_valid: /^rzp_(test|live)_[A-Za-z0-9]+$/.test(id.trim()), key_id_has_spaces: id !== id.trim(),
    mode: /^rzp_live_/.test(id) ? 'live' : /^rzp_test_/.test(id) ? 'test' : 'unknown',
    key_id: id.trim(), // public by design (it is sent to the browser at checkout)
    secret_length: secret.trim().length, secret_check: secret ? crypto.createHash('sha256').update(secret.trim()).digest('hex').slice(0, 6) : '',
    key_secret_set: !!secret, key_secret_has_spaces: secret !== secret.trim(),
    price_paise: parseInt(process.env.COURSE_PRICE_PAISE || '79900', 10)
  });
};
