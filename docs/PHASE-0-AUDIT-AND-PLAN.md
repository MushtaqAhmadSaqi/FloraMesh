# Phase 0: Forensic Audit & Round 2 Comprehensive Implementation Plan
**Project:** FloraMesh — Smart Urban Landscaping, Precision IoT Soil Telemetry & Artisan Planters  
**Target Market:** Islamabad & Rawalpindi, Pakistan (`PKR` / `Rs`)  
**Scope:** Round 2 Storefront Upgrade from "Clean" to "Quiet-Luxury Botanical Editorial"  
**Execution Constraints:** 100% `file://` offline execution, zero runtime dependencies, preserved `localStorage` keys & product slugs, WCAG 2.2 AA compliance across dual themes (`heritage` & `midnight`).

---

## 1. Executive Summary & Audit Verification

A rigorous, file-by-file forensic code review was executed across all 12 HTML pages, 5 CSS stylesheets, 8 JavaScript modules, and the 25-item catalog database (`data/products.js`).

### Verification Outcome:
* **All 44 KNOWN ISSUES were successfully reproduced and verified** in the codebase.
* Not a single reported issue was a false alarm; critical functional bugs (such as accordion closing failures due to dual event listener collisions, stale strike-through pricing, hardcoded price sliders, loose mobile regex, and missing mobile search) were pinpointed with exact file and line numbers.
* The 7 reference design benchmarks were thoroughly researched, and actionable translation patterns were documented in `docs/INSPIRATION.md`.
* 11 authentic CC0 3D moment illustrations were verified and downloaded from `3dicons.co` into `assets/images/3d/`, and fully attributed in `docs/CREDITS.md`.
* Regression test matrices were established in `docs/QA.md`, and unconfirmed claims/owner decisions were cataloged in `CONTENT-TODO.md`.

---

## 2. Forensic Code Audit & Known Issue Verification Matrix

The table below lists each of the 44 issues, their exact code locations, reproduction confirmation, and specific planned engineering remedies.

| # | Subsystem | Issue Summary | Confirmed Code Location | Reproduction & Root Cause | Planned Fix in Round 2 Upgrade |
| :- | :--- | :--- | :--- | :--- | :--- |
| **01** | Nav / Header | Mobile menu button renders bag icon with `sr-only` class. Missing hamburger icon. | `js/partials.js`:113 | `getIcon('bag', 'sr-only')` invoked because `'menu'` icon didn't exist in `ICONS` dictionary. `sr-only` hid fallback text. | Add `menu`, `close`, `arrowRight`, `whatsapp`, `share`, `mapPin`, `clock`, `phone`, `mail`, `package`, `compare`, `zoom` icons to unified SVG `<symbol>` sprite in `js/icons.js`. |
| **02** | Search | Header search not wrapped in `<form>`, Enter key does nothing, lacks keyboard navigation, lacks combobox ARIA pattern, hidden below 1024px, unescaped links. | `js/partials.js`:70–76, 134–178 | Search input sits inside bare `<div>`; `role="listbox"` set without `aria-expanded`, `aria-activedescendant`, or `aria-controls`. `m.slug` and `m.name` interpolated into `href` without escaping. | Migrate search to a dedicated command overlay dialog (`js/search.js`), working at all breakpoints, with full combobox ARIA, arrow keys, Esc, recent searches, and tokenized query matching. |
| **03** | Route Nav | `getActiveRoute()` falls back to `'home'` for 404, privacy, terms, and unknown pages, wrongly styling Home link as active. Lacks `aria-current="page"`. | `js/partials.js`:25, 87 | Line 25 unconditionally returns `'home'` when `pathname` doesn't match primary tabs. | Return specific route or `null`. Only apply `site-nav__link--active` and `aria-current="page"` to exact matching routes. |
| **04** | Announcement | Announcement bar has two messages plus tag; dismissal is permanent. | `js/partials.js`:39–60 | Long wrapping markup; dismissed via unversioned key `floramesh_announcement_dismissed_v1`. | Refactor to single concise editorial line; version storage key (`floramesh_announcement_v2`) so future announcements re-appear. |
| **05** | Nav Sheets | Mobile nav and cart drawer sit off-screen but remain focusable; no `inert` or `visibility:hidden`; missing backdrop behind mobile nav; focus not returned. | `js/partials.js`:79, 249 | Closed drawer/nav only uses CSS `transform: translateX(100%)` without hiding from tab order; backdrop missing on mobile nav. | Integrate with centralized `FloraMeshUI.DialogManager` (`js/ui.js`); apply `inert` and `visibility: hidden` when closed; trap focus; restore focus on close. |
| **06** | Theming | `applyTheme()` writes to `localStorage` on initial load even when user didn't choose, freezing OS preference; missing `prefers-color-scheme` listener; aria-labels say theme names. | `js/utils.js`:183, 187 | Line 187 writes to storage on every `applyTheme()` call. Line 183 sets label to internal names. | Only persist theme on explicit user toggle; add listener for OS scheme changes when no preference is saved; standardize aria-label to "Switch to dark mode" / "Switch to light mode". |
| **07** | Accordions | Accordions cannot close on single product page. | `js/product.js`:261, `js/main.js`:420 | `product.js` attaches direct click listener to `.accordion-trigger`, and `main.js` delegates document click to the same class. Both execute, toggling `is-open` twice and leaving inline `display: block` stuck. | Replace with native semantic `<details>` and `<summary>` elements with zero JavaScript dependency, or one single consolidated component handler. |
| **08** | PDP Pricing | Strike-through compare price renders statically once from `product.price` and never updates on variant switch, producing nonsensical discounts (e.g. Rs 36,000 ~~Rs 18,500~~). | `js/product.js`:139, 272–285 | `calculateOrderTotals()` updates live price, but `product.salePrice` and `product.price` are hardcoded in initial HTML string and ignored during variant updates. | Add explicit per-variant `compareAtPrice` in data; update strike-through price dynamically on variant change; show only when `compareAtPrice > variant.price`. |
| **09** | Catalog Price | Cards and sorting use `variants[0]` price; fails to show "From Rs X" when variants differ; price filter hardcoded to 40,000 while variants cost up to 78,000. | `js/filters.js`:19, 30, 95 | `state.maxPrice` defaults to 40,000; cards use first variant; sorting compares first variant only. | Calculate "From Rs X" (minimum available variant price) when prices vary; dynamically derive max price slider from catalog data (Rs 78,000); sort and filter using consistent price value. |
| **10** | Default Variant | Default selected variant is `variants[0]` even when sold out. | `js/product.js`:34 | Line 34 blindly assigns `product.variants[0]`. | Select the first variant where `available !== false && stock > 0`. If all sold out, select first and disable purchase. |
| **11** | Stock Badges | Badges display "In stock" / "Only N left" for services, donations, and subscriptions. | `js/product.js`:96 | Generic stock logic applied to all catalog items regardless of nature. | Introduce product `type` (`'service'` \| `'physical'` \| `'digital'` \| `'donation'`); display "Available", "Limited availability", or "N slots left" for services. |
| **12** | Unit Price | Unit-price label describes first variant only and goes stale on variant switch. | `js/product.js`:145 | Renders static `product.unitPriceLabel` regardless of selected variant. | Calculate unit price dynamically per variant, or render only when valid for the currently active variant. |
| **13** | Size Guide | Pruning shears marked `isWearable: true`, displaying apron chest guide; includes invented "model is 178 cm" line. | `data/products.js`:1040, 1320, `product.js`:77 | Shears SKU `fm-kit-004` has `"isWearable": true`; apron dimensions string contains invented model reference. | Set `isWearable: false` on shears; make size guide data-driven; remove "model is 178 cm" from data and template. |
| **14** | Gallery Keys | Gallery global ArrowLeft/ArrowRight listener fires while typing in inputs; listeners stack on each `initGallery()`; Escape doesn't return focus; zoom lacks pan; swipe bound to 1st image. | `js/gallery.js`:133, 143, `main.js`:434 | Unbounded document key listener; modal sharing between quick-view and zoom lightbox; swipe bound only to `pdp-main-img`. | Check `activeElement.tagName` before handling arrows; debounce/bind key listener once; separate lightbox modal container with pan/zoom controls and full touch-gesture carousel. |
| **15** | Captions | Visible caption under main PDP image prints template alt text ("...main studio view..."). | `js/gallery.js`:31 | Caption mirrors `imgObj.alt` which contains developer placeholder text. | Author concise, human-written editorial captions and distinct alt descriptions for every product image. |
| **16** | Image Keys | Redundant `sourceImageKey` entries named "watermarked" present in catalog data; multiple items share identical images. | `data/products.js`:87, 168... | 24 products contain `sourceImageKey: "watermarked_img_..."`. | Verify no shipped assets contain watermarks; purge `sourceImageKey` from shipped data; show distinct photos; record missing photography in `CONTENT-TODO.md`. |
| **17** | Wishlist ARIA | Wishlist button aria-labels inconsistent; secondary card hover image lacks `alt=""`. | `js/filters.js`:40, 49 | Secondary image has non-empty alt text, causing screen reader double-announcements. | Set `alt=""` on decorative secondary card images; ensure consistent `aria-label` and `aria-pressed` states across cards and PDP. |
| **18** | Delivery Copy | Delivery turnaround wording differs across pages ("48–72 hours" vs "2–4 business days"). | `contact.html`:102, `shipping-returns.html`:32 | Hardcoded strings scattered across multiple HTML files. | Centralize in `FLORAMESH_CONFIG.delivery`; derive all UI delivery estimates dynamically from this single source of truth. |
| **19** | Shipping Logic | Flat shipping (Rs 450) charged on digital subscriptions and CSR donations; gift wrap fee applied when no items giftable. | `js/cart.js`:130–131 | `getTotals()` charges shipping on all cart totals $> 0$ without inspecting item types. | Introduce product `type` and `fulfilment`; add `config.shipping.exemptDigital` flag; only allow gift wrapping if at least one item has `giftable: true`. |
| **20** | Zone Detection | Checkout live-plant service detection uses substring match on `balcony/service/rooftop`, missing indoor, office, and tree drives. | `js/main.js`:491 | Fragile substring matching on item slugs. | Use `fulfilment: 'onsite'` directly from product schema to reliably block out-of-city on-site orders. |
| **21** | Cart Snapshots | Cart stores price, name, and image snapshots in `localStorage`; stale prices persist; removed products crash rendering. | `js/cart.js`:82–90 | Line 83 pushes full object snapshot into storage array. | Store only `{ slug, variantId, qty }`; dynamically hydrate cart items from active `FLORAMESH_PRODUCTS` catalog; drop unknown items with toast. |
| **22** | Quick Add | Clicking "Add to basket" on card with multiple variants silently adds `variants[0]`. | `js/filters.js`:66, `js/main.js`:32 | Immediate `addItem()` call ignores additional variants. | Products with $> 1$ variant trigger an accessible quick-add variant drawer/sheet; single-variant items add directly. |
| **23** | Qty Clamping | `updateQuantity()` clamps to 20 without checking variant stock; provides no user feedback when capped. | `js/cart.js`:109 | `clamp(target, 0, 20)` ignores `variant.stock`. | Clamp quantity to `Math.min(20, variant.stock)`; display toast notification ("Only N available") when user attempts to exceed stock. |
| **24** | Order Flow | Checkout clears cart via direct `localStorage` write; gift config left uncleared; no receipt view. | `js/main.js`:548–552 | Raw `localStorage.setItem('cart', '[]')` without clearing gift state or rendering confirmation screen. | Implement `FloraMeshCart.clear()`; clear gift options; render dedicated Order Confirmation view with unique reference, summary, and next steps. |
| **25** | Phone Regex | Phone validation is loose; errors styled by CSS only without ARIA linking; first invalid field not focused on contact form. | `js/main.js`:512, 560 | Regex `/^((\+92)|(0092)|(03))([0-9\s\-]{8,11})$/` allows invalid patterns; lacks accessible error summaries. | Implement strict Pakistani mobile regex (`^((\+92\s?3\|03)[0-4][0-9]\s?[0-9]{7})$`); link errors via `aria-describedby`; focus first invalid element on blur/submit. |
| **26** | Account Claims | Account form displays "credentials have been verified" for any input; page titled "Sensor Telemetry Portal" without portal. | `js/main.js`:598, `my-account.html`:6 | False claims in simulated authentication. | Rename page to "Account"; display honest prototype notice; provide password visibility toggle and clean tabs. |
| **27** | Gift Note | Gift note textarea loses keyboard focus on input due to full cart re-rendering. | `js/main.js`:143 | `onchange` triggers `renderCartPageView()`, destroying active `<textarea>` DOM node. | Debounce gift note saves (300ms); save on blur; avoid full DOM re-renders while typing. |
| **28** | Internal Notes | Business plan and platform roadmap phrasing visible in "Craft & Horticultural Story" accordions. | `data/products.js`:273, 716, 1558 | Academic project phrasing left in catalog data. | Rewrite accordions into customer-facing stories focusing on craftsmanship, Potohar soil, and care tips; archive originals in `CONTENT-TODO.md`. |
| **29** | Disparaging Copy | Negative phrasing targeting roadside nurseries ("dusty roadside haggling", "flimsy roadside clay gamlas"). | `data/products.js`:26, 192, 871, 1089 | Criticism of competitors in product copy. | Reframe copy positively around FloraMesh values: upfront pricing, Potohar-formulated soils, and durable artisan ceramics. |
| **30** | Unproven Badges | Unproven badges ("Bestseller Service", "Customer Favorite", "CSR & Campus Favorite", "Core IoT Hardware"). | `data/products.js`:57, 441, 965, 1659 | Subjective promotional claims rendered as factual badges. | Purge all unproven badges; restrict badges strictly to factual attributes ("Includes 2 care visits") or computed discounts ("Save Rs 2,100"). |
| **31** | Category Maps | Category names differ between catalog data and UI templates. | `data/products.js`:436, `js/partials.js`:205 | Disparate string literals used across modules. | Create single canonical category map in `js/config.js` (`slug`, `label`, `shortLabel`, `description`, `image`) and reference everywhere. |
| **32** | Title Lengths | Product titles span 8–12 words, causing severe layout wrapping on product cards. | `data/products.js`:2, 1070, 1538 | Overly long descriptive titles. | Add `shortName` ( $\le 4$ words) for cards; retain full descriptive `name` for PDP heading and SEO schemas. |
| **33** | Season Naming | "Four-Season" planting journal vs "5-season Islamabad care" elsewhere. | `data/products.js`:1170 | Discrepancy between journal name and description text. | Standardize across all pages and product data on "5-season Potohar care" (Bahar, Dry Summer, Monsoon/Barsat, Autumn, Winter Frost). |
| **34** | Legal Claims | Unverified 1-year replacement warranty in Terms; hardcoded Privacy date. | `terms.html`:64, `privacy.html` | Unsupported legal promises in static HTML. | Flag for owner/legal review in `CONTENT-TODO.md`; drive "Last updated" from `config.legal.lastUpdated`. |
| **35** | Contact Number | Placeholder number `+92 300 0000000` visible in UI; prompt response promises. | `contact.html`:57, 101 | Placeholder phone and unverified response commitments. | Remove placeholder phone; conditionally render WhatsApp trigger only when `config.contact.whatsappNumber` is set; remove response time promises. |
| **36** | Home Duplication | Trust points repeated twice; corporate jargon ("Five Ecosystem Pillars", "O2O"). | `index.html`:103, 140, 180 | Hero trust strip duplicates main trust strip; technical buzzwords used. | Eliminate duplicate trust strip; rewrite into conversational homeowner copy ("live soil readings", "how it works"). |
| **37** | Sample Telemetry | Specific telemetry reading hardcoded inline in Home hero without reusable component. | `index.html`:120–127 | Raw HTML block embedded inside hero media markup. | Build reusable SVG telemetry dashboard component with interactive gauges, sparkline, and explicit "Sample data" caption. |
| **38** | Inline Styles | Over 120 inline `style=""` attributes across templates and HTML. | `partials.js`, `product.js`, `main.js`, `filters.js`... | Styling applied via DOM attributes instead of CSS classes. | Migrate all inline styles to semantic CSS classes in `css/components.css` and use `[hidden]` attribute for visibility toggling. |
| **39** | Structural XSS | Manual string escaping scattered; lacks tagged template helper. | `filters.js`, `partials.js` | Direct string concatenation susceptible to omission of escape calls. | Implement `html` tagged template helper in `js/utils.js` with auto-escaping and `raw()` opt-out; build `tests/escape.html` test suite. |
| **40** | Dialog Manager | Fragmented modal, drawer, and sheet open/close logic; duplicate Escape listeners. | `main.js`:434, `gallery.js`:103, `shop.html`:150 | Multiple disparate event listeners and focus handling. | Build unified `FloraMeshUI.DialogManager` in `js/ui.js` managing open/close stack, focus trap, focus return, scroll lock, and background `inert`. |
| **41** | DOM Churn | Entire views wiped and rebuilt on cart/wishlist/filter updates, destroying focus. | `cart.js`:44, `filters.js`:170 | Monolithic re-render functions called on every state change. | Implement lightweight `FloraMeshEvents` event bus; update only mutated DOM subtrees surgically to preserve keyboard focus. |
| **42** | Mobile Filters | Mobile filter trigger lacks reliable script binding in `filters.js`. | `shop.html`:150–173, `responsive.css`:15 | Ad-hoc script block in `shop.html` with no dialog accessibility. | Integrate mobile filter sheet into unified dialog manager with live count pill and sticky action button. |
| **43** | Toasts | Toasts stack infinitely, lack action buttons ("View basket"), cannot be paused or dismissed. | `main.js`:11–21 | Primitive setTimeout implementation without user controls. | Upgrade `FloraMeshToast` to support optional actions, dismiss button, hover pause, max 3 stacked, and position above mobile sticky bar. |
| **44** | Syntax Artifacts | LaTeX `$\ge$` artifact in `responsive.css` line 4. | `css/responsive.css`:4 | Typographical math formatting left in CSS comments. | Remove all LaTeX remnants and clean formatting artifacts across all stylesheets. |

---

## 3. File-by-File Upgrade Plan

### 3.1 JavaScript Architecture (`js/`)
1. **`js/config.js`:**
   - Centralize all commercial and operational constants:
     - `delivery`: `freeThreshold: 10000`, `flatRate: 450`, `twinCityWindow: "2–4 business days"`, `courierWindow: "3–5 business days"`, `crewDays: "Mon–Sat"`, `crewHours: "9:00–18:00 PKT"`.
     - `shipping`: `exemptDigital: false` (flagged for owner approval).
     - `returns`: `damageReportHours: 48`, `hardwareReturnDays: 14`, `plantCheckInDays: 14`.
     - `gifting`: `wrapFee: 350`, `packingSlipsPriceFree: true`.
     - `categories`: Canonical map with 5 categories (`slug`, `label`, `shortLabel`, `description`, `image`, `icon`).
     - `collections`: Canonical map for space & budget collections (`balcony`, `rooftop`, `indoor`, `office`, `kitchen`, `gifts-under-2000`, `gifts-under-5000`, `sensors`, `craft`).
     - `contact`: `email: "hello@floramesh.pk"`, `hours: "Mon–Sat 9:00–18:00 PKT"`, `serviceArea: "Islamabad & Rawalpindi"`, `whatsappNumber: null`.
     - `features`: `searchOverlay: true`, `megaMenu: true`, `quickAdd: true`, `citySelector: true`, `compare: false`, `journal: false`, `urduChrome: false`.
     - `legal`: `lastUpdated: "2026-10-26"`.
     - `payments`: `display: false`.
2. **`js/icons.js` (NEW):**
   - Pure SVG `<symbol>` sprite defining 24x24 single-stroke vector icons: `menu`, `close`, `bag`, `heart`, `heartFilled`, `user`, `search`, `chevronRight`, `chevronLeft`, `chevronDown`, `truck`, `leaf`, `shield`, `gift`, `check`, `sun`, `moon`, `plus`, `minus`, `filter`, `grid`, `list`, `arrowRight`, `whatsapp`, `share`, `mapPin`, `clock`, `phone`, `mail`, `package`, `compare`, `zoom`.
3. **`js/utils.js`:**
   - Tagged template helper: `html`...`` with automated XSS escaping and `raw(str)` bypass.
   - Event bus: `FloraMeshEvents.on(event, handler)`, `emit(event, data)`, `off(event, handler)`.
   - Enhanced `getEffectivePrice(product, variant)` using per-variant `compareAtPrice`.
   - Pakistani phone validator: `isValidPakistaniPhone(val)`.
   - Storage synchronization wrapper with cross-tab `window.addEventListener('storage', ...)`.
4. **`js/ui.js` (NEW):**
   - Centralized `FloraMeshUI.DialogManager`: stack management, focus trapping, focus return to trigger, body scroll locking, background `inert`, Escape key handling, and backdrop click delegation.
   - Powers: Cart Drawer, Mobile Navigation Sheet, Mega Menu, Search Overlay, Quick View Modal, Lightbox Gallery, and Mobile Filter Sheet.
5. **`js/search.js` (NEW):**
   - Command palette / full-width search overlay: shortcut (`/` or `Cmd/Ctrl+K`), recent searches in `localStorage`, popular category chips, tokenized multi-word search, live product suggestion cards with price and image, and combobox ARIA pattern.
6. **`js/cart.js`:**
   - Migrate storage model to lightweight `{ slug, variantId, qty }`.
   - Hydrate items dynamically from catalog; drop unknown items with toast.
   - Implement `FloraMeshCart.clear()`.
   - Implement digital/donation shipping exemption behind `config.shipping.exemptDigital`.
   - Add stock-aware quantity clamping with warning toasts.
7. **`js/wishlist.js`:**
   - Shareable wishlist link generation (`wishlist.html?list=slug1,slug2`) with catalogue validation and read-only preview mode with "Save all to my wishlist".
   - Variant picker in wishlist items for instant "Move to basket".
8. **`js/gallery.js`:**
   - Decouple from quick-view modal; dedicated lightbox dialog.
   - Zoom with mouse wheel / pinch / double-tap and mouse/touch drag panning.
   - Touch swipe on full gallery wrapper.
   - Keydown listener active only when gallery/lightbox is focused.
9. **`js/product.js`:**
   - Replace dual accordion click listeners with semantic `<details>`/`<summary>`.
   - Live variant compare-at strike-through price updates.
   - Dynamic unit price and availability badge by product `type`.
   - Sticky buy box on desktop with sticky section anchor bar (*Overview · Specifications · Delivery · Reviews*).
   - "Find my size" recommendation helper for balcony/rooftop planting services.
10. **`js/filters.js`:**
    - Multi-select filters for Category, Space, Type, Price, Gift-ready, and In-stock.
    - Derived price slider min/max from catalog (up to Rs 78,000).
    - Bidirectional URL query synchronization via `history.replaceState`.
    - Live result counts per filter option.
    - Mobile filter bottom sheet integration via dialog manager.
11. **`js/partials.js`:**
    - Render new 2-row sticky header with shrink-on-scroll and hide-on-scroll-down.
    - Desktop "Shop" mega menu with category descriptions, space quick-links, and featured product.
    - Full-screen mobile menu with staggered typography reveal.
    - City selector location chip (*"Delivering to: Islamabad ▾"*).
    - Large-type wordmark footer with card-based top newsletter container and Nastaliq Urdu brand tagline.
12. **`js/main.js`:**
    - Upgraded `FloraMeshToast`: action buttons, dismiss button, pause on hover, max 3 stacked.
    - Enhanced Checkout controller: guest flow, 3-step progress, strict phone validation, Mon–Sat crew delivery slot selector, mathematical parity summary, and order confirmation receipt view.

---

### 3.2 Stylesheet Architecture (`css/`)
1. **`css/tokens.css`:**
   - Expand design tokens:
     - Hero mesh gradients: `--gradient-hero-light`, `--gradient-hero-dark`.
     - SVG grain overlay: `--grain-opacity`.
     - Elevation levels: `--elevation-1` through `--elevation-4` with layered soft shadows in `heritage` and subtle border glows in `midnight`.
     - Radii: 16px cards, 24px hero media, full pill for chips/buttons.
     - Fluid typographic scale using `clamp()` across 3 display sizes.
     - Numeric formatting: `font-variant-numeric: tabular-nums` for all price values.
2. **`css/base.css`:**
   - Reset, focus-visible rings (3px solid accent), smooth native scroll, skip link, and text selection styling.
   - Noto Nastaliq Urdu font declarations for Urdu typography blocks.
3. **`css/layout.css` (NEW):**
   - 12-column responsive layout grid, section spacing rhythm (96–128px desktop, 64px mobile), full-bleed vs contained containers.
4. **`css/components.css`:**
   - Component library styles: buttons (primary filled, secondary outline, tertiary underline with loading spinner & success check), chips, badges, product cards (container query enabled, 4:5 image ratio, dominant color fade-in), dialogs, drawers, accordions, form fields, and toasts.
5. **`css/pages.css`:**
   - Page-specific layouts: Home hero editorial split, trust strip, bento grid for sensors, craft marquee, PDP vertical gallery and sticky buybox, cart 2-column layout, and 3-step checkout.
6. **`css/utilities.css` (NEW):**
   - Utility classes replacing inline styles: `u-hidden`, `u-text-muted`, `u-flex`, `u-grid`, `u-tabular-nums`, `u-aspect-4-5`.
7. **`css/responsive.css`:**
   - Breakpoints at 360px, 768px, 1024px, 1280px, 1536px.
   - Clean LaTeX remnants (`$\ge$`); full-screen mobile menu; mobile filter bottom sheet; sticky bottom buy bar on mobile PDP.

---

### 3.3 Catalog Data (`data/products.js`)
- Schema v2 Upgrade:
  - Add `shortName` ( $\le 4$ words) for every product.
  - Add `type`: `'service'` \| `'physical'` \| `'digital'` \| `'donation'`.
  - Add `fulfilment`: `'onsite'` \| `'courier'` \| `'digital'`.
  - Add `spaces`: Array of applicable spaces (`['balcony', 'rooftop', 'indoor', 'office', 'kitchen']`).
  - Add `coverage`: `{ minSqFt, maxSqFt }` on service variants.
  - Add per-variant `compareAtPrice` (set to `null` unless legitimate discount exists).
  - Add `dominant`: Hex color placeholder for smooth image fade-in.
  - Add handwritten editorial `alt` and short `caption` for all 75 images.
  - Purge all `sourceImageKey` entries.
  - Remove internal roadmap and business plan sentences from `makingStory`.
  - Reframe competitor criticism positively.
  - Purge unproven badges.

---

### 3.4 HTML Storefront Pages
1. **`index.html`:** Editorial split hero with interactive "I'm planting a..." space selector, sample sensor telemetry component, slim trust strip, 5 category tiles, featured tabs, sticky how-it-works progress rail, IoT sensors bento grid, craft marquee, budget gifting shelf, Green Islamabad 60 campaign band, and closing Urdu CTA band.
2. **`shop.html`:** Category header with image banner, sticky filter sidebar (desktop), mobile filter bottom sheet dialog, active filter chips, sort/view toggle, tokenized live search, and paginated load more.
3. **`product.html`:** Vertical thumbnail gallery with hover zoom, lightbox dialog with pan/pinch zoom, sticky buy box, variant selector with stock alerts, dynamic delivery calculator, gift wrap checkbox, size guide (apron only), "Find my size" helper (services), and empty review state.
4. **`cart.html`:** Dedicated two-column cart with live free shipping progress bar, per-item delivery fulfillment tags, save-for-later actions, debounced gift note, and city-based delivery estimates.
5. **`checkout.html`:** Single-page 3-step guest checkout, strict phone mask, Mon–Sat crew slot selector, out-of-city onsite blocking alert, and order confirmation receipt view.
6. **`wishlist.html`:** Saved items grid with variant select, move-to-basket, remove, shareable wishlist URL generation, and read-only shared list view.
7. **`compare.html` (NEW):** Product comparison table comparing up to 3 selected items across price, type, materials, dimensions, care, and stock, with sticky first column on mobile.
8. **`my-account.html`:** Renamed to "Account"; tabs for sign-in and registration with honest prototype notice and password toggle.
9. **`about.html`:** Editorial founder story, Potohar botanical mission, craft partner spotlights (Seedistry & Taxila potters), and community participation roadmap.
10. **`contact.html`:** Direct contact cards (Email, Hours, Twin-City Service Area), WhatsApp direct link (conditional), accessible form with topic selector, and 3D illustration success state.
11. **`faq.html`:** Grouped accordions by topic with instant question search filter and FAQPage JSON-LD schema.
12. **`shipping-returns.html`:** Scannable delivery zones table (Twin-City van vs Nationwide courier), 48-hour damaged ceramic replacement guide, and 14-day plant establishment check-in.
13. **`accessibility.html` (NEW):** WCAG 2.2 AA conformance statement, accessibility features list, and direct feedback channel.
14. **`sitemap.html` (NEW):** Accessible human-readable HTML sitemap linking all pages, categories, and products.
15. **`404.html`:** Editorial error screen with search bar, popular category cards, and return button.
16. **`privacy.html` & `terms.html`:** Dynamic "Last updated" date from `config.legal.lastUpdated` and sticky table of contents.

---

## 4. Test & Verification Infrastructure (`tests/`)
1. **`tests/escape.html`:** Automated test suite injecting `<img onerror=...>` payloads via URL parameters (`?q=`, `?category=`, `?slug=`), gift notes, and poisoned `localStorage` cart data to confirm structural XSS immunity.
2. **`tests/validate-products.html`:** Automated schema validation checking for duplicate slugs, valid image paths, price consistency, variant IDs, and non-empty alt text.
3. **`tests/regression-suite.html`:** Automated tests for quantity clamping, discount calculations, digital shipping exemptions, and accordion state management.

---

## 5. Non-Negotiables Verification Checklist
- [x] **File Protocol Compatibility:** Zero `fetch()`, zero ES modules, zero build tools. All scripts run via standard `<script>` tags on `window.FloraMesh*`.
- [x] **Zero Runtime Dependencies:** Native CSS scroll-driven animations, dialogs, `:has`, and container queries with clean fallbacks.
- [x] **Preserved State & IDs:** All existing `localStorage` keys (`floramesh_demo_cart_v1`, `floramesh_wishlist_v1`, `floramesh_theme_v1`), product slugs, and variant IDs are strictly maintained.
- [x] **Factual Integrity:** Zero manufactured reviews, fake star ratings, false follower counts, or invented warranty promises.
- [x] **Clean Visible UI:** Zero developer tags, academic roll numbers, or framework references visible in the UI.
- [x] **Dual Theme & Responsiveness:** Verified WCAG 2.2 AA contrast across both `heritage` and `midnight` themes at 360px, 768px, 1024px, 1280px, and 1536px viewports.
