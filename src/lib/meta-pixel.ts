/**
 * Utilidades para Meta Pixel + Conversions API (CAPI) — deduplicación
 * por event_id y advanced matching hasheado.
 *
 * Regla dorada: cada evento server-side debe llegar con el MISMO event_id
 * que su gemelo del navegador. Meta deduplica y evita contar dos veces.
 */

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "3413615145484207"

// Nota: hasta round-3 tuvimos un mapa hard-coded slug/SKU → content_id.
// Round-4 lo eliminó: el content_id ahora sale del variant ID numérico de
// Shopify (mismo pipeline en feed, pixel y webhook Purchase). El helper
// vive en `src/lib/shopify-id.ts`.

import { mxnWithIva, USD_MXN_RATE } from "./pricing"

/**
 * Convierte el precio base de Shopify a la cantidad que Meta espera en `value`:
 * IVA-inclusiva y en MXN. Reutiliza la función única de precio (pricing.ts).
 *
 * Regla:
 *   MXN base sin IVA  → × 1.16 → value MXN con IVA
 *   USD               → × exchange → aproximación MXN con IVA
 */
export function computeMetaValue(price: string | number, currency: string): number {
  const raw = typeof price === "string" ? parseFloat(price) : price
  const c = currency.toUpperCase()
  if (c === "MXN") return Number(mxnWithIva(raw).toFixed(2))
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
 *
 * Si se pasa `options.eventID`, refleja el evento server-side (CAPI) con
 * el mismo `event_id` para deduplicación (T06). La compra `Purchase`
 * queda excluida — se manda desde el webhook de Shopify, no del cliente.
 */
export function trackMetaEvent(
  event: MetaEvent,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
): void {
  if (typeof window === "undefined") return
  const fbq = window.fbq
  if (fbq) fbq("track", event, params, options)

  if (options?.eventID && event !== "Purchase") {
    mirrorEventToCapi(event, params, options.eventID)
  }
}

/**
 * POST silencioso al endpoint CAPI del sitio. Usa `keepalive` para que el
 * request sobreviva si el usuario navega inmediatamente (típico de
 * InitiateCheckout que redirige a Shopify).
 */
function mirrorEventToCapi(
  event: string,
  params: Record<string, unknown> | undefined,
  eventID: string,
): void {
  try {
    const body = JSON.stringify({
      event_name: event,
      event_id: eventID,
      event_source_url: window.location.href,
      custom_data: params,
    })
    void fetch("/api/meta-capi/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // silencioso — analytics no puede tumbar la UX
    })
  } catch {
    // silencioso
  }
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
