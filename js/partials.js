/**
 * FloraMesh Shared Header, Mega-Menu, Mobile Sheet, Search Overlay, and Editorial Footer (js/partials.js)
 * Compatible with direct file:// execution (no fetch() or ES modules required).
 * 100% token-driven, accessible, responsive, and synchronized with FloraMeshUI & FloraMeshSearch.
 */
(function () {
  'use strict';

  function getActiveRoute() {
    var pathname = window.location.pathname.split('/').pop() || 'index.html';
    var search = window.location.search || '';
    var params = new URLSearchParams(search);
    var category = params.get('category');

    if (pathname === 'shop.html' && category === 'smart-monitoring') return 'iot-sensors';
    if (pathname === 'shop.html' && category === 'planting-services') return 'services';
    if (pathname === 'shop.html' && category === 'community-csr') return 'csr-gifting';
    if (pathname === 'product.html' || pathname === 'shop.html') return 'shop';
    if (pathname === 'about.html') return 'about';
    if (pathname === 'faq.html') return 'faq';
    if (pathname === 'contact.html') return 'contact';
    if (pathname === 'cart.html') return 'cart';
    if (pathname === 'checkout.html') return 'checkout';
    if (pathname === 'wishlist.html') return 'wishlist';
    if (pathname === 'compare.html') return 'compare';
    if (pathname === 'my-account.html') return 'account';
    if (pathname === 'accessibility.html') return 'accessibility';
    if (pathname === 'sitemap.html') return 'sitemap';
    if (pathname === 'privacy.html') return 'privacy';
    if (pathname === 'terms.html') return 'terms';
    if (pathname === 'shipping-returns.html') return 'shipping';
    if (pathname === '404.html') return '404';
    return 'home';
  }

  function getSavedCity() {
    try {
      return localStorage.getItem('floramesh_city_v1') || 'Islamabad';
    } catch (e) {
      return 'Islamabad';
    }
  }

  function setSavedCity(city) {
    try {
      localStorage.setItem('floramesh_city_v1', city);
    } catch (e) {}
    var label = document.getElementById('header-city-label');
    if (label) label.textContent = city;
    var mobileLabel = document.getElementById('mobile-city-label');
    if (mobileLabel) mobileLabel.textContent = city;
  }

  function renderHeader() {
    var headerTarget = document.getElementById('site-header-mount');
    if (!headerTarget) return;

    var active = getActiveRoute();
    var utils = window.FloraMeshUtils || {};
    var icons = window.FloraMeshIcons || {};
    var getIcon = function (name, cls, label) {
      if (icons.get) return icons.get(name, cls, label);
      if (utils.getIcon) return utils.getIcon(name, cls);
      return '';
    };

    var currentTheme = (utils.getCurrentTheme && utils.getCurrentTheme()) || 'heritage';
    var isDark = currentTheme === 'midnight';
    var logoSrc = isDark ? 'assets/images/brand/floramesh-logo-dark.svg' : 'assets/images/brand/floramesh-logo.svg';
    var selectedCity = getSavedCity();

    var storageKeyDismiss = (window.FLORAMESH_CONFIG && window.FLORAMESH_CONFIG.storageKeys && window.FLORAMESH_CONFIG.storageKeys.announcementDismissed) || 'floramesh_announcement_dismissed_v1';
    var isDismissed = false;
    try {
      isDismissed = localStorage.getItem(storageKeyDismiss) === 'true';
    } catch (e) {}

    var announcementHtml = isDismissed ? '' : [
      '<div class="announcement-bar" id="site-announcement-bar" role="region" aria-label="Seasonal Announcement">',
      '  <div class="announcement-bar__inner">',
      '    <div class="announcement-bar__content">',
      '      <span class="announcement-bar__tag">Monsoon Advisory</span>',
      '      <span>Free on-site telemetry calibration with every turnkey balcony kit &bull; Islamabad &amp; Rawalpindi</span>',
      '    </div>',
      '    <div class="announcement-bar__actions">',
      '      <a href="shipping-returns.html" class="announcement-bar__link">Free delivery over Rs 10,000</a>',
      '      <button type="button" class="announcement-bar__close" id="dismiss-announcement-btn" aria-label="Dismiss seasonal announcement">',
      getIcon('close'),
      '      </button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    headerTarget.innerHTML = [
      announcementHtml,
      '<header class="site-header" id="site-header">',
      '  <div class="container site-header__inner">',
      '    <!-- Brand Logo -->',
      '    <a href="index.html" class="site-header__logo" aria-label="FloraMesh Home — Smart Urban Landscaping & Connected Care">',
      '      <img src="' + logoSrc + '" alt="FloraMesh — Islamabad &amp; Rawalpindi" width="170" height="42" id="site-logo-img">',
      '    </a>',
      '    <!-- Regional City Selector Chip -->',
      '    <div class="header-city-pill" id="header-city-toggle" role="button" tabindex="0" aria-label="Delivery location selector" title="Click to toggle city between Islamabad and Rawalpindi">',
      getIcon('mapPin'),
      '      <span class="header-city-text">Delivering to: <strong id="header-city-label">' + selectedCity + '</strong></span>',
      getIcon('chevronDown'),
      '    </div>',
      '    <!-- Primary Desktop Navigation with Mega Menu -->',
      '    <nav class="site-nav" id="primary-navigation" aria-label="Primary Navigation">',
      '      <ul class="site-nav__list">',
      '        <li class="has-mega-menu">',
      '          <a href="shop.html" class="site-nav__link ' + (active === 'shop' ? 'site-nav__link--active' : '') + '" aria-haspopup="true" aria-expanded="false">',
      '            <span>Shop &amp; Services</span>',
      getIcon('chevronDown', 'nav-chevron'),
      '          </a>',
      '          <!-- Desktop Mega Menu Dropdown -->',
      '          <div class="mega-menu" role="region" aria-label="Shop and Services Mega Menu">',
      '            <div class="mega-menu__container">',
      '              <div class="mega-menu__col">',
      '                <h4 class="mega-menu__heading">By Living Space</h4>',
      '                <ul class="mega-menu__list">',
      '                  <li><a href="shop.html?space=balcony"><span class="mega-icon">🌿</span> Balcony Oasis (10–60 sq ft)</a></li>',
      '                  <li><a href="shop.html?space=rooftop"><span class="mega-icon">☀️</span> Rooftop Terraces &amp; Pergolas</a></li>',
      '                  <li><a href="shop.html?space=indoor"><span class="mega-icon">🪴</span> Living Room Biophilic Styling</a></li>',
      '                  <li><a href="shop.html?space=office"><span class="mega-icon">🏢</span> Office Desks &amp; Green Screens</a></li>',
      '                  <li><a href="shop.html?space=kitchen"><span class="mega-icon">🌱</span> Kitchen Herb Raised Beds</a></li>',
      '                </ul>',
      '              </div>',
      '              <div class="mega-menu__col">',
      '                <h4 class="mega-menu__heading">Living Collections</h4>',
      '                <ul class="mega-menu__list">',
      '                  <li><a href="shop.html?category=planting-services">Turnkey Planting Services</a></li>',
      '                  <li><a href="shop.html?category=smart-monitoring">IoT Soil Sensors &amp; Gateway</a></li>',
      '                  <li><a href="shop.html?category=plant-care-supplies">Taxila &amp; Multani Planters</a></li>',
      '                  <li><a href="shop.html?category=learning-hub">Heirloom Seeds &amp; Organic Soil</a></li>',
      '                  <li><a href="shop.html?category=community-csr">Margalla CSR &amp; Gifting</a></li>',
      '                </ul>',
      '              </div>',
      '              <div class="mega-menu__col mega-menu__spotlight">',
      '                <span class="mega-menu__tag">Artisan Craft Spotlight</span>',
      '                <div class="mega-spotlight-card">',
      '                  <img src="assets/images/products/taxila-terracotta-breathable-pot-set-main.webp" alt="Taxila terracotta porous planter pots" width="120" height="90">',
      '                  <div>',
      '                    <h5 class="mega-spotlight-title">Taxila Terracotta Set</h5>',
      '                    <span class="mega-spotlight-price">Rs 4,800</span>',
      '                    <a href="product.html?slug=taxila-terracotta-breathable-pot-set" class="mega-spotlight-link">View Artisan Pots &rarr;</a>',
      '                  </div>',
      '                </div>',
      '              </div>',
      '            </div>',
      '          </div>',
      '        </li>',
      '        <li><a href="shop.html?category=smart-monitoring" class="site-nav__link ' + (active === 'iot-sensors' ? 'site-nav__link--active' : '') + '">IoT Telemetry</a></li>',
      '        <li><a href="shop.html?category=planting-services" class="site-nav__link ' + (active === 'services' ? 'site-nav__link--active' : '') + '">Planting Services</a></li>',
      '        <li><a href="about.html" class="site-nav__link ' + (active === 'about' ? 'site-nav__link--active' : '') + '">Our Story</a></li>',
      '        <li><a href="faq.html" class="site-nav__link ' + (active === 'faq' ? 'site-nav__link--active' : '') + '">Journal &amp; FAQ</a></li>',
      '        <li><a href="contact.html" class="site-nav__link ' + (active === 'contact' ? 'site-nav__link--active' : '') + '">Contact</a></li>',
      '      </ul>',
      '    </nav>',
      '    <!-- Header Action Controls -->',
      '    <div class="site-header__actions">',
      '      <!-- Command Palette Search Trigger -->',
      '      <button type="button" class="header-action-btn header-search-trigger" data-open-search aria-label="Open search catalog (Press / to search)">',
      getIcon('search'),
      '        <span class="header-search-label">Search</span>',
      '        <kbd class="search-kbd" aria-hidden="true">/</kbd>',
      '      </button>',
      '      <!-- Dual Theme Toggle -->',
      '      <button type="button" class="header-action-btn" data-theme-toggle aria-pressed="' + (isDark ? 'true' : 'false') + '" aria-label="' + (isDark ? 'Switch to Heritage Cream theme' : 'Switch to Midnight Grove theme') + '" title="Toggle light/dark theme">',
      isDark ? getIcon('sun') : getIcon('moon'),
      '      </button>',
      '      <!-- Saved Wishlist -->',
      '      <a href="wishlist.html" class="header-action-btn" aria-label="Saved wishlist items" title="View Wishlist">',
      getIcon('heart'),
      '        <span class="header-action-btn__badge is-hidden" id="header-wishlist-count" aria-live="polite">0</span>',
      '      </a>',
      '      <!-- Customer Account -->',
      '      <a href="my-account.html" class="header-action-btn" aria-label="Customer account portal" title="My Account">',
      getIcon('user'),
      '      </a>',
      '      <!-- Slide-Out Cart Trigger -->',
      '      <button type="button" class="header-action-btn header-cart-btn" id="open-cart-drawer-btn" aria-label="Open shopping basket" title="View Basket">',
      getIcon('bag'),
      '        <span class="header-action-btn__badge is-hidden" id="header-cart-count" aria-live="polite">0</span>',
      '      </button>',
      '      <!-- Mobile Menu Toggle Button -->',
      '      <button type="button" class="header-action-btn mobile-menu-toggle" id="mobile-menu-btn" aria-expanded="false" aria-controls="mobile-nav-sheet" aria-label="Open mobile navigation menu">',
      getIcon('menu'),
      '      </button>',
      '    </div>',
      '  </div>',
      '</header>',
      '<!-- Mobile Full-Screen Navigation Sheet -->',
      '<div class="mobile-nav-sheet" id="mobile-nav-sheet" role="dialog" aria-modal="true" aria-label="Mobile Navigation" aria-hidden="true">',
      '  <div class="mobile-nav-sheet__header">',
      '    <a href="index.html" aria-label="FloraMesh Home">',
      '      <img src="' + logoSrc + '" alt="FloraMesh" width="140" height="34">',
      '    </a>',
      '    <button type="button" class="header-action-btn" id="close-mobile-nav-btn" aria-label="Close navigation menu">',
      getIcon('close'),
      '    </button>',
      '  </div>',
      '  <div class="mobile-nav-sheet__body">',
      '    <div class="mobile-city-row" id="mobile-city-toggle" role="button" tabindex="0">',
      getIcon('mapPin'),
      '      <span>Delivering to: <strong id="mobile-city-label">' + selectedCity + '</strong></span>',
      '      <span class="mobile-city-switch">(Tap to switch)</span>',
      '    </div>',
      '    <nav class="mobile-nav-list" aria-label="Mobile Primary Navigation">',
      '      <a href="index.html" class="mobile-nav-link ' + (active === 'home' ? 'is-active' : '') + '">Home</a>',
      '      <a href="shop.html" class="mobile-nav-link ' + (active === 'shop' ? 'is-active' : '') + '">Shop &amp; Services</a>',
      '      <div class="mobile-nav-subgroup">',
      '        <span class="mobile-nav-subgroup__title">By Space</span>',
      '        <div class="mobile-nav-chips">',
      '          <a href="shop.html?space=balcony" class="mobile-chip">Balcony</a>',
      '          <a href="shop.html?space=rooftop" class="mobile-chip">Rooftop</a>',
      '          <a href="shop.html?space=indoor" class="mobile-chip">Living Room</a>',
      '          <a href="shop.html?space=office" class="mobile-chip">Office</a>',
      '        </div>',
      '      </div>',
      '      <a href="shop.html?category=smart-monitoring" class="mobile-nav-link ' + (active === 'iot-sensors' ? 'is-active' : '') + '">IoT Soil Telemetry</a>',
      '      <a href="shop.html?category=planting-services" class="mobile-nav-link ' + (active === 'services' ? 'is-active' : '') + '">Planting Services</a>',
      '      <a href="about.html" class="mobile-nav-link ' + (active === 'about' ? 'is-active' : '') + '">Our Story &amp; Craft</a>',
      '      <a href="faq.html" class="mobile-nav-link ' + (active === 'faq' ? 'is-active' : '') + '">FAQ &amp; Planting Guides</a>',
      '      <a href="contact.html" class="mobile-nav-link ' + (active === 'contact' ? 'is-active' : '') + '">Contact Studio</a>',
      '      <a href="my-account.html" class="mobile-nav-link ' + (active === 'account' ? 'is-active' : '') + '">Account &amp; Telemetry</a>',
      '    </nav>',
      '  </div>',
      '  <div class="mobile-nav-sheet__footer">',
      ((window.FLORAMESH_CONFIG && window.FLORAMESH_CONFIG.contact && window.FLORAMESH_CONFIG.contact.whatsappNumber)
        ? '    <div class="mobile-contact-pill">' + getIcon('whatsapp') + '      <a href="https://wa.me/' + window.FLORAMESH_CONFIG.contact.whatsappNumber + '" target="_blank" rel="noopener">WhatsApp: +' + window.FLORAMESH_CONFIG.contact.whatsappNumber + '</a>    </div>'
        : '    <div class="mobile-contact-pill">' + getIcon('mail') + '      <a href="mailto:hello@floramesh.pk">hello@floramesh.pk</a>    </div>'),
      '    <div class="mobile-currency-note">All prices in PKR (Rs) • Regional Tax Included</div>',
      '  </div>',
      '</div>',
      '<!-- Full-Width Command Palette Search Dialog -->',
      '<dialog class="search-dialog" id="search-dialog" aria-modal="true" aria-label="Search Catalog">',
      '  <div class="search-dialog__box">',
      '    <div class="search-dialog__header">',
      getIcon('search', 'search-dialog__icon'),
      '      <label for="search-overlay-input" class="sr-only">Search products, sensors, and planting services</label>',
      '      <input type="search" id="search-overlay-input" class="search-dialog__input" placeholder="Search plants, IoT sensors, Taxila pottery..." autocomplete="off" spellcheck="false">',
      '      <span class="search-dialog__count" id="search-result-count" aria-live="polite"></span>',
      '      <button type="button" class="search-dialog__close" data-close-search aria-label="Close search overlay">',
      '        <kbd>Esc</kbd>',
      '      </button>',
      '    </div>',
      '    <div class="search-dialog__body">',
      '      <!-- Default View (Recents & Popular) -->',
      '      <div id="search-default-view">',
      '        <div class="search-section">',
      '          <div class="search-section__head">',
      '            <span class="search-section__title">Recent Searches</span>',
      '            <button type="button" class="search-clear-btn" id="search-clear-recents-btn">Clear all</button>',
      '          </div>',
      '          <div class="search-chips-wrap" id="search-recent-chips"></div>',
      '        </div>',
      '        <div class="search-section">',
      '          <div class="search-section__head">',
      '            <span class="search-section__title">Popular Collections</span>',
      '          </div>',
      '          <div class="search-chips-wrap" id="search-popular-chips"></div>',
      '        </div>',
      '      </div>',
      '      <!-- Results View -->',
      '      <div id="search-results-view" style="display:none;">',
      '        <div class="search-results-list" id="search-results-list" role="listbox" aria-label="Search suggestions"></div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</dialog>'
    ].join('\n');

    // Announcement dismissal
    var dismissBtn = document.getElementById('dismiss-announcement-btn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function () {
        var bar = document.getElementById('site-announcement-bar');
        if (bar) bar.style.display = 'none';
        try {
          localStorage.setItem(storageKeyDismiss, 'true');
        } catch (e) {}
      });
    }

    // City toggle handling (Islamabad <-> Rawalpindi)
    function toggleCity() {
      var current = getSavedCity();
      var next = (current === 'Islamabad') ? 'Rawalpindi' : 'Islamabad';
      setSavedCity(next);
      if (window.FloraMeshToast && window.FloraMeshToast.show) {
        window.FloraMeshToast.show('Delivery location set to ' + next + '.', 'info');
      }
    }

    var cityToggle = document.getElementById('header-city-toggle');
    if (cityToggle) {
      cityToggle.addEventListener('click', toggleCity);
      cityToggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCity();
        }
      });
    }

    var mobileCityToggle = document.getElementById('mobile-city-toggle');
    if (mobileCityToggle) {
      mobileCityToggle.addEventListener('click', toggleCity);
    }

    // Theme toggle button click
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (utils.toggleTheme) {
          utils.toggleTheme();
          var newTheme = utils.getCurrentTheme ? utils.getCurrentTheme() : 'heritage';
          var isNewDark = newTheme === 'midnight';
          var logo = document.getElementById('site-logo-img');
          if (logo) {
            logo.src = isNewDark ? 'assets/images/brand/floramesh-logo-dark.svg' : 'assets/images/brand/floramesh-logo.svg';
          }
          btn.setAttribute('aria-pressed', isNewDark ? 'true' : 'false');
          btn.innerHTML = isNewDark ? getIcon('sun') : getIcon('moon');
          btn.setAttribute('aria-label', isNewDark ? 'Switch to Heritage Cream theme' : 'Switch to Midnight Grove theme');
        }
      });
    });

    // Mobile nav trigger
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var closeMobileNavBtn = document.getElementById('close-mobile-nav-btn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function () {
        if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
          window.FloraMeshUI.DialogManager.open('mobile-nav-sheet', mobileMenuBtn);
        } else {
          var sheet = document.getElementById('mobile-nav-sheet');
          if (sheet) sheet.classList.add('is-open');
        }
      });
    }
    if (closeMobileNavBtn) {
      closeMobileNavBtn.addEventListener('click', function () {
        if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
          window.FloraMeshUI.DialogManager.close('mobile-nav-sheet');
        } else {
          var sheet = document.getElementById('mobile-nav-sheet');
          if (sheet) sheet.classList.remove('is-open');
        }
      });
    }

    // Scroll-driven header shrink and hide/show behavior
    var lastScrollY = window.scrollY || 0;
    var headerEl = document.getElementById('site-header');

    window.addEventListener('scroll', function () {
      var currentScrollY = window.scrollY || 0;
      if (!headerEl) return;

      // Shrink effect
      if (currentScrollY > 30) {
        headerEl.classList.add('site-header--scrolled');
      } else {
        headerEl.classList.remove('site-header--scrolled');
      }

      // Hide on scroll down / show on scroll up (with 150px threshold)
      if (currentScrollY > 150 && currentScrollY > lastScrollY + 5) {
        headerEl.classList.add('site-header--hidden');
      } else if (currentScrollY < lastScrollY - 5) {
        headerEl.classList.remove('site-header--hidden');
      }

      lastScrollY = currentScrollY;
    }, { passive: true });

    // Initialize search overlay
    if (window.FloraMeshSearch && window.FloraMeshSearch.init) {
      window.FloraMeshSearch.init();
    }
  }

  function renderFooter() {
    var footerTarget = document.getElementById('site-footer-mount');
    if (!footerTarget) return;

    var utils = window.FloraMeshUtils || {};
    var icons = window.FloraMeshIcons || {};
    var getIcon = function (name, cls, label) {
      if (icons.get) return icons.get(name, cls, label);
      if (utils.getIcon) return utils.getIcon(name, cls);
      return '';
    };

    footerTarget.innerHTML = [
      '<footer class="site-footer" id="site-footer" role="contentinfo">',
      '  <div class="container">',
      '    <!-- Seasonal Dispatch Card inside Footer -->',
      '    <div class="footer-dispatch-card">',
      '      <div class="footer-dispatch-info">',
      '        <h3 class="footer-dispatch-title">Join our Seasonal Garden Dispatch</h3>',
      '        <p class="footer-dispatch-desc">Monthly sowing calendars, monsoon care advisories, and winter pruning guides for Islamabad &amp; Rawalpindi.</p>',
      '      </div>',
      '      <form class="footer-dispatch-form" id="footer-newsletter-form" novalidate>',
      '        <div class="footer-dispatch-input-wrap">',
      '          <label for="footer-email-input" class="sr-only">Email address for seasonal dispatch</label>',
      '          <input type="email" id="footer-email-input" class="footer-dispatch-input" placeholder="you@domain.pk" required autocomplete="email">',
      '          <button type="submit" class="btn btn-primary footer-dispatch-btn" id="footer-newsletter-submit">Subscribe</button>',
      '        </div>',
      '        <p class="footer-dispatch-msg" id="footer-newsletter-msg" aria-live="polite"></p>',
      '      </form>',
      '    </div>',
      '    <!-- 4-Column Editorial Directory -->',
      '    <div class="site-footer__grid">',
      '      <!-- Column 1: Brand & Urdu Poetry Tagline -->',
      '      <div class="site-footer__col-brand">',
      '        <h4 class="site-footer__heading">FloraMesh</h4>',
      '        <span class="site-footer__urdu-tagline" lang="ur">آپ کا خیال، ہمارا پودا، سرسبز جہاں</span>',
      '        <p class="site-footer__bio">',
      '          Digital-first Online-to-Offline (O2O) smart urban landscaping, wireless IoT soil telemetry, and verified community green drives in the twin cities.',
      '        </p>',
      '        <p class="site-footer__partner">',
      '          Strategic Botanical Partner: <strong>Ali Shehryar (Seedistry)</strong><br>',
      '          Potohar horticultural propagation &amp; heirloom native seeds.',
      '        </p>',
      '      </div>',
      '      <!-- Column 2: Collections & Services -->',
      '      <div>',
      '        <h4 class="site-footer__heading">Living Collections</h4>',
      '        <ul class="site-footer__list">',
      '          <li><a href="shop.html?category=planting-services">Balcony &amp; Rooftop Planting</a></li>',
      '          <li><a href="shop.html?category=smart-monitoring">IoT Telemetry &amp; Soil Probes</a></li>',
      '          <li><a href="shop.html?category=plant-care-supplies">Taxila Terracotta &amp; Multani Pots</a></li>',
      '          <li><a href="shop.html?category=learning-hub">Seedistry Heirloom Seed Boxes</a></li>',
      '          <li><a href="shop.html?category=community-csr">Margalla Native Tree Drives</a></li>',
      '        </ul>',
      '      </div>',
      '      <!-- Column 3: Telemetry & Support -->',
      '      <div>',
      '        <h4 class="site-footer__heading">Customer Care</h4>',
      '        <ul class="site-footer__list">',
      '          <li><a href="shipping-returns.html">Twin-City Delivery &amp; Returns</a></li>',
      '          <li><a href="faq.html">Frequently Asked Questions</a></li>',
      '          <li><a href="my-account.html">Customer Account</a></li>',
      '          <li><a href="wishlist.html">Saved Wishlist</a></li>',
      '          <li><a href="compare.html">Product Spec Comparison</a></li>',
      '          <li><a href="sitemap.html">Site Directory</a></li>',
      '          <li><a href="contact.html">Studio Coordinates &amp; Hours</a></li>',
      '        </ul>',
      '      </div>',
      '      <!-- Column 4: Physical Studio & Workshop -->',
      '      <div>',
      '        <h4 class="site-footer__heading">Studio &amp; Workshop</h4>',
      '        <div class="site-footer__contact-item">',
      '          <strong>Islamabad Studio:</strong>',
      '          Sector F-7/3, Street 14, Islamabad',
      '        </div>',
      '        <div class="site-footer__contact-item">',
      '          <strong>Workshop &amp; Nursery:</strong>',
      '          Chaklala Scheme III, Rawalpindi',
      '        </div>',
      '        <div class="site-footer__contact-item">',
      '          <strong>Direct Support:</strong>',
      ((window.FLORAMESH_CONFIG && window.FLORAMESH_CONFIG.contact && window.FLORAMESH_CONFIG.contact.whatsappNumber)
        ? '          <br><a href="https://wa.me/' + window.FLORAMESH_CONFIG.contact.whatsappNumber + '" target="_blank" rel="noopener">+' + window.FLORAMESH_CONFIG.contact.whatsappNumber + '</a> (Mon&ndash;Sat, 9am&ndash;6pm PKT)'
        : '          <br><a href="mailto:hello@floramesh.pk">hello@floramesh.pk</a> (Mon&ndash;Sat, 9am&ndash;6pm PKT)'),
      '        </div>',
      '      </div>',
      '    </div>',
      '    <!-- Accepted Payment Methods Trust Strip -->',
      '    <div class="footer-payment-strip">',
      '      <span class="footer-payment-title">Accepted Regional Payment Methods:</span>',
      '      <div class="footer-payment-badges">',
      '        <span class="payment-badge payment-badge--jazzcash">JazzCash</span>',
      '        <span class="payment-badge payment-badge--easypaisa">EasyPaisa</span>',
      '        <span class="payment-badge payment-badge--bank">1Link / Bank Transfer</span>',
      '        <span class="payment-badge payment-badge--cod">Cash on Delivery (Twin Cities)</span>',
      '      </div>',
      '    </div>',
      '    <!-- Giant Low-Contrast Fraunces Wordmark -->',
      '    <div class="footer-giant-wordmark" aria-hidden="true">',
      '      FLORAMESH',
      '    </div>',
      '    <!-- Bottom Legal Bar -->',
      '    <div class="site-footer__bottom">',
      '      <div class="site-footer__copyright">&copy; 2026 FloraMesh Private Limited. All prices in PKR (Rs). Tax included.</div>',
      '      <div class="site-footer__legal-links">',
      '        <a href="privacy.html">Privacy Policy</a>',
      '        <a href="terms.html">Terms of Service</a>',
      '        <a href="shipping-returns.html">Shipping &amp; Delivery</a>',
      '        <a href="accessibility.html">Accessibility (WCAG 2.2 AA)</a>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</footer>',
      '<!-- Slide-Out Cart Drawer Backdrop & Sheet -->',
      '<div class="overlay-backdrop" id="cart-drawer-backdrop" aria-hidden="true"></div>',
      '<aside class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Your Basket" aria-hidden="true">',
      '  <div class="cart-drawer__header">',
      '    <h2 class="cart-drawer__title">Your basket</h2>',
      '    <button type="button" class="header-action-btn" id="close-cart-drawer-btn" aria-label="Close basket drawer">',
      getIcon('close'),
      '    </button>',
      '  </div>',
      '  <!-- Free Delivery Progress Bar -->',
      '  <div class="cart-drawer__progress" id="cart-delivery-progress" aria-live="polite"></div>',
      '  <div class="cart-drawer__body" id="cart-drawer-items"></div>',
      '  <div class="cart-drawer__footer" id="cart-drawer-footer"></div>',
      '</aside>',
      '<!-- Quick View & Lightbox Modal Mount -->',
      '<div class="modal-wrapper" id="quick-view-modal" aria-hidden="true">',
      '  <div class="overlay-backdrop is-open" id="modal-backdrop"></div>',
      '  <div class="modal-panel" id="quick-view-panel" role="dialog" aria-modal="true" aria-labelledby="quick-view-title">',
      '    <div class="modal-panel__header">',
      '      <span class="section__eyebrow" id="quick-view-eyebrow">Quick View</span>',
      '      <button type="button" class="header-action-btn" id="modal-close-btn" aria-label="Close modal">',
      getIcon('close'),
      '      </button>',
      '    </div>',
      '    <div id="quick-view-content"></div>',
      '  </div>',
      '</div>',
      '<!-- Toast Notifications Container -->',
      '<div class="toast-container" id="toast-container" aria-live="polite"></div>'
    ].join('\n');

    // Newsletter submission handler with friendly inline validation
    var newsForm = document.getElementById('footer-newsletter-form');
    var newsInput = document.getElementById('footer-email-input');
    var newsMsg = document.getElementById('footer-newsletter-msg');
    var newsBtn = document.getElementById('footer-newsletter-submit');

    if (newsForm && newsInput && newsMsg) {
      newsForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = newsInput.value.trim();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
          newsMsg.textContent = 'Please enter a valid email address (e.g. you@domain.pk).';
          newsMsg.style.color = 'var(--color-danger)';
          newsInput.focus();
          return;
        }

        newsBtn.disabled = true;
        newsBtn.textContent = 'Subscribing...';

        setTimeout(function () {
          newsInput.value = '';
          newsBtn.disabled = false;
          newsBtn.textContent = 'Subscribe';
          newsMsg.textContent = 'Shukriya! You are now subscribed to the Twin-City seasonal dispatch.';
          newsMsg.style.color = 'var(--color-success)';
          try {
            localStorage.setItem('floramesh_newsletter_subscribed_v1', 'true');
          } catch (err) {}
        }, 500);
      });
    }

    // Cart drawer close button
    var closeCartBtn = document.getElementById('close-cart-drawer-btn');
    if (closeCartBtn) {
      closeCartBtn.addEventListener('click', function () {
        if (window.FloraMeshCart && window.FloraMeshCart.closeDrawer) {
          window.FloraMeshCart.closeDrawer();
        } else if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
          window.FloraMeshUI.DialogManager.close('cart-drawer');
        }
      });
    }

    var cartBackdrop = document.getElementById('cart-drawer-backdrop');
    if (cartBackdrop) {
      cartBackdrop.addEventListener('click', function () {
        if (window.FloraMeshCart && window.FloraMeshCart.closeDrawer) {
          window.FloraMeshCart.closeDrawer();
        } else if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
          window.FloraMeshUI.DialogManager.close('cart-drawer');
        }
      });
    }
  }

  window.FloraMeshPartials = {
    init: function () {
      renderHeader();
      renderFooter();
    },
    renderHeader: renderHeader,
    renderFooter: renderFooter,
    setCity: setSavedCity,
    getCity: getSavedCity
  };
})();
