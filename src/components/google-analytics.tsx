"use client"

import Script from "next/script"
import { useCookieConsent } from "@/context/cookie-consent-context"
import { GA_MEASUREMENT_ID } from "@/lib/analytics-ids"

/**
 * Etiqueta de Google (gtag.js) para GA4. Igual que `GoogleTagManager` y
 * `GatedAnalytics`, sólo se carga tras el consentimiento de analítica.
 *
 * Las vistas de página en navegación cliente las cubre la medición mejorada
 * de GA4 ("cambios de página por eventos del historial"), no hace falta
 * disparar `page_view` a mano en cada cambio de ruta.
 */
export default function GoogleAnalytics() {
  const { consent } = useCookieConsent()

  if (!GA_MEASUREMENT_ID || !consent?.analytics) return null

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  )
}
