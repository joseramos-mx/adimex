import { defineConfig, devices } from "@playwright/test"

/**
 * Config Playwright para el verificador de lanzamiento (T12).
 *
 * Corre con Chromium en desktop + Chrome Mobile (Pixel 5 = 375×812).
 * No arranca el server automáticamente: se espera `npm run dev` en otra
 * terminal para no confundir el output en CI/local.
 */
export default defineConfig({
  testDir: "./scripts",
  testMatch: /verify-launch\.ts$/,
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] },
    },
  ],
})
