
const CACHE_NAME = 'kelimapp-v5-production';

// Core assets that must be cached immediately
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Domains that we want to cache at runtime (CDN libraries)
const RUNTIME_CACHE_DOMAINS = [
  'aistudiocdn.com',
  'cdn-icons-png.flaticon.com',
  'fonts.gstatic.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strategy for External CDNs (React, Lucide, Fonts)
  // Stale-While-Revalidate: Use cache if available, but update in background
  if (RUNTIME_CACHE_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
             // If fetch fails (offline) and no cache, we can't do much for external resources
             // but hopefully they are already cached.
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy for App Shell (Local files)
  // Cache First, fall back to Network
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((networkResponse) => {
         // Check if valid response
         if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
         }
         
         // Cache new local files (like if we add images later)
         const responseToCache = networkResponse.clone();
         caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
         });
         
         return networkResponse;
      });
    })
  );
});
