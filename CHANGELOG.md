# FloraMesh UX & Front-End Architecture Changelog (`CHANGELOG.md`)

All notable changes to the FloraMesh smart urban landscaping, IoT soil telemetry, and artisan planter platform are documented here.

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
