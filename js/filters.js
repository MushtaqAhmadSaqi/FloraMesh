/**
 * FloraMesh Product Catalog Filtering, Search, Sorting & View Toggle (js/filters.js)
 * Features:
 * - Dynamic price range max (up to Rs 78,000)
 * - Space, Category, Type, In-Stock, and Gift-Ready multi-filtering
 * - Quiet-luxury 4:5 cards with dominant color placeholder, factual badges, and tabular-nums
 * - Secondary image alt="" for screen-reader cleanliness
 * - Safe multi-variant quick add via Quick View modal
 * - Mobile bottom sheet dialog integration via FloraMeshUI.DialogManager
 * 100% file:// compatible, zero external dependencies.
 */
(function () {
  'use strict';

  var CATEGORY_NAMES = {
    'planting-services': 'On-Demand Planting Services',
    'smart-monitoring': 'Smart Monitoring & IoT Kits',
    'plant-care-supplies': 'Plant Care Supplies & Planters',
    'learning-hub': 'Learning Hub & DIY Kits',
    'community-csr': 'Community, CSR & Eco Gifting'
  };

  var SPACE_NAMES = {
    'balcony': 'Balcony Oasis',
    'rooftop': 'Rooftop & Terrace',
    'indoor': 'Living Room Biophilic',
    'office': 'Office Sanctuary',
    'kitchen': 'Kitchen Herb Bed'
  };

  function getMaxCatalogPrice() {
    var all = window.FLORAMESH_PRODUCTS || [];
    var max = 78000;
    all.forEach(function (p) {
      if (p.price > max) max = p.price;
      (p.variants || []).forEach(function (v) {
        if (v.price > max) max = v.price;
      });
    });
    return max;
  }

  var MAX_CATALOG_PRICE = getMaxCatalogPrice();

  var state = {
    search: '',
    category: 'all',
    space: 'all',
    type: 'all',
    inStockOnly: false,
    giftReadyOnly: false,
    maxPrice: MAX_CATALOG_PRICE,
    sort: 'featured',
    view: 'grid',
    limit: 12
  };

  function renderProductCard(p) {
    var utils = window.FloraMeshUtils || {};
    var escape = utils.escapeHTML || function (s) { return s; };
    var escapeA = utils.escapeAttr || function (s) { return s; };
    var getIcon = utils.getIcon || function () { return ''; };

    // Derive variant price range
    var vPrices = (p.variants || []).map(function (v) { return v.price; }).filter(Boolean);
    var minPrice = vPrices.length > 0 ? Math.min.apply(null, vPrices) : (p.salePrice || p.price);
    var maxPrice = vPrices.length > 0 ? Math.max.apply(null, vPrices) : minPrice;
    var hasPriceRange = minPrice !== maxPrice;

    var priceDisplay = '';
    if (hasPriceRange) {
      priceDisplay = '<span class="product-card__price" style="font-variant-numeric:tabular-nums;font-weight:var(--weight-bold);"><span class="product-card__from" style="font-size:var(--text-xs);font-weight:normal;color:var(--color-text-muted);">From </span>' + utils.formatPKR(minPrice) + '</span>';
    } else if (p.compareAtPrice && p.compareAtPrice > minPrice) {
      priceDisplay = '<span class="product-card__price" style="font-variant-numeric:tabular-nums;font-weight:var(--weight-bold);">' + utils.formatPKR(minPrice) + '</span> <span class="product-card__price--old" style="text-decoration:line-through;color:var(--color-text-muted);font-size:var(--text-xs);margin-left:4px;">' + utils.formatPKR(p.compareAtPrice) + '</span>';
    } else {
      priceDisplay = '<span class="product-card__price" style="font-variant-numeric:tabular-nums;font-weight:var(--weight-bold);">' + utils.formatPKR(minPrice) + '</span>';
    }

    var saved = window.FloraMeshWishlist && window.FloraMeshWishlist.has(p.slug);
    var img1 = (p.images && p.images[0]) ? p.images[0].src : '';
    var img2 = (p.images && p.images[1]) ? p.images[1].src : img1;
    var imgAlt1 = (p.images && p.images[0] && p.images[0].alt) ? p.images[0].alt : p.name;
    var shortTitle = p.shortName || p.name;
    var dominantColor = p.dominant || '#E8E2D8';

    var hasMultipleVariants = (p.variants && p.variants.length > 1);
    var addBtnText = hasMultipleVariants ? 'Select Option' : 'Add to Basket';

    return [
      '<article class="product-card" data-product-slug="' + escapeA(p.slug) + '">',
      '  <div class="product-card__media" style="background-color:' + dominantColor + ';">',
      p.badge ? '    <span class="card-badge">' + escape(p.badge) + '</span>' : '',
      '    <button type="button" class="product-card__wishlist-btn" data-wishlist-slug="' + escapeA(p.slug) + '" aria-pressed="' + (saved ? 'true' : 'false') + '" aria-label="Save ' + escapeA(p.name) + ' to wishlist">',
      saved ? getIcon('heartFilled') : getIcon('heart'),
      '    </button>',
      '    <a href="product.html?slug=' + escapeA(p.slug) + '" aria-label="View details of ' + escapeA(p.name) + '">',
      '      <img src="' + escapeA(img1) + '" alt="' + escapeA(imgAlt1) + '" class="product-card__img product-card__img--primary" width="600" height="750" loading="lazy">',
      '      <img src="' + escapeA(img2) + '" alt="" class="product-card__img product-card__img--secondary" width="600" height="750" loading="lazy">',
      '    </a>',
      '  </div>',
      '  <div class="product-card__body">',
      '    <div class="product-card__category">' + escape(p.category) + '</div>',
      '    <h3 class="product-card__title"><a href="product.html?slug=' + escapeA(p.slug) + '">' + escape(shortTitle) + '</a></h3>',
      '    <p class="product-card__desc">' + escape(p.shortDescription) + '</p>',
      '    <div class="product-card__footer">',
      '      <div class="product-card__price-group">' + priceDisplay + '</div>',
      '      <div class="product-card__actions">',
      '        <button type="button" class="btn btn-outline btn-card-action" data-quick-view="' + escapeA(p.slug) + '">Quick View</button>',
      '        <button type="button" class="btn btn-primary btn-card-action" data-add-cart="' + escapeA(p.slug) + '" data-has-variants="' + (hasMultipleVariants ? 'true' : 'false') + '">' + addBtnText + '</button>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function syncURL() {
    var params = new URLSearchParams();
    if (state.category && state.category !== 'all') params.set('category', state.category);
    if (state.space && state.space !== 'all') params.set('space', state.space);
    if (state.type && state.type !== 'all') params.set('type', state.type);
    if (state.inStockOnly) params.set('stock', '1');
    if (state.giftReadyOnly) params.set('gift', '1');
    if (state.search) params.set('q', state.search);
    if (state.maxPrice < MAX_CATALOG_PRICE) params.set('max', state.maxPrice);
    if (state.sort !== 'featured') params.set('sort', state.sort);

    var queryString = params.toString();
    var newUrl = window.location.pathname + (queryString ? '?' + queryString : '');
    try {
      window.history.replaceState(null, '', newUrl);
    } catch (e) {}
  }

  function applyFilters() {
    var all = window.FLORAMESH_PRODUCTS || [];
    var utils = window.FloraMeshUtils || {};
    var escape = utils.escapeHTML || function (s) { return s; };
    var getIcon = utils.getIcon || function () { return ''; };

    var filtered = all.filter(function (p) {
      var vPrices = (p.variants || []).map(function (v) { return v.price; });
      var itemPrice = vPrices.length > 0 ? Math.min.apply(null, vPrices) : (p.salePrice || p.price);

      var matchesCat = state.category === 'all' || p.categorySlug === state.category;
      var matchesSpace = state.space === 'all' || (p.spaces && p.spaces.indexOf(state.space) !== -1);
      var matchesType = state.type === 'all' || p.type === state.type;
      var matchesStock = !state.inStockOnly || p.stock > 0;
      var matchesGift = !state.giftReadyOnly || p.giftable;
      var matchesPrice = itemPrice <= state.maxPrice;

      var q = state.search.trim().toLowerCase();
      var matchesSearch = !q ||
        (p.name || '').toLowerCase().indexOf(q) !== -1 ||
        (p.shortName || '').toLowerCase().indexOf(q) !== -1 ||
        (p.shortDescription || '').toLowerCase().indexOf(q) !== -1 ||
        (p.category || '').toLowerCase().indexOf(q) !== -1 ||
        ((p.tags || []).join(' ').toLowerCase().indexOf(q) !== -1) ||
        ((p.spaces || []).join(' ').toLowerCase().indexOf(q) !== -1);

      return matchesCat && matchesSpace && matchesType && matchesStock && matchesGift && matchesPrice && matchesSearch;
    });

    filtered.sort(function (a, b) {
      var pa = (a.variants && a.variants[0]) ? a.variants[0].price : (a.salePrice || a.price);
      var pb = (b.variants && b.variants[0]) ? b.variants[0].price : (b.salePrice || b.price);
      if (state.sort === 'price-asc') return pa - pb;
      if (state.sort === 'price-desc') return pb - pa;
      if (state.sort === 'name-asc') return (a.shortName || a.name).localeCompare(b.shortName || b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

    var gridEl = document.getElementById('shop-product-grid');
    var countEl = document.getElementById('shop-product-count');
    var loadMoreBtn = document.getElementById('shop-load-more-btn');
    var activePills = document.getElementById('shop-active-filters');
    if (!gridEl) return;

    if (countEl) {
      countEl.textContent = 'Showing ' + Math.min(filtered.length, state.limit) + ' of ' + filtered.length + ' products (Total: ' + all.length + ')';
    }

    if (activePills) {
      var chips = [];
      if (state.category !== 'all') {
        var catName = CATEGORY_NAMES[state.category] || state.category;
        chips.push(
          '<span class="chip">' +
          '  <span>Category: ' + escape(catName) + '</span>' +
          '  <button type="button" class="chip__remove" data-remove-filter="category" aria-label="Remove category filter">' + getIcon('close') + '</button>' +
          '</span>'
        );
      }
      if (state.space !== 'all') {
        var spName = SPACE_NAMES[state.space] || state.space;
        chips.push(
          '<span class="chip">' +
          '  <span>Space: ' + escape(spName) + '</span>' +
          '  <button type="button" class="chip__remove" data-remove-filter="space" aria-label="Remove space filter">' + getIcon('close') + '</button>' +
          '</span>'
        );
      }
      if (state.search) {
        chips.push(
          '<span class="chip">' +
          '  <span>Search: "' + escape(state.search) + '"</span>' +
          '  <button type="button" class="chip__remove" data-remove-filter="search" aria-label="Clear search">' + getIcon('close') + '</button>' +
          '</span>'
        );
      }
      if (state.maxPrice < MAX_CATALOG_PRICE) {
        chips.push(
          '<span class="chip">' +
          '  <span>Max: ' + utils.formatPKR(state.maxPrice) + '</span>' +
          '  <button type="button" class="chip__remove" data-remove-filter="price" aria-label="Reset price filter">' + getIcon('close') + '</button>' +
          '</span>'
        );
      }
      if (state.inStockOnly) {
        chips.push(
          '<span class="chip">' +
          '  <span>In Stock Only</span>' +
          '  <button type="button" class="chip__remove" data-remove-filter="stock" aria-label="Remove in stock filter">' + getIcon('close') + '</button>' +
          '</span>'
        );
      }
      if (state.giftReadyOnly) {
        chips.push(
          '<span class="chip">' +
          '  <span>Gift-Ready</span>' +
          '  <button type="button" class="chip__remove" data-remove-filter="gift" aria-label="Remove gift-ready filter">' + getIcon('close') + '</button>' +
          '</span>'
        );
      }

      if (chips.length > 0) {
        chips.push('<button type="button" class="btn btn-outline" id="clear-all-chips-btn" style="padding:2px 8px;font-size:var(--text-xs);">Clear All</button>');
      }

      activePills.innerHTML = chips.join(' ');

      // Chip remove click handlers
      activePills.querySelectorAll('[data-remove-filter]').forEach(function (btn) {
        btn.onclick = function () {
          var type = btn.getAttribute('data-remove-filter');
          if (type === 'category') {
            state.category = 'all';
            var cSelect = document.getElementById('shop-category-select');
            if (cSelect) cSelect.value = 'all';
          } else if (type === 'space') {
            state.space = 'all';
            var spSelect = document.getElementById('shop-space-select');
            if (spSelect) spSelect.value = 'all';
          } else if (type === 'search') {
            state.search = '';
            var sInput = document.getElementById('shop-search-input');
            if (sInput) sInput.value = '';
          } else if (type === 'price') {
            state.maxPrice = MAX_CATALOG_PRICE;
            var pRange = document.getElementById('shop-price-range');
            var pLabel = document.getElementById('shop-price-label');
            if (pRange) pRange.value = MAX_CATALOG_PRICE;
            if (pLabel) pLabel.textContent = 'Up to ' + utils.formatPKR(MAX_CATALOG_PRICE);
          } else if (type === 'stock') {
            state.inStockOnly = false;
            var stCb = document.getElementById('shop-stock-checkbox');
            if (stCb) stCb.checked = false;
          } else if (type === 'gift') {
            state.giftReadyOnly = false;
            var gCb = document.getElementById('shop-gift-checkbox');
            if (gCb) gCb.checked = false;
          }
          syncURL();
          applyFilters();
        };
      });

      var clearAllBtn = document.getElementById('clear-all-chips-btn');
      if (clearAllBtn) {
        clearAllBtn.onclick = resetFilters;
      }
    }

    gridEl.classList.toggle('product-grid--list', state.view === 'list');

    if (filtered.length === 0) {
      gridEl.innerHTML = [
        '<div class="empty-state" style="grid-column:1/-1;padding:var(--space-12) var(--space-4);text-align:center;">',
        '  <h3 class="empty-state__title" style="font-family:var(--font-display);font-size:var(--text-2xl);margin-bottom:var(--space-2);">No products match your filter criteria</h3>',
        '  <p class="empty-state__desc" style="color:var(--color-text-muted);margin-bottom:var(--space-6);">Try broadening your search term or clearing active filters to browse the full Potohar collection.</p>',
        '  <button type="button" class="btn btn-primary" id="empty-reset-filters-btn">Clear All Filters</button>',
        '</div>'
      ].join('');
      var resetBtn = document.getElementById('empty-reset-filters-btn');
      if (resetBtn) resetBtn.onclick = resetFilters;
    } else {
      var visible = filtered.slice(0, state.limit);
      gridEl.innerHTML = visible.map(renderProductCard).join('\n');
    }

    if (loadMoreBtn) {
      loadMoreBtn.style.display = filtered.length > state.limit ? 'inline-flex' : 'none';
    }

    // Attach card actions
    gridEl.querySelectorAll('[data-add-cart]').forEach(function (btn) {
      btn.onclick = function () {
        var slug = btn.getAttribute('data-add-cart');
        var hasVariants = btn.getAttribute('data-has-variants') === 'true';

        if (hasVariants) {
          // Open quick view modal for variant selection
          if (window.openQuickView) {
            window.openQuickView(slug);
          } else {
            window.location.href = 'product.html?slug=' + encodeURIComponent(slug);
          }
        } else {
          // Instant 1-tap add for single variant
          if (window.FloraMeshCart) {
            window.FloraMeshCart.addItem(slug, null, 1);
          }
        }
      };
    });

    gridEl.querySelectorAll('[data-quick-view]').forEach(function (btn) {
      btn.onclick = function () {
        var slug = btn.getAttribute('data-quick-view');
        if (window.openQuickView) window.openQuickView(slug);
      };
    });
  }

  function resetFilters() {
    state.search = '';
    state.category = 'all';
    state.space = 'all';
    state.type = 'all';
    state.inStockOnly = false;
    state.giftReadyOnly = false;
    state.maxPrice = MAX_CATALOG_PRICE;
    state.sort = 'featured';
    state.limit = 12;

    var sInput = document.getElementById('shop-search-input');
    var cSelect = document.getElementById('shop-category-select');
    var spSelect = document.getElementById('shop-space-select');
    var pRange = document.getElementById('shop-price-range');
    var pLabel = document.getElementById('shop-price-label');
    var sortSelect = document.getElementById('shop-sort-select');
    var stCb = document.getElementById('shop-stock-checkbox');
    var gCb = document.getElementById('shop-gift-checkbox');

    if (sInput) sInput.value = '';
    if (cSelect) cSelect.value = 'all';
    if (spSelect) spSelect.value = 'all';
    if (pRange) pRange.value = MAX_CATALOG_PRICE;
    if (pLabel) pLabel.textContent = 'Up to ' + (window.FloraMeshUtils ? window.FloraMeshUtils.formatPKR(MAX_CATALOG_PRICE) : 'Rs ' + MAX_CATALOG_PRICE);
    if (sortSelect) sortSelect.value = 'featured';
    if (stCb) stCb.checked = false;
    if (gCb) gCb.checked = false;

    syncURL();
    applyFilters();
  }

  function initShopFilters() {
    var gridEl = document.getElementById('shop-product-grid');
    if (!gridEl) return;

    var params = new URLSearchParams(window.location.search);
    if (params.get('category')) state.category = params.get('category');
    if (params.get('space')) state.space = params.get('space');
    if (params.get('type')) state.type = params.get('type');
    if (params.get('stock') === '1') state.inStockOnly = true;
    if (params.get('gift') === '1') state.giftReadyOnly = true;
    if (params.get('q')) state.search = params.get('q');
    if (params.get('max')) state.maxPrice = parseInt(params.get('max'), 10) || MAX_CATALOG_PRICE;
    if (params.get('sort')) state.sort = params.get('sort');

    var sInput = document.getElementById('shop-search-input');
    var cSelect = document.getElementById('shop-category-select');
    var spSelect = document.getElementById('shop-space-select');
    var pRange = document.getElementById('shop-price-range');
    var pLabel = document.getElementById('shop-price-label');
    var sortSelect = document.getElementById('shop-sort-select');
    var clearBtn = document.getElementById('shop-clear-filters-btn');
    var loadMoreBtn = document.getElementById('shop-load-more-btn');
    var viewGridBtn = document.getElementById('shop-view-grid-btn');
    var viewListBtn = document.getElementById('shop-view-list-btn');
    var stCb = document.getElementById('shop-stock-checkbox');
    var gCb = document.getElementById('shop-gift-checkbox');

    var utils = window.FloraMeshUtils || {};

    if (sInput) {
      sInput.value = state.search;
      var handleSearch = function (e) {
        state.search = e.target.value;
        state.limit = 12;
        syncURL();
        applyFilters();
      };
      sInput.addEventListener('input', utils.debounce ? utils.debounce(handleSearch, 200) : handleSearch);
    }

    if (cSelect) {
      cSelect.value = state.category;
      cSelect.addEventListener('change', function (e) {
        state.category = e.target.value;
        state.limit = 12;
        syncURL();
        applyFilters();
      });
    }

    if (spSelect) {
      spSelect.value = state.space;
      spSelect.addEventListener('change', function (e) {
        state.space = e.target.value;
        state.limit = 12;
        syncURL();
        applyFilters();
      });
    }

    if (pRange) {
      pRange.max = MAX_CATALOG_PRICE;
      pRange.value = state.maxPrice;
      if (pLabel) pLabel.textContent = 'Up to ' + utils.formatPKR(state.maxPrice);
      pRange.addEventListener('input', function (e) {
        state.maxPrice = parseInt(e.target.value, 10) || MAX_CATALOG_PRICE;
        if (pLabel) pLabel.textContent = 'Up to ' + utils.formatPKR(state.maxPrice);
        syncURL();
        applyFilters();
      });
    }

    if (stCb) {
      stCb.checked = state.inStockOnly;
      stCb.addEventListener('change', function (e) {
        state.inStockOnly = e.target.checked;
        syncURL();
        applyFilters();
      });
    }

    if (gCb) {
      gCb.checked = state.giftReadyOnly;
      gCb.addEventListener('change', function (e) {
        state.giftReadyOnly = e.target.checked;
        syncURL();
        applyFilters();
      });
    }

    if (sortSelect) {
      sortSelect.value = state.sort;
      sortSelect.addEventListener('change', function (e) {
        state.sort = e.target.value;
        syncURL();
        applyFilters();
      });
    }

    if (clearBtn) clearBtn.addEventListener('click', resetFilters);

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () {
        state.limit += 12;
        applyFilters();
      });
    }

    if (viewGridBtn && viewListBtn) {
      viewGridBtn.setAttribute('aria-pressed', state.view === 'grid' ? 'true' : 'false');
      viewListBtn.setAttribute('aria-pressed', state.view === 'list' ? 'true' : 'false');

      viewGridBtn.addEventListener('click', function () {
        state.view = 'grid';
        viewGridBtn.setAttribute('aria-pressed', 'true');
        viewListBtn.setAttribute('aria-pressed', 'false');
        applyFilters();
      });
      viewListBtn.addEventListener('click', function () {
        state.view = 'list';
        viewGridBtn.setAttribute('aria-pressed', 'false');
        viewListBtn.setAttribute('aria-pressed', 'true');
        applyFilters();
      });
    }

    // Connect mobile filter sheet with FloraMeshUI.DialogManager
    var openFiltersBtn = document.getElementById('open-filters-sheet-btn');
    var closeFiltersBtn = document.getElementById('close-filters-sheet-btn');
    if (openFiltersBtn) {
      openFiltersBtn.onclick = function () {
        if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
          window.FloraMeshUI.DialogManager.open('shop-sidebar', openFiltersBtn);
        } else {
          var sidebar = document.getElementById('shop-sidebar');
          if (sidebar) sidebar.classList.add('is-open');
        }
      };
    }
    if (closeFiltersBtn) {
      closeFiltersBtn.onclick = function () {
        if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
          window.FloraMeshUI.DialogManager.close('shop-sidebar');
        } else {
          var sidebar = document.getElementById('shop-sidebar');
          if (sidebar) sidebar.classList.remove('is-open');
        }
      };
    }

    applyFilters();
  }

  window.FloraMeshFilters = {
    renderProductCard: renderProductCard,
    initShopFilters: initShopFilters,
    resetFilters: resetFilters,
    getMaxPrice: getMaxCatalogPrice
  };
})();
