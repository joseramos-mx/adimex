/**
 * Utilidades para Meta Pixel + Conversions API (CAPI) — deduplicación
 * por event_id y advanced matching hasheado.
 *
 * Regla dorada: cada evento server-side debe llegar con el MISMO event_id
 * que su gemelo del navegador. Meta deduplica y evita contar dos veces.
 */

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "3413615145484207"

/**
 * Mapa producto → content_id del catálogo de Meta.
 *
 * Los IDs numéricos los asigna Meta al importar el catálogo desde Shopify
 * (Sales Channels → Facebook → Product Catalog). Sin este mapeo, los eventos
 * llegan pero el retargeting dinámico (DPA / Advantage+ Catalog) no puede
 * encontrar los productos vistos y no puede armar audiencias de "vieron X".
 *
 * Aceptamos tanto el `slug` de nuestro sitio como el `sku` de Shopify —
 * el navegador manda el slug, el webhook orders/create de Shopify manda
 * el SKU. Ambos apuntan al mismo Meta ID.
 *
 * Actualiza este mapa cuando agregues productos al catálogo de Meta.
 */
const META_CONTENT_IDS: Record<string, string> = {
  // Por slug interno del sitio
  "plc-fl7": "43162651590865",
  "hmi-f007n": "43162684260561",
  "productos-hmi-f110": "43103064195281",

  // Por SKU de Shopify (misma correspondencia)
  "FL721-0808P-D": "43162651590865",
  "F007N": "43162684260561",
  "F110C": "43103064195281",
}

/**
 * Convierte un slug o SKU al content_id del catálogo de Meta.
 * Si no está mapeado, devuelve el input tal cual — el evento sigue llegando
 * pero DPA no podrá relacionarlo con un producto del catálogo.
 */
export function toMetaContentId(slugOrSku: string): string {
  return META_CONTENT_IDS[slugOrSku] ?? slugOrSku
}

/** Versión array — útil para el cart drawer que loopea items. */
export function toMetaContentIds(slugsOrSkus: string[]): string[] {
  return slugsOrSkus.map(toMetaContentId)
}

/**
 * IVA aplicado a los precios base de Shopify (que se almacenan sin impuesto).
 * Coincide con `IVA_RATE` de region-context — duplicado acá para no arrastrar
 * la dependencia del context en pipeline server-side.
 */
const IVA_RATE = Number(process.env.NEXT_PUBLIC_IVA_RATE) || 0.16
const USD_MXN_RATE = Number(process.env.NEXT_PUBLIC_USD_MXN_RATE) || 18

/**
 * Convierte el precio base de Shopify a la cantidad que Meta espera en `value`:
 * IVA-inclusiva y en MXN. Aplica el mismo cálculo que ve el usuario en la
 * ficha (sin dupliar el 16% cuando el precio ya venga con impuesto).
 *
 * Regla:
 *   MXN base sin IVA  → × 1.16 → value MXN con IVA
 *   USD               → × exchange → aproximación MXN con IVA
 */
export function computeMetaValue(price: string | number, currency: string): number {
  const raw = typeof price === "string" ? parseFloat(price) : price
  const c = currency.toUpperCase()
  if (c === "MXN") return Number((raw * (1 + IVA_RATE)).toFixed(2))
  if (c === "USD") return Number((raw * USD_MXN_RATE).toFixed(2))
  return Number(raw.toFixed(2))
}

/**
 * Nombres de eventos estándar de Meta que usamos en el sitio.
 * Purchase se dispara desde Shopify (integración nativa) o desde CAPI.
 */
export type MetaEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Search"
  | "Contact"

type FbqFn = (
  method: "track" | "trackCustom" | "init" | "consent",
  eventOrValue: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
) => void

declare global {
  interface Window {
    fbq?: FbqFn
    _fbq?: FbqFn
  }
}

/**
 * Genera un event_id único usable como llave de deduplicación entre
 * navegador y CAPI. Usa crypto.randomUUID cuando existe; cae a Math.random
 * en navegadores viejos.
 */
export function newEventId(prefix: string = "e"): string {
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return `${prefix}_${uuid}`
}

/**
 * Track seguro: no-op si `fbq` aún no está cargado (consentimiento denegado
 * o carga diferida). Nunca revienta el render.
 */
export function trackMetaEvent(
  event: MetaEvent,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
): void {
  if (typeof window === "undefined") return
  const fbq = window.fbq
  if (!fbq) return
  fbq("track", event, params, options)
}

/**
 * Hash SHA-256 hexadecimal para advanced matching (email, teléfono, nombre,
 * ciudad, código postal). Meta requiere lowercase + trim antes de hashear.
 * Sólo se usa server-side (en la API route de CAPI). No exponemos hashing
 * en el cliente para no cargar el crypto polyfill sin necesidad.
 */
export async function hashSha256(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase()
  const encoded = new TextEncoder().encode(normalized)
  const digest = await crypto.subtle.digest("SHA-256", encoded)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
