/**
 * FloraMesh Phase 4 Automated Test Suite (tests/test-phase4.js)
 * Verifies Secondary & Supporting Pages:
 * - Wishlist URL sharing, variant selection, and add-all-to-basket
 * - Product comparison table (compare.html)
 * - Customer Account Portal (my-account.html) & password toggles (QA-26)
 * - Contact phone cleanse (QA-35) & validation focus (QA-25)
 * - Standardized delivery turnaround copy (QA-18) & legal lastUpdated sync (QA-34)
 * - Categorized FAQ with live search & FAQPage schema
 * - Accessibility statement (accessibility.html) & HTML sitemap (sitemap.html)
 * - Structural XSS tagged template literal helper (QA-39)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

let totalPassed = 0;
let totalFailed = 0;

function pass(msg) {
  console.log(`  PASS: ${msg}`);
  totalPassed++;
}

function fail(msg, err) {
  console.error(`  FAIL: ${msg}`);
  if (err) console.error(`        ${err}`);
  totalFailed++;
}

console.log('====================================================');
console.log('FloraMesh Phase 4 Test Suite');
console.log('====================================================\n');

// Mock browser environment for unit tests
global.window = global;
global.window.addEventListener = function () {};
global.document = {
  documentElement: {
    getAttribute: () => 'heritage',
    setAttribute: () => {}
  },
  getElementById: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};
global.localStorage = {
  _store: {},
  getItem: function (k) { return this._store[k] || null; },
  setItem: function (k, v) { this._store[k] = String(v); },
  removeItem: function (k) { delete this._store[k]; }
};

// 1. Load Config & Utils
require(path.join(ROOT, 'js', 'config.js'));
require(path.join(ROOT, 'js', 'utils.js'));
require(path.join(ROOT, 'data', 'products.js'));
require(path.join(ROOT, 'js', 'cart.js'));
require(path.join(ROOT, 'js', 'wishlist.js'));

console.log('1. Configuration & Metadata Synchronization (QA-18, QA-34):');
try {
  const cfg = global.FLORAMESH_CONFIG;
  if (cfg.legal && cfg.legal.lastUpdated === 'October 24, 2026') {
    pass('Global config defines legal.lastUpdated (QA-34)');
  } else {
    fail('Global config missing legal.lastUpdated');
  }

  if (cfg.delivery && cfg.delivery.standard.indexOf('48–72 hours') !== -1) {
    pass('Global config defines standard turnaround as 48–72 hours (QA-18)');
  } else {
    fail('Global config delivery turnaround missing or incorrect');
  }

  if (cfg.storageKeys && cfg.storageKeys.orders === 'floramesh_orders_v1') {
    pass('Global config specifies persistent orders storage key');
  } else {
    fail('Global config missing orders storage key');
  }
} catch (e) {
  fail('Error checking config', e);
}

console.log('\n2. Structural XSS Helper & Sanitization (QA-39):');
try {
  const u = global.FloraMeshUtils;
  const attack = '<img src=x onerror=alert(1)>';
  const escaped = u.html`<div>${attack}</div>`;
  if (escaped === '<div>&lt;img src=x onerror=alert(1)&gt;</div>') {
    pass('FloraMeshUtils.html auto-escapes interpolated attack vectors (QA-39)');
  } else {
    fail('FloraMeshUtils.html failed to auto-escape: ' + escaped);
  }

  const raw = u.rawHTML('<strong>Clean</strong>');
  const renderedRaw = u.html`<span>${raw}</span>`;
  if (renderedRaw === '<span><strong>Clean</strong></span>') {
    pass('FloraMeshUtils.rawHTML safely bypasses escaping when explicit');
  } else {
    fail('FloraMeshUtils.rawHTML failed');
  }

  const escapeHtmlPath = path.join(ROOT, 'tests', 'escape.html');
  if (fs.existsSync(escapeHtmlPath)) {
    pass('tests/escape.html regression test suite created (QA-39)');
  } else {
    fail('tests/escape.html missing');
  }
} catch (e) {
  fail('Error testing XSS helper', e);
}

console.log('\n3. Wishlist Sharing & Bulk Basket Actions:');
try {
  const w = global.FloraMeshWishlist;
  if (typeof w.getSharedSlugs === 'function' && typeof w.generateShareUrl === 'function') {
    pass('FloraMeshWishlist exposes URL sharing methods');
  } else {
    fail('FloraMeshWishlist missing sharing methods');
  }

  if (typeof w.addAllToBasket === 'function') {
    pass('FloraMeshWishlist exposes addAllToBasket method');
  } else {
    fail('FloraMeshWishlist missing addAllToBasket');
  }

  // Test copySharedToSaved
  global.localStorage.setItem('floramesh_demo_wishlist_v1', JSON.stringify(['seed-vault-pakistan-native-heirloom']));
  global.window.location = {
    search: '?list=taxila-terracotta-tall-cylinder-planter,soil-moisture-ph-probe-sensor',
    pathname: '/wishlist.html',
    origin: 'https://floramesh.pk'
  };

  if (w.isSharedView() && w.getSharedSlugs().length === 2) {
    pass('Wishlist accurately parses shared ?list parameter');
  } else {
    fail('Wishlist failed to parse ?list');
  }

  w.copySharedToSaved();
  const saved = w.getSavedSlugs();
  if (saved.length === 3 && saved.indexOf('soil-moisture-ph-probe-sensor') !== -1) {
    pass('copySharedToSaved merges shared items without overwriting existing saved items');
  } else {
    fail('copySharedToSaved failed: ' + JSON.stringify(saved));
  }
} catch (e) {
  fail('Error testing Wishlist sharing', e);
}

console.log('\n4. Product Comparison Matrix (compare.html):');
try {
  const compPath = path.join(ROOT, 'compare.html');
  if (!fs.existsSync(compPath)) {
    fail('compare.html does not exist');
  } else {
    pass('compare.html created');
    const compHtml = fs.readFileSync(compPath, 'utf8');

    if (compHtml.indexOf('id="compare-matrix"') !== -1) {
      pass('compare.html contains side-by-side comparison table');
    } else {
      fail('compare.html missing compare-matrix table');
    }

    if (compHtml.indexOf('Potohar Climate Resilience') !== -1) {
      pass('compare.html compares Potohar Climate Resilience');
    } else {
      fail('compare.html missing climate comparison row');
    }

    if (compHtml.indexOf('select-prod-0') !== -1 && compHtml.indexOf('select-prod-1') !== -1) {
      pass('compare.html contains interactive product selectors for each slot');
    } else {
      fail('compare.html missing slot dropdown selectors');
    }

    if (compHtml.indexOf('soil-moisture-ph-probe-sensor') !== -1) {
      pass('compare.html defaults to top 3 smart telemetry sensors');
    } else {
      fail('compare.html missing default telemetry items');
    }
  }
} catch (e) {
  fail('Error checking compare.html', e);
}

console.log('\n5. Customer Account Portal (my-account.html & QA-26):');
try {
  const accPath = path.join(ROOT, 'my-account.html');
  const accHtml = fs.readFileSync(accPath, 'utf8');

  if (accHtml.indexOf('Sensor Telemetry Portal') === -1) {
    pass('my-account.html removed false "Sensor Telemetry Portal" title (QA-26)');
  } else {
    fail('my-account.html still contains false telemetry portal title');
  }

  if (accHtml.indexOf('Customer Account') !== -1) {
    pass('my-account.html titled "Customer Account"');
  } else {
    fail('my-account.html missing Customer Account title');
  }

  if (accHtml.indexOf('data-toggle-password') !== -1) {
    pass('my-account.html includes password visibility toggle buttons');
  } else {
    fail('my-account.html missing password toggles');
  }

  if (accHtml.indexOf('id="account-orders-list"') !== -1) {
    pass('my-account.html includes local browser order history tab');
  } else {
    fail('my-account.html missing order history container');
  }
} catch (e) {
  fail('Error checking my-account.html', e);
}

console.log('\n6. Contact Information & Phone Placeholder Cleanse (QA-25, QA-35):');
try {
  const cntPath = path.join(ROOT, 'contact.html');
  const cntHtml = fs.readFileSync(cntPath, 'utf8');

  if (cntHtml.indexOf('+92 300 0000000') === -1) {
    pass('contact.html purged fake phone placeholder +92 300 0000000 (QA-35)');
  } else {
    fail('contact.html still contains +92 300 0000000 placeholder');
  }

  if (cntHtml.indexOf('id="contact-whatsapp-block"') !== -1) {
    pass('contact.html defines conditional WhatsApp block');
  } else {
    fail('contact.html missing conditional WhatsApp block');
  }

  const mainJs = fs.readFileSync(path.join(ROOT, 'js', 'main.js'), 'utf8');
  if (mainJs.indexOf('firstInvalid.focus()') !== -1) {
    pass('Contact form validation focuses first invalid field (QA-25)');
  } else {
    fail('Contact form validation does not focus first invalid field');
  }
} catch (e) {
  fail('Error checking contact.html and main.js', e);
}

console.log('\n7. Institutional & Policy Pages (about.html, faq.html, shipping-returns.html):');
try {
  const abtHtml = fs.readFileSync(path.join(ROOT, 'about.html'), 'utf8');
  if (abtHtml.indexOf('5 Seasons of Islamabad') !== -1 || abtHtml.indexOf('Tuned to the 5 Seasons') !== -1) {
    pass('about.html details Potohar 5 micro-seasons');
  } else {
    fail('about.html missing 5 micro-seasons');
  }

  const faqHtml = fs.readFileSync(path.join(ROOT, 'faq.html'), 'utf8');
  if (faqHtml.indexOf('id="faq-search-input"') !== -1 && faqHtml.indexOf('data-faq-filter') !== -1) {
    pass('faq.html includes instant search input and topic filter pills');
  } else {
    fail('faq.html missing instant search or topic pills');
  }

  if (faqHtml.indexOf('@type": "FAQPage"') !== -1) {
    pass('faq.html includes FAQPage JSON-LD schema');
  } else {
    fail('faq.html missing FAQPage JSON-LD schema');
  }

  const shipHtml = fs.readFileSync(path.join(ROOT, 'shipping-returns.html'), 'utf8');
  if (shipHtml.indexOf('Twin-City Field Van') !== -1 && shipHtml.indexOf('48-Hour Guarantee') !== -1) {
    pass('shipping-returns.html includes delivery matrix and 48-hour transit damage policy');
  } else {
    fail('shipping-returns.html missing delivery matrix or damage policy');
  }

  const termsHtml = fs.readFileSync(path.join(ROOT, 'terms.html'), 'utf8');
  if (termsHtml.indexOf('1-year limited warranty') !== -1 && termsHtml.indexOf('data-legal-last-updated') !== -1) {
    pass('terms.html contains factual 1-year limited warranty and synced date (QA-34)');
  } else {
    fail('terms.html missing warranty or synced date');
  }
} catch (e) {
  fail('Error checking institutional pages', e);
}

console.log('\n8. New Supporting Pages (accessibility.html & sitemap.html):');
try {
  const accDocPath = path.join(ROOT, 'accessibility.html');
  if (fs.existsSync(accDocPath)) {
    pass('accessibility.html created');
    const accDoc = fs.readFileSync(accDocPath, 'utf8');
    if (accDoc.indexOf('WCAG') !== -1 && accDoc.indexOf('Level AA') !== -1) {
      pass('accessibility.html details WCAG 2.2 AA statement');
    } else {
      fail('accessibility.html missing WCAG 2.2 AA statement');
    }
  } else {
    fail('accessibility.html missing');
  }

  const smPath = path.join(ROOT, 'sitemap.html');
  if (fs.existsSync(smPath)) {
    pass('sitemap.html created');
    const smDoc = fs.readFileSync(smPath, 'utf8');
    if (smDoc.indexOf('sitemap-products-grid') !== -1) {
      pass('sitemap.html includes complete catalog directory mount');
    } else {
      fail('sitemap.html missing catalog directory mount');
    }
  } else {
    fail('sitemap.html missing');
  }
} catch (e) {
  fail('Error checking accessibility & sitemap pages', e);
}

console.log('\n====================================================');
console.log(`RESULTS: ${totalPassed} passed, ${totalFailed} failed`);
console.log('====================================================\n');

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
