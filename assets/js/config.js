/* ─────────────────────────────────────────────────────────────
   BEYOND TATVA · SITE SETTINGS
   This is the only file you need to edit. Save, push, done.
   ───────────────────────────────────────────────────────────── */
window.BT_CONFIG = {
  // Razorpay payment page every "Enroll" button goes to.
  checkoutUrl: 'https://rzp.io/rzp/beyondtatva',

  // Your WhatsApp number with country code, digits only, e.g. '919876543210'.
  // While empty, WhatsApp buttons stay hidden (so no one hits a dead number).
  whatsapp: '',

  // Contact email shown in the footer. Leave empty to hide it.
  email: 'hello@beyondtatva.in',

  // Where chat answers and form submissions go. Create a free form at
  // formspree.io and paste its URL here, e.g. 'https://formspree.io/f/abcdwxyz'.
  // IMPORTANT: until this is set, parents' chat answers are NOT sent to you.
  formEndpoint: '',

  // Real Batch 1 enrolments. Leave null to hide the seats bar.
  seatsTotal: 75,
  seatsTaken: null,

  // Real date the founding price ends, e.g. '2026-10-31T23:59:59+05:30'. null hides it.
  priceDeadline: null,

  // Google Analytics 4 measurement ID, e.g. 'G-XXXXXXX'. Leave empty to disable.
  ga4: ''
};
