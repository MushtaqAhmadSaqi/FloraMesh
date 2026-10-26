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
      return raw ? JSON.parse(raw) : [];
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

  function searchProducts(query) {
    if (!query) return [];
    var tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    var products = window.FLORAMESH_PRODUCTS || [];
    return products.filter(function (p) {
      var haystack = [
        p.name || '',
        p.shortName || '',
        p.category || '',
        p.shortDescription || '',
        (p.spaces || []).join(' '),
        (p.tags || []).join(' ')
      ].join(' ').toLowerCase();

      return tokens.every(function (t) {
        return haystack.indexOf(t) !== -1;
      });
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

    container.innerHTML = recents.map(function (item) {
      var safe = (window.FloraMeshUtils && window.FloraMeshUtils.escapeHTML) ? window.FloraMeshUtils.escapeHTML(item) : item;
      return '<button type="button" class="search-chip search-chip--recent" data-search-term="' + safe + '">' +
             safe +
             '</button>';
    }).join('');

    container.querySelectorAll('.search-chip--recent').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById('search-overlay-input');
        if (input) {
          input.value = btn.getAttribute('data-search-term');
          performSearch(input.value);
          input.focus();
        }
      });
    });
  }

  function renderPopularChips() {
    var container = document.getElementById('search-popular-chips');
    if (!container) return;

    container.innerHTML = POPULAR_CHIPS.map(function (chip) {
      return '<button type="button" class="search-chip search-chip--popular" data-search-term="' + chip.query + '">' +
             chip.label +
             '</button>';
    }).join('');

    container.querySelectorAll('.search-chip--popular').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById('search-overlay-input');
        if (input) {
          input.value = btn.getAttribute('data-search-term');
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
      resultsContainer.innerHTML = [
        '<div class="search-no-results">',
        '  <p class="search-no-results__title">No items found matching "' + utils.escapeHTML(query) + '"</p>',
        '  <p class="search-no-results__desc">Try checking your spelling or search for "balcony", "sensor", or "pottery".</p>',
        '  <a href="shop.html" class="btn btn-outline" style="margin-top:1rem;">Browse Entire Catalog</a>',
        '</div>'
      ].join('');
      return;
    }

    var displayMatches = matches.slice(0, 8);
    resultsContainer.innerHTML = displayMatches.map(function (p, idx) {
      var price = (p.variants && p.variants[0]) ? p.variants[0].price : (p.salePrice || p.price);
      var comparePrice = (p.variants && p.variants[0]) ? p.variants[0].compareAtPrice : p.compareAtPrice;
      var imgSrc = (p.images && p.images[0]) ? p.images[0].src : '';
      var title = p.shortName || p.name;

      return [
        '<a href="product.html?slug=' + p.slug + '" class="search-result-card" role="option" id="search-opt-' + idx + '" data-slug="' + p.slug + '" onclick="FloraMeshSearch.recordSearch()">' ,
        '  <div class="search-result-card__media">',
        imgSrc ? '    <img src="' + imgSrc + '" alt="' + utils.escapeAttr(p.name) + '" loading="lazy" width="60" height="75">' : '',
        '  </div>',
        '  <div class="search-result-card__content">',
        '    <span class="search-result-card__taxo">' + utils.escapeHTML(p.category || 'Collection') + '</span>',
        '    <h4 class="search-result-card__title">' + utils.escapeHTML(title) + '</h4>',
        '    <div class="search-result-card__price">',
        '      <span class="search-result-card__current">' + utils.formatPKR(price) + '</span>',
        (comparePrice && comparePrice > price) ? '      <span class="search-result-card__compare">' + utils.formatPKR(comparePrice) + '</span>' : '',
        '    </div>',
        '  </div>',
        '  <span class="search-result-card__arrow" aria-hidden="true">&rarr;</span>',
        '</a>'
      ].join('');
    }).join('') +
    (matches.length > 8 ? [
      '<div class="search-results-more">',
      '  <a href="shop.html?q=' + encodeURIComponent(query) + '" class="search-view-all-link" onclick="FloraMeshSearch.recordSearch()">',
      '    View all ' + matches.length + ' results in catalog &rarr;',
      '  </a>',
      '</div>'
    ].join('') : '');
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
    recordSearch: saveCurrentInput
  };
})();
