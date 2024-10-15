// public/service-worker.js

// This is the service worker with the Cache-first strategy

const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  // Add more assets here
];

// Install event: Cache files during the service worker installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Cache-first strategy for HTTP/HTTPS requests
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Only cache HTTP/HTTPS requests, skip 'chrome-extension://' or other protocols
  if (requestUrl.protocol === "http:" || requestUrl.protocol === "https:") {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          // If found in cache, return cached response
          if (response) {
            return response;
          }

          // If not found, fetch from network and cache the response
          return fetch(event.request).then((networkResponse) => {
            // Ensure the response is valid before caching
            if (networkResponse.status === 200 && networkResponse.type === "basic") {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
  } else {
    // Skip caching for non-HTTP/HTTPS requests like 'chrome-extension://'
  }
});

// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
