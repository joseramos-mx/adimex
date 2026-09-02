"use client"

import { useEffect, useRef } from "react"
import {
  trackMetaEvent,
  toMetaContentId,
  computeMetaValue,
  newEventId,
} from "@/lib/meta-pixel"
import { useCookieConsent } from "@/context/cookie-consent-context"

/**
 * Dispara `ViewContent` de Meta Pixel al cargar la ficha de producto.
 *
 * Timing crítico: el script del pixel se inyecta sólo después de que
 * el usuario acepta consent.marketing. Si disparamos el evento en el
 * primer useEffect sin más, `window.fbq` no existe todavía y el evento
 * se pierde.
 *
 * Solución: watch consent.marketing + retry corto hasta que `fbq` se
 * define. Usa `didFire` ref para no duplicar entre remontajes.
 */
export default function ViewContentTracker({
  contentId,
  contentName,
  price,
  currency = "MXN",
}: {
  contentId: string
  contentName: string
  price?: string | number
  currency?: string
}) {
  const { consent } = useCookieConsent()
  const didFire = useRef(false)

  useEffect(() => {
    if (!consent?.marketing || didFire.current) return

    const value =
      price !== undefined ? computeMetaValue(price, currency) : undefined

    // El init del pixel es async — reintenta hasta ~2s hasta que fbq
    // esté listo (o hasta que aparezca en el queue temprano).
    let tries = 0
    const maxTries = 20
    const interval = setInterval(() => {
      tries++
      if (typeof window.fbq === "function") {
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
        didFire.current = true
        clearInterval(interval)
      } else if (tries >= maxTries) {
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [consent?.marketing, contentId, contentName, price, currency])

  return null
}
