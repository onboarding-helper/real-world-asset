// Service Worker for Vite + React PWA
const HOSTNAME_WHITELIST = [
    self.location.hostname,
    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net'
  ];
  
  // Function to fix the URL in case of mixed content or cache-busting.
  const getFixedUrl = (req) => {
    const now = Date.now();
    let url = new URL(req.url);
  
    // 1. Fix http:// URLs (to https:// if needed).
    url.protocol = self.location.protocol;
  
    // 2. Add cache-busting query string for static assets.
    if (url.hostname === self.location.hostname) {
      url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
    }
    return url.href;
  };
  
  // Activate the service worker (take control of the page immediately).
  self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
  });
  
  // Handle all fetch requests.
  self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
  
    // Skip non-whitelisted hosts (e.g., API requests, third-party services).
    if (!HOSTNAME_WHITELIST.includes(url.hostname)) return;
  
    // Let browser handle navigation requests (SPA routing).
    if (request.mode === 'navigate') return;
  
    // Skip module scripts (i.e., JS files that are used as modules).
    if (request.destination === 'script' || request.destination === 'document') return;
  
    // Stale-while-revalidate for static assets.
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(getFixedUrl(request)).then((networkResponse) => {
          // Only cache the response if it's successful (status 200).
          if (networkResponse && networkResponse.status === 200) {
            caches.open('pwa-cache').then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
          return networkResponse;
        }).catch(() => cachedResponse); // Use cached response if fetch fails.
  
        return cachedResponse || fetchPromise;
      })
    );
  });
  