import { defineConfig, devices } from "@playwright/test"

/**
 * Config Playwright para el verificador de lanzamiento (T12).
 *
 * Corre con Chromium en desktop + Chrome Mobile (Pixel 5 = 375×812).
 * No arranca el server automáticamente: se espera `npm run dev` en otra
 * terminal para no confundir el output en CI/local.
 *
 * Vercel Deployment Protection (round-5 p7): si el preview está detrás de
 * SSO, exporta VERCEL_AUTOMATION_BYPASS_SECRET (el que genera Vercel en
 * Settings → Deployment Protection). Playwright lo manda como header
 * `x-vercel-protection-bypass` en cada request y, opcionalmente, como
 * query param en la primera navegación para setear la cookie de bypass.
 * NUNCA se escribe al repo — sólo se lee de env var.
 */

const BYPASS = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

export default defineConfig({
  testDir: "./scripts",
  // Incluye el e2e principal (verify-launch) y todos los unit tests con
  // sufijo `.test.ts` (round-5 p6).
  testMatch: [/verify-launch\.ts$/, /unit-.*\.test\.ts$/],
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    ...(BYPASS
      ? {
          extraHTTPHeaders: {
            "x-vercel-protection-bypass": BYPASS,
            "x-vercel-set-bypass-cookie": "true",
          },
        }
      : {}),
  },
  // Preferimos el Chromium que descarga Playwright (`npx playwright install
  // chromium`). Si el sandbox local no puede descargarlo, exporta
  // PLAYWRIGHT_CHANNEL=msedge para usar el Edge del sistema.
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.PLAYWRIGHT_CHANNEL
          ? { channel: process.env.PLAYWRIGHT_CHANNEL }
          : {}),
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"],
        ...(process.env.PLAYWRIGHT_CHANNEL
          ? { channel: process.env.PLAYWRIGHT_CHANNEL }
          : {}),
      },
    },
  ],
})
