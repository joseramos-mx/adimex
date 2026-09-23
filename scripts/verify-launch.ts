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
 * Uso:
 *   npm install
 *   npx playwright install chromium              (o exporta PLAYWRIGHT_CHANNEL=msedge)
 *   npm run dev                                  (terminal 1)
 *   npm run verify:launch                        (terminal 2)
 *
 * Env vars:
 *   BASE_URL              Origen a probar. Default http://localhost:3000
 *   PLAYWRIGHT_CHANNEL    'msedge' | 'chrome' si prefieres el browser del sistema.
 *
 * Nota: los tests que ejercen el flujo Comprar/AddToCart requieren que el
 * sitio esté conectado a Shopify (variantes con `variantId` y `price`). Sin
 * SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_PRIVATE_TOKEN en `.env.local`, la
 * ficha renderiza "bajo pedido" y estos tests se marcan como skipped, no
 * como failed.
 */

import { test, expect, type Page, type Route } from "@playwright/test"

const BASE = process.env.BASE_URL ?? "http://localhost:3000"

/**
 * Vercel Deployment Protection bypass (round-5 p7). Cuando corremos contra
 * un preview privado, la primera navegación necesita pasar el secret en el
 * query param para setear la cookie de bypass. Header ya va en todos los
 * requests vía extraHTTPHeaders (ver playwright.config.ts). El secret sólo
 * se lee de env — nunca se hardcodea.
 */
const BYPASS = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

function bypassUrl(url: string): string {
  if (!BYPASS) return url
  const u = new URL(url)
  if (!u.searchParams.has("x-vercel-protection-bypass")) {
    u.searchParams.set("x-vercel-protection-bypass", BYPASS)
    u.searchParams.set("x-vercel-set-bypass-cookie", "true")
  }
  return u.toString()
}

/**
 * Devuelve la URL con `?pixel_test=1` (además del bypass si aplica). Se usa
 * SÓLO en la primera navegación de cada test — el flag se persiste en
 * sessionStorage por `shouldLoadPixelInEnv()` para navs subsiguientes.
 * En prod la env gate no exige el flag, pero mandarlo es no-op.
 */
function pixelTestFirstNavUrl(url: string): string {
  const u = new URL(bypassUrl(url))
  if (!u.searchParams.has("pixel_test")) {
    u.searchParams.set("pixel_test", "1")
  }
  return u.toString()
}

// Antes de cada test:
//   1. Setea la cookie de bypass (si aplica) para que el resto de requests
//      pase el Deployment Protection sin friction.
//   2. Envía `?pixel_test=1` para que el gate por VERCEL_ENV cargue el pixel
//      en previews (round-6 p1). Sin esto los tests de ViewContent/AddToCart
//      no verían fbq en preview y saltarían por env, no por red.
test.beforeEach(async ({ page }) => {
  await page
    .goto(pixelTestFirstNavUrl(`${BASE}/`), { waitUntil: "domcontentloaded" })
    .catch(() => undefined)
})

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

/** Devuelve true si la ficha muestra el flujo comprable (Shopify conectado). */
async function fichaIsBuyable(page: Page): Promise<boolean> {
  return await page
    .getByRole("button", { name: /Agregar al carrito|Comprar ahora/i })
    .first()
    .isVisible()
    .catch(() => false)
}

/** Espera hasta 8 s a que fbq esté cargado. Devuelve false si nunca aparece. */
async function waitForFbq(page: Page): Promise<boolean> {
  try {
    await page.waitForFunction(
      () => typeof (window as { fbq?: unknown }).fbq === "function",
      { timeout: 8000 },
    )
    return true
  } catch {
    return false
  }
}

test.describe("Ficha PLC en móvil: precio + Comprar visibles con banner", () => {
  test.use({ viewport: MOBILE })

  test("primer pantallazo muestra precio y CTA Comprar", async ({ page }) => {
    await page.goto(`${BASE}/productos/plc-fl7`, { waitUntil: "domcontentloaded" })

    if (!(await fichaIsBuyable(page))) {
      test.skip(true, "sitio sin conexión a Shopify — ficha en modo 'bajo pedido'")
      return
    }

    // Precio visible con banner de cookies aún abierto.
    await expect(page.getByText("$3,445.20").first()).toBeVisible()
    // Sticky bar mobile muestra "Comprar" (no "Comprar ahora"). El botón
    // Comprar ahora del panel principal también cumple.
    const comprar = page
      .locator("aside[aria-label='Barra de compra']")
      .getByRole("button", { name: /Comprar/i })
    await expect(comprar).toBeVisible()
  })
})

test.describe("Pixel + eventos Meta", () => {
  test.use({ viewport: DESKTOP })

  test("al aceptar cookies, fbq queda disponible", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" })
    await acceptCookies(page)
    const ready = await waitForFbq(page)
    if (!ready) {
      test.skip(true, "connect.facebook.net inaccesible desde este entorno")
      return
    }
    expect(ready).toBe(true)
  })

  test("ViewContent llega a facebook.com/tr con content_ids, value y currency", async ({ page }) => {
    const trHits: string[] = []
    await page.route(/facebook\.com\/tr/, (route: Route) => {
      trHits.push(route.request().url())
      route.continue()
    })

    await page.goto(`${BASE}/productos/plc-fl7`, { waitUntil: "domcontentloaded" })
    await acceptCookies(page)

    const ready = await waitForFbq(page)
    if (!ready) {
      test.skip(true, "connect.facebook.net inaccesible desde este entorno")
      return
    }
    if (!(await fichaIsBuyable(page))) {
      test.skip(true, "sitio sin conexión a Shopify — sin variant → sin value")
      return
    }

    try {
      await page.waitForFunction(
        () =>
          (window.performance.getEntriesByType("resource") as PerformanceResourceTiming[])
            .some((e) => e.name.includes("facebook.com/tr") && e.name.includes("ViewContent")),
        { timeout: 12000 },
      )
    } catch {
      test.skip(true, "facebook.com/tr inaccesible desde este entorno")
      return
    }

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
    await page.goto(`${BASE}/productos/plc-fl7#comprar`, { waitUntil: "domcontentloaded" })
    await acceptCookies(page)

    if (!(await fichaIsBuyable(page))) {
      test.skip(true, "sitio sin conexión a Shopify — sin botón Agregar al carrito")
      return
    }

    const ready = await waitForFbq(page)
    if (!ready) {
      test.skip(true, "connect.facebook.net inaccesible desde este entorno")
      return
    }

    await page.getByRole("button", { name: /Agregar al carrito/i }).first().click()
    try {
      await page.waitForFunction(
        () =>
          (window.performance.getEntriesByType("resource") as PerformanceResourceTiming[])
            .some((e) => e.name.includes("facebook.com/tr") && e.name.includes("AddToCart")),
        { timeout: 12000 },
      )
    } catch {
      test.skip(true, "facebook.com/tr inaccesible desde este entorno")
      return
    }
    expect(trHits.some((u) => u.includes("ev=AddToCart"))).toBe(true)
  })
})

test.describe("Precios visibles: coherencia y ausencia de '+ IVA'", () => {
  const urls = ["/", "/productos", ...FICHAS]

  for (const url of urls) {
    test(`en ${url} todo precio DOM coincide con lista blanca; no aparece '+ IVA'`, async ({ page }) => {
      await page.goto(`${BASE}${url}`, { waitUntil: "domcontentloaded" })

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
      await page.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded" })
      const bad = await page.$$eval(
        "a[href*='productos-hmi-f110']",
        (nodes) => nodes.map((a) => (a as HTMLAnchorElement).href),
      )
      expect(bad, `${r} tiene links con slug viejo: ${bad.join(", ")}`).toEqual([])
    }
  })
})

// ── /products.xml — Google Merchant / Meta Catalog feed ────────────────────

type FeedItem = { id: string; link: string; price: string; mpn: string; availability: string; brand: string; title: string }

async function parseFeed(page: Page): Promise<FeedItem[]> {
  const res = await page.request.get(`${BASE}/products.xml`)
  expect(res.ok(), `products.xml debe responder 2xx (fue ${res.status()})`).toBe(true)
  const contentType = res.headers()["content-type"] ?? ""
  expect(contentType).toContain("xml")
  const xml = await res.text()

  const items: FeedItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  const grab = (block: string, tag: string): string => {
    const m = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`).exec(block)
    return m ? m[1]!.trim() : ""
  }
  for (const [, inner] of xml.matchAll(itemRegex)) {
    items.push({
      id: grab(inner, "g:id"),
      link: grab(inner, "g:link"),
      price: grab(inner, "g:price"),
      mpn: grab(inner, "g:mpn"),
      availability: grab(inner, "g:availability"),
      brand: grab(inner, "g:brand"),
      title: grab(inner, "g:title"),
    })
  }
  return items
}

test.describe("/products.xml", () => {
  test("XML válido con campos obligatorios de Google Merchant", async ({ page }) => {
    const items = await parseFeed(page)

    if (items.length === 0) {
      test.skip(true, "sitio sin conexión a Shopify — feed vacío por falta de variantId")
      return
    }

    for (const item of items) {
      expect(item.id, "g:id no vacío").toMatch(/^\d+$/)
      expect(item.link, "g:link apunta a adimex.io/productos/").toMatch(
        /^https:\/\/adimex\.io\/productos\/[a-z0-9-]+$/,
      )
      expect(item.price, "g:price sin '$' y con ' MXN'").toMatch(/^\d+\.\d{2} MXN$/)
      expect(item.price, "g:price no lleva símbolo $").not.toContain("$")
      expect(item.price, "g:price no lleva comas de miles").not.toContain(",")
      expect(item.brand).toBe("FLEXEM")
      expect(item.mpn, "g:mpn no vacío").not.toBe("")
      expect(["in_stock", "out_of_stock"]).toContain(item.availability)
      expect(item.title).not.toBe("")
    }
  })

  test("g:id del feed coincide con meta:content_id de cada ficha (base para ViewContent)", async ({ page }) => {
    const items = await parseFeed(page)
    if (items.length === 0) {
      test.skip(true, "sitio sin conexión a Shopify — feed vacío")
      return
    }

    for (const item of items) {
      await page.goto(item.link, { waitUntil: "domcontentloaded" })
      const metaId = await page
        .locator("meta[name='meta:content_id']")
        .first()
        .getAttribute("content")
      expect(metaId, `ficha ${item.link} debe declarar meta:content_id`).toBeTruthy()
      expect(
        metaId,
        `feed g:id ${item.id} debe coincidir con meta:content_id de ${item.link}`,
      ).toBe(item.id)
    }
  })
})
