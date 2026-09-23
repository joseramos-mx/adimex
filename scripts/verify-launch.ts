/**
 * verify-launch.ts (T12)
 *
 * Suite Playwright que valida los invariantes que rompen la pauta:
 *   1. En 375×812 (móvil), la ficha muestra precio + botón Comprar sin necesidad
 *      de aceptar cookies primero.
 *   2. Al aceptar cookies, `window.fbq` queda disponible.
 *   3. La petición a facebook.com/tr al abrir la ficha lleva ViewContent con
 *      content_ids, value y currency.
 *   4. "Agregar al carrito" dispara AddToCart hacia facebook.com/tr.
 *   5. Home + /productos + 3 fichas no muestran ningún precio distinto de
 *      $3,445.20 / $7,308.00 / $9,103.47 ni el texto "+ IVA".
 *   6. Ningún link interno apunta a `productos-hmi-f110` (slug viejo).
 *
 * Uso local:
 *   npm install
 *   npx playwright install chromium
 *   npm run dev            (en otra terminal)
 *   npm run verify:launch
 *
 * Env vars:
 *   BASE_URL   Origen a probar. Default http://localhost:3000
 */

import { test, expect, type Page, type Route } from "@playwright/test"

const BASE = process.env.BASE_URL ?? "http://localhost:3000"

const EXPECTED_PRICES = ["$3,445.20", "$7,308.00", "$9,103.47"] as const

const FICHAS = ["/productos/plc-fl7", "/productos/hmi-f007n", "/productos/hmi-f110c"]

const MOBILE = { width: 375, height: 812 }
const DESKTOP = { width: 1440, height: 900 }

async function acceptCookies(page: Page): Promise<void> {
  const btn = page.getByRole("button", { name: /aceptar todo|^aceptar$/i }).first()
  await btn.waitFor({ state: "visible", timeout: 3000 }).catch(() => undefined)
  if (await btn.isVisible().catch(() => false)) {
    await btn.click()
  }
}

test.describe("Ficha PLC en móvil: precio + Comprar visibles con banner", () => {
  test.use({ viewport: MOBILE })

  test("primer pantallazo muestra precio y CTA Comprar", async ({ page }) => {
    await page.goto(`${BASE}/productos/plc-fl7`, { waitUntil: "networkidle" })

    // Precio visible con banner de cookies aún abierto.
    await expect(page.getByText("$3,445.20").first()).toBeVisible()
    await expect(page.getByRole("button", { name: /^Comprar$/ })).toBeVisible()
  })
})

test.describe("Pixel + eventos Meta", () => {
  test.use({ viewport: DESKTOP })

  test("al aceptar cookies, fbq queda disponible", async ({ page }) => {
    await page.goto(`${BASE}/`)
    await acceptCookies(page)
    await page.waitForFunction(() => typeof (window as { fbq?: unknown }).fbq === "function", {
      timeout: 5000,
    })
    const fbqIsFn = await page.evaluate(() => typeof (window as { fbq?: unknown }).fbq === "function")
    expect(fbqIsFn).toBe(true)
  })

  test("ViewContent llega a facebook.com/tr con content_ids, value y currency", async ({ page }) => {
    const trHits: string[] = []
    await page.route(/facebook\.com\/tr/, (route: Route) => {
      trHits.push(route.request().url())
      route.continue()
    })

    await page.goto(`${BASE}/productos/plc-fl7`)
    await acceptCookies(page)

    // Espera al menos una llamada al pixel con ViewContent.
    await page.waitForFunction(
      () =>
        (window.performance.getEntriesByType("resource") as PerformanceResourceTiming[])
          .some((e) => e.name.includes("facebook.com/tr") && e.name.includes("ViewContent")),
      { timeout: 8000 },
    )

    const vc = trHits.find((u) => u.includes("ev=ViewContent"))
    expect(vc, "esperaba una petición ViewContent").toBeTruthy()
    expect(vc!).toMatch(/cd\[content_ids\]/)
    expect(vc!).toMatch(/cd\[value\]/)
    expect(vc!).toMatch(/cd\[currency\]=MXN/)
  })

  test("Agregar al carrito dispara AddToCart", async ({ page }) => {
    const trHits: string[] = []
    await page.route(/facebook\.com\/tr/, (route: Route) => {
      trHits.push(route.request().url())
      route.continue()
    })
    await page.goto(`${BASE}/productos/plc-fl7#comprar`)
    await acceptCookies(page)
    await page.getByRole("button", { name: /Agregar al carrito/i }).click()
    await page.waitForFunction(
      () =>
        (window.performance.getEntriesByType("resource") as PerformanceResourceTiming[])
          .some((e) => e.name.includes("facebook.com/tr") && e.name.includes("AddToCart")),
      { timeout: 8000 },
    )
    expect(trHits.some((u) => u.includes("ev=AddToCart"))).toBe(true)
  })
})

test.describe("Precios visibles: coherencia y ausencia de '+ IVA'", () => {
  const urls = ["/", "/productos", ...FICHAS]

  for (const url of urls) {
    test(`en ${url} todo precio DOM coincide con lista blanca; no aparece '+ IVA'`, async ({ page }) => {
      await page.goto(`${BASE}${url}`, { waitUntil: "networkidle" })

      const text = await page.evaluate(() => document.body.innerText)
      expect(text, `${url} no debe contener '+ IVA' visible al usuario`).not.toMatch(/\+ ?IVA/i)

      // Recolecta todos los precios visibles con formato $X,XXX.XX
      const priceRegex = /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})/g
      const found = new Set<string>()
      for (const m of text.matchAll(priceRegex)) found.add(m[0])

      // Cualquier precio encontrado debe estar en la lista esperada,
      // salvo que sea el subtotal del carrito ($0.00 por ejemplo).
      const violations = [...found].filter(
        (p) => !EXPECTED_PRICES.includes(p as (typeof EXPECTED_PRICES)[number]) && p !== "$0.00",
      )
      expect(violations, `precios inesperados en ${url}: ${violations.join(", ")}`).toEqual([])
    })
  }
})

test.describe("Slug F110C", () => {
  test("ningún link interno apunta a productos-hmi-f110", async ({ page }) => {
    const routes = ["/", "/productos", "/productos/hmi-f110c"]
    for (const r of routes) {
      await page.goto(`${BASE}${r}`)
      const bad = await page.$$eval(
        "a[href*='productos-hmi-f110']",
        (nodes) => nodes.map((a) => (a as HTMLAnchorElement).href),
      )
      expect(bad, `${r} tiene links con slug viejo: ${bad.join(", ")}`).toEqual([])
    }
  })
})
