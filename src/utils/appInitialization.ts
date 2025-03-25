
// Function to add link preload hints for critical resources
export function addPreloadHints() {
  const criticalAssets = [
    '/favicon.ico',
    '/index.html',
    '/placeholder.svg',
  ];
  
  criticalAssets.forEach(asset => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = asset;
    link.as = asset.endsWith('.css') ? 'style' : 
              asset.endsWith('.js') ? 'script' : 
              asset.endsWith('.svg') || asset.endsWith('.png') || asset.endsWith('.jpg') || asset.endsWith('.webp') ? 'image' : 
              'fetch';
    document.head.appendChild(link);
  });
  
  // Add DNS prefetch for external resources
  const dnsPrefetchDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.gpteng.co'
  ];
  
  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
}

// Function to initialize browser caching
export function initializeCache() {
  // Add some browser cache hints
  if ('caches' in window) {
    // Prime the cache with static assets
    caches.open('static-assets-v1').then(cache => {
      // Cache commonly used assets
      cache.addAll([
        '/',
        '/index.html',
        '/placeholder.svg',
        '/og-image.png',
        '/favicon.ico'
      ]);
    });
  }
  
  // Add HTTP headers optimization hint using meta tags
  const metaHttpEquiv = document.createElement('meta');
  metaHttpEquiv.httpEquiv = 'Cache-Control';
  metaHttpEquiv.content = 'public, max-age=31536000';
  document.head.appendChild(metaHttpEquiv);
}

// Function to optimize page performance
export function optimizePerformance() {
  // Defer non-critical operations
  setTimeout(() => {
    // Register service worker for offline support and faster return visits
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
      });
    }
  }, 2000);
}
