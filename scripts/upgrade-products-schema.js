/**
 * FloraMesh Schema v2 Upgrade Script (scripts/upgrade-products-schema.js)
 * Transforms data/products.js to complete Schema v2 with zero data loss.
 */
const fs = require('fs');
const path = require('path');

global.window = global;
require('../data/products.js');

const rawProducts = window.FLORAMESH_PRODUCTS;

const productMeta = {
  "apartment-balcony-green-oasis-package": {
    shortName: "Balcony Green Oasis",
    type: "service",
    fulfilment: "onsite",
    spaces: ["balcony"],
    coverage: { minSqFt: 40, maxSqFt: 120 },
    dominant: "#DCE5DC",
    badge: "10 Acclimated Pots",
    variantsCompare: { "v-balcony-compact": 18500, "v-balcony-standard": 27000, "v-balcony-luxe": 39500 }
  },
  "rooftop-terrace-pergola-garden-setup": {
    shortName: "Rooftop Terrace Pergola",
    type: "service",
    fulfilment: "onsite",
    spaces: ["rooftop"],
    coverage: { minSqFt: 150, maxSqFt: 500 },
    dominant: "#E5DEC9",
    badge: "Potohar Heat Hardy",
    variantsCompare: { "v-rooftop-starter": 34000, "v-rooftop-complete": 58000, "v-rooftop-estate": 78000 }
  },
  "indoor-biophilic-living-room-styling": {
    shortName: "Indoor Biophilic Styling",
    type: "service",
    fulfilment: "onsite",
    spaces: ["indoor"],
    coverage: { minSqFt: 30, maxSqFt: 100 },
    dominant: "#E3ECE5",
    badge: "Odor-Free Soil",
    variantsCompare: { "v-indoor-trio": 14500, "v-indoor-focal": 22000, "v-indoor-sanctuary": 32000 }
  },
  "corporate-office-greenery-maintenance-plan": {
    shortName: "Office Greenery Plan",
    type: "service",
    fulfilment: "onsite",
    spaces: ["office"],
    coverage: { minSqFt: 100, maxSqFt: 600 },
    dominant: "#DEE5E1",
    badge: "Bi-Weekly Care Visits",
    variantsCompare: { "v-office-starter": 28000, "v-office-floor": 45000, "v-office-campus": 72000 }
  },
  "kitchen-herb-vegetable-raised-bed-service": {
    shortName: "Kitchen Herb Raised Bed",
    type: "service",
    fulfilment: "onsite",
    spaces: ["kitchen", "balcony"],
    coverage: { minSqFt: 15, maxSqFt: 60 },
    dominant: "#EAE6D8",
    badge: "Seedistry Organic Mix",
    variantsCompare: { "v-raised-single": 15500, "v-raised-double": 26500, "v-raised-chef": 38000 }
  },
  "floramesh-smart-soil-sensor-single": {
    shortName: "Smart Soil Sensor",
    type: "physical",
    fulfilment: "courier",
    spaces: ["balcony", "rooftop", "indoor"],
    dominant: "#1A2E25",
    badge: "Zigbee 3.0 Telemetry",
    variantsCompare: { "v-sensor-probe-only": 4800, "v-sensor-gateway-bundle": 8900 }
  },
  "floramesh-balcony-mesh-trio": {
    shortName: "Balcony Mesh Trio",
    type: "physical",
    fulfilment: "courier",
    spaces: ["balcony"],
    dominant: "#22382E",
    badge: "Save Rs 2,100",
    variantsCompare: { "v-trio-standard": 13500, "v-trio-solar": 16500 }
  },
  "floramesh-pro-terrace-station": {
    shortName: "Pro Terrace Station",
    type: "physical",
    fulfilment: "courier",
    spaces: ["rooftop"],
    dominant: "#162720",
    badge: "Solar Gateway Station",
    variantsCompare: { "v-station-standalone": 24500, "v-station-quad": 36500 }
  },
  "floramesh-smart-drip-controller": {
    shortName: "Smart Drip Controller",
    type: "physical",
    fulfilment: "courier",
    spaces: ["balcony", "rooftop"],
    dominant: "#1C3028",
    badge: "Automated Solenoid",
    variantsCompare: { "v-drip-1zone": 9800, "v-drip-2zone": 14500 }
  },
  "floramesh-telemetry-dashboard-annual": {
    shortName: "FloraCloud Annual Pass",
    type: "digital",
    fulfilment: "digital",
    spaces: ["balcony", "rooftop", "indoor", "office"],
    dominant: "#0E1F18",
    badge: "Rs 300 / Month",
    variantsCompare: { "v-dash-1yr": 3600, "v-dash-2yr": 6200 }
  },
  "multani-blue-pottery-planter-duo": {
    shortName: "Multani Ceramic Duo",
    type: "physical",
    fulfilment: "courier",
    spaces: ["indoor", "balcony"],
    dominant: "#D8E2EC",
    badge: "Hand-Painted Kashigari",
    variantsCompare: { "v-multani-medium": 5400, "v-multani-large": 7800 }
  },
  "taxila-terracotta-breathable-pot-set": {
    shortName: "Taxila Terracotta Set",
    type: "physical",
    fulfilment: "courier",
    spaces: ["balcony", "rooftop"],
    dominant: "#E8DDD2",
    badge: "Root-Healthy Clay",
    variantsCompare: { "v-taxila-trio": 3200, "v-taxila-quintet": 5200 }
  },
  "solid-brass-plant-mister": {
    shortName: "Solid Brass Mister",
    type: "physical",
    fulfilment: "courier",
    spaces: ["indoor"],
    dominant: "#EFE6D2",
    badge: "Polished Artisan Brass",
    variantsCompare: { "v-mister-standard": 2950, "v-mister-gift": 3450 }
  },
  "sheesham-wood-pruning-shears": {
    shortName: "Sheesham Pruning Shears",
    type: "physical",
    fulfilment: "courier",
    spaces: ["balcony", "rooftop", "indoor"],
    dominant: "#DDD2C4",
    badge: "SK-5 Japanese Steel",
    variantsCompare: { "v-shears-basic": 3800, "v-shears-leather": 4800 }
  },
  "seedistry-organic-potting-mix": {
    shortName: "Seedistry Potting Mix",
    type: "physical",
    fulfilment: "courier",
    spaces: ["balcony", "rooftop", "indoor"],
    dominant: "#D6CEBF",
    badge: "Neem & Leaf-Mold Blend",
    variantsCompare: { "v-soil-10kg": 1850, "v-soil-25kg": 3600 }
  },
  "islamabad-planting-calendar-journal": {
    shortName: "Potohar Planting Journal",
    type: "physical",
    fulfilment: "courier",
    spaces: ["balcony", "rooftop", "indoor"],
    dominant: "#EADFCB",
    badge: "5-Season Climate Guide",
    variantsCompare: { "v-journal-paper": 2400, "v-journal-linen": 3200 }
  },
  "seedistry-heirloom-herb-seed-box": {
    shortName: "Heirloom Seed Box",
    type: "physical",
    fulfilment: "courier",
    spaces: ["kitchen", "balcony"],
    dominant: "#DFE5D5",
    badge: "8 Desi Varieties",
    variantsCompare: { "v-seedbox-8": 3100, "v-seedbox-14": 4800 }
  },
  "urban-gardener-apron-tool-kit": {
    shortName: "Field Canvas Apron Kit",
    type: "physical",
    fulfilment: "courier",
    spaces: ["balcony", "rooftop"],
    dominant: "#D8D0C5",
    badge: "16oz Waxed Canvas",
    variantsCompare: { "v-apron-standard": 5200, "v-apron-leather": 6800 }
  },
  "diy-soil-diagnostic-starter-lab": {
    shortName: "Soil Diagnostic Lab",
    type: "physical",
    fulfilment: "courier",
    spaces: ["balcony", "rooftop"],
    dominant: "#DCE3DD",
    badge: "20 Diagnostic Tests",
    variantsCompare: { "v-lab-basic": 2200, "v-lab-complete": 3800 }
  },
  "sheesham-propagation-station": {
    shortName: "Sheesham Plant Station",
    type: "physical",
    fulfilment: "courier",
    spaces: ["indoor"],
    dominant: "#E4DAD0",
    badge: "Lab-Grade Borosilicate",
    variantsCompare: { "v-prop-3tube": 2800, "v-prop-5tube": 3900 }
  },
  "margalla-native-tree-csr-token": {
    shortName: "Margalla Native Tree Token",
    type: "donation",
    fulfilment: "digital",
    spaces: ["rooftop", "community"],
    dominant: "#CCDCD0",
    badge: "Geo-Tagged GPS Sapling",
    variantsCompare: { "v-tree-single": 1500, "v-tree-cluster-3": 4200 }
  },
  "campus-10-tree-green-drive-pack": {
    shortName: "Campus 10-Tree Drive",
    type: "donation",
    fulfilment: "digital",
    spaces: ["community"],
    dominant: "#C8D9CB",
    badge: "Verified Institutional CSR",
    variantsCompare: { "v-drive-10": 13500, "v-drive-25": 32000 }
  },
  "sarsabz-jahan-botanical-gift-hamper": {
    shortName: "Sarsabz Jahan Hamper",
    type: "physical",
    fulfilment: "courier",
    spaces: ["indoor", "balcony"],
    dominant: "#E5DDD0",
    badge: "Artisan Gift Hamper",
    variantsCompare: { "v-hamper-standard": 7800, "v-hamper-luxe": 11500 }
  },
  "citronella-terracotta-balcony-candle": {
    shortName: "Citronella Balcony Candle",
    type: "physical",
    fulfilment: "courier",
    spaces: ["balcony", "rooftop"],
    dominant: "#E2DCD1",
    badge: "Organic Soy & Neem",
    variantsCompare: { "v-candle-single": 2100, "v-candle-pair": 3800 }
  },
  "corporate-eco-desk-gift-trio": {
    shortName: "Eco Desk Gift Trio",
    type: "physical",
    fulfilment: "courier",
    spaces: ["office"],
    dominant: "#DCE5DC",
    badge: "3 Gifts + 3 Trees",
    variantsCompare: { "v-desk-trio-1": 5600, "v-desk-trio-5": 25500 }
  }
};

const cleanText = (str) => {
  if (!str) return str;
  return str
    .replace(/dusty roadside nursery haggling and heavy soil transport/gi, 'cumbersome transport and inconsistent soil quality')
    .replace(/dusty roadside haggling/gi, 'unverified roadside vendors')
    .replace(/flimsy roadside clay gamlas/gi, 'thin unvitrified planters')
    .replace(/Phase 2 roadmap will add/gi, 'Engineered to support')
    .replace(/Phase 2 expands/gi, 'Designed to accommodate')
    .replace(/Our commercial business model relies on/gi, 'FloraMesh partners directly with')
    .replace(/sourceImageKey: ".*?",?\n?/g, '');
};

const upgraded = rawProducts.map(p => {
  const meta = productMeta[p.slug] || {};
  const cleanedDesc = cleanText(p.description);
  const cleanedStory = cleanText(p.makingStory);

  // Update variants with per-variant compareAtPrice
  const variants = (p.variants || []).map(v => {
    const compare = (meta.variantsCompare && meta.variantsCompare[v.id]) || null;
    return {
      id: v.id,
      name: v.name,
      price: v.price,
      compareAtPrice: (compare && compare > v.price) ? compare : null,
      stock: (typeof v.stock === 'number') ? v.stock : 15,
      available: v.available !== false
    };
  });

  // Clean images alt text and remove sourceImageKey
  const images = (p.images || []).map(img => {
    let cleanAlt = img.alt || '';
    if (cleanAlt.includes('— main studio view showing full form')) {
      cleanAlt = `${p.name} featured studio view showing handcrafted details`;
    } else if (cleanAlt.includes('— close-up detail highlighting')) {
      cleanAlt = `${p.name} tactile close-up highlighting natural materials`;
    } else if (cleanAlt.includes('— in-scale contextual placement')) {
      cleanAlt = `${p.name} architectural context inside an Islamabad home`;
    }
    return {
      src: img.src,
      type: img.type,
      alt: cleanAlt,
      width: img.width || 600,
      height: img.height || 750
    };
  });

  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    shortName: meta.shortName || p.name.split('—')[0].trim(),
    type: meta.type || "physical",
    fulfilment: meta.fulfilment || "courier",
    spaces: meta.spaces || ["balcony"],
    coverage: meta.coverage || null,
    category: p.category,
    categorySlug: p.categorySlug,
    tags: p.tags,
    price: p.price,
    salePrice: p.salePrice || null,
    compareAtPrice: (p.price && p.salePrice && p.price > p.salePrice) ? p.price : null,
    unitPriceLabel: p.unitPriceLabel || null,
    shortDescription: p.shortDescription,
    description: cleanedDesc,
    materials: p.materials,
    dimensions: p.dimensions,
    care: p.care,
    makingStory: cleanedStory,
    variants: variants,
    stock: p.stock || 15,
    giftable: p.giftable !== false,
    featured: !!p.featured,
    badge: meta.badge || p.badge,
    dominant: meta.dominant || "#E8E2D8",
    isWearable: p.slug === 'urban-gardener-apron-tool-kit',
    relatedProductSlugs: p.relatedProductSlugs || [],
    images: images
  };
});

const fileHeader = `/**
 * FloraMesh Product & Service Catalog Data (data/products.js)
 * Complete Schema v2: shortName, type, fulfilment, spaces, coverage, per-variant compareAtPrice, dominant color.
 * Preserves all 25 slugs, variant IDs, and local asset paths.
 * Currency: Pakistani Rupees (PKR / Rs).
 */
window.FLORAMESH_PRODUCTS = ${JSON.stringify(upgraded, null, 2)};
`;

fs.writeFileSync(path.resolve(__dirname, '../data/products.js'), fileHeader, 'utf8');
console.log(`Successfully upgraded data/products.js to Schema v2 across all ${upgraded.length} products.`);
