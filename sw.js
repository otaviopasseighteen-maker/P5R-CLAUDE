/* Persona 5 Royal Fan Site — scoped offline cache. */
const CACHE_PREFIX = 'p5r-fan-site-';
const CACHE_NAME = `${CACHE_PREFIX}v2`;
const BASE_URL = new URL('./', self.registration.scope);
const STATIC_ASSETS = [
    '', 'index.html',
    'pages/characters.html', 'pages/confidants.html', 'pages/palaces.html',
    'pages/mechanics.html', 'pages/ost.html', 'pages/royal.html',
    'css/main.css', 'css/components.css', 'css/animations.css',
    'js/main.js', 'js/components.js', 'js/animations.js',
    'js/pages/characters.js', 'js/pages/confidants.js', 'js/pages/palaces.js',
    'js/pages/mechanics.js', 'js/pages/ost.js', 'js/pages/royal.js',
    'data/game-data.json', 'assets/icons/favicon.svg'
].map(path => new URL(path, BASE_URL).href);
self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(names => Promise.all(
        names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map(name => caches.delete(name))
    )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(fetch(request).then(response => {
            if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
            return response;
        }).catch(() => caches.match(request).then(cached => cached || caches.match(new URL('index.html', BASE_URL).href))));
        return;
    }
    event.respondWith(caches.match(request).then(cached => {
        if (cached) {
            fetch(request).then(response => {
                if (response.ok && response.type === 'basic') caches.open(CACHE_NAME).then(cache => cache.put(request, response));
            }).catch(() => {});
            return cached;
        }
        return fetch(request).then(response => {
            if (response.ok && response.type === 'basic') caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
            return response;
        });
    }));
});
self.addEventListener('sync', event => {
    if (event.tag !== 'sync-checklist') return;
    event.waitUntil(self.clients.matchAll().then(clients => clients.forEach(client => client.postMessage({ type: 'CHECKLIST_SYNC' }))));
});
self.addEventListener('push', event => {
    if (!event.data) return;
    let data;
    try { data = event.data.json(); } catch (_) { data = { title: 'Persona 5 Royal', body: event.data.text() }; }
    const options = {
        body: data.body || '', icon: new URL('assets/icons/favicon.svg', BASE_URL).href,
        badge: new URL('assets/icons/favicon.svg', BASE_URL).href,
        data: { url: data.url || BASE_URL.href }
    };
    event.waitUntil(self.registration.showNotification(data.title || 'Persona 5 Royal', options));
});
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const target = new URL(event.notification.data?.url || BASE_URL.href, BASE_URL);
    if (target.origin !== self.location.origin) return;
    event.waitUntil(self.clients.openWindow(target.href));
});
