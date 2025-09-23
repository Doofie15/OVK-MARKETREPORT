const CACHE_NAME = 'ovk-wool-market-v3.0';
const STATIC_CACHE = 'ovk-static-v3.0';
const DYNAMIC_CACHE = 'ovk-dynamic-v3.0';
const API_CACHE = 'ovk-api-v3.0';

// Cache different types of resources
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/manifest.json',
  '/assets/logos/ovk-logo-embedded.svg',
  '/favicon.ico'
];

// Install event - cache static resources and skip waiting
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE),
      caches.open(API_CACHE)
    ]).then(() => {
      console.log('Service Worker installed successfully');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE].includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients immediately
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker activated successfully');
    })
  );
});

// Message event - handle skip waiting requests
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests (except for APIs we want to cache)
  if (!url.origin.includes(self.location.origin) && !url.pathname.includes('/api/')) {
    return;
  }

  // Handle different types of requests
  if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
    // API requests - Network First with cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.endsWith(asset))) {
    // Static assets - Cache First
    event.respondWith(handleStaticRequest(request));
  } else {
    // Dynamic content - Stale While Revalidate
    event.respondWith(handleDynamicRequest(request));
  }
});

// Network First strategy for API requests
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Network error', { 
      status: 408, 
      statusText: 'Network timeout' 
    });
  }
}

// Cache First strategy for static assets
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch static asset:', request.url);
    return new Response('Asset not found', { status: 404 });
  }
}

// Stale While Revalidate strategy for dynamic content
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // If network fails and we have cache, return cache
    if (cachedResponse) {
      return cachedResponse;
    }
    // For navigation requests, return the main page
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    return new Response('Content not available', { status: 408 });
  });
  
  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Background sync for offline actions (if needed)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle any offline actions that need to be synced
  console.log('Background sync triggered');
}

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: data.url
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'view' && data && data.url) {
    // Open the specific report
    event.waitUntil(
      clients.openWindow(data.url)
    );
  } else if (action === 'dismiss') {
    // Just close the notification (already done above)
    return;
  } else if (data && data.url) {
    // Default click - open the report
    event.waitUntil(
      clients.openWindow(data.url)
    );
  } else {
    // Fallback - open the main app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
