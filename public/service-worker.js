const CACHE_NAME = 'viksorasports-v2'; // Updated version to force cache invalidation
const urlsToCache = [
  '/',
  '/login',
  '/dashboard',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/1.chunk.js',
  '/static/js/2.chunk.js',
  '/static/css/main.chunk.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/images/logo.png'  // Add logo to cache
];

// Install service worker and cache assets
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Network-first strategy for better real-time updates
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          // If network fails, try cache
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || response;
            });
        }

        // Clone the response as it's a stream and can only be consumed once
        const responseToCache = response.clone();

        // Cache the fresh response
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Network failed, try to serve from cache
        return caches.match(event.request)
          .then(response => {
            if (response) {
              console.log('Serving from cache:', event.request.url);
              return response;
            }
            // If not in cache, return offline page or error
            console.log('Not found in cache:', event.request.url);
            return new Response('Offline content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Update service worker and remove outdated caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

// Function to sync forms when back online
async function syncForms() {
  try {
    const formData = await getOfflineFormData();
    if (formData && formData.length > 0) {
      for (const data of formData) {
        try {
          await fetch(data.url, {
            method: data.method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify(data.body)
          });

          // Remove from IndexedDB after successful sync
          await removeOfflineFormData(data.id);
        } catch (error) {
          console.error('Error syncing form data:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error during form sync:', error);
  }
}

// Helper functions to interact with IndexedDB
function getOfflineFormData() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VikSoraSportsDB', 1);

    request.onerror = event => {
      reject('Error opening IndexedDB');
    };

    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(['offlineForms'], 'readonly');
      const objectStore = transaction.objectStore('offlineForms');
      const getAll = objectStore.getAll();

      getAll.onsuccess = () => {
        resolve(getAll.result);
      };

      getAll.onerror = () => {
        reject('Error getting form data from IndexedDB');
      };
    };

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineForms')) {
        db.createObjectStore('offlineForms', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function removeOfflineFormData(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VikSoraSportsDB', 1);

    request.onerror = event => {
      reject('Error opening IndexedDB');
    };

    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(['offlineForms'], 'readwrite');
      const objectStore = transaction.objectStore('offlineForms');
      const deleteRequest = objectStore.delete(id);

      deleteRequest.onsuccess = () => {
        resolve();
      };

      deleteRequest.onerror = () => {
        reject('Error deleting form data from IndexedDB');
      };
    };
  });
}
