import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Enable polling to watch files
      interval: 100, // Check for changes every 100ms (adjust if needed)
    },
  },
});
