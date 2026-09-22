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
    //
    // Must be a function: rolldown-vite (pinned in package.json) rejects the
    // object form with "manualChunks is not a function" and fails the build.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
            return "react";
          }
          if (/[\\/]node_modules[\\/]swiper[\\/]/.test(id)) return "swiper";
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
});
