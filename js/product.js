/**
 * FloraMesh Single Product Page Controller (js/product.js)
 * Features:
 * - Semantic <details>/<summary> accordions (Zero desync bug)
 * - Dynamic per-variant compare-at strike-through pricing
 * - Type-aware stock and booking availability pills
 * - Quantity stepper with stock clamping
 * - Button state machine (adding spinner -> success check for 1.2s -> idle)
 * - Honest local reviews empty state (No fake stars)
 * - Desktop sticky buy box & sticky section navigation anchor bar
 * - Lightbox integration with FloraMeshGallery
 * 100% file:// compatible, zero external dependencies.
 */
(function () {
  'use strict';

  var cfg = window.FLORAMESH_CONFIG || {};
  var RECENT_KEY = (cfg.storageKeys && cfg.storageKeys.recent) || 'floramesh_recently_viewed_v1';
  var shippingRules = cfg.shipping || { freeThreshold: 10000, flatRate: 450 };

  function recordRecentlyViewed(slug) {
    if (!slug || typeof slug !== 'string') return;
    try {
      var raw = localStorage.getItem(RECENT_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      var list = Array.isArray(parsed) ? parsed.filter(function (s) { return typeof s === 'string' && s.length > 0; }) : [];
      list = [slug].concat(list.filter(function (s) { return s !== slug; })).slice(0, 6);
      localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function getRecentlyViewed(excludeSlug) {
    try {
      var raw = localStorage.getItem(RECENT_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      var list = Array.isArray(parsed) ? parsed.filter(function (s) { return typeof s === 'string' && s.length > 0; }) : [];
      return list.filter(function (s) { return s !== excludeSlug; });
    } catch (e) {
      return [];
    }
  }

  function initProductPage() {
    var mount = document.getElementById('pdp-mount');
    if (!mount) return;

    var params = new URLSearchParams(window.location.search);
    var rawSlug = params.get('slug') || 'apartment-balcony-green-oasis-package';
    var slug = String(rawSlug).replace(/[^a-zA-Z0-9\-_]/g, '');
    var products = window.FLORAMESH_PRODUCTS || [];
    var product = products.find(function (p) { return p.slug === slug; }) || products[0];
    if (!product) return;

    recordRecentlyViewed(product.slug);
    document.title = (product.shortName || product.name) + ' | FloraMesh Pakistan';
    document.body.classList.add('has-sticky-bar');

    var utils = window.FloraMeshUtils || {};
    var escape = utils.escapeHTML || function (s) { return s; };
    var escapeA = utils.escapeAttr || function (s) { return s; };
    var getIcon = utils.getIcon || function () { return ''; };
    var formatPKR = utils.formatPKR || function (v) { return 'Rs ' + v; };

    // Select first available variant
    var selectedVariant = (product.variants || []).find(function (v) { return v.available !== false && v.stock > 0; }) ||
                          (product.variants && product.variants[0]) ||
                          { id: 'default', name: 'Standard', price: product.salePrice || product.price, stock: 15, available: true };

    var currentQty = 1;

    // Clean unit value label
    var cleanUnitLabel = (product.unitPriceLabel || '').replace(/\s*\[.*?\]\s*/g, '').trim();

    // Clean specifications
    var cleanMaterials = (product.materials || '').replace(/\s*\[.*?\]\s*/g, '').trim();
    var cleanDimensions = (product.dimensions || '').replace(/\s*\[.*?\]\s*/g, '').trim();

    // Thumbnails
    var thumbsHtml = (product.images || []).map(function (img, i) {
      return '<button type="button" class="pdp__thumb ' + (i === 0 ? 'is-active' : '') + '" data-thumb-idx="' + i + '" aria-current="' + (i === 0 ? 'true' : 'false') + '" aria-label="View image ' + (i + 1) + '">' +
        '<img src="' + escapeA(img.src) + '" alt="' + escapeA(img.alt) + '" width="72" height="90" loading="lazy">' +
        '</button>';
    }).join('');

    // Variants Buttons
    var variantsHtml = (product.variants || []).map(function (v) {
      var isSoldOut = v.available === false || v.stock === 0;
      var isSelected = v.id === selectedVariant.id;
      return '<button type="button" class="variant-btn ' + (isSelected ? 'is-selected' : '') + (isSoldOut ? ' is-sold-out' : '') + '" data-variant-id="' + escapeA(v.id) + '" ' + (isSoldOut ? 'disabled' : '') + '>' +
        escape(v.name) + ' — ' + formatPKR(v.price) + (isSoldOut ? ' (Sold out)' : '') +
        '</button>';
    }).join('');

    // Wearable size guide (Apron only, zero invented model specs)
    var sizeGuideHtml = (product.slug === 'urban-gardener-apron-tool-kit') ? [
      '<div class="card" style="margin-top:var(--space-4);background:var(--color-surface-alt);border:1px solid var(--color-border);padding:var(--space-4);border-radius:var(--radius-md);">' +
      '  <strong style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:var(--tracking-wide);color:var(--color-accent);display:block;margin-bottom:var(--space-2);">Field Canvas Apron Sizing</strong>' +
      '  <table style="width:100%;border-collapse:collapse;font-size:var(--text-xs);">' +
      '    <thead><tr style="border-bottom:1px solid var(--color-border);text-align:left;"><th style="padding:4px 0;">Size</th><th>Chest Strap</th><th>Canvas Length</th></tr></thead>' +
      '    <tbody>' +
      '      <tr><td style="padding:4px 0;">Standard Unisex</td><td>86–112 cm (Adjustable)</td><td>78 cm bib-to-hem</td></tr>' +
      '    </tbody>' +
      '  </table>' +
      '</div>'
    ].join('\n') : '';

    // Availability status badge
    function getStockBadge(stock) {
      if (product.type === 'service') {
        return '<span class="badge badge--success" style="background:var(--color-success-bg);color:var(--color-success);border:1px solid var(--color-success-border);padding:3px 8px;border-radius:var(--radius-pill);font-size:var(--text-xs);">Booking Open • Twin Cities</span>';
      }
      if (product.type === 'donation') {
        return '<span class="badge badge--success" style="background:var(--color-success-bg);color:var(--color-success);border:1px solid var(--color-success-border);padding:3px 8px;border-radius:var(--radius-pill);font-size:var(--text-xs);">Geo-Tagged Tree Slot</span>';
      }
      if (product.type === 'digital') {
        return '<span class="badge badge--success" style="background:var(--color-success-bg);color:var(--color-success);border:1px solid var(--color-success-border);padding:3px 8px;border-radius:var(--radius-pill);font-size:var(--text-xs);">Instant Access</span>';
      }

      if (stock === 0) {
        return '<span class="badge badge--danger" style="background:var(--color-danger-bg);color:var(--color-danger);border:1px solid var(--color-danger-border);padding:3px 8px;border-radius:var(--radius-pill);font-size:var(--text-xs);">Sold out</span>';
      } else if (stock <= 5) {
        return '<span class="badge badge--warning" style="background:var(--color-warning-bg);color:var(--color-warning);border:1px solid var(--color-warning-border);padding:3px 8px;border-radius:var(--radius-pill);font-size:var(--text-xs);">Only ' + stock + ' left</span>';
      }
      return '<span class="badge badge--success" style="background:var(--color-success-bg);color:var(--color-success);border:1px solid var(--color-success-border);padding:3px 8px;border-radius:var(--radius-pill);font-size:var(--text-xs);">In stock</span>';
    }

    function calculateOrderTotals() {
      var price = selectedVariant.price;
      var sub = price * currentQty;
      var isExempt = product.type === 'digital' || product.type === 'donation';
      var ship = isExempt ? 0 : ((sub >= shippingRules.freeThreshold) ? 0 : shippingRules.flatRate);
      var total = sub + ship;
      return {
        unitPrice: price,
        subtotal: sub,
        shippingFee: ship,
        total: total
      };
    }

    var initialTotals = calculateOrderTotals();
    var saved = window.FloraMeshWishlist && window.FloraMeshWishlist.has(product.slug);

    var compareAt = selectedVariant.compareAtPrice || product.compareAtPrice;
    var hasDiscount = compareAt && compareAt > selectedVariant.price;
    var savingsAmt = hasDiscount ? (compareAt - selectedVariant.price) : 0;
    var savingsPct = hasDiscount ? Math.round((savingsAmt / compareAt) * 100) : 0;

    mount.innerHTML = [
      '<nav class="pdp__breadcrumb" aria-label="Breadcrumb">',
      '  <ol>',
      '    <li><a href="index.html">Home</a></li>',
      '    <li><a href="shop.html?category=' + escapeA(product.categorySlug) + '">' + escape(product.category) + '</a></li>',
      '    <li aria-current="page"><strong>' + escape(product.shortName || product.name) + '</strong></li>',
      '  </ol>',
      '</nav>',
      '<!-- Sticky Anchor Nav Bar -->',
      '<nav class="pdp-anchor-bar" aria-label="Product Sections">',
      '  <a href="#pdp-overview" class="pdp-anchor-link is-active">Overview</a>',
      '  <a href="#pdp-specs" class="pdp-anchor-link">Specifications</a>',
      '  <a href="#pdp-delivery" class="pdp-anchor-link">Delivery &amp; Care</a>',
      '  <a href="#pdp-reviews" class="pdp-anchor-link">Customer Reviews</a>',
      '</nav>',
      '<div class="pdp__layout" id="pdp-overview">',
      '  <!-- Vertical Gallery & Main Stage -->',
      '  <div class="pdp__gallery">',
      '    <div class="pdp__gallery-main" style="background-color:' + (product.dominant || '#E8E2D8') + ';">',
      '      <img src="' + escapeA(product.images[0].src) + '" alt="' + escapeA(product.images[0].alt) + '" id="pdp-main-img" width="600" height="750">',
      '      <button type="button" class="btn btn-outline pdp__gallery-zoom-btn" id="pdp-zoom-btn" aria-label="Enlarge botanical photo">' + getIcon('search') + ' Enlarge</button>',
      '    </div>',
      '    <p id="pdp-main-caption" class="pdp-main-caption">' + escape(product.images[0].alt) + '</p>',
      '    <div class="pdp__gallery-thumbs">' + thumbsHtml + '</div>',
      '  </div>',
      '  <!-- Sticky Buy Box -->',
      '  <div class="pdp__summary">',
      '    <div class="section__eyebrow">' + escape(product.category) + ' &bull; SKU: ' + escape(product.sku) + '</div>',
      '    <h1 class="pdp__title">' + escape(product.name) + '</h1>',
      '    <div class="pdp__price-wrap">',
      '      <span id="pdp-live-price" class="pdp__price" style="font-variant-numeric:tabular-nums;">' + formatPKR(selectedVariant.price) + '</span>',
      '      <span id="pdp-compare-price" class="pdp__price-old" style="display:' + (hasDiscount ? 'inline' : 'none') + ';text-decoration:line-through;color:var(--color-text-muted);font-size:var(--text-lg);margin-left:var(--space-2);font-variant-numeric:tabular-nums;">' + (hasDiscount ? formatPKR(compareAt) : '') + '</span>',
      '      <span id="pdp-savings-badge" class="pdp__savings-badge" style="display:' + (hasDiscount ? 'inline-flex' : 'none') + ';">Save ' + formatPKR(savingsAmt) + ' (' + savingsPct + '% off)</span>',
      '      <span id="pdp-stock-pill" style="margin-left:var(--space-3);">' + getStockBadge(selectedVariant.stock) + '</span>',
      '    </div>',
      cleanUnitLabel ? '    <div class="pdp__unit-label" style="font-size:var(--text-xs);color:var(--color-link);margin-bottom:var(--space-3);">' + escape(cleanUnitLabel) + '</div>' : '',
      '    <p style="color:var(--color-text-muted);margin-bottom:var(--space-4);line-height:1.6;">' + escape(product.shortDescription) + '</p>',
      '    <!-- Variant Selector Group -->',
      (product.variants && product.variants.length > 1) ? [
        '    <div class="pdp__variants">',
        '      <label style="font-size:var(--text-sm);font-weight:var(--weight-bold);display:block;margin-bottom:var(--space-2);">Choose Option / Tier:</label>',
        '      <div class="variant-buttons" id="pdp-variant-group">' + variantsHtml + '</div>',
        '    </div>'
      ].join('\n') : '',
      sizeGuideHtml,
      '    <!-- Purchase Buy Box Controls -->',
      '    <div class="pdp__buybox" style="margin-top:var(--space-6);">',
      '      <div class="qty-stepper">',
      '        <button type="button" class="qty-stepper__btn" id="pdp-qty-dec" aria-label="Decrease quantity">' + getIcon('minus') + '</button>',
      '        <label for="pdp-qty" class="sr-only">Quantity</label>',
      '        <input type="number" id="pdp-qty" class="qty-stepper__input" value="1" min="1" max="20" aria-label="Quantity">',
      '        <button type="button" class="qty-stepper__btn" id="pdp-qty-inc" aria-label="Increase quantity">' + getIcon('plus') + '</button>',
      '      </div>',
      '      <button type="button" class="btn btn--primary" id="pdp-add-to-cart-btn" style="flex:1;">',
      '        ' + getIcon('cart') + ' <span id="pdp-btn-label">Add to Basket</span>',
      '      </button>',
      '      <button type="button" class="btn btn--outline" id="pdp-wishlist-btn" data-wishlist-slug="' + escapeA(product.slug) + '" aria-pressed="' + (saved ? 'true' : 'false') + '" aria-label="Save to wishlist">',
      saved ? getIcon('heartFilled') : getIcon('heart'),
      '      </button>',
      '    </div>',
      '    <div style="margin-top:var(--space-2);display:flex;gap:var(--space-2);">',
      '      <a href="#" id="pdp-whatsapp-btn" class="btn btn-outline" style="flex:1;display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);font-size:var(--text-xs);" target="_blank" rel="noopener noreferrer" aria-label="Order this product via WhatsApp">',
      getIcon('whatsapp'),
      '        <span>Direct WhatsApp Order</span>',
      '      </a>',
      '    </div>',
      '    <div style="margin-top:var(--space-2);">',
      '      <button type="button" class="btn btn-outline" id="pdp-diagnostic-btn" style="width:100%;font-size:var(--text-xs);padding:var(--space-2) var(--space-3);">',
      '        Ask Botanist About This Plant',
      '      </button>',
      '    </div>',
      '    <!-- Dynamic Order Estimate Box -->',
      '    <div class="pdp__estimate-box" style="margin-top:var(--space-6);padding:var(--space-4);background:var(--color-surface-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);">' +
      '      <div class="pdp__estimate-row" style="display:flex;justify-content:space-between;margin-bottom:var(--space-1);">' +
      '        <span style="color:var(--color-text-muted);">Delivery to Islamabad &amp; Rawalpindi</span>' +
      '        <strong id="pdp-shipping-est">' + (initialTotals.shippingFee === 0 ? '<span style="color:var(--color-success);">Free</span>' : formatPKR(initialTotals.shippingFee)) + '</strong>' +
      '      </div>' +
      '      <div class="pdp__estimate-row pdp__estimate-row--total" style="display:flex;justify-content:space-between;font-weight:var(--weight-bold);padding-top:var(--space-2);border-top:1px solid var(--color-border);">' +
      '        <span>Estimated total</span>' +
      '        <span id="pdp-total-est" style="font-variant-numeric:tabular-nums;">' + formatPKR(initialTotals.total) + '</span>' +
      '      </div>' +
      '      <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:var(--space-2);line-height:1.5;">' +
      '        Transit damage guarantee: report with photo within 48 hours for immediate dispatch. <a href="shipping-returns.html" style="text-decoration:underline;color:var(--color-link);">Policy details</a>.' +
      '      </p>' +
      '    </div>',
      '  </div>',
      '</div>',
      '<!-- Semantic HTML5 Details Accordions (Fixes QA-07 Desync Bug) -->',
      '<div class="pdp-accordions-wrap" id="pdp-specs" style="margin:var(--space-12) 0;">',
      '  <details class="pdp-details" open>',
      '    <summary class="pdp-summary"><span>Full Description &amp; Microclimate Fit</span> ' + getIcon('chevronDown') + '</summary>',
      '    <div class="pdp-panel"><p>' + escape(product.description) + '</p></div>',
      '  </details>',
      '  <details class="pdp-details">',
      '    <summary class="pdp-summary"><span>Materials, Dimensions &amp; Potohar Care</span> ' + getIcon('chevronDown') + '</summary>',
      '    <div class="pdp-panel">' +
      '      <p><strong>Materials:</strong> ' + escape(cleanMaterials) + '</p>' +
      '      <p style="margin-top:var(--space-2);"><strong>Dimensions:</strong> ' + escape(cleanDimensions) + '</p>' +
      '      <p style="margin-top:var(--space-2);"><strong>Care Instructions:</strong> ' + escape(product.care) + '</p>' +
      '    </div>',
      '  </details>',
      '  <details class="pdp-details">',
      '    <summary class="pdp-summary"><span>Craft &amp; Horticultural Story</span> ' + getIcon('chevronDown') + '</summary>',
      '    <div class="pdp-panel"><p>' + escape(product.makingStory) + '</p></div>',
      '  </details>',
      '  <details class="pdp-details" id="pdp-delivery">',
      '    <summary class="pdp-summary"><span>Twin-City Delivery &amp; Replacement Guarantee</span> ' + getIcon('chevronDown') + '</summary>',
      '    <div class="pdp-panel">' +
      '      <p>Live turnkey planting packages are installed by our dedicated field crew in Islamabad &amp; Rawalpindi. Courier packages ship nationwide in protective molded pulp packaging. Any transit damage is replaced free within 48 hours of photo confirmation.</p>' +
      '    </div>',
      '  </details>',
      '</div>',
      '<!-- Honest Verified Customer Reviews (Zero Manufactured Ratings) -->',
      '<section class="card" id="pdp-reviews" style="margin-bottom:var(--space-12);padding:var(--space-8);" aria-labelledby="pdp-reviews-heading">',
      '  <div class="section__header" style="margin-bottom:var(--space-4);">',
      '    <div>',
      '      <div class="section__eyebrow">Verified Local Feedback</div>',
      '      <h2 id="pdp-reviews-heading" style="font-family:var(--font-display);font-size:var(--text-2xl);">Customer Reviews</h2>',
      '    </div>',
      '  </div>',
      '  <div class="empty-state" style="padding:var(--space-8) var(--space-4);background:var(--color-surface-alt);border-radius:var(--radius-lg);text-align:center;">',
      '    <h3 class="empty-state__title" style="font-family:var(--font-display);font-size:var(--text-lg);margin-bottom:var(--space-2);">No published reviews yet</h3>',
      '    <p class="empty-state__desc" style="color:var(--color-text-muted);margin-bottom:var(--space-4);">Be the first homeowner in Islamabad or Rawalpindi to review this setup following your scheduled installation.</p>',
      '    <a href="contact.html?topic=review&product=' + escapeA(product.slug) + '" class="btn btn-outline" style="font-size:var(--text-xs);">Submit Feedback to Field Team</a>',
      '  </div>',
      '</section>',
      '<!-- Related Complementary Products -->',
      '<section style="margin-bottom:var(--space-12);">',
      '  <div class="section__header">',
      '    <div>',
      '      <div class="section__eyebrow">Botanical Pairing</div>',
      '      <h2 style="font-family:var(--font-display);font-size:var(--text-2xl);">Complementary Plants &amp; Hardware</h2>',
      '    </div>',
      '  </div>',
      '  <div class="grid-3" id="pdp-related-grid"></div>',
      '</section>',
      '<!-- Recently Viewed History -->',
      '<section style="margin-bottom:var(--space-12);" id="pdp-recent-section">',
      '  <div class="section__header">',
      '    <div>',
      '      <div class="section__eyebrow">Your History</div>',
      '      <h2 style="font-family:var(--font-display);font-size:var(--text-2xl);">Recently Viewed</h2>',
      '    </div>',
      '  </div>',
      '  <div class="grid-4" id="pdp-recent-grid"></div>',
      '</section>',
      '<!-- Mobile Sticky Bottom Add Bar -->',
      '<div class="mobile-sticky-bar" aria-label="Purchase summary bar">',
      '  <div>',
      '    <div style="font-size:var(--text-xs);color:var(--color-text-muted);">' + escape(product.shortName || product.name) + '</div>',
      '    <strong id="pdp-sticky-price" style="font-size:var(--text-base);color:var(--color-text);font-variant-numeric:tabular-nums;">' + formatPKR(selectedVariant.price) + '</strong>',
      '  </div>',
      '  <div style="display:flex;align-items:center;gap:var(--space-2);">',
      '    <a href="#" id="pdp-sticky-whatsapp-btn" class="btn btn--outline" target="_blank" rel="noopener noreferrer" aria-label="Order via WhatsApp" style="padding:var(--space-2) var(--space-3);display:inline-flex;align-items:center;justify-content:center;">' + getIcon('whatsapp') + '</a>',
      '    <button type="button" class="btn btn--primary" id="pdp-sticky-add-btn" style="padding:var(--space-2) var(--space-4);font-size:var(--text-xs);">Add to Basket</button>',
      '  </div>',
      '</div>'
    ].join('\n');

    // Init gallery & wishlist bindings
    if (window.FloraMeshGallery && window.FloraMeshGallery.initGallery) {
      window.FloraMeshGallery.initGallery(product.images);
    }
    if (window.FloraMeshWishlist && window.FloraMeshWishlist.updateWishlistUI) {
      window.FloraMeshWishlist.updateWishlistUI();
    }

    function updateOrderDisplay() {
      var totals = calculateOrderTotals();
      var livePriceEl = document.getElementById('pdp-live-price');
      var compareEl = document.getElementById('pdp-compare-price');
      var stickyPriceEl = document.getElementById('pdp-sticky-price');
      var shipEstEl = document.getElementById('pdp-shipping-est');
      var totalEstEl = document.getElementById('pdp-total-est');

      if (livePriceEl) livePriceEl.textContent = formatPKR(selectedVariant.price);
      if (stickyPriceEl) stickyPriceEl.textContent = formatPKR(selectedVariant.price);

      var variantCompare = selectedVariant.compareAtPrice || product.compareAtPrice;
      var savingsBadgeEl = document.getElementById('pdp-savings-badge');
      if (compareEl) {
        if (variantCompare && variantCompare > selectedVariant.price) {
          compareEl.textContent = formatPKR(variantCompare);
          compareEl.style.display = 'inline';
        } else {
          compareEl.style.display = 'none';
        }
      }

      if (savingsBadgeEl) {
        if (variantCompare && variantCompare > selectedVariant.price) {
          var savAmt = variantCompare - selectedVariant.price;
          var savPct = Math.round((savAmt / variantCompare) * 100);
          savingsBadgeEl.textContent = 'Save ' + formatPKR(savAmt) + ' (' + savPct + '% off)';
          savingsBadgeEl.style.display = 'inline-flex';
        } else {
          savingsBadgeEl.style.display = 'none';
        }
      }

      if (shipEstEl) {
        shipEstEl.innerHTML = (totals.shippingFee === 0) ? '<span style="color:var(--color-success);">Free</span>' : formatPKR(totals.shippingFee);
      }
      if (totalEstEl) totalEstEl.textContent = formatPKR(totals.total);

      // Synchronize WhatsApp Direct Order URL
      var waBtn = document.getElementById('pdp-whatsapp-btn');
      var stickyWaBtn = document.getElementById('pdp-sticky-whatsapp-btn');
      var qtyInput = document.getElementById('pdp-qty');
      var currentQty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
      if (utils.buildWhatsAppOrderUrl) {
        var waUrl = utils.buildWhatsAppOrderUrl({
          product: product,
          variant: selectedVariant,
          qty: currentQty
        });
        if (waBtn) waBtn.href = waUrl;
        if (stickyWaBtn) stickyWaBtn.href = waUrl;
      }
    }

    // Variant selector clicks
    mount.querySelectorAll('#pdp-variant-group .variant-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var vid = btn.getAttribute('data-variant-id');
        var found = (product.variants || []).find(function (v) { return v.id === vid; });
        if (!found || found.available === false || found.stock === 0) return;
        selectedVariant = found;

        mount.querySelectorAll('#pdp-variant-group .variant-btn').forEach(function (b) {
          b.classList.toggle('is-selected', b === btn);
        });

        var stockPill = document.getElementById('pdp-stock-pill');
        if (stockPill) stockPill.innerHTML = getStockBadge(selectedVariant.stock);

        updateOrderDisplay();
      });
    });

    // Quantity stepper
    var qtyInput = document.getElementById('pdp-qty');
    var decBtn = document.getElementById('pdp-qty-dec');
    var incBtn = document.getElementById('pdp-qty-inc');

    function setQty(val) {
      var maxStock = (typeof selectedVariant.stock === 'number' && selectedVariant.stock > 0) ? Math.min(20, selectedVariant.stock) : 20;
      var clamped = Math.max(1, Math.min(maxStock, parseInt(val, 10) || 1));
      currentQty = clamped;
      if (qtyInput) qtyInput.value = currentQty;
      updateOrderDisplay();
    }

    if (decBtn) decBtn.addEventListener('click', function () { setQty(currentQty - 1); });
    if (incBtn) incBtn.addEventListener('click', function () { setQty(currentQty + 1); });
    if (qtyInput) {
      qtyInput.addEventListener('change', function () { setQty(qtyInput.value); });
    }

    // Initialize initial price and WhatsApp CTA links
    updateOrderDisplay();

    // Add to cart with interactive state machine
    var isAdding = false;
    function triggerAdd(triggerBtn) {
      if (isAdding) return;
      isAdding = true;

      var origHTML = triggerBtn.innerHTML;
      triggerBtn.innerHTML = '<span class="spinner" aria-hidden="true" style="width:14px;height:14px;display:inline-block;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;"></span> Adding...';
      triggerBtn.disabled = true;

      setTimeout(function () {
        if (window.FloraMeshCart) {
          window.FloraMeshCart.addItem(product.slug, selectedVariant.id, currentQty);
        }

        triggerBtn.innerHTML = getIcon('check') + ' Added to Basket!';
        triggerBtn.style.backgroundColor = 'var(--color-success)';
        triggerBtn.style.borderColor = 'var(--color-success)';

        setTimeout(function () {
          triggerBtn.innerHTML = origHTML;
          triggerBtn.style.backgroundColor = '';
          triggerBtn.style.borderColor = '';
          triggerBtn.disabled = false;
          isAdding = false;
        }, 1200);
      }, 350);
    }

    var addBtn = document.getElementById('pdp-add-to-cart-btn');
    var stickyAddBtn = document.getElementById('pdp-sticky-add-btn');
    if (addBtn) addBtn.addEventListener('click', function () { triggerAdd(addBtn); });
    if (stickyAddBtn) stickyAddBtn.addEventListener('click', function () { triggerAdd(stickyAddBtn); });

    var pdpDiagBtn = document.getElementById('pdp-diagnostic-btn');
    if (pdpDiagBtn) {
      pdpDiagBtn.addEventListener('click', function () {
        if (window.FloraMeshDelight && window.FloraMeshDelight.openPlantDiagnosticModal) {
          window.FloraMeshDelight.openPlantDiagnosticModal(product.slug);
        }
      });
    }

    // Populate related products
    var relGrid = document.getElementById('pdp-related-grid');
    if (relGrid && window.FloraMeshFilters) {
      var relItems = (product.relatedProductSlugs || []).map(function (rs) {
        return products.find(function (p) { return p.slug === rs; });
      }).filter(Boolean);
      if (relItems.length < 3) {
        relItems = products.filter(function (p) { return p.slug !== product.slug; }).slice(0, 3);
      }
      relGrid.innerHTML = relItems.slice(0, 3).map(window.FloraMeshFilters.renderProductCard).join('\n');
    }

    // Populate recently viewed products
    var recentGrid = document.getElementById('pdp-recent-grid');
    var recentSection = document.getElementById('pdp-recent-section');
    if (recentGrid && window.FloraMeshFilters) {
      var recentSlugs = getRecentlyViewed(product.slug);
      var recentItems = recentSlugs.map(function (rs) {
        return products.find(function (p) { return p.slug === rs; });
      }).filter(Boolean);

      if (recentItems.length === 0) {
        if (recentSection) recentSection.style.display = 'none';
      } else {
        recentGrid.innerHTML = recentItems.slice(0, 4).map(window.FloraMeshFilters.renderProductCard).join('\n');
      }
    }
  }

  window.FloraMeshProduct = {
    initProductPage: initProductPage,
    getRecentlyViewed: getRecentlyViewed
  };
})();
