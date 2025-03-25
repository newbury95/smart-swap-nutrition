
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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
