// Neeksha's Summer Bar — offline-first service worker.
// Everything is local and static: cache-first with a versioned precache.
const CACHE = 'summer-bar-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/data.js',
  './js/app.js',
  './js/cocktail.js',
  './js/reactions.js',
  './js/screens.js',
  './js/glaze.js',
  './js/drink.js',
  './js/file.js',
  './js/fx.js',
  './js/pwa.js',
  './fonts/PlayfairDisplay-var-latin.woff2',
  './fonts/DMSans-var-latin.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit ||
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() =>
        e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()
      )
    )
  );
});
