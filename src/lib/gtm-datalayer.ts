// GA4 ecommerce dataLayer (T08).
//
// Empuja eventos con el schema estándar de GA4 para que GTM los mapee
// a etiquetas de Google Ads y GA4. Respeta el mismo criterio de consent
// que el pixel (analytics).

import { shouldLoadAnalytics } from "./consent-mode"

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
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

export function pushEcommerceEvent(
  event: EcomEvent,
  data: { currency: string; value: number; items: GaItem[] },
  analyticsConsent: boolean,
): void {
  if (typeof window === "undefined") return
  if (!shouldLoadAnalytics(analyticsConsent)) return

  window.dataLayer = window.dataLayer || []
  // Buena práctica GA4: limpiar ecommerce antes de reasignar.
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event,
    ecommerce: data,
  })
}
