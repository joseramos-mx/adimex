"use client"

import { useEffect } from "react"
import { captureUtmsFromLocation, appendUtmRefToWaHref } from "@/lib/utm"
import { captureFbclidFromLocation } from "@/lib/fbclid"
import { trackMetaEvent, newEventId } from "@/lib/meta-pixel"

/**
 * WhatsApp Enhancer (T07)
 *
 * 1. Captura los UTM al primer aterrizaje de la sesión.
 * 2. Intercepta clicks sobre cualquier `<a href="https://wa.me/...">`:
 *    - Reescribe el href para añadir `[Ref: <utm_content>]` al mensaje.
 *    - Dispara `Contact` de Meta si no hay ya un tracking manual
 *      (marcado con `data-wa-manual`).
 *
 * No requiere reescribir cada link individualmente.
 */
export default function WhatsAppEnhancer() {
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

      // Fire Contact — salvo que el link marque tracking manual
      if (!anchor.dataset.waManual) {
        try {
          trackMetaEvent(
            "Contact",
            {
              channel: "whatsapp",
              surface: anchor.dataset.waSurface ?? "unknown",
            },
            { eventID: newEventId("contact") },
          )
        } catch {
          // silencioso
        }
      }
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  return null
}
