
// Function to add link preload hints for critical resources
export function addPreloadHints() {
  const criticalAssets = [
    '/favicon.ico',
    '/index.html',
  ];
  
  criticalAssets.forEach(asset => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = asset;
    link.as = asset.endsWith('.css') ? 'style' : 'script';
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
      ]);
    });
  }
}
