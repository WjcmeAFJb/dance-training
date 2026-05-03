import { defineConfig, devices } from "@playwright/test";

// Tests run against a `vite preview` of a fresh build with BASE=/ so the
// hash routes resolve cleanly under http://127.0.0.1:4173/.
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: /\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env["CI"],
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  outputDir: "test-results",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on",
    video: "on",
    screenshot: "only-on-failure",
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: undefined,
      },
    },
  ],
  webServer: {
    command: "pnpm build && pnpm exec vite preview --port 4173 --host 127.0.0.1 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env["CI"],
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      // Force base="/" for both build and preview, regardless of any
      // GITHUB_REPOSITORY env CI may inject.
      VITE_BASE: "/",
    },
  },
});
