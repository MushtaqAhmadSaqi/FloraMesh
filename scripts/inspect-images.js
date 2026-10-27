const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'assets', 'images', 'products');
if (!fs.existsSync(dir)) {
  console.log('Dir does not exist:', dir);
  process.exit(1);
}

const files = fs.readdirSync(dir);
const list = [];
files.forEach(f => {
  const fp = path.join(dir, f);
  const st = fs.statSync(fp);
  list.push({ name: f, size: st.size, kb: (st.size / 1024).toFixed(1) });
});

list.sort((a, b) => b.size - a.size);

console.log('Total Product Images:', list.length);
const over120 = list.filter(item => item.size > 120 * 1024);
console.log('Over 120KB count:', over120.length);
console.log('Top 15 largest images:');
list.slice(0, 15).forEach(item => {
  console.log(`  ${item.name.padEnd(50)} ${item.kb} KB`);
});

const totalSize = list.reduce((acc, cur) => acc + cur.size, 0);
console.log(`Total Product Images Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

try {
  const sharp = require('sharp');
  console.log('Sharp: AVAILABLE');
} catch (e) {
  console.log('Sharp: NOT available');
}

const { execSync } = require('child_process');
try {
  const cwebp = execSync('cwebp -version', { stdio: 'pipe' }).toString();
  console.log('cwebp: AVAILABLE', cwebp.trim());
} catch (e) {
  console.log('cwebp: NOT available');
}
