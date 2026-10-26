/**
 * FloraMesh WCAG 2.2 AA Contrast Checker (scripts/check-contrast.js)
 * Computes exact relative luminance and contrast ratios across all semantic token pairs.
 */
function luminance(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const rgb = [0, 1, 2].map(i => {
    let v = parseInt(c.substr(i * 2, 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrast(hex1, hex2) {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

const suites = {
  heritage: [
    ['Canvas Background', '#FAF7F0', 'Primary Text', '#10241B', 4.5],
    ['Canvas Background', '#FAF7F0', 'Muted Text', '#54655B', 4.5],
    ['Canvas Background', '#FAF7F0', 'Pine Link', '#0F766E', 4.5],
    ['Canvas Background', '#FAF7F0', 'Terracotta Accent', '#B4572F', 4.5],
    ['Card Surface', '#FFFFFF', 'Primary Text', '#10241B', 4.5],
    ['Card Surface', '#FFFFFF', 'Muted Text', '#54655B', 4.5],
    ['Card Surface', '#FFFFFF', 'Pine Link', '#0F766E', 4.5],
    ['Card Surface', '#FFFFFF', 'Terracotta Accent', '#B4572F', 4.5],
    ['Primary Button', '#10241B', 'Button Text', '#FAF7F0', 4.5],
    ['Accent Button', '#B4572F', 'Button Text', '#FFFFFF', 4.5],
    ['Success Alert Bg', '#DCFCE7', 'Success Text', '#15803D', 4.5],
    ['Warning Alert Bg', '#FEF3C7', 'Warning Text', '#B45309', 4.5],
    ['Danger Alert Bg', '#FEE2E2', 'Danger Text', '#B91C1C', 4.5]
  ],
  midnight: [
    ['Canvas Background', '#0C1814', 'Primary Text', '#EEE9DC', 4.5],
    ['Canvas Background', '#0C1814', 'Muted Text', '#A3B5AA', 4.5],
    ['Canvas Background', '#0C1814', 'Glow Teal Link', '#5EEAD4', 4.5],
    ['Canvas Background', '#0C1814', 'Warm Brass Accent', '#D9A66B', 4.5],
    ['Card Surface', '#132520', 'Primary Text', '#EEE9DC', 4.5],
    ['Card Surface', '#132520', 'Muted Text', '#A3B5AA', 4.5],
    ['Card Surface', '#132520', 'Glow Teal Link', '#5EEAD4', 4.5],
    ['Card Surface', '#132520', 'Warm Brass Accent', '#D9A66B', 4.5],
    ['Primary Button', '#2DD4BF', 'Button Text', '#04201B', 4.5],
    ['Accent Button', '#D9A66B', 'Button Text', '#1C1204', 4.5],
    ['Card Surface', '#132520', 'Success Text', '#4ADE80', 4.5],
    ['Card Surface', '#132520', 'Warning Text', '#FBBF24', 4.5],
    ['Card Surface', '#132520', 'Danger Text', '#F87171', 4.5]
  ]
};

console.log('FloraMesh Color Token Contrast Validation');
console.log('========================================');
for (const [theme, pairs] of Object.entries(suites)) {
  console.log(`\nTheme: ${theme.toUpperCase()}`);
  for (const [bgName, bgHex, fgName, fgHex, required] of pairs) {
    const ratio = contrast(bgHex, fgHex);
    const pass = ratio >= required ? 'PASS' : 'FAIL';
    console.log(`[${pass}] ${ratio.toFixed(2)}:1 (req ${required}:1) | ${bgName} (${bgHex}) vs ${fgName} (${fgHex})`);
  }
}
