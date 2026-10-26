# FloraMesh Art Direction & Visual Design System
**Version:** 2.0.0 (Round 2 Upgrade)  
**Brand Identity:** FloraMesh — Smart Urban Landscaping, IoT Telemetry & Artisan Planters  
**Regional Roots:** Islamabad & Rawalpindi, Pakistan  
**Tagline:** *"Aap ka khayal, hamara poda, sarsabz jahan."* (آپ کا خیال، ہمارا پودا، سرسبز جہاں)  
**Currency:** PKR (`Rs`)  

---

## 1. Aesthetic Ethos: Quiet-Luxury Botanical

FloraMesh does not present as a fast-commerce gadget site, nor as an ornamental boutique with hollow claims. It embodies **Quiet-Luxury Botanical Editorial**:
- **Calm, Decisive, and Grounded:** Expansive whitespace, warm parchment and deep pine backdrops, tactile typography, and deliberate micro-interactions.
- **Unmistakably Pakistani-Botanical:** Rooted in the Margalla foothills, Potohar climate realities, Taxila terracotta craft, and Multani glazed ceramic traditions.
- **Technically Rigorous:** Real IoT telemetry (soil moisture, electrical conductivity, ambient temperature) rendered as precision instrument readouts rather than marketing illustrations.
- **Uncompromising Integrity:** Zero fake urgency counters, zero fictitious reviews, zero unverified badges. Every testimonial carries verifiable credentials or is omitted.

---

## 2. Color System & Dual Theme Palettes

FloraMesh ships with two WCAG 2.2 AA certified color themes. All contrast ratios meet or exceed 4.5:1 for body copy and 3.0:1 for large display text.

### Theme 1: Heritage Cream (`data-theme="heritage"`, Default)
*Evoking sunlight through greenhouse glass, Taxila terracotta clay, raw linen, and aged botanical manuscripts.*

| Token | Hex / Value | Usage & Semantics | Contrast Ratio vs Surface |
|---|---|---|---|
| `--color-bg` | `#FAF7F0` | Canvas background (warm ivory/cream) | Baseline |
| `--color-surface` | `#FFFFFF` | Primary card, modal, drawer surface | — |
| `--color-surface-alt` | `#F3EEE2` | Secondary containers, media backgrounds | — |
| `--color-text` | `#10241B` | Deep forest pine body and headline text | 15.21:1 on bg / 16.28:1 on surface |
| `--color-text-muted` | `#54655B` | Secondary metadata, captions, subtitles | 5.79:1 on bg / 6.20:1 on surface |
| `--color-border` | `#E4DCC8` | Card and divider structural strokes | Distinct at 1px solid |
| `--color-border-subtle` | `#EDE6D6` | Subtle inner borders and table row lines | Decorative / non-text |
| `--color-primary` | `#10241B` | Primary button fill, strong emphasis | 15.21:1 against `#FAF7F0` text |
| `--color-accent` | `#B4572F` | Terracotta accent, CTA highlights, badges | 4.52:1 on bg / 4.83:1 on surface |
| `--color-link` | `#0F766E` | Deep pine/teal hyperlink color | 5.12:1 on bg / 5.47:1 on surface |
| `--color-brass` | `#A8844A` | Artisan brass accents, metallic touches | Decorative & accent |

### Theme 2: Midnight Grove (`data-theme="midnight"`)
*Evoking night gardens, greenhouse telemetry monitors, deep bio-luminescence, and luxury horticultural technology.*

| Token | Hex / Value | Usage & Semantics | Contrast Ratio vs Surface |
|---|---|---|---|
| `--color-bg` | `#0C1814` | Midnight forest canvas background | Baseline |
| `--color-surface` | `#132520` | Elevated cards, telemetry displays | — |
| `--color-surface-alt` | `#1A322A` | Secondary wells, media card backdrops | — |
| `--color-text` | `#EEE9DC` | Warm parchment primary text | 14.98:1 on bg / 13.19:1 on surface |
| `--color-text-muted` | `#A3B5AA` | Muted sage secondary copy | 8.43:1 on bg / 7.42:1 on surface |
| `--color-border` | `#264136` | Card and panel structural borders | Distinct at 1px solid |
| `--color-border-subtle` | `#1C332A` | Grid separators, telemetry dividers | Decorative / non-text |
| `--color-primary` | `#2DD4BF` | Luminous mint/teal primary button | 9.19:1 against `#04201B` text |
| `--color-accent` | `#D9A66B` | Warm brass accent, badge highlights | 8.32:1 on bg / 7.32:1 on surface |
| `--color-link` | `#5EEAD4` | Electric bioluminescent hyperlink | 12.28:1 on bg / 10.81:1 on surface |
| `--glow-accent` | `0 0 16px rgba(45,212,191,0.2)` | Subtle aura for active sensor probes | Luminous depth |

---

## 3. Typographic Hierarchy

FloraMesh pairs an organic, high-contrast serif display with a clean, geometric sans-serif for UI clarity, complemented by Noto Nastaliq Urdu for regional poetry and authentic botanical heritage.

### Type Families
1. **Display Serif:** `Fraunces` (OFL 1.1, Self-Hosted WOFF2)
   - Fallbacks: `Georgia, 'Times New Roman', serif`
   - Role: Editorial headlines, section titles, signature quotes, oversized numbers.
   - Styling: Optical size responsive, delicate serifs, high distinction.
2. **Body & UI Sans:** `Plus Jakarta Sans` (OFL 1.1, Self-Hosted WOFF2)
   - Fallbacks: `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
   - Role: Navigation, UI controls, product specs, pricing, form inputs, telemetry data.
   - Styling: Crisp x-height, open apertures, excellent legibility at micro-sizes.
3. **Regional Nastaliq:** `Noto Nastaliq Urdu` (System & Web Fallbacks)
   - Fallbacks: `'Jameel Noori Nastaleeq', var(--font-display)`
   - Role: Urdu brand tagline, botanical folk names (e.g., گلِ داؤدی, رات کی رانی), cultural notes.
4. **Telemetry & Code:** `SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace`
   - Role: IoT sensor packet readouts, hardware specs, coordinates (33.7294° N, 73.0931° E).

### Scale & Tokens
```css
/* Fluid Display Headlines */
--display-hero:     clamp(2.75rem, 6.2vw, 5.25rem);  /* Line-height: 1.1; Letter-spacing: -0.025em */
--display-title:    clamp(2.00rem, 4.2vw, 3.25rem);  /* Line-height: 1.15; Letter-spacing: -0.02em */
--display-subtitle: clamp(1.35rem, 2.5vw, 2.00rem);  /* Line-height: 1.25 */

/* Modular Text Scale */
--text-5xl: 3.000rem; /* 48px */
--text-4xl: 2.250rem; /* 36px */
--text-3xl: 1.875rem; /* 30px */
--text-2xl: 1.500rem; /* 24px */
--text-xl:  1.250rem; /* 20px */
--text-lg:  1.125rem; /* 18px */
--text-base:1.000rem; /* 16px */
--text-sm:  0.875rem; /* 14px */
--text-xs:  0.750rem; /* 12px */

/* Numerics */
--font-numeric: tabular-nums; /* Monospaced alignment for prices and telemetry */
```

---

## 4. Surfaces, Gradients & Depth

FloraMesh replaces flat cookie-cutter boxes with subtle, layered atmospheric depth:

### Ambient CSS Mesh Gradients
- **Heritage Cream:**
  ```css
  --gradient-hero: radial-gradient(at 0% 0%, rgba(243, 238, 226, 0.85) 0px, transparent 55%),
                   radial-gradient(at 100% 0%, rgba(180, 87, 47, 0.07) 0px, transparent 45%),
                   radial-gradient(at 50% 100%, rgba(15, 118, 110, 0.06) 0px, transparent 50%);
  ```
- **Midnight Grove:**
  ```css
  --gradient-hero: radial-gradient(at 0% 0%, rgba(26, 50, 42, 0.85) 0px, transparent 55%),
                   radial-gradient(at 100% 0%, rgba(45, 212, 191, 0.08) 0px, transparent 45%),
                   radial-gradient(at 50% 100%, rgba(217, 166, 107, 0.06) 0px, transparent 50%);
  ```

### Organic SVG Grain Overlay
An ultra-fine SVG noise filter (`feTurbulence` baseFrequency 0.75) applied as an absolute non-blocking overlay (`pointer-events: none; mix-blend-mode: multiply; opacity: var(--grain-opacity);`). This adds physical texture akin to archival handmade botanical paper.

### Layered Elevation
- **Card Surface Default:** `box-shadow: var(--shadow-sm); border: 1px solid var(--color-border);`
- **Card Hover Elevation:** `transform: translateY(-4px); box-shadow: var(--elevation-hover); border-color: var(--color-accent);`
- **Corner Radii Hierarchy:**
  - Micro chips / Pill badges: `--radius-pill` (`9999px`)
  - Form inputs, buttons: `--radius-pill` or `--radius-md` (`12px`)
  - Product cards & feature containers: `--radius-lg` (`16px`)
  - Hero media frames & featured showcases: `--radius-xl` (`24px`)

---

## 5. Motion Language & Micro-Interactions

Motion at FloraMesh is calm, physics-informed, and purposeful—never jittery or distracting.

1. **Micro-Interactions (Buttons, Links, Chips):**
   - Timing: `180ms cubic-bezier(0.16, 1, 0.3, 1)`
   - Properties: `transform`, `background-color`, `border-color`, `box-shadow`
2. **Editorial Reveal (Cards, Section Entrances):**
   - Timing: `600ms cubic-bezier(0.16, 1, 0.3, 1)`
   - Stagger: `80ms` delay between child elements.
3. **Parallax / Ambient Depth:**
   - Native CSS scroll-driven or gentle continuous float on decorative botanical leaves.
4. **Button State Machine:**
   - **Idle:** Solid fill, clean typography, crisp border.
   - **Hover / Focus-Visible:** Scale `1.015`, subtle glow or elevated shadow, distinct focus ring (`0 0 0 3px var(--focus-ring)`).
   - **Active:** Scale `0.985`.
   - **Loading:** Spinner replaces or flanks text, `aria-busy="true"`.
   - **Success (Add to Cart):** Instant swap to check icon + "Added to cart" label, persisted for `1.2s` before returning smoothly to idle.
5. **Accessibility Constraint (`prefers-reduced-motion`):**
   - All animations collapse to instant state swaps (`0.01ms`), transitions disable transforms, scroll behavior switches to `auto`.

---

## 6. Component Staging Specifications

### A. Hero Section (55/45 Editorial Split)
- **Left Column (55%):**
  - Regional Eyebrow: `ISLAMABAD & RAWALPINDI • SATELLITE TO SOIL`
  - Headline: Display Fraunces (`--display-hero`), *"We will plant for you."*
  - Body: Editorial description explaining bespoke micro-landscaping with IoT soil health monitoring.
  - Interactive Space Selector Chips: `[Balcony]`, `[Rooftop]`, `[Living Room]`, `[Courtyard]`, `[Office]`. Clicking a chip swaps the hero preview stage, hardware specs, and sample moisture curve dynamically.
  - Dual CTAs: Primary pill button (*"Explore Landscaping Kits"*) + Secondary text link with arrow (*"View Live Telemetry Demo"*).
- **Right Column (45%):**
  - Framed Hero Showcase (`--radius-xl`, 24px).
  - Floating Telemetry Widget: Real-time animated SVG sparkline, showing `"Soil Moisture: 64% Optimal"`, `"EC: 1.4 mS/cm"`, `"F-7 Courtyard Node"`.
  - Regional Weather Pill: Ambient temperature & Margalla humidity reading.

### B. Product Card (Quiet-Luxury Catalog Unit)
- **Aspect Ratio:** `4:5` vertical ratio (`aspect-ratio: 4/5`) with object-fit cover.
- **Image Staging:** High-resolution botanical photography with dominant terracotta/sand background tone before full load.
- **Micro-Badges:** Single, factual badge top-left (e.g., `"Potohar Hardy"`, `"Sub-Irrigated"`, `"Zigbee 3.0"`) — NO fake "Sale! 70% Off" stickers.
- **Wishlist Heart:** Top-right glassmorphic circle with accessible SVG icon and `aria-label="Add [Title] to wishlist"`.
- **Card Content:**
  - Category / Botanical taxonomy line (`Ficus lyrata • Indoors`).
  - Product Title (concise, $\le 4$ words, Fraunces serif).
  - Pricing Row: Monospaced PKR (`tabular-nums`), strikethrough comparison only when authentic compare-at price exists.
- **Interactive Quick-Add:** Hover/focus reveals bottom bar with quick variant pick and 1-tap cart button.

### C. Site Footer (Editorial Grounding)
- **Upper Container:** Integrated card-style newsletter container with bespoke typography: *"Join our seasonal garden dispatch for the Twin Cities."*
- **4-Column Layout:**
  - Col 1: FloraMesh Brand & Urdu Tagline in Noto Nastaliq (`آپ کا خیال، ہمارا پودا، سرسبز جہاں`).
  - Col 2: Living Collections (Balcony, Courtyard, Living Room, Artisan Planters).
  - Col 3: Hardware & Telemetry (Soil Probes, Gateway Hub, FloraCloud API).
  - Col 4: Studio & Nursery (Sector F-7/3 Islamabad, Workshop rawalpindi, WhatsApp hotline).
- **Lower Bar:** Legal rights, zero-tracking privacy declaration, and an oversized low-contrast Fraunces decorative wordmark spanning the lower base.
