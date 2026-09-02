"use client"

import { useEffect } from "react"
import {
  trackMetaEvent,
  toMetaContentId,
  computeMetaValue,
  newEventId,
} from "@/lib/meta-pixel"

/**
 * Dispara `ViewContent` de Meta Pixel al montar la ficha de producto.
 *
 * - Convierte slug interno al content_id numérico del catálogo de Meta.
 * - Convierte el precio base de Shopify a MXN con IVA (Meta lo exige así
 *   para calcular ROAS real).
 * - Genera event_id único para deduplicar server-side vía Conversions API.
 */
export default function ViewContentTracker({
  contentId,
  contentName,
  price,
  currency = "MXN",
}: {
  /** Slug interno o SKU — el helper lo mapea al ID numérico de Meta. */
  contentId: string
  contentName: string
  /** Precio base de Shopify (sin IVA). Se convierte a IVA-incluida antes de mandar. */
  price?: string | number
  currency?: string
}) {
  useEffect(() => {
    const value = price !== undefined ? computeMetaValue(price, currency) : undefined
    trackMetaEvent(
      "ViewContent",
      {
        content_ids: [toMetaContentId(contentId)],
        content_type: "product",
        content_name: contentName,
        ...(value !== undefined ? { value, currency: "MXN" } : {}),
      },
      { eventID: newEventId("vc") },
    )
  }, [contentId, contentName, price, currency])

  return null
}
