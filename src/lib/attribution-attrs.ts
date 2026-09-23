// Recolecta los atributos de atribución que se atan al carrito de Shopify
// (round-4 p3). Estos llegan al webhook orders/create como `note_attributes`
// y alimentan `user_data` de la Conversions API para dedup y matching.
//
// Consent-first: los identificadores de retargeting (_fbp, _fbc, user_agent)
// SÓLO se incluyen si el usuario aceptó marketing. Los UTM son análisis
// de referral y se pasan siempre (no son PII).

import { readUtms } from "./utm"

export type CartAttribute = { key: string; value: string }

const ATTR_PREFIX = "meta_"

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const row = document.cookie
    .split("; ")
    .find((r) => r.startsWith(`${name}=`))
  return row ? decodeURIComponent(row.slice(name.length + 1)) : undefined
}

/**
 * Devuelve los atributos que el cliente conoce y puede pasar al carrito.
 * El server añade `client_ip_address` después si hay consent.
 */
export function gatherAttributionAttrs(marketingConsent: boolean): CartAttribute[] {
  const attrs: CartAttribute[] = []

  // UTMs — no PII, siempre se guardan si existen.
  const utms = readUtms()
  if (utms) {
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const) {
      const v = utms[k]
      if (v) attrs.push({ key: k, value: v })
    }
    if (utms.landing_url) {
      attrs.push({ key: "landing_url", value: utms.landing_url })
    }
  }

  // Datos de matching de Meta — sólo con consent.marketing.
  if (marketingConsent) {
    const fbp = readCookie("_fbp")
    if (fbp) attrs.push({ key: `${ATTR_PREFIX}fbp`, value: fbp })
    const fbc = readCookie("_fbc")
    if (fbc) attrs.push({ key: `${ATTR_PREFIX}fbc`, value: fbc })
    if (typeof navigator !== "undefined" && navigator.userAgent) {
      // Cortamos a 500 chars por límite Shopify (queda margen de sobra).
      attrs.push({
        key: `${ATTR_PREFIX}user_agent`,
        value: navigator.userAgent.slice(0, 500),
      })
    }
  }

  return attrs
}

/** Prefijo usado para leer los atributos en el webhook. */
export const META_ATTR_PREFIX = ATTR_PREFIX

/**
 * Whitelist de keys permitidas como cart attribute. Todo lo que no esté acá
 * se descarta antes de mandar la mutation. Evita que un actor externo
 * inyecte campos arbitrarios que después aparecen como note_attributes
 * del pedido.
 */
export const ALLOWED_CART_ATTR_KEYS = new Set<string>([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "landing_url",
  `${ATTR_PREFIX}fbp`,
  `${ATTR_PREFIX}fbc`,
  `${ATTR_PREFIX}user_agent`,
  `${ATTR_PREFIX}client_ip_address`,
  `${ATTR_PREFIX}consent`,
])

/** Keys que sólo pueden persistirse con consent.marketing = true. */
export const MARKETING_ONLY_ATTR_KEYS = new Set<string>([
  `${ATTR_PREFIX}fbp`,
  `${ATTR_PREFIX}fbc`,
  `${ATTR_PREFIX}user_agent`,
  `${ATTR_PREFIX}client_ip_address`,
])

/**
 * Sanea una lista {key,value} contra la whitelist y el consent actual.
 * Corta length a 500 chars (límite Shopify) y drop campos vacíos.
 */
export function sanitizeCartAttrs(
  raw: unknown,
  marketing: boolean,
): CartAttribute[] {
  if (!Array.isArray(raw)) return []
  const out: CartAttribute[] = []
  for (const a of raw) {
    if (!a || typeof a !== "object") continue
    const key = String((a as { key?: unknown }).key ?? "").trim()
    const value = String((a as { value?: unknown }).value ?? "").slice(0, 500)
    if (!key || !value) continue
    if (!ALLOWED_CART_ATTR_KEYS.has(key)) continue
    if (!marketing && MARKETING_ONLY_ATTR_KEYS.has(key)) continue
    out.push({ key, value })
  }
  return out
}

/**
 * Merge de atributos preservando los existentes (los UTM originales de la
 * sesión no se pierden). Reglas:
 *   - Cualquier key no presente en `incoming` se conserva de `existing`.
 *   - Cualquier key en `incoming` sobrescribe la vieja (fresh > stale).
 *   - Devuelve un array estable (útil para tests).
 */
export function mergeCartAttrs(
  existing: CartAttribute[],
  incoming: CartAttribute[],
): CartAttribute[] {
  const map = new Map<string, string>()
  for (const a of existing) map.set(a.key, a.value)
  for (const a of incoming) map.set(a.key, a.value)
  return [...map.entries()]
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => a.key.localeCompare(b.key))
}
