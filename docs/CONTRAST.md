# FloraMesh WCAG 2.2 AA Contrast Validation (`docs/CONTRAST.md`)

This document certifies contrast compliance for all semantic color pairs defined in `css/tokens.css`. Contrast calculations are derived using the W3C Relative Luminance formula ($L = 0.2126R + 0.7152G + 0.0722B$) implemented in `scripts/check-contrast.js`.

---

## 1. Compliance Standard
* **WCAG 2.2 Level AA Standard:** Minimum **4.5:1** for regular text ($< 18\text{pt}$ / $24\text{px}$ normal, or $< 14\text{pt}$ / $18.5\text{px}$ bold), and minimum **3.0:1** for large text, user interface components, and `:focus-visible` rings.
* **Result:** **100% PASS** across all evaluated combinations in both themes.

---

## 2. Heritage Cream Theme (Light, Default)
*Base Canvas: `#FAF7F0` · Card Surface: `#FFFFFF` · Dark Forest Green: `#10241B`*

| Surface / Background | Foreground Element | Hex Pair | Contrast Ratio | WCAG 2.2 AA Status |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | Primary Body Text | `#FAF7F0` vs `#10241B` | **15.21 : 1** | **PASS (AAA)** |
| **Canvas Background** | Muted Subtitle / Meta | `#FAF7F0` vs `#54655B` | **5.79 : 1** | **PASS (AA)** |
| **Canvas Background** | Pine Editorial Link | `#FAF7F0` vs `#0F766E` | **5.12 : 1** | **PASS (AA)** |
| **Canvas Background** | Terracotta Accent | `#FAF7F0` vs `#B4572F` | **4.52 : 1** | **PASS (AA)** |
| **Card Surface** | Primary Body Text | `#FFFFFF` vs `#10241B` | **16.28 : 1** | **PASS (AAA)** |
| **Card Surface** | Muted Subtitle / Meta | `#FFFFFF` vs `#54655B` | **6.20 : 1** | **PASS (AA)** |
| **Card Surface** | Pine Editorial Link | `#FFFFFF` vs `#0F766E` | **5.47 : 1** | **PASS (AA)** |
| **Card Surface** | Terracotta Accent | `#FFFFFF` vs `#B4572F` | **4.83 : 1** | **PASS (AA)** |
| **Primary Button** | Button Label | `#10241B` vs `#FAF7F0` | **15.21 : 1** | **PASS (AAA)** |
| **Terracotta Button** | Button Label | `#B4572F` vs `#FFFFFF` | **4.83 : 1** | **PASS (AA)** |
| **Success Banner** | Success Text | `#DCFCE7` vs `#15803D` | **4.57 : 1** | **PASS (AA)** |
| **Warning Banner** | Warning Text | `#FEF3C7` vs `#B45309` | **4.51 : 1** | **PASS (AA)** |
| **Danger Banner** | Danger Text | `#FEE2E2` vs `#B91C1C` | **5.30 : 1** | **PASS (AA)** |

---

## 3. Midnight Grove Theme (Dark Mode)
*Base Canvas: `#0C1814` · Card Surface: `#132520` · Glow Teal: `#2DD4BF` / `#5EEAD4`*

| Surface / Background | Foreground Element | Hex Pair | Contrast Ratio | WCAG 2.2 AA Status |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | Primary Body Text | `#0C1814` vs `#EEE9DC` | **14.98 : 1** | **PASS (AAA)** |
| **Canvas Background** | Muted Subtitle / Meta | `#0C1814` vs `#A3B5AA` | **8.43 : 1** | **PASS (AAA)** |
| **Canvas Background** | Bioluminescent Link | `#0C1814` vs `#5EEAD4` | **12.28 : 1** | **PASS (AAA)** |
| **Canvas Background** | Warm Brass Accent | `#0C1814` vs `#D9A66B` | **8.32 : 1** | **PASS (AAA)** |
| **Card Surface** | Primary Body Text | `#132520` vs `#EEE9DC` | **13.19 : 1** | **PASS (AAA)** |
| **Card Surface** | Muted Subtitle / Meta | `#132520` vs `#A3B5AA` | **7.42 : 1** | **PASS (AAA)** |
| **Card Surface** | Bioluminescent Link | `#132520` vs `#5EEAD4` | **10.81 : 1** | **PASS (AAA)** |
| **Card Surface** | Warm Brass Accent | `#132520` vs `#D9A66B` | **7.32 : 1** | **PASS (AAA)** |
| **Primary Button** | Button Label | `#2DD4BF` vs `#04201B` | **9.19 : 1** | **PASS (AAA)** |
| **Warm Brass Button** | Button Label | `#D9A66B` vs `#1C1204` | **8.45 : 1** | **PASS (AAA)** |
| **Card Surface** | Success Text | `#132520` vs `#4ADE80` | **9.18 : 1** | **PASS (AAA)** |
| **Card Surface** | Warning Text | `#132520` vs `#FBBF24` | **9.58 : 1** | **PASS (AAA)** |
| **Card Surface** | Danger Text | `#132520` vs `#F87171` | **5.78 : 1** | **PASS (AA)** |

---

## 4. UI Focus Ring Compliance
* `:focus-visible` ring in Heritage: `3px solid #0F766E` against `#FAF7F0` canvas yields **5.12:1** (exceeds 3.0:1 UI requirement).
* `:focus-visible` ring in Midnight: `3px solid #2DD4BF` against `#0C1814` canvas yields **10.35:1** (exceeds 3.0:1 UI requirement).
