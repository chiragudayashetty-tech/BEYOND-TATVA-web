/* ─────────────────────────────────────────────────────────────
   BEYOND TATVA · SITE SETTINGS
   This is the only file you need to edit. Save, push, done.
   ───────────────────────────────────────────────────────────── */
window.BT_CONFIG = {
  // Fallback Razorpay payment page, used only if /api/create-order is unavailable.
  // Normal checkout opens the Razorpay modal via /api (keys live in Vercel env vars).
  checkoutUrl: '',

  // Your WhatsApp number with country code, digits only, e.g. '919876543210'.
  // While empty, WhatsApp buttons stay hidden (so no one hits a dead number).
  whatsapp: '917337645448',

  // Contact email shown in the footer. Leave empty to hide it.
  email: 'chiragshetty@beyondtatva.in',

  // Leads go into Zoho CRM (Leads module). Settings live in assets/js/lead.js.

  // Real Batch 1 enrolments. Leave null to hide the seats bar.
  seatsTotal: 75,
  seatsTaken: null,

  // Real date the founding price ends, e.g. '2026-10-31T23:59:59+05:30'. null hides it.
  priceDeadline: null,

  // Google Analytics 4 measurement ID, e.g. 'G-XXXXXXX'. Leave empty to disable.
  ga4: 'G-C98KFTE0PD'
};
