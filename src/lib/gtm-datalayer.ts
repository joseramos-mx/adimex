// GA4 ecommerce events — dataLayer + gtag('event') paralelos (T08, updated).
//
// Contexto: GA4 se carga directamente vía gtag('config') en el sitio
// (ver src/components/google-analytics.tsx). GTM está cargado también, pero
// no controlamos su contenedor (GTM-MSLKT9D9 es del cliente), y no hay
// etiquetas de GA4 configuradas ahí que consuman el dataLayer. Por eso los
// eventos ecommerce se enviaban al dataLayer pero nunca llegaban a GA4.
//
// Fix: cada evento se dispara por AMBOS canales:
//   1. window.dataLayer.push(...) — para que si algún día alguien crea
//      etiquetas GA4 en GTM, sigan funcionando sin cambios acá.
//   2. window.gtag('event', ...) — llega directo a GA4 vía la instancia
//      cargada por google-analytics.tsx.
//
// TODO(post-GTM): si algún día se agregan etiquetas GA4 en GTM que emitan
// estos mismos eventos, hay que **quitar la llamada a gtag('event')** o los
// eventos van a llegar duplicados a GA4. Documentado en README.md sección
// "Analítica".

import { shouldLoadAnalytics } from "./consent-mode"

type GtagFn = (
  command: "event" | "config" | "js" | "consent" | "set",
  eventNameOrConfigId: string,
  params?: Record<string, unknown>,
) => void

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: GtagFn
  }
}

export type GaItem = {
  item_id: string
  item_name: string
  price: number
  quantity: number
  item_category?: string
  item_brand?: string
}

type EcomEvent = "view_item" | "add_to_cart" | "begin_checkout"

type EcomData = { currency: string; value: number; items: GaItem[] }

export function pushEcommerceEvent(
  event: EcomEvent,
  data: EcomData,
  analyticsConsent: boolean,
): void {
  if (typeof window === "undefined") return
  if (!shouldLoadAnalytics(analyticsConsent)) return

  // Canal 1 — dataLayer (para etiquetas GTM futuras).
  window.dataLayer = window.dataLayer || []
  // Buena práctica GA4: limpiar ecommerce antes de reasignar.
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({ event, ecommerce: data })

  // Canal 2 — gtag directo a GA4.
  // begin_checkout usa transport_type='beacon' para que la petición
  // sobreviva la redirección a shop.adimex.io — sin beacon, muchos
  // navegadores cancelan requests en vuelo cuando cambia el location.
  if (typeof window.gtag === "function") {
    const params: Record<string, unknown> = {
      currency: data.currency,
      value: data.value,
      items: data.items,
    }
    if (event === "begin_checkout") {
      params.transport_type = "beacon"
    }
    window.gtag("event", event, params)
  }
}

/**
 * generate_lead — Contact GA4 event para clicks de WhatsApp.
 * Se llama desde WhatsAppEnhancer en paralelo al Contact de Meta pixel.
 * `ref` va con el utm_content de la sesión (útil para atribuir el lead
 * al creativo que lo trajo).
 *
 * Sin dataLayer.push porque no hay caso de uso GTM para este evento hoy;
 * si mañana se necesita, se añade acá y se documenta el toggle.
 */
export function pushGenerateLead(
  params: { ref?: string; surface: string },
  analyticsConsent: boolean,
): void {
  if (typeof window === "undefined") return
  if (!shouldLoadAnalytics(analyticsConsent)) return
  if (typeof window.gtag !== "function") return

  window.gtag("event", "generate_lead", {
    ...(params.ref ? { ref: params.ref } : {}),
    method: "whatsapp",
    surface: params.surface,
  })
}
