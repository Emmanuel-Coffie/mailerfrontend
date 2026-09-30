import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./frontend-e2e",
  timeout: 60000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3011",
    headless: true,
    viewport: { width: 1440, height: 1000 },
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 3011 --strictPort",
    url: "http://127.0.0.1:3011",
    reuseExistingServer: false,
    env: { VITE_USE_MOCK: "true", VITE_API_BASE_URL: "" },
  },
  reporter: "list",
});
