const fs = require('fs');
const path = require('path');

global.window = global;
require('../data/products.js');
const products = global.FLORAMESH_PRODUCTS;

const staticPages = [
  { loc: 'https://floramesh.pk/', lastmod: '2026-10-28', changefreq: 'weekly', priority: '1.0' },
  { loc: 'https://floramesh.pk/shop.html', lastmod: '2026-10-28', changefreq: 'weekly', priority: '0.9' },
  { loc: 'https://floramesh.pk/cart.html', lastmod: '2026-10-28', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://floramesh.pk/checkout.html', lastmod: '2026-10-28', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://floramesh.pk/wishlist.html', lastmod: '2026-10-28', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://floramesh.pk/my-account.html', lastmod: '2026-10-28', changefreq: 'monthly', priority: '0.6' },
  { loc: 'https://floramesh.pk/about.html', lastmod: '2026-10-28', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://floramesh.pk/contact.html', lastmod: '2026-10-28', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://floramesh.pk/faq.html', lastmod: '2026-10-28', changefreq: 'monthly', priority: '0.8' },
  { loc: 'https://floramesh.pk/shipping-returns.html', lastmod: '2026-10-28', changefreq: 'monthly', priority: '0.7' },
  { loc: 'https://floramesh.pk/privacy.html', lastmod: '2026-10-28', changefreq: 'yearly', priority: '0.5' },
  { loc: 'https://floramesh.pk/terms.html', lastmod: '2026-10-28', changefreq: 'yearly', priority: '0.5' },
  { loc: 'https://floramesh.pk/compare.html', lastmod: '2026-10-28', changefreq: 'weekly', priority: '0.7' },
  { loc: 'https://floramesh.pk/accessibility.html', lastmod: '2026-10-28', changefreq: 'monthly', priority: '0.5' },
  { loc: 'https://floramesh.pk/sitemap.html', lastmod: '2026-10-28', changefreq: 'weekly', priority: '0.6' }
];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

staticPages.forEach(p => {
  xml += '  <url>\n';
  xml += `    <loc>${p.loc}</loc>\n`;
  xml += `    <lastmod>${p.lastmod}</lastmod>\n`;
  xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
  xml += `    <priority>${p.priority}</priority>\n`;
  xml += '  </url>\n';
});

xml += `  <!-- ${products.length} Products & Services -->\n`;

products.forEach(p => {
  xml += '  <url>\n';
  xml += `    <loc>https://floramesh.pk/product.html?slug=${p.slug}</loc>\n`;
  xml += '    <lastmod>2026-10-28</lastmod>\n';
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.8</priority>\n';
  xml += '  </url>\n';
});

xml += '</urlset>\n';

fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), xml, 'utf8');
console.log('Successfully updated sitemap.xml with ' + products.length + ' products!');
