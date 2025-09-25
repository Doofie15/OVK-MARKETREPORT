// Service Worker for OVK Analytics
// Optimized for Netlify deployment with offline analytics queuing

const CACHE_NAME = 'ovk-analytics-v1';
const ANALYTICS_QUEUE_KEY = 'ovk-analytics-queue';

// Cache analytics requests for offline sending
const CACHE_URLS = [
  '/',
  '/admin/',
  '/lib/analytics.js',
  '/api/analytics'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - handle analytics requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle analytics requests
  if (url.pathname.includes('/api/analytics')) {
    event.respondWith(handleAnalyticsRequest(event.request));
    return;
  }
  
  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Handle analytics requests with offline queuing
async function handleAnalyticsRequest(request) {
  try {
    // Try to send the request
    const response = await fetch(request.clone());
    
    if (response.ok) {
      // If successful, process any queued requests
      await processQueuedAnalytics();
      return response;
    } else {
      throw new Error('Analytics request failed');
    }
  } catch (error) {
    // If offline or failed, queue the request
    await queueAnalyticsRequest(request);
    return new Response('Queued for later', { status: 202 });
  }
}

// Queue analytics request for later sending
async function queueAnalyticsRequest(request) {
  try {
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: await request.text(),
      timestamp: Date.now()
    };
    
    // Get existing queue
    const queue = await getAnalyticsQueue();
    queue.push(requestData);
    
    // Limit queue size (keep last 50 requests)
    if (queue.length > 50) {
      queue.splice(0, queue.length - 50);
    }
    
    // Save updated queue
    await setAnalyticsQueue(queue);
    
    console.log('Analytics request queued for later sending');
  } catch (error) {
    console.error('Failed to queue analytics request:', error);
  }
}

// Process queued analytics requests
async function processQueuedAnalytics() {
  try {
    const queue = await getAnalyticsQueue();
    
    if (queue.length === 0) return;
    
    console.log(`Processing ${queue.length} queued analytics requests`);
    
    const successfulRequests = [];
    
    for (const requestData of queue) {
      try {
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });
        
        if (response.ok) {
          successfulRequests.push(requestData);
        }
      } catch (error) {
        console.error('Failed to send queued analytics request:', error);
        // Keep failed requests in queue
      }
    }
    
    // Remove successful requests from queue
    if (successfulRequests.length > 0) {
      const remainingQueue = queue.filter(req => 
        !successfulRequests.some(success => 
          success.timestamp === req.timestamp
        )
      );
      await setAnalyticsQueue(remainingQueue);
      console.log(`Successfully sent ${successfulRequests.length} queued analytics requests`);
    }
  } catch (error) {
    console.error('Failed to process analytics queue:', error);
  }
}

// Get analytics queue from IndexedDB
async function getAnalyticsQueue() {
  try {
    const db = await openAnalyticsDB();
    const transaction = db.transaction(['queue'], 'readonly');
    const store = transaction.objectStore('queue');
    const result = await new Promise((resolve, reject) => {
      const request = store.get(ANALYTICS_QUEUE_KEY);
      request.onsuccess = () => resolve(request.result?.data || []);
      request.onerror = () => reject(request.error);
    });
    return result;
  } catch (error) {
    console.error('Failed to get analytics queue:', error);
    return [];
  }
}

// Set analytics queue in IndexedDB
async function setAnalyticsQueue(queue) {
  try {
    const db = await openAnalyticsDB();
    const transaction = db.transaction(['queue'], 'readwrite');
    const store = transaction.objectStore('queue');
    await new Promise((resolve, reject) => {
      const request = store.put({ id: ANALYTICS_QUEUE_KEY, data: queue });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to set analytics queue:', error);
  }
}

// Open IndexedDB for analytics queue
async function openAnalyticsDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OVKAnalytics', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('queue')) {
        db.createObjectStore('queue', { keyPath: 'id' });
      }
    };
  });
}

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(processQueuedAnalytics());
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'analytics-cleanup') {
    event.waitUntil(cleanupOldAnalytics());
  }
});

// Cleanup old analytics data
async function cleanupOldAnalytics() {
  try {
    const queue = await getAnalyticsQueue();
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    const recentQueue = queue.filter(item => item.timestamp > oneDayAgo);
    
    if (recentQueue.length < queue.length) {
      await setAnalyticsQueue(recentQueue);
      console.log(`Cleaned up ${queue.length - recentQueue.length} old analytics requests`);
    }
  } catch (error) {
    console.error('Failed to cleanup old analytics:', error);
  }
}