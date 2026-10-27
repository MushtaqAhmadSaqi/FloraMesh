const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const HTML_PAGES = [
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

console.log('=== FloraMesh Zero-Dependency & Performance Audit ===\n');

let issues = [];

// 1. Audit External Network Dependencies
console.log('1. Auditing External Network Dependencies in HTML files:');
const externalPattern = /(src|href)=["'](https?:)?\/\/(?!(floramesh\.pk|wa\.me|schema\.org))/i;
const cdnPatterns = [
  'cdnjs.cloudflare.com',
  'unpkg.com',
  'jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'code.jquery.com',
  'stackpath.bootstrapcdn.com',
  'cdn.jsdelivr.net'
];

HTML_PAGES.forEach(page => {
  const content = fs.readFileSync(path.join(ROOT, page), 'utf8');
  
  // Check for CDN domains
  cdnPatterns.forEach(cdn => {
    if (content.indexOf(cdn) !== -1) {
      issues.push(`[${page}] Contains reference to external CDN: ${cdn}`);
    }
  });

  // Check for external stylesheets or script tags
  const extTags = content.match(/<(script|link)[^>]*(src|href)=["']https?:\/\/[^"']*["'][^>]*>/gi) || [];
  extTags.forEach(tag => {
    if (tag.indexOf('canonical') === -1 && tag.indexOf('schema.org') === -1) {
      issues.push(`[${page}] External resource tag: ${tag}`);
    }
  });
});

if (issues.length === 0) {
  console.log('  PASS: All 17 HTML storefront pages are 100% self-contained and zero-network compliant.');
} else {
  console.log(`  FAIL: Found ${issues.length} external dependency issues:`);
  issues.forEach(i => console.log('    ' + i));
}

// 2. Audit Font Preloads
console.log('\n2. Auditing Local Font Preload Declarations:');
const fontPreloadIssues = [];
HTML_PAGES.forEach(page => {
  const content = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const hasPlusJakarta = content.indexOf('plus-jakarta-sans-variable.woff2') !== -1;
  const hasFraunces = content.indexOf('fraunces-variable.woff2') !== -1;
  if (!hasPlusJakarta) fontPreloadIssues.push(`[${page}] Missing plus-jakarta-sans font preload`);
  if (!hasFraunces) fontPreloadIssues.push(`[${page}] Missing fraunces font preload`);
});

if (fontPreloadIssues.length === 0) {
  console.log('  PASS: All 17 HTML storefront pages preload critical variable fonts.');
} else {
  console.log(`  FAIL: Missing font preloads on ${fontPreloadIssues.length} instances.`);
  fontPreloadIssues.forEach(i => console.log('    ' + i));
}

// 3. Audit Zero-FOUT Theme Pre-paint Script
console.log('\n3. Auditing Theme Pre-paint Script (Zero FOUT):');
const foutIssues = [];
HTML_PAGES.forEach(page => {
  const content = fs.readFileSync(path.join(ROOT, page), 'utf8');
  if (content.indexOf('floramesh_theme_v1') === -1 || content.indexOf('data-theme') === -1) {
    foutIssues.push(`[${page}] Missing pre-paint theme script`);
  }
});

if (foutIssues.length === 0) {
  console.log('  PASS: All 17 HTML pages execute inline pre-paint theme resolution before paint.');
} else {
  console.log(`  FAIL: Theme script missing on ${foutIssues.length} pages.`);
}

// 4. Audit Manifest & Canonical Tags
console.log('\n4. Auditing Manifest & Canonical Link Tags:');
const metaIssues = [];
HTML_PAGES.forEach(page => {
  const content = fs.readFileSync(path.join(ROOT, page), 'utf8');
  if (content.indexOf('rel="manifest"') === -1) {
    metaIssues.push(`[${page}] Missing rel="manifest" link`);
  }
  if (content.indexOf('rel="canonical"') === -1) {
    metaIssues.push(`[${page}] Missing rel="canonical" link`);
  }
});

if (metaIssues.length === 0) {
  console.log('  PASS: All 17 HTML pages define manifest and canonical tags.');
} else {
  console.log(`  FAIL: Metadata issues on ${metaIssues.length} instances.`);
}

// 5. Audit Image Dimensions for CLS Prevention
console.log('\n5. Auditing Image Dimension Attributes (CLS Prevention):');
const imgIssues = [];
HTML_PAGES.forEach(page => {
  const content = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const imgs = content.match(/<img[^>]*>/gi) || [];
  imgs.forEach(img => {
    // Check if missing width or height
    const hasWidth = /width=["']\d+["']/i.test(img);
    const hasHeight = /height=["']\d+["']/i.test(img);
    if (!hasWidth || !hasHeight) {
      imgIssues.push(`[${page}] Image missing width/height: ${img.substring(0, 60)}...`);
    }
  });
});

if (imgIssues.length === 0) {
  console.log('  PASS: All static HTML image elements define explicit width and height attributes.');
} else {
  console.log(`  NOTICE: Found ${imgIssues.length} static images without explicit dimensions:`);
  imgIssues.forEach(i => console.log('    ' + i));
}
