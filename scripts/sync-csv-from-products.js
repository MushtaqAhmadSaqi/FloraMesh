const fs = require('fs');
const path = require('path');

global.window = global;
require('../data/products.js');
const products = global.FLORAMESH_PRODUCTS;

function escapeCsvField(val) {
  if (val === undefined || val === null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

const header = [
  'ID',
  'Type',
  'SKU',
  'Name',
  'Published',
  'Is featured?',
  'Visibility in catalog',
  'Short description',
  'Description',
  'Regular price',
  'Sale price',
  'Categories',
  'Tags',
  'Images',
  'In stock?',
  'Stock',
  'Attribute 1 name',
  'Attribute 1 value(s)',
  'Attribute 1 visible',
  'Attribute 1 global',
  'Meta: _floramesh_materials',
  'Meta: _floramesh_dimensions',
  'Meta: _floramesh_care',
  'Meta: _floramesh_making_story',
  'Meta: _floramesh_giftable'
];

const rows = [header.join(',')];

products.forEach((p, idx) => {
  const rowId = 1001 + idx;
  const variantValues = (p.variants || []).map(v => v.name).join(' | ');
  const images = (p.images || []).map(img => img.src).join(', ');
  const tags = (p.tags || []).join(', ');
  
  const row = [
    rowId,
    'variable',
    p.sku || p.id,
    p.name,
    0,
    p.featured ? 1 : 0,
    'visible',
    p.shortDescription || '',
    p.description || '',
    p.compareAtPrice || p.price,
    p.salePrice ? p.salePrice : (p.price < (p.compareAtPrice || p.price) ? p.price : ''),
    p.category,
    tags,
    images,
    1,
    p.stock || 10,
    'Package / Variant Option',
    variantValues,
    1,
    0,
    p.materials || '',
    p.dimensions || '',
    p.care || '',
    p.makingStory || '',
    p.giftable ? 'yes' : 'no'
  ];
  
  rows.push(row.map(escapeCsvField).join(','));
});

fs.writeFileSync(path.join(__dirname, '..', 'products.csv'), rows.join('\r\n') + '\r\n', 'utf8');
console.log('Successfully wrote products.csv with ' + products.length + ' products!');
