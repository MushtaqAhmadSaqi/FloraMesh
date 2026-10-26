# FloraMesh Design System Documentation (`docs/DESIGN-SYSTEM.md`)

Welcome to the FloraMesh Design System. Designed for an artisanal, trustworthy, and technologically advanced plant-care and IoT telemetry storefront in Islamabad & Rawalpindi, Pakistan.

---

## 1. Principles & Architectural Foundations

1. **Strictly Token-Driven (Zero Hex Codes Outside `tokens.css`):**
   Every component, background, border, surface, and interactive control references semantic CSS variables.
2. **Two Complementary WCAG 2.2 AA Themes:**
   - **Heritage Cream (`heritage`):** Daylight nursery, Multani pottery, Taxila terracotta warmth.
   - **Midnight Grove (`midnight`):** Night garden, IoT telemetry mesh, luxury-tech feel.
3. **Zero Framework & Zero External CDN Dependencies:**
   All variable fonts (`Fraunces` and `Plus Jakarta Sans`) and SVG iconography are self-hosted within `assets/`, enabling seamless local execution over `file://`.
4. **Predictable 4px / 8px Spacing Grid:**
   Consistent spatial rhythm across all cards, containers, buttons, and responsive breakpoints.

---

## 2. Color Palette & Thematic Roles

| Token Role | Heritage Cream (Light) | Midnight Grove (Dark) | Purpose / Meaning | WCAG 2.2 AA Contrast |
| :--- | :--- | :--- | :--- | :--- |
| `--color-bg` | `#FAF7F0` | `#0C1814` | Primary page canvas background | Base layer |
| `--color-surface` | `#FFFFFF` | `#132520` | Cards, modals, drawers, header | Raised surface |
| `--color-surface-alt` | `#F3EEE2` | `#1A322A` | Secondary section rhythm, chips | Subtle background rhythm |
| `--color-text` | `#10241B` | `#EEE9DC` | Primary headings and body typography | $\ge 14:1$ (AAA) |
| `--color-text-muted` | `#54655B` | `#A3B5AA` | Secondary subtitles, timestamps, units | $\ge 5.4:1$ (AA) |
| `--color-border` | `#E4DCC8` | `#264136` | Card borders, form inputs, dividers | Structural UI boundary |
| `--color-primary` | `#10241B` | `#2DD4BF` | Primary brand actions, active links | High prominence |
| `--color-on-primary` | `#FAF7F0` | `#04201B` | Contrast text on primary buttons | $\ge 12:1$ (AAA) |
| `--color-accent` | `#B4572F` | `#D9A66B` | Taxila terracotta & warm brass accents | High-interest CTAs |
| `--color-link` | `#0F766E` | `#5EEAD4` | Clickable inline links, telemetry tags | Interactive hyperlinks |
| `--color-success` | `#15803D` | `#4ADE80` | Stock indicators, order completion | Positive confirmation |
| `--color-warning` | `#B45309` | `#FBBF24` | Low stock pill ($\le 5$), notices | Attention required |
| `--color-danger` | `#B91C1C` | `#F87171` | Out of stock, remove actions, errors | Negative / destructive |

---

## 3. Typography Scale & Families

- **Display Serif (`--font-display`):** `Fraunces, Georgia, 'Times New Roman', serif`
  - Used for `h1`, `h2`, `h3`, `h4`, hero titles, and product card headings.
  - Generous editorial line-heights (`1.2` to `1.35`).
- **Clean UI Sans (`--font-sans`):** `Plus Jakarta Sans, Inter, system-ui, sans-serif`
  - Used for body copy, form controls, badges, buttons, and telemetry values.
  - Normal line-height (`1.6`).
- **Urdu Fallback (`--font-urdu`):** `Noto Nastaliq Urdu, 'Jameel Noori Nastaleeq', var(--font-display)`
  - Used for brand taglines and handwritten gift card previews.

### Type Scale:
- `--text-xs`: `0.75rem` (12px)
- `--text-sm`: `0.875rem` (14px)
- `--text-base`: `1rem` (16px)
- `--text-lg`: `1.125rem` (18px)
- `--text-xl`: `1.25rem` (20px)
- `--text-2xl`: `1.5rem` (24px)
- `--text-3xl`: `1.875rem` (30px)
- `--text-4xl`: `2.25rem` (36px)
- `--text-5xl`: `3rem` (48px)

---

## 4. Spacing Scale & Border Radii

- **Spacing:**
  - `0.25rem` (4px), `0.5rem` (8px), `0.75rem` (12px), `1rem` (16px), `1.25rem` (20px), `1.5rem` (24px), `2rem` (32px), `2.5rem` (40px), `3rem` (48px), `4rem` (64px).
- **Radii:**
  - `--radius-xs`: `4px`
  - `--radius-sm`: `8px`
  - `--radius-md`: `12px` (Buttons, inputs, chips)
  - `--radius-lg`: `16px` (Product cards, order summary)
  - `--radius-xl`: `24px` (Hero media, modals, campaign bands)
  - `--radius-pill`: `9999px` (Badges, search input, round icon buttons)

---

## 5. Iconography Library

All icons are inline SVGs rendered with:
`viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`

Available icons in `FloraMeshUtils.getIcon(name)`:
- `bag`: Shopping basket
- `heart`: Wishlist outline
- `heartFilled`: Wishlist active
- `user`: Account portal
- `search`: Catalog lookup
- `close`: Dismiss & modal close
- `chevronRight` / `chevronLeft` / `chevronDown`: Navigation indicators
- `truck`: Twin-city delivery van
- `leaf`: Botanical / substrate indicator
- `shield`: 14-day guarantee & transit replacement
- `gift`: Gift wrapping & cards
- `check`: Success validation
- `sun` / `moon`: Theme toggle
- `plus` / `minus`: Quantity steppers

---

## 6. How to Add a Third Theme (e.g. "Margalla Mist" or "High-Contrast Solar")

Adding a new theme takes three simple steps without modifying any component CSS:

1. **Add Theme Variables in `css/tokens.css`:**
   ```css
   html[data-theme="margalla-mist"] {
     --color-bg: #F4F6F4;
     --color-surface: #FFFFFF;
     --color-surface-alt: #E8ECE8;
     --color-surface-elevated: #FFFFFF;
     --color-text: #0E2218;
     --color-text-muted: #4B6355;
     --color-border: #D0D8D2;
     --color-primary: #155E38;
     --color-on-primary: #FFFFFF;
     --color-accent: #3B82F6;
     --color-link: #0E7490;
     --color-brass: #B45309;
     --color-media-bg: #E8ECE8;
     --color-header-bg: rgba(244, 246, 244, 0.94);
     --color-backdrop: rgba(14, 34, 24, 0.6);
     --color-announcement-bg: #0E2218;
     --color-announcement-text: #FFFFFF;
     --shadow-sm: 0 4px 12px rgba(14, 34, 24, 0.06);
     --shadow-md: 0 10px 24px rgba(14, 34, 24, 0.08);
   }
   ```

2. **Register the Theme in `js/utils.js`:**
   Update `FloraMeshUtils.toggleTheme()` or provide a selector dropdown with the new key (`margalla-mist`).

3. **Verify Contrast:**
   Ensure text/background pairs maintain at least 4.5:1 ratio for normal text and 3:1 for graphical user interface controls using a WCAG analyzer.
