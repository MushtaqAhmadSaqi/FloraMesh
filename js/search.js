/**
 * FloraMesh Command Palette & Search Overlay (js/search.js)
 * High-speed tokenized catalog search with keyboard shortcuts (/ or Cmd/Ctrl+K),
 * recent search memory in localStorage, popular category chips, and ARIA combobox pattern.
 * 100% file:// compatible, zero external dependencies.
 */
(function () {
  'use strict';

  var RECENT_KEY = 'floramesh_recent_searches_v1';
  var MAX_RECENTS = 5;
  var activeIndex = -1;

  var POPULAR_CHIPS = [
    { label: 'Balcony Oasis', query: 'balcony' },
    { label: 'IoT Sensors', query: 'sensor' },
    { label: 'Taxila Planters', query: 'taxila' },
    { label: 'Multani Pottery', query: 'multani' },
    { label: 'Heirloom Seeds', query: 'seed' }
  ];

  function getRecentSearches() {
    try {
      var raw = localStorage.getItem(RECENT_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(function (item) { return typeof item === 'string' && item.length > 0; }) : [];
    } catch (e) {
      return [];
    }
  }

  function saveRecentSearch(term) {
    if (!term || typeof term !== 'string') return;
    term = term.trim();
    if (term.length < 2) return;
    try {
      var list = getRecentSearches();
      list = list.filter(function (item) {
        return item.toLowerCase() !== term.toLowerCase();
      });
      list.unshift(term);
      if (list.length > MAX_RECENTS) list = list.slice(0, MAX_RECENTS);
      localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function clearRecentSearches() {
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch (e) {}
    renderRecentChips();
  }

  var URDU_FOLK_MAP = {
    'kachnar': ['amaltas', 'tree', 'bauhinia', 'csr'],
    'کچنار': ['kachnar', 'amaltas', 'csr-token', 'tree'],
    'amaltas': ['kachnar', 'tree', 'cassia', 'csr'],
    'املتاس': ['amaltas', 'tree', 'csr-token'],
    'neem': ['neem', 'organic', 'tree'],
    'نیم': ['neem', 'tree'],
    'sukhchain': ['sukhchain', 'pongamia', 'tree'],
    'سکھ چین': ['sukhchain', 'tree'],
    'chir': ['chir', 'pine', 'tree'],
    'چیل': ['chir', 'pine'],
    'motia': ['jasmine', 'balcony', 'fragrant'],
    'موتیا': ['motia', 'jasmine', 'balcony'],
    'chameli': ['jasmine', 'balcony'],
    'چمیلی': ['chameli', 'jasmine'],
    'podina': ['mint', 'herb', 'kitchen'],
    'پودینہ': ['podina', 'mint', 'kitchen'],
    'dhania': ['coriander', 'herb', 'kitchen'],
    'دھنیا': ['dhania', 'coriander', 'kitchen'],
    'taxila': ['pottery', 'terracotta', 'planter'],
    'ٹیکسلا': ['taxila', 'pottery', 'terracotta'],
    'multani': ['glazed', 'blue', 'ceramics', 'pottery'],
    'ملتانی': ['multani', 'ceramics', 'pottery'],
    'mitti': ['potting', 'soil', 'organic'],
    'مٹی': ['soil', 'potting', 'organic'],
    'gamla': ['pot', 'planter', 'terracotta'],
    'گملہ': ['gamla', 'pot', 'planter'],
    'khad': ['compost', 'fertilizer', 'organic'],
    'کھاد': ['khad', 'compost', 'organic']
  };

  function searchProducts(query) {
    if (!query) return [];
    var cleanQ = query.trim().toLowerCase();
    var tokens = cleanQ.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    var products = window.FLORAMESH_PRODUCTS || [];

    // Check if tokens map to Urdu folk terms
    var expandedSynonyms = [];
    tokens.forEach(function (t) {
      if (URDU_FOLK_MAP[t]) {
        expandedSynonyms = expandedSynonyms.concat(URDU_FOLK_MAP[t]);
      }
    });

    var scored = [];

    products.forEach(function (p) {
      var sku = (p.sku || '').toLowerCase();
      var name = (p.name || '').toLowerCase();
      var shortName = (p.shortName || '').toLowerCase();
      var category = (p.category || '').toLowerCase();
      var spaces = (p.spaces || []).map(function (s) { return String(s).toLowerCase(); });
      var tags = (p.tags || []).map(function (t) { return String(t).toLowerCase(); });
      var desc = [p.shortDescription || '', p.description || '', p.materials || ''].join(' ').toLowerCase();

      var haystack = [sku, name, shortName, category, spaces.join(' '), tags.join(' '), desc].join(' ');

      // Check match: all tokens present OR expanded folk synonyms match
      var matchesAllTokens = tokens.every(function (t) {
        return haystack.indexOf(t) !== -1;
      });

      var matchesFolk = expandedSynonyms.length > 0 && expandedSynonyms.some(function (syn) {
        return haystack.indexOf(syn) !== -1;
      });

      if (!matchesAllTokens && !matchesFolk) return;

      var score = 0;

      // 1. Exact SKU match (highest priority)
      if (sku === cleanQ) {
        score += 1000;
      } else if (sku.indexOf(cleanQ) !== -1) {
        score += 600;
      } else if (tokens.some(function (t) { return sku.indexOf(t) !== -1; })) {
        score += 400;
      }

      // 2. Exact Title or ShortName match
      if (shortName === cleanQ || name === cleanQ) {
        score += 500;
      } else if (shortName.indexOf(cleanQ) !== -1 || name.indexOf(cleanQ) !== -1) {
        score += 300;
      } else if (tokens.every(function (t) { return shortName.indexOf(t) !== -1; })) {
        score += 200;
      }

      // 3. Urdu Folk Name match
      if (matchesFolk) {
        score += 250;
      }

      // 4. Space tags prioritization
      tokens.forEach(function (t) {
        if (spaces.indexOf(t) !== -1) score += 180;
      });

      // 5. Category match
      if (category.indexOf(cleanQ) !== -1) {
        score += 120;
      }

      // 6. Featured product boost
      if (p.featured) {
        score += 50;
      }

      scored.push({ product: p, score: score });
    });

    // Sort descending by score
    scored.sort(function (a, b) {
      return b.score - a.score;
    });

    return scored.map(function (item) {
      return item.product;
    });
  }

  function renderRecentChips() {
    var container = document.getElementById('search-recent-chips');
    if (!container) return;

    var recents = getRecentSearches();
    if (recents.length === 0) {
      container.innerHTML = '<span class="search-empty-hint">No recent searches</span>';
      var clearBtn = document.getElementById('search-clear-recents-btn');
      if (clearBtn) clearBtn.style.display = 'none';
      return;
    }

    var clearBtn = document.getElementById('search-clear-recents-btn');
    if (clearBtn) clearBtn.style.display = 'inline-flex';

    var utils = window.FloraMeshUtils || {};
    var renderHtml = utils.html || function () { return ''; };

    container.innerHTML = recents.map(function (item) {
      return utils.html ? utils.html`<button type="button" class="search-chip search-chip--recent" data-search-term="${item}">${item}</button>` :
        ('<button type="button" class="search-chip search-chip--recent" data-search-term="' + (utils.escapeAttr ? utils.escapeAttr(item) : item) + '">' + (utils.escapeHTML ? utils.escapeHTML(item) : item) + '</button>');
    }).join('');

    container.querySelectorAll('.search-chip--recent').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById('search-overlay-input');
        if (input) {
          input.value = btn.getAttribute('data-search-term') || '';
          performSearch(input.value);
          input.focus();
        }
      });
    });
  }

  function renderPopularChips() {
    var container = document.getElementById('search-popular-chips');
    if (!container) return;

    var utils = window.FloraMeshUtils || {};
    container.innerHTML = POPULAR_CHIPS.map(function (chip) {
      return utils.html ? utils.html`<button type="button" class="search-chip search-chip--popular" data-search-term="${chip.query}">${chip.label}</button>` :
        ('<button type="button" class="search-chip search-chip--popular" data-search-term="' + chip.query + '">' + chip.label + '</button>');
    }).join('');

    container.querySelectorAll('.search-chip--popular').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById('search-overlay-input');
        if (input) {
          input.value = btn.getAttribute('data-search-term') || '';
          performSearch(input.value);
          input.focus();
        }
      });
    });
  }

  function performSearch(query) {
    var resultsContainer = document.getElementById('search-results-list');
    var countBadge = document.getElementById('search-result-count');
    var defaultView = document.getElementById('search-default-view');
    var resultsView = document.getElementById('search-results-view');
    var utils = window.FloraMeshUtils || {};

    query = (query || '').trim();
    activeIndex = -1;

    if (query.length < 2) {
      if (defaultView) defaultView.style.display = 'block';
      if (resultsView) resultsView.style.display = 'none';
      if (countBadge) countBadge.textContent = '';
      if (resultsContainer) resultsContainer.innerHTML = '';
      return;
    }

    if (defaultView) defaultView.style.display = 'none';
    if (resultsView) resultsView.style.display = 'block';

    var matches = searchProducts(query);
    if (countBadge) {
      countBadge.textContent = matches.length + ' ' + (matches.length === 1 ? 'result' : 'results');
    }

    if (!resultsContainer) return;

    if (matches.length === 0) {
      resultsContainer.innerHTML = utils.html ? utils.html`
        <div class="search-no-results">
          <p class="search-no-results__title">No items found matching "${query}"</p>
          <p class="search-no-results__desc">Try checking your spelling or search for "balcony", "sensor", or "pottery".</p>
          <a href="shop.html" class="btn btn-outline" style="margin-top:1rem;">Browse Entire Catalog</a>
        </div>
      ` : [
        '<div class="search-no-results">',
        '  <p class="search-no-results__title">No items found matching "' + (utils.escapeHTML ? utils.escapeHTML(query) : query) + '"</p>',
        '  <p class="search-no-results__desc">Try checking your spelling or search for "balcony", "sensor", or "pottery".</p>',
        '  <a href="shop.html" class="btn btn-outline" style="margin-top:1rem;">Browse Entire Catalog</a>',
        '</div>'
      ].join('');
      return;
    }

    var displayMatches = matches.slice(0, 8);
    var renderedCards = displayMatches.map(function (p, idx) {
      var price = (p.variants && p.variants[0]) ? p.variants[0].price : (p.salePrice || p.price);
      var comparePrice = (p.variants && p.variants[0]) ? p.variants[0].compareAtPrice : p.compareAtPrice;
      var imgSrc = (p.images && p.images[0]) ? p.images[0].src : '';
      var title = p.shortName || p.name;
      var hasDiscount = (comparePrice && comparePrice > price);

      if (utils.html) {
        var compareMarkup = hasDiscount ? utils.rawHTML(utils.html`<span class="search-result-card__compare">${utils.formatPKR(comparePrice)}</span>`) : '';
        var imgMarkup = imgSrc ? utils.rawHTML(utils.html`<img src="${imgSrc}" alt="${p.name}" loading="lazy" width="60" height="75">`) : '';

        return utils.html`
          <a href="product.html?slug=${p.slug}" class="search-result-card" role="option" id="search-opt-${idx}" data-slug="${p.slug}">
            <div class="search-result-card__media">
              ${imgMarkup}
            </div>
            <div class="search-result-card__content">
              <span class="search-result-card__taxo">${p.category || 'Collection'}</span>
              <h4 class="search-result-card__title">${title}</h4>
              <div class="search-result-card__price">
                <span class="search-result-card__current">${utils.formatPKR(price)}</span>
                ${compareMarkup}
              </div>
            </div>
            <span class="search-result-card__arrow" aria-hidden="true">&rarr;</span>
          </a>
        `;
      }

      return [
        '<a href="product.html?slug=' + encodeURIComponent(p.slug) + '" class="search-result-card" role="option" id="search-opt-' + idx + '" data-slug="' + (utils.escapeAttr ? utils.escapeAttr(p.slug) : p.slug) + '">' ,
        '  <div class="search-result-card__media">',
        imgSrc ? '    <img src="' + (utils.escapeAttr ? utils.escapeAttr(imgSrc) : imgSrc) + '" alt="' + (utils.escapeAttr ? utils.escapeAttr(p.name) : p.name) + '" loading="lazy" width="60" height="75">' : '',
        '  </div>',
        '  <div class="search-result-card__content">',
        '    <span class="search-result-card__taxo">' + (utils.escapeHTML ? utils.escapeHTML(p.category || 'Collection') : p.category) + '</span>',
        '    <h4 class="search-result-card__title">' + (utils.escapeHTML ? utils.escapeHTML(title) : title) + '</h4>',
        '    <div class="search-result-card__price">',
        '      <span class="search-result-card__current">' + (utils.formatPKR ? utils.formatPKR(price) : price) + '</span>',
        hasDiscount ? '      <span class="search-result-card__compare">' + (utils.formatPKR ? utils.formatPKR(comparePrice) : comparePrice) + '</span>' : '',
        '    </div>',
        '  </div>',
        '  <span class="search-result-card__arrow" aria-hidden="true">&rarr;</span>',
        '</a>'
      ].join('');
    }).join('');

    var moreMarkup = '';
    if (matches.length > 8) {
      moreMarkup = utils.html ? utils.html`
        <div class="search-results-more">
          <a href="shop.html?q=${encodeURIComponent(query)}" class="search-view-all-link">
            View all ${matches.length} results in catalog &rarr;
          </a>
        </div>
      ` : (
        '<div class="search-results-more">' +
        '  <a href="shop.html?q=' + encodeURIComponent(query) + '" class="search-view-all-link">' +
        '    View all ' + matches.length + ' results in catalog &rarr;' +
        '  </a>' +
        '</div>'
      );
    }

    resultsContainer.innerHTML = renderedCards + moreMarkup;

    // Attach click listeners cleanly to search result links
    resultsContainer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        saveCurrentInput();
      });
    });
  }

  function handleKeyNav(e) {
    var resultsContainer = document.getElementById('search-results-list');
    if (!resultsContainer) return;
    var cards = resultsContainer.querySelectorAll('.search-result-card');
    if (cards.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % cards.length;
      updateActiveCard(cards);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + cards.length) % cards.length;
      updateActiveCard(cards);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < cards.length) {
        e.preventDefault();
        saveCurrentInput();
        cards[activeIndex].click();
      } else {
        saveCurrentInput();
      }
    }
  }

  function updateActiveCard(cards) {
    cards.forEach(function (c, idx) {
      if (idx === activeIndex) {
        c.classList.add('is-active');
        c.scrollIntoView({ block: 'nearest' });
      } else {
        c.classList.remove('is-active');
      }
    });
  }

  function saveCurrentInput() {
    var input = document.getElementById('search-overlay-input');
    if (input && input.value) {
      saveRecentSearch(input.value);
    }
  }

  function openSearch(triggerEl) {
    var dialog = document.getElementById('search-dialog');
    if (!dialog) return;

    if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
      window.FloraMeshUI.DialogManager.open('search-dialog', triggerEl);
    } else {
      dialog.classList.add('is-open');
    }

    renderRecentChips();
    renderPopularChips();

    var input = document.getElementById('search-overlay-input');
    if (input) {
      input.value = '';
      performSearch('');
      setTimeout(function () { input.focus(); }, 80);
    }
  }

  function closeSearch() {
    if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
      window.FloraMeshUI.DialogManager.close('search-dialog');
    } else {
      var dialog = document.getElementById('search-dialog');
      if (dialog) dialog.classList.remove('is-open');
    }
  }

  function init() {
    // Global keyboard shortcut: '/' or 'Cmd/Ctrl+K'
    document.addEventListener('keydown', function (e) {
      var targetTag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      var isEditable = targetTag === 'input' || targetTag === 'textarea' || (e.target && e.target.isContentEditable);

      if ((e.key === '/' && !isEditable) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        openSearch();
      }
    });

    // Wire trigger buttons
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-open-search]');
      if (trigger) {
        e.preventDefault();
        openSearch(trigger);
      }
      var closer = e.target.closest('[data-close-search]');
      if (closer) {
        e.preventDefault();
        closeSearch();
      }
      var clearRecents = e.target.closest('#search-clear-recents-btn');
      if (clearRecents) {
        e.preventDefault();
        clearRecentSearches();
      }
    });

    var input = document.getElementById('search-overlay-input');
    if (input) {
      var utils = window.FloraMeshUtils || {};
      var debounced = utils.debounce ? utils.debounce(function () {
        performSearch(input.value);
      }, 120) : function () { performSearch(input.value); };

      input.addEventListener('input', debounced);
      input.addEventListener('keydown', handleKeyNav);
    }
  }

  window.FloraMeshSearch = {
    init: init,
    open: openSearch,
    close: closeSearch,
    recordSearch: saveCurrentInput,
    searchProducts: searchProducts
  };
})();
