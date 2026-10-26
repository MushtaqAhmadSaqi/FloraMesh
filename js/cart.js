/**
 * FloraMesh Cart & Persistence Controller (js/cart.js)
 * Clean BEM markup, clamped quantities, free delivery progress, and multi-tab synchronization.
 */
(function () {
  'use strict';

  var cfg = window.FLORAMESH_CONFIG || {};
  var storageKeys = cfg.storageKeys || {};
  var STORAGE_KEY = storageKeys.cart || 'floramesh_demo_cart_v1';
  var GIFT_KEY = storageKeys.gift || 'floramesh_demo_gift_v1';

  var shippingRules = cfg.shipping || { freeThreshold: 10000, flatRate: 450 };
  var giftRules = cfg.gifting || { wrapFee: 350 };

  function safeGet(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeSet(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  function formatPKR(amount) {
    if (window.FloraMeshUtils && window.FloraMeshUtils.formatPKR) {
      return window.FloraMeshUtils.formatPKR(amount);
    }
    return 'Rs ' + Math.round(Number(amount || 0)).toLocaleString('en-PK');
  }

  function getItems() {
    var rawItems = safeGet(STORAGE_KEY, []);
    var products = window.FLORAMESH_PRODUCTS || [];
    var utils = window.FloraMeshUtils || {};

    if (!products.length) return rawItems;

    var hydrated = [];
    rawItems.forEach(function (raw) {
      var p = products.find(function (item) { return item.slug === raw.slug; });
      if (!p) return; // Drop items no longer in catalogue
      var variant = (p.variants || []).find(function (v) { return v.id === raw.variantId; }) ||
                    (p.variants && p.variants[0]) ||
                    { id: 'default', name: 'Standard', price: p.salePrice || p.price, stock: p.stock || 20 };
      var priceInfo = (utils.getEffectivePrice) ? utils.getEffectivePrice(p, variant) : { price: variant.price || p.salePrice || p.price };
      hydrated.push({
        slug: p.slug,
        name: p.shortName || p.name,
        fullName: p.name,
        variantId: variant.id,
        variantName: variant.name,
        price: priceInfo.price,
        image: (p.images && p.images[0]) ? p.images[0].src : (raw.image || ''),
        qty: raw.qty,
        stock: variant.stock,
        type: p.type || 'physical',
        fulfilment: p.fulfilment || 'courier',
        giftable: p.giftable !== false
      });
    });
    return hydrated;
  }

  function saveItems(items) {
    // Store lean representations { slug, variantId, qty }
    var lean = items.map(function (item) {
      return {
        slug: item.slug,
        variantId: item.variantId,
        qty: item.qty
      };
    });
    safeSet(STORAGE_KEY, lean);
    updateCartUI();
  }

  function getGiftConfig() {
    return safeGet(GIFT_KEY, { wrap: false, note: '' });
  }

  function saveGiftConfig(gConfig, skipFullRerender) {
    safeSet(GIFT_KEY, gConfig);
    updateCartUI(skipFullRerender);
  }

  function clear() {
    safeSet(STORAGE_KEY, []);
    safeSet(GIFT_KEY, { wrap: false, note: '' });
    updateCartUI();
  }

  function addItem(productSlug, variantId, qty) {
    var utils = window.FloraMeshUtils || {};
    var clamp = utils.clamp || function (v, min, max) { return Math.max(min, Math.min(max, parseInt(v, 10) || min)); };
    var sanitizedQty = clamp(qty, 1, 20);

    var products = window.FLORAMESH_PRODUCTS || [];
    var product = products.find(function (p) { return p.slug === productSlug; });
    if (!product) return;

    var variant = (product.variants && product.variants.find(function (v) { return v.id === variantId; })) ||
                  (product.variants && product.variants[0]) ||
                  { id: 'default', name: 'Standard', price: product.salePrice || product.price, stock: product.stock || 20 };

    var maxStock = (typeof variant.stock === 'number' && variant.stock > 0) ? Math.min(20, variant.stock) : 20;

    var rawItems = safeGet(STORAGE_KEY, []);
    var existing = rawItems.find(function (item) {
      return item.slug === productSlug && item.variantId === variant.id;
    });

    if (existing) {
      var nextQty = existing.qty + sanitizedQty;
      if (nextQty > maxStock) {
        existing.qty = maxStock;
        if (window.FloraMeshToast) {
          window.FloraMeshToast('Only ' + maxStock + ' available in stock for ' + (product.shortName || product.name));
        }
      } else {
        existing.qty = nextQty;
      }
    } else {
      var initialQty = Math.min(sanitizedQty, maxStock);
      rawItems.push({
        slug: product.slug,
        variantId: variant.id,
        qty: initialQty
      });
    }

    saveItems(rawItems);

    if (window.FloraMeshToast) {
      window.FloraMeshToast('Added "' + (product.shortName || product.name) + '" to your basket.');
    }
  }

  function updateQuantity(slug, variantId, deltaOrExact, isExact) {
    var utils = window.FloraMeshUtils || {};
    var clamp = utils.clamp || function (v, min, max) { return Math.max(min, Math.min(max, parseInt(v, 10) || min)); };

    var products = window.FLORAMESH_PRODUCTS || [];
    var product = products.find(function (p) { return p.slug === slug; });
    var variant = product && product.variants ? product.variants.find(function (v) { return v.id === variantId; }) : null;
    var maxStock = (variant && typeof variant.stock === 'number' && variant.stock > 0) ? Math.min(20, variant.stock) : 20;

    var rawItems = safeGet(STORAGE_KEY, []);
    rawItems = rawItems.map(function (item) {
      if (item.slug === slug && item.variantId === variantId) {
        var target = isExact ? parseInt(deltaOrExact, 10) : item.qty + deltaOrExact;
        if (target > maxStock) {
          if (window.FloraMeshToast) {
            window.FloraMeshToast('Only ' + maxStock + ' available in stock.');
          }
          item.qty = maxStock;
        } else {
          item.qty = clamp(target, 0, maxStock);
        }
      }
      return item;
    }).filter(function (item) { return item.qty > 0; });

    saveItems(rawItems);
  }

  function removeItem(slug, variantId) {
    var rawItems = safeGet(STORAGE_KEY, []).filter(function (item) {
      return !(item.slug === slug && item.variantId === variantId);
    });
    saveItems(rawItems);
  }

  function getTotals() {
    var items = getItems();
    var gift = getGiftConfig();
    var subtotal = items.reduce(function (acc, item) { return acc + (item.price * item.qty); }, 0);
    var count = items.reduce(function (acc, item) { return acc + item.qty; }, 0);

    // Digital/donation products are exempt from physical shipping charges
    var allExempt = items.length > 0 && items.every(function (item) {
      return item.type === 'digital' || item.type === 'donation' || item.fulfilment === 'digital';
    });

    var hasGiftable = items.some(function (item) {
      return item.giftable !== false;
    });

    var shipping = (subtotal === 0 || allExempt) ? 0 : (subtotal >= shippingRules.freeThreshold ? 0 : shippingRules.flatRate);
    var giftWrapFee = (gift.wrap && hasGiftable && subtotal > 0) ? giftRules.wrapFee : 0;

    return {
      count: count,
      subtotal: subtotal,
      shipping: shipping,
      giftWrapFee: giftWrapFee,
      total: subtotal + shipping + giftWrapFee,
      freeThreshold: shippingRules.freeThreshold,
      amountToFreeShipping: Math.max(0, shippingRules.freeThreshold - subtotal),
      allExempt: allExempt,
      hasGiftable: hasGiftable
    };
  }

  function updateCartUI(skipFullRerender) {
    var totals = getTotals();
    var badge = document.getElementById('header-cart-count');
    if (badge) {
      var prevCount = parseInt(badge.textContent, 10) || 0;
      badge.textContent = totals.count;
      badge.classList.toggle('is-hidden', totals.count === 0);
      if (totals.count > prevCount) {
        badge.classList.remove('badge-bounce');
        void badge.offsetWidth; // trigger reflow
        badge.classList.add('badge-bounce');
      }
    }

    // Free delivery progress bar inside cart drawer
    var progressEl = document.getElementById('cart-delivery-progress');
    if (progressEl) {
      if (totals.subtotal === 0) {
        progressEl.style.display = 'none';
      } else {
        progressEl.style.display = 'block';
        var pct = Math.min(100, Math.round((totals.subtotal / totals.freeThreshold) * 100));
        var msg = (totals.subtotal >= totals.freeThreshold)
          ? '<strong style="color:var(--color-success);">You have unlocked free twin-city delivery!</strong>'
          : 'Add <strong>' + formatPKR(totals.amountToFreeShipping) + '</strong> more for free twin-city delivery';

        progressEl.innerHTML =
          '<div>' + msg + '</div>' +
          '<div class="cart-drawer__progress-bar">' +
          '  <div class="cart-drawer__progress-fill" style="width:' + pct + '%;"></div>' +
          '</div>';
      }
    }

    var drawerItems = document.getElementById('cart-drawer-items');
    var drawerFooter = document.getElementById('cart-drawer-footer');
    var items = getItems();
    var utils = window.FloraMeshUtils || {};
    var getIcon = utils.getIcon || function () { return ''; };

    if (drawerItems && drawerFooter) {
      if (items.length === 0) {
        drawerItems.innerHTML =
          '<div class="empty-state" style="padding:var(--space-8) var(--space-4);">' +
          '  <div class="empty-state__icon">' + getIcon('bag') + '</div>' +
          '  <h3 class="empty-state__title" style="font-size:var(--text-lg);">Your basket is empty</h3>' +
          '  <p class="empty-state__desc" style="font-size:var(--text-sm);margin-bottom:var(--space-4);">Explore our turnkey planting packages, IoT soil sensors, or artisan planters.</p>' +
          '  <a href="shop.html" class="btn btn--primary btn--sm">Explore Shop</a>' +
          '</div>';
        drawerFooter.innerHTML = '';
      } else {
        drawerItems.innerHTML = items.map(function (item) {
          return '<article class="cart-item">' +
            '<img src="' + utils.escapeAttr(item.image) + '" alt="' + utils.escapeAttr(item.name) + '" class="cart-item__img" width="72" height="90" loading="lazy">' +
            '<div class="cart-item__content">' +
            '  <a href="product.html?slug=' + utils.escapeAttr(item.slug) + '" class="cart-item__title">' + utils.escapeHTML(item.name) + '</a>' +
            '  <div class="cart-item__variant">' + utils.escapeHTML(item.variantName) + '</div>' +
            '  <div class="cart-item__price">' + formatPKR(item.price * item.qty) + '</div>' +
            '  <div style="display:flex;align-items:center;gap:var(--space-2);margin-top:var(--space-2);">' +
            '    <div class="qty-stepper">' +
            '      <button type="button" class="qty-stepper__btn" data-cart-dec="' + utils.escapeAttr(item.slug) + '" data-variant="' + utils.escapeAttr(item.variantId) + '" aria-label="Decrease quantity">' + getIcon('minus') + '</button>' +
            '      <span class="qty-stepper__input" style="display:flex;align-items:center;justify-content:center;line-height:44px;">' + item.qty + '</span>' +
            '      <button type="button" class="qty-stepper__btn" data-cart-inc="' + utils.escapeAttr(item.slug) + '" data-variant="' + utils.escapeAttr(item.variantId) + '" aria-label="Increase quantity">' + getIcon('plus') + '</button>' +
            '    </div>' +
            '    <button type="button" class="btn btn--ghost btn--sm" style="color:var(--color-danger);margin-left:auto;font-size:var(--text-xs);" data-cart-rem="' + utils.escapeAttr(item.slug) + '" data-variant="' + utils.escapeAttr(item.variantId) + '">Remove</button>' +
            '  </div>' +
            '</div>' +
            '</article>';
        }).join('');

        drawerFooter.innerHTML =
          '<div class="cart-summary-row"><span>Subtotal</span><strong>' + formatPKR(totals.subtotal) + '</strong></div>' +
          '<div class="cart-summary-row"><span style="color:var(--color-text-muted);">Delivery to Islamabad &amp; Rawalpindi</span><span>' + (totals.shipping === 0 ? '<strong style="color:var(--color-success);">Free</strong>' : formatPKR(totals.shipping)) + '</span></div>' +
          (totals.giftWrapFee ? '<div class="cart-summary-row"><span style="color:var(--color-text-muted);">Artisan Gift Wrap</span><span>' + formatPKR(totals.giftWrapFee) + '</span></div>' : '') +
          '<div class="cart-summary-row cart-summary-row--total"><span>Total</span><span>' + formatPKR(totals.total) + '</span></div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-top:var(--space-4);">' +
          '  <a href="cart.html" class="btn btn--outline">View basket</a>' +
          '  <a href="checkout.html" class="btn btn--primary">Checkout</a>' +
          '</div>';
      }
    }

    if (!skipFullRerender && typeof window.renderCartPageView === 'function') {
      window.renderCartPageView();
    }
  }

  // Multi-tab synchronization
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY || e.key === GIFT_KEY) {
      updateCartUI();
    }
  });

  function openDrawer(triggerEl) {
    if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
      window.FloraMeshUI.DialogManager.open('cart-drawer', triggerEl);
    } else {
      var d = document.getElementById('cart-drawer');
      if (d) d.classList.add('is-open');
      var b = document.getElementById('cart-drawer-backdrop');
      if (b) b.classList.add('is-open');
    }
  }

  function closeDrawer() {
    if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
      window.FloraMeshUI.DialogManager.close('cart-drawer');
    } else {
      var d = document.getElementById('cart-drawer');
      if (d) d.classList.remove('is-open');
      var b = document.getElementById('cart-drawer-backdrop');
      if (b) b.classList.remove('is-open');
    }
  }

  // Bind cart drawer trigger globally
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('#open-cart-drawer-btn');
    if (trigger) {
      e.preventDefault();
      openDrawer(trigger);
    }
  });

  window.FloraMeshCart = {
    getItems: getItems,
    addItem: addItem,
    updateQuantity: updateQuantity,
    removeItem: removeItem,
    getTotals: getTotals,
    getGiftConfig: getGiftConfig,
    saveGiftConfig: saveGiftConfig,
    formatPKR: formatPKR,
    updateCartUI: updateCartUI,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    clear: clear
  };
})();
