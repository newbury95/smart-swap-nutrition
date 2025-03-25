
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add the web vitals measurement for SEO performance tracking
const reportWebVitals = (metric: any) => {
  // You can send these metrics to an analytics service
  console.log(metric);
};

const initializeApp = () => {
  const root = document.getElementById("root");
  if (root) {
    // Create a persistent root for React
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

// Add custom event to track when the page becomes visible
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Page is now visible, can load non-critical resources
    // This helps with Core Web Vitals metrics
  }
});

// Measure and report web vitals when supported
// @ts-ignore - web-vitals would be imported in a real app
if (typeof reportWebVitals === 'function') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
  });
}
