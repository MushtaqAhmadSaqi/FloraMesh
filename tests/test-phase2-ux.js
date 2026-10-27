/**
 * FloraMesh Phase 2 UX & Tactile Polish Verification Suite (tests/test-phase2-ux.js)
 * Tests design tokens, skeleton loaders, mobile bottom navigation,
 * prioritized search ranking, breadcrumbs, savings badges, and 1-click IBAN copy.
 */
const fs = require('fs');
const path = require('path');

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

console.log('--- FLORAMESH PHASE 2 UX & BOTANICAL POLISH TEST SUITE ---\n');

const rootDir = path.resolve(__dirname, '..');

// 1. Token definitions & contrast aliases
const tokensCss = fs.readFileSync(path.join(rootDir, 'css/tokens.css'), 'utf8');
assert(tokensCss.includes('--color-surface-sunken: #F3EEE2;'), 'tokens.css defines --color-surface-sunken in Heritage theme');
assert(tokensCss.includes('--color-surface-sunken: #1A322A;'), 'tokens.css defines --color-surface-sunken in Midnight theme');
assert(tokensCss.includes('--font-serif: var(--font-display);'), 'tokens.css aliases --font-serif to Fraunces display serif');
assert(tokensCss.includes('--radius-base: var(--radius-md);'), 'tokens.css aliases --radius-base to standard radius-md');

// 2. Tactile micro-interactions & skeleton shimmer
const componentsCss = fs.readFileSync(path.join(rootDir, 'css/components.css'), 'utf8');
assert(componentsCss.includes('.skeleton') && componentsCss.includes('botanicalShimmer'), 'components.css includes botanical skeleton shimmer loader');
assert(componentsCss.includes('.skeleton--media') && componentsCss.includes('.skeleton--card'), 'components.css defines skeleton variants for cards and media');
assert(componentsCss.includes('.mobile-bottom-nav') && componentsCss.includes('env(safe-area-inset-bottom'), 'components.css defines mobile bottom nav with safe-area insets');
assert(componentsCss.includes('.pdp__savings-badge'), 'components.css defines PDP variant savings pill badge');
assert(componentsCss.includes('.btn-copy-iban'), 'components.css defines 1-click IBAN copy button styling');

// 3. Responsive safe area & touch target ergonomics
const responsiveCss = fs.readFileSync(path.join(rootDir, 'css/responsive.css'), 'utf8');
assert(responsiveCss.includes('env(safe-area-inset-bottom'), 'responsive.css accounts for iOS/Android home indicator safe areas');
assert(responsiveCss.includes('bottom: calc(60px + env(safe-area-inset-bottom, 0px))'), 'responsive.css positions PDP sticky bar gracefully above mobile bottom nav');

// 4. Vector Icon Registry
global.window = global;
require('../js/icons.js');
assert(window.FloraMeshIcons.get('home').includes('icon--home'), 'icons.js provides vector SVG home icon for mobile bottom nav');
assert(window.FloraMeshIcons.get('copy').includes('icon--copy'), 'icons.js provides vector SVG copy icon for IBAN clipboard');
assert(window.FloraMeshIcons.list.length >= 36, `icons.js registers ${window.FloraMeshIcons.list.length} icons (>= 36)`);

// 5. Prioritized Catalog Search with Urdu folk names and exact SKU
require('../data/products.js');
require('../js/utils.js');
require('../js/search.js');

const skuMatches = window.FloraMeshSearch.searchProducts('FM-SRV-001');
assert(skuMatches.length > 0 && skuMatches[0].sku === 'FM-SRV-001', 'Exact SKU query "FM-SRV-001" returns Balcony Oasis as top rank #1');

const urduMatches = window.FloraMeshSearch.searchProducts('کچنار');
assert(urduMatches.length > 0 && (urduMatches[0].slug.includes('tree') || urduMatches[0].slug.includes('csr') || urduMatches[0].name.includes('Kachnar')), 'Urdu script query "کچنار" successfully prioritizes native sapling CSR package');

const folkMatches = window.FloraMeshSearch.searchProducts('kachnar');
assert(folkMatches.length > 0 && (folkMatches[0].slug.includes('tree') || folkMatches[0].slug.includes('csr')), 'Roman Urdu query "kachnar" successfully finds native tree packages');

const spaceMatches = window.FloraMeshSearch.searchProducts('balcony');
assert(spaceMatches.length > 0 && spaceMatches[0].spaces.includes('balcony'), 'Space tag query "balcony" prioritizes items specifically tagged for balcony spaces');

// 6. Responsive Breadcrumbs across storefront
const shopHtml = fs.readFileSync(path.join(rootDir, 'shop.html'), 'utf8');
assert(shopHtml.includes('class="pdp__breadcrumb"') && shopHtml.includes('id="shop-breadcrumb-current"'), 'shop.html includes semantic responsive breadcrumbs nav');

const compareHtml = fs.readFileSync(path.join(rootDir, 'compare.html'), 'utf8');
assert(compareHtml.includes('class="pdp__breadcrumb"') && compareHtml.includes('Product &amp; Spec Comparison'), 'compare.html includes semantic responsive breadcrumbs nav');
assert(compareHtml.includes('position: sticky') && compareHtml.includes('thead th'), 'compare.html fixes column headers with position: sticky');

// 7. 1-Click IBAN Copy & Checkout
const checkoutHtml = fs.readFileSync(path.join(rootDir, 'checkout.html'), 'utf8');
assert(checkoutHtml.includes('btn-copy-iban') && checkoutHtml.includes('PK64SCBL0000001123456701'), 'checkout.html provides 1-click IBAN copy button');

// 8. Main.js rawOrders bug fix & copy listener
const mainJs = fs.readFileSync(path.join(rootDir, 'js/main.js'), 'utf8');
assert(mainJs.includes('var rawOrders = localStorage.getItem(ordersKey);'), 'main.js fixes rawOrders ReferenceError in account portal');
assert(mainJs.includes("e.target.closest('.btn-copy-iban')"), 'main.js binds 1-click IBAN copy event delegation');

// 9. Mobile Bottom Nav in Partials
const partialsJs = fs.readFileSync(path.join(rootDir, 'js/partials.js'), 'utf8');
assert(partialsJs.includes('class="mobile-bottom-nav"') && partialsJs.includes('mobile-bottom-cart-btn'), 'partials.js renders persistent mobile bottom nav bar');

console.log(`\n========================================`);
console.log(`Phase 2 UX Tests Finished: ${passedTests} Passed, ${failedTests} Failed.`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL PHASE 2 UX TESTS PASSED!');
}
