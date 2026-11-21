/* ==========================================================================
   Persona 5 Royal Fan Site - Service Worker
   Offline support and caching strategy
   ========================================================================== */

const CACHE_NAME = 'p5r-fan-site-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/pages/characters.html',
    '/pages/confidants.html',
    '/pages/palaces.html',
    '/pages/mechanics.html',
    '/pages/ost.html',
    '/pages/royal.html',
    '/css/main.css',
    '/css/components.css',
    '/css/animations.css',
    '/js/main.js',
    '/js/components.js',
    '/js/animations.js',
    '/js/pages/characters.js',
    '/js/pages/confidants.js',
    '/js/pages/palaces.js',
    '/js/pages/mechanics.js',
    '/js/pages/ost.js',
    '/js/pages/royal.js',
    '/data/game-data.json',
    '/assets/icons/favicon.svg'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch - network first for HTML, cache first for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests
    if (url.origin !== location.origin) return;

    // HTML pages - network first
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Static assets - cache first
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Update cache in background
                    fetch(request).then((response) => {
                        if (response.ok) {
                            caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
                        }
                    }).catch(() => {});
                    return cachedResponse;
                }

                return fetch(request)
                    .then((response) => {
                        if (response.ok) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                        }
                        return response;
                    });
            })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-checklist') {
        event.waitUntil(syncChecklist());
    }
});

async function syncChecklist() {
    // Sync localStorage checklist data when online
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
        client.postMessage({ type: 'CHECKLIST_SYNC' });
    });
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/assets/icons/favicon.svg',
        badge: '/assets/icons/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});