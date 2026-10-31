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
  whatsapp: '916361844418',

  // Contact email shown in the footer. Leave empty to hide it.
  email: 'chiragshetty@beyondtatva.in',

  // Leads go into Zoho CRM (Leads module). Settings live in assets/js/lead.js.

  // Prices shown on the page (the amount actually charged is set on the server).
  price: 799,
  listPrice: 2499,

  // REAL urgency only. Update these honestly; anything left null is hidden.
  // Founding batch size and how many seats are already taken (update as people pay).
  seatsTotal: 75,
  seatsTaken: null,
  // Date the founding price ends, e.g. '2026-11-15T23:59:59+05:30'.
  priceDeadline: null,
  // Date Batch 1 starts, e.g. '2026-11-16'.
  batchStart: null,

  // Google Analytics 4 measurement ID, e.g. 'G-XXXXXXX'. Leave empty to disable.
  ga4: 'G-C98KFTE0PD'
};
