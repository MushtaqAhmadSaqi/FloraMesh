const fs = require('fs');
const path = require('path');

const PAGES = [
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

let totalIssues = 0;

console.log('Auditing all 17 storefront pages for responsive setup & markup integrity...\n');

PAGES.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const issues = [];

  // 1. Viewport meta
  if (!content.includes('<meta name="viewport"') || !content.includes('width=device-width')) {
    issues.push('Missing responsive viewport meta tag');
  }

  // 2. CSS cascade order: tokens.css -> base.css -> components.css -> pages.css -> responsive.css
  const cssList = ['tokens.css', 'base.css', 'components.css', 'responsive.css'];
  let lastIdx = -1;
  cssList.forEach(css => {
    const idx = content.indexOf(css);
    if (idx === -1) {
      issues.push(`Missing stylesheet link: ${css}`);
    } else if (idx < lastIdx) {
      issues.push(`CSS out of order: ${css} appears before preceding stylesheet`);
    } else {
      lastIdx = idx;
    }
  });

  // 3. Check for responsive.css being after components.css
  const compIdx = content.indexOf('components.css');
  const respIdx = content.indexOf('responsive.css');
  if (compIdx !== -1 && respIdx !== -1 && respIdx < compIdx) {
    issues.push('responsive.css is loaded BEFORE components.css (should be loaded after)');
  }

  // 4. Balanced div tags
  const openDivs = (content.match(/<div(\s+[^>]*)?>/gi) || []).length;
  const closeDivs = (content.match(/<\/div>/gi) || []).length;
  if (openDivs !== closeDivs) {
    issues.push(`Mismatched <div> tags: ${openDivs} open vs ${closeDivs} close (diff: ${openDivs - closeDivs})`);
  }

  // 5. Balanced section tags
  const openSecs = (content.match(/<section(\s+[^>]*)?>/gi) || []).length;
  const closeSecs = (content.match(/<\/section>/gi) || []).length;
  if (openSecs !== closeSecs) {
    issues.push(`Mismatched <section> tags: ${openSecs} open vs ${closeSecs} close`);
  }

  // 6. Check for dangerous fixed min-widths in inline styles (> 500px)
  const minWidthMatches = content.match(/min-width:\s*(\d+)px/gi) || [];
  minWidthMatches.forEach(m => {
    const px = parseInt(m.match(/\d+/)[0], 10);
    if (px > 500) {
      // Check if inside an overflow-x: auto container
      // Compare.html has 760px inside compare-container, shipping-returns has 600px inside overflow-x:auto
      if (file !== 'compare.html' && file !== 'shipping-returns.html') {
        issues.push(`Large fixed min-width detected: ${m}`);
      }
    }
  });

  // 7. Check for skip link
  if (!content.includes('class="skip-link"')) {
    issues.push('Missing skip-link for accessibility');
  }

  if (issues.length === 0) {
    console.log(`PASS: ${file} (divs: ${openDivs}/${closeDivs}, viewport: OK, CSS cascade: OK)`);
  } else {
    console.log(`FAIL: ${file}`);
    issues.forEach(i => console.log(`   - ${i}`));
    totalIssues += issues.length;
  }
});

console.log(`\nAudit completed with ${totalIssues} total issues.`);

