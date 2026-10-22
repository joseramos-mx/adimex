"use client"

import Script from "next/script"
import { useCookieConsent } from "@/context/cookie-consent-context"
import { GOOGLE_ADS_ID, GA_MEASUREMENT_ID } from "@/lib/analytics-ids"
import { shouldLoadAnalytics, shouldLoadMarketing } from "@/lib/consent-mode"

/**
 * Etiqueta de Google Ads (AW-) — conversiones y remarketing.
 *
 * Va bajo consentimiento de **marketing**, igual que `MetaPixel`, y no de
 * analítica: aunque comparta librería con GA4, su propósito es publicitario.
 * Un usuario puede aceptar analítica y rechazar marketing, así que las dos
 * etiquetas se activan por separado.
 *
 * `gtag.js` es la misma librería para GA4 y para Ads. Cuando `GoogleAnalytics`
 * ya la montó, aquí sólo se añade el `config` de la cuenta de Ads sobre el
 * mismo `dataLayer` en lugar de volver a descargarla. El bloque inline es
 * seguro en cualquier orden: define `dataLayer` y encola los comandos, que
 * la librería procesa al cargar.
 */
export default function GoogleAds() {
  const { consent } = useCookieConsent()

  if (!GOOGLE_ADS_ID) return null
  if (!shouldLoadMarketing(consent?.marketing ?? false)) return null

  const gtagYaCargado =
    Boolean(GA_MEASUREMENT_ID) &&
    shouldLoadAnalytics(consent?.analytics ?? false)

  return (
    <>
      {!gtagYaCargado && (
        <Script
          id="google-ads-src"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        />
      )}
      <Script id="google-ads-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
      </Script>
    </>
  )
}
