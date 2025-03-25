
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add the web vitals measurement for SEO performance tracking
const reportWebVitals = (metric: any) => {
  // Send these metrics to an analytics service
  console.log(metric);
  
  // In a production environment, you would send these to your analytics
  if (navigator.sendBeacon) {
    const analyticsUrl = 'https://youranalytics.com/collect';
    const data = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id
    });
    navigator.sendBeacon(analyticsUrl, data);
  }
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

// Use requestIdleCallback for non-critical initialization
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
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src || '';
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
});

// Measure and report web vitals when supported
if (typeof reportWebVitals === 'function') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
  });
}
