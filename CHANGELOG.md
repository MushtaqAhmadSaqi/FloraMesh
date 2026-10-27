# FloraMesh UX & Front-End Architecture Changelog (`CHANGELOG.md`)

All notable changes to the FloraMesh smart urban landscaping, IoT soil telemetry, and artisan planter platform are documented here.

---

## [2.7.0] - 2026-10-27 (Phase 5: Performance, Asset Compression & Zero-Dependency Optimization)

### Performance & Zero-Dependency Verification (Phase 5.1)
- **100% Zero External Network Compliance:** Audited all 17 storefront HTML pages with `scripts/audit-performance.js`, verifying 0 external CDN scripts, stylesheets, tracking beacons, or remote font requests. The entire application executes completely locally via `file://` protocol.
- **Local Variable Font Optimization:** Preloaded local variable fonts ([assets/fonts/plus-jakarta-sans-variable.woff2](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/assets/fonts/plus-jakarta-sans-variable.woff2) @ 26.7 KB and [assets/fonts/fraunces-variable.woff2](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/assets/fonts/fraunces-variable.woff2) @ 65.7 KB) across all 17 templates to eliminate Flash of Invisible Text (FOIT).
- **Inline Zero-FOUT Theme Resolution:** Verified execution of early pre-paint theme script in `<head>` across all pages before browser paint cycle, preventing Flash of Unstyled Theme (FOUT).

### Catalog Image Budget Audit (Phase 5.2)
- **75-SKU Image Integrity:** Audited all 75 product WebP assets (600×750px) across the 25 SKU catalogue with `scripts/inspect-images.js`. All 75 images stay within the strict 180 KB upper budget limit (maximum is 172.9 KB).
- **Sub-100KB Average Asset Weight:** Average catalog image size is 96.7 KB, totaling only 7.08 MB for the entire 25-product high-resolution catalogue.
- **Zero CLS Layout Stability:** Explicit `width` and `height` dimension attributes preserved across all static and dynamically generated product imagery.

### Runtime Execution & Passive Scrolling (Phase 5.3)
- **Jank-Free 60fps Scroll:** Added `{ passive: true }` flags to scroll listeners in [js/partials.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/partials.js) and [js/main.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/main.js), allowing browser compositor threads to scroll without blocking on JavaScript execution.
- **PWA Service Worker Cache Bump:** Updated [sw.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/sw.js) to `CACHE_NAME = 'floramesh-v2.7.0'` to immediately flush legacy caches and precache [js/delight.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/delight.js).
- **Production Asset Caching:** Configured immutable 1-year cache headers (`Cache-Control: public, max-age=31536000, immutable`) for `/assets/(.*)` in [vercel.json](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/vercel.json).
- **Automated Verification:** Authored dedicated verification suite [tests/test-phase5-perf.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/tests/test-phase5-perf.js) passing 13/13 tests. The total platform automated test harness now executes **305 tests passing 100% (305 passed, 0 failed)** across 10 suites.

---

## [2.6.0] - 2026-10-27 (Phase 4: Botanical & Smart IoT Delight Features)

### Potohar Seasonal Planting Radar (Phase 4.1)
- **Authentic 5-Season Microclimate Model:** Authored `POTOHAR_SEASONS` in [js/delight.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/delight.js) modeling the five recognized Islamabad & Rawalpindi horticultural cycles: *Kohar* (Frost Chills, Dec–Jan), *Bahar* (Spring Bloom, Feb–Mar), *Garmi* (Intense Pre-Monsoon Heat, Apr–Jun), *Barsat* (Monsoon Rains, Jul–Aug), and *Khazan* (Golden Autumn, Sep–Nov).
- **Auto-Month Detection:** Dynamically detects the current calendar month and highlights the active season (`Active Season` badge) with regional ambient temperatures, specific Potohar cultivars, target volumetric water content (VWC %), and targeted catalogue CTAs.
- **Storefront Integration:** Mounted into [index.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/index.html) (`#seasonal-radar-mount`) with Nastaliq Urdu calligraphy titles, smooth responsive tab switching, and touch-scrollable tabs.

### Capacitive Soil Telemetry Simulator (Phase 4.2)
- **Interactive VWC Depletion Curve:** Built an interactive hardware simulator in [js/delight.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/delight.js) allowing homeowners to adjust volumetric water content (5% to 95%) and inspect live mathematical SVG sparkline curves.
- **Microclimate & Planter Material Factor:** Simulates evaporative cooling with porous Taxila terracotta (-2°C root cooling) versus heat-trapping standard plastic gamlas (+1°C to +5°C thermal stress).
- **Four-Tier Alert States:** Dynamically outputs calibrated horticultural advisories: `<20%` Critical Underwatering Alert (`badge--danger`), `20%–39%` Approaching Dry Threshold (`badge--warning`), `40%–70%` Optimal Root-Zone Moisture (`badge--success`), and `>70%` Soil Saturation Warning (`badge--accent`).
- **24-Hour Drying Cycle Simulation:** Features an animated 24-hour moisture depletion cycle demonstrating sensor reporting in extreme Potohar sun.
- **Storefront Integration:** Mounted in the IoT precision sensor bento section of [index.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/index.html) (`#telemetry-simulator-mount`).

### Pot Sizer & Seedistry Living Soil Calculator (Phase 4.3)
- **Substrate Volume Computation:** Implemented multi-shape substrate volume calculator for round tapered gamlas ($V = \frac{\pi \cdot r^2 \cdot h \cdot 0.85}{61.0237}$ for inches, metric equivalent for cm) and rectangular balcony troughs in [js/delight.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/delight.js).
- **Seedistry Bag Distribution & Cost Estimation:** Automatically calculates required quantities of 25-Liter (Rs 1,450) and 10-Liter (Rs 850) Seedistry organic potting mix bags to cover calculated planter volume.
- **1-Click Cart Addition:** Added direct "Add Soil to Garden Basket" action button populating calculated Seedistry bags into the user's active basket with toast notification.
- **Storefront Integration:** Mounted in [shop.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/shop.html) (`#soil-calculator-mount`).

### Shareable Wishlist Links & Integrations (Phase 4.4)
- **WhatsApp & SMS Curation Sharing:** Equipped [wishlist.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/wishlist.html) and [js/main.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/main.js) with `#wishlist-whatsapp-share` and `#wishlist-sms-share` buttons in the wishlist action bar.
- **One-Click Share Generation:** Generates shareable permalinks (`?list=SKU1,SKU2`) with encoded WhatsApp text and native mobile SMS links (`sms:?&body=...`) handled in [js/delight.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/delight.js).

### Customer Plant Health Diagnostic Inquiry (Phase 4.5)
- **Horticultural Triage Modal:** Created accessible dialog in [js/delight.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/delight.js) (`#plant-diagnostic-modal`) allowing homeowners to select their plant, twin-city sector/society, sunlight exposure, watering frequency, and localized symptoms (Yellowing, Crispy Tips, Root Rot, Pests, Wilting).
- **Client-Side Photo Attachment Preview:** Supports local `FileReader` image preview without requiring server-side upload endpoints.
- **Islamabad Diagnostic Code Generation:** Generates traceable reference codes (`#DIAG-ISB-XXXXX`) and preliminary balcony triage tips.
- **Storefront Triggers:** Added consultation triggers in [contact.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/contact.html) (`#open-diagnostic-btn`) and product buy boxes in [js/product.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/product.js) (`#pdp-diagnostic-btn`).

### Local Order Tracking & Van Dispatch Stepper (Phase 4.6)
- **Interactive Dispatch Tracker:** Implemented `initOrderTracker` in [js/delight.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/delight.js) reading orders from `localStorage['floramesh_orders_v1']` or reference query parameters (`?track=FM-ISB-XXXXX`).
- **Milestone Stepper:** Renders visual three-step status (1. Order Confirmed & Acclimated, 2. Van Dispatched En Route, 3. Balcony Installation & Sensor Setup) with pulsating progress indicators.
- **Assigned Field Mali Crew & Society Security:** Displays assigned crew (`Mali Tariq & Field Team`), van registration (`ISB-GL-4491`), and stored gated society clearance instructions.
- **Storefront Mount:** Added "Live Order Tracker" tab (`#tab-btn-track`) and panel (`#panel-track` / `#order-tracker-mount`) in [my-account.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/my-account.html).

### Styling & Zero-Dependency PWA Caching
- **Design Token Compliance:** Authored component styles in [css/components.css](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/css/components.css) for `.planting-radar`, `.telemetry-simulator`, `.soil-calculator`, `.overlay-modal`, and `.tracker-steps`, strictly honoring `@media (prefers-reduced-motion: reduce)`.
- **Offline PWA Precache:** Added `'./js/delight.js'` to `PRECACHE_ASSETS` in [sw.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/sw.js).
- **Automated Verification:** Authored dedicated verification suite [tests/test-phase4-delight.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/tests/test-phase4-delight.js) passing 42/42 tests. Entire platform test harness now passes **292/292 tests**.

---

## [2.5.0] - 2026-10-27 (Phase 3: Essential E-Commerce Pages & Regional Commerce Features)

### Local Twin-City Commerce Conveniences (Phase 3.1)
- **WhatsApp Direct Order URL Builder:** Engineered `FloraMeshUtils.buildWhatsAppOrderUrl` in [js/utils.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/utils.js) generating pre-formatted Pakistani WhatsApp orders targeting twin-city operations (`923005551234`).
- **PDP Direct WhatsApp CTA:** Added `#pdp-whatsapp-btn` to the product purchase panel and `#pdp-sticky-whatsapp-btn` to the mobile sticky bar in [js/product.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/product.js), dynamically updating with current SKU, selected variant, quantity, line price, and delivery city.
- **Cart & Drawer Direct WhatsApp CTA:** Added `#cart-whatsapp-order-btn` to [cart.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/cart.html) via [js/main.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/main.js) and direct WhatsApp order button to the slide-out basket drawer in [js/cart.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/cart.js), summarizing all items, line prices, shipping, and grand totals.
- **Gated Housing Society Delivery Clearance:** Enhanced [checkout.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/checkout.html) with dedicated gated society gate pass & access preference fields (Bahria Town Phases 1–8, DHA Phases 1–3, Sector F/E/G, Gulberg Greens, Naval Anchorage). Captured in [js/main.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/main.js), persisted in `floramesh_orders_v1`, and rendered on the confirmed order receipt.
- **1-Click IBAN & Mobile Wallet Copy Hardened:** Validated clipboard copy actions with visual toast confirmation for Standard Chartered IBAN (`PK64SCBL0000001123456701`) and mobile wallets (`0300-5551234`).

### PWA & Offline Capabilities (Phase 3.2)
- **Web App Manifest:** Authored [manifest.webmanifest](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/manifest.webmanifest) declaring standalone display, orientation, theme color `#2C4A3E`, background `#FDFCFA`, and scalable SVG icons. Linked across all 17 storefront templates.
- **Offline App Shell Service Worker:** Created [sw.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/sw.js) with versioned cache (`floramesh-v2.5.0`), pre-caching core HTML templates, CSS tokens, JS libraries, variable fonts, and brand SVGs with network-first navigation and background stale-while-revalidate caching. Safely registered in [js/main.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/main.js) guarded against non-HTTP local file protocols.

### SEO, Social Metadata & Machine Discovery (Phase 3.3)
- **100% Social Metadata Audit:** Verified and equipped all 17 HTML storefront templates with unique `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph metadata (`og:title`, `og:description`, `og:image`, `og:type`), and Twitter Card metadata (`summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`).
- **Hardened Crawl Directives:** Updated [robots.txt](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/robots.txt) disallowing private transactional routes (`/cart.html`, `/checkout.html`, `/my-account.html`) and crawl loops (`/*?*q=`, `/*?*list=`).
- **Complete XML Sitemap:** Updated [sitemap.xml](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/sitemap.xml) to index all 17 storefront pages (including `compare.html`, `accessibility.html`, `sitemap.html`) and all 25 individual product URLs.
- **AI Agent Discovery Documentation:** Authored [llms.txt](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/llms.txt) and [llms-full.txt](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/llms-full.txt) following the llms.txt standard, documenting system architecture, the 5 Potohar micro-seasons, capacitive IoT soil telemetry specs, complete 25-SKU pricing matrices, and Twin-City delivery policies.
- **Automated Verification:** Authored dedicated verification suite [tests/test-phase3-commerce.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/tests/test-phase3-commerce.js) passing 49/49 tests. Total platform test harness now passes **250/250 tests**.

---

## [2.4.0] - 2026-10-27 (Phase 2: UI/UX & Quiet-Luxury Botanical Polish)

### Design Tokens & Dual-Theme Consistency (Phase 2.1)
- **Token Harmonization:** Added `--color-surface-sunken` across Heritage Cream (`#F3EEE2`) and Midnight Grove (`#1A322A`), along with `--font-serif` (aliased to Fraunces display) and `--radius-base` (aliased to `--radius-md` 12px) in [css/tokens.css](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/css/tokens.css), resolving unstyled fallback states across `compare.html`, `shipping-returns.html`, and `sitemap.html`.
- **WCAG 2.2 AA Contrast Verified:** Contrast validation verified across all 26 key text, border, button, and status token pairs with 100% compliance via `scripts/check-contrast.js`.

### Tactile Micro-Interactions & Animation Quality (Phase 2.2)
- **Botanical Skeleton Shimmer Loaders:** Created `.skeleton`, `.skeleton--card`, `.skeleton--media`, `.skeleton--title`, `.skeleton--text`, and `.skeleton--pill` in [css/components.css](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/css/components.css) with linear gradient shimmer animation reflecting the nursery daylight and night grove palettes. Strictly constrained under `@media (prefers-reduced-motion: reduce)`.
- **Elevation Transitions:** Refined card hover transforms (`translateY(-4px)` with `--shadow-md`) and quick-view button reveal dynamics.

### Navigation, Header & Search Discovery (Phase 2.3)
- **Persistent Mobile Bottom Navigation Bar:** Implemented `.mobile-bottom-nav` in [js/partials.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/partials.js), [css/components.css](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/css/components.css), and [css/responsive.css](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/css/responsive.css) providing thumb-friendly quick navigation (Home, Shop, Search, Wishlist, Basket) with touch targets $\ge 48\text{px}$ and `env(safe-area-inset-bottom)` viewport spacing.
- **Icon Registry Expansion:** Added `home` and `copy` vector SVG icons to [js/icons.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/icons.js), expanding the standalone registry to 38 icons.
- **Prioritized Search with Urdu Folk Botanical Dictionary:** Upgraded `searchProducts` in [js/search.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/search.js) with a Potohar botanical dictionary (کچنار, املتاس, نیم, سکھ چین, موتیا, ٹیکسلا, ملتانی, مٹی, گملہ, کھاد) and multi-tier relevance scoring prioritizing exact SKU matches (+1000), title matches, Urdu folk queries, and space tags.
- **Responsive Breadcrumbs:** Added semantic responsive breadcrumbs `<nav class="pdp__breadcrumb" aria-label="Breadcrumb">` to [shop.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/shop.html) and [compare.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/compare.html), with dynamic category/space title synchronization in [js/filters.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/filters.js).

### Storefront Component Polish & Checkout (Phase 2.4 & 2.5)
- **PDP Variant Pill Selection Savings Display:** Upgraded [js/product.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/product.js) to dynamically calculate and render an accented savings badge (`#pdp-savings-badge`, e.g. `Save Rs 2,000 (11% off)`) whenever a discounted variant is selected.
- **Comparison Matrix Sticky Headers & Ratings:** Added `position: sticky; top: 0;` table column headers, display serif titles, and Potohar climate resilience rating badges (10/10 All-Weather, 9.5/10 Potohar Resilient) with moisture sensor requirements in [compare.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/compare.html).
- **1-Click IBAN & Mobile Wallet Copy:** Added 1-click clipboard copy buttons with interactive toast confirmations to bank transfer (`PK64SCBL0000001123456701`) and mobile wallet options in [checkout.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/checkout.html) and [js/main.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/main.js).
- **Account Orders Bug Fixed:** Resolved `rawOrders` reference bug in [js/main.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/main.js) allowing placed orders to render cleanly in the customer account orders tab.
- **Automated Verification:** Authored [tests/test-phase2-ux.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/tests/test-phase2-ux.js) passing 25/25 tests. All test suites pass 175/175 tests.

---

## [2.3.0] - 2026-10-27 (Phase 1: Security Hardening & Data Sanitization)

### Security Hardening & Data Sanitization (Phase 1)
- **Critical Order History Bug Fixed (SEC-01):** Corrected undeclared variable references (`city` and `slot` -> `cityVal` and `slotVal`) in [js/main.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/main.js) that caused a silent `ReferenceError`, enabling completed checkout orders to reliably persist to `localStorage['floramesh_orders_v1']`.
- **Receipt DOM XSS Neutralized (SEC-02):** Rebuilt order confirmation receipt markup in [js/main.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/main.js) to escape customer names, shipping addresses, phone numbers, and payment details before injection.
- **Search Command Palette XSS Hardening (SEC-03):** Refactored [js/search.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/search.js) to render product cards and query hints via `FloraMeshUtils.html` tagged template literals and clean event listeners, removing inline `onclick` execution.
- **Storage Deserialization Resilience (SEC-04):** Hardened `JSON.parse` across [js/cart.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/cart.js), [js/wishlist.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/wishlist.js), [js/product.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/product.js), and [js/main.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/main.js) with `Array.isArray()` type guards and schema fallback protection against corrupted local state.
- **Cart Price & Tampering Immunity (SEC-05):** Enforced cart item hydration strictly against `window.FLORAMESH_PRODUCTS`, clamping quantities to variant stock limits (max 20) and locking prices to catalogue definitions.
- **Reverse Tabnabbing Prevention (SEC-06):** Updated all external links across [js/partials.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/partials.js), [contact.html](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/contact.html), and [js/main.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/js/main.js) to strictly declare `rel="noopener noreferrer"`.
- **Double-Submission Prevention (SEC-07):** Added submit locks and button state disabling with inline loading indicators to checkout and contact forms.
- **Production HTTP Security Headers (SEC-08):** Authored [vercel.json](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/vercel.json) declaring strict Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and immutable static asset cache headers.
- **Automated Security Verification:** Created [tests/test-phase1-security.js](file:///d:/1%20PF%20in%20C++/Mooed/floramesh-wordpress-ready-project/floramesh-project/tests/test-phase1-security.js) with 20 passing unit tests covering all Phase 1 requirements.

---

## [2.2.0] - 2026-10-26 (Round 2: Quiet-Luxury & Pakistani Botanical Editorial Upgrade)

### Phase 0: Forensic Audit & Design Benchmarks
- Conducted exhaustive forensic audit establishing 44 confirmed code, layout, and UX bugs in `docs/QA.md`.
- Researched 7 premier global e-commerce design benchmarks (Aesop, Apple, Toast, Flamingo Estate, Teenage Engineering, Rapha, Loewe) in `docs/INSPIRATION.md`.
- Authored `docs/CREDITS.md` and `CONTENT-TODO.md` for factual copy integrity.

### Phase 1: Art Direction Board & Color System
- Authored interactive art direction board (`tests/art-direction-board.html`) featuring typographic scale, color swatches, 34 vector SVGs, component states, and micro-animations.
- Verified WCAG 2.2 AA contrast compliance across Heritage Cream and Midnight Grove themes in `docs/CONTRAST.md`.
- Extended design tokens in `css/tokens.css` with surface tints, shadows, and smooth cubic bezier transitions.

### Phase 2: Navigation, Header, Search & Footers
- Built unified vector icon registry `js/icons.js` (34 clean SVGs).
- Built centralized `FloraMeshUI.DialogManager` in `js/ui.js` managing focus traps, Escape keys, inert backdrops, and scroll locking.
- Replaced header input with full-screen command palette search `<dialog id="search-dialog">` (`js/search.js`) with `/` shortcut, recent search chips, and keyboard navigation.
- Built sticky shrinking & auto-hiding header with city location switcher (Islamabad / Rawalpindi) persisting to `localStorage['floramesh_city_v1']`.
- Designed editorial 4-column footer featuring oversized Fraunces wordmark, payment methods trust strip, and Urdu brand tagline.

### Phase 3: Catalog Schema v2 & Core Page Redesigns
- Upgraded all 25 products to Catalog Schema v2 (`data/products.js`): `shortName` ($\le 4$ words), `type`, `fulfilment`, `spaces` array, `coverage`, per-variant `compareAtPrice`, `dominant` color, 75 editorial image captions. Purged all `sourceImageKey` entries, business plan text, unproven badges, and competitor criticism.
- Shop catalog (`shop.html` & `js/filters.js`): Dynamic price slider up to Rs 78,000, 4:5 quiet-luxury cards with "From Rs X", decorative secondary image `alt=""`, and safe multi-variant quick-add drawer.
- PDP (`product.html` & `js/product.js`): Native semantic `<details>`/`<summary>` accordions, live per-variant compare-at discount calculation, type-aware booking badges, and Apron-only size guide.
- Cart (`cart.html` & `js/cart.js`): Live dynamic catalog hydration from `localStorage['floramesh_demo_cart_v1']`, digital/donation physical shipping exemption, gift wrap eligibility check, and quantity clamping to available variant stock.
- Checkout (`checkout.html` & `js/main.js`): 3-step progress bar, Mon–Sat crew delivery slots, payment method selectors with bank transfer IBAN, strict Pakistani phone regex with linked `aria-describedby`, out-of-city onsite planting block, and itemized confirmation receipt card.
- Homepage (`index.html`): 55/45 editorial split hero with space selector chips, telemetry sparkline preview card, 4-item trust strip, 5 category cards, featured tabs, IoT sensor bento grid, craft corridors marquee, budget gifting shelf, and closing Nastaliq Urdu tagline band.

### Phase 4: Secondary & Supporting Pages
- Wishlist (`wishlist.html` & `js/wishlist.js`): Shareable wishlist URL parameter generation (`?list=...`), curated shared list view with "Save to My Device" and "Add All to Basket", and variant tier picker dropdown.
- Comparison Matrix (`compare.html`): Interactive 3-product side-by-side spec comparison table with slot dropdown pickers and climate resilience breakdown.
- Customer Account (`my-account.html`): Renamed to Customer Account with honest prototype notice, password reveal toggle buttons, tabbed navigation, and local browser order history tab.
- Contact (`contact.html`): Purged raw placeholder phone numbers (`+92 300 0000000`), added conditional WhatsApp trigger, and implemented first-invalid input focus on submit.
- FAQ (`faq.html`): Grouped topic accordions with instant search filtering and schema.org `FAQPage` JSON-LD schema.
- Shipping & Returns (`shipping-returns.html`): Scannable delivery zones table, 48-hr transit damage claim guide, and 14-day plant establishment check-in.
- Supporting Pages: Created `accessibility.html` (WCAG 2.2 AA statement), `sitemap.html` (accessible HTML directory), and updated `privacy.html` / `terms.html` with dynamic `data-legal-last-updated` date synchronization.
- Structural XSS Helper (`js/utils.js` & `tests/escape.html`): Implemented `FloraMeshUtils.html` tagged template helper with auto-escaping and authored dedicated automated XSS test suite.
- Mobile Filter Dialog (`shop.html`): Connected mobile filter sheet directly to centralized `DialogManager`.

### Phase 5: Final Polish, Regression Test Suites & Verification
- Authored automated browser test runners: `tests/escape.html`, `tests/validate-products.html`, `tests/regression-suite.html`.
- Implemented `FloraMeshEvents` pub/sub event bus in `js/utils.js` for fine-grained updates without destructive view wiping.
- Added semantic utility classes in `css/base.css` to replace pervasive inline styles (QA-38).
- Synchronized WooCommerce handoff guide (`WORDPRESS-HANDOFF.md`) with all 17 templates and Schema v2 mappings.
- Verified 100% test pass rate across 122 automated test assertions.

---

## [2.0.0] - 2026-10-26 (Initial Storefront Upgrade)

### Phase 0: UX Audit & Project Planning
- **Comprehensive Audit:** Analyzed all 12 existing HTML pages, CSS files, and vanilla JavaScript modules.
- **Vulnerability Remediation Plan:** Identified DOM XSS in `activePills.innerHTML`, negative quantity exploit in cart controller, gift note focus loss bug, checkout summary calculation mismatch, and missing city suitability validation.
- **Architecture Strategy:** Established zero-dependency, zero-build-step vanilla HTML5/CSS3/ES5+ standards ensuring 100% offline functionality over `file://` protocols.

### Phase 1: Design System & Color Tokens
- **Two Complete WCAG 2.2 AA Themes:**
  - `Heritage Cream` (Default Light): Refined organic palette (`#FAF7F0` canvas, `#10241B` deep forest green, `#B4572F` terracotta accent, `#0F766E` pine link, `#A8844A` antique brass).
  - `Midnight Grove` (Dark): Bio-luminous night palette (`#0C1814` deep canvas, `#132520` forest surface, `#2DD4BF` glowing teal primary, `#D9A66B` warm terracotta accent).
- **Self-Hosted Variable Fonts:**
  - `assets/fonts/fraunces-variable.woff2` (67.3 KB) for editorial luxury display headings.
  - `assets/fonts/plus-jakarta-sans-variable.woff2` (27.3 KB) for clean, geometric body copy and UI controls.
  - Replaced all external Google Fonts HTTP preconnects and links, ensuring zero external font dependencies.
- **Brand Logo Dark Mode Contrast:**
  - Created `assets/images/brand/floramesh-logo-dark.svg` with glowing mint leaves (`#2DD4BF`) and cream text (`#FAF7F0`).
  - Implemented dynamic logo swapping in `js/partials.js` triggered by active theme state.
- **Modular CSS Architecture:**
  - `css/tokens.css`: Semantic color roles, typography scales, 4px grid spacing, radii, shadows, and z-index layers.
  - `css/base.css`: CSS reset, typography rules, accessible `:focus-visible` rings, and skip-to-content styling.
  - `css/components.css`: BEM component library (buttons, chips, badges, accordions, modals, drawers, form fields, toasts).
  - `css/pages.css`: Page-specific layouts (hero, trust strip, campaign cards, shop toolbar, PDP layout, buybox).
  - `css/responsive.css`: Breakpoint styles (360px, 768px, 1024px, 1280px, 1536px) with full-height mobile navigation sheet and mobile filters bottom sheet.
- **Design System Documentation:** Authored `docs/DESIGN-SYSTEM.md` detailing all design tokens, scales, and a comprehensive guide for adding future themes.

### Phase 2: JavaScript Modernization & Bug Fixes
- **Configuration & Utilities:**
  - Created `js/config.js` for centralized store settings (`demoMode: true`, flat shipping `Rs 450`, free shipping threshold `Rs 10,000`, gift wrap fee `Rs 350`, storage keys).
  - Created `js/utils.js` with DOM XSS sanitizers (`escapeHTML`, `escapeAttr`), `debounce`, numeric `clamp`, `formatPKR`, `getEffectivePrice`, focus trapping (`trapFocus`), scroll locking (`lockBodyScroll`), and unified 24x24 SVG `ICONS` library.
  - Replaced all emoji icons across all JS modules and templates with clean, semantic SVG icons.
- **Header, Navigation & Footers (`js/partials.js`):**
  - Dismissible single-line announcement bar (`floramesh_dismiss_announcement_v1`).
  - Instant live search suggestions with keyboard navigation and debounced product matching.
  - Dynamic route matching for active navigation states (including category queries `shop.html?category=*` and `product.html`).
  - Accessible cart and wishlist counter badges that automatically hide when count is 0.
  - Full-height mobile menu sheet with focus trapping and body scroll locking.
  - Accessible theme toggle button with SVG sun/moon icons and live `aria-label`.
  - Free delivery progress bar embedded in cart drawer header with live percentage indicator.
- **Cart & Wishlist Upgrades (`js/cart.js`, `js/wishlist.js`):**
  - Clamped all quantity updates to `[1, 20]` (eliminated negative or zero quantity bugs).
  - Surgical badge and subtotal updates without destructive full-DOM re-renders.
  - Multi-tab synchronization via `window.addEventListener('storage', ...)` on cart and wishlist keys.
  - Added "Move to Basket" action in wishlist items with instant cart drawer opening.
- **Gallery & PDP Upgrades (`js/gallery.js`, `js/product.js`):**
  - Accessible thumbnail navigation with `aria-current="true"`, ArrowLeft / ArrowRight keyboard controls, and touch swipe gestures.
  - Fullscreen modal lightbox with pan and zoom controls.
  - Dynamic live order cost calculation: `(variant.price * qty) + shipping`.
  - Accessible accordion tabs with `aria-expanded` and SVG chevrons.
  - Honest empty reviews state without fake ratings or placeholder citations.
  - Recently Viewed recommendations row rendered dynamically from `localStorage`.
- **Filtering & Search (`js/filters.js`):**
  - Fixed DOM XSS vulnerability: all interpolated search queries and categories escaped with `escapeHTML`.
  - 200ms debounced search input.
  - Interactive, removable filter chips with human-readable labels and cross icons.
  - URL synchronization via `history.replaceState` for bookmarkable filter states.
  - Grid and compact list view toggle with `aria-pressed` states.
- **Main Controller & Form Handling (`js/main.js`):**
  - Fixed gift note focus loss bug by avoiding full-page re-rendering while typing in `<textarea>`.
  - Fixed checkout mathematical parity bug: Order Summary now explicitly breaks down Items + Delivery + Gift wrap = Total.
  - Added city suitability check: warns users if on-site planting services are added with an out-of-city delivery address.
  - Standardized demo notice injection for submission forms (`data-demo-notice`).

### Phase 3: Content Sanitization & Data Integrity
- **Products Database (`data/products.js` & `products.csv`):**
  - Cleaned all 25 product records of bracketed editorial tags (`[Sample review...]`, `[Sample placeholder]`, `[Draft Answer]`, `[Editable placeholder]`).
  - Preserved all SKU identifiers, Pakistani Rupee prices, and stock counts.
  - Verified syntax with Node.js parser (25 active products loaded successfully).
- **HTML Pages Upgraded:**
  - `index.html`: Modern hero with trust badge, trust strip, curated category grid, interactive quick view modal, and LocalBusiness JSON-LD schema.
  - `shop.html`: Two-column catalog layout with desktop sidebar, mobile filter sheet, and live product counts.
  - `product.html`: Complete single-product page with live price calculators, image galleries, and tabbed specifications.
  - `cart.html`: Dedicated basket review page with free delivery progress indicator and clean BEM layout.
  - `checkout.html`: Two-column layout with address fields, slot selection, and mathematical order summary parity.
  - `wishlist.html`: Clean saved items page with move-to-basket actions and zero academic citations.
  - `my-account.html`: Responsive customer portal with sign-in and registration forms.
  - `about.html`: Professional story and mission highlighting Potohar horticulture and IoT telemetry; removed academic codes and nursery criticism.
  - `contact.html`: Clean contact and site consultation booking form with twin-city service area details.
  - `faq.html`: Accessible button-triggered accordions with verified operational answers.
  - `shipping-returns.html`: Clear policy breakdown for twin-city deliveries, nationwide courier, and 48-hour damaged ceramic replacements.
  - `404.html`: Friendly error page with quick links to popular store categories.
- **New Pages & SEO Resources:**
  - `privacy.html`: Comprehensive privacy policy detailing customer information handling and telemetry security.
  - `terms.html`: Terms of service governing on-site services, sensor hardware, and payment methods.
  - `robots.txt`: Search crawler directives with sitemap pointer.
  - `sitemap.xml`: Complete XML sitemap listing 12 static pages and all 25 product catalog URLs.

---

## [1.0.0] - 2026-10-23 (Initial Prototype)
- **Concept Alignment & Audit:** Inspected project scope based on business concept PDF (`SP25-BAI-033_Assignment-1.pdf`).
- **Initial Design System:** Created foundational color tokens, CSS layout styles, and brand logo.
- **Initial Catalog:** Created initial 25 products, 75 product WebP images, and `products.csv`.
- **Initial Pages:** Built initial 12 HTML pages with IIFE JavaScript controllers.
