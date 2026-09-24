"use client"

import { useEffect } from "react"
import { appendUtmRefToWaHref, captureUtmsFromLocation, getUtmContent } from "@/lib/utm"
import { captureFbclidFromLocation } from "@/lib/fbclid"
import { trackMetaEvent, newEventId } from "@/lib/meta-pixel"
import { pushGenerateLead } from "@/lib/gtm-datalayer"
import { useCookieConsent } from "@/context/cookie-consent-context"

/**
 * WhatsApp Enhancer (T07 + gtag round)
 *
 * 1. Captura los UTM al primer aterrizaje de la sesión.
 * 2. Intercepta clicks sobre cualquier `<a href="https://wa.me/...">`:
 *    - Reescribe el href para añadir `[Ref: <utm_content>]` al mensaje.
 *    - Dispara `Contact` de Meta (si no hay tracking manual `data-wa-manual`).
 *    - Dispara `generate_lead` en GA4 vía gtag con `ref=utm_content` — mismo
 *      gate que analytics. Ver TODO en `@/lib/gtm-datalayer.ts` sobre cuándo
 *      quitar el gtag directo (si GTM adopta la etiqueta).
 *
 * No requiere reescribir cada link individualmente.
 */
export default function WhatsAppEnhancer() {
  const { consent } = useCookieConsent()

  useEffect(() => {
    captureUtmsFromLocation()
    // fbclid llega en URL de Meta Ads; la cookie _fbc real la sintetizamos
    // sólo cuando el usuario acepte marketing (round-5 p2).
    captureFbclidFromLocation()

    function onClick(e: MouseEvent) {
      const target = e.target as Element | null
      if (!target) return
      const anchor = target.closest?.("a[href*='wa.me']") as HTMLAnchorElement | null
      if (!anchor) return

      // Añade Ref UTM (si aplica) sin bloquear la navegación
      const original = anchor.href
      const enhanced = appendUtmRefToWaHref(original)
      if (enhanced !== original) {
        anchor.href = enhanced
      }

      const surface = anchor.dataset.waSurface ?? "unknown"

      // Fire Contact — salvo que el link marque tracking manual
      if (!anchor.dataset.waManual) {
        try {
          trackMetaEvent(
            "Contact",
            {
              channel: "whatsapp",
              surface,
            },
            { eventID: newEventId("contact") },
          )
        } catch {
          // silencioso
        }
      }

      // generate_lead a GA4 vía gtag (analytics consent). Independiente del
      // Contact de Meta — GA4 y Meta miden objetivos distintos.
      try {
        pushGenerateLead(
          {
            ref: getUtmContent() ?? undefined,
            surface,
          },
          consent?.analytics ?? false,
        )
      } catch {
        // silencioso
      }
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [consent?.analytics])

  return null
}
