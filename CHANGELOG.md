# FloraMesh UX & Front-End Architecture Changelog (`CHANGELOG.md`)

All notable changes to the FloraMesh smart urban landscaping, IoT soil telemetry, and artisan planter platform are documented here.

---

## [2.0.0] - 2026-10-26 (Comprehensive Storefront Upgrade)

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
