const CACHE_NAME = 'barberapp-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
];

// Instalacija — keširanje fajlova
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ BarberApp keširan');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Aktivacija — brisanje starih keš verzija
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch — prvo mreža, pa keš ako nema interneta
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Keširaj svežu verziju
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Nema interneta — vrati iz keša
        return caches.match(event.request);
      })
  );
});