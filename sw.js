/**
 * FloraMesh Offline Service Worker (sw.js)
 * High-performance App Shell caching and offline catalog viewing for twin-city gardeners.
 * Conforms to 100% vanilla zero-dependency architecture.
 */

const CACHE_NAME = 'floramesh-v2.7.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './shop.html',
  './product.html',
  './cart.html',
  './checkout.html',
  './wishlist.html',
  './compare.html',
  './my-account.html',
  './about.html',
  './contact.html',
  './faq.html',
  './shipping-returns.html',
  './accessibility.html',
  './terms.html',
  './privacy.html',
  './sitemap.html',
  './manifest.webmanifest',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/pages.css',
  './css/responsive.css',
  './js/config.js',
  './js/icons.js',
  './js/utils.js',
  './js/ui.js',
  './data/products.js',
  './js/search.js',
  './js/partials.js',
  './js/cart.js',
  './js/wishlist.js',
  './js/gallery.js',
  './js/filters.js',
  './js/product.js',
  './js/delight.js',
  './js/main.js',
  './assets/images/brand/floramesh-logo.svg',
  './assets/images/brand/favicon.svg',
  './assets/fonts/plus-jakarta-sans-variable.woff2',
  './assets/fonts/fraunces-variable.woff2'
];

// Install: pre-cache critical app shell and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        // Tolerant precache: if optional media fails, service worker still installs
        console.warn('FloraMesh SW precache notice:', err);
      })
  );
});

// Activate: clean up stale cache versions and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for HTML pages with cache fallback; Stale-While-Revalidate for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Navigation requests: HTML pages
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match(req).then((cached) => {
            if (cached) return cached;
            return caches.match('./index.html');
          });
        })
    );
    return;
  }

  // Static Assets (fonts, stylesheets, scripts, images)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Return cached and refresh in background
        fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkRes));
          }
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return networkRes;
      });
    })
  );
});
