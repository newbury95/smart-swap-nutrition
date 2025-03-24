
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add performance monitoring
const reportWebVitals = (metric: any) => {
  // You could send to an analytics endpoint here
  console.log('Web Vitals:', metric);
};

// Add global error handler
const handleGlobalError = (event: ErrorEvent) => {
  console.error('Global error:', event.error);
  // Prevent default browser error handling
  event.preventDefault();
};

window.addEventListener('error', handleGlobalError);

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Use requestIdleCallback for non-critical initialization
const initializeApp = () => {
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
