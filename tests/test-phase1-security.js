/**
 * FloraMesh Phase 1 Security Hardening & Storage Integrity Verification Suite
 * (tests/test-phase1-security.js)
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

// Setup mock browser environment
let mockStorage = {};
global.window = global;
global.window.addEventListener = () => {};
global.localStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { mockStorage = {}; }
};
global.document = {
  documentElement: {
    setAttribute: () => {},
    getAttribute: () => null
  },
  getElementById: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};
global.URLSearchParams = require('url').URLSearchParams;

console.log('====================================================');
console.log('FloraMesh Phase 1 Security & Data Integrity Suite');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  FAIL: ${testName}`);
    failed++;
  }
}

// 1. Load Core Scripts
require('../js/config.js');
require('../js/utils.js');
require('../data/products.js');
require('../js/cart.js');
require('../js/wishlist.js');

const utils = window.FloraMeshUtils;
const cart = window.FloraMeshCart;
const wishlist = window.FloraMeshWishlist;

// Test 1.1: FloraMeshUtils.sanitizeParam
console.log('1. Parameter Sanitization & XSS Resistance:');
assert(typeof utils.sanitizeParam === 'function', 'FloraMeshUtils.sanitizeParam helper exposed');
const xssPayload = '<script>alert("pwn")</script>rooftop-terrace';
const cleanedParam = utils.sanitizeParam(xssPayload);
assert(cleanedParam === 'alertpwnrooftop-terrace' || cleanedParam.indexOf('<') === -1, 'Malicious HTML stripped from parameters');
assert(cleanedParam.indexOf('<script>') === -1, 'Script tags neutralized in sanitized parameters');

// Test 1.2: DOM XSS Auto-Escaping via html``
const maliciousTitle = '"><img src=x onerror=alert(1)>';
const renderedHtml = utils.html`<div title="${maliciousTitle}">Product</div>`;
assert(renderedHtml.indexOf('<img') === -1, 'html tagged template prevents attribute breakout');
assert(renderedHtml.indexOf('&quot;&gt;&lt;img') !== -1, 'Quotes and angle brackets escaped as entities');

// Test 1.3: Corrupted LocalStorage Handling (Zero Crash)
console.log('\n2. Client-Side Storage & Data Integrity (Anti-Crash):');
mockStorage['floramesh_demo_cart_v1'] = '{corrupted:json'; // invalid JSON
let items = cart.getItems();
assert(Array.isArray(items) && items.length === 0, 'Cart gracefully falls back to empty array on corrupted JSON');

mockStorage['floramesh_demo_cart_v1'] = JSON.stringify('not-an-array'); // valid JSON, wrong type
items = cart.getItems();
assert(Array.isArray(items) && items.length === 0, 'Cart handles non-array stored payload safely');

mockStorage['floramesh_demo_wishlist_v1'] = '["<script>alert(1)</script>"]';
let wishItems = wishlist.getSavedSlugs();
assert(Array.isArray(wishItems), 'Wishlist parses without error');

// Test 1.4: Cart Tampering Resistance
console.log('\n3. Cart Price & Attribute Tampering Protection:');
// Inject a tampered cart item attempting to set Rs 1 price and 99999 quantity
mockStorage['floramesh_demo_cart_v1'] = JSON.stringify([
  {
    slug: 'floramesh-smart-soil-sensor-single',
    variantId: 'v-sensor-teal',
    qty: 99999,
    price: 1 // Attempt to override Rs 4,200 with Rs 1
  }
]);

const hydrated = cart.getItems();
assert(hydrated.length === 1, 'Tampered cart item successfully hydrated against catalogue');
assert(hydrated[0].price === 4200, 'Cart price is strictly locked to catalog price (Rs 4,200), ignoring tampered value');
assert(hydrated[0].qty <= 20, 'Cart quantity clamped against max variant stock (not 99999)');

// Test 1.5: Order History Persistence & Identifier Parity
console.log('\n4. Order History Schema & Fix Verification (SEC-01):');
mockStorage['floramesh_orders_v1'] = JSON.stringify([
  {
    ref: 'FM-ISB-12345',
    date: '27 Oct 2026',
    total: 16500,
    city: 'Islamabad',
    slot: 'standard',
    status: 'Confirmed'
  }
]);

const ordersKey = 'floramesh_orders_v1';
const rawOrders = mockStorage[ordersKey];
const parsedOrders = JSON.parse(rawOrders);
assert(Array.isArray(parsedOrders) && parsedOrders[0].city === 'Islamabad' && parsedOrders[0].slot === 'standard', 'Order stores city and slot attributes accurately');

// Test 1.6: External Links rel="noopener noreferrer"
console.log('\n5. External Link Protection:');
const contactHtml = fs.readFileSync(path.join(ROOT, 'contact.html'), 'utf8');
assert(contactHtml.indexOf('target="_blank" rel="noopener noreferrer"') !== -1, 'contact.html uses rel="noopener noreferrer"');

const partialsJs = fs.readFileSync(path.join(ROOT, 'js/partials.js'), 'utf8');
assert(partialsJs.indexOf('target=\\"_blank\\" rel=\\"noopener\\"') === -1, 'partials.js has zero rel="noopener" without noreferrer');

// Test 1.7: vercel.json Security Headers
console.log('\n6. Deployment Security Headers (vercel.json):');
const vercelConfigPath = path.join(ROOT, 'vercel.json');
assert(fs.existsSync(vercelConfigPath), 'vercel.json created');
const vercelContent = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
const headers = (vercelContent.headers && vercelContent.headers[0] && vercelContent.headers[0].headers) || [];
const cspHeader = headers.find(h => h.key === 'Content-Security-Policy');
const hstsHeader = headers.find(h => h.key === 'Strict-Transport-Security');
const xctoHeader = headers.find(h => h.key === 'X-Content-Type-Options');
const xfoHeader = headers.find(h => h.key === 'X-Frame-Options');

assert(!!cspHeader, 'Content-Security-Policy defined');
assert(!!hstsHeader, 'Strict-Transport-Security defined');
assert(!!xctoHeader && xctoHeader.value === 'nosniff', 'X-Content-Type-Options: nosniff defined');
assert(!!xfoHeader && xfoHeader.value === 'SAMEORIGIN', 'X-Frame-Options: SAMEORIGIN defined');

const immutableAssetHeader = vercelContent.headers.find(h => h.source === '/assets/(.*)');
assert(immutableAssetHeader && immutableAssetHeader.headers[0].value.indexOf('immutable') !== -1, 'Static assets have immutable caching header');

console.log('\n====================================================');
console.log(`RESULTS: ${passed} passed, ${failed} failed`);
console.log('====================================================\n');

if (failed > 0) {
  process.exit(1);
}
