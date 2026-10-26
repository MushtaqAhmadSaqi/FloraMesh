/**
 * FloraMesh Main Application Controller (js/main.js)
 * Coordinates header interactions, quick view modal, cart & checkout validation,
 * mobile drawer sheets, multi-tab state sync, and honesty safeguard notices.
 */
(function () {
  'use strict';

  var cfg = window.FLORAMESH_CONFIG || {};

  /**
   * Upgraded Stackable Toast Notifications (QA-43)
   * Supports actions ("View basket"), dismiss button, hover pause, max 3 stacked.
   */
  window.FloraMeshToast = function (message, options) {
    options = options || {};
    var container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    while (container.children.length >= 3) {
      container.removeChild(container.firstChild);
    }

    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');

    var textSpan = document.createElement('span');
    textSpan.className = 'toast__message';
    textSpan.textContent = message;
    el.appendChild(textSpan);

    if (options.actionText && typeof options.onAction === 'function') {
      var actBtn = document.createElement('button');
      actBtn.type = 'button';
      actBtn.className = 'toast__action-btn';
      actBtn.textContent = options.actionText;
      actBtn.onclick = function () {
        options.onAction();
        dismiss();
      };
      el.appendChild(actBtn);
    }

    var dismissBtn = document.createElement('button');
    dismissBtn.type = 'button';
    dismissBtn.className = 'toast__dismiss-btn';
    dismissBtn.setAttribute('aria-label', 'Dismiss');
    dismissBtn.innerHTML = '&times;';
    dismissBtn.onclick = dismiss;
    el.appendChild(dismissBtn);

    var timer = null;
    var duration = options.duration || 3500;

    function startTimer() {
      timer = setTimeout(dismiss, duration);
    }
    function clearTimer() {
      if (timer) clearTimeout(timer);
    }
    function dismiss() {
      clearTimer();
      el.classList.add('toast--exit');
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 200);
    }

    el.addEventListener('mouseenter', clearTimer);
    el.addEventListener('mouseleave', startTimer);

    container.appendChild(el);
    startTimer();
  };

  /**
   * Quick View Modal with Variant Picker
   */
  function openQuickView(slug) {
    var products = window.FLORAMESH_PRODUCTS || [];
    var p = products.find(function (item) { return item.slug === slug; });
    var modal = document.getElementById('quick-view-modal');
    var content = document.getElementById('quick-view-content');
    var eyebrow = document.getElementById('quick-view-eyebrow');
    var title = document.getElementById('quick-view-title');
    if (!p || !modal || !content) return;

    var utils = window.FloraMeshUtils || {};
    var escape = utils.escapeHTML || function (s) { return s; };
    var escapeA = utils.escapeAttr || function (s) { return s; };
    var formatPKR = utils.formatPKR || function (v) { return 'Rs ' + v; };

    var selectedVariant = (p.variants && p.variants[0]) || { id: 'default', name: 'Standard', price: p.salePrice || p.price, stock: p.stock || 20 };
    var priceInfo = (utils.getEffectivePrice) ? utils.getEffectivePrice(p, selectedVariant) : { price: selectedVariant.price };

    if (eyebrow) eyebrow.textContent = p.category;

    var variantOptionsHtml = (p.variants && p.variants.length > 1) ? [
      '<div style="margin-bottom:var(--space-4);">' +
      '  <label for="qv-variant-select" style="font-size:var(--text-xs);font-weight:var(--weight-bold);display:block;margin-bottom:var(--space-1);">Select option</label>' +
      '  <select id="qv-variant-select" class="form-field select" style="width:100%;padding:var(--space-2);border-radius:var(--radius-md);border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-text);">' +
      p.variants.map(function (v) {
        var isSoldOut = v.available === false || v.stock === 0;
        return '<option value="' + escapeA(v.id) + '" ' + (isSoldOut ? 'disabled' : '') + '>' +
          escape(v.name) + ' — ' + formatPKR(v.price) + (isSoldOut ? ' (Sold out)' : '') +
          '</option>';
      }).join('') +
      '  </select>' +
      '</div>'
    ].join('\n') : '';

    var cleanUnit = (p.unitPriceLabel || '').replace(/\s*\[.*?\]\s*/g, '').trim();

    content.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 1.2fr;gap:var(--space-6);align-items:start;">' +
      '  <img src="' + escapeA(p.images[0].src) + '" alt="' + escapeA(p.images[0].alt) + '" style="border-radius:var(--radius-lg);width:100%;aspect-ratio:4/5;object-fit:cover;background:' + (p.dominant || 'var(--color-media-bg)') + ';">' +
      '  <div>' +
      '    <h2 id="quick-view-title" style="font-size:var(--text-xl);margin-bottom:var(--space-2);">' + escape(p.shortName || p.name) + '</h2>' +
      '    <div id="qv-price-display" style="font-size:var(--text-xl);font-weight:var(--weight-bold);color:var(--color-text);margin-bottom:var(--space-2);font-variant-numeric:tabular-nums;">' + formatPKR(priceInfo.price) + '</div>' +
      (cleanUnit ? '    <div style="font-size:var(--text-xs);color:var(--color-link);margin-bottom:var(--space-3);">' + escape(cleanUnit) + '</div>' : '') +
      '    <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-4);line-height:1.5;">' + escape(p.shortDescription) + '</p>' +
      variantOptionsHtml +
      '    <div style="display:flex;gap:var(--space-3);">' +
      '      <button type="button" class="btn btn--primary" id="qv-add-btn" style="flex:1;">Add to basket</button>' +
      '      <a href="product.html?slug=' + escapeA(p.slug) + '" class="btn btn--outline">Full details</a>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    var varSelect = document.getElementById('qv-variant-select');
    if (varSelect) {
      varSelect.addEventListener('change', function () {
        var found = p.variants.find(function (v) { return v.id === varSelect.value; });
        if (found) {
          selectedVariant = found;
          var priceEl = document.getElementById('qv-price-display');
          if (priceEl) priceEl.textContent = formatPKR(selectedVariant.price);
        }
      });
    }

    var addBtn = document.getElementById('qv-add-btn');
    if (addBtn) {
      addBtn.onclick = function () {
        if (window.FloraMeshCart) {
          window.FloraMeshCart.addItem(p.slug, selectedVariant.id, 1);
        }
        closeModal();
      };
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    if (utils.lockBodyScroll) utils.lockBodyScroll(true);

    var closeBtn = document.getElementById('modal-close-btn');
    var backdrop = document.getElementById('modal-backdrop');

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      if (utils.lockBodyScroll) utils.lockBodyScroll(false);
    }

    if (closeBtn) closeBtn.onclick = closeModal;
    if (backdrop) backdrop.onclick = closeModal;
  }

  /**
   * Home Page Interactive Widgets: Space Selector, Featured Tabs, Budget Gifts, Recently Viewed
   */
  function initHomeGrids() {
    var products = window.FLORAMESH_PRODUCTS || [];

    // 1. Hero Space Selector Chips
    var heroChips = document.querySelectorAll('[data-hero-space]');
    var heroMediaImg = document.getElementById('hero-media-img');
    var heroCtaBtn = document.getElementById('hero-primary-cta');
    var heroTelemetryLoc = document.getElementById('hero-telemetry-loc');

    var spaceProfiles = {
      'balcony': {
        img: 'assets/images/banners/hero-islamabad-balcony.webp',
        alt: 'Sunlit apartment balcony garden in Islamabad overlooking Margalla Hills with artisan planters and FloraMesh soil telemetry sensor',
        loc: 'Sector F-7 Balcony • Optimal Daylight',
        cta: 'shop.html?space=balcony'
      },
      'rooftop': {
        img: 'assets/images/banners/category-services.webp',
        alt: 'Rooftop heat-resilient garden in Islamabad with shade pergolas, drip irrigation and soil probes',
        loc: 'Sector E-7 Rooftop • Full Margalla Sun',
        cta: 'shop.html?space=rooftop'
      },
      'living-room': {
        img: 'assets/images/banners/category-supplies.webp',
        alt: 'Biophilic living room plant setup with Multani blue pottery and wireless soil sensors',
        loc: 'Chak Shahzad Residence • Filtered Light',
        cta: 'shop.html?space=indoor'
      },
      'office': {
        img: 'assets/images/banners/category-monitoring.webp',
        alt: 'Corporate workspace plant installation in Blue Area Islamabad with smart IoT telemetry monitor',
        loc: 'Blue Area Tech Office • Controlled AC',
        cta: 'shop.html?space=office'
      },
      'kitchen': {
        img: 'assets/images/banners/category-learning.webp',
        alt: 'Kitchen culinary herb garden with Seedistry heirloom seeds and terracotta trough',
        loc: 'Sector F-10 Kitchen Sill • Morning Light',
        cta: 'shop.html?space=kitchen'
      }
    };

    heroChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var space = chip.getAttribute('data-hero-space');
        var prof = spaceProfiles[space];
        if (!prof) return;

        heroChips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');

        if (heroMediaImg) {
          heroMediaImg.src = prof.img;
          heroMediaImg.alt = prof.alt;
        }
        if (heroTelemetryLoc) {
          heroTelemetryLoc.textContent = prof.loc;
        }
        if (heroCtaBtn) {
          heroCtaBtn.href = prof.cta;
          heroCtaBtn.textContent = 'Explore ' + chip.textContent.trim() + ' Setups';
        }
      });
    });

    // 2. Featured Tabs Shelf
    var featuredMount = document.getElementById('home-featured-grid');
    var tabBtns = document.querySelectorAll('[data-featured-tab]');

    function renderFeaturedSlice(tabKey) {
      if (!featuredMount || !window.FloraMeshFilters) return;
      var filtered = [];
      if (tabKey === 'services') {
        filtered = products.filter(function (p) { return p.categorySlug === 'planting-services'; }).slice(0, 4);
      } else if (tabKey === 'sensors') {
        filtered = products.filter(function (p) { return p.categorySlug === 'smart-monitoring'; }).slice(0, 4);
      } else if (tabKey === 'planters') {
        filtered = products.filter(function (p) { return p.categorySlug === 'plant-care-supplies'; }).slice(0, 4);
      } else if (tabKey === 'seeds') {
        filtered = products.filter(function (p) { return p.categorySlug === 'learning-hub'; }).slice(0, 4);
      } else {
        filtered = products.filter(function (p) { return p.featured; }).slice(0, 4);
      }
      featuredMount.innerHTML = filtered.map(window.FloraMeshFilters.renderProductCard).join('\n');
    }

    if (tabBtns.length > 0) {
      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          tabBtns.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          renderFeaturedSlice(btn.getAttribute('data-featured-tab'));
        });
      });
      renderFeaturedSlice('all');
    } else if (featuredMount && window.FloraMeshFilters) {
      var featured = products.filter(function (p) { return p.featured; }).slice(0, 4);
      featuredMount.innerHTML = featured.map(window.FloraMeshFilters.renderProductCard).join('\n');
    }

    // 3. Budget Gifting Tabs
    var giftMount = document.getElementById('home-gift-grid');
    var budgetBtns = document.querySelectorAll('[data-budget-tab]');

    function renderBudgetGifts(maxPrice) {
      if (!giftMount || !window.FloraMeshFilters) return;
      var gifts = products.filter(function (p) {
        var price = (p.variants && p.variants[0]) ? p.variants[0].price : p.price;
        return p.giftable && price <= maxPrice;
      }).slice(0, 4);

      if (gifts.length === 0) {
        gifts = products.filter(function (p) { return p.giftable; }).slice(0, 4);
      }
      giftMount.innerHTML = gifts.map(window.FloraMeshFilters.renderProductCard).join('\n');
    }

    if (budgetBtns.length > 0) {
      budgetBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          budgetBtns.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          var max = parseInt(btn.getAttribute('data-budget-tab'), 10) || 10000;
          renderBudgetGifts(max);
        });
      });
      renderBudgetGifts(3500);
    } else if (giftMount && window.FloraMeshFilters) {
      var gifts = products.filter(function (p) { return p.giftable; }).slice(0, 4);
      giftMount.innerHTML = gifts.map(window.FloraMeshFilters.renderProductCard).join('\n');
    }

    // 4. Recently Viewed Shelf
    var recentMount = document.getElementById('home-recent-grid');
    var recentSection = document.getElementById('home-recent-section');

    if (recentMount && window.FloraMeshProduct && window.FloraMeshFilters) {
      var recentSlugs = window.FloraMeshProduct.getRecentlyViewed();
      var recentItems = recentSlugs.map(function (s) {
        return products.find(function (p) { return p.slug === s; });
      }).filter(Boolean);

      if (recentItems.length > 0) {
        if (recentSection) recentSection.style.display = 'block';
        recentMount.innerHTML = recentItems.slice(0, 4).map(window.FloraMeshFilters.renderProductCard).join('\n');
      } else if (recentSection) {
        recentSection.style.display = 'none';
      }
    }
  }

  /**
   * Dedicated Cart Page View (cart.html)
   */
  window.renderCartPageView = function () {
    var mount = document.getElementById('cart-page-mount');
    if (!mount) return;

    var utils = window.FloraMeshUtils || {};
    var escape = utils.escapeHTML || function (s) { return s; };
    var escapeA = utils.escapeAttr || function (s) { return s; };
    var getIcon = utils.getIcon || function () { return ''; };
    var formatPKR = utils.formatPKR || function (v) { return 'Rs ' + v; };

    var items = window.FloraMeshCart.getItems();
    var totals = window.FloraMeshCart.getTotals();
    var gift = window.FloraMeshCart.getGiftConfig();

    if (items.length === 0) {
      mount.innerHTML =
        '<div class="empty-state">' +
        '  <div class="empty-state__icon">' + getIcon('bag') + '</div>' +
        '  <h2 class="empty-state__title">Your basket is empty</h2>' +
        '  <p class="empty-state__desc">Explore our turnkey planting services, smart IoT soil sensors, or handcrafted Multani &amp; Taxila planters.</p>' +
        '  <a href="shop.html" class="btn btn--primary">Browse products</a>' +
        '</div>';
      return;
    }

    // Free delivery progress bar
    var progressPct = Math.min(100, Math.round((totals.subtotal / totals.freeThreshold) * 100));
    var progressMessage = (totals.subtotal >= totals.freeThreshold)
      ? '<span style="color:var(--color-success);font-weight:var(--weight-bold);">You have unlocked free delivery to Islamabad &amp; Rawalpindi!</span>'
      : (totals.allExempt
        ? '<span style="color:var(--color-success);font-weight:var(--weight-bold);">Your digital / tree donation order is exempt from physical courier fees.</span>'
        : 'Add <strong>' + formatPKR(totals.amountToFreeShipping) + '</strong> more for free twin-city delivery.');

    var progressBarHtml =
      '<div class="card" style="margin-bottom:var(--space-6);background:var(--color-surface-alt);border:1px solid var(--color-border);padding:var(--space-4);border-radius:var(--radius-lg);">' +
      '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2);font-size:var(--text-xs);">' +
      '    <div>' + progressMessage + '</div>' +
      '    <strong style="font-variant-numeric:tabular-nums;color:var(--color-text);">' + progressPct + '%</strong>' +
      '  </div>' +
      '  <div style="height:6px;background:var(--color-border);border-radius:var(--radius-pill);overflow:hidden;">' +
      '    <div style="height:100%;width:' + progressPct + '%;background:var(--color-primary);border-radius:var(--radius-pill);transition:width var(--motion-base);"></div>' +
      '  </div>' +
      '</div>';

    var rows = items.map(function (item) {
      var fulfilmentLabel = (item.fulfilment === 'onsite' || item.type === 'service')
        ? '<span class="badge badge--accent" style="font-size:10px;padding:2px 8px;">On-Site Planting • Twin Cities</span>'
        : (item.type === 'digital' || item.type === 'donation'
          ? '<span class="badge badge--success" style="font-size:10px;padding:2px 8px;">Digital / Geo-Tagged</span>'
          : '<span class="badge badge--outline" style="font-size:10px;padding:2px 8px;">Courier Dispatch</span>');

      return '<div class="cart-item" style="padding:var(--space-4) 0;border-bottom:1px solid var(--color-border-subtle);">' +
        '<img src="' + escapeA(item.image) + '" alt="' + escapeA(item.name) + '" class="cart-item__img" width="80" height="100" style="background:var(--color-media-bg);object-fit:cover;border-radius:var(--radius-md);">' +
        '<div class="cart-item__content">' +
        '  <div style="margin-bottom:4px;">' + fulfilmentLabel + '</div>' +
        '  <a href="product.html?slug=' + escapeA(item.slug) + '" class="cart-item__title" style="font-size:var(--text-base);font-weight:var(--weight-bold);">' + escape(item.name) + '</a>' +
        '  <div class="cart-item__variant" style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:2px;">' + escape(item.variantName) + '</div>' +
        '  <div style="font-size:var(--text-sm);color:var(--color-link);margin-top:var(--space-1);font-variant-numeric:tabular-nums;">' + formatPKR(item.price) + ' each</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:var(--space-3);">' +
        '  <div class="qty-stepper">' +
        '    <button type="button" class="qty-stepper__btn" data-cart-dec="' + escapeA(item.slug) + '" data-variant="' + escapeA(item.variantId) + '" aria-label="Decrease quantity">' + getIcon('minus') + '</button>' +
        '    <span class="qty-stepper__input" style="display:flex;align-items:center;justify-content:center;line-height:44px;font-variant-numeric:tabular-nums;">' + item.qty + '</span>' +
        '    <button type="button" class="qty-stepper__btn" data-cart-inc="' + escapeA(item.slug) + '" data-variant="' + escapeA(item.variantId) + '" aria-label="Increase quantity">' + getIcon('plus') + '</button>' +
        '  </div>' +
        '  <strong style="min-width:110px;text-align:right;font-size:var(--text-base);font-variant-numeric:tabular-nums;">' + formatPKR(item.price * item.qty) + '</strong>' +
        '  <button type="button" class="btn btn--ghost btn--sm" style="color:var(--color-danger);font-size:var(--text-xs);" data-cart-rem="' + escapeA(item.slug) + '" data-variant="' + escapeA(item.variantId) + '">Remove</button>' +
        '</div>' +
        '</div>';
    }).join('');

    var giftSection = totals.hasGiftable ? [
      '<div style="margin-top:var(--space-6);padding-top:var(--space-4);border-top:1px dashed var(--color-border);">' +
      '  <label style="display:flex;align-items:center;gap:var(--space-2);font-weight:var(--weight-semibold);cursor:pointer;color:var(--color-text);">' +
      '    <input type="checkbox" id="cart-gift-wrap-cb" ' + (gift.wrap ? 'checked' : '') + ' style="accent-color:var(--color-primary);width:18px;height:18px;"> Add artisan reed-and-kraft gift wrapping (+Rs 350 — no prices on packing slip)' +
      '  </label>' +
      '  <div style="margin-top:var(--space-3);">' +
      '    <label for="cart-gift-note-input" style="font-size:var(--text-xs);font-weight:var(--weight-bold);display:block;margin-bottom:var(--space-1);color:var(--color-text);">Optional handwritten gift message (Urdu or English):</label>' +
      '    <textarea id="cart-gift-note-input" rows="2" placeholder="Write a greeting or blessing for the recipient..." class="form-field textarea" style="width:100%;padding:var(--space-3);border:1px solid var(--color-border);border-radius:var(--radius-md);background:var(--color-surface);color:var(--color-text);">' + escape(gift.note || '') + '</textarea>' +
      '  </div>' +
      '</div>'
    ].join('') : [
      '<div style="margin-top:var(--space-6);padding:var(--space-3) var(--space-4);background:var(--color-surface-alt);border-radius:var(--radius-md);border:1px solid var(--color-border);font-size:var(--text-xs);color:var(--color-text-muted);">' +
      '  Gift wrapping is unavailable because all items in basket are digital subscriptions, native tree tokens, or on-site crew services.' +
      '</div>'
    ].join('');

    mount.innerHTML =
      progressBarHtml +
      '<div class="cart-page-grid">' +
      '  <div class="card">' +
      '    <h2 style="font-size:var(--text-xl);margin-bottom:var(--space-4);">Items in your basket (' + totals.count + ')</h2>' +
      rows +
      giftSection +
      '  </div>' +
      '  <div class="order-summary-box">' +
      '    <h2 style="font-size:var(--text-xl);margin-bottom:var(--space-4);">Order summary</h2>' +
      '    <div class="cart-summary-row"><span>Subtotal</span><strong style="font-variant-numeric:tabular-nums;">' + formatPKR(totals.subtotal) + '</strong></div>' +
      '    <div class="cart-summary-row"><span style="color:var(--color-text-muted);">Delivery to Islamabad &amp; Rawalpindi</span><span>' + (totals.allExempt ? '<strong style="color:var(--color-success);">Exempt (Digital)</strong>' : (totals.shipping === 0 ? '<strong style="color:var(--color-success);">Free</strong>' : '<span style="font-variant-numeric:tabular-nums;">' + formatPKR(totals.shipping) + '</span>')) + '</span></div>' +
      (totals.giftWrapFee ? '<div class="cart-summary-row"><span style="color:var(--color-text-muted);">Artisan Gift Wrap</span><span style="font-variant-numeric:tabular-nums;">' + formatPKR(totals.giftWrapFee) + '</span></div>' : '') +
      '    <div class="cart-summary-row cart-summary-row--total"><span>Total</span><span style="font-variant-numeric:tabular-nums;">' + formatPKR(totals.total) + '</span></div>' +
      '    <div style="margin-top:var(--space-6);display:flex;flex-direction:column;gap:var(--space-3);">' +
      '      <a href="checkout.html" class="btn btn--primary btn--full">Proceed to checkout</a>' +
      '      <a href="shop.html" class="btn btn--outline btn--full">Continue shopping</a>' +
      '    </div>' +
      '    <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--color-border-subtle);font-size:var(--text-xs);color:var(--color-text-muted);line-height:var(--leading-relaxed);">' +
      '      • Free site survey rescheduling up to 24h prior<br>' +
      '      • 48-hour ceramic transit replacement guarantee<br>' +
      '      • 14-day plant establishment check-in' +
      '    </div>' +
      '  </div>' +
      '</div>';

    // Gift wrap change listeners (Debounced without full-page re-render)
    var cb = document.getElementById('cart-gift-wrap-cb');
    var noteInput = document.getElementById('cart-gift-note-input');

    if (cb) {
      cb.addEventListener('change', function () {
        window.FloraMeshCart.saveGiftConfig({
          wrap: cb.checked,
          note: noteInput ? noteInput.value : ''
        }, false);
      });
    }

    if (noteInput) {
      var saveNote = function () {
        window.FloraMeshCart.saveGiftConfig({
          wrap: cb ? cb.checked : false,
          note: noteInput.value
        }, true /* skipFullRerender to preserve typing focus */);
      };
      noteInput.addEventListener('blur', saveNote);
      noteInput.addEventListener('change', saveNote);
    }
  };

  window.renderWishlistPageView = function () {
    var mount = document.getElementById('wishlist-page-mount');
    if (!mount) return;

    var utils = window.FloraMeshUtils || {};
    var escape = utils.escapeHTML || function (s) { return s; };
    var escapeA = utils.escapeAttr || function (s) { return s; };
    var getIcon = utils.getIcon || function () { return ''; };
    var formatPKR = utils.formatPKR || function (v) { return 'Rs ' + v; };

    var wishlistAPI = window.FloraMeshWishlist || {};
    var isShared = wishlistAPI.isSharedView ? wishlistAPI.isSharedView() : false;
    var slugs = isShared ? wishlistAPI.getSharedSlugs() : wishlistAPI.getSavedSlugs();
    var products = window.FLORAMESH_PRODUCTS || [];
    var savedItems = slugs.map(function (s) {
      return products.find(function (p) { return p.slug === s; });
    }).filter(Boolean);

    if (savedItems.length === 0) {
      mount.innerHTML =
        '<div class="empty-state">' +
        '  <div class="empty-state__icon">' + getIcon('heart') + '</div>' +
        '  <h2 class="empty-state__title">' + (isShared ? 'Shared wishlist is empty' : 'Your wishlist is empty') + '</h2>' +
        '  <p class="empty-state__desc">' + (isShared ? 'The shared link does not contain any valid botanical items.' : 'Tap the heart icon on any planting package, IoT soil sensor, or artisan planter to save items on this device.') + '</p>' +
        '  <a href="shop.html" class="btn btn--primary">Explore shop</a>' +
        '</div>';
      return;
    }

    var html = '';

    // Action Header / Shared Banner
    if (isShared) {
      html +=
        '<div class="alert alert--info" style="margin-bottom:var(--space-6);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-4);">' +
        '  <div>' +
        '    <strong>Curated Shared Wishlist</strong>' +
        '    <p style="margin:2px 0 0;font-size:var(--text-sm);color:var(--color-text-muted);">Viewing ' + savedItems.length + ' item' + (savedItems.length === 1 ? '' : 's') + ' shared with you.</p>' +
        '  </div>' +
        '  <div style="display:flex;gap:var(--space-2);">' +
        '    <button type="button" class="btn btn--outline btn--sm" id="wishlist-copy-shared">Save to My Device</button>' +
        '    <button type="button" class="btn btn--primary btn--sm" id="wishlist-add-all">Add All to Basket</button>' +
        '  </div>' +
        '</div>';
    } else {
      html +=
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-6);padding-bottom:var(--space-4);border-bottom:1px solid var(--color-border-subtle);">' +
        '  <div style="font-size:var(--text-sm);color:var(--color-text-muted);">' +
        '    <strong>' + savedItems.length + ' item' + (savedItems.length === 1 ? '' : 's') + '</strong> saved on this device' +
        '  </div>' +
        '  <div style="display:flex;gap:var(--space-2);">' +
        '    <button type="button" class="btn btn--outline btn--sm" id="wishlist-share-btn" aria-label="Copy shareable link">' +
        getIcon('share') + ' <span style="margin-left:4px;">Share Wishlist</span>' +
        '    </button>' +
        '    <button type="button" class="btn btn--primary btn--sm" id="wishlist-add-all">' +
        getIcon('bag') + ' <span style="margin-left:4px;">Add All to Basket</span>' +
        '    </button>' +
        '  </div>' +
        '</div>';
    }

    // Grid of cards
    html += '<div class="grid-3">';
    savedItems.forEach(function (p) {
      var priceInfo = (utils.getEffectivePrice) ? utils.getEffectivePrice(p) : { price: p.salePrice || p.price };
      var variants = p.variants || [];
      var hasMultiVariants = variants.length > 1;

      html += '<article class="product-card" data-product-slug="' + escapeA(p.slug) + '">';
      html += '  <div class="product-card__media">';
      html += '    <a href="product.html?slug=' + escapeA(p.slug) + '">';
      html += '      <img src="' + escapeA(p.images[0].src) + '" alt="' + escapeA(p.images[0].alt) + '" class="product-card__img" width="600" height="750" loading="lazy">';
      html += '    </a>';
      if (!isShared) {
        html += '    <button type="button" class="product-card__wishlist-btn" data-wishlist-slug="' + escapeA(p.slug) + '" aria-pressed="true" aria-label="Remove ' + escapeA(p.name) + ' from wishlist">';
        html += getIcon('heartFilled');
        html += '    </button>';
      }
      html += '  </div>';
      html += '  <div class="product-card__body">';
      html += '    <div class="product-card__category">' + escape(p.category) + '</div>';
      html += '    <h3 class="product-card__title"><a href="product.html?slug=' + escapeA(p.slug) + '">' + escape(p.shortName || p.name) + '</a></h3>';
      html += '    <div class="product-card__price-group" style="margin-top:auto;">';
      html += '      <span class="product-card__price">' + formatPKR(priceInfo.price) + '</span>';
      html += '    </div>';

      if (hasMultiVariants) {
        html += '    <div style="margin-top:var(--space-2);">';
        html += '      <label for="w-var-' + escapeA(p.slug) + '" class="sr-only">Select option</label>';
        html += '      <select id="w-var-' + escapeA(p.slug) + '" class="form-select form-select--sm" data-variant-select="' + escapeA(p.slug) + '" style="width:100%;font-size:var(--text-xs);padding:4px 8px;">';
        variants.forEach(function (v) {
          var isAvail = v.available !== false && (v.stock === undefined || v.stock > 0);
          html += '        <option value="' + escapeA(v.id) + '"' + (!isAvail ? ' disabled' : '') + '>' + escape(v.name) + ' - ' + formatPKR(v.price) + (!isAvail ? ' (Sold Out)' : '') + '</option>';
        });
        html += '      </select>';
        html += '    </div>';
      }

      html += '    <div style="display:flex;gap:var(--space-2);margin-top:var(--space-3);">';
      html += '      <button type="button" class="btn btn--primary btn--sm" data-move-basket="' + escapeA(p.slug) + '" style="flex:1;">' + (isShared ? 'Add to basket' : 'Move to basket') + '</button>';
      if (isShared) {
        html += '      <a href="product.html?slug=' + escapeA(p.slug) + '" class="btn btn--outline btn--sm" title="View details">' + getIcon('arrowRight') + '</a>';
      }
      html += '    </div>';
      html += '  </div>';
      html += '</article>';
    });
    html += '</div>';

    mount.innerHTML = html;

    // Action bar bindings
    var shareBtn = document.getElementById('wishlist-share-btn');
    if (shareBtn && wishlistAPI.copyShareUrl) {
      shareBtn.addEventListener('click', function () {
        wishlistAPI.copyShareUrl();
      });
    }

    var copySharedBtn = document.getElementById('wishlist-copy-shared');
    if (copySharedBtn && wishlistAPI.copySharedToSaved) {
      copySharedBtn.addEventListener('click', function () {
        wishlistAPI.copySharedToSaved();
        // Redirect to personal wishlist
        window.location.href = 'wishlist.html';
      });
    }

    var addAllBtn = document.getElementById('wishlist-add-all');
    if (addAllBtn && wishlistAPI.addAllToBasket) {
      addAllBtn.addEventListener('click', function () {
        wishlistAPI.addAllToBasket(slugs);
      });
    }

    // Move to basket per item
    mount.querySelectorAll('[data-move-basket]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var slug = btn.getAttribute('data-move-basket');
        var varSelect = mount.querySelector('[data-variant-select="' + slug + '"]');
        var selectedVariantId = varSelect ? varSelect.value : null;
        wishlistAPI.moveToBasket(slug, selectedVariantId);
      });
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.FloraMeshPartials.init();
    window.FloraMeshCart.updateCartUI();
    window.FloraMeshWishlist.updateWishlistUI();
    initHomeGrids();

    if (window.FloraMeshFilters) window.FloraMeshFilters.initShopFilters();
    if (window.FloraMeshProduct) window.FloraMeshProduct.initProductPage();

    // Render single slim demoMode banner if active
    if (cfg.demoMode) {
      document.querySelectorAll('[data-demo-notice]').forEach(function (el) {
        el.innerHTML =
          '<div class="demo-safeguard-banner" role="status">' +
          '  <span>This is a preview store. No payment, account or message is actually processed.</span>' +
          '</div>';
      });
    }

    // Shrinking sticky header
    window.addEventListener('scroll', function () {
      var hdr = document.getElementById('site-header');
      if (hdr) hdr.classList.toggle('site-header--scrolled', window.scrollY > 20);
    });

    // Mobile nav sheet toggle with focus trap
    var menuBtn = document.getElementById('mobile-menu-btn');
    var closeNavBtn = document.getElementById('close-mobile-nav-btn');
    var nav = document.getElementById('primary-navigation');
    var navCleanup = null;

    function toggleMobileNav(show) {
      if (!nav) return;
      var isOpen = (typeof show === 'boolean') ? show : !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', isOpen);
      if (menuBtn) menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (window.FloraMeshUtils && window.FloraMeshUtils.lockBodyScroll) {
        window.FloraMeshUtils.lockBodyScroll(isOpen);
      }
      if (isOpen && window.FloraMeshUtils && window.FloraMeshUtils.trapFocus) {
        navCleanup = window.FloraMeshUtils.trapFocus(nav);
      } else if (navCleanup) {
        navCleanup();
        navCleanup = null;
      }
    }

    if (menuBtn) menuBtn.addEventListener('click', function () { toggleMobileNav(); });
    if (closeNavBtn) closeNavBtn.addEventListener('click', function () { toggleMobileNav(false); });

    // Cart drawer open/close
    var openCartBtn = document.getElementById('open-cart-drawer-btn');
    var closeCartBtn = document.getElementById('close-cart-drawer-btn');
    var cartDrawer = document.getElementById('cart-drawer');
    var cartBackdrop = document.getElementById('cart-drawer-backdrop');
    var drawerCleanup = null;

    function toggleCartDrawer(show) {
      if (!cartDrawer || !cartBackdrop) return;
      cartDrawer.classList.toggle('is-open', show);
      cartBackdrop.classList.toggle('is-open', show);
      cartDrawer.setAttribute('aria-hidden', show ? 'false' : 'true');

      if (window.FloraMeshUtils && window.FloraMeshUtils.lockBodyScroll) {
        window.FloraMeshUtils.lockBodyScroll(show);
      }
      if (show && window.FloraMeshUtils && window.FloraMeshUtils.trapFocus) {
        drawerCleanup = window.FloraMeshUtils.trapFocus(cartDrawer);
      } else if (drawerCleanup) {
        drawerCleanup();
        drawerCleanup = null;
      }
    }

    if (openCartBtn) openCartBtn.addEventListener('click', function () { toggleCartDrawer(true); });
    if (closeCartBtn) closeCartBtn.addEventListener('click', function () { toggleCartDrawer(false); });
    if (cartBackdrop) cartBackdrop.addEventListener('click', function () { toggleCartDrawer(false); });

    // Delegated global clicks
    document.body.addEventListener('click', function (e) {
      var addBtn = e.target.closest('[data-add-cart]');
      if (addBtn) {
        window.FloraMeshCart.addItem(addBtn.getAttribute('data-add-cart'), null, 1);
        return;
      }
      var wishBtn = e.target.closest('[data-wishlist-slug]');
      if (wishBtn) {
        window.FloraMeshWishlist.toggle(wishBtn.getAttribute('data-wishlist-slug'));
        return;
      }
      var qvBtn = e.target.closest('[data-quick-view]');
      if (qvBtn) {
        openQuickView(qvBtn.getAttribute('data-quick-view'));
        return;
      }
      var incBtn = e.target.closest('[data-cart-inc]');
      if (incBtn) {
        window.FloraMeshCart.updateQuantity(incBtn.getAttribute('data-cart-inc'), incBtn.getAttribute('data-variant'), 1, false);
        return;
      }
      var decBtn = e.target.closest('[data-cart-dec]');
      if (decBtn) {
        window.FloraMeshCart.updateQuantity(decBtn.getAttribute('data-cart-dec'), decBtn.getAttribute('data-variant'), -1, false);
        return;
      }
      var remBtn = e.target.closest('[data-cart-rem]');
      if (remBtn) {
        window.FloraMeshCart.removeItem(remBtn.getAttribute('data-cart-rem'), remBtn.getAttribute('data-variant'));
        return;
      }
      var accBtn = e.target.closest('.accordion-trigger');
      if (accBtn) {
        if (accBtn.closest('details')) return; // Native disclosure handles itself
        var item = accBtn.closest('.accordion-item');
        if (item) {
          var isExpanded = accBtn.getAttribute('aria-expanded') === 'true';
          accBtn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
          item.classList.toggle('is-open', !isExpanded);
        }
        return;
      }
    });

    // Escape closes modals, drawers, and mobile nav
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        toggleCartDrawer(false);
        toggleMobileNav(false);
        var qv = document.getElementById('quick-view-modal');
        if (qv && qv.classList.contains('is-open')) {
          qv.classList.remove('is-open');
          qv.setAttribute('aria-hidden', 'true');
          if (window.FloraMeshUtils && window.FloraMeshUtils.lockBodyScroll) {
            window.FloraMeshUtils.lockBodyScroll(false);
          }
        }
      }
    });

    // (Footer newsletter handler is managed directly in js/partials.js)

    // Checkout Form Validation, Service-Zone Check & Receipt View (QA-20, QA-24, QA-25)
    var checkoutForm = document.getElementById('demo-checkout-form');
    if (checkoutForm) {
      var totals = window.FloraMeshCart.getTotals();
      var summaryEl = document.getElementById('checkout-summary-box');
      var citySelect = document.getElementById('chk-city');
      var cityWarningEl = document.getElementById('checkout-city-warning');

      function updateCheckoutSummary() {
        totals = window.FloraMeshCart.getTotals();
        if (summaryEl) {
          summaryEl.innerHTML =
            '<div class="cart-summary-row"><span>Items (' + totals.count + ')</span><strong style="font-variant-numeric:tabular-nums;">' + window.FloraMeshCart.formatPKR(totals.subtotal) + '</strong></div>' +
            '<div class="cart-summary-row"><span style="color:var(--color-text-muted);">Delivery / Field Van</span><span>' + (totals.allExempt ? '<strong style="color:var(--color-success);">Exempt (Digital)</strong>' : (totals.shipping === 0 ? '<strong style="color:var(--color-success);">Free</strong>' : '<span style="font-variant-numeric:tabular-nums;">' + window.FloraMeshCart.formatPKR(totals.shipping) + '</span>')) + '</span></div>' +
            (totals.giftWrapFee ? '<div class="cart-summary-row"><span style="color:var(--color-text-muted);">Artisan Gift Wrap</span><span style="font-variant-numeric:tabular-nums;">' + window.FloraMeshCart.formatPKR(totals.giftWrapFee) + '</span></div>' : '') +
            '<div class="cart-summary-row cart-summary-row--total"><span>Total</span><span style="font-variant-numeric:tabular-nums;">' + window.FloraMeshCart.formatPKR(totals.total) + '</span></div>';
        }
      }
      updateCheckoutSummary();

      // Check if cart has on-site planting services when city changes (QA-20)
      function checkCitySuitability() {
        if (!citySelect || !cityWarningEl) return;
        var isOtherCity = citySelect.value.indexOf('Other') !== -1;
        var items = window.FloraMeshCart.getItems();
        var hasLiveServices = items.some(function (item) {
          return item.type === 'service' || item.fulfilment === 'onsite' ||
                 item.slug.indexOf('balcony') !== -1 || item.slug.indexOf('service') !== -1 || item.slug.indexOf('rooftop') !== -1;
        });

        var submitBtn = checkoutForm.querySelector('button[type="submit"]');

        if (isOtherCity && hasLiveServices) {
          cityWarningEl.style.display = 'block';
          cityWarningEl.innerHTML = '<strong>Service Area Alert:</strong> On-site balcony, terrace, and corporate planting services are only available within Islamabad &amp; Rawalpindi. Courier delivery to other cities is restricted to dry goods, sensors, and seeds. Please choose Islamabad or Rawalpindi, or remove on-site services from your basket.';
          if (submitBtn) submitBtn.disabled = true;
        } else {
          cityWarningEl.style.display = 'none';
          if (submitBtn) submitBtn.disabled = false;
        }
      }

      if (citySelect) {
        citySelect.addEventListener('change', checkCitySuitability);
        checkCitySuitability();
      }

      checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;
        var firstInvalid = null;

        // Strict Pakistani phone validation (QA-25)
        var phoneRegex = /^((\+92\s?3[0-9]{2})|(0092\s?3[0-9]{2})|(03[0-9]{2}))[\s\-]?[0-9]{7}$/;
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        checkoutForm.querySelectorAll('[required]').forEach(function (inp) {
          var field = inp.closest('.form-field');
          var val = inp.value.trim();
          var fieldValid = !!val;

          if (inp.type === 'email' && fieldValid) {
            fieldValid = emailRegex.test(val);
          } else if (inp.type === 'tel' && fieldValid) {
            fieldValid = phoneRegex.test(val);
          }

          var errEl = field ? field.querySelector('.form-field__error') : null;
          var errId = errEl ? (errEl.id || (inp.id + '-error')) : '';
          if (errEl && !errEl.id) errEl.id = errId;

          if (!fieldValid) {
            valid = false;
            if (field) field.classList.add('has-error');
            inp.setAttribute('aria-invalid', 'true');
            if (errId) inp.setAttribute('aria-describedby', errId);
            if (!firstInvalid) firstInvalid = inp;
          } else {
            if (field) field.classList.remove('has-error');
            inp.setAttribute('aria-invalid', 'false');
            if (errId) inp.removeAttribute('aria-describedby');
          }
        });

        if (!valid && firstInvalid) {
          firstInvalid.focus();
          return;
        }

        // Process valid checkout with complete receipt view (QA-24)
        var itemsSnapshot = window.FloraMeshCart.getItems();
        var totalsSnapshot = window.FloraMeshCart.getTotals();
        var orderRef = 'FM-ISB-' + Math.floor(10000 + Math.random() * 90000);

        var nameVal = document.getElementById('chk-name') ? document.getElementById('chk-name').value.trim() : 'Customer';
        var phoneVal = document.getElementById('chk-phone') ? document.getElementById('chk-phone').value.trim() : '';
        var cityVal = citySelect ? citySelect.value : 'Islamabad';
        var addrVal = document.getElementById('chk-address') ? document.getElementById('chk-address').value.trim() : '';
        var slotVal = document.getElementById('chk-shipping-method') ? document.getElementById('chk-shipping-method').value : 'standard';
        var payVal = document.querySelector('input[name="payment-method"]:checked') ? document.querySelector('input[name="payment-method"]:checked').value : 'Cash on Delivery';

        var rowsHtml = itemsSnapshot.map(function (it) {
          return '<tr>' +
            '<td><strong>' + (it.name || it.fullName) + '</strong><br><span style="font-size:11px;color:var(--color-text-muted);">' + it.variantName + '</span></td>' +
            '<td style="text-align:center;">' + it.qty + '</td>' +
            '<td style="text-align:right;">' + window.FloraMeshCart.formatPKR(it.price * it.qty) + '</td>' +
            '</tr>';
        }).join('');

        var receiptHtml =
          '<div class="receipt-card" role="status">' +
          '  <div class="receipt-header">' +
          '    <div>' +
          '      <span class="badge badge--success" style="margin-bottom:var(--space-2);display:inline-block;">Order Confirmed • Scheduled</span>' +
          '      <h2 style="font-size:var(--text-2xl);color:var(--color-text);margin:0;">Thank you, ' + nameVal + '!</h2>' +
          '      <p style="color:var(--color-text-muted);font-size:var(--text-sm);margin-top:4px;">We have logged your order and reserved your planting arrival window.</p>' +
          '    </div>' +
          '    <div style="text-align:right;">' +
          '      <span class="receipt-ref">#' + orderRef + '</span>' +
          '      <div style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:4px;">Date: ' + new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' }) + '</div>' +
          '    </div>' +
          '  </div>' +
          '  <div class="receipt-grid">' +
          '    <div>' +
          '      <div class="receipt-section-title">Delivery &amp; Service Destination</div>' +
          '      <div style="font-size:var(--text-sm);line-height:1.5;">' +
          '        <strong>' + nameVal + '</strong><br>' +
          '        ' + addrVal + '<br>' +
          '        ' + cityVal + ', Pakistan<br>' +
          '        <span>Tel: ' + phoneVal + '</span>' +
          '      </div>' +
          '    </div>' +
          '    <div>' +
          '      <div class="receipt-section-title">Crew Slot &amp; Payment</div>' +
          '      <div style="font-size:var(--text-sm);line-height:1.5;">' +
          '        <strong>Method:</strong> ' + (slotVal === 'morning-crew' ? 'Morning Mali Crew (9:00 AM – 12:00 PM)' : 'Twin-City Field Van Dispatch') + '<br>' +
          '        <strong>Payment:</strong> ' + payVal + '<br>' +
          '        <strong>Payment Status:</strong> Pending on Arrival / Verification' +
          '      </div>' +
          '    </div>' +
          '  </div>' +
          '  <div class="receipt-section-title">Order Items</div>' +
          '  <table class="receipt-table">' +
          '    <thead><tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Amount</th></tr></thead>' +
          '    <tbody>' + rowsHtml + '</tbody>' +
          '  </table>' +
          '  <div style="max-width:320px;margin-left:auto;font-size:var(--text-sm);">' +
          '    <div class="cart-summary-row"><span>Subtotal:</span><strong style="font-variant-numeric:tabular-nums;">' + window.FloraMeshCart.formatPKR(totalsSnapshot.subtotal) + '</strong></div>' +
          '    <div class="cart-summary-row"><span>Delivery:</span><span>' + (totalsSnapshot.shipping === 0 ? 'Free' : window.FloraMeshCart.formatPKR(totalsSnapshot.shipping)) + '</span></div>' +
          (totalsSnapshot.giftWrapFee ? '<div class="cart-summary-row"><span>Gift Wrapping:</span><span style="font-variant-numeric:tabular-nums;">' + window.FloraMeshCart.formatPKR(totalsSnapshot.giftWrapFee) + '</span></div>' : '') +
          '    <div class="cart-summary-row cart-summary-row--total" style="font-size:var(--text-base);"><span>Total:</span><strong style="font-variant-numeric:tabular-nums;">' + window.FloraMeshCart.formatPKR(totalsSnapshot.total) + '</strong></div>' +
          '  </div>' +
          '  <div class="receipt-actions">' +
          '    <button type="button" class="btn btn--outline btn--sm" onclick="window.print()">Print receipt</button>' +
          '    <a href="shop.html" class="btn btn--primary btn--sm">Continue shopping</a>' +
          '  </div>' +
          '</div>';

        var mount = checkoutForm.parentElement;
        mount.innerHTML = receiptHtml;
        mount.scrollIntoView({ behavior: 'smooth' });

        // Save order to local order history
        try {
          var ordersKey = (cfg.storageKeys && cfg.storageKeys.orders) ? cfg.storageKeys.orders : 'floramesh_orders_v1';
          var existingOrders = [];
          var raw = localStorage.getItem(ordersKey);
          if (raw) existingOrders = JSON.parse(raw);
          existingOrders.unshift({
            ref: orderRef,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            total: totalsSnapshot.total,
            city: city,
            slot: slot,
            status: 'Confirmed'
          });
          localStorage.setItem(ordersKey, JSON.stringify(existingOrders.slice(0, 10)));
        } catch (e) {}

        // Clear cart via FloraMeshCart.clear() (QA-24)
        if (window.FloraMeshCart && window.FloraMeshCart.clear) {
          window.FloraMeshCart.clear();
        }
      });
    }

    // Standardized Legal and Delivery Metadata Sync (QA-18, QA-34)
    var legalDate = (cfg.legal && cfg.legal.lastUpdated) ? cfg.legal.lastUpdated : 'October 24, 2026';
    document.querySelectorAll('[data-legal-last-updated]').forEach(function (el) {
      el.textContent = legalDate;
    });

    var deliveryText = (cfg.delivery && cfg.delivery.standard) ? cfg.delivery.standard : '48–72 hours across Islamabad & Rawalpindi';
    document.querySelectorAll('[data-delivery-standard]').forEach(function (el) {
      el.textContent = deliveryText;
    });

    // Contact Form Validation & Focus Management (QA-25, QA-35)
    var contactForm = document.getElementById('demo-contact-form');
    if (contactForm) {
      // Conditional WhatsApp display
      var waBlock = document.getElementById('contact-whatsapp-block');
      var waNumber = cfg.contact && cfg.contact.whatsappNumber;
      if (waBlock) {
        waBlock.style.display = waNumber ? 'block' : 'none';
        var waLink = waBlock.querySelector('a');
        if (waLink && waNumber) {
          waLink.href = 'https://wa.me/' + waNumber;
          waLink.textContent = '+' + waNumber;
        }
      }

      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;
        var firstInvalid = null;
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        contactForm.querySelectorAll('[required]').forEach(function (inp) {
          var field = inp.closest('.form-field');
          var val = inp.value.trim();
          var fieldValid = !!val;
          if (inp.type === 'email' && fieldValid) fieldValid = emailRegex.test(val);

          if (!fieldValid) {
            valid = false;
            if (field) field.classList.add('has-error');
            inp.setAttribute('aria-invalid', 'true');
            if (!firstInvalid) firstInvalid = inp;
          } else {
            if (field) field.classList.remove('has-error');
            inp.setAttribute('aria-invalid', 'false');
          }
        });

        if (!valid && firstInvalid) {
          firstInvalid.focus();
          return;
        }

        var res = document.getElementById('contact-demo-result');
        if (valid && res) {
          res.style.display = 'block';
          res.innerHTML = '<strong style="color:var(--color-success);">Thank you. Your inquiry has been received.</strong><p style="margin-top:4px;color:var(--color-text-muted);">Our Twin-City horticultural team will review your site details and follow up directly.</p>';
          contactForm.reset();
        }
      });
    }

    // Password Toggle (Account Portal)
    document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-toggle-password');
        var input = document.getElementById(targetId);
        if (!input) return;
        var isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        btn.setAttribute('aria-pressed', isPass ? 'true' : 'false');
        btn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
        var utils = window.FloraMeshUtils || {};
        var getIcon = utils.getIcon || function () { return ''; };
        btn.innerHTML = isPass ? getIcon('eyeOff') : getIcon('eye');
      });
    });

    // Account Tab Navigation
    document.querySelectorAll('[data-account-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-account-tab');
        document.querySelectorAll('[data-account-tab]').forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.account-tab-panel').forEach(function (p) {
          p.classList.add('is-hidden');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        var targetPanel = document.getElementById(target);
        if (targetPanel) targetPanel.classList.remove('is-hidden');
      });
    });

    // Account Demo Auth Handler (QA-26)
    document.querySelectorAll('.demo-auth-form').forEach(function (frm) {
      frm.addEventListener('submit', function (e) {
        e.preventDefault();
        var formValid = true;
        var firstInvalid = null;
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        frm.querySelectorAll('[required]').forEach(function (inp) {
          var val = inp.value.trim();
          var ok = !!val;
          if (inp.type === 'email' && ok) ok = emailRegex.test(val);
          var field = inp.closest('.form-field');
          if (!ok) {
            formValid = false;
            if (field) field.classList.add('has-error');
            inp.setAttribute('aria-invalid', 'true');
            if (!firstInvalid) firstInvalid = inp;
          } else {
            if (field) field.classList.remove('has-error');
            inp.setAttribute('aria-invalid', 'false');
          }
        });

        if (!formValid && firstInvalid) {
          firstInvalid.focus();
          return;
        }

        var emailInput = frm.querySelector('input[type="email"]');
        var emailVal = emailInput ? emailInput.value.trim() : 'Customer';
        var utils = window.FloraMeshUtils || {};
        var escape = utils.escapeHTML || function (s) { return s; };

        var msg = document.getElementById('account-demo-result');
        if (msg) {
          msg.style.display = 'block';
          msg.innerHTML = '<strong style="color:var(--color-success);">Welcome to your Account Portal.</strong><p style="margin-top:4px;color:var(--color-text-muted);">Session active for <em>' + escape(emailVal) + '</em>. Prototype notice: authentication and preferences are retained in your browser\'s local storage for evaluation.</p>';
        }
        frm.reset();
      });
    });

    // Hydrate Recent Local Orders in Account Portal
    var ordersMount = document.getElementById('account-orders-list');
    if (ordersMount) {
      var ordersKey = (cfg.storageKeys && cfg.storageKeys.orders) ? cfg.storageKeys.orders : 'floramesh_orders_v1';
      var savedOrders = [];
      try {
        var rawOrders = localStorage.getItem(ordersKey);
        if (rawOrders) savedOrders = JSON.parse(rawOrders);
      } catch (e) {}

      var utils = window.FloraMeshUtils || {};
      var escape = utils.escapeHTML || function (s) { return s; };
      var getIcon = utils.getIcon || function () { return ''; };

      if (savedOrders.length === 0) {
        ordersMount.innerHTML =
          '<div class="empty-state" style="padding:var(--space-8) 0;">' +
          '  <div class="empty-state__icon">' + getIcon('package') + '</div>' +
          '  <h3 class="h4" style="margin-bottom:var(--space-2);">No Orders Placed Yet</h3>' +
          '  <p style="color:var(--color-text-muted);font-size:var(--text-sm);max-width:44ch;margin:0 auto var(--space-4);">When you place a mock order through checkout on this device, your reference number and receipt details will appear here.</p>' +
          '  <a href="shop.html" class="btn btn--primary btn--sm">Browse Botanical Shop</a>' +
          '</div>';
      } else {
        ordersMount.innerHTML = savedOrders.map(function (ord) {
          return '<div class="receipt-card" style="margin-bottom:var(--space-4);">' +
            '<div class="receipt-card__header">' +
            '  <div><strong>Order ' + escape(ord.ref || '#FM-ISB-DEMO') + '</strong><span style="color:var(--color-text-muted);margin-left:8px;font-size:var(--text-xs);">' + escape(ord.date || 'Recent') + '</span></div>' +
            '  <span class="chip chip--success" style="font-size:var(--text-xs);">' + escape(ord.status || 'Confirmed') + '</span>' +
            '</div>' +
            '<p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-top:var(--space-2);">Fulfillment: ' + escape(ord.city || 'Islamabad') + ' • ' + escape(ord.slot || 'Morning slot') + '</p>' +
            '</div>';
        }).join('');
      }
    }
  });
})();
