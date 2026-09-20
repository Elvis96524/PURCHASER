/* Vessel Purchasing List - service worker
   Keeps the app files on the device so it opens and works without a connection.
   Change CACHE_VERSION whenever you update any of the files below. */
const CACHE_VERSION = 'v4';
const CACHE = 'vessel-purchasing-' + CACHE_VERSION;
const PAGE = './index.html';
const ASSETS = [
  './',
  PAGE,
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k.startsWith('vessel-purchasing-') && k !== CACHE)
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !isFont) return;

  // The sign-in list changes whenever the admin publishes it: always ask the network, never a saved copy.
  if (sameOrigin && (url.pathname.endsWith('/users.json') || url.pathname.endsWith('/data.json'))) return;

  // Opening the app: use the network when online (so updates arrive), the saved copy when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(PAGE, copy));
          }
          return res;
        })
        .catch(() => caches.match(PAGE, { ignoreSearch: true }))
    );
    return;
  }

  // Everything else: answer from the saved copy at once, refresh it in the background.
  event.respondWith(
    caches.match(req).then(hit => {
      const network = fetch(req)
        .then(res => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});
