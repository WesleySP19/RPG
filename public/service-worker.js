const CACHE_NAME = 'rpg-forge-v1';
const ASSETS = [
    './',
    './index.html',
    './css/theme.css',
    './css/main.css',
    './js/app.js',
    './js/core/BaseComponent.js',
    './js/core/Store.js',
    './js/core/Router.js',
    './js/core/RulesEngine.js',
    './js/workers/RulesWorker.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
