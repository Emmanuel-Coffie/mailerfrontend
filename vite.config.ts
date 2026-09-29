import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
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
        manualChunks(id: string) {
          if (id.includes("recharts")) return "charts";
          if (id.includes("@mui") || id.includes("@emotion")) return "mui";
          if (
            id.includes("react-router-dom") ||
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/")
          ) {
            return "react";
          }
        },
      },
    },
  },
});
