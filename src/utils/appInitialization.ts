
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
    
    // Also add preconnect for faster initial connection
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = domain;
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);
  });
  
  // Add resource hints for third-party services
  const preconnectDomains = [
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ];
  
  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
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
  
  // Add a custom meta tag for CDN caching hints
  const cdnCachingHint = document.createElement('meta');
  cdnCachingHint.name = 'x-cache-control';
  cdnCachingHint.content = 'max-age=86400';
  document.head.appendChild(cdnCachingHint);
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
    
    // Add event listeners for Core Web Vitals optimization
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        // Report LCP to analytics
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      
      // First Input Delay
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          // Use type assertion to access the processingStart property
          const fidEntry = entry as unknown as {startTime: number; processingStart: number};
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
          // Report FID to analytics
        });
      }).observe({ type: 'first-input', buffered: true });
      
      // Cumulative Layout Shift
      let cumulativeLayoutShift = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Use type assertion to access the hadRecentInput and value properties
          const clsEntry = entry as unknown as {hadRecentInput: boolean; value: number};
          if (!clsEntry.hadRecentInput) {
            cumulativeLayoutShift += clsEntry.value;
          }
        }
        console.log('CLS:', cumulativeLayoutShift);
        // Report CLS to analytics
      }).observe({ type: 'layout-shift', buffered: true });
    }
  }, 2000);
}

// Generate a sitemap for better indexing
export function generateSitemap() {
  // This would normally be done server-side, but we include the logic here for demonstration
  const urls = [
    '/',
    '/diary',
    '/tracking',
    '/forum',
    '/about',
    '/contact',
    '/premium',
    '/privacy',
    '/terms'
  ];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${window.location.origin}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;
  
  console.log('Sitemap generated (would normally be saved to server):', sitemap);
}
