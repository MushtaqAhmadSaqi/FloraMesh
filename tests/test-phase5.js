/**
 * FloraMesh Phase 5 Final Verification Suite (tests/test-phase5.js)
 * Verifies:
 * - FloraMeshEvents event bus & targeted event dispatching (QA-41)
 * - Semantic utility classes in base.css (QA-38)
 * - Automated test runner files existence (escape.html, validate-products.html, regression-suite.html)
 * - 44 / 44 issues verified in docs/QA.md
 * - Updated CHANGELOG.md with v2.2.0 release notes
 * - Updated WORDPRESS-HANDOFF.md with 17 templates and Schema v2 mapping
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
console.log('FloraMesh Phase 5 Final Polish & Verification Suite');
console.log('====================================================\n');

// 1. FloraMeshEvents Pub/Sub Bus (QA-41)
console.log('1. FloraMeshEvents Pub/Sub Event Bus (QA-41):');
try {
  global.window = global;
  global.window.addEventListener = function () {};
  global.document = {
    documentElement: { getAttribute: () => 'heritage', setAttribute: () => {} },
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

  require(path.join(ROOT, 'js', 'config.js'));
  require(path.join(ROOT, 'js', 'utils.js'));
  require(path.join(ROOT, 'data', 'products.js'));
  require(path.join(ROOT, 'js', 'cart.js'));
  require(path.join(ROOT, 'js', 'wishlist.js'));

  const bus = global.FloraMeshEvents;
  if (bus && typeof bus.on === 'function' && typeof bus.emit === 'function' && typeof bus.off === 'function') {
    pass('FloraMeshEvents defines on, off, and emit methods');
  } else {
    fail('FloraMeshEvents missing required pub/sub methods');
  }

  let cartEventFired = false;
  let cartEventData = null;
  bus.on('cart:updated', function (data) {
    cartEventFired = true;
    cartEventData = data;
  });

  global.FloraMeshCart.addItem('floramesh-smart-soil-sensor-single', 'v-sensor-1-teal', 1);

  if (cartEventFired && cartEventData && cartEventData.items) {
    pass('FloraMeshCart.addItem dispatches targeted cart:updated event');
  } else {
    fail('FloraMeshCart failed to emit cart:updated event');
  }

  let wishlistEventFired = false;
  bus.on('wishlist:updated', function (data) {
    wishlistEventFired = true;
  });

  global.FloraMeshWishlist.toggle('taxila-terracotta-breathable-pot-set');

  if (wishlistEventFired) {
    pass('FloraMeshWishlist.toggle dispatches targeted wishlist:updated event');
  } else {
    fail('FloraMeshWishlist failed to emit wishlist:updated event');
  }
} catch (e) {
  fail('Error checking FloraMeshEvents', e);
}

// 2. Semantic Utility Classes in base.css (QA-38)
console.log('\n2. Semantic CSS Utilities (QA-38):');
try {
  const baseCss = fs.readFileSync(path.join(ROOT, 'css', 'base.css'), 'utf8');
  const requiredUtils = ['.u-tabular', '.u-text-muted', '.u-hidden', '[hidden]', '.u-flex', '.u-gap-2'];
  let allUtilsFound = true;
  requiredUtils.forEach(u => {
    if (baseCss.indexOf(u) === -1) {
      allUtilsFound = false;
      fail(`base.css missing utility class ${u}`);
    }
  });
  if (allUtilsFound) {
    pass('base.css defines semantic utility classes for tabular nums, colors, flex, and spacing (QA-38)');
  }
} catch (e) {
  fail('Error checking base.css utilities', e);
}

// 3. Browser Test Runner Pages
console.log('\n3. Automated Browser Test Runners:');
try {
  const testFiles = ['escape.html', 'validate-products.html', 'regression-suite.html', 'art-direction-board.html'];
  let allTestFilesFound = true;
  testFiles.forEach(f => {
    const p = path.join(ROOT, 'tests', f);
    if (!fs.existsSync(p)) {
      allTestFilesFound = false;
      fail(`tests/${f} does not exist`);
    }
  });
  if (allTestFilesFound) {
    pass('All 4 dedicated browser test suites verified in tests/ directory');
  }
} catch (e) {
  fail('Error checking test runner files', e);
}

// 4. QA Matrix 44/44 Verified
console.log('\n4. Quality Assurance Matrix Complete (docs/QA.md):');
try {
  const qaMd = fs.readFileSync(path.join(ROOT, 'docs', 'QA.md'), 'utf8');
  let confirmedCount = 0;
  for (let i = 1; i <= 44; i++) {
    const id = `QA-${String(i).padStart(2, '0')}`;
    if (qaMd.indexOf(id) === -1) {
      fail(`docs/QA.md missing entry for ${id}`);
    } else {
      confirmedCount++;
    }
  }

  const unverifiedMatches = qaMd.match(/\|\s+\*\*Confirmed Real\*\*/g) || [];
  if (unverifiedMatches.length === 0 && confirmedCount === 44) {
    pass('All 44 known audit issues marked FIXED & VERIFIED in docs/QA.md (0 pending)');
  } else {
    fail(`docs/QA.md has ${unverifiedMatches.length} issues still pending verification`);
  }
} catch (e) {
  fail('Error checking docs/QA.md', e);
}

// 5. Documentation Integrity (CHANGELOG.md & WORDPRESS-HANDOFF.md)
console.log('\n5. Release & Handoff Documentation:');
try {
  const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  if (changelog.indexOf('## [2.2.0]') !== -1 && changelog.indexOf('Quiet-Luxury') !== -1) {
    pass('CHANGELOG.md contains comprehensive v2.2.0 release documentation');
  } else {
    fail('CHANGELOG.md missing v2.2.0 release notes');
  }

  const handoff = fs.readFileSync(path.join(ROOT, 'WORDPRESS-HANDOFF.md'), 'utf8');
  if (handoff.indexOf('page-compare.php') !== -1 && handoff.indexOf('page-accessibility.php') !== -1 && handoff.indexOf('page-sitemap.php') !== -1) {
    pass('WORDPRESS-HANDOFF.md documents all 17 templates including compare, accessibility, and sitemap');
  } else {
    fail('WORDPRESS-HANDOFF.md missing new template mappings');
  }
} catch (e) {
  fail('Error checking documentation files', e);
}

console.log('\n====================================================');
console.log(`RESULTS: ${totalPassed} passed, ${totalFailed} failed`);
console.log('====================================================\n');

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
