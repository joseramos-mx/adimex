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
