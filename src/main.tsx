
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
} else {
  console.error("Root element not found");
}
