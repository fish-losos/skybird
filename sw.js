const CACHE_NAME = 'skybird-cache-v1';
const urlsToCache = [
  './',
  './skybird_final.html',
  './manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Кэширование ресурсов для офлайн-режима');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) { return response; }
      return fetch(event.request).catch(function() {
        console.warn('Сеть недоступна, используется кэш');
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) { return name !== CACHE_NAME; })
        .map(function(name) { return caches.delete(name); })
      );
    })
  );
});
