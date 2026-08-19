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
