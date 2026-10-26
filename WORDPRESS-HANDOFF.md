# WordPress & WooCommerce Conversion Handoff Guide (`WORDPRESS-HANDOFF.md`)

This document provides a complete architectural roadmap for converting the static **FloraMesh** HTML5/CSS3/JS prototype into a custom classic WordPress theme (`wp-content/themes/floramesh/`) integrated with **WooCommerce**.

## 1. Static Page to WordPress / WooCommerce Template Mapping

| Static Prototype File | Target WordPress / WooCommerce Template | Integration Purpose |
| :--- | :--- | :--- |
| `js/partials.js` (Header) | `header.php` | Outputs `<head>`, `wp_head()`, announcement bar, site logo (`the_custom_logo()`), primary `wp_nav_menu()`, and mini-cart trigger. |
| `js/partials.js` (Footer) | `footer.php` | Outputs 4-column footer widgets, newsletter form, copyright, slide-out mini-cart container, and `wp_footer()`. |
| `index.html` | `front-page.php` | Renders the 13-section home landing experience using custom fields (ACF) or block patterns plus `[products]` / `WC_Product_Query` loops. |
| `shop.html` | `woocommerce/archive-product.php` | Main shop & category catalog page with sidebar filters and sorting. |
| `product.html` | `woocommerce/single-product.php` | Single product/service page with gallery, exposed variant buttons, unit price badge, delivery estimate, and tabs. |
| `cart.html` | `woocommerce/cart/cart.php` | Live WooCommerce cart table, gift-wrap fee checkbox hook, and `cart-totals.php`. |
| `checkout.html` | `woocommerce/checkout/form-checkout.php` | Live WooCommerce billing/shipping fields, planting slot picker, and payment gateways (COD, JazzCash, EasyPaisa, Bank Transfer). |
| `wishlist.html` | `page-wishlist.php` | Custom page template retaining `js/wishlist.js` (`localStorage` guest wishlist) or connecting to a WooCommerce Wishlist plugin. |
| `about.html` | `page-about.php` or `page.php` | Brand story, mission/vision, and team layout. |
| `contact.html` | `page-contact.php` | Contact layout embedding Contact Form 7 or WPForms shortcode. |
| `faq.html` | `page-faq.php` | Accessible FAQ accordion page. |
| `shipping-returns.html` | `page-shipping-returns.php` | Policy page managed via the WordPress block/classic editor. |
| `my-account.html` | `woocommerce/myaccount/form-login.php` & `my-account.php` | Native WooCommerce customer authentication, order history, and Telemetry Dashboard link. |
| `404.html` | `404.php` | Branded not-found template. |

## 2. Product Data (`data/products.js`) to WooCommerce Field Mapping

| `data/products.js` Property | WooCommerce Field / Meta Key | Notes |
| :--- | :--- | :--- |
| `sku` | `_sku` (`SKU` column in `products.csv`) | Unique identifier (`FM-SRV-001` through `FM-CSR-005`). |
| `name` | `post_title` (`Name`) | Product or service title. |
| `shortDescription` | `post_excerpt` (`Short description`) | Concise ≤25-word summary shown above purchase controls. |
| `description` | `post_content` (`Description`) | Full 120–180 word product description. |
| `price` / `salePrice` | `_regular_price` / `_sale_price` | Numeric PKR amounts. |
| `category` | `product_cat` taxonomy | Maps to the 5 FloraMesh categories. |
| `tags` | `product_tag` taxonomy | Searchable botanical and craft tags. |
| `variants` | `WC_Product_Variable` attributes | Mapped in `products.csv` under `Attribute 1 name` and `Attribute 1 value(s)`. |
| `materials`, `dimensions`, `care`, `makingStory` | Custom post meta (`_floramesh_materials`, etc.) | Exported as `Meta: _floramesh_*` columns in `products.csv` and displayed via `woocommerce_product_tabs` filter. |

## 3. Which Features Are Demo-Only vs. Retained After Conversion
- **Retained Front-End Assets & Architecture:**
  - `css/tokens.css`, `css/base.css`, `css/components.css`, `css/pages.css`, `css/responsive.css` (enqueued via `wp_enqueue_style()` in `functions.php`).
  - `assets/fonts/fraunces-variable.woff2` and `assets/fonts/plus-jakarta-sans-variable.woff2` (local self-hosted fonts; zero external CDN dependencies).
  - `assets/images/brand/floramesh-logo.svg` and `assets/images/brand/floramesh-logo-dark.svg` (dynamic theme logo swapping).
  - `js/config.js` and `js/utils.js` (DOM XSS sanitizers, focus traps, scroll locking, and unified 24x24 SVG icons).
  - WCAG 2.2 AA Theme Switcher (`Heritage Cream` & `Midnight Grove`) with pre-paint zero-FOUT `<script>` and `localStorage` persistence.
  - Sticky header, full-height mobile menu sheet, mobile filter bottom sheet, image zoom modal (`js/gallery.js`), and guest-friendly `localStorage` wishlist (`js/wishlist.js`).
- **Replaced by WordPress / WooCommerce:**
  - `data/products.js` & `js/filters.js` → Replaced by WooCommerce database queries (`WC_Product_Query`) and native WooCommerce layered navigation/sorting.
  - `js/cart.js` → Replaced by WooCommerce session cart (`WC()->cart`) and AJAX mini-cart fragments (`woocommerce_add_to_cart_fragments`).
  - Demo Checkout, Contact, Newsletter, and My Account forms → Replaced by live WooCommerce checkout, Contact Form 7 / WPForms, and native WordPress user authentication.

## 4. Recommended Upgrade-Safe WooCommerce Hooks (Prefer Hooks Over Full Template Overrides)
Following [WooCommerce Template Structure Best Practices](https://woocommerce.com/document/template-structure/) and [UsersInsights Child Theme Guidelines](https://usersinsights.com/woocommerce-template/):
1. **Declare Theme Support in `functions.php`:**
   ```php
   function floramesh_add_woocommerce_support() {
       add_theme_support( 'woocommerce' );
       add_theme_support( 'wc-product-gallery-zoom' );
       add_theme_support( 'wc-product-gallery-lightbox' );
       add_theme_support( 'wc-product-gallery-slider' );
   }
   add_action( 'after_setup_theme', 'floramesh_add_woocommerce_support' );
   ```
   *(Important: Do NOT create a root `woocommerce.php` file if you plan to customize `woocommerce/archive-product.php`.)*
2. **Display Unit Price & Total Order Shipping Estimate on Single Product Page:**
   Hook into `woocommerce_single_product_summary` (priority 15 and 35) to render `_floramesh_unit_price` and the twin-city delivery estimate box without overriding the entire `single-product.php` file.
3. **Add Gift-Wrap Fee & Gift Note in Cart/Checkout:**
   Use `woocommerce_cart_calculate_fees` to add the Rs 350 Artisan Reed/Kraft Gift Wrapping fee when the customer checks the gift-wrap box, and save the gift note via `woocommerce_checkout_create_order`.

## 5. Step-by-Step Conversion & CSV Import Checklist
1. Provision WordPress on your staging host (`HosterSale` / `Hostinger PK` as planned in `docs/idea.pdf`) and install **WooCommerce**.
2. In **WooCommerce → Settings → General**, set Currency to **Pakistani Rupee (Rs / PKR)** and primary location to **Pakistan — Islamabad Capital Territory**.
3. Create `wp-content/themes/floramesh/`, enqueue the five CSS stylesheets in `functions.php`, and split `index.html` into `header.php`, `footer.php`, and `front-page.php`.
4. Upload `assets/images/products/*.webp` to `wp-content/uploads/floramesh-products/`.
5. Go to **Products → All Products → Import**, select `products.csv`, and **test importing 2–3 rows first** to verify SKU, price, and custom meta mappings before importing all 25 products.
