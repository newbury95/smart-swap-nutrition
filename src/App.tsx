
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import AppRoutes from "@/routes/AppRoutes";
import QueryProvider from "@/providers/QueryProvider";
import { HelmetProvider } from "react-helmet-async";
import { addPreloadHints, initializeCache } from "@/utils/appInitialization";

// Use requestIdleCallback for non-critical initialization
const initializeApp = () => {
  // Add preloading for critical resources
  addPreloadHints();
  
  // Initialize browser caching
  initializeCache();
};

// Use requestIdleCallback if available, otherwise use setTimeout
if ('requestIdleCallback' in window) {
  // @ts-ignore - TypeScript doesn't recognize requestIdleCallback
  window.requestIdleCallback(initializeApp);
} else {
  setTimeout(initializeApp, 1);
}

function App() {
  return (
    <HelmetProvider>
      <QueryProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
            <Toaster />
          </Router>
        </AuthProvider>
      </QueryProvider>
    </HelmetProvider>
  );
}

export default App;
