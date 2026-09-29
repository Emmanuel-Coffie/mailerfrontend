import { defineConfig } from "@playwright/test";
import { randomBytes } from "node:crypto";
import path from "node:path";
process.env.E2E_PASSWORD ||= randomBytes(24).toString("base64url");
process.env.E2E_WEBHOOK_SECRET ||=
  "whsec_" + randomBytes(32).toString("base64");
const python =
  process.env.E2E_PYTHON ||
  path.resolve(
    "..",
    ".venv",
    process.platform === "win32" ? "Scripts/python.exe" : "bin/python",
  );
export default defineConfig({
  testDir: "./e2e",
  timeout: 90000,
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    viewport: { width: 1440, height: 1000 },
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: `"${python}" e2e/server.py`,
      url: "http://127.0.0.1:8018/admin/login/",
      timeout: 60000,
      reuseExistingServer: false,
    },
    {
      command:
        process.env.E2E_PREVIEW === "1"
          ? "npm run build && npm run preview -- --host localhost --port 5173 --strictPort"
          : "npm run dev -- --host localhost",
      url: "http://localhost:5173",
      env: { VITE_API_BASE_URL: "http://127.0.0.1:8018" },
      timeout: 120000,
      reuseExistingServer: false,
    },
  ],
  reporter: "list",
});
