/* ─────────────────────────────────────────────────────────────
   BEYOND TATVA · SITE SETTINGS
   This is the only file you need to edit. Save, push, done.
   ───────────────────────────────────────────────────────────── */
window.BT_CONFIG = {
  // Razorpay payment page every "Enroll" button goes to.
  checkoutUrl: 'https://rzp.io/rzp/beyondtatva',

  // Your WhatsApp number with country code, digits only, e.g. '919876543210'.
  // While empty, WhatsApp buttons stay hidden (so no one hits a dead number).
  whatsapp: '916361844418',

  // Contact email shown in the footer. Leave empty to hide it.
  email: 'chiragshetty@beyondtatva.in',

  // Where chat answers and form submissions go (emailed via FormSubmit.co).
  // The very first submission sends an activation email to this inbox:
  // click "Activate Form" once, and every lead after that arrives by email.
  formEndpoint: 'https://formsubmit.co/ajax/chiragudayashetty@gmail.com',

  // Web3Forms access key (free, from web3forms.com). When set, it is used
  // instead of formEndpoint above. Paste the key between the quotes.
  web3formsKey: '',

  // Real Batch 1 enrolments. Leave null to hide the seats bar.
  seatsTotal: 75,
  seatsTaken: null,

  // Real date the founding price ends, e.g. '2026-10-31T23:59:59+05:30'. null hides it.
  priceDeadline: null,

  // Google Analytics 4 measurement ID, e.g. 'G-XXXXXXX'. Leave empty to disable.
  ga4: ''
};
