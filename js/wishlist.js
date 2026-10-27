/**
 * FloraMesh Wishlist Controller (js/wishlist.js)
 * Clean SVG icons, concise toasts, multi-tab synchronization,
 * URL-based wishlist sharing, and variant-safe basket migration.
 */
(function () {
  'use strict';

  var cfg = window.FLORAMESH_CONFIG || {};
  var storageKeys = cfg.storageKeys || {};
  var WISHLIST_KEY = storageKeys.wishlist || 'floramesh_demo_wishlist_v1';

  function getQueryParam(key) {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get(key);
    } catch (e) {
      return null;
    }
  }

  function isSharedView() {
    var rawList = getQueryParam('list');
    return !!(rawList && rawList.trim().length > 0);
  }

  function getSharedSlugs() {
    var rawList = getQueryParam('list');
    if (!rawList) return [];
    return rawList
      .split(',')
      .map(function (s) { return s.trim().replace(/[^a-zA-Z0-9\-_]/g, ''); })
      .filter(function (s) { return s.length > 0; });
  }

  function getSavedSlugs() {
    try {
      var raw = localStorage.getItem(WISHLIST_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(function (s) { return typeof s === 'string' && s.length > 0; }) : [];
    } catch (e) {
      return [];
    }
  }

  function saveSlugs(slugs) {
    var validSlugs = (Array.isArray(slugs) ? slugs : [])
      .map(function (s) { return String(s).replace(/[^a-zA-Z0-9\-_]/g, ''); })
      .filter(function (s) { return s.length > 0; });

    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(validSlugs));
    } catch (e) {}
    updateWishlistUI();
    if (window.FloraMeshEvents && window.FloraMeshEvents.emit) {
      window.FloraMeshEvents.emit('wishlist:updated', { slugs: validSlugs });
    }
  }

  function has(slug) {
    return getSavedSlugs().indexOf(slug) !== -1;
  }

  function toggle(slug) {
    var list = getSavedSlugs();
    var idx = list.indexOf(slug);
    var added = false;
    if (idx === -1) {
      list.push(slug);
      added = true;
    } else {
      list.splice(idx, 1);
    }
    saveSlugs(list);

    if (window.FloraMeshToast) {
      window.FloraMeshToast(added ? 'Saved to your wishlist' : 'Removed from wishlist');
    }
    return added;
  }

  function copySharedToSaved() {
    var shared = getSharedSlugs();
    if (shared.length === 0) return;
    var current = getSavedSlugs();
    var addedCount = 0;
    shared.forEach(function (slug) {
      if (current.indexOf(slug) === -1) {
        current.push(slug);
        addedCount++;
      }
    });
    saveSlugs(current);
    if (window.FloraMeshToast) {
      window.FloraMeshToast(addedCount > 0 ? 'Saved ' + addedCount + ' items to your device' : 'All items are already in your wishlist');
    }
  }

  function generateShareUrl() {
    var slugs = getSavedSlugs();
    if (slugs.length === 0) return window.location.href;
    var base = window.location.origin + window.location.pathname;
    return base + '?list=' + encodeURIComponent(slugs.join(','));
  }

  function copyShareUrl() {
    var url = generateShareUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        if (window.FloraMeshToast) window.FloraMeshToast('Wishlist link copied to clipboard');
      }).catch(function () {
        fallbackCopy(url);
      });
    } else {
      fallbackCopy(url);
    }
  }

  function fallbackCopy(url) {
    var inp = document.createElement('input');
    inp.value = url;
    document.body.appendChild(inp);
    inp.select();
    try {
      document.execCommand('copy');
      if (window.FloraMeshToast) window.FloraMeshToast('Wishlist link copied to clipboard');
    } catch (e) {
      prompt('Copy your shareable wishlist URL:', url);
    }
    document.body.removeChild(inp);
  }

  function moveToBasket(slug, variantId) {
    var products = window.FLORAMESH_PRODUCTS || [];
    var p = products.find(function (item) { return item.slug === slug; });
    if (!p) return;

    // If multi-variant and variant not specified, prompt via variant selector or choose first available
    var selectedVariant = null;
    if (variantId && p.variants) {
      selectedVariant = p.variants.find(function (v) { return v.id === variantId; });
    } else if (p.variants && p.variants.length > 0) {
      selectedVariant = p.variants.find(function (v) { return v.available !== false && (v.stock === undefined || v.stock > 0); }) || p.variants[0];
    }

    if (window.FloraMeshCart) {
      var vId = selectedVariant ? selectedVariant.id : null;
      window.FloraMeshCart.addItem(slug, vId, 1);
    }

    // Remove from saved list if not in shared view
    if (!isSharedView()) {
      var list = getSavedSlugs().filter(function (s) { return s !== slug; });
      saveSlugs(list);
    }
  }

  function addAllToBasket(slugList) {
    var targetSlugs = slugList || (isSharedView() ? getSharedSlugs() : getSavedSlugs());
    if (targetSlugs.length === 0) return;

    var products = window.FLORAMESH_PRODUCTS || [];
    var addedCount = 0;

    targetSlugs.forEach(function (slug) {
      var p = products.find(function (item) { return item.slug === slug; });
      if (!p) return;
      var variant = (p.variants && p.variants.length > 0)
        ? (p.variants.find(function (v) { return v.available !== false && (v.stock === undefined || v.stock > 0); }) || p.variants[0])
        : null;
      if (window.FloraMeshCart) {
        window.FloraMeshCart.addItem(slug, variant ? variant.id : null, 1);
        addedCount++;
      }
    });

    if (window.FloraMeshToast) {
      window.FloraMeshToast('Added ' + addedCount + ' items to your garden basket');
    }
  }

  function updateWishlistUI() {
    var list = getSavedSlugs();
    var badges = document.querySelectorAll('#header-wishlist-count, #mobile-bottom-wishlist-count');
    badges.forEach(function (badge) {
      badge.textContent = list.length;
      badge.classList.toggle('is-hidden', list.length === 0);
    });

    var utils = window.FloraMeshUtils || {};
    var getIcon = utils.getIcon || function () { return ''; };

    document.querySelectorAll('[data-wishlist-slug]').forEach(function (btn) {
      var slug = btn.getAttribute('data-wishlist-slug');
      var active = list.indexOf(slug) !== -1;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      btn.innerHTML = active ? getIcon('heartFilled') : getIcon('heart');
    });

    if (typeof window.renderWishlistPageView === 'function') {
      window.renderWishlistPageView();
    }
  }

  // Multi-tab synchronization
  window.addEventListener('storage', function (e) {
    if (e.key === WISHLIST_KEY) {
      updateWishlistUI();
    }
  });

  window.FloraMeshWishlist = {
    getSavedSlugs: getSavedSlugs,
    has: has,
    toggle: toggle,
    moveToBasket: moveToBasket,
    addAllToBasket: addAllToBasket,
    updateWishlistUI: updateWishlistUI,
    isSharedView: isSharedView,
    getSharedSlugs: getSharedSlugs,
    copySharedToSaved: copySharedToSaved,
    generateShareUrl: generateShareUrl,
    copyShareUrl: copyShareUrl
  };
})();
