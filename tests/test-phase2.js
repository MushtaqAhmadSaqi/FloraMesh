/**
 * FloraMesh Phase 2 Verification Suite (tests/test-phase2.js)
 * Validates Navigation, Header, Search & Footer modules under Node.js test environment.
 */
const fs = require('fs');
const path = require('path');

// Setup browser globals mock
global.window = global;
global.document = {
  documentElement: {
    setAttribute: function (k, v) { this[k] = v; },
    getAttribute: function (k) { return this[k]; }
  },
  getElementById: function (id) {
    return {
      id: id,
      innerHTML: '',
      textContent: '',
      style: {},
      classList: {
        add: function () {},
        remove: function () {},
        contains: function () { return false; },
        toggle: function () {}
      },
      querySelectorAll: function () { return []; },
      addEventListener: function () {}
    };
  },
  querySelectorAll: function () { return []; },
  addEventListener: function () {}
};
global.localStorage = {
  _data: {},
  getItem: function (k) { return this._data[k] || null; },
  setItem: function (k, v) { this._data[k] = String(v); },
  removeItem: function (k) { delete this._data[k]; },
  clear: function () { this._data = {}; }
};
global.URLSearchParams = require('url').URLSearchParams;

console.log('--- FLORAMESH PHASE 2 VERIFICATION SUITE ---\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failedTests++;
  }
}

// 1. Load config & icons
require('../js/config.js');
assert(window.FLORAMESH_CONFIG && window.FLORAMESH_CONFIG.shipping.freeThreshold === 10000, 'Config loaded: free shipping threshold is Rs 10,000');

require('../js/icons.js');
assert(window.FloraMeshIcons && window.FloraMeshIcons.list.length >= 30, `Icons loaded: ${window.FloraMeshIcons.list.length} vector icons registered`);
assert(window.FloraMeshIcons.get('search').includes('<svg') && window.FloraMeshIcons.get('search').includes('icon--search'), 'Icons helper returns valid SVG for search icon');
assert(window.FloraMeshIcons.get('bag').includes('icon--bag'), 'Icons helper returns valid SVG for bag icon');
assert(window.FloraMeshIcons.get('close').includes('icon--close'), 'Icons helper returns valid SVG for close icon');

// 2. Load UI DialogManager
require('../js/ui.js');
assert(window.FloraMeshUI && typeof window.FloraMeshUI.DialogManager.open === 'function', 'FloraMeshUI.DialogManager is defined with open/close methods');

// 3. Load Products & Search
require('../data/products.js');
assert(Array.isArray(window.FLORAMESH_PRODUCTS) && window.FLORAMESH_PRODUCTS.length >= 20, `Product catalog loaded: ${window.FLORAMESH_PRODUCTS.length} products`);

require('../js/search.js');
assert(window.FloraMeshSearch && typeof window.FloraMeshSearch.init === 'function', 'FloraMeshSearch is defined with init/open/close');

// Test search tokenization
const testProducts = window.FLORAMESH_PRODUCTS;
const sensorMatches = testProducts.filter(p => {
  const h = [p.name, p.shortName, p.category, p.shortDescription].join(' ').toLowerCase();
  return ['soil', 'sensor'].every(t => h.includes(t));
});
assert(sensorMatches.length > 0, `Multi-token search ('soil sensor') finds ${sensorMatches.length} matching products`);

const potteryMatches = testProducts.filter(p => {
  const h = [p.name, p.shortName, p.category, p.shortDescription].join(' ').toLowerCase();
  return ['taxila'].every(t => h.includes(t));
});
assert(potteryMatches.length > 0, `Single-token search ('taxila') finds ${potteryMatches.length} matching pottery products`);

// 4. Test Partials Rendering
require('../js/partials.js');
assert(window.FloraMeshPartials && typeof window.FloraMeshPartials.renderHeader === 'function', 'FloraMeshPartials is defined with renderHeader/renderFooter');

// Test City Selector
assert(window.FloraMeshPartials.getCity() === 'Islamabad', 'Default city delivery location is Islamabad');
window.FloraMeshPartials.setCity('Rawalpindi');
assert(window.FloraMeshPartials.getCity() === 'Rawalpindi', 'City delivery location switches and persists to Rawalpindi');
assert(localStorage.getItem('floramesh_city_v1') === 'Rawalpindi', 'City preference stored in localStorage[floramesh_city_v1]');

// 5. Test All HTML Files Structure
const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

assert(htmlFiles.length >= 14, `All ${htmlFiles.length} storefront HTML pages found (>= 14)`);

htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  const hasMounts = content.includes('id="site-header-mount"') && content.includes('id="site-footer-mount"');
  assert(hasMounts, `${file} includes #site-header-mount and #site-footer-mount`);

  const hasIcons = content.includes('src="js/icons.js"');
  const hasUI = content.includes('src="js/ui.js"');
  const hasSearch = content.includes('src="js/search.js"');
  const hasPartials = content.includes('src="js/partials.js"');
  assert(hasIcons && hasUI && hasSearch && hasPartials, `${file} includes icons.js, ui.js, search.js, and partials.js`);
});

// 6. Test Responsive CSS Breakpoints and LaTeX cleanup
const responsiveCss = fs.readFileSync(path.join(rootDir, 'css/responsive.css'), 'utf8');
assert(!responsiveCss.includes('$\\ge$'), 'css/responsive.css has zero LaTeX artifacts');
assert(responsiveCss.includes('360px') && responsiveCss.includes('768px') && responsiveCss.includes('1024px'), 'css/responsive.css defines standard responsive breakpoints');

// 7. Test Components CSS Header, Mega-Menu, and Footer
const componentsCss = fs.readFileSync(path.join(rootDir, 'css/components.css'), 'utf8');
assert(componentsCss.includes('.site-header--scrolled') && componentsCss.includes('.site-header--hidden'), 'components.css includes scroll-driven header shrink and hide classes');
assert(componentsCss.includes('.has-mega-menu') && componentsCss.includes('.mega-menu'), 'components.css includes desktop mega-menu styles');
assert(componentsCss.includes('.search-dialog') && componentsCss.includes('.search-result-card'), 'components.css includes command palette search dialog styles');
assert(componentsCss.includes('.footer-dispatch-card') && componentsCss.includes('.footer-giant-wordmark'), 'components.css includes footer dispatch card and oversized Fraunces wordmark');

console.log(`\n========================================`);
console.log(`Phase 2 Tests Finished: ${passedTests} Passed, ${failedTests} Failed.`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL PHASE 2 VERIFICATION TESTS PASSED!');
}
