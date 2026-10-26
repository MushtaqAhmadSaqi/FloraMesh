const fs = require('fs');
const path = require('path');

const boardPath = path.resolve(__dirname, '../tests/art-direction-board.html');
const html = fs.readFileSync(boardPath, 'utf8');

const regex = /(?:src|href)="([^"]+)"/g;
let match;
const missing = [];
const verified = [];

while ((match = regex.exec(html)) !== null) {
  const url = match[1];
  if (url.startsWith('#') || url.startsWith('http') || url.startsWith('data:')) continue;
  const target = path.resolve(__dirname, '../tests', url);
  if (!fs.existsSync(target)) {
    missing.push({ url, target });
  } else {
    verified.push({ url, target });
  }
}

console.log('Verified Assets:', verified.length);
verified.forEach(v => console.log('  [OK]', v.url));
if (missing.length > 0) {
  console.error('Missing Assets:', missing);
  process.exit(1);
} else {
  console.log('All board asset references exist and are valid!');
}
