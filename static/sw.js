const CACHE_NAME = 'serenemind-v1';
const urlsToCache = ['/', '/static/style.css', '/static/icon-192.png'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});