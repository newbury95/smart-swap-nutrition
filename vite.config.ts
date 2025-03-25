
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist', // Ensure build files are outputted to the dist directory
    minify: true, // Enable minification for smaller bundle sizes
    cssMinify: true, // Minify CSS for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: [
            '@/components/ui/button',
            '@/components/ui/dialog',
            '@/components/ui/toast',
          ],
        },
      },
    },
  },
}));
