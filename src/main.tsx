
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Function to add link preload hints for critical resources
function addPreloadHints() {
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

// Use requestIdleCallback for non-critical initialization
const initializeApp = () => {
  // Add preloading for critical resources
  addPreloadHints();
  
  const root = document.getElementById("root");
  if (root) {
    // Create a persistent root for React 19
    const reactRoot = createRoot(root);
    
    reactRoot.render(
      <App />
    );
    
    // Enable React profiler in development
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore - This is only for development debugging
      window.reactRoot = reactRoot;
    }
  } else {
    console.error("Root element not found");
  }
};

// Use requestIdleCallback if available, otherwise use setTimeout
if ('requestIdleCallback' in window) {
  // @ts-ignore - TypeScript doesn't recognize requestIdleCallback
  window.requestIdleCallback(initializeApp);
} else {
  setTimeout(initializeApp, 1);
}

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
