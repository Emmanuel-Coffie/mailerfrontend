import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  // Scan lazy pages before first navigation to avoid optimization reloads.
  optimizeDeps: { entries: ["index.html", "src/pages/*.tsx"] },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    testTimeout: 10000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
          mui: ["@mui/material", "@emotion/react", "@emotion/styled"],
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
