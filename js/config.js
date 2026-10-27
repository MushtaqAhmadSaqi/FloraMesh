/**
 * FloraMesh Global Configuration (js/config.js)
 * Central single-source-of-truth for shipping, gifting, themes, and demo state.
 */
(function () {
  'use strict';

  window.FLORAMESH_CONFIG = {
    // When true, displays a single slim, tasteful notice ONLY on checkout, account, and contact forms.
    // Set to false when connecting to a production WordPress/WooCommerce backend.
    demoMode: true,

    // Pricing & Delivery Rules (PKR)
    shipping: {
      freeThreshold: 10000, // Free twin-city delivery threshold
      flatRate: 450         // Standard delivery fee for orders below threshold
    },

    // Gifting Add-on (PKR)
    gifting: {
      wrapFee: 350 // Artisan reed-and-kraft gift wrap with handwritten note
    },

    // Contact & Channels
    contact: {
      // Direct WhatsApp customer ordering number
      whatsappNumber: '923005551234',
      email: 'hello@floramesh.pk',
      hours: 'Monday – Saturday, 9:00 AM – 6:00 PM PKT',
      serviceArea: 'Islamabad & Rawalpindi'
    },

    // Standardized Delivery Timelines (QA-18)
    delivery: {
      standard: '48–72 hours across Islamabad & Rawalpindi',
      courier: '3–5 business days nationwide courier',
      schedule: 'Monday – Saturday crew dispatch'
    },

    // Legal Metadata (QA-34)
    legal: {
      lastUpdated: 'October 24, 2026'
    },

    // Storage Keys (Must match existing keys to preserve state)
    storageKeys: {
      cart: 'floramesh_demo_cart_v1',
      gift: 'floramesh_demo_gift_v1',
      wishlist: 'floramesh_demo_wishlist_v1',
      recent: 'floramesh_recently_viewed_v1',
      theme: 'floramesh_theme_v1',
      announcementDismissed: 'floramesh_announcement_dismissed_v1',
      orders: 'floramesh_orders_v1',
      compare: 'floramesh_compare_v1'
    }
  };
})();
