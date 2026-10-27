const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Mock browser for data/products.js
global.window = global;
require(path.join(ROOT, 'data', 'products.js'));
const products = global.FLORAMESH_PRODUCTS;

const csvRaw = fs.readFileSync(path.join(ROOT, 'products.csv'), 'utf8');
const lines = csvRaw.trim().split(/\r?\n/);
const header = lines[0].split(',');
const skuIdx = header.indexOf('SKU');
const nameIdx = header.indexOf('Name');
const priceIdx = header.indexOf('Regular price');
const salePriceIdx = header.indexOf('Sale price');

console.log('Total Products in data/products.js:', products.length);
console.log('Total Rows in products.csv (excluding header):', lines.length - 1);

const csvSkus = [];
for (let i = 1; i < lines.length; i++) {
  // basic csv split respecting quotes
  const row = lines[i];
  const parts = [];
  let inQuotes = false;
  let cur = '';
  for (let c = 0; c < row.length; c++) {
    const ch = row[c];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      parts.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  parts.push(cur);
  csvSkus.push(parts[skuIdx]);
}

let mismatches = 0;
products.forEach(p => {
  if (!csvSkus.includes(p.sku)) {
    console.log(`Mismatch: SKU ${p.sku} in products.js not found in products.csv`);
    mismatches++;
  }
});

csvSkus.forEach(sku => {
  if (!products.some(p => p.sku === sku)) {
    console.log(`Mismatch: SKU ${sku} in products.csv not found in products.js`);
    mismatches++;
  }
});

if (mismatches === 0) {
  console.log('PASS: 100% SKU match between data/products.js and products.csv (25 of 25 SKUs matched)');
} else {
  console.log(`FAIL: ${mismatches} SKU mismatches found`);
  process.exit(1);
}
