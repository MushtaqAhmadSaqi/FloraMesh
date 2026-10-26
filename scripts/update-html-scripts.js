const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const targetPattern = '<script src="js/config.js"></script>\n  <script src="js/utils.js"></script>\n  <script src="data/products.js"></script>\n  <script src="js/partials.js"></script>';

const replacement = '<script src="js/config.js"></script>\n  <script src="js/icons.js"></script>\n  <script src="js/utils.js"></script>\n  <script src="js/ui.js"></script>\n  <script src="data/products.js"></script>\n  <script src="js/search.js"></script>\n  <script src="js/partials.js"></script>';

let updatedCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Handle both CRLF and LF
  const targetCRLF = targetPattern.replace(/\n/g, '\r\n');
  const replacementCRLF = replacement.replace(/\n/g, '\r\n');

  if (content.includes(targetCRLF)) {
    content = content.replace(targetCRLF, replacementCRLF);
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log('Updated CRLF:', file);
  } else if (content.includes(targetPattern)) {
    content = content.replace(targetPattern, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log('Updated LF:', file);
  } else {
    console.warn('Pattern not matched in:', file);
  }
});

console.log(`Successfully updated ${updatedCount} / ${htmlFiles.length} HTML files.`);
