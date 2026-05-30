const CACHE_NAME = 'kasir-warung-v1';
const ASSETS = [
  '/kasir-warung/',
  '/kasir-warung/index.html',
  '/kasir-warung/style.css',
  '/kasir-warung/script.js',
  '/kasir-warung/manifest.json',
  '/kasir-warung/icon-192.png',
  '/kasir-warung/icon-512.png',
  '/kasir-warung/screenshot-1.png'
];

// Tahap Install
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Tahap Aktivasi (Clear cache lama jika ada update)
self.addEventListener('activate', (e) => {
  e.waitUntil(
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

// Tahap Fetch (Strategi Cache First)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
