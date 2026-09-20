import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
    launchOptions: {
      executablePath: process.env.ACCOUNTING_BROWSER_PATH,
      args: process.env.ACCOUNTING_BROWSER_PATH
        ? ["--no-sandbox", "--disable-dev-shm-usage", "--no-zygote"]
        : [],
    },
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
  workers: 1,
});
