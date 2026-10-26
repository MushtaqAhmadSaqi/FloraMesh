/**
 * FloraMesh Utility Library (js/utils.js)
 * Sanitization, XSS prevention, accessible SVG icons, focus trapping, and theming.
 */
(function () {
  'use strict';

  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait || 200);
    };
  }

  function clamp(val, min, max) {
    var parsed = parseInt(val, 10);
    if (isNaN(parsed)) return min;
    return Math.max(min, Math.min(max, parsed));
  }

  function formatPKR(amount) {
    var num = Math.round(Number(amount) || 0);
    return 'Rs ' + num.toLocaleString('en-PK');
  }

  /**
   * Single source of truth for product pricing & discounts
   */
  function getEffectivePrice(product, variant) {
    if (!product) return { price: 0, regularPrice: 0, hasDiscount: false, isSoldOut: false, stock: 0 };
    var v = variant || (product.variants && product.variants[0]) || null;
    var price = (v && v.price) ? v.price : (product.salePrice || product.price || 0);
    var regularPrice = (product.price && product.salePrice && product.salePrice < product.price) ? product.price : price;
    var hasDiscount = regularPrice > price;
    var stock = (v && typeof v.stock === 'number') ? v.stock : (product.stock || 0);
    var isSoldOut = (v && v.available === false) || stock === 0;

    return {
      price: price,
      regularPrice: regularPrice,
      hasDiscount: hasDiscount,
      discountPercent: hasDiscount ? Math.round(((regularPrice - price) / regularPrice) * 100) : 0,
      isSoldOut: isSoldOut,
      stock: stock,
      variant: v
    };
  }

  /**
   * Unified 24x24 single-stroke SVG icon library (2px stroke)
   */
  var ICONS = {
    bag: '<svg class="icon icon--bag" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    heart: '<svg class="icon icon--heart" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    heartFilled: '<svg class="icon icon--heart icon--heart-filled" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    user: '<svg class="icon icon--user" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    search: '<svg class="icon icon--search" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    close: '<svg class="icon icon--close" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    chevronRight: '<svg class="icon icon--chevron-right" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>',
    chevronLeft: '<svg class="icon icon--chevron-left" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>',
    chevronDown: '<svg class="icon icon--chevron-down" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>',
    truck: '<svg class="icon icon--truck" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    leaf: '<svg class="icon icon--leaf" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
    shield: '<svg class="icon icon--shield" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    gift: '<svg class="icon icon--gift" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>',
    check: '<svg class="icon icon--check" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
    sun: '<svg class="icon icon--sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon: '<svg class="icon icon--moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    plus: '<svg class="icon icon--plus" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    minus: '<svg class="icon icon--minus" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    filter: '<svg class="icon icon--filter" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    grid: '<svg class="icon icon--grid" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    list: '<svg class="icon icon--list" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>'
  };

  function getIcon(name, customClass) {
    var raw = ICONS[name] || '';
    if (!raw) return '';
    if (customClass) {
      return raw.replace('class="icon ', 'class="icon ' + escapeAttr(customClass) + ' ');
    }
    return raw;
  }

  /**
   * Accessible Focus Trap
   */
  function trapFocus(container) {
    if (!container) return function () {};
    var focusableSelectors = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var focusables = container.querySelectorAll(focusableSelectors);
    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          if (last) last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          if (first) first.focus();
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    if (first) first.focus();

    return function cleanup() {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  function lockBodyScroll(lock) {
    if (lock) {
      var scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = scrollBarWidth + 'px';
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  /**
   * Two-Theme Controller: "heritage" (light) vs "midnight" (dark)
   */
  var THEME_KEY = (window.FLORAMESH_CONFIG && window.FLORAMESH_CONFIG.storageKeys && window.FLORAMESH_CONFIG.storageKeys.theme) || 'floramesh_theme_v1';

  function getCurrentTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'heritage' || saved === 'midnight') return saved;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'midnight' : 'heritage';
  }

  function applyTheme(theme) {
    var validTheme = (theme === 'midnight') ? 'midnight' : 'heritage';
    document.documentElement.setAttribute('data-theme', validTheme);
    var metaScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaScheme) {
      metaScheme.setAttribute('content', validTheme === 'midnight' ? 'dark light' : 'light dark');
    }
    // Update logo images if present
    document.querySelectorAll('.site-header__logo img, .site-footer__logo img').forEach(function (img) {
      var isDark = validTheme === 'midnight';
      img.src = isDark ? 'assets/images/brand/floramesh-logo-dark.svg' : 'assets/images/brand/floramesh-logo.svg';
    });
    // Update theme toggle buttons
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var isDark = validTheme === 'midnight';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Switch to Heritage Cream theme' : 'Switch to Midnight Grove theme');
      btn.innerHTML = isDark ? getIcon('sun') : getIcon('moon');
    });
    try {
      localStorage.setItem(THEME_KEY, validTheme);
    } catch (e) {}
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || getCurrentTheme();
    var next = (current === 'midnight') ? 'heritage' : 'midnight';
    applyTheme(next);
    return next;
  }

  /**
   * Tagged template literal helper with automatic HTML escaping (QA-39)
   * Usage: FloraMeshUtils.html`<div class="${className}">${unsafeContent}</div>`
   */
  function html(strings) {
    var values = Array.prototype.slice.call(arguments, 1);
    var result = '';
    for (var i = 0; i < strings.length; i++) {
      result += strings[i];
      if (i < values.length) {
        var val = values[i];
        if (val === null || val === undefined) {
          result += '';
        } else if (typeof val === 'object' && val.__isSafeHTML) {
          result += val.value;
        } else if (Array.isArray(val)) {
          result += val.map(function (item) {
            return (item && item.__isSafeHTML) ? item.value : escapeHTML(item);
          }).join('');
        } else {
          result += escapeHTML(val);
        }
      }
    }
    return result;
  }

  function rawHTML(str) {
    return { __isSafeHTML: true, value: String(str || '') };
  }

  /**
   * Lightweight Event Bus for surgical DOM updates (QA-41)
   */
  var _eventListeners = {};
  var FloraMeshEvents = {
    on: function (event, cb) {
      if (!_eventListeners[event]) _eventListeners[event] = [];
      _eventListeners[event].push(cb);
    },
    off: function (event, cb) {
      if (!_eventListeners[event]) return;
      _eventListeners[event] = _eventListeners[event].filter(function (fn) { return fn !== cb; });
    },
    emit: function (event, data) {
      if (!_eventListeners[event]) return;
      _eventListeners[event].forEach(function (fn) {
        try { fn(data); } catch (e) { console.error('FloraMeshEvents handler error', e); }
      });
    }
  };

  window.FloraMeshEvents = FloraMeshEvents;

  window.FloraMeshUtils = {
    escapeHTML: escapeHTML,
    escapeAttr: escapeAttr,
    html: html,
    rawHTML: rawHTML,
    events: FloraMeshEvents,
    debounce: debounce,
    clamp: clamp,
    formatPKR: formatPKR,
    getEffectivePrice: getEffectivePrice,
    getIcon: getIcon,
    trapFocus: trapFocus,
    lockBodyScroll: lockBodyScroll,
    getCurrentTheme: getCurrentTheme,
    applyTheme: applyTheme,
    toggleTheme: toggleTheme
  };
})();
