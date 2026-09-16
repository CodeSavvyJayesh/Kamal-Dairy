import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    open: true,
  },

  build: {
    // Keep the vendor libraries in their own chunks so a change to app code
    // does not invalidate the whole bundle in users' browser caches.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          swiper: ["swiper"],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
