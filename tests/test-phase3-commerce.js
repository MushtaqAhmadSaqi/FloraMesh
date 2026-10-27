/**
 * FloraMesh Phase 3 Commerce & Metadata Verification Suite (tests/test-phase3-commerce.js)
 * Tests:
 * 1. WhatsApp Direct Order URL builder (Single item & Full Basket)
 * 2. Gated Housing Society Delivery Fields & Order Persistence
 * 3. 1-Click Bank Transfer IBAN & Mobile Wallet Copy Attributes
 * 4. PWA Web App Manifest (manifest.webmanifest) Schema & Assets
 * 5. Offline Service Worker (sw.js) Structure & App Shell Caching
 * 6. Robots.txt Crawl Directives & Sitemap Reference
 * 7. Sitemap.xml Full Coverage (17 Pages + 25 Products)
 * 8. LLM Machine Discovery Specs (llms.txt & llms-full.txt)
 * 9. Comprehensive Social Metadata (Open Graph, Twitter Cards, Manifest) on all 17 HTML Pages
 */

var fs = require('fs');
var path = require('path');

var rootDir = path.resolve(__dirname, '..');
var passed = 0;
var failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log('  PASS: ' + testName);
    passed++;
  } else {
    console.error('  FAIL: ' + testName);
    failed++;
  }
}

console.log('====================================================');
console.log('FloraMesh Phase 3 Commerce & Regional Feature Suite');
console.log('====================================================\n');

// Mock browser environment for Node.js
var mockLocalStorage = {};
global.window = global;
global.window.addEventListener = function () {};
global.localStorage = {
  getItem: function (k) { return mockLocalStorage[k] || null; },
  setItem: function (k, v) { mockLocalStorage[k] = String(v); },
  removeItem: function (k) { delete mockLocalStorage[k]; },
  clear: function () { mockLocalStorage = {}; }
};
global.document = {
  getElementById: function () { return null; },
  querySelectorAll: function () { return []; },
  addEventListener: function () {},
  body: { classList: { add: function () {}, remove: function () {} } }
};

// Load configurations & utils
require(path.join(rootDir, 'js', 'config.js'));
require(path.join(rootDir, 'js', 'icons.js'));
require(path.join(rootDir, 'js', 'utils.js'));
require(path.join(rootDir, 'data', 'products.js'));
require(path.join(rootDir, 'js', 'cart.js'));

var utils = window.FloraMeshUtils;
var products = window.FLORAMESH_PRODUCTS;
var cfg = window.FLORAMESH_CONFIG;

// TEST SUITE 1: WhatsApp Direct Order Link Generation
console.log('1. WhatsApp Direct Order URL Formatting:');
assert(typeof utils.buildWhatsAppOrderUrl === 'function', 'FloraMeshUtils exposes buildWhatsAppOrderUrl helper');

var testProduct = products.find(function (p) { return p.slug === 'apartment-balcony-green-oasis-package'; });
var singleWaUrl = utils.buildWhatsAppOrderUrl({
  product: testProduct,
  variant: testProduct.variants[0],
  qty: 2
});

assert(singleWaUrl.indexOf('https://wa.me/923005551234') === 0, 'Single item WhatsApp URL targets configured twin-city phone number');
assert(singleWaUrl.indexOf(encodeURIComponent(testProduct.sku)) !== -1, 'Single item WhatsApp message encodes product SKU');
assert(singleWaUrl.indexOf(encodeURIComponent('Quantity: 2')) !== -1, 'Single item WhatsApp message encodes selected quantity');
assert(singleWaUrl.indexOf(encodeURIComponent('Islamabad / Rawalpindi')) !== -1, 'Single item WhatsApp message encodes twin-city delivery destination');

var cartWaUrl = utils.buildWhatsAppOrderUrl({
  type: 'cart',
  items: [
    { name: 'Balcony Oasis', variantName: 'Standard', qty: 1, price: 24500 },
    { name: 'Smart Soil Sensor', variantName: 'Single', qty: 2, price: 4200 }
  ],
  totals: { subtotal: 32900, shipping: 0, total: 32900 }
});

assert(cartWaUrl.indexOf('https://wa.me/923005551234') === 0, 'Cart WhatsApp URL targets configured twin-city phone number');
assert(cartWaUrl.indexOf(encodeURIComponent('Balcony Oasis')) !== -1, 'Cart WhatsApp message contains item line descriptions');
assert(cartWaUrl.indexOf(encodeURIComponent('Rs 32,900')) !== -1, 'Cart WhatsApp message contains formatted line totals');
assert(cartWaUrl.indexOf(encodeURIComponent('Free')) !== -1, 'Cart WhatsApp message reflects free delivery status');

// TEST SUITE 2: Gated Housing Society Delivery Fields
console.log('\n2. Gated Housing Society Delivery Preferences:');
var checkoutHtml = fs.readFileSync(path.join(rootDir, 'checkout.html'), 'utf8');
assert(checkoutHtml.indexOf('Gated Society Gate Pass &amp; Delivery Preferences') !== -1, 'checkout.html has dedicated gated society preference title');
assert(checkoutHtml.indexOf('Bahria Town') !== -1 && checkoutHtml.indexOf('DHA') !== -1 && checkoutHtml.indexOf('Sector F/E/G') !== -1, 'checkout.html specifies society guidance (Bahria Town, DHA, Sector F/E/G)');

var mainJs = fs.readFileSync(path.join(rootDir, 'js', 'main.js'), 'utf8');
assert(mainJs.indexOf('gateInstructions: notesVal') !== -1, 'main.js saves gate instructions into local order history');
assert(mainJs.indexOf('Gate / Delivery Instructions:') !== -1, 'main.js renders gate instructions on confirmation receipt');

// TEST SUITE 3: 1-Click Bank Transfer IBAN & Mobile Wallet Copy
console.log('\n3. 1-Click Bank Transfer & Mobile Wallet Copy:');
assert(checkoutHtml.indexOf('data-copy="PK64SCBL0000001123456701"') !== -1, 'checkout.html configures 1-click Standard Chartered IBAN copy attribute');
assert(checkoutHtml.indexOf('data-copy="0300-5551234"') !== -1, 'checkout.html configures 1-click JazzCash/EasyPaisa mobile wallet copy attribute');
assert(mainJs.indexOf("e.target.closest('.btn-copy-iban')") !== -1, 'main.js handles .btn-copy-iban click event delegation');

// TEST SUITE 4: PWA Web App Manifest (manifest.webmanifest)
console.log('\n4. PWA Web App Manifest Schema:');
var manifestPath = path.join(rootDir, 'manifest.webmanifest');
assert(fs.existsSync(manifestPath), 'manifest.webmanifest exists in root directory');

var manifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert(manifestJson.name && manifestJson.name.indexOf('FloraMesh') !== -1, 'Manifest specifies complete app name');
assert(manifestJson.short_name === 'FloraMesh', 'Manifest specifies short_name FloraMesh');
assert(manifestJson.start_url === './index.html', 'Manifest specifies valid start_url');
assert(manifestJson.display === 'standalone', 'Manifest specifies standalone display mode');
assert(manifestJson.theme_color === '#2C4A3E', 'Manifest declares Heritage Forest theme_color #2C4A3E');
assert(Array.isArray(manifestJson.icons) && manifestJson.icons.length >= 2, 'Manifest defines required application icons');

// TEST SUITE 5: Offline Service Worker (sw.js)
console.log('\n5. Offline Service Worker (sw.js):');
var swPath = path.join(rootDir, 'sw.js');
assert(fs.existsSync(swPath), 'sw.js exists in root directory');

var swContent = fs.readFileSync(swPath, 'utf8');
assert(swContent.indexOf('CACHE_NAME') !== -1, 'sw.js defines versioned CACHE_NAME');
assert(swContent.indexOf('./index.html') !== -1 && swContent.indexOf('./shop.html') !== -1, 'sw.js pre-caches core HTML templates');
assert(swContent.indexOf('./css/tokens.css') !== -1 && swContent.indexOf('./js/main.js') !== -1, 'sw.js pre-caches CSS tokens and JS bundles');
assert(swContent.indexOf("self.addEventListener('install'") !== -1, 'sw.js implements install event listener');
assert(swContent.indexOf("self.addEventListener('activate'") !== -1, 'sw.js implements activate cache cleanup listener');
assert(swContent.indexOf("self.addEventListener('fetch'") !== -1, 'sw.js implements network-first and cache fallback fetch handler');

// TEST SUITE 6: Robots.txt Directives & Sitemap
console.log('\n6. Robots.txt Directives:');
var robotsContent = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf8');
assert(robotsContent.indexOf('User-agent: *') !== -1, 'robots.txt defines universal User-agent');
assert(robotsContent.indexOf('Allow: /') !== -1, 'robots.txt allows root crawling');
assert(robotsContent.indexOf('Disallow: /cart.html') !== -1, 'robots.txt disallows private cart indexing');
assert(robotsContent.indexOf('Disallow: /checkout.html') !== -1, 'robots.txt disallows private checkout indexing');
assert(robotsContent.indexOf('Sitemap: https://floramesh.pk/sitemap.xml') !== -1, 'robots.txt points to sitemap.xml');

// TEST SUITE 7: Sitemap.xml Schema & Coverage
console.log('\n7. Sitemap.xml Full Coverage:');
var sitemapContent = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
assert(sitemapContent.indexOf('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') !== -1, 'sitemap.xml uses valid XML sitemap namespace');
assert(sitemapContent.indexOf('https://floramesh.pk/compare.html') !== -1, 'sitemap.xml indexes compare.html');
assert(sitemapContent.indexOf('https://floramesh.pk/accessibility.html') !== -1, 'sitemap.xml indexes accessibility.html');
assert(sitemapContent.indexOf('https://floramesh.pk/sitemap.html') !== -1, 'sitemap.xml indexes sitemap.html');

var allProductsIndexed = products.every(function (p) {
  return sitemapContent.indexOf('https://floramesh.pk/product.html?slug=' + p.slug) !== -1;
});
assert(allProductsIndexed, 'sitemap.xml indexes all 25 catalogue product URLs');

// TEST SUITE 8: LLM Machine Discovery Specs (llms.txt & llms-full.txt)
console.log('\n8. LLM Machine Discovery Documentation:');
var llmsPath = path.join(rootDir, 'llms.txt');
var llmsFullPath = path.join(rootDir, 'llms-full.txt');
assert(fs.existsSync(llmsPath), 'llms.txt exists in root directory');
assert(fs.existsSync(llmsFullPath), 'llms-full.txt exists in root directory');

var llmsText = fs.readFileSync(llmsPath, 'utf8');
assert(llmsText.indexOf('Aap ka khayal, hamara poda, sarsabz jahan') !== -1, 'llms.txt contains FloraMesh tagline');
assert(llmsText.indexOf('Islamabad and Rawalpindi') !== -1, 'llms.txt specifies twin-city service area');
assert(llmsText.indexOf('48-hour replacement policy') !== -1, 'llms.txt details transit damage replacement terms');

var llmsFullText = fs.readFileSync(llmsFullPath, 'utf8');
assert(llmsFullText.indexOf('Potohar 5-Season Horticultural Calendar') !== -1, 'llms-full.txt documents 5 Potohar micro-seasons');
assert(llmsFullText.indexOf('Volumetric Water Content (VWC)') !== -1, 'llms-full.txt documents IoT telemetry technical specifications');
assert(llmsFullText.indexOf('PK64SCBL0000001123456701') !== -1, 'llms-full.txt documents Standard Chartered IBAN');

// TEST SUITE 9: Comprehensive Social & Manifest Metadata on All 17 Pages
console.log('\n9. Social & Manifest Metadata on All 17 Storefront Pages:');
var storefrontPages = [
  'index.html',
  'shop.html',
  'product.html',
  'cart.html',
  'checkout.html',
  'compare.html',
  'wishlist.html',
  'my-account.html',
  'about.html',
  'contact.html',
  'faq.html',
  'shipping-returns.html',
  'terms.html',
  'privacy.html',
  'accessibility.html',
  'sitemap.html',
  '404.html'
];

var allPagesValid = storefrontPages.every(function (pageFile) {
  var html = fs.readFileSync(path.join(rootDir, pageFile), 'utf8');
  var hasOg = html.indexOf('property="og:title"') !== -1 && html.indexOf('property="og:image"') !== -1;
  var hasTw = html.indexOf('name="twitter:card"') !== -1 && html.indexOf('name="twitter:title"') !== -1;
  var hasManifest = html.indexOf('manifest.webmanifest') !== -1;
  var hasCanonical = html.indexOf('rel="canonical"') !== -1;
  return hasOg && hasTw && hasManifest && hasCanonical;
});
assert(allPagesValid, 'All 17 HTML storefront templates have valid Open Graph, Twitter Cards, Manifest links, and Canonical tags');

console.log('\n====================================================');
console.log('RESULTS: ' + passed + ' passed, ' + failed + ' failed');
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
}
